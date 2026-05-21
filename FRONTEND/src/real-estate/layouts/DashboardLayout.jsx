import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import DashboardTopbar from '../components/navigation/DashboardTopbar';
import '../re.css';

export default function DashboardLayout({
  title = 'Dashboard',
  subtitle = 'Manage properties, leads, saved items, and workspace operations from one place.',
  children,
}) {
  return (
    <div style={{
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      background: 'linear-gradient(180deg, #f8f9fc 0%, #edf2ff 100%)',
      color: '#0f1629',
      fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      WebkitFontSmoothing: 'antialiased',
    }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <DashboardTopbar title={title} subtitle={subtitle} />
        <main style={{
          flex: 1,
          padding: '28px 32px',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
