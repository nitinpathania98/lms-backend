const express = require('express');
const router = express.Router();
const authenticateToken=require('../Middlewares/userAuth')
// Protected route
router.get('/', authenticateToken, (req, res) => {
res.status(200).json({ message: 'Protected route accessed' });
});

module.exports = router;