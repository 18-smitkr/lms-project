import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function BackButton({ fallbackTo = "/", label = "Back" }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    const historyState = window.history.state;
    const hasRouterHistory =
      Number.isInteger(historyState?.idx) &&
      historyState.idx > 0 &&
      historyState.key === location.key;

    if (hasRouterHistory) {
      navigate(-1);
      return;
    }

    navigate(fallbackTo, { replace: true });
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label={label}
      className="back-button mb-5 inline-flex min-h-10 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition hover:border-purple-400/40 hover:bg-purple-500/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
    >
      <ArrowLeft aria-hidden="true" className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}
