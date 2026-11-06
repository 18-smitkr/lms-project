import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import API from "../api/axios";
import BackButton from "../components/common/BackButton";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await API.get("courses/");
        setCourses(response.data || []);
      } catch {
        setError("Unable to load courses right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    const value = query.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesPrice =
        priceFilter === "all" ||
        (priceFilter === "free"
          ? Number(course.price) === 0
          : Number(course.price) > 0);
      const matchesQuery =
        !value ||
        [course.title, course.description].some((field) =>
          String(field || "").toLowerCase().includes(value)
        );

      return matchesPrice && matchesQuery;
    });
  }, [courses, query, priceFilter]);
  const hasActiveFilters = Boolean(query.trim()) || priceFilter !== "all";

  return (
    <div className="min-h-screen bg-[#09090F] px-4 py-10 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        <BackButton fallbackTo="/" label="Back to Home" />
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-purple-300">Catalog</p>
            <h1 className="mt-2 text-4xl font-black">All Courses</h1>
          </div>

          <div className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses"
              className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-[#12121A] px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none"
            />
            <select value={priceFilter} onChange={(event) => setPriceFilter(event.target.value)} aria-label="Filter by price" className="rounded-2xl border border-white/10 bg-[#12121A] px-4 py-3 text-white">
              <option value="all">All prices</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">{error}</div>
        )}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((key) => (
              <div key={key} className="h-72 rounded-3xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : error ? null : filteredCourses.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-[#101018] p-8 text-center text-gray-400">
            {hasActiveFilters
              ? "No courses match your search."
              : "No courses are available yet. Check back soon."}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course) => (
              <div key={course.id} className="rounded-3xl border border-white/10 bg-[#101018]/85 p-5">
                {course.thumbnail_url ? (
                  <img src={course.thumbnail_url} alt="" className="h-32 w-full rounded-2xl object-cover" />
                ) : (
                  <div className="flex h-32 items-center justify-center rounded-xl bg-[#EAF5F3] text-[#168C83]">
                    <BookOpen size={30} aria-hidden="true" />
                  </div>
                )}
                <div className="mt-5 flex items-center justify-between gap-4">
                  <h2 className="text-xl font-bold text-white">{course.title}</h2>
                  <span className="rounded-full bg-purple-500/15 px-2 py-1 text-xs font-semibold text-purple-200">₹{Number(course.price || 0)}</span>
                </div>
                <p className="mt-3 text-sm text-gray-400 line-clamp-3">{course.description}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-gray-500">Course</span>
                  <Link to={`/courses/${course.id}`} className="rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-2 text-sm font-semibold text-white">
                    View details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Courses;
