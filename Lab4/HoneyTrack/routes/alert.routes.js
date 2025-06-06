// routes/alert.routes.js
const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alert.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', authMiddleware, alertController.getAlerts);
router.patch('/:alertId/read', authMiddleware, alertController.markAsRead); 
router.patch('/read-all', authMiddleware, alertController.markAllAsRead); 
router.delete('/:alertId', authMiddleware, alertController.deleteAlert);

module.exports = router;