function CourseCard({ course }) {
  return (
    <article className="rounded-xl border border-[#E5E9EF] bg-white p-6 transition-shadow hover:shadow-md">
      <h3 className="text-2xl font-semibold text-[#172B3A]">
        {course.title}
      </h3>

      <p className="mt-4 text-sm leading-6 text-[#718096]">
        {course.description}
      </p>

      <button type="button" className="mt-6 rounded-lg bg-[#168C83] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#11766F]">
        View Course
      </button>
    </article>
  );
}

export default CourseCard;