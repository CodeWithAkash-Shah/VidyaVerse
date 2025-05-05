import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/auth";
import MainLayout from '@/components/layout/MainLayout';
import DesktopNavbar from '@/components/layout/DesktopNavbar';
import Auth from '@/pages/auth/Auth';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

const RoleRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { user } = useAuth();
  if (!user || !allowedRoles.includes(user.role || '')) {
    if (user?.role) {
      return <Navigate to="/" replace />;
    } 
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();
  const showTeacherCoPilot = user && (user.role === 'teacher' || user.role === 'admin');

  return (
  <>
  <Routes>
    <Route path="/auth" element={<Auth />} />
    <Route path="/" element={<DesktopNavbar />}/>
  </Routes>
  </>
  );
};

export default AppRoutes;
