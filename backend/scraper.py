import base64
import logging
import os
from datetime import datetime
from typing import Any, Dict, List

import requests
from bs4 import BeautifulSoup
from bs4.element import Tag


logger = logging.getLogger(__name__)


SIMPLIFY_GITHUB_API = (
    "https://api.github.com/repos/SimplifyJobs/Summer2026-Internships/contents/README.md"
)
SIMPLIFY_GITHUB_BRANCH = "dev"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")


def normalize_location(location_text: str) -> str:
    if not location_text:
        return "Remote/Various"
    return location_text.strip()


def role_is_internship(title: str) -> bool:
    if not title:
        return False
    title_lower = title.lower()
    return "intern" in title_lower or "internship" in title_lower


def score_from_source(source: str) -> float:
    return 90.0 if source == "ATS" else 95.0


def parse_simplify_markdown(markdown_text: str) -> List[Dict[str, Any]]:
    internships: List[Dict[str, Any]] = []
    table_start = markdown_text.find("TABLE_START")
    if table_start == -1:
        return internships

    html_section = markdown_text[table_start:]
    soup = BeautifulSoup(html_section, "html.parser")
    rows = soup.find_all("tr")

    for row in rows:
        cells = [cell for cell in row.find_all("td") if isinstance(cell, Tag)]
        if len(cells) < 4:
            continue

        company = cells[0].get_text(strip=True)
        role = cells[1].get_text(strip=True)
        location = cells[2].get_text(strip=True)
        application_cell = cells[3]

        link = application_cell.find("a", href=True)
        if not link or not isinstance(link, Tag):
            continue

        href = link.get("href")
        if not href:
            continue
        url = str(href)
        if not url.startswith("http"):
            continue

        internships.append(
            {
                "company": company or "Unknown Company",
                "role": role or "Internship Position",
                "location": location or "Remote/Various",
                "url": url,
                "date_posted": datetime.now().strftime("%Y-%m-%d"),
                "match_score": score_from_source("SIMPLIFYJOBS"),
            }
        )

    return internships


def fetch_simplify_from_github() -> List[Dict[str, Any]]:
    headers = {"Accept": "application/vnd.github+json"}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"

    try:
        response = requests.get(
            SIMPLIFY_GITHUB_API,
            headers=headers,
            params={"ref": SIMPLIFY_GITHUB_BRANCH},
            timeout=30,
        )
        response.raise_for_status()
        payload = response.json()
        content = payload.get("content")
        if not content:
            return []

        markdown_text = base64.b64decode(content).decode("utf-8", errors="ignore")
        return parse_simplify_markdown(markdown_text)
    except requests.RequestException as exc:
        logger.error(f"SimplifyJobs GitHub API fetch failed: {exc}")
        return []


async def scrape_all_sources() -> List[Dict[str, Any]]:
    return fetch_simplify_from_github()