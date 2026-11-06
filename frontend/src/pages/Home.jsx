import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  BookOpenCheck,
  Compass,
  GraduationCap,
  Layers3,
  Target,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Hero from "../components/hero";
import Stats from "../components/Stats";
import Footer from "../components/Footer";
import CoursesSection from "../components/coursesection";

const learningFeatures = [
  {
    icon: Compass,
    number: "01",
    title: "Learn at your own pace",
    description: "Choose a course and make room for learning in the rhythm of your life.",
    tone: "orange",
  },
  {
    icon: Layers3,
    number: "02",
    title: "Follow a clear path",
    description: "Move through organized modules and lessons, one useful idea at a time.",
    tone: "green",
  },
  {
    icon: Target,
    number: "03",
    title: "See your progress",
    description: "Keep track of lesson completion and pick up where you left off.",
    tone: "black",
  },
  {
    icon: Award,
    number: "04",
    title: "Celebrate milestones",
    description: "Complete your learning journey and keep a record of your achievements.",
    tone: "green",
  },
];

const learningSteps = [
  {
    number: "01",
    icon: Compass,
    title: "Discover your course",
    description: "Browse the course catalog and find a subject that sparks your curiosity.",
  },
  {
    number: "02",
    icon: BookOpenCheck,
    title: "Learn and practice",
    description: "Work through course modules and lessons at a pace that works for you.",
  },
  {
    number: "03",
    icon: GraduationCap,
    title: "Track your progress",
    description: "See your learning progress and recognize the milestones you reach.",
  },
];

function Home() {
  const pageRef = useRef(null);

  useEffect(() => {
    let disposed = false;
    let motion;

    const initializeAnimations = async () => {
      const [gsapModule, scrollTriggerModule] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed) return;

      const { gsap } = gsapModule;
      gsap.registerPlugin(scrollTriggerModule.ScrollTrigger);
      motion = gsap.matchMedia();
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        const context = gsap.context(() => {
          const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
          intro
            .from("[data-hero-nav]", { y: -12, opacity: 0, duration: 0.55 })
            .from("[data-hero='eyebrow']", { y: 14, opacity: 0, duration: 0.45 }, "-=0.25")
            .from("[data-headline-line]", { y: 28, opacity: 0, duration: 0.65, stagger: 0.12 }, "-=0.2")
            .from("[data-hero='copy']", { y: 18, opacity: 0, duration: 0.55 }, "-=0.28")
            .from("[data-hero='actions'] > a", { y: 14, opacity: 0, duration: 0.4, stagger: 0.1 }, "-=0.22")
            .from("[data-hero='proof']", { y: 10, opacity: 0, duration: 0.4 }, "-=0.18")
            .from("[data-hero='visual']", { x: 24, opacity: 0, duration: 0.7 }, "-=0.55")
            .from("[data-float]", { scale: 0.92, opacity: 0, duration: 0.45, stagger: 0.09 }, "-=0.35")
            .fromTo("[data-progress-bar]", { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.out" }, "-=0.3");

          gsap.to("[data-float='main']", {
            y: -7,
            duration: 3.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
          gsap.to("[data-float='award']", {
            y: -5,
            duration: 2.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });

          gsap.utils.toArray("[data-reveal]").forEach((element) => {
            gsap.fromTo(
              element,
              { y: 22, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.65,
                ease: "power2.out",
                immediateRender: false,
                scrollTrigger: {
                  trigger: element,
                  start: "top 88%",
                  once: true,
                },
              }
            );
          });
        }, pageRef);

        return () => context.revert();
      });
    };

    void initializeAnimations().catch((error) => {
      console.error("Learnova homepage animations could not be initialized.", error);
    });

    return () => {
      disposed = true;
      motion?.revert();
    };
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen overflow-hidden bg-white text-black">
      <Navbar />
      <main>
        <Hero />

        <section aria-label="Learnova platform highlights" className="bg-[#F5F5F5] px-5 py-5 sm:px-8 sm:py-7">
          <div data-reveal className="mx-auto max-w-7xl">
            <Stats />
          </div>
        </section>

        <CoursesSection />

        <section id="features" className="scroll-mt-24 bg-white px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-7xl">
            <div data-reveal className="mb-12 max-w-2xl sm:mb-16">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C44808]">A better way to learn</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] text-black sm:text-5xl">
                Make every step in your learning count.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-[#7D7D7D]">
                Learnova brings your courses, lessons, and learning progress together in one place.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {learningFeatures.map(({ icon: Icon, number, title, description, tone }) => (
                <article
                  key={number}
                  data-reveal
                  className="group min-h-64 rounded-2xl border border-[#E7E7E7] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-black/15 hover:shadow-[0_16px_40px_rgba(0,0,0,0.07)]"
                >
                  <div className="flex items-start justify-between">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      tone === "orange" ? "bg-[#FFF0E8] text-[#FE580D]" :
                      tone === "green" ? "bg-[#EAF6EF] text-[#287A52]" :
                      "bg-[#F5F5F5] text-black"
                    }`}>
                      <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <span className="text-xs font-semibold tracking-widest text-[#7D7D7D]">{number}</span>
                  </div>
                  <h3 className="mt-8 text-lg font-semibold tracking-tight text-black">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#7D7D7D]">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-24 bg-[#F5F5F5] px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-7xl">
            <div data-reveal className="mx-auto mb-14 max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C44808]">Your learning journey</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-black sm:text-5xl">Curiosity, meet direction.</h2>
              <p className="mt-5 text-base leading-7 text-[#7D7D7D]">Three simple steps take you from a new idea to meaningful progress.</p>
            </div>

            <div className="relative grid gap-8 md:grid-cols-3 md:gap-6">
              <div aria-hidden="true" className="absolute left-[16.7%] right-[16.7%] top-8 hidden border-t border-dashed border-[#7D7D7D]/40 md:block" />
              {learningSteps.map(({ number, icon: Icon, title, description }) => (
                <article key={number} data-reveal className="relative text-center">
                  <span className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E7E7E7] bg-white text-[#FE580D] shadow-sm">
                    <Icon size={25} strokeWidth={1.7} aria-hidden="true" />
                  </span>
                  <p className="mt-6 text-xs font-bold tracking-[0.17em] text-[#FE580D]">STEP {number}</p>
                  <h3 className="mt-2 text-lg font-semibold text-black">{title}</h3>
                  <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#7D7D7D]">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section data-reveal className="bg-white px-5 py-16 sm:px-8 sm:py-20">
          <div id="learnova-final-cta" className="relative mx-auto max-w-7xl overflow-hidden rounded-[1.75rem] bg-[#000000] px-6 py-12 text-white sm:px-12 sm:py-16 lg:px-16">
            <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-20 h-72 w-72 rounded-full border border-white/10" />
            <div aria-hidden="true" className="pointer-events-none absolute -right-2 -top-12 h-56 w-56 rounded-full border border-white/10" />
            <span aria-hidden="true" className="absolute right-[18%] top-10 h-3 w-3 rounded-sm rotate-12 bg-[#62BF8E]" />
            <div className="relative max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#62BF8E]">The next step is yours</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl">
                Your Next Big Achievement <span className="text-[#FE580D]">Starts Here.</span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/65">
                Take the first step towards your goals. Start learning with Learnova.
              </p>
              <Link
                to="/courses"
                className="group mt-8 inline-flex min-h-12 items-center gap-2 rounded-lg bg-[#FE580D] px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#E64E00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Explore courses
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
