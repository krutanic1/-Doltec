import React, { lazy } from 'react';
import { Route } from 'react-router-dom';

const HomePage = lazy(() => import('../pages/HomePage'));
const ListingPage = lazy(() => import('../pages/Listing'));
const PropertyPage = lazy(() => import('../pages/PropertyDetail'));
const SignIn = lazy(() => import('../pages/auth/SignIn'));
const SignUp = lazy(() => import('../pages/auth/SignUp'));
const PostProperty = lazy(() => import('../pages/PostProperty'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Saved = lazy(() => import('../pages/Saved'));
const AdminIndex = lazy(() => import('../pages/Admin/Index'));

const routes = (
  <>
    <Route index element={<HomePage />} />
    <Route path="listing" element={<ListingPage />} />
    <Route path="property/:slug" element={<PropertyPage />} />
    <Route path="auth/login" element={<SignIn />} />
    <Route path="auth/signup" element={<SignUp />} />
    <Route path="post" element={<PostProperty />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="saved" element={<Saved />} />
    <Route path="admin" element={<AdminIndex />} />
  </>
);

export default routes;
