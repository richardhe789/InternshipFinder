import logging
import time
from datetime import datetime

import requests
from requests_ratelimiter import LimiterSession


logger = logging.getLogger(__name__)


SIMPLIFY_API_URL = "https://js-ha.simplify.jobs/multi_search"
SIMPLIFY_API_KEY = "sUjQlkfBFnglUFcsFsZVcE7xhI8lJ1RG"

session = LimiterSession(per_second=1)


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


async def scrape_simplifyjobs_internships():
    internships = []
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "text/plain",
        "Origin": "https://simplify.jobs",
        "Referer": "https://simplify.jobs/",
    }

    page = 1
    per_page = 25
    cutoff_unix_time = int(time.time()) - (21 * 24 * 60 * 60)

    while True:
        payload = {
            "searches": [
                {
                    "collection": "jobs",
                    "facet_by": "countries,degrees,experience_level,functions,locations",
                    "filter_by": "experience_level:=[`Internship`] && countries:=[`United States`]",
                    "highlight_full_fields": "title,company_name,functions,locations",
                    "max_facet_values": 50,
                    "page": page,
                    "per_page": per_page,
                    "q": "Software Engineer",
                    "query_by": "title,company_name,functions,locations",
                    "sort_by": "_text_match:desc,posting_id:desc",
                }
            ]
        }

        try:
            response = session.post(
                SIMPLIFY_API_URL,
                headers=headers,
                params={"x-typesense-api-key": SIMPLIFY_API_KEY},
                json=payload,
                timeout=30,
            )
            response.raise_for_status()
            data = response.json()
        except requests.RequestException as exc:
            logger.error(f"SimplifyJobs API error: {exc}")
            break

        result = data["results"][0]
        hits = result.get("hits", [])
        total_found = result.get("found", 0)

        if not hits:
            break

        stale_count = 0
        for hit in hits:
            doc = hit.get("document", {})
            updated_date = doc.get("updated_date")
            if not isinstance(updated_date, int):
                continue
            if updated_date < cutoff_unix_time:
                stale_count += 1
                continue

            title = doc.get("title", "Internship Position")
            company = doc.get("company_name", "Unknown Company")
            job_id = doc.get("id", "unknown-id")
            job_title = title.replace(" ", "-").lower()
            simplify_url = f"https://simplify.jobs/p/{job_id}/{job_title}"
            locations = doc.get("locations") or ["Remote/Various"]

            internships.append(
                {
                    "company": company,
                    "role": title,
                    "location": locations[0],
                    "url": simplify_url,
                    "date_posted": datetime.now().strftime("%Y-%m-%d"),
                    "match_score": score_from_source("SIMPLIFYJOBS"),
                }
            )

        if stale_count >= len(hits) // 2:
            break
        if page * per_page >= total_found:
            break

        page += 1

    return internships


def parse_greenhouse_board(board_json: dict, company_name: str) -> list[dict]:
    internships = []
    for job in board_json.get("jobs", []):
        title = job.get("title") or ""
        if not role_is_internship(title):
            continue
        internships.append(
            {
                "company": company_name,
                "role": title,
                "location": normalize_location(job.get("location", {}).get("name", "")),
                "url": job.get("absolute_url", ""),
                "date_posted": datetime.now().strftime("%Y-%m-%d"),
                "match_score": score_from_source("ATS"),
            }
        )
    return internships


def parse_lever_board(board_json: list[dict], company_name: str) -> list[dict]:
    internships = []
    for job in board_json:
        title = job.get("text") or ""
        if not role_is_internship(title):
            continue
        internships.append(
            {
                "company": company_name,
                "role": title,
                "location": normalize_location(job.get("categories", {}).get("location", "")),
                "url": job.get("hostedUrl") or job.get("applyUrl") or "",
                "date_posted": datetime.now().strftime("%Y-%m-%d"),
                "match_score": score_from_source("ATS"),
            }
        )
    return internships


def fetch_greenhouse_jobs(board_url: str, company_name: str) -> list[dict]:
    try:
        response = requests.get(board_url, timeout=20)
        response.raise_for_status()
        return parse_greenhouse_board(response.json(), company_name)
    except requests.RequestException as exc:
        logger.error(f"Greenhouse fetch failed for {company_name}: {exc}")
        return []


def fetch_lever_jobs(board_url: str, company_name: str) -> list[dict]:
    try:
        response = requests.get(board_url, timeout=20)
        response.raise_for_status()
        return parse_lever_board(response.json(), company_name)
    except requests.RequestException as exc:
        logger.error(f"Lever fetch failed for {company_name}: {exc}")
        return []


def scrape_company_boards() -> list[dict]:
    sources = [
        {
            "company": "Microsoft",
            "type": "greenhouse",
            "url": "https://boards-api.greenhouse.io/v1/boards/microsoft/jobs",
        },
        {
            "company": "NVIDIA",
            "type": "greenhouse",
            "url": "https://boards-api.greenhouse.io/v1/boards/nvidia/jobs",
        },
        {
            "company": "Apple",
            "type": "greenhouse",
            "url": "https://boards-api.greenhouse.io/v1/boards/apple/jobs",
        },
        {
            "company": "Meta",
            "type": "lever",
            "url": "https://api.lever.co/v0/postings/meta?mode=json",
        },
        {
            "company": "Stripe",
            "type": "lever",
            "url": "https://api.lever.co/v0/postings/stripe?mode=json",
        },
    ]

    internships = []
    for source in sources:
        if source["type"] == "greenhouse":
            internships.extend(fetch_greenhouse_jobs(source["url"], source["company"]))
        elif source["type"] == "lever":
            internships.extend(fetch_lever_jobs(source["url"], source["company"]))
    return internships


async def scrape_all_sources():
    simplifyjobs = await scrape_simplifyjobs_internships()
    company_boards = scrape_company_boards()
    return simplifyjobs + company_boards