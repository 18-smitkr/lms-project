import { Link, NavLink } from "react-router-dom";
import icon from "../assets/icon.svg";
import homeIcon from "../assets/home.png";
import courseIcon from "../assets/course.png";
import aboutIcon from "../assets/about.png";
import contactIcon from "../assets/contact.png";

function Navbar() {
  const navItems = [
    { to: "/", label: "Home", icon: homeIcon, end: true },
    { to: "/courses", label: "Courses", icon: courseIcon },
    { to: "/about", label: "About", icon: aboutIcon },
    { to: "/contact", label: "Contact", icon: contactIcon },
  ];

  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full px-6">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
       <Link to="/" className="group flex items-center gap-4">

  <h1
    className="
      text-4xl
      font-black
      tracking-tight
      transition-all
      duration-300
      group-hover:scale-105
    "
  >

    <span className="text-white">
      Learn
    </span>

    <span
      className="
      bg-linear-to-r
      from-purple-400
      via-fuchsia-500
      to-purple-600
      bg-clip-text
      text-transparent
      "
    >
      ova
    </span>

  </h1>

</Link>

        {/* Glass Menu */}
        <div
          className="
            hidden lg:flex
            items-center
            gap-2
            px-3
            py-3
            rounded-full
            bg-white/10
            backdrop-blur-2xl
            border border-white/15
            shadow-[0_8px_40px_rgba(255,255,255,0.08)]
          "
        >
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-white/15 border border-white/20 text-white"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`
              }
            >
              <img
                src={item.icon}
                alt={item.label}
                className="w-5 h-5"
              />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">

          <NavLink
            to="/login"
            className="text-gray-300 hover:text-white font-medium transition"
          >
            Login
          </NavLink>

          <Link
            to="/register"
            className="
              px-8
              py-4
              rounded-full
              bg-linear-to-r
              from-orange-500
              to-orange-400
              text-white
              font-semibold
              hover:scale-105
              transition
              shadow-lg
            "
          >
            Get Started →
          </Link>

        </div>

      </nav>
    </header>
  );
}

export default Navbar;