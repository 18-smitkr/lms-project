import { useState } from "react";
import API from "../api/axios";
import { ErrorBanner, FeatureLayout } from "./FeatureStates";

function Settings() {
  const [form, setForm] = useState({ current_password: "", new_password: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const changePassword = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const response = await API.post("auth/change-password/", form);
      setSuccess(response.data.message || "Password changed.");
      setForm({ current_password: "", new_password: "" });
    } catch (err) {
      setError(Object.values(err.response?.data || {}).flat().join(" ") || "Unable to change your password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <FeatureLayout title="Account settings" eyebrow="Account">
      {error && <ErrorBanner message={error} />}
      {success && <div role="status" className="mb-5 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-green-200">{success}</div>}
      <form onSubmit={changePassword} className="max-w-2xl space-y-5 rounded-3xl border border-white/10 bg-[#101018]/85 p-6">
        <div><label className="mb-2 block text-sm text-gray-300">Current password</label><input required type="password" autoComplete="current-password" value={form.current_password} onChange={(event) => setForm((current) => ({ ...current, current_password: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-[#151521] px-4 py-3 text-white" /></div>
        <div><label className="mb-2 block text-sm text-gray-300">New password</label><input required minLength={8} type="password" autoComplete="new-password" value={form.new_password} onChange={(event) => setForm((current) => ({ ...current, new_password: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-[#151521] px-4 py-3 text-white" /></div>
        <button disabled={saving} className="rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-5 py-3 font-semibold text-white disabled:opacity-60">{saving ? "Updating..." : "Change password"}</button>
      </form>
    </FeatureLayout>
  );
}

export default Settings;
