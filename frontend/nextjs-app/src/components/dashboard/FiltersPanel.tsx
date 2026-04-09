type FiltersPanelProps = {
  jobTitle: string;
  location: string;
  minScore: number;
  onJobTitleChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onMinScoreChange: (value: number) => void;
};

export default function FiltersPanel({
  jobTitle,
  location,
  minScore,
  onJobTitleChange,
  onLocationChange,
  onMinScoreChange,
}: FiltersPanelProps) {
  const locationSuggestions = [
    "Remote",
    "New York, NY",
    "San Francisco, CA",
    "Seattle, WA",
    "Austin, TX",
    "Boston, MA",
    "Chicago, IL",
    "Los Angeles, CA",
    "Atlanta, GA",
    "Raleigh, NC",
    "Denver, CO",
    "Portland, OR",
    "Phoenix, AZ",
    "Washington, DC",
  ];

  const locationDatalistId = "location-suggestions";

  return (
    <section className="rounded-[20px] bg-surface-container-lowest p-6 shadow-card">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <label className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
            Job Title
          </label>
          <input
            className="w-full rounded-2xl border border-outline-variant bg-white/90 px-4 py-3 text-[0.9rem] transition focus:border-legacy-accent focus:outline-none focus:ring-2 focus:ring-[rgba(27,77,255,0.15)]"
            placeholder="SWE, ML, AI"
            value={jobTitle}
            onChange={(event) => onJobTitleChange(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
            Location
          </label>
          <input
            className="w-full rounded-2xl border border-outline-variant bg-white/90 px-4 py-3 text-[0.9rem] transition focus:border-legacy-accent focus:outline-none focus:ring-2 focus:ring-[rgba(27,77,255,0.15)]"
            placeholder="Remote, NYC, etc."
            list={locationDatalistId}
            value={location}
            onChange={(event) => onLocationChange(event.target.value)}
          />
          <datalist id={locationDatalistId}>
            {locationSuggestions.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
            Minimum Match Score: {minScore}
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={minScore}
            onChange={(event) => onMinScoreChange(Number(event.target.value))}
            className="w-full accent-legacy-accent"
          />
        </div>
      </div>
    </section>
  );
}