import Sidebar from "../components/student/studentsidebar";
import Topbar from "../components/student/studenttopbar";
import DashboardCard from "../components/student/dashboardcard";
import ContinueLearning from "../components/student/ContinueLearning";
import RecommendedCourses from "../components/student/RecommendedCourses";
import RecentActivity from "../components/student/RecentActivity";

function StudentDashboard() {
  return (
    <div className="min-h-screen w-full bg-[#09090F] text-white flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 min-w-0 md:ml-72">

        {/* Top Navigation */}
        <Topbar />

        {/* Dashboard Content */}
        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 space-y-8">

          {/* Statistics */}
          <DashboardCard />

          {/* Learning Progress and Activity */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            <div className="min-w-0 xl:col-span-2">
              <ContinueLearning />
            </div>

            <div className="min-w-0">
              <RecentActivity />
            </div>

          </div>

          {/* Course Recommendations */}
          <RecommendedCourses />

        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;