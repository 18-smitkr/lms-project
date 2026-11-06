import { ChevronDown, LogOut, UserCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function ProfileDropdown() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="student-profile-trigger flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FE580D] text-sm font-bold text-white">
          {(user?.username || "U").charAt(0).toUpperCase()}
        </div>
        <div className="hidden sm:block">
          <p className="student-profile-name text-sm font-semibold">{user?.username || "Student"}</p>
          <p className="student-profile-role text-[10px] uppercase tracking-[0.2em]">{user?.role || "student"}</p>
        </div>
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-52 rounded-2xl border border-white/10 bg-[#12121A] p-2 shadow-2xl">
          <button type="button" onClick={() => navigate("/dashboard/profile")} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-200 hover:bg-white/5">
            <UserCircle size={16} /> Profile
          </button>
          <button type="button" onClick={() => navigate("/dashboard/settings")} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-200 hover:bg-white/5">
            Settings
          </button>
          <button type="button" onClick={handleLogout} className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-300 hover:bg-red-500/10">
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
