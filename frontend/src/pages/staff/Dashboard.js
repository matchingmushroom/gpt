import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalSales: 0, totalRevenue: 0, lowStockCount: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const [salesRes, productsRes] = await Promise.all([
          axios.get(`${API}/sales`, { headers }),
          axios.get(`${API}/products?lowStock=true`, { headers }),
        ]);
        const totalRevenue = salesRes.data.reduce((sum, s) => sum + s.totalAmount, 0);
        setStats({ totalSales: salesRes.data.length, totalRevenue, lowStockCount: productsRes.data.length });
      } catch (err) { console.error(err); }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h2>Staff Dashboard</h2>
      <div className="row mt-4">
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5>My Sales</h5>
              <h3>{stats.totalSales}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5>My Revenue</h5>
              <h3>${stats.totalRevenue.toFixed(2)}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5>Low Stock Items</h5>
              <h3>{stats.lowStockCount}</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-md-4 mb-2">
          <Link to="/staff/new-sale" className="btn btn-success w-100">Record New Sale</Link>
        </div>
        <div className="col-md-4 mb-2">
          <Link to="/staff/my-sales" className="btn btn-primary w-100">View My Sales</Link>
        </div>
        <div className="col-md-4 mb-2">
          <Link to="/staff/inventory" className="btn btn-info w-100">View Inventory</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
