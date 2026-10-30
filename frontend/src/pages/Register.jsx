import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
} from "lucide-react";
import { registerUser } from "../api/auth";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    role: "student",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone_number,
        role: formData.role,
      });

      setSuccess("Registration Successful!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {

      if (err.response?.data) {

        const errors = Object.values(err.response.data)
          .flat()
          .join(" ");

        setError(errors);

      } else {

        setError("Something went wrong.");

      }

    } finally {

      setLoading(false);

    }
  };

  return (
    <section className="relative h-screen overflow-hidden flex items-center justify-center bg-[#09090B] px-4">

      {/* Background Glow */}

      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-162.5-[650px] rounded-full bg-purple-700/20 blur-[170px]" />

      <div className="absolute bottom-0 left-0 w-72 h-72 bg-fuchsia-600/10 rounded-full blur-[140px]" />

      <div className="absolute top-10 right-0 w-72 h-72 bg-violet-600/10 rounded-full blur-[140px]" />

      {/* Card */}

      <div
        className="
        relative
        w-full
        max-w-155
        rounded-[28px]
        border
        border-white/10
        bg-[#12121A]/95
        backdrop-blur-xl
        px-8
        py-7
        shadow-[0_20px_80px_rgba(124,58,237,.25)]
        "
      >

        <h1 className="text-3xl font-bold text-center">
          <span className="text-white">Learn</span>
          <span className="text-purple-500">ova</span>
        </h1>

        <h2 className="text-[42px] font-bold text-center text-white mt-5">
          Create Account
        </h2>

        <p className="text-center text-gray-400 text-sm mt-2">
          Join Learnova and start learning today.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4"
        >

          {/* Username + Email */}

          <div className="grid md:grid-cols-2 gap-4">

            <div className="relative">

              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full bg-[#1C1C28] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:border-purple-500"
              />

            </div>

            <div className="relative">

              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-[#1C1C28] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:border-purple-500"
              />

            </div>

          </div>
              {/* Phone + Role */}

          <div className="grid md:grid-cols-2 gap-4">

            <div className="relative">

              <Phone
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                name="phone_number"
                placeholder="Phone Number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full bg-[#1C1C28] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:border-purple-500"
              />

            </div>

            <div className="relative">

              <GraduationCap
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full appearance-none bg-[#1C1C28] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:border-purple-500"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>

            </div>

          </div>

          {/* Password + Confirm Password */}

          <div className="grid md:grid-cols-2 gap-4">

            <div className="relative">

              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-[#1C1C28] border border-white/10 rounded-xl pl-11 pr-12 py-3 text-white outline-none focus:border-purple-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

            <div className="relative">

              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full bg-[#1C1C28] border border-white/10 rounded-xl pl-11 pr-12 py-3 text-white outline-none focus:border-purple-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

          </div>

          {/* Error */}

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Success */}

          {success && (
            <div className="rounded-xl bg-green-500/10 border border-green-500/30 p-3 text-green-400 text-sm">
              {success}
            </div>
          )}

          {/* Button */}

          <button
            type="submit"
            disabled={loading}
            className="
            w-full
            h-12
            rounded-xl
            bg-linear-to-r
            from-purple-600
            to-fuchsia-600
            text-white
            font-semibold
            hover:from-purple-500
            hover:to-fuchsia-500
            transition-all
            duration-300
            shadow-lg
            shadow-purple-600/30
            disabled:opacity-60
            "
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <p className="text-center text-gray-400 mt-5">

          Already have an account?

          <Link
            to="/login"
            className="ml-2 text-purple-400 font-semibold hover:text-purple-300"
          >
            Sign In
          </Link>

        </p>

      </div>

    </section>
  );
}

export default Register;