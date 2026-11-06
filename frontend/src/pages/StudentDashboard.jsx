import { useCallback, useEffect, useState } from "react";
import API from "../api/axios";
import Sidebar from "../components/student/studentsidebar";
import Topbar from "../components/student/studenttopbar";
import DashboardCard from "../components/student/dashboardcard";
import ContinueLearning from "../components/student/ContinueLearning";
import RecommendedCourses from "../components/student/RecommendedCourses";
import RecentActivity from "../components/student/RecentActivity";
import LearningProgressOverview from "../components/student/LearningProgressOverview";

function StudentDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    total_courses: 0,
    completed_lessons: 0,
    total_payments: 0,
    total_amount_spent: 0,
  });
  const [myCourses, setMyCourses] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [dashboardResponse, myCoursesResponse, catalogResponse] = await Promise.all([
          API.get("dashboard/student/"),
          API.get("my-courses/"),
          API.get("courses/"),
        ]);

        const enrolledCourses = myCoursesResponse.data || [];
        const courses = catalogResponse.data || [];

        const enrolledIds = new Set(
          enrolledCourses.map((course) => Number(course.course_id ?? course.course ?? course.id))
        );

        const recommendedCourses = courses.filter(
          (course) => !enrolledIds.has(Number(course.id))
        ).slice(0, 3);

        setDashboardStats(dashboardResponse.data || {});
        setMyCourses(enrolledCourses);
        setRecommended(recommendedCourses);

        const progressEntries = await Promise.all(
          enrolledCourses.map(async (course) => {
            const courseId = Number(course.course_id ?? course.course ?? course.id);
            const progressResponse = await API.get(`progress/course-progress/${courseId}/`);
            return [courseId, progressResponse.data];
          })
        );

        setProgressMap(Object.fromEntries(progressEntries));
      } catch {
        setError("Unable to load dashboard data right now.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="flex min-h-screen w-full overflow-x-clip bg-[#09090F] text-white">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <main className="min-w-0 flex-1 md:ml-28 lg:ml-72">
        <Topbar
          isMenuOpen={isSidebarOpen}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 space-y-8">
          {error ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
              {error}
            </div>
          ) : null}

          <DashboardCard stats={dashboardStats} loading={loading} />

          <LearningProgressOverview
            courses={myCourses}
            progressMap={progressMap}
            completedLessons={dashboardStats.completed_lessons}
            loading={loading}
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="min-w-0 xl:col-span-2">
              <ContinueLearning courses={myCourses} progressMap={progressMap} loading={loading} />
            </div>

            <div className="min-w-0">
              <RecentActivity courses={myCourses} />
            </div>
          </div>

          <RecommendedCourses courses={recommended} loading={loading} />
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;
