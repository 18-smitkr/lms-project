import { useEffect, useRef, useState } from "react";
import API from "../api/axios";

function Stats() {
  const sectionRef = useRef(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    students: 0,
    instructors: 0,
    courses: 0,
    lessons: 0,
  });
  const [stats, setStats] = useState({
    students: 0,
    instructors: 0,
    courses: 0,
    lessons: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || hasEnteredView) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [hasEnteredView]);

  useEffect(() => {
    let active = true;
    API.get("stats/")
      .then((response) => {
        if (active) setStats(response.data);
      })
      .catch(() => {
        if (active) setError("Statistics are temporarily unavailable.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (loading || !hasEnteredView) return undefined;

    const targets = Object.fromEntries(
      Object.entries(stats).map(([key, value]) => [key, Number(value) || 0])
    );
    const duration = 2200;
    let animationFrame;
    let startTime;
    const animate = (timestamp) => {
      if (startTime === undefined) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setAnimatedStats(
        Object.fromEntries(
          Object.entries(targets).map(([key, target]) => [
            key,
            Math.round(target * progress),
          ])
        )
      );

      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [hasEnteredView, loading, stats]);

  return (
    <section ref={sectionRef} className="border-b border-[#E5E9EF] bg-[#F7F8FA] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {error && <p role="status" className="mb-5 text-center text-sm text-gray-400">{error}</p>}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
          <StatCard
            number={loading ? "..." : animatedStats.students}
            label="Students"
          />

          <StatCard
            number={loading ? "..." : animatedStats.courses}
            label="Courses"
          />

          <StatCard
            number={loading ? "..." : animatedStats.lessons}
            label="Lessons"
          />

          <StatCard
            number={loading ? "..." : animatedStats.instructors}
            label="Instructors"
          />
        </div>
      </div>
    </section>
  );
}


function StatCard({ number, label }) {
  return (
    <div className="rounded-xl border border-[#E5E9EF] bg-white p-5 sm:p-7">
      <h2 className="text-3xl font-bold tracking-tight text-[#168C83] sm:text-4xl">
        {number}+
      </h2>
      <p className="mt-2 text-sm font-medium text-[#718096] sm:text-base">
        {label}
      </p>
    </div>
  );
}


export default Stats;