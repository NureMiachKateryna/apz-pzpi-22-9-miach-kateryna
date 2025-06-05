// app.js
require('dotenv').config(); // Завантажуємо змінні середовища з .env
const express = require('express');
const cors = require('cors');
const path = require('path'); // Для роботи зі шляхами (може не знадобитися, якщо не роздаєте статику)

// Імпортуємо sequelize з models/index.js для підключення до БД
// models/index.js вже має виконати authenticate() та PRAGMA foreign_keys
const { sequelize } = require('./models');

// Імпортуємо роути
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes'); // Припускаємо, що ви його створите (для /me)
const storageLocationRoutes = require('./routes/storageLocation.routes');
const sensorRoutes = require('./routes/sensor.routes');
const honeyBatchRoutes = require('./routes/honeyBatch.routes');
const sensorReadingRoutes = require('./routes/sensorReading.routes');
const notificationSettingRoutes = require('./routes/notificationSetting.routes');
const alertRoutes = require('./routes/alert.routes');

// Імпортуємо middleware для обробки помилок
const errorHandler = require('./middleware/errorHandler.middleware');

const app = express();

// Middleware
app.use(cors()); // Дозволяємо CORS-запити
app.use(express.json()); // Для парсингу JSON тіл запитів
app.use(express.urlencoded({ extended: true })); // Для парсингу URL-encoded тіл

// Роути API
app.get('/api', (req, res) => { // Тестовий роут
    res.json({ message: "Welcome to HoneyTrack API!" });
});

// Підключення всіх роутів
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/storage-locations', storageLocationRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/honey-batches', honeyBatchRoutes);

// Для sensorReadings, якщо ви вирішили мати окремий префікс:
app.use('/api/sensor-readings', sensorReadingRoutes);


app.use('/api/notification-settings', notificationSettingRoutes);
app.use('/api/alerts', alertRoutes);


// Централізований обробник помилок (має бути після всіх роутів та app.use)
app.use(errorHandler);

const PORT = process.env.PORT || 3000; 

// Функція для запуску сервера
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