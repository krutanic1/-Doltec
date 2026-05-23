import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './re.css';

import RealEstateLayout from './layouts/RealEstateLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/routing/ProtectedRoute';
import { ROUTES } from './config/navigation';

import Home from './pages/HomePage';
import Listing from './pages/Listing';
import PropertyDetail from './pages/PropertyDetail';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import Dashboard from './pages/Dashboard';
import PostProperty from './pages/PostProperty';
import EditProperty from './pages/EditProperty';
import Saved from './pages/Saved';
import Compare from './pages/Compare';
import WorkspaceDashboard from './pages/Workspace/WorkspaceDashboard';
import WorkspaceProperties from './pages/Workspace/WorkspaceProperties';
import WorkspaceLeads from './pages/Workspace/WorkspaceLeads';
import WorkspaceSettings from './pages/Workspace/WorkspaceSettings';
import ListingsOverviewPage from './pages/Workspace/ListingsOverviewPage';
import WorkspaceFeaturedSlots from './pages/Workspace/WorkspaceFeaturedSlots';
import CampaignAnalytics from './pages/Workspace/CampaignAnalytics';
import AdminIndex from './pages/Admin/Index';

const protectedShell = (page, route, layoutProps = {}) => (
  <ProtectedRoute route={route}>
    <DashboardLayout {...layoutProps}>{page}</DashboardLayout>
  </ProtectedRoute>
);

const toRelativePath = (path) => {
  if (!path) return '';
  return path.replace(/^\/real-estate\/?/, '');
};

