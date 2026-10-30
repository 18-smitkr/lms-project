function CourseCard({ course }) {
  return (
    <div className="
      bg-zinc-900
      border border-white/10
      rounded-3xl
      p-6
      hover:border-purple-500
      transition
    ">
      <h3 className="text-2xl font-semibold text-white">
        {course.title}
      </h3>

      <p className="text-gray-400 mt-4">
        {course.description}
      </p>

      <button className="
        mt-6
        bg-purple-600
        px-5
        py-3
        rounded-xl
        hover:bg-purple-500
      ">
        View Course
      </button>
    </div>
  );
}

export default CourseCard;