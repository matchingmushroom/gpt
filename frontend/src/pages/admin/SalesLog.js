import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const SalesLog = () => {
  const [sales, setSales] = useState([]);

  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  useEffect(() => {
    const fetchSales = async () => {
      const { data } = await axios.get(`${API}/sales`, { headers });
      setSales(data);
    };
    fetchSales();
  }, []);

  return (
    <div>
      <h2>Sales Log</h2>
      <table className="table table-striped mt-3">
        <thead>
          <tr><th>Date</th><th>Items</th><th>Total</th><th>Payment</th><th>Customer</th><th>Recorded By</th></tr>
        </thead>
        <tbody>
          {sales.map(sale => (
            <tr key={sale._id}>
              <td>{new Date(sale.createdAt).toLocaleString()}</td>
              <td>
                {sale.items?.map((item, i) => (
                  <div key={i}>{item.productName} x{item.quantity} @ ${item.unitPrice?.toFixed(2)}</div>
                ))}
              </td>
              <td>${sale.totalAmount?.toFixed(2)}</td>
              <td><span className="badge bg-info">{sale.paymentMethod}</span></td>
              <td>{sale.customerName || '-'}</td>
              <td>{sale.recordedBy?.name || 'Unknown'}</td>
            </tr>
          ))}
          {sales.length === 0 && <tr><td colSpan="6" className="text-center">No sales recorded yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default SalesLog;
