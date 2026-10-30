
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section
  className="relative min-h-screen overflow-hidden flex items-start justify-center px-6 pt-44 bg-cover bg-center bg-no-repeat">
  <div className="mt-10">
 <h1 className="text-6xl lg:text-8xl font-bold leading-[1.1] tracking-tight text-white">
  Your personalized
  <br />

  <div className="flex justify-center items-center gap-3 mt-4">
    <span>learning</span>

    <span className="relative px-5 py-2  bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_30px_rgba(255,255,255,0.08)]">
      helper
      {/* Orange Accent */}
      <span className="cursor"></span>
    </span>
  </div>
        </h1>
        <div className="flex flex-wrap items-center gap-20 font-medium">
  <div className="flex items-center gap-2">
    <span className="text-white text-xl font-bold">✔</span>
    <span className="text-white">
      Connect with <span className="font-bold">top teachers</span>
    </span>
  </div>

  <div className="flex items-center gap-2">
    <span className="text-white text-xl font-bold">✔</span>
    <span className="text-white">
      Sharpen your <span className="font-bold">skills</span>
    </span>
  </div>

  <div className="flex items-center gap-2">
    <span className="text-white text-xl font-bold">✔</span>
    <span className="text-white">
      Achieve your <span className="font-bold">goal</span>
    </span>
  </div>
        </div>
        <br />
        
       <div className="flex items-center justify-around gap-1">
  <Link
    to="/register"
    className="flex items-center justify-center w-64 h-14 rounded-full
              font-semibold
              text-white
              bg-linear-to-r
              from-orange-500
              to-orange-400
              shadow-[0_10px_30px_rgba(255,120,40,.45)]
              hover:scale-105
              transition-all
              duration-300"
  >
    Start Learning Now <span className="ml-2">→</span>
  </Link>

  <Link
    to="/free-trial"
    className="flex items-center justify-center w-64 h-14 bg-white  text-black rounded-full
              font-semibold
              shadow-[0_10px_30px_rgba(255,255,255,0.2)]
              hover:scale-105
              transition-all
              duration-300"
  >
    Get a Free Trial <span className="ml-2">→</span>
  </Link>
</div>
        
      </div>
    </section>
  );
}

export default Hero;