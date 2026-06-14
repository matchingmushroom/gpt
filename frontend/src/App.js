import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminSales from './pages/admin/SalesLog';
import AdminReports from './pages/admin/Reports';
import StaffDashboard from './pages/staff/Dashboard';
import StaffNewSale from './pages/staff/NewSale';
import StaffMySales from './pages/staff/MySales';
import StaffInventory from './pages/staff/Inventory';

const App = () => {
  const { user } = useAuth();

  return (
    <div>
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute roles={['admin']}><AdminProducts /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute roles={['admin']}><AdminOrders /></ProtectedRoute>} />
        <Route path="/admin/sales" element={<ProtectedRoute roles={['admin']}><AdminSales /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute roles={['admin']}><AdminReports /></ProtectedRoute>} />
        <Route path="/staff" element={<ProtectedRoute roles={['staff']}><StaffDashboard /></ProtectedRoute>} />
        <Route path="/staff/new-sale" element={<ProtectedRoute roles={['staff']}><StaffNewSale /></ProtectedRoute>} />
        <Route path="/staff/my-sales" element={<ProtectedRoute roles={['staff']}><StaffMySales /></ProtectedRoute>} />
        <Route path="/staff/inventory" element={<ProtectedRoute roles={['staff']}><StaffInventory /></ProtectedRoute>} />
      </Routes>
    </div>
  );
};

export default App;
