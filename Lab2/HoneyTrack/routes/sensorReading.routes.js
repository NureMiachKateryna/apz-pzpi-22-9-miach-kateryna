// routes/sensorReading.routes.js
const express = require('express');
const router = express.Router();
const sensorReadingController = require('../controllers/sensorReading.controller');
const authMiddleware = require('../middleware/auth.middleware'); 


router.post('/', authMiddleware, sensorReadingController.addReading);


router.get('/sensor/:sensorId', authMiddleware, sensorReadingController.getReadingsForSensor);
router.get('/sensor/:sensorId/latest', authMiddleware, sensorReadingController.getLatestReading);


module.exports = router;