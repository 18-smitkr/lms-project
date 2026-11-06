import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  ChartNoAxesCombined,
  Check,
  CircleCheck,
  Clock3,
  GraduationCap,
  RefreshCw,
} from "lucide-react";
import API from "../api/axios";
import Sidebar from "../components/student/studentsidebar";
import Topbar from "../components/student/studenttopbar";

function getCourseId(course) {
  return Number(course.course_id ?? course.course ?? course.id);
}

function getCourseTitle(course) {
  return course.course_title || course.title || "Course";
}

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function Progress() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [courseProgress, setCourseProgress] = useState({});
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProgress = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [coursesResponse, activityResponse] = await Promise.all([
        API.get("my-courses/"),
        API.get("progress/my-progress/"),
      ]);

      const enrolledCourses = coursesResponse.data || [];
      const entries = await Promise.all(
        enrolledCourses.map(async (course) => {
          const courseId = getCourseId(course);
          const response = await API.get(`progress/course-progress/${courseId}/`);
          return [courseId, response.data];
        })
      );

      setCourses(enrolledCourses);
      setCourseProgress(Object.fromEntries(entries));
      setActivity(activityResponse.data || []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
        requestError.response?.data?.error ||
        "Unable to load your learning progress. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadProgress);
  }, [loadProgress]);

  const progressRows = useMemo(
    () => courses.map((course) => {
      const courseId = getCourseId(course);
      const progress = courseProgress[courseId];
      const courseActivity = activity.find((record) => Number(record.course_id) === courseId);
      return {
        course,
        courseId,
        progress,
        courseActivity,
      };
    }),
    [courses, courseProgress, activity]
  );

  const summary = useMemo(() => {
    const values = Object.values(courseProgress);
    const totalLessons = values.reduce((sum, item) => sum + Number(item.total_lessons || 0), 0);
    const completedLessons = values.reduce((sum, item) => sum + Number(item.completed_lessons || 0), 0);
    const completedCourses = values.filter((item) => item.course_completed).length;
    return {
      totalCourses: courses.length,
      completedCourses,
      completedLessons,
      overallProgress: totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0,
    };
  }, [courses.length, courseProgress]);

  const recentActivity = useMemo(
    () => activity
      .filter((record) => record.completed)
      .slice()
      .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()),
    [activity]
  );

  const completedRows = progressRows.filter(({ progress }) => progress?.course_completed);

  return (
    <div className="flex min-h-screen w-full overflow-x-clip bg-[#F5F5F5] text-black">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="min-w-0 flex-1 md:ml-28 lg:ml-72">
        <Topbar
          title="My Progress"
          isMenuOpen={sidebarOpen}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="mx-auto w-full max-w-[1600px] space-y-8 px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C44808]">Your learning journey</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-black sm:text-4xl">My Progress</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#737373]">
                See how far you have come and continue working toward your learning goals.
              </p>
            </div>
            {!loading && !error && (
              <button
                type="button"
                onClick={loadProgress}
                className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-lg border border-[#E7E7E7] bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:border-[#FE580D] sm:self-auto"
              >
                <RefreshCw size={15} aria-hidden="true" />
                Refresh
              </button>
            )}
          </div>

          {error ? (
            <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <p className="text-sm font-semibold text-red-800">{error}</p>
              <button
                type="button"
                onClick={loadProgress}
                className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#FE580D] px-4 py-2 text-sm font-semibold text-black hover:bg-[#E64E00]"
              >
                <RefreshCw size={15} aria-hidden="true" /> Try again
              </button>
            </div>
          ) : loading ? (
            <ProgressLoading />
          ) : courses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#D7D7D7] bg-white px-6 py-12 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0E8] text-[#C44808]">
                <BookOpenCheck size={25} aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-black">Your progress starts with a course</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#737373]">
                Enroll in a course to see lesson completion and your learning progress here.
              </p>
              <Link to="/courses" className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#FE580D] px-4 py-2 text-sm font-semibold text-black hover:bg-[#E64E00]">
                Explore courses <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <>
              <section aria-label="Progress summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryCard icon={BookOpenCheck} label="Enrolled courses" value={summary.totalCourses} />
                <SummaryCard icon={GraduationCap} label="Courses completed" value={summary.completedCourses} tone="green" />
                <SummaryCard icon={CircleCheck} label="Lessons completed" value={summary.completedLessons} tone="green" />
                <SummaryCard icon={ChartNoAxesCombined} label="Overall progress" value={`${summary.overallProgress}%`} progress={summary.overallProgress} />
              </section>

              <section aria-labelledby="course-progress-heading" className="space-y-4">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 id="course-progress-heading" className="text-xl font-semibold tracking-tight text-black sm:text-2xl">Course progress</h2>
                    <p className="mt-1 text-sm text-[#737373]">Your progress in each enrolled course.</p>
                  </div>
                  <span className="text-sm text-[#737373]">{courses.length} {courses.length === 1 ? "course" : "courses"}</span>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  {progressRows.map(({ course, courseId, progress, courseActivity }) => {
                    if (!progress) {
                      return <CourseProgressError key={courseId} course={course} onRetry={loadProgress} />;
                    }
                    return (
                      <CourseProgressCard
                        key={courseId}
                        course={course}
                        courseId={courseId}
                        progress={progress}
                        courseActivity={courseActivity}
                      />
                    );
                  })}
                </div>
              </section>

              <section aria-labelledby="completed-courses-heading" className="rounded-2xl border border-[#E7E7E7] bg-white p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF6EF] text-[#287A52]">
                    <GraduationCap size={20} aria-hidden="true" />
                  </span>
                  <div>
                    <h2 id="completed-courses-heading" className="text-xl font-semibold tracking-tight text-black">Completed courses</h2>
                    <p className="mt-1 text-sm text-[#737373]">Courses the backend has marked as fully complete.</p>
                  </div>
                </div>
                {completedRows.length === 0 ? (
                  <p className="mt-5 rounded-xl bg-[#F5F5F5] p-4 text-sm text-[#737373]">
                    No completed courses yet. Keep learning and your completions will appear here.
                  </p>
                ) : (
                  <div className="mt-5 divide-y divide-[#E7E7E7]">
                    {completedRows.map(({ course, courseId, progress }) => (
                      <div key={courseId} className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-black">{getCourseTitle(course)}</h3>
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF6EF] px-2.5 py-1 text-xs font-semibold text-[#287A52]">
                              <Check size={13} aria-hidden="true" /> Complete
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-[#737373]">
                            {Number(progress.completion_percentage || 0).toFixed(0)}% complete · {progress.completed_lessons} of {progress.total_lessons} lessons
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section aria-labelledby="learning-activity-heading" className="rounded-2xl border border-[#E7E7E7] bg-white p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0E8] text-[#C44808]">
                    <Clock3 size={20} aria-hidden="true" />
                  </span>
                  <div>
                    <h2 id="learning-activity-heading" className="text-xl font-semibold tracking-tight text-black">Learning activity</h2>
                    <p className="mt-1 text-sm text-[#737373]">Recently completed lessons recorded by Learnova.</p>
                  </div>
                </div>
                {recentActivity.length === 0 ? (
                  <p className="mt-5 rounded-xl bg-[#F5F5F5] p-4 text-sm text-[#737373]">
                    No completed lesson activity is available yet.
                  </p>
                ) : (
                  <ol className="mt-6">
                    {recentActivity.slice(0, 10).map((record, index) => {
                      const course = courses.find((item) => getCourseId(item) === Number(record.course_id));
                      return (
                        <li key={`${record.id}-${record.lesson}`} className="relative flex gap-4 pb-6 last:pb-0">
                          {index < Math.min(recentActivity.length, 10) - 1 && (
                            <span aria-hidden="true" className="absolute bottom-0 left-[15px] top-8 w-px bg-[#E7E7E7]" />
                          )}
                          <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#B8E3CB] bg-[#EAF6EF] text-[#287A52]">
                            <Check size={15} aria-hidden="true" />
                          </span>
                          <div className="min-w-0 flex-1 border-b border-[#E7E7E7] pb-5 last:border-0 last:pb-0">
                            <p className="text-sm font-semibold text-black">Completed {record.lesson_title}</p>
                            <p className="mt-1 text-sm text-[#737373]">{record.course_title}</p>
                            <p className="mt-2 text-xs text-[#737373]">{formatDate(record.completed_at) || "Date unavailable"}</p>
                          </div>
                          {course && (
                            <Link
                              to={`/courses/${getCourseId(course)}/learn`}
                              aria-label={`Continue ${getCourseTitle(course)}`}
                              className="mt-1 shrink-0 rounded-lg p-2 text-[#737373] hover:bg-[#FFF0E8] hover:text-[#C44808]"
                            >
                              <ArrowRight size={16} aria-hidden="true" />
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                )}
              </section>

            </>
          )}
        </div>
      </main>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, tone = "orange", progress }) {
  return (
    <article className="rounded-2xl border border-[#E7E7E7] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#737373]">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-black">{value}</p>
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${
          tone === "green" ? "bg-[#EAF6EF] text-[#287A52]" : "bg-[#FFF0E8] text-[#C44808]"
        }`}>
          <Icon size={19} aria-hidden="true" />
        </span>
      </div>
      {progress !== undefined && (
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#EAF6EF]" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Overall learning progress">
          <div className="h-full rounded-full bg-[#62BF8E] transition-[width] duration-500" style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }} />
        </div>
      )}
    </article>
  );
}

function CourseProgressCard({ course, courseId, progress, courseActivity }) {
  const percentage = Math.min(Math.max(Number(progress.completion_percentage || 0), 0), 100);
  const completed = Boolean(progress.course_completed);
  const completedAt = formatDate(courseActivity?.completed_at);
  const enrollmentDate = formatDate(course.enrolled_at);
  const lastActivity = completedAt
    ? `Last lesson completed ${completedAt}`
    : enrollmentDate
      ? `Enrolled ${enrollmentDate}`
      : null;

  return (
    <article className="overflow-hidden rounded-2xl border border-[#E7E7E7] bg-white">
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-44 shrink-0 overflow-hidden bg-[#F5F5F5] sm:h-auto sm:min-h-52 sm:w-52">
          <BookOpenCheck size={28} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#FE580D]" aria-hidden="true" />
          {course.thumbnail_url && (
            <img
              src={course.thumbnail_url}
              alt=""
              loading="lazy"
              className="relative h-full w-full object-contain"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          )}
          {completed && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#EAF6EF] px-2.5 py-1 text-xs font-semibold text-[#287A52]">
              <Check size={13} aria-hidden="true" /> Completed
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col p-5">
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-black">{getCourseTitle(course)}</h3>
          {course.course_description && (
            <p className="mt-2 line-clamp-2 text-sm leading-5 text-[#737373]">{course.course_description}</p>
          )}
          <div className="mt-4 flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-[#737373]">Course completion</span>
            <span className="font-semibold text-black">{percentage.toFixed(0)}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#EAF6EF]" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100} aria-label={`${getCourseTitle(course)} completion`}>
            <div className="h-full rounded-full bg-[#62BF8E] transition-[width] duration-500" style={{ width: `${percentage}%` }} />
          </div>
          <p className="mt-2 text-xs text-[#737373]">
            {progress.completed_lessons} of {progress.total_lessons} lessons completed
          </p>
          {lastActivity && <p className="mt-2 text-xs text-[#737373]">{lastActivity}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Link to={`/courses/${courseId}/learn`} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#FE580D] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#E64E00]">
              Continue learning <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function CourseProgressError({ course, onRetry }) {
  return (
    <article className="rounded-2xl border border-red-200 bg-white p-5">
      <h3 className="font-semibold text-black">{getCourseTitle(course)}</h3>
      <p className="mt-2 text-sm text-red-700">Progress for this course could not be loaded.</p>
      <button type="button" onClick={onRetry} className="mt-3 text-sm font-semibold text-[#C44808] underline">
        Retry
      </button>
    </article>
  );
}

function ProgressLoading() {
  return (
    <div role="status" aria-label="Loading learning progress" className="space-y-8">
      <span className="sr-only">Loading learning progress...</span>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-28 animate-pulse rounded-2xl border border-[#E7E7E7] bg-white p-5">
            <div className="h-4 w-28 rounded bg-[#F5F5F5]" />
            <div className="mt-5 h-7 w-16 rounded bg-[#F5F5F5]" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {[0, 1].map((item) => (
          <div key={item} className="h-64 animate-pulse rounded-2xl border border-[#E7E7E7] bg-white" />
        ))}
      </div>
    </div>
  );
}

export default Progress;
