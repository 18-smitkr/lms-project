import { useEffect, useState } from "react";
import api from "../api/axios";

function CoursesSection() {

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {

      const response = await api.get("/courses/");

      console.log(response.data);

      setCourses(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="bg-black py-24">

      <div className="max-w-7xl mx-auto px-8">

        <h2 className="text-5xl font-bold text-white text-center mb-16">
          Featured Courses
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {courses.map((course) => (

            <div
              key={course.id}
              className="
              bg-zinc-900
              border
              border-white/10
              rounded-3xl
              p-8
              hover:border-purple-500
              transition
              "
            >

              <h3 className="text-2xl font-bold text-white">
                {course.title}
              </h3>

              <p className="text-gray-400 mt-4">
                {course.description}
              </p>

              <div className="mt-6 flex justify-between items-center">

                <span className="text-purple-500 text-xl font-bold">
                  ₹{course.price}
                </span>

                <button
                  className="
                  bg-purple-600
                  px-5
                  py-2
                  rounded-xl
                  "
                >
                  View
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default CoursesSection;