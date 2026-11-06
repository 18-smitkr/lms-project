import { BookMarked, CheckCircle2 } from "lucide-react";

export default function RecentActivity({ courses = [] }) {
  const recentCourses = (courses || []).slice(0, 5);

  return (
    <section className="rounded-3xl border border-white/10 bg-[#101018]/85 p-6">
      <h2 className="text-xl font-bold text-white">Recent Activity</h2>

      <div className="mt-6 space-y-4">
        {recentCourses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-gray-400">
            Your learning activity will appear here.
          </div>
        ) : (
          recentCourses.map((course, index) => (
            <div key={course.course_id ?? course.course ?? course.id ?? index} className="flex gap-3 rounded-2xl bg-white/5 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300">
                {index % 2 === 0 ? <BookMarked size={16} /> : <CheckCircle2 size={16} />}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{course.course_title || course.title || "Course enrolled"}</p>
                <p className="text-xs text-gray-400">
                  {course.enrolled_at ? new Date(course.enrolled_at).toLocaleDateString() : "Recent enrollment"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
