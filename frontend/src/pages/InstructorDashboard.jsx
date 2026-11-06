import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  CalendarClock,
  ChartColumn,
  CreditCard,
  GraduationCap,
  LoaderCircle,
  LogOut,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import API from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import Brand from "../components/Brand";

const emptyCourseForm = {
  title: "",
  description: "",
  price: "0",
  thumbnail_url: "",
};

const emptyLessonForm = {
  title: "",
  video_url: "",
  duration: "10",
};

function InstructorDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [stats, setStats] = useState({
    total_courses: 0,
    total_modules: 0,
    total_lessons: 0,
    total_students: 0,
    total_revenue: 0,
    average_revenue: 0,
    recent_courses: [],
  });
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseAnalytics, setCourseAnalytics] = useState(null);
  const [courseStudents, setCourseStudents] = useState([]);
  const [courseForm, setCourseForm] = useState(emptyCourseForm);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [moduleTitle, setModuleTitle] = useState("");
  const [lessonForm, setLessonForm] = useState(emptyLessonForm);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const instructorCourses = useMemo(
    () => courses.filter((course) => Number(course.instructor) === Number(user?.id)),
    [courses, user]
  );

  const fetchInstructorData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [dashboardResponse, coursesResponse] = await Promise.all([
        API.get("dashboard/instructor/"),
        API.get("courses/"),
      ]);

      setStats(dashboardResponse.data || {});
      setCourses(coursesResponse.data || []);

      const ownedCourses = (coursesResponse.data || []).filter(
        (course) => Number(course.instructor) === Number(user?.id)
      );

      if (ownedCourses.length > 0) {
        const firstCourseId = ownedCourses[0].id;
        setSelectedCourseId((current) => current ?? firstCourseId);
      } else {
        setSelectedCourseId(null);
      }
    } catch {
      setError("Unable to load the instructor dashboard right now.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (user.role !== "instructor") {
      navigate("/dashboard", { replace: true });
      return;
    }

    void Promise.resolve().then(fetchInstructorData);
  }, [user, navigate, fetchInstructorData]);

  useEffect(() => {
    if (!selectedCourseId) {
      return;
    }

    const loadSelectedCourse = async () => {
      try {
        const [courseResponse, analyticsResponse, studentsResponse] = await Promise.all([
          API.get(`course/${selectedCourseId}/`),
          API.get(`dashboard/course-analytics/${selectedCourseId}/`),
          API.get(`course-students/${selectedCourseId}/`),
        ]);
        setSelectedCourse(courseResponse.data || null);
        setSelectedModuleId((courseResponse.data?.modules || [])[0]?.id || null);
        setCourseAnalytics(analyticsResponse.data || null);
        setCourseStudents(studentsResponse.data || []);
      } catch (err) {
        setError(err.response?.data?.error || "Unable to load course analytics and students.");
      }
    };

    void loadSelectedCourse();
  }, [selectedCourseId]);

  const refreshDashboard = async () => {
    await fetchInstructorData();
    if (selectedCourseId) {
      try {
        const response = await API.get(`course/${selectedCourseId}/`);
        const updatedCourse = response.data || null;
        const modules = updatedCourse?.modules || [];
        setSelectedCourse(updatedCourse);
        setSelectedModuleId((currentModuleId) =>
          modules.some((module) => module.id === currentModuleId)
            ? currentModuleId
            : modules[0]?.id || null
        );
        const [analyticsResponse, studentsResponse] = await Promise.all([
          API.get(`dashboard/course-analytics/${selectedCourseId}/`),
          API.get(`course-students/${selectedCourseId}/`),
        ]);
        setCourseAnalytics(analyticsResponse.data || null);
        setCourseStudents(studentsResponse.data || []);
      } catch (err) {
        setError(err.response?.data?.error || "Unable to refresh course analytics and students.");
      }
    }
  };

  const handleCourseSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        title: courseForm.title.trim(),
        description: courseForm.description.trim(),
        price: Number(courseForm.price || 0),
        thumbnail_url: courseForm.thumbnail_url.trim(),
      };

      if (!payload.title || !payload.description) {
        setError("Course title and description are required.");
        return;
      }

      if (editingCourseId) {
        await API.put(`update-course/${editingCourseId}/`, payload);
        setSuccess("Course updated successfully.");
      } else {
        await API.post("create-course/", payload);
        setSuccess("Course created successfully.");
      }

      setCourseForm(emptyCourseForm);
      setEditingCourseId(null);
      await refreshDashboard();
    } catch (err) {
      const message = err.response?.data?.error || "Unable to save the course right now.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourseId(course.id);
    setSelectedCourseId(course.id);
    setCourseForm({
      title: course.title,
      description: course.description,
      price: course.price ?? 0,
      thumbnail_url: course.thumbnail_url || "",
    });
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Delete this course and all associated content?")) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await API.delete(`delete-course/${courseId}/`);
      setSuccess("Course removed successfully.");
      if (Number(selectedCourseId) === Number(courseId)) {
        setSelectedCourseId(null);
        setSelectedCourse(null);
        setCourseAnalytics(null);
        setCourseStudents([]);
      }
      await fetchInstructorData();
    } catch (err) {
      setError(err.response?.data?.error || "Unable to delete the course.");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateModule = async (event) => {
    event.preventDefault();
    if (!selectedCourseId || !moduleTitle.trim()) {
      setError("Select a course and provide a valid module name.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await API.post(`create-module/${selectedCourseId}/`, { title: moduleTitle.trim() });
      setModuleTitle("");
      setSuccess("Module added successfully.");
      await refreshDashboard();
    } catch (err) {
      setError(err.response?.data?.error || "Unable to create the module.");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateLesson = async (event) => {
    event.preventDefault();
    if (!selectedModuleId) {
      setError("Select a module to add the lesson to.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const lessonPayload = {
        title: lessonForm.title.trim(),
        video_url: lessonForm.video_url.trim(),
        duration: Number(lessonForm.duration || 0),
      };
      const updatingLesson = Boolean(editingLessonId);
      if (updatingLesson) {
        await API.put(`update-lesson/${editingLessonId}/`, lessonPayload);
      } else {
        await API.post(`create-lesson/${selectedModuleId}/`, lessonPayload);
      }
      setEditingLessonId(null);
      setLessonForm(emptyLessonForm);
      setSuccess(updatingLesson ? "Lesson updated successfully." : "Lesson created successfully.");
      await refreshDashboard();
    } catch (err) {
      const message = err.response?.data?.error || "Unable to create the lesson.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!moduleId || !window.confirm("Delete this module and all lessons inside it?")) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await API.delete(`delete-module/${moduleId}/`);
      setSuccess("Module deleted successfully.");
      await refreshDashboard();
    } catch (err) {
      setError(err.response?.data?.error || "Unable to delete the module.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!lessonId || !window.confirm("Delete this lesson?")) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await API.delete(`delete-lesson/${lessonId}/`);
      setSuccess("Lesson deleted successfully.");
      await refreshDashboard();
    } catch (err) {
      setError(err.response?.data?.error || "Unable to delete the lesson.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditModule = async (module) => {
    const title = window.prompt("Update module title", module.title);
    if (!title?.trim() || title.trim() === module.title) return;
    setSaving(true);
    setError("");
    try {
      await API.put(`update-module/${module.id}/`, { title: title.trim() });
      setSuccess("Module updated successfully.");
      await refreshDashboard();
    } catch (err) {
      setError(err.response?.data?.error || "Unable to update the module.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditLesson = (lesson) => {
    setEditingLessonId(lesson.id);
    setSelectedModuleId(lesson.module);
    setLessonForm({
      title: lesson.title,
      video_url: lesson.video_url,
      duration: String(lesson.duration),
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090F] text-white">
        <div className="flex items-center gap-3 text-purple-300">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          Loading instructor dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090F] px-4 py-6 text-white md:px-8 md:py-10">
      <aside className="instructor-sidebar fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-[#E7E7E7] bg-[#F0F0F0] px-5 py-6 text-[#171717] lg:flex">
        <Brand to="/instructor/dashboard" portal="Instructor portal" />
        <p className="mb-3 mt-10 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">Workspace</p>
        <nav className="space-y-1" aria-label="Instructor navigation">
          <a href="#instructor-dashboard" className="block rounded-lg border-l-2 border-[#FE580D] bg-[#111111] px-3 py-2.5 text-sm font-medium text-white">Overview</a>
          <a href="#instructor-courses" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[#646464] transition hover:bg-black/5 hover:text-[#171717]">Manage courses</a>
          <a href="#instructor-curriculum" className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[#646464] transition hover:bg-black/5 hover:text-[#171717]">Curriculum</a>
        </nav>
      </aside>
      <main id="instructor-dashboard" className="mx-auto max-w-[1600px] space-y-8 lg:ml-64">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-5 lg:hidden"><Brand to="/instructor/dashboard" portal="Instructor portal" /></div>
            <div className="text-xs uppercase tracking-[0.25em] text-purple-300">Instructor</div>
            <h1 className="mt-2 text-4xl font-black">Instructor Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-white/10 bg-[#101018]/85 px-4 py-2 text-sm text-gray-300">
              {user?.username || "Instructor"}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#101018]/85 px-4 py-2 text-sm text-gray-300 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-200"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Logout
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-300">Thumbnail image URL</label>
          <input
            type="url"
            value={courseForm.thumbnail_url}
            onChange={(event) => setCourseForm((current) => ({ ...current, thumbnail_url: event.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-[#151521] px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none"
            placeholder="https://example.com/course-image.jpg"
          />
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">{error}</div>
        )}

        {success && (
          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-green-200">{success}</div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={<BookOpen className="h-5 w-5" />} label="Total courses" value={stats.total_courses ?? 0} />
          <StatCard icon={<ChartColumn className="h-5 w-5" />} label="Total modules" value={stats.total_modules ?? 0} />
          <StatCard icon={<GraduationCap className="h-5 w-5" />} label="Total lessons" value={stats.total_lessons ?? 0} />
          <StatCard icon={<Users className="h-5 w-5" />} label="Enrolled students" value={stats.total_students ?? 0} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[28px] border border-white/10 bg-[#101018]/85 p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{editingCourseId ? "Edit course" : "Create course"}</h2>
              {editingCourseId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCourseId(null);
                    setCourseForm(emptyCourseForm);
                  }}
                  className="text-sm text-purple-300"
                >
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleCourseSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-gray-300">Course title</label>
                <input
                  value={courseForm.title}
                  onChange={(event) => setCourseForm((current) => ({ ...current, title: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-[#151521] px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none"
                  placeholder="Enter a course title"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">Description</label>
                <textarea
                  value={courseForm.description}
                  onChange={(event) => setCourseForm((current) => ({ ...current, description: event.target.value }))}
                  rows={4}
                  className="w-full rounded-2xl border border-white/10 bg-[#151521] px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none"
                  placeholder="Describe the learning outcome"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">Price</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={courseForm.price}
                  onChange={(event) => setCourseForm((current) => ({ ...current, price: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-[#151521] px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus className="h-4 w-4" />
                {saving ? "Saving..." : editingCourseId ? "Save course" : "Create course"}
              </button>
            </form>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-[#101018]/85 p-6">
            <h2 className="text-2xl font-bold text-white">Instructor overview</h2>
            <div className="mt-6 space-y-4">
              <OverviewRow icon={<CreditCard className="h-4 w-4" />} label="Revenue" value={`₹${Number(stats.total_revenue || 0).toFixed(2)}`} />
              <OverviewRow icon={<CalendarClock className="h-4 w-4" />} label="Average revenue" value={`₹${Number(stats.average_revenue || 0).toFixed(2)}`} />
              <OverviewRow icon={<BookOpen className="h-4 w-4" />} label="Recent courses" value={stats.recent_courses?.length || 0} />
            </div>

            <div className="mt-6 space-y-2">
              {(stats.recent_courses || []).slice(0, 5).map((course) => (
                <div key={course.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300">
                  <span>{course.title}</span>
                  <button type="button" onClick={() => setSelectedCourseId(course.id)} className="text-purple-300">
                    Open
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section id="instructor-courses" className="rounded-[28px] border border-white/10 bg-[#101018]/85 p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Manage courses</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {instructorCourses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-gray-400 md:col-span-2 xl:col-span-3">
                You have not created any course yet.
              </div>
            ) : (
              instructorCourses.map((course) => {
                const isSelected = selectedCourseId === course.id;
                return (
                  <article
                    key={course.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedCourseId(course.id)}
                    onKeyDown={(event) => {
                      if (event.target !== event.currentTarget) return;
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedCourseId(course.id);
                      }
                    }}
                    style={isSelected ? { backgroundColor: "rgb(254 88 13 / 6%)" } : undefined}
                    className={`cursor-pointer rounded-3xl border p-5 transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FE580D] ${
                      isSelected
                        ? "border-[#FE580D]"
                        : "border-white/10 bg-white/5 hover:border-[#FE580D]/60 hover:bg-white/10"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h3 className="text-xl font-bold text-white">{course.title}</h3>
                      <span className="shrink-0 rounded-full bg-white/10 px-2 py-1 text-xs font-semibold text-gray-300">₹{Number(course.price || 0)}</span>
                    </div>
                    <p className="line-clamp-3 text-sm text-gray-400">{course.description}</p>
                    <div className="mt-4 flex gap-2">
                      <button type="button" onClick={(event) => { event.stopPropagation(); handleEditCourse(course); }} className="rounded-full bg-purple-500/15 px-3 py-2 text-sm text-purple-200">
                        Edit
                      </button>
                      <button type="button" onClick={(event) => { event.stopPropagation(); handleDeleteCourse(course.id); }} className="rounded-full bg-red-500/10 px-3 py-2 text-sm text-red-200">
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>

        {selectedCourse && (
          <section id="instructor-curriculum" className="rounded-[28px] border border-white/10 bg-[#101018]/85 p-6">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.25em] text-purple-300">Curriculum manager</div>
                <h2 className="mt-2 text-2xl font-bold text-white">{selectedCourse.title}</h2>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300">
                {selectedCourse.modules?.length || 0} modules · {selectedCourse.modules?.reduce((total, module) => total + (module.lessons?.length || 0), 0) || 0} lessons
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <form onSubmit={handleCreateModule} className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="text-lg font-semibold text-white">Add module</h3>
                  <input
                    value={moduleTitle}
                    onChange={(event) => setModuleTitle(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-[#151521] px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none"
                    placeholder="Module title"
                  />
                  <button type="submit" disabled={saving} className="rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-2 font-semibold text-white disabled:opacity-60">
                    Add module
                  </button>
                </form>

                <div className="mt-5 space-y-3">
                  {(selectedCourse.modules || []).map((module) => (
                    <div key={module.id} className="rounded-2xl border border-white/10 bg-black/10 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <button type="button" onClick={() => setSelectedModuleId(module.id)} className="text-left text-base font-semibold text-white">
                          {module.title}
                        </button>
                        <div className="flex gap-3">
                          <button type="button" onClick={() => handleEditModule(module)} className="text-xs text-purple-300">Edit</button>
                          <button type="button" onClick={() => handleDeleteModule(module.id)} className="text-red-300" aria-label="Delete module">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 space-y-2">
                        {(module.lessons || []).map((lesson) => (
                          <div key={lesson.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300">
                            <div>
                              <div>{lesson.title}</div>
                              <div className="text-xs text-gray-500">{lesson.duration || 0} min</div>
                            </div>
                            <div className="flex gap-3">
                              <button type="button" onClick={() => handleEditLesson(lesson)} className="text-xs text-purple-300">Edit</button>
                              <button type="button" onClick={() => handleDeleteLesson(lesson.id)} className="text-red-300" aria-label="Delete lesson">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <form onSubmit={handleCreateLesson} className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="text-lg font-semibold text-white">{editingLessonId ? "Edit lesson" : "Add lesson"}</h3>

                  <select
                    value={selectedModuleId ?? ""}
                    onChange={(event) => setSelectedModuleId(Number(event.target.value))}
                    className="w-full rounded-2xl border border-white/10 bg-[#151521] px-4 py-3 text-white focus:outline-none"
                  >
                    <option value="">Select a module</option>
                    {(selectedCourse.modules || []).map((module) => (
                      <option key={module.id} value={module.id}>{module.title}</option>
                    ))}
                  </select>

                  <input
                    value={lessonForm.title}
                    onChange={(event) => setLessonForm((current) => ({ ...current, title: event.target.value }))}
                    className="w-full rounded-2xl border border-white/10 bg-[#151521] px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none"
                    placeholder="Lesson title"
                  />

                  <input
                    value={lessonForm.video_url}
                    onChange={(event) => setLessonForm((current) => ({ ...current, video_url: event.target.value }))}
                    className="w-full rounded-2xl border border-white/10 bg-[#151521] px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none"
                    placeholder="Video URL"
                  />

                  <input
                    type="number"
                    min="1"
                    value={lessonForm.duration}
                    onChange={(event) => setLessonForm((current) => ({ ...current, duration: event.target.value }))}
                    className="w-full rounded-2xl border border-white/10 bg-[#151521] px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none"
                    placeholder="Duration in minutes"
                  />

                  <button type="submit" disabled={saving} className="rounded-full bg-gradient-to-r from-purple-600 to-orange-500 px-4 py-2 font-semibold text-white disabled:opacity-60">
                    {editingLessonId ? "Save lesson" : "Create lesson"}
                  </button>
                  {editingLessonId && <button type="button" onClick={() => { setEditingLessonId(null); setLessonForm(emptyLessonForm); }} className="ml-3 text-sm text-gray-400">Cancel</button>}
                </form>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <OverviewRow icon={<Users className="h-4 w-4" />} label="Enrolled students" value={courseAnalytics?.enrolled_students ?? 0} />
              <OverviewRow icon={<GraduationCap className="h-4 w-4" />} label="Course completions" value={courseAnalytics?.course_completions ?? 0} />
              <OverviewRow icon={<ChartColumn className="h-4 w-4" />} label="Average rating" value={Number(courseAnalytics?.average_rating || 0).toFixed(1)} />
              <OverviewRow icon={<CreditCard className="h-4 w-4" />} label="Course revenue" value={`₹${Number(courseAnalytics?.revenue || 0).toFixed(2)}`} />
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white">Enrolled students</h3>
              {courseStudents.length === 0 ? (
                <p className="mt-3 rounded-2xl border border-dashed border-white/10 p-4 text-sm text-gray-400">No students are enrolled in this course.</p>
              ) : (
                <div className="mt-3 overflow-x-auto rounded-2xl border border-white/10">
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <thead className="bg-white/5 text-gray-400"><tr><th className="p-3">Student</th><th className="p-3">Enrolled</th><th className="p-3">Lessons complete</th><th className="p-3">Progress</th></tr></thead>
                    <tbody>{courseStudents.map((student) => (
                      <tr key={student.id} className="border-t border-white/10 text-gray-200">
                        <td className="p-3"><div>{student.username}</div><div className="text-xs text-gray-500">{student.email}</div></td>
                        <td className="p-3">{new Date(student.enrolled_at).toLocaleDateString()}</td>
                        <td className="p-3">{student.completed_lessons}/{student.total_lessons}</td>
                        <td className="p-3">{student.completion_percentage}%</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-[#101018]/85 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">{label}</span>
        <div className="rounded-xl bg-purple-500/10 p-2 text-purple-300">{icon}</div>
      </div>
      <div className="mt-5 text-3xl font-black text-white">{value}</div>
    </div>
  );
}

function OverviewRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
      <div className="flex items-center gap-3 text-gray-300">
        <span className="text-purple-300">{icon}</span>
        <span>{label}</span>
      </div>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}

export default InstructorDashboard;
