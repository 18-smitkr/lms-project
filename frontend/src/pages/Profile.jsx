import { useState } from "react";
import API from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import { ErrorBanner, FeatureLayout } from "./FeatureStates";

function Profile() {
  const { user, fetchProfile } = useAuth();
  const [form, setForm] = useState(() => ({
    email: user?.email || "",
    phone_number: user?.phone_number || "",
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await API.patch("auth/profile/", form);
      await fetchProfile();
      setSuccess("Profile updated.");
    } catch (err) {
      setError(Object.values(err.response?.data || {}).flat().join(" ") || "Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <FeatureLayout title="Profile" eyebrow="Account">
      {error && <ErrorBanner message={error} />}
      {success && <div role="status" className="mb-5 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-green-200">{success}</div>}
      <form onSubmit={saveProfile} className="max-w-2xl space-y-5 rounded-3xl border border-white/10 bg-[#101018]/85 p-6">
        <div><label className="mb-2 block text-sm text-gray-300">Username</label><input disabled value={user?.username || ""} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-gray-400" /></div>
        <div><label className="mb-2 block text-sm text-gray-300">Email</label><input type="email" required value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-[#151521] px-4 py-3 text-white" /></div>
        <div><label className="mb-2 block text-sm text-gray-300">Phone number</label><input value={form.phone_number} onChange={(event) => setForm((current) => ({ ...current, phone_number: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-[#151521] px-4 py-3 text-white" /></div>
        <button disabled={saving} className="rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-5 py-3 font-semibold text-white disabled:opacity-60">{saving ? "Saving..." : "Save profile"}</button>
      </form>
    </FeatureLayout>
  );
}

export default Profile;
