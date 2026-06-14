import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const statusBadge = {
  pending: 'bg-warning',
  confirmed: 'bg-primary',
  completed: 'bg-success',
  cancelled: 'bg-danger',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await axios.get(`${API}/orders`, { headers });
      setOrders(data);
    };
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await axios.put(`${API}/orders/${id}`, { status }, { headers });
    setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
  };

  return (
    <div>
      <h2>Customer Orders</h2>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Address</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td>{order.customerName || '-'}</td>
              <td>{order.customerAddress || '-'}</td>
              <td>
                {order.items?.map((item, i) => (
                  <div key={i}>{item.productName} x{item.quantity}</div>
                ))}
              </td>
              <td>Rs {order.totalAmount?.toFixed(2)}</td>
              <td><span className={`badge ${statusBadge[order.status] || 'bg-secondary'}`}>{order.status}</span></td>
              <td>
                <div className="btn-group btn-group-sm">
                  {order.status === 'pending' && (
                    <>
                      <button className="btn btn-primary" onClick={() => updateStatus(order._id, 'confirmed')}>Confirm</button>
                      <button className="btn btn-danger" onClick={() => updateStatus(order._id, 'cancelled')}>Cancel</button>
                    </>
                  )}
                  {order.status === 'confirmed' && (
                    <button className="btn btn-success" onClick={() => updateStatus(order._id, 'completed')}>Complete</button>
                  )}
                  {order.status === 'completed' && (
                    <span className="text-muted">Done</span>
                  )}
                  {order.status === 'cancelled' && (
                    <span className="text-muted">Cancelled</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr><td colSpan="7" className="text-center">No orders yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
