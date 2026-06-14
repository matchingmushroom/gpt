import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const Reports = () => {
  const [reports, setReports] = useState(null);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  const fetchReports = async (startDate, endDate) => {
    const params = {};
    if (startDate && endDate) { params.startDate = startDate; params.endDate = endDate; }
    const { data } = await axios.get(`${API}/sales/reports`, { headers, params });
    setReports(data);
  };

  useEffect(() => { fetchReports(); }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchReports(dateRange.startDate, dateRange.endDate);
  };

  if (!reports) return <div className="spinner-border"></div>;

  return (
    <div>
      <h2>Sales Reports</h2>

      <form className="row mt-3 mb-3" onSubmit={handleFilter}>
        <div className="col-auto">
          <input type="date" className="form-control" value={dateRange.startDate} onChange={e => setDateRange({ ...dateRange, startDate: e.target.value })} />
        </div>
        <div className="col-auto">
          <input type="date" className="form-control" value={dateRange.endDate} onChange={e => setDateRange({ ...dateRange, endDate: e.target.value })} />
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-primary">Filter</button>
        </div>
      </form>

      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5>Total Revenue</h5>
              <h3 className="text-success">${reports.totalRevenue?.toFixed(2)}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5>Total Transactions</h5>
              <h3 className="text-primary">{reports.totalTransactions}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5>Payment Breakdown</h5>
              <table className="table table-sm">
                <thead><tr><th>Method</th><th>Count</th><th>Total</th></tr></thead>
                <tbody>
                  {reports.paymentBreakdown?.map((p, i) => (
                    <tr key={i}><td>{p._id}</td><td>{p.count}</td><td>${p.total?.toFixed(2)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h5>Sales by Staff</h5>
              <table className="table table-sm">
                <thead><tr><th>Staff</th><th>Sales</th><th>Total</th></tr></thead>
                <tbody>
                  {reports.salesByStaff?.map((s, i) => (
                    <tr key={i}><td>{s.user?.name || 'Unknown'}</td><td>{s.count}</td><td>${s.total?.toFixed(2)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
