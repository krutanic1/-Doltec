import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import DashboardTopbar from '../components/navigation/DashboardTopbar';

export default function DashboardLayout({
  title = 'Dashboard',
  subtitle = 'Manage properties, leads, saved items, and workspace operations from one place.',
  children,
}) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc', color: '#0f172a' }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <DashboardTopbar title={title} subtitle={subtitle} />
        <main style={{ flex: 1, padding: 28 }}>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
