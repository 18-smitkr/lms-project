import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Bell,
  BookOpen,
  BookOpenCheck,
  ChartNoAxesCombined,
  ChevronRight,
  Heart,
  LayoutDashboard,
  LogOut,
  Settings,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import Brand from "../Brand";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: ChartNoAxesCombined, label: "My Progress", path: "/dashboard/progress" },
  { icon: BookOpen, label: "My Courses", path: "/dashboard/my-courses" },
  { icon: Heart, label: "Wishlist", path: "/dashboard/wishlist" },
  { icon: TrendingUp, label: "Learning History", path: "/dashboard/history" },
  { icon: Bell, label: "Notifications", path: "/dashboard/notifications" },
  { icon: User, label: "Profile", path: "/dashboard/profile" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

function Sidebar({ isOpen = false, onClose = () => {} }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!isOpen) return undefined;

    const bodyOverflow = document.body.style.overflow;
    const documentOverflow = document.documentElement.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    const closeOnDesktop = (event) => {
      if (event.matches) onClose();
    };
    const desktopQuery = window.matchMedia("(min-width: 768px)");

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    desktopQuery.addEventListener("change", closeOnDesktop);

    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = documentOverflow;
      document.removeEventListener("keydown", closeOnEscape);
      desktopQuery.removeEventListener("change", closeOnDesktop);
    };
  }, [isOpen, onClose]);

  const navigateTo = (path) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        aria-label="Student navigation"
        aria-modal={isOpen ? "true" : undefined}
        id="student-sidebar"
        role={isOpen ? "dialog" : undefined}
        className={`student-sidebar fixed left-0 top-0 bottom-0 z-50 flex w-72 max-w-[90vw] flex-col overflow-x-hidden overflow-y-auto overscroll-contain border-r border-[#E7E7E7] bg-[#F0F0F0] shadow-xl transition-transform duration-300 ease-out md:left-4 md:top-4 md:bottom-4 md:max-w-none md:rounded-xl md:w-20 lg:w-64 ${
          isOpen ? "translate-x-0" : "-translate-x-[calc(100%+1rem)] md:translate-x-0"
        }`}
      >
        <div className="relative flex shrink-0 items-center justify-between px-5 pb-5 pt-6 md:justify-center md:px-0 lg:justify-start lg:px-5">
          <div className="md:hidden lg:block">
            <Brand to="/dashboard" portal="Student portal" />
          </div>
          <div className="hidden md:block lg:hidden" aria-label="Learnova">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FE580D] text-white">
              <BookOpenCheck size={20} aria-hidden="true" />
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="rounded-lg p-2 text-[#737373] transition hover:bg-black/5 hover:text-[#171717] md:hidden"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="relative mx-5 shrink-0 border-t border-black/10 md:mx-3 lg:mx-5" />

        <nav
          className="sidebar-nav relative flex shrink-0 flex-col gap-1 px-3 py-4"
          aria-label="Student navigation links"
        >
          {navItems.map(({ icon: Icon, label, path }) => {
            const isActive = location.pathname === path;

            return (
              <button
                key={path}
                type="button"
                onClick={() => navigateTo(path)}
                aria-label={label}
                aria-current={isActive ? "page" : undefined}
                title={label}
                className={`group flex w-full shrink-0 items-center gap-3 rounded-xl border px-3 py-[11px] text-left text-sm font-medium transition-colors duration-200 md:justify-center md:px-0 lg:justify-start lg:px-3 ${
                  isActive
                    ? "border-transparent border-l-2 border-l-[#FE580D] bg-[#111111] text-white"
                    : "border-transparent text-[#646464] hover:bg-black/5 hover:text-[#171717]"
                }`}
              >
                <Icon
                  size={18}
                  aria-hidden="true"
                  className={`shrink-0 transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-[#777777] group-hover:text-[#171717]"
                  }`}
                />
                <span className="min-w-0 flex-1 truncate md:hidden lg:block">
                  {label}
                </span>
                {isActive && (
                  <ChevronRight
                    size={15}
                    aria-hidden="true"
                    className="shrink-0 text-white/80 md:hidden lg:block"
                  />
                )}
              </button>
            );
          })}

          <div className="my-2 shrink-0 border-t border-black/10 md:mx-1 lg:mx-2" />

          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full shrink-0 items-center gap-3 rounded-xl border border-transparent px-3 py-[11px] text-left text-sm font-medium text-[#646464] transition-colors duration-200 hover:bg-red-500/10 hover:text-red-600 md:justify-center md:px-0 lg:justify-start lg:px-3"
            title="Logout"
          >
            <LogOut
              size={18}
              aria-hidden="true"
              className="shrink-0 transition-colors group-hover:text-red-300"
            />
            <span className="md:hidden lg:block">Logout</span>
          </button>
        </nav>

        <div className="student-profile-footer relative shrink-0 p-3 pb-4">
          <div className="student-profile flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.035] p-2.5 transition-colors hover:bg-white/[0.07] md:justify-center md:border-transparent md:bg-transparent md:p-0 lg:justify-start lg:border-white/[0.08] lg:bg-white/[0.035] lg:p-2.5">
            <button
              type="button"
              onClick={() => navigateTo("/dashboard/profile")}
              className="flex min-w-0 flex-1 items-center gap-3 rounded-xl text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#65C9BE] md:flex-none lg:flex-1"
              aria-label={`Open profile for ${user?.username || "student"}`}
            >
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FE580D] text-sm font-bold text-white"
              >
                {(user?.username || "U").slice(0, 1).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1 md:hidden lg:block">
                <span className="student-profile-name block truncate text-[13px] font-semibold leading-tight">
                  {user?.username || "Student"}
                </span>
                <span className="student-profile-role mt-1 block truncate text-[11px] capitalize">
                  {user?.role || "student"}
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => navigateTo("/dashboard/settings")}
              aria-label="Open settings"
              title="Settings"
              className="student-profile-settings shrink-0 rounded-lg p-2 transition hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FE580D] md:hidden lg:block"
            >
              <Settings size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
