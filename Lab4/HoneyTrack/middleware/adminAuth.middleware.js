// HONEYTRACK/middleware/adminAuth.middleware.js
module.exports = (req, res, next) => {
   
    if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated.' });
    }

    if (req.user.role !== 'ROLE_ADMIN') {
        return res.status(403).json({ message: 'Forbidden: Admin access required.' });
    }
    next();
};