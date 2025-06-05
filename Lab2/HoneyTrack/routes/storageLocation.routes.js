// routes/storageLocation.routes.js
const express = require('express');
const router = express.Router();
const storageLocationController = require('../controllers/storageLocation.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware, storageLocationController.createStorageLocation);
router.get('/', authMiddleware, storageLocationController.getAllStorageLocations);
router.get('/:locationId', authMiddleware, storageLocationController.getStorageLocationById);
router.put('/:locationId', authMiddleware, storageLocationController.updateStorageLocation);
router.delete('/:locationId', authMiddleware, storageLocationController.deleteStorageLocation);

module.exports = router;