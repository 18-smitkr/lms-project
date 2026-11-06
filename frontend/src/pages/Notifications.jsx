import { useEffect, useState } from "react";
import API from "../api/axios";
import { EmptyState, ErrorBanner, FeatureLayout, LoadingState } from "./FeatureStates";

function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    API.get("notifications/")
      .then((response) => {
        if (active) setItems(response.data || []);
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.detail || "Unable to load notifications.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const markRead = async (id) => {
    try {
      await API.patch(`notifications/${id}/read/`);
      setItems((notifications) => notifications.map((item) => item.id === id ? { ...item, is_read: true } : item));
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to update the notification.");
    }
  };

  return (
    <FeatureLayout title="Notifications" eyebrow="Student">
      {error && <ErrorBanner message={error} />}
      {loading ? <LoadingState /> : items.length === 0 ? <EmptyState message="You have no notifications." /> : (
        <div className="space-y-3">
          {items.map((item) => (
            <article key={item.id} className={`rounded-2xl border p-5 ${item.is_read ? "border-white/10 bg-[#101018]" : "border-purple-500/30 bg-purple-500/5"}`}>
              <div className="flex flex-col justify-between gap-3 sm:flex-row">
                <div><h2 className="font-semibold text-white">{item.title}</h2><p className="mt-2 text-sm text-gray-300">{item.message}</p><time className="mt-3 block text-xs text-gray-500">{new Date(item.created_at).toLocaleString()}</time></div>
                {!item.is_read && <button onClick={() => markRead(item.id)} className="self-start rounded-full border border-white/10 px-3 py-2 text-sm text-purple-200">Mark read</button>}
              </div>
            </article>
          ))}
        </div>
      )}
    </FeatureLayout>
  );
}

export default Notifications;
