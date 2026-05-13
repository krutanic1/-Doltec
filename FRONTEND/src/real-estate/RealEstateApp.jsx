import { Routes, Route } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Home from '../Pages/Home';
import Properties from '../Pages/Properties';
import PropertyDetail from '../Pages/PropertyDetail';
import Login from '../Pages/Login';
import Register from '../Pages/Register';
import Dashboard from '../Pages/Dashboard';
import CreateProperty from '../Pages/CreateProperty';
import EditProperty from '../Pages/EditProperty';
import ManageProperties from '../Pages/ManageProperties';
import ViewLeads from '../Pages/ViewLeads';

export default function RealEstateApp() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col real-estate-module">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:slug" element={<PropertyDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-property" element={<CreateProperty />} />
          <Route path="/edit-property/:slug" element={<EditProperty />} />
          <Route path="/manage" element={<ManageProperties />} />
          <Route path="/leads" element={<ViewLeads />} />
        </Routes>


      </main>
    </div>
  );
}