export default function RealEstateApp() {
  useEffect(() => {
    document.title = 'Doltec Properties | Premium Real Estate Marketplace India';
    
    // Save original styles
    const originalBgImage = document.body.style.backgroundImage;
    const originalBgColor = document.body.style.backgroundColor;
    const originalColor = document.body.style.color;
    
    // Set real estate module theme on body
    document.body.style.backgroundImage = 'none';
    document.body.style.backgroundColor = '#f8fafc';
    document.body.style.color = '#0f172a';
    
    return () => {
      // Restore original theme on unmount
      document.body.style.backgroundImage = originalBgImage;
      document.body.style.backgroundColor = originalBgColor;
      document.body.style.color = originalColor;
    };
  }, []);

  return (
    <div className="re-root-override" style={{ minHeight: '100vh', color: '#0f172a', overflowX: 'hidden', width: '100%' }}>
      <Routes>
        <Route path="/" element={<RealEstateLayout />}>
          <Route index element={<Home />} />
          <Route path="listing" element={<Listing />} />
          <Route path="properties" element={<Listing />} />
          <Route path="property/:slug" element={<PropertyDetail />} />
          <Route path="properties/:slug" element={<PropertyDetail />} />
          <Route path="compare" element={<Compare />} />
          <Route path="auth/login" element={<SignIn />} />
          <Route path="auth/signup" element={<SignUp />} />
          <Route path="login" element={<SignIn />} />
          <Route path="register" element={<SignUp />} />
        </Route>

        <Route
          path={toRelativePath(ROUTES.protected.dashboard)}
          element={protectedShell(<Dashboard />, { permission: 'dashboard:view', roles: ['ADMIN', 'SELLER', 'BUILDER', 'AGENT', 'OWNER'] }, { title: 'Dashboard', subtitle: 'Manage your properties, leads, and profile from one place.' })}
        />
        <Route
          path={toRelativePath(ROUTES.protected.postProperty)}
          element={protectedShell(<PostProperty />, { permission: 'property:create', roles: ['ADMIN', 'SELLER', 'BUILDER', 'AGENT', 'OWNER'] }, { title: 'Create Property', subtitle: 'Publish a listing and route it into moderation or workspace flows.' })}
        />
        <Route
          path={toRelativePath(ROUTES.legacy.post)}
          element={protectedShell(<PostProperty />, { permission: 'property:create', roles: ['ADMIN', 'SELLER', 'BUILDER', 'AGENT', 'OWNER'] }, { title: 'Create Property', subtitle: 'Legacy alias for the property posting flow.' })}
        />
        <Route
          path={toRelativePath(ROUTES.protected.editProperty)}
          element={protectedShell(<EditProperty />, { permission: 'property:update', roles: ['ADMIN', 'SELLER', 'BUILDER', 'AGENT', 'OWNER'] }, { title: 'Edit Property', subtitle: 'Update a listing and re-submit it with the latest details.' })}
        />
        <Route
          path={toRelativePath(ROUTES.protected.saved)}
          element={protectedShell(<Saved />, { permission: 'saved:view', roles: ['ADMIN', 'SELLER', 'BUILDER', 'AGENT', 'OWNER'] }, { title: 'Saved Properties', subtitle: 'Review shortlisted listings and continue comparing or contacting owners.' })}
        />
        <Route
          path={toRelativePath(ROUTES.protected.workspace)}
          element={protectedShell(<WorkspaceDashboard />, { permission: 'workspace:view', roles: ['ADMIN', 'SELLER', 'BUILDER', 'AGENT', 'OWNER'] }, { title: 'Workspace', subtitle: 'A modular control panel for portfolio, leads, billing, and access.' })}
        />
        <Route
          path={toRelativePath(ROUTES.protected.workspaceProperties)}
          element={protectedShell(<WorkspaceProperties />, { permission: 'property:list', roles: ['ADMIN', 'SELLER', 'BUILDER', 'AGENT', 'OWNER'] }, { title: 'Workspace Properties', subtitle: 'Manage properties attached to the current workspace account.' })}
        />
        <Route
          path={toRelativePath(ROUTES.protected.listingsAll)}
          element={protectedShell(<ListingsOverviewPage />, { permission: 'property:list', roles: ['ADMIN', 'SELLER', 'BUILDER', 'AGENT', 'OWNER'] }, { title: 'All Listings', subtitle: 'Detailed view of all listings inside your workspace.' })}
        />
        <Route
          path={toRelativePath(ROUTES.protected.listingsPlain)}
          element={protectedShell(<ListingsOverviewPage />, { permission: 'property:list', roles: ['ADMIN', 'SELLER', 'BUILDER', 'AGENT', 'OWNER'] }, { title: 'Plain Listings', subtitle: 'Detailed view of Plain listings inside your workspace.' })}
        />
        <Route
          path={toRelativePath(ROUTES.protected.listingsBasic)}
          element={protectedShell(<ListingsOverviewPage />, { permission: 'property:list', roles: ['ADMIN', 'SELLER', 'BUILDER', 'AGENT', 'OWNER'] }, { title: 'Basic Listings', subtitle: 'Detailed view of Basic listings inside your workspace.' })}
        />
        <Route
          path={toRelativePath(ROUTES.protected.listingsPlatinum)}
          element={protectedShell(<ListingsOverviewPage />, { permission: 'property:list', roles: ['ADMIN', 'SELLER', 'BUILDER', 'AGENT', 'OWNER'] }, { title: 'Platinum Listings', subtitle: 'Detailed view of Platinum listings inside your workspace.' })}
        />
        <Route
          path={toRelativePath(ROUTES.protected.listingsPremium)}
          element={protectedShell(<ListingsOverviewPage />, { permission: 'property:list', roles: ['ADMIN', 'SELLER', 'BUILDER', 'AGENT', 'OWNER'] }, { title: 'Premium Listings', subtitle: 'Detailed view of Premium listings inside your workspace.' })}
        />
        <Route
          path={toRelativePath(ROUTES.protected.workspaceCompare)}
          element={protectedShell(<Compare />, { permission: 'compare:view', roles: ['ADMIN', 'SELLER', 'BUILDER', 'AGENT', 'OWNER'] }, { title: 'Compare Properties', subtitle: 'Review and compare shortlisted properties side-by-side.' })}
        />
        <Route
          path={toRelativePath(ROUTES.protected.workspaceLeads)}
          element={protectedShell(<WorkspaceLeads />, { permission: 'lead:view', roles: ['ADMIN', 'SELLER', 'BUILDER', 'AGENT', 'OWNER'] }, { title: 'Workspace Leads', subtitle: 'Review and convert incoming property leads.' })}
        />
        <Route
          path={toRelativePath(ROUTES.protected.workspaceSettings)}
          element={protectedShell(<WorkspaceSettings />, { permission: 'account:manage', roles: ['ADMIN', 'SELLER', 'BUILDER', 'AGENT', 'OWNER'] }, { title: 'Workspace Settings', subtitle: 'Manage your profile, team members, subscription plan, and billing tiers.' })}
        />
        <Route
          path={toRelativePath(ROUTES.protected.workspaceFeaturedSlots)}
          element={protectedShell(<WorkspaceFeaturedSlots />, { permission: 'property:list', roles: ['ADMIN', 'SELLER', 'BUILDER', 'AGENT', 'OWNER'] }, { title: 'Featured Slots', subtitle: 'Manage active featured slots.' })}
        />
        <Route
          path={toRelativePath(ROUTES.protected.campaignAnalytics)}
          element={protectedShell(<CampaignAnalytics />, { permission: 'analytics:view', roles: ['ADMIN', 'SELLER', 'BUILDER', 'AGENT', 'OWNER'] }, { title: 'Campaign Analytics', subtitle: 'Track your property marketing performance.' })}
        />
        <Route
          path={toRelativePath(ROUTES.protected.admin)}
          element={protectedShell(<AdminIndex />, { permission: 'property:moderate', roles: ['ADMIN'] }, { title: 'Admin Review', subtitle: 'Approve or reject pending listings before they go live.' })}
        />

        <Route path="*" element={<Navigate to="/real-estate" replace />} />
      </Routes>
    </div>
  );
}
