import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [showLowStock, setShowLowStock] = useState(false);

  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get(`${API}/products`, { headers });
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const displayed = showLowStock
    ? products.filter(p => p.quantity <= p.lowStockThreshold)
    : products;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h2>Inventory</h2>
        <div className="form-check form-switch">
          <input className="form-check-input" type="checkbox" id="lowStockToggle" checked={showLowStock} onChange={e => setShowLowStock(e.target.checked)} />
          <label className="form-check-label" htmlFor="lowStockToggle">Low stock only</label>
        </div>
      </div>
      <table className="table table-striped mt-3">
        <thead>
          <tr><th>Name</th><th>SKU</th><th>Price</th><th>Available</th><th>Category</th></tr>
        </thead>
        <tbody>
          {displayed.map(p => (
            <tr key={p._id} className={p.quantity <= p.lowStockThreshold ? 'table-warning' : ''}>
              <td>{p.name}</td>
              <td>{p.sku}</td>
              <td>${p.price?.toFixed(2)}</td>
              <td>
                {p.quantity}
                {p.quantity <= p.lowStockThreshold && <span className="badge bg-danger ms-1">Low Stock</span>}
              </td>
              <td>{p.category}</td>
            </tr>
          ))}
          {products.length === 0 && <tr><td colSpan="5" className="text-center">No products found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;
