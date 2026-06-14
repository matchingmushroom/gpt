const express = require('express');
const { db } = require('../config/firebase');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

const salesRef = db.collection('sales');
const productsRef = db.collection('products');

router.post('/', protect, async (req, res) => {
  try {
    const { items, paymentMethod, customerName, customerContact, notes } = req.body;
    let totalAmount = 0;
    const saleItems = [];

    for (const item of items) {
      const productDoc = await productsRef.doc(item.productId).get();
      if (!productDoc.exists) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      const product = productDoc.data();
      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      const unitPrice = product.price;
      const total = unitPrice * item.quantity;
      totalAmount += total;

      saleItems.push({
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        unitPrice,
        total,
      });

      await productsRef.doc(item.productId).update({
        quantity: product.quantity - item.quantity,
        updatedAt: new Date().toISOString(),
      });
    }

    const docRef = await salesRef.add({
      items: saleItems,
      totalAmount,
      paymentMethod: paymentMethod || 'cash',
      customerName: customerName || '',
      customerContact: customerContact || '',
      recordedBy: req.user.uid,
      recordedByName: req.user.name,
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const doc = await docRef.get();
    res.status(201).json({ _id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    let query = salesRef.orderBy('createdAt', 'desc');
    if (req.user.role === 'staff') {
      query = query.where('recordedBy', '==', req.user.uid);
    }
    const snapshot = await query.get();
    const sales = [];
    snapshot.forEach(doc => {
      sales.push({ _id: doc.id, ...doc.data() });
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/reports', protect, authorize('admin'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = salesRef.orderBy('createdAt', 'desc');
    const snapshot = await query.get();
    const sales = [];

    snapshot.forEach(doc => {
      const sale = { _id: doc.id, ...doc.data() };
      const saleDate = new Date(sale.createdAt);
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (saleDate >= start && saleDate <= end) {
          sales.push(sale);
        }
      } else {
        sales.push(sale);
      }
    });

    const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalTransactions = sales.length;

    const paymentBreakdown = {};
    const salesByStaff = {};

    sales.forEach(s => {
      paymentBreakdown[s.paymentMethod] = paymentBreakdown[s.paymentMethod] || { count: 0, total: 0 };
      paymentBreakdown[s.paymentMethod].count++;
      paymentBreakdown[s.paymentMethod].total += s.totalAmount;

      const staffKey = s.recordedByName || s.recordedBy || 'Unknown';
      salesByStaff[staffKey] = salesByStaff[staffKey] || { count: 0, total: 0 };
      salesByStaff[staffKey].count++;
      salesByStaff[staffKey].total += s.totalAmount;
    });

    res.json({
      totalRevenue,
      totalTransactions,
      paymentBreakdown: Object.entries(paymentBreakdown).map(([method, data]) => ({ _id: method, ...data })),
      salesByStaff: Object.entries(salesByStaff).map(([name, data]) => ({ user: { name }, ...data })),
      sales,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const doc = await salesRef.doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ message: 'Sale not found' });

    const sale = { _id: doc.id, ...doc.data() };
    if (req.user.role === 'staff' && sale.recordedBy !== req.user.uid) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
