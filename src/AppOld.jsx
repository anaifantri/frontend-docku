import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import "@/App.css";
import Login from "@/pages/auth/Login";
import DashboardLayout from "@/layouts/DashboardLayout";
import Dashboard from "@/pages/dashboard/Dashboard";
import Documentations from "@/pages/documentations/Documentations";
import DocumentationReport from "@/pages/documentations/DocumentationReport";
import Record from "@/pages/documentations/Record";
import ComplaintReport from "@/pages/complaints/ComplaintReport";
import Complaints from "@/pages/complaints/Complaints";
import Tracking from "@/pages/tracking/Tracking";
import Merchants from "@/pages/users/Merchants";
import Users from "@/pages/users/Users";
import UserCreate from "@/pages/users/create";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { GuestRoute } from "@/components/GuestRoute";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* 1. Public Routes */}
          <Route path="/" element={<Login />} />

          {/* 2. Guest-Only Routes (Redirects if logged in) */}
          <Route element={<GuestRoute />}>
            <Route path="/" element={<Login />} />
          </Route>

          {/* 3. Protected Routes (Redirects if logged out) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="documentations" element={<Documentations />} />
              <Route path="record" element={<Record />} />
              <Route
                path="packaging-report"
                element={<DocumentationReport />}
              />
              <Route path="complaints" element={<Complaints />} />
              <Route path="complaint-report" element={<ComplaintReport />} />
              <Route path="tracking" element={<Tracking />} />
              <Route path="merchants" element={<Merchants />} />
              <Route path="users" element={<Users />} />
              <Route path="users/create" element={<UserCreate />} />
            </Route>
          </Route>

          {/* 4. Catch-All 404 Route */}
          <Route path="*" element={<h2>404 Not Found</h2>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
