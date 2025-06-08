// HONEYTRACK/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { sequelize } = require('./models');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const storageLocationRoutes = require('./routes/storageLocation.routes');
const sensorRoutes = require('./routes/sensor.routes');
const honeyBatchRoutes = require('./routes/honeyBatch.routes');
const sensorReadingRoutes = require('./routes/sensorReading.routes');
const notificationSettingRoutes = require('./routes/notificationSetting.routes');
const alertRoutes = require('./routes/alert.routes');
const adminRoutes = require('./routes/admin.routes'); 

const errorHandler = require('./middleware/errorHandler.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/api', (req, res) => {
    res.json({ message: "Welcome to HoneyTrack API!" });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/storage-locations', storageLocationRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/honey-batches', honeyBatchRoutes);
app.use('/api/sensor-readings', sensorReadingRoutes);
app.use('/api/notification-settings', notificationSettingRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/admin', adminRoutes); 

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        console.log('Sequelize has been initialized (connection check in models/index.js).');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`API available at http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error('Unable to start the server application:', error);
        process.exit(1);
    }
}

startServer();