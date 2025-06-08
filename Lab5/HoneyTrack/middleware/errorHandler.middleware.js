// middleware/errorHandler.middleware.js
module.exports = (err, req, res, next) => {
    console.error("ERROR STACK:", err.stack); 

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Відповідь клієнту
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack, details: err.errors || err.parent || err.original }),
    });
};