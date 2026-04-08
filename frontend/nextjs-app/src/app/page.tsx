"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import FiltersPanel from "@/components/dashboard/FiltersPanel";
import JobsTable from "@/components/dashboard/JobsTable";
import ResumePanel from "@/components/dashboard/ResumePanel";
import ResumePreviewCard from "@/components/dashboard/ResumePreviewCard";
import StatusMessage from "@/components/dashboard/StatusMessage";
import type { Job, ResumePreview } from "@/types/jobs";

type ScoreResponse = {
  jobs: Job[];
  explanation: string;
};

type TabKey = "build" | "matches";

const API_BASE_URL = "";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabKey>("build");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [scoredJobs, setScoredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [scrapeStatus, setScrapeStatus] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [minScore, setMinScore] = useState(50);
  const [resultLimit, setResultLimit] = useState(15);
  const hasAutoScraped = useRef(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [scoreStatus, setScoreStatus] = useState<string | null>(null);
  const [scoreExplanation, setScoreExplanation] = useState<string | null>(null);
  const [hasScored, setHasScored] = useState(false);
  const [resumePreview, setResumePreview] = useState<ResumePreview | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewStatus, setPreviewStatus] = useState<string | null>(null);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (jobTitle) params.append("job_title", jobTitle);
    if (location) params.append("location", location);
    return params.toString();
  }, [jobTitle, location]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs?${queryParams}`);
      const data = await response.json();
      const withDefaultScores = (data as Job[]).map((job) => ({
        ...job,
        match_score: 0,
      }));
      const limitedDefaults = withDefaultScores.slice(0, resultLimit);
      if (resumeFile && hasScored && scoredJobs.length > 0) {
        setJobs(scoredJobs.filter((job) => job.match_score >= minScore));
      } else {
        setJobs(limitedDefaults);
        setScoredJobs(withDefaultScores);
        setHasScored(false);
        setScoreExplanation(null);
      }
    } catch (error) {
      console.error("Failed to load jobs", error);
    } finally {
      setLoading(false);
    }
  };

  const parseResume = async (fileOverride?: File | null) => {
    const activeFile = fileOverride ?? resumeFile;
    if (!activeFile) {
      setPreviewStatus("Please upload a resume first.");
      return;
    }

    setPreviewStatus("Parsing resume...");
    const formData = new FormData();
    formData.append("file", activeFile);

    try {
      const response = await fetch(`${API_BASE_URL}/api/resume/parse`, {
        method: "POST",
        body: formData,
      });
      const data: ResumePreview = await response.json();
      setResumePreview(data);
      setPreviewStatus("Resume parsed. Preview is ready when you open it.");
      setShowPreview(false);
      await scoreJobs(activeFile);
    } catch (error) {
      console.error("Failed to parse resume", error);
      setPreviewStatus("Failed to parse resume. Check backend logs.");
    }
  };

  const scoreJobs = async (fileOverride?: File | null) => {
    const activeFile = fileOverride ?? resumeFile;
    if (!activeFile) {
      setScoreStatus("Please upload a resume first.");
      return;
    }

    setLoading(true);
    setScoreStatus("Scoring jobs against resume...");

    const formData = new FormData();
    formData.append("file", activeFile);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/jobs/score?${queryParams}&limit=${resultLimit}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data: ScoreResponse = await response.json();
      setScoredJobs(data.jobs);
      setJobs(data.jobs.filter((job) => job.match_score >= minScore));
      setScoreExplanation(data.explanation);
      setHasScored(true);
      setScoreStatus(`Showing top ${resultLimit} matches.`);
      setActiveTab("matches");
    } catch (error) {
      console.error("Failed to score jobs", error);
      setScoreStatus("Failed to score jobs. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  const runScrape = async () => {
    setScrapeStatus("Running scraper...");
    try {
      const response = await fetch(`${API_BASE_URL}/api/scrape`, {
        method: "POST",
      });
      const data = await response.json();
      setScrapeStatus(
        `Scrape complete: ${data.inserted} new listings (${data.total_fetched} fetched).`
      );
      await loadJobs();
    } catch (error) {
      console.error("Scrape failed", error);
      setScrapeStatus("Scrape failed. Check backend logs.");
    }
  };

  useEffect(() => {
    if (hasAutoScraped.current) {
      loadJobs();
      return;
    }

    hasAutoScraped.current = true;
    const runInitial = async () => {
      await runScrape();
    };

    runInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  useEffect(() => {
    if (!hasScored) {
      return;
    }
    setJobs(scoredJobs.filter((job) => job.match_score >= minScore));
  }, [minScore, scoredJobs, hasScored]);

  useEffect(() => {
    if (resumeFile) {
      return;
    }
    setHasScored(false);
    setScoreExplanation(null);
    setJobs((prev) => prev.map((job) => ({ ...job, match_score: 0 })));
    setScoredJobs((prev) => prev.map((job) => ({ ...job, match_score: 0 })));
  }, [resumeFile]);

  return (
    <div className="career-shell">
      <nav className="top-nav">
        <div className="top-nav__brand">The Career Architect</div>
        <div className="top-nav__links">
          <span className="top-nav__link">Explore</span>
          <span className="top-nav__link">Resources</span>
          <button className="top-nav__cta">Apply Now</button>
        </div>
      </nav>

      <aside className="side-nav">
        <div className="side-nav__header">
          <div className="side-nav__title">Architect Workspace</div>
          <div className="side-nav__subtitle">AI-Powered Career Hub</div>
        </div>
        <div className="side-nav__links">
          <button
            type="button"
            className={`side-nav__link ${activeTab === "build" ? "side-nav__link--active" : ""}`}
            onClick={() => setActiveTab("build")}
          >
            <span className="material-symbols-outlined">edit_note</span>
            Build
          </button>
          <button
            type="button"
            className={`side-nav__link ${activeTab === "matches" ? "side-nav__link--active" : ""}`}
            onClick={() => setActiveTab("matches")}
          >
            <span className="material-symbols-outlined">auto_awesome</span>
            Matches
          </button>
          <button type="button" className="side-nav__link">
            <span className="material-symbols-outlined">sync_alt</span>
            Sync
          </button>
          <button type="button" className="side-nav__link">
            <span className="material-symbols-outlined">person</span>
            Profile
          </button>
        </div>
        <div className="side-nav__footer">
          <button className="side-nav__upgrade">Upgrade to Pro</button>
          <button type="button" className="side-nav__help">
            <span className="material-symbols-outlined">help</span>
            Help
          </button>
          <button type="button" className="side-nav__help">
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="content-shell">
        <header className="hero-header">
          <div>
            <div className="hero-label">Onboarding Experience</div>
            <h1 className="hero-title">Craft your professional blueprint.</h1>
            <p className="hero-description">
              Let&apos;s begin by cataloging your expertise. Your resume acts as the
              foundational structure for our AI matching engine.
            </p>
          </div>
          <div className="hero-progress">
            <span>Step 1 of 3</span>
            <div className="progress-track">
              <div className="progress-fill" />
            </div>
          </div>
        </header>

        {activeTab === "build" ? (
          <div className="content-grid">
            <section className="content-stack">
              <ResumePanel
                resumeFile={resumeFile}
                resultLimit={resultLimit}
                onResumeChange={setResumeFile}
                onResultLimitChange={setResultLimit}
                onPreview={parseResume}
                onScore={scoreJobs}
              />

              {previewStatus && <StatusMessage text={previewStatus} />}

              {resumePreview && (
                <div className="card preview-toggle">
                  <div>
                    <p className="card-title">Resume Preview</p>
                    <p className="hero-description">
                      Open the snapshot to review the extracted content and skills.
                    </p>
                  </div>
                  <button
                    className="footer-secondary"
                    type="button"
                    onClick={() => setShowPreview((prev) => !prev)}
                  >
                    {showPreview ? "Hide Preview" : "Show Preview"}
                  </button>
                </div>
              )}

              {resumePreview && showPreview && (
                <ResumePreviewCard
                  resumePreview={resumePreview}
                  onClose={() => {
                    setResumePreview(null);
                    setPreviewStatus(null);
                    setShowPreview(false);
                  }}
                />
              )}
            </section>

            <aside className="content-stack">
              <div className="card tag-card">
                <h3 className="card-title">
                  <span className="material-symbols-outlined">local_offer</span>
                  Expertise &amp; Interests
                </h3>
                <p className="hero-description">
                  Tags help our matching engine prioritize the right internship
                  opportunities for you.
                </p>
                <div className="tag-list">
                  <div className="tag-pill">
                    UI/UX Design <span className="material-symbols-outlined">close</span>
                  </div>
                  <div className="tag-pill">
                    React <span className="material-symbols-outlined">close</span>
                  </div>
                  <div className="tag-pill">
                    Figma <span className="material-symbols-outlined">close</span>
                  </div>
                  <div className="tag-pill">
                    Strategy <span className="material-symbols-outlined">close</span>
                  </div>
                </div>
                <div className="tag-input">
                  <span className="material-symbols-outlined">add</span>
                  <input type="text" placeholder="Add a skill..." />
                </div>
                <div className="suggestions">
                  <div className="suggestions-title">Suggested for you</div>
                  <div className="tag-list">
                    <button className="suggestion-chip">+ TypeScript</button>
                    <button className="suggestion-chip">+ Python</button>
                    <button className="suggestion-chip">+ Product Management</button>
                  </div>
                </div>
              </div>

              <div className="card interest-card">
                <h3 className="card-title">
                  <span className="material-symbols-outlined">psychology</span>
                  Career Interests
                </h3>
                <label className="card-label">What is your ideal career trajectory?</label>
                <textarea
                  className="card-textarea"
                  placeholder="Describe the roles, industries, and impact you want to have in your next position..."
                />
              </div>

              <div className="card insight-card">
                <h3 className="upload-title">Curator Insights</h3>
                <p className="upload-description">
                  Users who upload a detailed resume see a 40% increase in high-quality
                  matches during their first week.
                </p>
                <img
                  className="insight-image"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTTv-3iEb3vBgFMDXgdabvdOeJX2UP0wlGmT-ipv1WzahnCgiw6-fP7KyJRSFcrYYNrICm-JpjD1_Cdx9Ot3frFXL0lHm1rrKxurdqdCZm6Ic2sNmofo9crtch_TqdGVkjOa5Zd0H8Enhyog1dmwACOPLyX4UE1Xl3zO2NxZ56Tp5HAVO0u_C63093vWljvV6VaSEBK5vBz08e3ff3q86MHEpxKPTsYrmmIWiEcltw3tk54c9Grwt7mEkN6-U-CDF45yqP3zkfB38"
                  alt="modern office environment with soft focus desk setup and warm cinematic lighting showing professional focus"
                />
                <div className="insight-glow" />
              </div>
            </aside>
          </div>
        ) : (
          <section className="content-stack">
            <div className="card match-summary">
              <h3 className="card-title">
                <span className="material-symbols-outlined">track_changes</span>
                Match Summary
              </h3>
              <p className="hero-description">
                {jobs.length} listings live · threshold at {minScore}% · top {resultLimit}
              </p>
              <div className="match-actions">
                <button className="footer-primary" onClick={runScrape}>
                  Refresh Listings
                </button>
                <button
                  className="footer-secondary"
                  type="button"
                  onClick={() => setActiveTab("build")}
                >
                  Edit Resume Signals
                </button>
              </div>
            </div>

            <FiltersPanel
              jobTitle={jobTitle}
              location={location}
              minScore={minScore}
              onJobTitleChange={setJobTitle}
              onLocationChange={setLocation}
              onMinScoreChange={setMinScore}
            />

            {scoreStatus && <StatusMessage text={scoreStatus} />}
            {!hasScored && (
              <StatusMessage text="Upload a resume to compute match scores. Scores default to 0 until then." />
            )}
            {hasScored && scoreExplanation && (
              <StatusMessage text={scoreExplanation} />
            )}
            {scrapeStatus && <StatusMessage text={scrapeStatus} />}

            <JobsTable jobs={jobs} loading={loading} />
          </section>
        )}

        <footer className="footer-actions">
          <button className="footer-secondary" type="button">
            <span className="material-symbols-outlined">arrow_back</span>
            Previous Step
          </button>
          <button className="footer-primary" type="button">
            Continue to Sync
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </footer>
      </main>

      <div className="mobile-only">
        <button className="fab" type="button">
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>
    </div>
  );
}