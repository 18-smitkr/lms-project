import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function RecommendedCourses({ courses = [], loading = false }) {
  if (loading) {
    return (
      <section className="rounded-3xl border border-white/10 bg-[#101018]/85 p-6">
        <div className="h-8 w-52 rounded bg-white/5 animate-pulse" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="h-52 rounded-2xl bg-white/5 animate-pulse" />
          <div className="h-52 rounded-2xl bg-white/5 animate-pulse" />
          <div className="h-52 rounded-2xl bg-white/5 animate-pulse" />
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-[#101018]/85 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Recommended Courses</h2>
        <Link to="/courses" className="text-sm text-purple-300 hover:text-purple-200">Browse catalog</Link>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {courses.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-gray-400">
            No course recommendations available yet.
          </div>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              {course.thumbnail_url ? (
                <img src={course.thumbnail_url} alt="" className="mb-4 h-28 w-full rounded-2xl object-cover" />
              ) : (
                <div className="mb-4 flex h-28 items-center justify-center rounded-xl bg-[#EAF5F3] text-[#168C83]">
                  <BookOpen size={28} aria-hidden="true" />
                </div>
              )}
              <h3 className="text-xl font-bold text-white">{course.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{course.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-base font-semibold text-purple-300">₹{Number(course.price || 0)}</span>
                <Link to={`/courses/${course.id}`} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-3 py-2 text-sm font-medium text-white">
                  Explore <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
