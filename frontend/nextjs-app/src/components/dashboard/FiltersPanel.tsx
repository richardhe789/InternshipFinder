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
    <section className="editorial-panel text-center">
      
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="input-shell">
          <label className="input-label mr-3">Job Title</label>
          <input
            className="input-field"
            placeholder="SWE, ML, AI"
            value={jobTitle}
            onChange={(event) => onJobTitleChange(event.target.value)}
          />
        </div>
        <div className="input-shell">
          <label className="input-label mr-3">Location</label>
          <input
            className="input-field"
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
        <div className="input-shell">
          <label className="input-label">Minimum Match Score: {minScore}</label>
          <input
            type="range"
            min={0}
            max={100}
            value={minScore}
            onChange={(event) => onMinScoreChange(Number(event.target.value))}
            className="range-field"
          />
        </div>
      </div>
    </section>
  );
}