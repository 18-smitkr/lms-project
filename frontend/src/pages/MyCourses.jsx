import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import API from "../api/axios";
import BackButton from "../components/common/BackButton";

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        setLoading(true);
        const response = await API.get("my-courses/");
        setCourses(response.data || []);
      } catch {
        setError("Unable to fetch your enrolled courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return courses;

    return courses.filter((course) =>
      (course.course_title || "").toLowerCase().includes(value) ||
      (course.course_description || "").toLowerCase().includes(value)
    );
  }, [courses, query]);

  return (
    <div className="min-h-screen bg-[#09090F] px-4 py-10 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        <BackButton fallbackTo="/dashboard" label="Back to Dashboard" />
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-purple-300">Student</p>
            <h1 className="mt-2 text-4xl font-black">My Courses</h1>
          </div>
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#12121A] px-4 py-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search my courses"
              className="w-full bg-transparent text-white placeholder:text-gray-500 focus:outline-none"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">{error}</div>
        )}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((key) => <div key={key} className="h-60 rounded-3xl bg-white/5 animate-pulse" />)}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-[#101018] p-8 text-center text-gray-400">
            You are not enrolled in any course yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course) => {
              const courseId = Number(course.course_id ?? course.course ?? course.id);
              return (
                <div key={courseId || course.id} className="rounded-3xl border border-white/10 bg-[#101018]/85 p-5">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt="" className="h-32 w-full rounded-2xl object-cover" />
                  ) : (
                    <div className="flex h-32 items-center justify-center rounded-xl bg-[#EAF5F3] text-[#168C83]">
                      <BookOpen size={30} aria-hidden="true" />
                    </div>
                  )}
                  <h2 className="mt-5 text-xl font-bold text-white">{course.course_title || course.title}</h2>
                  <p className="mt-3 text-sm text-gray-400">{course.course_description || course.description}</p>
                  <div className="mt-5 flex items-center justify-between text-xs text-gray-400">
                    <span>{course.enrolled_at ? new Date(course.enrolled_at).toLocaleDateString() : "Enrolled"}</span>
                    <Link to={`/courses/${courseId}/learn`} className="rounded-full bg-purple-500/15 px-3 py-1.5 font-semibold text-purple-200">
                      Open
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyCourses;
