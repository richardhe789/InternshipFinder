import type { Job } from "@/types/jobs";

type JobsTableProps = {
  jobs: Job[];
  loading: boolean;
};

export default function JobsTable({ jobs, loading }: JobsTableProps) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-[rgba(15,17,21,0.1)] bg-white/90 shadow-soft">
      <div className="flex items-center justify-between border-b border-[rgba(15,17,21,0.1)] px-6 py-5">
        <div>
          <p className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-legacy-ink-500">
            Internship Feed
          </p>
          <p className="mt-2 text-sm text-legacy-ink-500">
            {loading ? "Scanning live boards..." : `${jobs.length} listings found`}
          </p>
        </div>
        <span className="rounded-full bg-legacy-ink-900 px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.08em] text-white">
          Curated signals
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-left">
          <thead>
            <tr className="bg-legacy-paper-200 text-[0.7rem] uppercase tracking-[0.12em] text-legacy-ink-500">
              <th className="px-5 py-4">Company</th>
              <th className="px-5 py-4">Role</th>
              <th className="px-5 py-4">Location</th>
              <th className="px-5 py-4">Match Score</th>
              <th className="px-5 py-4">Date Posted</th>
              <th className="px-5 py-4">Apply</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr
                key={`${job.company}-${job.url}`}
                className="border-t border-[rgba(15,17,21,0.08)] transition hover:bg-[rgba(27,77,255,0.05)]"
              >
                <td className="px-5 py-4 font-semibold text-legacy-ink-900">
                  <span className="block max-w-[14rem] truncate">{job.company}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="block max-w-[16rem] truncate">{job.role}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="block max-w-[12rem] truncate">{job.location}</span>
                </td>
                <td className="px-5 py-4 font-semibold text-legacy-accent">
                  {job.match_score.toFixed(1)}
                </td>
                <td className="px-5 py-4">
                  <span className="block max-w-[10rem] truncate">{job.date_posted}</span>
                </td>
                <td className="px-5 py-4">
                  <a
                    className="inline-flex items-center gap-1.5 rounded-full bg-legacy-ink-900 px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-white"
                    href={job.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Apply
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}