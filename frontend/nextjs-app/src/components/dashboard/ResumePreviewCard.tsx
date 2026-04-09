import type { ResumePreview } from "@/types/jobs";

type ResumePreviewCardProps = {
  resumePreview: ResumePreview;
  onClose: () => void;
};

export default function ResumePreviewCard({
  resumePreview,
  onClose,
}: ResumePreviewCardProps) {
  return (
    <div className="rounded-[20px] bg-surface-container-lowest p-6 text-sm text-on-surface-variant shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-legacy-ink-500">
          Resume Preview
        </p>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-1.5 rounded-full bg-legacy-ink-900 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-white"
            type="button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
      {(resumePreview.name || resumePreview.email || resumePreview.phone) && (
        <div className="mt-4">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-legacy-ink-500">
            Contact
          </p>
          <p className="mt-1 text-sm">
            {resumePreview.name && <span>{resumePreview.name}</span>}
            {resumePreview.email && <span className="ml-2">{resumePreview.email}</span>}
            {resumePreview.phone && <span className="ml-2">{resumePreview.phone}</span>}
          </p>
        </div>
      )}
      {(resumePreview.linkedin || resumePreview.github) && (
        <div className="mt-4">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-legacy-ink-500">
            Profiles
          </p>
          <p className="mt-1 text-sm">
            {resumePreview.linkedin && (
              <span className="mr-2">{resumePreview.linkedin}</span>
            )}
            {resumePreview.github && <span>{resumePreview.github}</span>}
          </p>
        </div>
      )}
      <p className="mt-4 whitespace-pre-wrap leading-relaxed">
        {resumePreview.preview}
      </p>
      {resumePreview.keywords?.length > 0 && (
        <div className="mt-4">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-legacy-ink-500">
            Keywords
          </p>
          <p className="mt-1 text-sm">{resumePreview.keywords.join(", ")}</p>
        </div>
      )}
      {resumePreview.experience_titles?.length > 0 && (
        <div className="mt-4">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-legacy-ink-500">
            Experience Titles
          </p>
          <p className="mt-1 text-sm">{resumePreview.experience_titles.join(", ")}</p>
        </div>
      )}
      {resumePreview.companies?.length > 0 && (
        <div className="mt-4">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-legacy-ink-500">
            Companies
          </p>
          <p className="mt-1 text-sm">{resumePreview.companies.join(", ")}</p>
        </div>
      )}
      {resumePreview.date_ranges?.length > 0 && (
        <div className="mt-4">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-legacy-ink-500">
            Date Ranges
          </p>
          <p className="mt-1 text-sm">{resumePreview.date_ranges.join(", ")}</p>
        </div>
      )}
      {resumePreview.skills_section && (
        <div className="mt-4">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-legacy-ink-500">
            Skills Section
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm">
            {resumePreview.skills_section}
          </p>
        </div>
      )}
      {resumePreview.experience_section && (
        <div className="mt-4">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-legacy-ink-500">
            Experience Section
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm">
            {resumePreview.experience_section}
          </p>
        </div>
      )}
      {resumePreview.projects_section && (
        <div className="mt-4">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-legacy-ink-500">
            Projects Section
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm">
            {resumePreview.projects_section}
          </p>
        </div>
      )}
      {resumePreview.courses?.length > 0 && (
        <div className="mt-4">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-legacy-ink-500">
            Relevant Courses
          </p>
          <p className="mt-1 text-sm">{resumePreview.courses.join(", ")}</p>
        </div>
      )}
      {resumePreview.education && (
        <div className="mt-4">
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-legacy-ink-500">
            Education Section
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm">{resumePreview.education}</p>
        </div>
      )}
    </div>
  );
}