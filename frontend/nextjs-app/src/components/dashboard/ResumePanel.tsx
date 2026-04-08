type ResumePanelProps = {
  resumeFile: File | null;
  resultLimit: number;
  onResumeChange: (file: File | null) => void;
  onResultLimitChange: (value: number) => void;
  onPreview: () => void;
  onScore: () => void;
};

export default function ResumePanel({
  resumeFile,
  resultLimit,
  onResumeChange,
  onResultLimitChange,
  onPreview,
  onScore,
}: ResumePanelProps) {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border-2 border-dashed border-[rgba(27,77,255,0.3)] bg-white/70 p-8 shadow-[0_20px_60px_rgba(15,17,21,0.12)]">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--paper-200)] text-[var(--accent-500)]">
            <span className="upload-icon">☁️</span>
          </div>
          <h3 className="text-xl font-semibold text-[var(--ink-900)]">
            Upload your resume
          </h3>
          <p className="mt-2 text-sm text-[var(--ink-500)]">
            Drag and drop your PDF or DOCX here. We’ll extract skills and score
            them instantly.
          </p>
          <label className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-full bg-[var(--paper-200)] px-6 py-3 text-sm font-semibold text-[var(--ink-900)] transition hover:bg-[var(--paper-300)]">
            Select File
            <input
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(event) => onResumeChange(event.target.files?.[0] ?? null)}
            />
          </label>
          {resumeFile && (
            <p className="mt-3 text-xs text-[var(--ink-300)]">
              Selected: {resumeFile.name}
            </p>
          )}
        </div>
      </div>

      <div className="glass-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-title">Resume Console</p>
            <p className="mt-2 text-sm text-[var(--ink-500)]">
              Feed the scoring engine and generate a curated shortlist.
            </p>
          </div>
          <span className="data-chip">Live scan</span>
        </div>
        <div className="mt-6 space-y-4">
          <div className="input-shell">
            <label className="input-label">Results to Show</label>
            <select
              className="select-field"
              value={resultLimit}
              onChange={(event) => onResultLimitChange(Number(event.target.value))}
            >
              <option value={10}>Top 10</option>
              <option value={15}>Top 15</option>
              <option value={25}>Top 25</option>
              <option value={50}>Top 50</option>
              <option value={100}>Top 100</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="cta-button secondary" onClick={() => onPreview()}>
              Preview Resume
            </button>
            <button className="cta-button primary" onClick={() => onScore()}>
              Score Jobs
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}