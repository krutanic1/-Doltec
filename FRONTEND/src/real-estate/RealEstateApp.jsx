import { Routes, Route } from 'react-router-dom';
import React, { useEffect } from 'react';
import './re.css';

import RealEstateHeader from './components/RealEstateHeader';
import RealEstateFooter from './components/RealEstateFooter';
import Home             from './pages/HomePage';
import Properties       from './pages/Listing';
import PropertyDetail   from './pages/PropertyDetail';
import SignIn           from './pages/auth/SignIn';
import SignUp           from './pages/auth/SignUp';
import Dashboard        from './pages/Dashboard';
import PostProperty     from './pages/PostProperty';

export default function RealEstateApp() {
  useEffect(() => {
    document.title = 'Doltec Properties | Premium Real Estate Marketplace India';
  }, []);

  return (
    <div className="re-root-override" style={{
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      background: '#ffffff',
      backgroundImage: 'none',
      color: '#0f172a',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <RealEstateHeader />

      <main style={{ flex: 1, paddingTop: 68 }}>
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/properties"    element={<Properties />} />
          <Route path="/properties/:slug" element={<PropertyDetail />} />
          <Route path="/login"         element={<SignIn />} />
          <Route path="/register"      element={<SignUp />} />
          <Route path="/dashboard"     element={<Dashboard />} />
          <Route path="/post-property" element={<PostProperty />} />
        </Routes>
      </main>

      <RealEstateFooter />
    </div>
  );
}
