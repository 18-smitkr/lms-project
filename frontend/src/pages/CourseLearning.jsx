import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, LoaderCircle, PlayCircle } from "lucide-react";
import API from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import BackButton from "../components/common/BackButton";

function CourseLearning() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [completedLessonIds, setCompletedLessonIds] = useState({});
  const [courseProgress, setCourseProgress] = useState({
    total_lessons: 0,
    completed_lessons: 0,
    completion_percentage: 0,
    course_completed: false,
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isEnrolled, setIsEnrolled] = useState(false);

  const currentLesson = lessons[currentIndex] || null;

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    const loadCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const [courseResponse, enrolledResponse] = await Promise.all([
          API.get(`course/${courseId}/`),
          API.get("my-courses/"),
        ]);

        const enrolledCourses = enrolledResponse.data || [];
        const enrolledIds = new Set(
          enrolledCourses.map((courseItem) => Number(courseItem.course_id ?? courseItem.course ?? courseItem.id))
        );

        const isStudentEnrolled = enrolledIds.has(Number(courseId));
        setIsEnrolled(isStudentEnrolled);

        if (!isStudentEnrolled) {
          setCourse(courseResponse.data || null);
          setLessons([]);
          setCourseProgress({
            total_lessons: 0,
            completed_lessons: 0,
            completion_percentage: 0,
            course_completed: false,
          });
          setCompletedLessonIds({});
          setError("You must enroll in this course before accessing lessons.");
          return;
        }

        const [progressResponse, myProgressResponse] = await Promise.all([
          API.get(`progress/course-progress/${courseId}/`),
          API.get("progress/my-progress/"),
        ]);
        const courseData = courseResponse.data || null;
        const flattenedLessons = (courseData?.modules || []).flatMap((module, moduleIndex) =>
          (module.lessons || []).map((lesson, lessonIndex) => ({
            ...lesson,
            moduleTitle: module.title,
            moduleId: module.id,
            order: Number(moduleIndex * 1000 + lessonIndex),
          }))
        );

        const completedMap = {};
        (myProgressResponse.data || []).forEach((record) => {
          if (record.lesson) {
            completedMap[Number(record.lesson)] = true;
          }
        });

        setCourse(courseData);
        setLessons(flattenedLessons);
        setCompletedLessonIds(completedMap);
        setCourseProgress(progressResponse.data || { total_lessons: 0, completed_lessons: 0, completion_percentage: 0, course_completed: false });

        const firstIncompleteIndex = flattenedLessons.findIndex((lesson) => !completedMap[Number(lesson.id)]);
        const resumeIndex = firstIncompleteIndex >= 0
          ? firstIncompleteIndex
          : Math.max(flattenedLessons.length - 1, 0);
        setCurrentIndex(resumeIndex);
      } catch {
        setError("Unable to load the course learning environment right now.");
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId, user, navigate]);

  const toggleCompleteLesson = async () => {
    if (!currentLesson) {
      return;
    }

    try {
      setSaving(true);
      await API.post(`progress/complete-lesson/${currentLesson.id}/`);
      const updatedProgress = await API.get(`progress/course-progress/${courseId}/`);
      const updatedCompletedMap = { ...completedLessonIds, [Number(currentLesson.id)]: true };
      setCompletedLessonIds(updatedCompletedMap);
      setCourseProgress(updatedProgress.data || courseProgress);
    } catch {
      setError("Unable to save lesson progress right now.");
    } finally {
      setSaving(false);
    }
  };

  const renderVideo = () => {
    if (!currentLesson?.video_url) {
      return (
        <div className="flex h-72 items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 text-center text-gray-400">
          Video content is not available for this lesson yet.
        </div>
      );
    }

    const url = currentLesson.video_url;

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const embedUrl = url.includes("youtube.com/watch?v=")
        ? url.replace("youtube.com/watch?v=", "youtube.com/embed/").split("&")[0]
        : url.includes("youtu.be/")
          ? url.replace("youtu.be/", "youtube.com/embed/")
          : url;

      return (
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-black">
          <iframe
            src={embedUrl}
            title={currentLesson.title}
            className="h-[420px] w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    return (
      <video
        src={currentLesson.video_url}
        controls
        className="h-[420px] w-full rounded-3xl border border-white/10 bg-black object-cover"
      />
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090F] text-white">
        <div className="flex items-center gap-3 text-purple-300">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          Loading learning experience...
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#09090F] px-4 py-10 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-200">
          <BackButton fallbackTo="/dashboard/my-courses" label="Back to My Courses" />
          {error || "Course not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090F] text-white">
      <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-6 xl:px-8">
        <BackButton fallbackTo="/dashboard/my-courses" label="Back to My Courses" />
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-purple-300">Learning Workspace</div>
            <h1 className="mt-2 text-3xl font-black md:text-4xl">{course.title}</h1>
          </div>
          <div className="rounded-full border border-white/10 bg-[#101018]/80 px-3 py-2 text-sm text-gray-300">
            {courseProgress.completion_percentage || 0}% complete
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
            {error}
            {!isEnrolled && (
              <div className="mt-3 flex gap-3">
                <Link to={`/courses/${courseId}`} className="rounded-full bg-purple-600 px-4 py-2 font-semibold text-white">
                  Enroll to continue
                </Link>
                <Link to="/courses" className="rounded-full border border-white/10 px-4 py-2 text-gray-200">
                  Browse catalog
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
          <aside className="rounded-[28px] border border-white/10 bg-[#101018]/85 p-4">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-purple-300">
              <BookOpen className="h-4 w-4" />
              Course curriculum
            </div>

            <div className="space-y-4">
              {(course.modules || []).map((module) => (
                <div key={module.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="mb-3 text-sm font-semibold text-white">{module.title}</div>
                  <div className="space-y-2">
                    {(module.lessons || []).map((lesson) => {
                      const isComplete = Boolean(completedLessonIds[Number(lesson.id)]);
                      const isCurrent = currentLesson?.id === lesson.id;

                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() => {
                            const index = lessons.findIndex((item) => item.id === lesson.id);
                            if (index >= 0) setCurrentIndex(index);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition ${
                            isCurrent
                              ? "border-purple-500/60 bg-purple-500/10 text-white"
                              : "border-transparent bg-black/10 text-gray-300 hover:border-white/10 hover:bg-white/5"
                          }`}
                        >
                          <span className="line-clamp-1">{lesson.title}</span>
                          <span className={isComplete ? "text-green-400" : "text-gray-500"}>
                            {isComplete ? <CheckCircle2 className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <main className="space-y-6">
            {currentLesson ? (
              <>
                <div className="rounded-[28px] border border-white/10 bg-[#101018]/85 p-4 md:p-5">
                  {renderVideo()}
                </div>

                <div className="rounded-[28px] border border-white/10 bg-[#101018]/85 p-5 md:p-6">
                  <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Current lesson</div>
                      <h2 className="mt-2 text-2xl font-bold text-white">{currentLesson.title}</h2>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-300">
                      {currentLesson.moduleTitle || "Module"} · {currentLesson.duration || 0} min
                    </div>
                  </div>

                  <div className="mb-6 h-2.5 rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-orange-400"
                      style={{ width: `${Math.min(courseProgress.completion_percentage || 0, 100)}%` }}
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        disabled={currentIndex === 0 || saving}
                        onClick={() => setCurrentIndex((index) => Math.max(index - 1, 0))}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </button>

                      <button
                        type="button"
                        disabled={currentIndex >= lessons.length - 1 || saving}
                        onClick={() => setCurrentIndex((index) => Math.min(index + 1, lessons.length - 1))}
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={saving || completedLessonIds[Number(currentLesson.id)]}
                      onClick={toggleCompleteLesson}
                      className="rounded-full bg-green-500/15 px-4 py-2 text-sm font-semibold text-green-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? "Saving..." : completedLessonIds[Number(currentLesson.id)] ? "Lesson complete" : "Mark as complete"}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-[28px] border border-dashed border-white/10 bg-[#101018]/85 p-8 text-center text-gray-400">
                No lessons are available in this course yet.
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default CourseLearning;
