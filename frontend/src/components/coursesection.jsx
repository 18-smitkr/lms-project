import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Code2,
  Cpu,
  Database,
  Globe,
  Palette,
  BookOpen,
} from "lucide-react";
import api from "../api/axios";

const categoryIcons = [
  { match: /code|program|develop|software/i, icon: Code2 },
  { match: /ai|machine|brain/i, icon: Brain },
  { match: /data|database/i, icon: Database },
  { match: /design|art|paint/i, icon: Palette },
  { match: /business|market|finance/i, icon: BriefcaseBusiness },
  { match: /science|computer|tech|engineer/i, icon: Cpu },
  { match: /language|english|world/i, icon: Globe },
  { match: /math|analysis|chart/i, icon: ChartNoAxesCombined },
];

function getCategoryName(course) {
  if (typeof course.category_name === "string") return course.category_name.trim();
  if (typeof course.category === "string") return course.category.trim();
  if (typeof course.category?.name === "string") return course.category.name.trim();
  return "";
}

function getCategoryIcon(category) {
  return categoryIcons.find(({ match }) => match.test(category))?.icon || BookOpen;
}

function CoursesSection() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.get("courses/")
      .then((response) => {
        if (active) setCourses(response.data || []);
      })
      .catch(() => {
        if (active) setError("Featured courses are temporarily unavailable.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(() => {
    const categoryMap = new Map();
    courses.forEach((course) => {
      const name = getCategoryName(course);
      if (name) categoryMap.set(name, (categoryMap.get(name) || 0) + 1);
    });
    return [...categoryMap.entries()].map(([name, count]) => ({ name, count, icon: getCategoryIcon(name) }));
  }, [courses]);

  return (
    <>
      <section id="courses" className="scroll-mt-24 bg-[#F5F5F5] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div data-reveal className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C44808]">Made for curious minds</p>
              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] text-black sm:text-5xl">
                Find Your Next Learning Adventure.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[#7D7D7D] sm:text-base">
                Explore practical courses and choose a new skill to build.
              </p>
            </div>
            <Link to="/courses" className="group inline-flex items-center gap-2 text-sm font-semibold text-black transition-colors hover:text-[#C44808]">
              View all courses <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          {error && <p role="status" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}

          {loading ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading courses">
              {[0, 1, 2].map((item) => (
                <div key={item} className="overflow-hidden rounded-2xl border border-[#E7E7E7] bg-white">
                  <div className="h-48 animate-pulse bg-[#E7E7E7]" />
                  <div className="space-y-3 p-5">
                    <div className="h-5 w-3/4 animate-pulse rounded bg-[#E7E7E7]" />
                    <div className="h-4 w-full animate-pulse rounded bg-[#F5F5F5]" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-[#F5F5F5]" />
                  </div>
                </div>
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {courses.slice(0, 6).map((course) => (
                <article
                  key={course.id}
                  data-reveal
                  className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E7E7E7] bg-white transition duration-300 hover:-translate-y-1 hover:border-black/15 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
                >
                  <div className="relative h-48 overflow-hidden bg-[#F5F5F5]">
                    <div className="absolute inset-0 flex items-center justify-center bg-[#FFF0E8] text-[#FE580D]">
                      <BookOpen size={34} strokeWidth={1.5} aria-hidden="true" />
                    </div>
                    {course.thumbnail_url && (
                      <img
                        src={course.thumbnail_url}
                        alt=""
                        loading="lazy"
                        className="relative h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                    {getCategoryName(course) && (
                      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-black">
                        {(() => {
                          const CategoryIcon = getCategoryIcon(getCategoryName(course));
                          return <CategoryIcon size={13} aria-hidden="true" />;
                        })()}
                        {getCategoryName(course)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="line-clamp-2 text-lg font-semibold leading-snug tracking-tight text-black">{course.title}</h3>
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-[#7D7D7D]">{course.description}</p>
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#E7E7E7] pt-4">
                      <span className="text-base font-semibold text-black">₹{Number(course.price || 0)}</span>
                      <Link
                        to={`/courses/${course.id}`}
                        className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#FE580D] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#E64E00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FE580D]"
                      >
                        Explore <ArrowRight size={15} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            !error && <p className="rounded-2xl border border-dashed border-[#D7D7D7] bg-white p-8 text-center text-sm text-[#7D7D7D]">New courses are on the way. Explore the catalog to see what is available.</p>
          )}
        </div>
      </section>

      {categories.length > 0 && (
        <section aria-labelledby="course-categories-heading" className="border-t border-[#E7E7E7] bg-white px-5 py-12 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div data-reveal className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C44808]">Find your focus</p>
                <h2 id="course-categories-heading" className="mt-2 text-2xl font-semibold tracking-tight text-black">Explore by category</h2>
              </div>
              <Link to="/courses" className="hidden text-sm font-semibold text-[#7D7D7D] hover:text-[#C44808] sm:inline">All courses</Link>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map(({ name, count, icon: Icon }) => (
                <Link
                  key={name}
                  data-reveal
                  to="/courses"
                  className="inline-flex items-center gap-3 rounded-xl border border-[#E7E7E7] bg-white px-4 py-3 transition-colors hover:border-[#FE580D] hover:bg-[#FFF8F4]"
                >
                  <Icon size={18} className="text-black" aria-hidden="true" />
                  <span className="text-sm font-semibold text-black">{name}</span>
                  <span className="rounded-full bg-[#F5F5F5] px-2 py-0.5 text-xs text-[#7D7D7D]">{count}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default CoursesSection;
