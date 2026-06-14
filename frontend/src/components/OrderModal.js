import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const modalStyles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999,
  },
  content: {
    background: '#fff', padding: 24, borderRadius: 12,
    maxWidth: 400, width: '90%', textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    animation: 'fadeIn .3s', position: 'relative',
  },
  closeBtn: { background: 'none', border: 'none', fontSize: 22, position: 'absolute', top: 16, right: 20, cursor: 'pointer', color: '#555' },
  img: { width: '100%', borderRadius: 10, marginBottom: 10 },
  input: { width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 6, fontSize: 14, margin: '8px 0', boxSizing: 'border-box' },
  qtyBox: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, margin: '10px 0' },
  qtyBtn: { padding: '4px 10px', border: 'none', background: '#eee', borderRadius: 6, cursor: 'pointer', fontSize: 18 },
  total: { fontWeight: 600, marginTop: 6, color: '#E67E22' },
  btn: { background: '#E67E22', color: '#fff', padding: '10px 14px', borderRadius: 8, border: 'none', fontSize: 14, cursor: 'pointer', width: '100%', marginTop: 12 },
};

const OrderModal = ({ product, onClose }) => {
  const [qty, setQty] = useState(1);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');

  const total = product.price * qty;

  const handleSubmit = async () => {
    if (!name.trim() || !address.trim()) {
      alert('Please enter your name and address.');
      return;
    }

    try {
      await axios.post(`${API}/orders`, {
        items: [{ productId: product._id, productName: product.name, quantity: qty, unitPrice: product.price, total }],
        totalAmount: total,
        customerName: name,
        customerAddress: address,
      });
    } catch (err) {
      console.error('Failed to save order');
    }

    const phone = '9779741203315';
    const msg = `Hello GPT 👋,%0AOrder Details:%0AProduct: *${product.name}*%0ADescription: ${product.description || product.flavour || ''}%0APrice: Rs ${product.price}%0AQuantity: ${qty}%0A*Total: Rs ${total}*%0A%0ACustomer: ${name}%0AAddress: ${address}`;
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    setMessage('Order placed! WhatsApp opened.');
    setTimeout(onClose, 1500);
  };

  return (
    <div style={modalStyles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={modalStyles.content}>
        <button style={modalStyles.closeBtn} onClick={onClose}>&times;</button>
        <img style={modalStyles.img} src={product.imageUrl || 'https://via.placeholder.com/300'} alt={product.name} />
        <h3>{product.name}</h3>
        <p style={{ color: '#555', fontSize: 14 }}>{product.description || product.flavour || ''}</p>
        <p style={{ fontWeight: 600, color: '#E67E22' }}>Price: Rs {product.price}</p>

        <input style={modalStyles.input} placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} />
        <input style={modalStyles.input} placeholder="Your Address" value={address} onChange={e => setAddress(e.target.value)} />

        <div style={modalStyles.qtyBox}>
          <button style={modalStyles.qtyBtn} onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
          <span style={{ fontSize: 18, minWidth: 30 }}>{qty}</span>
          <button style={modalStyles.qtyBtn} onClick={() => setQty(qty + 1)}>+</button>
        </div>
        <div style={modalStyles.total}>Total: Rs {total}</div>

        {message && <p style={{ color: 'green', fontSize: 14 }}>{message}</p>}
        <button style={modalStyles.btn} onClick={handleSubmit}>Confirm & Order on WhatsApp</button>
      </div>
    </div>
  );
};

export default OrderModal;
