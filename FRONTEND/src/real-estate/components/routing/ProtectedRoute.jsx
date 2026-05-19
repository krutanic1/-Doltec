import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { canAccess } from '../../utils/access';

export default function ProtectedRoute({ children, route }) {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/real-estate/auth/login" replace state={{ from: location.pathname }} />;
  }

  if (route && !canAccess(route)) {
    return <Navigate to="/real-estate/dashboard" replace />;
  }

  return children;
}
