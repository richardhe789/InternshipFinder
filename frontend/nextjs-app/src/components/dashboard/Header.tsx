type HeaderProps = {
  onRunScrape: () => void;
};

export default function Header({ onRunScrape }: HeaderProps) {
  return (
    <header className="border-b border-[rgba(15,17,21,0.08)] bg-[rgba(244,242,238,0.6)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-row items-center justify-between px-6 py-10">
        <div className="flex flex-col items-start">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-legacy-ink-500">
            The Career Architect
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-tight text-legacy-ink-900">
            Local Internship Intelligence
          </h1>
          <p className="mt-2 text-lg text-legacy-ink-500">
            Powered by SimplifyJobs, ATS boards, and resume scoring.
          </p>
        </div>

        <div className="ml-8 flex-shrink-0">
          <button
            className="rounded-full border-2 border-legacy-ink-900 px-8 py-3 text-sm font-semibold text-legacy-ink-900 transition-all hover:bg-legacy-ink-900 hover:text-white"
            onClick={onRunScrape}
          >
            RUN SCRAPER
          </button>
        </div>
      </div>
    </header>
  );
}