import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import { Navbar } from "./components/Navbar";

import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { UploadResume } from "./pages/UploadResume";
import { MyResumes } from "./pages/MyResumes";
import { BrowseResumes } from "./pages/BrowseResumes";
import { ResumeDetail } from "./pages/ResumeDetail";

const ProtectedLayout = ({ children }) => (
  <ProtectedRoute>
    <div className="min-h-screen bg-black text-[#e7e9ea] flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  </ProtectedRoute>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedLayout>
                <UploadResume />
              </ProtectedLayout>
            }
          />
          <Route
            path="/my-resumes"
            element={
              <ProtectedLayout>
                <MyResumes />
              </ProtectedLayout>
            }
          />
          <Route
            path="/browse"
            element={
              <ProtectedLayout>
                <BrowseResumes />
              </ProtectedLayout>
            }
          />
          <Route
            path="/resume/:id"
            element={
              <ProtectedLayout>
                <ResumeDetail />
              </ProtectedLayout>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
