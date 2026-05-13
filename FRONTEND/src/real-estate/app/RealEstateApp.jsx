import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import routes from './routes';
import RealEstateLayout from '../layouts/RealEstateLayout';

export default function RealEstateApp() {
  return (
    <BrowserRouter basename="/real-estate">
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<RealEstateLayout />}>{routes}</Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
