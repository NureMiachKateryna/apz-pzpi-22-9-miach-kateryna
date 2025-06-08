// HONEYTRACK/routes/honeyBatch.routes.js
const express = require('express');
const router = express.Router();
const honeyBatchController = require('../controllers/honeyBatch.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/count', authMiddleware, honeyBatchController.getHoneyBatchesCount); 

router.get('/', authMiddleware, honeyBatchController.getAllHoneyBatches);
router.post('/', authMiddleware, honeyBatchController.createHoneyBatch);
router.get('/:batchId', authMiddleware, honeyBatchController.getHoneyBatchById); 
router.put('/:batchId', authMiddleware, honeyBatchController.updateHoneyBatch);
router.delete('/:batchId', authMiddleware, honeyBatchController.deleteHoneyBatch);

module.exports = router;