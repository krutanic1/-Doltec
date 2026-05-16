import React from 'react';
import AdminIndex from '../real-estate/pages/Admin/Index';

/**
 * Wrapper for the Real Estate Admin Moderation interface.
 * This component integrates the premium moderation workflow into the main Admin dashboard.
 */
export default function AdminRealEstateWrapper() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <AdminIndex />
    </div>
  );
}
