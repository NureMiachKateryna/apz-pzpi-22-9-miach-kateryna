// HONEYTRACK/routes/admin.routes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const userController = require('../controllers/user.controller'); 
const authMiddleware = require('../middleware/auth.middleware');
const adminAuthMiddleware = require('../middleware/adminAuth.middleware');

router.use(authMiddleware);
router.use(adminAuthMiddleware);

router.get('/users', userController.getAllUsersForAdmin);

router.put('/users/:userId/role', adminController.changeUserRole);

router.put('/users/:userId/status', adminController.setUserActiveStatus);




module.exports = router;