import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import StudentDashboard from "../pages/StudentDashboard";
import MyCourses from "../pages/MyCourses";
import Courses from "../pages/Courses";
import CourseDetails from "../pages/CourseDetails";
import CourseLearning from "../pages/CourseLearning";
import InstructorDashboard from "../pages/InstructorDashboard";
import Wishlist from "../pages/Wishlist";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import Notifications from "../pages/Notifications";
import LearningHistory from "../pages/LearningHistory";
import Certificates from "../pages/Certificates";
import Progress from "../pages/Progress";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:courseId" element={<CourseDetails />} />

      <Route
        path="/courses/:courseId/learn"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <CourseLearning />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/my-courses"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <MyCourses />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/progress"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <Progress />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/wishlist"
        element={<ProtectedRoute allowedRoles={["student"]}><Wishlist /></ProtectedRoute>}
      />
      <Route
        path="/dashboard/profile"
        element={<ProtectedRoute><Profile /></ProtectedRoute>}
      />
      <Route
        path="/dashboard/settings"
        element={<ProtectedRoute><Settings /></ProtectedRoute>}
      />
      <Route
        path="/dashboard/notifications"
        element={<ProtectedRoute><Notifications /></ProtectedRoute>}
      />
      <Route
        path="/dashboard/history"
        element={<ProtectedRoute allowedRoles={["student"]}><LearningHistory /></ProtectedRoute>}
      />
      <Route
        path="/dashboard/certificates"
        element={<ProtectedRoute allowedRoles={["student"]}><Certificates /></ProtectedRoute>}
      />

      <Route
        path="/instructor/dashboard"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <InstructorDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
