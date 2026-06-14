const express = require('express');
const { auth: firebaseAuth } = require('../config/firebase');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const list = await firebaseAuth.listUsers();
    const users = list.users.map(u => ({
      _id: u.uid,
      uid: u.uid,
      name: u.displayName || u.email?.split('@')[0] || 'User',
      email: u.email,
      role: u.customClaims?.role || 'staff',
      isActive: !u.disabled,
    }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userRecord = await firebaseAuth.createUser({
      email,
      password,
      displayName: name,
      disabled: false,
    });
    await firebaseAuth.setCustomUserClaims(userRecord.uid, { role: role || 'staff' });
    res.status(201).json({
      _id: userRecord.uid,
      uid: userRecord.uid,
      name: userRecord.displayName,
      email: userRecord.email,
      role: role || 'staff',
    });
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ message: 'Email already in use' });
    }
    res.status(500).json({ message: error.message });
  }
});

router.put('/:uid', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, email, role, isActive, password } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.displayName = name;
    if (email !== undefined) updateData.email = email;
    if (password) updateData.password = password;
    if (isActive !== undefined) updateData.disabled = !isActive;

    await firebaseAuth.updateUser(req.params.uid, updateData);
    if (role !== undefined) {
      const userRecord = await firebaseAuth.getUser(req.params.uid);
      const currentClaims = userRecord.customClaims || {};
      await firebaseAuth.setCustomUserClaims(req.params.uid, { ...currentClaims, role });
    }
    const updated = await firebaseAuth.getUser(req.params.uid);
    res.json({
      _id: updated.uid,
      name: updated.displayName,
      email: updated.email,
      role: updated.customClaims?.role || 'staff',
      isActive: !updated.disabled,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:uid', protect, authorize('admin'), async (req, res) => {
  try {
    await firebaseAuth.deleteUser(req.params.uid);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
