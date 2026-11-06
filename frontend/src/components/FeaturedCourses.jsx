import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function FeaturedCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    API.get("courses/")
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

  return (
    <section
      className="
      relative
      overflow-hidden
      bg-[#111111]
      pt-24
      pb-28
      "
    >

      {/* Smooth transition from Stats */}
      <div
        className="
        absolute
        top-0
        left-0
        w-full
        h-48
        bg-linear-to-b
        from-[#111111]
        via-[#111111]
        to-transparent
        "
      />


      {/* Orange ambient glow */}
      <div
        className="
        absolute
        top-20
        left-1/2
        -translate-x-1/2
        w-150
        h-75
        bg-orange-500/5
        blur-[150px]
        rounded-full
        "
      />


      <div className="relative z-10">


        {/* Heading */}
        <h2
          className="
          text-center
          text-5xl
          lg:text-6xl
          font-extrabold
          text-white
          mb-16
          "
        >
          Featured Courses
        </h2>



        {/* Course Cards */}
        <div
          className="
          grid
          md:grid-cols-2
          lg:grid-cols-3
          gap-8
          px-8
          "
        >

          {loading ? (
            <p className="col-span-full text-center text-gray-400">Loading featured courses...</p>
          ) : error ? (
            <p role="status" className="col-span-full text-center text-gray-400">{error}</p>
          ) : courses.length === 0 ? (
            <p className="col-span-full text-center text-gray-400">No courses are available yet.</p>
          ) : courses.slice(0, 3).map((course, index) => (

            <div
              key={course.id}
              className="
              group
              bg-[#181818]
              border
              border-white/10
              rounded-3xl
              p-8
              transition-all
              duration-300
              hover:-translate-y-3
              hover:border-orange-500/40
              hover:shadow-xl
              hover:shadow-orange-500/10
              "
            >

              {/* Number */}
              <div
                className="
                w-12
                h-12
                rounded-xl
                bg-orange-500/10
                flex
                items-center
                justify-center
                text-orange-500
                font-bold
                text-xl
                mb-6
                "
              >
                {index + 1}
              </div>


              <h3
                className="
                text-2xl
                font-bold
                text-white
                group-hover:text-orange-400
                transition
                "
              >
                {course.title}
              </h3>


              <p
                className="
                mt-4
                text-gray-400
                leading-relaxed
                "
              >
                {course.description}
              </p>


              <div
                className="
                mt-6
                text-sm
                text-gray-300
                "
              >
                ₹{course.price}
              </div>


              <Link
                to={`/courses/${course.id}`}
                className="
                mt-8
                px-5
                py-2.5
                rounded-xl
                bg-orange-500
                text-black
                font-semibold
                hover:bg-orange-400
                transition
                "
              >
                View Course
              </Link>


            </div>

          ))}

        </div>


      </div>


    </section>
  );
}

export default FeaturedCourses;