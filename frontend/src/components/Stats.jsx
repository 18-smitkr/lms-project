import { useEffect, useState } from "react";
import API from "../api/axios";

function Stats() {
  const [stats, setStats] = useState({
    students: 0,
    instructors: 0,
    courses: 0,
    lessons: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await API.get("stats/");

      console.log("Stats:", res.data);

      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative py-28 overflow-hidden bg-black">

      {/* Subtle background glow */}
      <div
        className="
          absolute
          top-10
          left-1/2
          -translate-x-1/2
          w-96
          h-96
          bg-orange-500/10
          blur-[140px]
        "
      />

      <div className="relative max-w-7xl mx-auto px-8">

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">

          <StatCard
            number={loading ? "..." : stats.students}
            label="Students"
          />

          <StatCard
            number={loading ? "..." : stats.courses}
            label="Courses"
          />

          <StatCard
            number={loading ? "..." : stats.lessons}
            label="Lessons"
          />

          <StatCard
            number={loading ? "..." : stats.instructors}
            label="Instructors"
          />

        </div>

      </div>
    </section>
  );
}


function StatCard({ number, label }) {
  return (
    <div
      className="
        bg-[#111111]
        border border-white/10
        rounded-4xl
        p-10
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-orange-500/50
        shadow-lg
      "
    >

      <h2 className="text-5xl font-bold text-orange-500">
        {number}+
      </h2>

      <p className="mt-4 text-gray-400 text-lg">
        {label}
      </p>

    </div>
  );
}


export default Stats;