// HONEYTRACK/routes/user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');


router.get('/me', authMiddleware, userController.getCurrentUser);

router.put('/me', authMiddleware, userController.updateCurrentUser);


module.exports = router;