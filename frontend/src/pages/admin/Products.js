import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', sku: '', price: '', cost: '', quantity: '', lowStockThreshold: 5, category: 'General', description: '', imageUrl: '' });

  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    const { data } = await axios.get(`${API}/products`, { headers });
    setProducts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), cost: Number(form.cost), quantity: Number(form.quantity), lowStockThreshold: Number(form.lowStockThreshold) };
    if (editingId) {
      await axios.put(`${API}/products/${editingId}`, payload, { headers });
    } else {
      await axios.post(`${API}/products`, payload, { headers });
    }
    resetForm();
    fetchProducts();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ name: '', sku: '', price: '', cost: '', quantity: '', lowStockThreshold: 5, category: 'General', description: '', imageUrl: '' });
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, sku: p.sku, price: p.price, cost: p.cost, quantity: p.quantity, lowStockThreshold: p.lowStockThreshold, category: p.category, description: p.description, imageUrl: p.imageUrl || '' });
    setEditingId(p._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      await axios.delete(`${API}/products/${id}`, { headers });
      fetchProducts();
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h2>Inventory Management</h2>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>{showForm ? 'Cancel' : 'Add Product'}</button>
      </div>

      {showForm && (
        <div className="card mt-3">
          <div className="card-body">
            <h5>{editingId ? 'Edit Product' : 'Add Product'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-3 mb-2">
                  <input className="form-control" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="col-md-2 mb-2">
                  <input className="form-control" placeholder="SKU" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} required />
                </div>
                <div className="col-md-2 mb-2">
                  <input type="number" step="0.01" className="form-control" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div className="col-md-1 mb-2">
                  <input type="number" className="form-control" placeholder="Qty" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required />
                </div>
                <div className="col-md-2 mb-2">
                  <input className="form-control" placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                </div>
                <div className="col-md-4 mb-2">
                  <input className="form-control" placeholder="Image URL" value={form.imageUrl || ''} onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
                </div>
                <div className="col-md-2 mb-2">
                  <button type="submit" className="btn btn-success w-100">{editingId ? 'Update' : 'Create'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="table table-striped mt-3">
        <thead>
          <tr><th>Name</th><th>SKU</th><th>Price</th><th>Qty</th><th>Category</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id} className={p.quantity <= p.lowStockThreshold ? 'table-warning' : ''}>
              <td>{p.name}</td>
              <td>{p.sku}</td>
              <td>${p.price?.toFixed(2)}</td>
              <td>
                {p.quantity}
                {p.quantity <= p.lowStockThreshold && <span className="badge bg-danger ms-1">Low</span>}
              </td>
              <td>{p.category}</td>
              <td><span className={`badge ${p.isActive ? 'bg-success' : 'bg-secondary'}`}>{p.isActive ? 'Active' : 'Inactive'}</span></td>
              <td>
                <button className="btn btn-sm btn-warning me-1" onClick={() => handleEdit(p)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
