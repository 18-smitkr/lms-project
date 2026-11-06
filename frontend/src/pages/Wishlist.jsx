import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import API from "../api/axios";
import { EmptyState, ErrorBanner, FeatureLayout, LoadingState } from "./FeatureStates";

function Wishlist() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    API.get("wishlist/")
      .then((response) => {
        if (active) setCourses(response.data || []);
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.error || "Unable to load your wishlist.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const removeCourse = async (courseId) => {
    try {
      await API.delete(`wishlist/${courseId}/`);
      setCourses((items) => items.filter((item) => item.course_id !== courseId));
    } catch (err) {
      setError(err.response?.data?.error || "Unable to remove this course.");
    }
  };

  return (
    <FeatureLayout title="Wishlist" eyebrow="Student">
      {error && <ErrorBanner message={error} />}
      {loading ? <LoadingState /> : courses.length === 0 ? (
        <EmptyState message="Your wishlist is empty. Save courses from the catalogue to find them here." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <article key={course.id} className="rounded-3xl border border-white/10 bg-[#101018]/85 p-5">
              {course.thumbnail_url ? (
                <img src={course.thumbnail_url} alt="" className="mb-4 h-32 w-full rounded-xl object-cover" />
              ) : (
                <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-[#EAF5F3] text-[#168C83]">
                  <BookOpen size={30} aria-hidden="true" />
                </div>
              )}
              <h2 className="text-xl font-bold text-white">{course.title}</h2>
              <p className="mt-3 line-clamp-3 text-sm text-gray-400">{course.description}</p>
              <p className="mt-4 font-semibold text-purple-300">₹{Number(course.price || 0)}</p>
              <div className="mt-5 flex gap-3">
                <Link to={`/courses/${course.course_id}`} className="rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white">View course</Link>
                <button onClick={() => removeCourse(course.course_id)} className="rounded-full border border-white/10 px-4 py-2 text-sm text-gray-300">Remove</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </FeatureLayout>
  );
}

export default Wishlist;
