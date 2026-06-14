const express = require('express');
const { auth: firebaseAuth } = require('../config/firebase');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { idToken } = req.body;
    const decoded = await firebaseAuth.verifyIdToken(idToken);
    const userRecord = await firebaseAuth.getUser(decoded.uid);
    const role = userRecord.customClaims?.role || 'staff';

    res.json({
      uid: userRecord.uid,
      email: userRecord.email,
      name: userRecord.displayName || userRecord.email?.split('@')[0] || 'User',
      role,
      token: idToken,
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

router.get('/me', protect, async (req, res) => {
  try {
    const userRecord = await firebaseAuth.getUser(req.user.uid);
    const role = userRecord.customClaims?.role || 'staff';
    res.json({
      uid: userRecord.uid,
      email: userRecord.email,
      name: userRecord.displayName || userRecord.email?.split('@')[0] || 'User',
      role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
