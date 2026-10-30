import Sidebar from "../components/student/studentsidebar";
import Topbar from "../components/student/studenttopbar";
import DashboardCard from "../components/student/dashboardcard";
import ContinueLearning from "../components/student/ContinueLearning";
import RecommendedCourses from "../components/student/RecommendedCourses";
import RecentActivity from "../components/student/RecentActivity";

function StudentDashboard() {
  return (
    <div className="min-h-screen bg-[#09090F] flex text-white">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <Topbar />

        <div className="px-8 py-8 space-y-8">
          <DashboardCard />

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ContinueLearning />
            </div>

            <RecentActivity />
          </div>

          <RecommendedCourses />
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;