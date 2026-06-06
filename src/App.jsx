import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import "@/App.css";
import Login from "@/pages/auth/Login";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import ResendEmailVerification from "@/pages/auth/ResendEmailVerification";
import VerifyEmail from "@/pages/auth/VerifyEmail";

import DashboardLayout from "@/layouts/DashboardLayout";
import Dashboard from "@/pages/dashboard/Dashboard";

import Documentations from "@/pages/documentations/Index";
import DocumentationReport from "@/pages/documentations/DocumentationReport";
import DocumentationCreate from "@/pages/documentations/Create";
import DocumentationShow from "@/pages/documentations/Show";
import DocumentationEdit from "@/pages/documentations/Edit";

import ComplaintReport from "@/pages/complaints/ComplaintReport";
import Complaints from "@/pages/complaints/Complaints";

import Tracking from "@/pages/tracking/Tracking";

import Merchants from "@/pages/merchants/Index";
import MerchantCreate from "@/pages/merchants/Create";
import MerchantShow from "@/pages/merchants/Show";
import MerchantEdit from "@/pages/merchants/Edit";

import Users from "@/pages/users/Index";
import UserCreate from "@/pages/users/Create";
import UserShow from "@/pages/users/Show";
import UserEdit from "@/pages/users/Edit";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { GuestRoute } from "@/components/GuestRoute";

const router = createBrowserRouter([
  // 🌐 Public Routes (Anyone can see)
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/resend-email-verification",
    element: <ResendEmailVerification />,
  },
  {
    path: "/email-verify/:id/:hash",
    element: <VerifyEmail />,
  },
  // 🔓 Guest Only Routes (Redirects to /dashboard if logged in)
  {
    element: <GuestRoute />,
    children: [{ path: "/", element: <Login /> }],
  },
  // 🔒 Protected Routes (Redirects to /login if logged out)
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "documentations", element: <Documentations /> },
          { path: "documentations/create", element: <DocumentationCreate /> },
          { path: "documentations/:id", element: <DocumentationShow /> },
          { path: "documentations/edit/:id", element: <DocumentationEdit /> },
          { path: "documentations/report", element: <DocumentationReport /> },
          { path: "complaints", element: <Complaints /> },
          { path: "complaint/report", element: <ComplaintReport /> },
          { path: "tracking", element: <Tracking /> },
          { path: "merchants", element: <Merchants /> },
          { path: "merchants/create", element: <MerchantCreate /> },
          { path: "merchants/:id", element: <MerchantShow /> },
          { path: "merchants/edit/:id", element: <MerchantEdit /> },
          { path: "users", element: <Users /> },
          { path: "users/create", element: <UserCreate /> },
          { path: "users/:id", element: <UserShow /> },
          { path: "users/edit/:id", element: <UserEdit /> },
        ],
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
