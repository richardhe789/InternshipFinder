import { useRef } from "react";

type ResumePanelProps = {
  resumeFile: File | null;
  resultLimit: number;
  onResumeChange: (file: File | null) => void;
  onResultLimitChange: (value: number) => void;
  onPreview: (file?: File | null) => void;
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleResumeSelect = async (file: File | null) => {
    onResumeChange(file);
    if (file) {
      await onPreview(file);
    }
  };

  const handleScanResume = () => {
    // if (resumeFile) {
    //   onPreview(resumeFile);
    //   return;
    // }
    fileInputRef.current?.click();
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border-2 border-dashed border-[rgba(27,77,255,0.3)] bg-white/70 p-8 text-center shadow-[0_20px_60px_rgba(15,17,21,0.12)]">
          <h3 className="text-xl font-semibold text-legacy-ink-900">
            Upload your resume
          </h3>
          <p className="mt-2 text-sm text-legacy-ink-500">
            Drag and drop your PDF or DOCX here. We’ll extract skills and score
            them instantly.
          </p>
          <button
            className="mt-5 inline-flex items-center justify-center rounded-full border border-legacy-ink-900/20 px-6 py-2 text-xs font-bold uppercase tracking-[0.08em] text-legacy-ink-900 transition hover:bg-legacy-ink-900 hover:text-white"
            onClick={handleScanResume}
          >
            Scan Resume
          </button>
          <input
            type="file"
            accept=".pdf,.docx"
            className="sr-only"
            ref={fileInputRef}
            onChange={(event) =>
              handleResumeSelect(event.target.files?.[0] ?? null)
            }
          />
          {resumeFile && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="flex items-center gap-2 rounded-full border border-[rgba(27,77,255,0.1)] bg-[rgba(27,77,255,0.05)] px-4 py-2 text-xs font-medium text-legacy-accent">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {resumeFile.name}
                <button
                  onClick={() => onResumeChange(null)}
                  className="ml-1 transition-colors hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
      </div>

      <div className="mx-auto mt-12 max-w-2xl overflow-hidden rounded-2xl border border-[rgba(15,17,21,0.08)] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <div className="p-10">
          <div className="flex flex-col gap-10 md:flex-row md:items-end">
            <div className="flex-1">
              <p className="mb-4 text-sm leading-relaxed text-legacy-ink-500">
                Define the maximum number of matches to rank against your profile.
              </p>
              <div className="relative">
                <select
                  className="w-full cursor-pointer appearance-none rounded-xl border-2 border-[rgba(15,17,21,0.05)] bg-[rgba(244,242,238,0.3)] px-5 py-4 text-sm font-medium text-legacy-ink-900 outline-none transition hover:border-[rgba(15,17,21,0.1)] focus:border-legacy-ink-900 focus:ring-4 focus:ring-[rgba(15,17,21,0.03)]"
                  value={resultLimit}
                  onChange={(event) => onResultLimitChange(Number(event.target.value))}
                >
                  <option value={10}>Top 10 Results</option>
                  <option value={15}>Top 15 Results</option>
                  <option value={25}>Top 25 Results</option>
                  <option value={50}>Top 50 Results</option>
                  <option value={100}>Top 100 Results</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-legacy-ink-900">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M1 1.5L6 6.5L11 1.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <button
                className="relative w-full overflow-hidden rounded-xl bg-legacy-ink-900 px-10 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-[0_10px_20px_rgba(15,17,21,0.2)] transition-all hover:-translate-y-0.5 hover:shadow-[0_15px_25px_rgba(15,17,21,0.3)] active:translate-y-0 active:scale-95 md:w-auto"
                onClick={() => onScore()}
              >
                <span className="relative z-10">Generate Report</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent hover:animate-[shimmer_1.5s_infinite]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}