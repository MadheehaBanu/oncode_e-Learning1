const express = require('express');
const router = express.Router();
const { getDatabase } = require('../config/database');

router.post('/', async (req, res) => {
    const { uid } = req.body;

    if (!uid) {
        return res.status(400).json({ error: 'UID is required' });
    }

    try {
        const db = getDatabase();
        await db.collection('users').doc(uid).update({
            role: 'admin',
            updatedAt: new Date().toISOString() // Use string for consistancy with frontend
        });

        console.log(`[FixAdmin] User ${uid} promoted to admin.`);
        res.json({ message: 'User promoted to admin successfully' });
    } catch (error) {
        console.error('[FixAdmin] Error promoting user:', error);
        res.status(500).json({ error: 'Failed to update user role', details: error.message });
    }
});

module.exports = router;
