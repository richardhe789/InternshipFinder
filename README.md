# Internship Finder (Simplify-only)

This project is a full-stack internship dashboard focused entirely on **SimplifyJobs data**.

## What it does

- Scrapes internship listings from the SimplifyJobs GitHub README (via GitHub API)
- Stores listings in local SQLite (`internships.db`)
- Exposes FastAPI endpoints for listing jobs, running a scrape, and scoring matches
- Renders a Next.js dashboard with filters and resume-based scoring

## Requirements

- Python 3.8+
- Node.js + npm

## Local setup

### Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend/nextjs-app
npm install
npm run dev
```

Open `http://localhost:3000`.

## Notes

- `GITHUB_TOKEN` is optional but recommended to avoid GitHub API rate limits.
- On Vercel, SQLite is ephemeral (`/tmp`), so persistence is temporary unless replaced with hosted storage.
