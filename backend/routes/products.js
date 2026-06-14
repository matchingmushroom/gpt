const express = require('express');
const { db } = require('../config/firebase');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

const productsRef = db.collection('products');

router.get('/', async (req, res) => {
  try {
    let query = productsRef.orderBy('name');
    if (req.query.active === 'false') {
      query = query.where('isActive', '==', false);
    } else {
      query = query.where('isActive', '==', true);
    }

    const snapshot = await query.get();
    const products = [];
    snapshot.forEach(doc => {
      products.push({ _id: doc.id, ...doc.data() });
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const doc = await productsRef.doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ message: 'Product not found' });
    res.json({ _id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, sku, description, price, cost, quantity, lowStockThreshold, category, imageUrl } = req.body;

    const existing = await productsRef.where('sku', '==', sku).get();
    if (!existing.empty) return res.status(400).json({ message: 'SKU already exists' });

    const docRef = await productsRef.add({
      name,
      sku,
      description: description || '',
      price: Number(price),
      cost: Number(cost || 0),
      quantity: Number(quantity),
      lowStockThreshold: Number(lowStockThreshold || 5),
      category: category || 'General',
      imageUrl: imageUrl || '',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const doc = await docRef.get();
    res.status(201).json({ _id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const updateData = { ...req.body, updatedAt: new Date().toISOString() };
    delete updateData._id;

    if (updateData.price !== undefined) updateData.price = Number(updateData.price);
    if (updateData.cost !== undefined) updateData.cost = Number(updateData.cost);
    if (updateData.quantity !== undefined) updateData.quantity = Number(updateData.quantity);
    if (updateData.lowStockThreshold !== undefined) updateData.lowStockThreshold = Number(updateData.lowStockThreshold);

    const docRef = productsRef.doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ message: 'Product not found' });

    await docRef.update(updateData);
    const updated = await docRef.get();
    res.json({ _id: updated.id, ...updated.data() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const docRef = productsRef.doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ message: 'Product not found' });
    await docRef.delete();
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
