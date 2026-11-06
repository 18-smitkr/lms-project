import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  Award,
  BookOpenCheck,
  Check,
  Code2,
  GraduationCap,
  Layers3,
  MoveUpRight,
  Sparkles,
} from "lucide-react";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-white px-5 pb-20 pt-14 sm:px-8 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24">
      <div className="pointer-events-none absolute -right-36 -top-32 h-[28rem] w-[28rem] rounded-full border border-black/[0.04]" />
      <div className="pointer-events-none absolute -right-20 -top-16 h-80 w-80 rounded-full border border-black/[0.04]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1fr_0.92fr] lg:gap-10">
        <div className="max-w-2xl">
          <div
            data-hero="eyebrow"
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#F2B08F] bg-[#FFF0E8] px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#C44808]"
          >
            <Sparkles size={14} aria-hidden="true" />
            Learn. Grow. Achieve.
          </div>
          <h1 className="text-[2.8rem] font-semibold leading-[1.04] tracking-[-0.055em] text-black sm:text-6xl lg:text-[4.5rem]">
            <span data-headline-line className="block">Turn Your Curiosity</span>
            <span data-headline-line className="mt-1 block text-[#FE580D]">Into Real Skills.</span>
          </h1>
          <p
            data-hero="copy"
            className="mt-6 max-w-xl text-base leading-7 text-[#7D7D7D] sm:text-lg sm:leading-8"
          >
            Discover practical courses, develop valuable skills, and build your
            future with a learning experience designed around your goals.
          </p>
          <div data-hero="actions" className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/courses"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#FE580D] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#E64E00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FE580D]"
            >
              Explore courses
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              to="/register"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#E7E7E7] bg-white px-5 py-3 text-sm font-semibold text-black transition-colors hover:border-black/20 hover:bg-[#F5F5F5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FE580D]"
            >
              Start learning
              <MoveUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div data-hero="proof" className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#7D7D7D]">
            {["Learn at your pace", "Practical course content", "Track your progress"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <Check size={15} className="text-[#62BF8E]" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div
          data-hero="visual"
          className="relative mx-auto min-h-[390px] w-full max-w-[570px] sm:min-h-[470px]"
          aria-label="Illustration of the Learnova learning experience"
          role="img"
        >
          <div className="absolute inset-x-7 bottom-2 top-7 rounded-[2rem] bg-[#F5F5F5] sm:inset-x-10 sm:top-10" />
          <div className="absolute right-8 top-2 h-28 w-28 rounded-full bg-[#FE580D] sm:right-12 sm:h-36 sm:w-36" />
          <div className="absolute bottom-8 left-4 h-28 w-28 rounded-full bg-[#62BF8E] sm:bottom-10 sm:left-7 sm:h-36 sm:w-36" />
          <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/[0.07] sm:h-96 sm:w-96" />

          <div
            data-float="main"
            className="absolute left-1/2 top-1/2 z-10 w-[min(76%,390px)] -translate-x-1/2 -translate-y-1/2 rotate-[-3deg] rounded-2xl border border-black/[0.07] bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,0.12)] sm:p-6"
            aria-hidden="true"
          >
            <div className="flex items-center justify-between border-b border-[#E7E7E7] pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FE580D] text-white">
                  <BookOpenCheck size={22} strokeWidth={1.8} />
                </span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#7D7D7D]">Your next chapter</p>
                  <p className="mt-1 text-sm font-semibold text-black">A little progress, every day.</p>
                </div>
              </div>
              <ArrowDownRight size={18} className="text-[#FE580D]" />
            </div>
            <div className="mt-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#7D7D7D]">Keep your curiosity moving</p>
                <p className="mt-1 text-lg font-semibold tracking-tight text-black">Learn something new</p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF6EF] text-[#287A52]">
                <GraduationCap size={20} />
              </span>
            </div>
            <div className="mt-4 rounded-xl border border-[#E7E7E7] p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-black">Progress tracking</span>
                <span className="text-xs font-medium text-[#287A52]">Keep moving</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#EAF6EF]">
                <span
                  data-progress-bar
                  className="block h-full w-[68%] origin-left rounded-full bg-[#62BF8E]"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-3 rounded-xl bg-[#F5F5F5] p-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black"><Code2 size={17} /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-black">Build practical skills</p>
                  <p className="mt-1 text-[11px] text-[#7D7D7D]">Explore courses at your pace</p>
                </div>
                <Check size={16} className="text-[#62BF8E]" />
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-[#F5F5F5] p-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#FE580D]"><Layers3 size={17} /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-black">Follow your learning path</p>
                  <p className="mt-1 text-[11px] text-[#7D7D7D]">Lessons, progress and more</p>
                </div>
                <span className="h-2 w-2 rounded-full bg-[#62BF8E]" />
              </div>
            </div>
          </div>

          <div
            data-float="award"
            className="absolute right-0 top-[30%] z-20 flex items-center gap-2 rounded-xl border border-black/[0.06] bg-white px-3 py-2.5 shadow-lg sm:right-0"
            aria-hidden="true"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF6EF] text-[#287A52]"><Award size={17} /></span>
            <span className="text-xs font-semibold text-black">Celebrate progress</span>
          </div>
          <div
            data-float="book"
            className="absolute bottom-[13%] left-0 z-20 flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white shadow-lg sm:bottom-[12%] sm:left-2 sm:h-14 sm:w-14"
            aria-hidden="true"
          >
            <BookOpenCheck size={23} />
          </div>
          <div className="absolute right-[17%] top-[14%] h-3 w-3 rounded-sm rotate-12 bg-[#62BF8E]" aria-hidden="true" />
          <div className="absolute bottom-[18%] right-[14%] h-2.5 w-2.5 rounded-full bg-[#FE580D]" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
