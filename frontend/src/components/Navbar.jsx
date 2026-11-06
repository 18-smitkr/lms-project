import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowRight, BookOpen, Menu, X } from "lucide-react";
import Brand from "./Brand";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return undefined;

    const updateScrollState = () => {
      header.classList.toggle("navbar-scrolled", window.scrollY > 8);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  const navLinks = (
    <>
      <NavLink
        to="/"
        end
        onClick={() => setMenuOpen(false)}
        className={({ isActive }) => `navbar-link ${isActive ? "navbar-link-active" : ""}`}
      >
        Home
      </NavLink>
      <NavLink
        to="/courses"
        onClick={() => setMenuOpen(false)}
        className={({ isActive }) => `navbar-link ${isActive ? "navbar-link-active" : ""}`}
      >
        <BookOpen size={16} aria-hidden="true" />
        Explore courses
      </NavLink>
    </>
  );

  return (
    <header
      ref={headerRef}
      data-hero-nav
      className="learnova-navbar sticky top-0 z-50 border-b border-[#E7E7E7] bg-white/95 px-4 backdrop-blur transition-[box-shadow,background-color] duration-300 sm:px-6"
    >
      <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 sm:min-h-[76px]" aria-label="Main navigation">
        <Brand />

        <div className="hidden items-center gap-1 md:flex">{navLinks}</div>

        <div className="hidden shrink-0 items-center gap-2 sm:gap-4 md:flex">
          <Link to="/login" className="rounded-lg px-2 py-2 text-sm font-semibold text-[#7D7D7D] transition hover:text-[#C44808] sm:px-3">
            Login
          </Link>
          <Link to="/register" className="inline-flex items-center gap-1.5 rounded-lg bg-[#FE580D] px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#E64E00] sm:px-5">
            Get started <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#E7E7E7] text-black transition hover:border-[#FE580D] hover:text-[#FE580D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FE580D] md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="learnova-mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </nav>

      {menuOpen && (
        <div id="learnova-mobile-navigation" className="border-t border-[#E7E7E7] bg-white px-1 pb-4 pt-3 md:hidden">
          <div className="flex flex-col gap-1" onClick={() => setMenuOpen(false)}>
            {navLinks}
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-[#E7E7E7] pt-3">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-lg border border-[#E7E7E7] px-4 py-2.5 text-center text-sm font-semibold text-black">
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="rounded-lg bg-[#FE580D] px-4 py-2.5 text-center text-sm font-semibold text-white">
                Get started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
