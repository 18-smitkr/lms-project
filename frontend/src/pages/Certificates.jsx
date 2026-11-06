import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { EmptyState, ErrorBanner, FeatureLayout, LoadingState } from "./FeatureStates";

function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("progress/certificates/")
      .then((response) => setCertificates(response.data || []))
      .catch((err) => setError(err.response?.data?.detail || "Unable to load certificates."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <FeatureLayout title="Certificates" eyebrow="Student">
      {error && <ErrorBanner message={error} />}
      {loading ? <LoadingState /> : certificates.length === 0 ? <EmptyState message="Complete all lessons in a course to earn a certificate." /> : (
        <div className="grid gap-5 md:grid-cols-2">
          {certificates.map((certificate) => (
            <article key={certificate.certificate_id} className="rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-[#101018] p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-purple-300">Certificate of completion</div>
              <h2 className="mt-3 text-2xl font-bold text-white">{certificate.course_title}</h2>
              <p className="mt-3 break-all text-xs text-gray-400">Credential ID: {certificate.certificate_id}</p>
              <p className="mt-2 text-sm text-gray-400">Issued {new Date(certificate.issued_at).toLocaleDateString()}</p>
              <Link to={`/courses/${certificate.course_id}/learn`} className="mt-5 inline-block rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white">View course</Link>
            </article>
          ))}
        </div>
      )}
    </FeatureLayout>
  );
}

export default Certificates;
