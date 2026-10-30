import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import {
  LayoutDashboard,
  BookOpen,
  Heart,
  Award,
  TrendingUp,
  Calendar,
  User,
  Settings,
  LogOut,
  Zap,
  ChevronRight,
} from "lucide-react";

const navItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard",
    badge: null,
  },
  {
    icon: BookOpen,
    label: "My Courses",
    path: "/dashboard/my-courses",
    badge: "12",
  },
  {
    icon: Heart,
    label: "Wishlist",
    path: "/dashboard/wishlist",
    badge: "4",
  },
  {
    icon: Award,
    label: "Certificates",
    path: "/dashboard/certificates",
    badge: null,
  },
  {
    icon: TrendingUp,
    label: "Progress",
    path: "/dashboard/progress",
    badge: null,
  },
  {
    icon: Calendar,
    label: "Schedule",
    path: "/dashboard/schedule",
    badge: "2",
  },
  {
    icon: User,
    label: "Profile",
    path: "/dashboard/profile",
    badge: null,
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/dashboard/settings",
    badge: null,
  },
];

function Sidebar() {
 const navigate = useNavigate();
 const location = useLocation();

  const { user, logout } = useAuth();

  // const [active, setActive] = useState("Dashboard");

const handleNavigation = (item) => {
    navigate(item.path);
};

  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  return (
    <aside
      className="fixed left-4 top-4 bottom-4 w-64 z-50 flex flex-col rounded-3xl glass-ultra overflow-hidden"
      style={{
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.065), 0 32px 64px rgba(0,0,0,0.6)",
      }}
    >
      {/* Ambient blobs */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">

        <div
          className="absolute -top-20 -left-10 w-48 h-48 rounded-full opacity-20 animate-float-slow"
          style={{
            background:
              "radial-gradient(circle, rgba(147,51,234,0.5), transparent 70%)",
          }}
        />

        <div
          className="absolute bottom-20 -right-12 w-36 h-36 rounded-full opacity-15 animate-float-medium"
          style={{
            background:
              "radial-gradient(circle, rgba(249,115,22,0.4), transparent 70%)",
          }}
        />

      </div>

      {/* Logo */}

      <div className="relative px-5 pt-6 pb-5">

        <div className="flex items-center gap-3">

          <div
            className="relative w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background:
                "linear-gradient(135deg,#9333EA,#7C3AED)",
              boxShadow:
                "0 0 20px rgba(147,51,234,.6),0 4px 12px rgba(0,0,0,.4)",
            }}
          >
            <Zap
              size={18}
              className="text-white"
            />
          </div>

          <div>

            <div className="text-[20px] font-black tracking-tight text-gradient-purple">
              Learnova
            </div>

            <div className="text-[10px] text-white/25 font-medium tracking-[0.12em] uppercase mt-0.5">
              Student Portal
            </div>

          </div>

        </div>

      </div>

      <div className="mx-5 divider" />

      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">

        <p className="text-[10px] font-semibold text-white/20 tracking-[0.14em] uppercase px-3 mb-3">
          Navigation
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;

          const isActive =
          location.pathname === item.path ||
          location.pathname.startsWith(item.path + "/");

          return (
            <button
              key={item.label}
              onClick={() => handleNavigation(item)}
              className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-[13.5px] font-medium transition-all duration-200 border cursor-pointer ${
                isActive
                  ? "nav-active text-white"
                  : "text-white/40 border-transparent hover:bg-white/4 hover:text-white/75 hover:border-white/6"
              }`}
            >
              <div
                className={`${
                  isActive
                    ? "text-purple-400"
                    : "text-white/30 group-hover:text-white/60"
                }`}
              >
                <Icon size={16} />
              </div>

              <span className="flex-1 text-left">
                {item.label}
              </span>

              {item.badge && !isActive && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-lg bg-white/[0.07] text-white/30">
                  {item.badge}
                </span>
              )}

              {isActive && (
                <ChevronRight
                  size={12}
                  className="text-purple-400/60"
                />
              )}

            </button>
          );
        })}

        <div className="pt-2 pb-1">
          <div className="mx-3 divider" />
        </div>

        <button
          onClick={handleLogout}
          className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-[13.5px] font-medium text-white/30 border border-transparent hover:bg-red-500/6 hover:text-red-400/80 hover:border-red-500/12 transition-all duration-200 cursor-pointer"
        >
          <LogOut size={16} />

          Logout

        </button>

      </nav>
    
          {/* Bottom Section */}

      <div className="px-3 pb-4 space-y-3">

        {/* XP Card */}

        <div
          className="px-4 py-3.5 rounded-2xl"
          style={{
            background: "rgba(147,51,234,0.08)",
            border: "1px solid rgba(147,51,234,0.18)",
          }}
        >

          <div className="flex items-center justify-between mb-2">

            <span className="text-[11px] font-semibold text-white/50">
              Level 8 · XP
            </span>

            <span className="text-[11px] font-bold text-purple-400">
              780 / 1000
            </span>

          </div>

          <div className="progress-track h-1.5">

            <div
              className="progress-fill-purple"
              style={{ width: "78%" }}
            />

          </div>

          <p className="text-[10px] text-white/25 mt-1.5">
            220 XP to Level 9
          </p>

        </div>

        {/* User Card */}

        <div
          className="flex items-center gap-3 px-3.5 py-3 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-white/4"
          style={{
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >

          <div className="relative shrink-0">

            <img
              src={`https://ui-avatars.com/api/?name=${
                user?.username || "User"
              }&background=7C3AED&color=fff&bold=true`}
              alt={user?.username}
              className="w-9 h-9 rounded-full object-cover"
              style={{
                boxShadow: "0 0 0 2px rgba(147,51,234,0.5)",
              }}
            />

            <div
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
              style={{
                background: "#22C55E",
                borderColor: "#0D0D14",
                boxShadow: "0 0 6px rgba(34,197,94,0.6)",
              }}
            />

          </div>

          <div className="flex-1 min-w-0">

            <p className="text-[13px] font-semibold text-white/90 truncate leading-tight">
              {user?.username || "Loading..."}
            </p>

            <p className="text-[11px] text-white/35 truncate capitalize">
              {user?.role || ""}
            </p>

          </div>

          <Settings
            size={13}
            className="text-white/20 shrink-0"
          />

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;