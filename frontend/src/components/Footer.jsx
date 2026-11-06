import { ArrowUp, ArrowUpRight, BookOpenCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Footer() {
  const { user } = useAuth();

  const backToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  return (
    <footer id="site-footer" className="relative overflow-hidden bg-[#000000] text-white">
      <svg aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-72 w-72 opacity-20" viewBox="0 0 240 240" fill="none">
        <pattern id="footer-dots" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="#62BF8E" />
        </pattern>
        <path d="M0 0h240v240H0z" fill="url(#footer-dots)" />
      </svg>

      <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-16 sm:px-8 sm:pt-20">
        <div className="grid gap-12 border-b border-white/15 pb-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-10">
          <div className="max-w-sm">
            <Link to="/" className="inline-flex items-center gap-3" aria-label="Learnova home">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FE580D] text-black">
                <BookOpenCheck size={23} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span className="text-2xl font-semibold tracking-tight text-white">Learnova</span>
            </Link>
            <p className="mt-5 text-sm leading-7 text-white/60">
              Learnova helps learners discover knowledge, build practical skills and move closer to their goals.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-[#62BF8E]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#62BF8E]" />
              Learn with purpose
            </span>
          </div>

          <FooterColumn title="Explore">
            <FooterLink to="/courses">Explore courses</FooterLink>
            <FooterLink to="/#features">Learning features</FooterLink>
          </FooterColumn>

          <FooterColumn title="Learnova">
            <FooterLink to="/#features">Why Learnova</FooterLink>
            <FooterLink to="/#how-it-works">How it works</FooterLink>
          </FooterColumn>

          <FooterColumn title="Account">
            {user ? (
              <>
                <FooterLink to={user.role === "instructor" ? "/instructor/dashboard" : "/dashboard"}>
                  {user.role === "instructor" ? "Instructor dashboard" : "Student dashboard"}
                </FooterLink>
                <FooterLink to="/dashboard/profile">Profile</FooterLink>
                <FooterLink to="/dashboard/settings">Settings</FooterLink>
              </>
            ) : (
              <>
                <FooterLink to="/login">Sign in</FooterLink>
                <FooterLink to="/register">Create account</FooterLink>
              </>
            )}
          </FooterColumn>
        </div>

        <div className="flex flex-col gap-5 pt-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Learnova. All rights reserved.</span>
          <span className="flex items-center gap-5">
            <span>Built for your next chapter.</span>
            <button
              type="button"
              onClick={backToTop}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-2 font-semibold text-white transition-colors hover:border-[#FE580D] hover:text-[#FE580D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FE580D]"
            >
              Back to top <ArrowUp size={14} aria-hidden="true" />
            </button>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      <ul className="mt-5 space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ to, children }) {
  return (
    <li>
      <Link to={to} className="group inline-flex items-center gap-1 text-sm text-white/60 transition-colors hover:text-[#FE580D]">
        {children}
        <ArrowUpRight size={13} className="opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
      </Link>
    </li>
  );
}

export default Footer;
