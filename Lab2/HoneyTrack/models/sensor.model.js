// models/sensor.model.js
module.exports = (sequelize, DataTypes) => {
    const Sensor = sequelize.define('Sensor', {
        sensor_id: { 
            type: DataTypes.STRING, 
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        location_id: {
            type: DataTypes.INTEGER,
            allowNull: true 
        },
        name: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.STRING 
        },
        last_active_at: {
            type: DataTypes.DATE
        }
    }, {
        tableName: 'Sensors',
        timestamps: true, 
        underscored: true
    });

    Sensor.associate = (models) => {
        Sensor.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        Sensor.belongsTo(models.StorageLocation, { foreignKey: 'location_id', as: 'storageLocation', allowNull: true });
        Sensor.hasMany(models.SensorReading, { foreignKey: 'sensor_id', as: 'readings', onDelete: 'CASCADE' });
        Sensor.hasMany(models.NotificationSetting, { foreignKey: 'sensor_id', as: 'notificationSettings', onDelete: 'CASCADE' });
        Sensor.hasMany(models.Alert, { foreignKey: 'sensor_id', as: 'alerts', onDelete: 'SET NULL' });
    };

    return Sensor;
};