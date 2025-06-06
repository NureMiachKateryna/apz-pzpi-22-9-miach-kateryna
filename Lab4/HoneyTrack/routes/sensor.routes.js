// routes/sensor.routes.js
const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensor.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware, sensorController.registerSensor);
router.get('/', authMiddleware, sensorController.getAllSensors);
router.get('/:sensorId', authMiddleware, sensorController.getSensorById);
router.put('/:sensorId', authMiddleware, sensorController.updateSensor);
router.delete('/:sensorId', authMiddleware, sensorController.deleteSensor);

module.exports = router;