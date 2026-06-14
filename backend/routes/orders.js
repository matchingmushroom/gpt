const express = require('express');
const { db } = require('../config/firebase');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

const ordersRef = db.collection('orders');

router.post('/', async (req, res) => {
  try {
    const { items, totalAmount, customerName, customerAddress, notes } = req.body;
    const docRef = await ordersRef.add({
      items: items || [],
      totalAmount: Number(totalAmount),
      customerName: customerName || '',
      customerAddress: customerAddress || '',
      notes: notes || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    const doc = await docRef.get();
    res.status(201).json({ _id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const snapshot = await ordersRef.orderBy('createdAt', 'desc').get();
    const orders = [];
    snapshot.forEach(doc => orders.push({ _id: doc.id, ...doc.data() }));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const docRef = ordersRef.doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ message: 'Order not found' });
    await docRef.update({ status, updatedAt: new Date().toISOString() });
    const updated = await docRef.get();
    res.json({ _id: updated.id, ...updated.data() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
