import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";

function Footer() {
  return (
    <footer className="relative bg-black text-white overflow-hidden">

      {/* Background Glow */}
      <div className="absolute left-0 bottom-0 w-125500px] bg-purple-700/20 blur-[180px] rounded-full"></div>
      <div className="absolute right-0 top-0 w-100 h-100 bg-orange-500/10 blur-[180px] rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 pt-24 pb-10">

        <div className="grid lg:grid-cols-2 gap-20">

          {/* LEFT */}
          <div>

            <h2 className="text-6xl font-extrabold leading-tight">
              Let's build something
              <span className="text-orange-500"> amazing.</span>
            </h2>

            <p className="mt-8 text-gray-400 text-lg max-w-md">
              Learn, grow and achieve your goals with Learnova's
              personalized learning experience.
            </p>

            <h3 className="mt-14 text-lg font-semibold">
              Follow Us
            </h3>

            <div className="flex gap-4 mt-6">

              {[
                <FaInstagram />,
                <FaXTwitter />,
                <FaFacebookF />,
                <FaLinkedinIn />,
              ].map((icon, index) => (

                <button
                  key={index}
                  className="
                  w-12
                  h-12
                  rounded-full
                  bg-[#171717]
                  border
                  border-white/10
                  flex
                  items-center
                  justify-center
                  text-lg
                  transition-all
                  duration-300
                  hover:bg-orange-500
                  hover:border-orange-500
                  hover:-translate-y-1
                  hover:shadow-[0_0_30px_rgba(249,115,22,.45)]
                  "
                >
                  {icon}
                </button>

              ))}

            </div>

          </div>

          {/* RIGHT */}

          <div>

            {/* Email */}

            <div className="flex items-center bg-[#141414] border border-white/10 rounded-full px-6 py-3">

              <input
                type="email"
                placeholder="Enter your email"
                className="
                flex-1
                bg-transparent
                outline-none
                text-lg
                text-white
                placeholder:text-gray-500
                "
              />

              <button
                className="
                w-12
                h-12
                rounded-full
                bg-orange-500
                text-white
                flex
                items-center
                justify-center
                transition-all
                duration-300
                hover:bg-orange-400
                hover:rotate-45
                hover:shadow-[0_0_25px_rgba(249,115,22,.45)]
                "
              >
                <FiArrowUpRight size={22} />
              </button>

            </div>

            {/* Footer Links */}

            <div className="grid grid-cols-3 gap-12 mt-16">

              <div>

                <h4 className="font-semibold text-white mb-5">
                  Company
                </h4>

                <ul className="space-y-3 text-gray-400">

                  <li className="hover:text-orange-500 cursor-pointer transition">
                    Home
                  </li>

                  <li className="hover:text-orange-500 cursor-pointer transition">
                    Courses
                  </li>

                  <li className="hover:text-orange-500 cursor-pointer transition">
                    About
                  </li>

                  <li className="hover:text-orange-500 cursor-pointer transition">
                    Contact
                  </li>

                </ul>

              </div>

              <div>

                <h4 className="font-semibold text-white mb-5">
                  Resources
                </h4>

                <ul className="space-y-3 text-gray-400">

                  <li className="hover:text-orange-500 cursor-pointer transition">
                    Blog
                  </li>

                  <li className="hover:text-orange-500 cursor-pointer transition">
                    Tutorials
                  </li>

                  <li className="hover:text-orange-500 cursor-pointer transition">
                    Community
                  </li>

                  <li className="hover:text-orange-500 cursor-pointer transition">
                    Careers
                  </li>

                </ul>

              </div>

              <div>

                <h4 className="font-semibold text-white mb-5">
                  Support
                </h4>

                <ul className="space-y-3 text-gray-400">

                  <li className="hover:text-orange-500 cursor-pointer transition">
                    Help Center
                  </li>

                  <li className="hover:text-orange-500 cursor-pointer transition">
                    FAQ
                  </li>

                  <li className="hover:text-orange-500 cursor-pointer transition">
                    Privacy
                  </li>

                  <li className="hover:text-orange-500 cursor-pointer transition">
                    Terms
                  </li>

                </ul>

              </div>

            </div>

          </div>

        </div>

        {/* Divider */}

        <div className="border-t border-white/10 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-5">

          <p className="text-gray-500">
            © 2026 Learnova. All rights reserved.
          </p>

          <div className="flex gap-8 text-gray-500">

            <a
              href="#"
              className="hover:text-orange-500 transition"
            >
              Terms & Conditions
            </a>

            <a
              href="#"
              className="hover:text-orange-500 transition"
            >
              Privacy Policy
            </a>

          </div>

        </div>

      </div>

      {/* Huge Background Logo */}

<h1
  className="
    absolute
    bottom-2
    left-1/2
    -translate-x-1/2
    text-[180px]
    lg:text-[220px]
    font-black
    tracking-tight
    whitespace-nowrap
    pointer-events-none
    select-none

    text-transparent
    bg-linear-to-b
    from-white/10
    via-white/5
    to-white/0
    bg-clip-text

    [-webkit-text-stroke:1px_rgba(255,255,255,0.08)]
    [text-shadow:0_0_40px_rgba(168,85,247,0.18)]
  "
>
  Learnova
</h1>

    </footer>
  );
}

export default Footer;