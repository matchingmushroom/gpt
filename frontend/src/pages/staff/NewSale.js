import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const NewSale = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');

  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get(`${API}/products`, { headers });
      setProducts(data.filter(p => p.isActive && p.quantity > 0));
    };
    fetchProducts();
  }, []);

  const addToCart = () => {
    if (!selectedProduct) return;
    const product = products.find(p => p._id === selectedProduct);
    const qty = Number(quantity);
    if (qty < 1) return;
    if (qty > product.quantity) {
      setMessage(`Only ${product.quantity} available`);
      return;
    }
    const existing = cart.find(item => item.productId === selectedProduct);
    if (existing) {
      setCart(cart.map(item => item.productId === selectedProduct ? { ...item, quantity: item.quantity + qty, total: (item.quantity + qty) * item.unitPrice } : item));
    } else {
      setCart([...cart, { productId: product._id, productName: product.name, quantity: qty, unitPrice: product.price, total: product.price * qty }]);
    }
    setSelectedProduct('');
    setQuantity(1);
    setMessage('');
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) { setMessage('Add at least one item'); return; }
    try {
      await axios.post(`${API}/sales`, {
        items: cart,
        paymentMethod,
        customerName,
        customerContact,
        notes,
      }, { headers });
      setCart([]);
      setPaymentMethod('cash');
      setCustomerName('');
      setCustomerContact('');
      setNotes('');
      setMessage('Sale recorded successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error recording sale');
    }
  };

  return (
    <div>
      <h2>Record New Sale</h2>
      {message && <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>{message}</div>}

      <div className="card mb-3">
        <div className="card-body">
          <div className="row">
            <div className="col-md-5">
              <select className="form-select" value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
                <option value="">Select product...</option>
                {products.map(p => (
                  <option key={p._id} value={p._id}>{p.name} - ${p.price?.toFixed(2)} ({p.quantity} in stock)</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <input type="number" min="1" className="form-control" value={quantity} onChange={e => setQuantity(e.target.value)} />
            </div>
            <div className="col-md-2">
              <button className="btn btn-primary" onClick={addToCart}>Add to Cart</button>
            </div>
          </div>
        </div>
      </div>

      {cart.length > 0 && (
        <form onSubmit={handleSubmit}>
          <table className="table">
            <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Total</th><th></th></tr></thead>
            <tbody>
              {cart.map((item, i) => (
                <tr key={i}>
                  <td>{item.productName}</td>
                  <td>${item.unitPrice?.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>${item.total?.toFixed(2)}</td>
                  <td><button type="button" className="btn btn-sm btn-danger" onClick={() => removeFromCart(item.productId)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr><th colSpan="3">Total</th><th>${totalAmount.toFixed(2)}</th><th></th></tr>
            </tfoot>
          </table>

          <div className="row">
            <div className="col-md-3 mb-2">
              <label className="form-label">Payment</label>
              <select className="form-select" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="transfer">Transfer</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="col-md-3 mb-2">
              <label className="form-label">Customer Name</label>
              <input className="form-control" value={customerName} onChange={e => setCustomerName(e.target.value)} />
            </div>
            <div className="col-md-3 mb-2">
              <label className="form-label">Customer Contact</label>
              <input className="form-control" value={customerContact} onChange={e => setCustomerContact(e.target.value)} />
            </div>
            <div className="col-md-3 mb-2">
              <label className="form-label">Notes</label>
              <input className="form-control" value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
          </div>
          <button type="submit" className="btn btn-success mt-2">Complete Sale</button>
        </form>
      )}
    </div>
  );
};

export default NewSale;
