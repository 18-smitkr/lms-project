import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { EmptyState, ErrorBanner, FeatureLayout, LoadingState } from "./FeatureStates";

function LearningHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("progress/my-progress/")
      .then((response) => setHistory(response.data || []))
      .catch((err) => setError(err.response?.data?.detail || "Unable to load learning history."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <FeatureLayout title="Learning history" eyebrow="Student">
      {error && <ErrorBanner message={error} />}
      {loading ? <LoadingState /> : history.length === 0 ? <EmptyState message="Completed lessons will appear here." /> : (
        <div className="space-y-3">
          {history.map((item) => (
            <article key={item.id} className="flex flex-col justify-between gap-3 rounded-2xl border border-white/10 bg-[#101018]/85 p-5 sm:flex-row sm:items-center">
              <div><h2 className="font-semibold text-white">{item.lesson_title}</h2><p className="mt-1 text-sm text-gray-400">{item.course_title}</p><time className="mt-2 block text-xs text-gray-500">{new Date(item.completed_at).toLocaleString()}</time></div>
              <Link to={`/courses/${item.course_id}/learn`} className="rounded-full bg-purple-500/15 px-4 py-2 text-center text-sm font-semibold text-purple-200">Resume course</Link>
            </article>
          ))}
        </div>
      )}
    </FeatureLayout>
  );
}

export default LearningHistory;
