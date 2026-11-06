import { ArrowRight, BookOpenCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function ContinueLearning({ courses = [], progressMap = {}, loading = false }) {
  const visibleCourses = courses.slice(0, 3);

  if (loading) {
    return (
      <section className="rounded-3xl border border-white/10 bg-[#101018]/85 p-6">
        <div className="h-8 w-48 rounded bg-white/5 animate-pulse" />
        <div className="mt-5 space-y-4">
          <div className="h-24 rounded-2xl bg-white/5 animate-pulse" />
          <div className="h-24 rounded-2xl bg-white/5 animate-pulse" />
          <div className="h-24 rounded-2xl bg-white/5 animate-pulse" />
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-[#101018]/85 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Continue Learning</h2>
        <Link to="/dashboard/my-courses" className="text-sm text-purple-300 hover:text-purple-200">View all</Link>
      </div>

      <div className="space-y-4">
        {visibleCourses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-gray-400">
            Enroll in a course to start your learning journey.
          </div>
        ) : (
          visibleCourses.map((course) => {
            const courseId = Number(course.course_id ?? course.course ?? course.id);
            const progress = progressMap[courseId] || { completion_percentage: 0 };
            const title = course.course_title || course.title || "Course";
            const description = course.course_description || course.description || "Continue from where you left off.";

            return (
              <div key={courseId || title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-purple-300">
                      <BookOpenCheck size={16} />
                      <span>{title}</span>
                    </div>
                    <p className="text-sm text-gray-400">{description}</p>
                  </div>
                  <Link to={`/courses/${courseId}/learn`} className="inline-flex items-center gap-2 rounded-full bg-purple-500/15 px-3 py-1.5 text-xs font-semibold text-purple-200">
                    Resume <ArrowRight size={14} />
                  </Link>
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-xs text-gray-400">
                    <span>Progress</span>
                    <span>{Number(progress.completion_percentage || 0).toFixed(0)}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-orange-400" style={{ width: `${Math.min(progress.completion_percentage || 0, 100)}%` }} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
