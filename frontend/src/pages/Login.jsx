import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import BackButton from "../components/common/BackButton";
import Brand from "../components/Brand";

function Login() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(user.role === "instructor" ? "/instructor/dashboard" : "/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const profile = await login(form);
      const destination = profile?.role === "instructor" ? "/instructor/dashboard" : "/dashboard";
      navigate(destination, { replace: true });
    } catch (err) {
      const message = err.response?.data?.detail || err.response?.data?.error || "Invalid username or password.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#09090F] px-4 py-10 text-white">
      <div className="absolute left-4 top-4 z-10 sm:left-6 sm:top-6">
        <BackButton fallbackTo="/" label="Back to Home" />
      </div>

      <div className="relative w-full max-w-lg rounded-[28px] border border-white/10 bg-[#12121A]/95 p-8 shadow-[0_0_60px_rgba(124,58,237,.18)]">
        <div className="flex flex-col items-center">
          <Brand portal="Student portal" />
          <h2 className="mt-6 text-4xl font-bold">Sign In</h2>
          <p className="mt-2 text-sm text-gray-400">Continue your learning journey.</p>
        </div>

        <div className="mt-8">
          <div className="flex items-center gap-4 my-6">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs uppercase tracking-[0.2em] text-gray-500">Login</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-gray-300">Username</label>
              <div className="icon-input-field flex items-center rounded-xl border border-white/10 bg-[#1C1C28] px-4 focus-within:border-purple-500">
                <Mail className="h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="icon-field-input w-full bg-transparent px-3 py-3 text-white placeholder:text-gray-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm text-gray-300">Password</label>
                <button type="button" className="text-sm text-purple-400 hover:text-purple-300">
                  Forgot?
                </button>
              </div>
              <div className="icon-input-field flex items-center rounded-xl border border-white/10 bg-[#1C1C28] px-4 focus-within:border-purple-500">
                <Lock className="h-5 w-5 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="icon-field-input w-full bg-transparent px-3 py-3 text-white placeholder:text-gray-500 focus:outline-none"
                  required
                />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="text-gray-500 hover:text-white">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-4 py-3 font-semibold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don&apos;t have an account?
            <Link to="/register" className="ml-2 font-semibold text-purple-400 hover:text-purple-300">
              Register
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;
