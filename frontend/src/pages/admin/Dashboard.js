import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, totalTransactions: 0, totalProducts: 0, totalStaff: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const [reportsRes, productsRes, usersRes] = await Promise.all([
          axios.get(`${API}/sales/reports`, { headers }),
          axios.get(`${API}/products`, { headers }),
          axios.get(`${API}/users`, { headers }),
        ]);
        setStats({
          totalRevenue: reportsRes.data.totalRevenue || 0,
          totalTransactions: reportsRes.data.totalTransactions || 0,
          totalProducts: productsRes.data.length,
          totalStaff: usersRes.data.length,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div className="row mt-4">
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Total Revenue</h5>
              <h3>${stats.totalRevenue.toFixed(2)}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Transactions</h5>
              <h3>{stats.totalTransactions}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-info">
            <div className="card-body">
              <h5 className="card-title">Products</h5>
              <h3>{stats.totalProducts}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5 className="card-title">Staff</h5>
              <h3>{stats.totalStaff}</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-md-2 mb-2">
          <Link to="/admin/users" className="btn btn-outline-primary w-100">Staff</Link>
        </div>
        <div className="col-md-2 mb-2">
          <Link to="/admin/products" className="btn btn-outline-success w-100">Inventory</Link>
        </div>
        <div className="col-md-2 mb-2">
          <Link to="/admin/orders" className="btn btn-outline-danger w-100">Orders</Link>
        </div>
        <div className="col-md-2 mb-2">
          <Link to="/admin/sales" className="btn btn-outline-info w-100">Sales</Link>
        </div>
        <div className="col-md-2 mb-2">
          <Link to="/admin/reports" className="btn btn-outline-warning w-100">Reports</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
