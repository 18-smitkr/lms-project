import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye } from "lucide-react";
import API from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { fetchProfile } = useAuth();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("auth/login/", {
        username: form.username,
        password: form.password,
      });

localStorage.setItem("access", res.data.access);
localStorage.setItem("refresh", res.data.refresh);

console.log("Login Success");

// Update AuthContext with the logged-in user
await fetchProfile();

navigate("/dashboard");

console.log("Current URL:", window.location.pathname);
    } catch (err) {
      alert("Invalid username or password");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="h-screen overflow-hidden flex items-center justify-center bg-[#09090F] px-4">

      {/* Purple Background Glow */}

      <div className="absolute w-162.5 h-162.5 rounded-full bg-purple-700/20 blur-[150px]" />

      {/* Login Card */}

      <div className="relative w-full max-w-130 rounded-3xl border border-white/10 bg-[#12121A]/95 backdrop-blur-xl p-8 shadow-[0_0_60px_rgba(124,58,237,.18)]">

        {/* Logo */}

        <h1 className="text-4xl font-bold text-center">
          <span className="text-white">Learn</span>
          <span className="text-purple-500">ova</span>
        </h1>

        <h2 className="text-5xl font-bold text-center text-white mt-6">
          Sign In
        </h2>

        <p className="text-center text-gray-400 mt-2">
          Continue your personalized learning journey
        </p>

        {/* Divider */}

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-gray-500 text-sm">LOGIN</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Username */}

          <div>
            <label className="text-gray-300 mb-2 block">
              Username
            </label>

            <div className="flex items-center bg-[#1C1C28] border border-white/10 rounded-xl px-4 focus-within:border-purple-500 transition">

              <Mail className="w-5 h-5 text-gray-500" />

              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter username"
                className="w-full bg-transparent px-3 py-3 outline-none text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Password */}

          <div>

            <div className="flex justify-between mb-2">

              <label className="text-gray-300">
                Password
              </label>

              <button
                type="button"
                className="text-purple-400 text-sm hover:text-purple-300"
              >
                Forgot?
              </button>

            </div>

            <div className="flex items-center bg-[#1C1C28] border border-white/10 rounded-xl px-4 focus-within:border-purple-500 transition">

              <Lock className="w-5 h-5 text-gray-500" />

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full bg-transparent px-3 py-3 outline-none text-white placeholder:text-gray-500"
              />

              <Eye className="w-5 h-5 text-gray-500 cursor-pointer" />

            </div>

          </div>

          {/* Remember */}

          <div className="flex items-center justify-between text-sm">

            <label className="flex items-center gap-2 text-gray-400">

              <input
                type="checkbox"
                className="accent-purple-600"
              />

              Remember me

            </label>

          </div>

          {/* Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-linear-to-r from-purple-600 to-fuchsia-600 text-white font-semibold text-lg hover:scale-[1.02] transition"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

        </form>

        <p className="text-center text-gray-400 mt-6">
          Don't have an account?

          <Link
            to="/register"
            className="text-purple-400 ml-2 font-semibold hover:text-purple-300"
          >
            Register
          </Link>

        </p>

      </div>

    </section>
  );
}

export default Login;