type HeaderProps = {
  onRunScrape: () => void;
};

export default function Header({ onRunScrape }: HeaderProps) {
  return (
  <header className="border-b border-[rgba(15,17,21,0.08)] bg-[rgba(244,242,238,0.6)] backdrop-blur">
    {/* 1. Use flex-row to put items side-by-side */}
    {/* 2. Use justify-between to push them to opposite ends */}
    <div className="mx-auto flex max-w-6xl flex-row items-center justify-between px-6 py-10">
      
      {/* Left Side: Text Content */}
      <div className="flex flex-col items-start">
        <p className="section-title text-xs font-bold uppercase tracking-widest text-[var(--ink-500)]">
          The Career Architect
        </p>
        <h1 className="mt-2 text-4xl font-serif font-semibold text-[var(--ink-900)] leading-tight">
          Local Internship Intelligence
        </h1>
        <p className="mt-2 text-lg text-[var(--ink-600)]">
          Powered by SimplifyJobs, ATS boards, and resume scoring.
        </p>
      </div>

      {/* Right Side: Action Button */}
      <div className="flex-shrink-0 ml-8">
        <button 
          className="cta-button secondary px-8 py-3 border-2 border-[var(--ink-900)] rounded-full font-medium hover:bg-[var(--ink-900)] hover:text-white transition-all" 
          onClick={onRunScrape}
        >
          RUN SCRAPER
        </button>
      </div>
      
    </div>
  </header>
);
}