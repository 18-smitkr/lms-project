import { ArrowRight, ChartNoAxesCombined, CircleCheck, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

export default function LearningProgressOverview({ courses = [], progressMap = {}, completedLessons = 0, loading = false }) {
  const progresses = Object.values(progressMap).filter(Boolean);
  const totalLessons = progresses.reduce((sum, item) => sum + Number(item.total_lessons || 0), 0);
  const lessonsCompleted = progresses.reduce((sum, item) => sum + Number(item.completed_lessons || 0), 0);
  const overallProgress = totalLessons ? Math.round((lessonsCompleted / totalLessons) * 100) : 0;
  const completedCourses = progresses.filter((item) => item.course_completed).length;
  const coursesInProgress = progresses.filter(
    (item) => !item.course_completed && Number(item.completed_lessons || 0) > 0
  ).length;

  return (
    <section aria-labelledby="dashboard-progress-heading" className="rounded-2xl border border-[#E7E7E7] bg-white p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ChartNoAxesCombined size={19} className="text-[#C44808]" aria-hidden="true" />
            <h2 id="dashboard-progress-heading" className="text-xl font-semibold tracking-tight text-black">Learning progress</h2>
          </div>
          <p className="mt-1 text-sm text-[#737373]">A quick look at your course activity.</p>
        </div>
        <Link
          to="/dashboard/progress"
          className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-lg bg-[#FE580D] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#E64E00]"
        >
          View detailed progress <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>

      {loading ? (
        <div role="status" aria-label="Loading progress overview" className="mt-6 grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((item) => <div key={item} className="h-20 animate-pulse rounded-xl bg-[#F5F5F5]" />)}
        </div>
      ) : courses.length === 0 ? (
        <p className="mt-6 rounded-xl bg-[#F5F5F5] p-4 text-sm text-[#737373]">
          Enroll in a course to start tracking your progress.
        </p>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <OverviewMetric
              icon={ChartNoAxesCombined}
              label="Overall completion"
              value={progresses.length === courses.length ? `${overallProgress}%` : "Unavailable"}
            />
            <OverviewMetric icon={GraduationCap} label="Courses in progress" value={progresses.length === courses.length ? coursesInProgress : "Unavailable"} />
            <OverviewMetric icon={CircleCheck} label="Lessons completed" value={completedLessons ?? lessonsCompleted} />
          </div>
          {progresses.length === courses.length && (
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs text-[#737373]">
                <span>Overall learning progress</span>
                <span>{overallProgress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#EAF6EF]" role="progressbar" aria-valuenow={overallProgress} aria-valuemin={0} aria-valuemax={100} aria-label="Overall learning progress">
                <div className="h-full rounded-full bg-[#62BF8E] transition-[width] duration-500" style={{ width: `${overallProgress}%` }} />
              </div>
              <p className="sr-only">{completedCourses} courses completed.</p>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function OverviewMetric({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[#F5F5F5] p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#C44808]">
        <Icon size={17} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-[#737373]">{label}</p>
        <p className="mt-1 truncate text-lg font-semibold text-black">{value}</p>
      </div>
    </div>
  );
}
