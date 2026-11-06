import { BookOpenCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function Brand({ to = "/", portal = "", compact = false, inverse = false }) {
  return (
    <Link
      to={to}
      className="inline-flex min-w-0 items-center gap-3"
      aria-label={to === "/" ? "Learnova home" : "Learnova dashboard"}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FE580D] text-white">
        <BookOpenCheck size={21} strokeWidth={2} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className={`block text-lg font-bold leading-tight tracking-tight ${inverse ? "text-white" : "text-[#171717]"}`}>
          Learnova
        </span>
        {!compact && (
          <span className={`mt-0.5 hidden text-[10px] font-semibold uppercase tracking-[0.14em] sm:block ${inverse ? "text-white/60" : "text-[#718096]"}`}>
            {portal || "Learn with purpose"}
          </span>
        )}
      </span>
    </Link>
  );
}
