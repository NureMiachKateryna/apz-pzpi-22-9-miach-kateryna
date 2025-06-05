// models/sensorReading.model.js
module.exports = (sequelize, DataTypes) => {
    const SensorReading = sequelize.define('SensorReading', {
        reading_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        sensor_id: { 
            type: DataTypes.STRING, 
            allowNull: false
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        value_type: { 
            type: DataTypes.STRING,
            allowNull: false
        },
        value: {
            type: DataTypes.REAL, 
            allowNull: false
        }
    }, {
        tableName: 'SensorReadings',
        timestamps: false, 
        underscored: true
    });

    SensorReading.associate = (models) => {
        SensorReading.belongsTo(models.Sensor, { foreignKey: 'sensor_id', as: 'sensor' });
        SensorReading.hasOne(models.Alert, { foreignKey: 'reading_id', as: 'alert', allowNull: true, onDelete: 'SET NULL' });
    };

    return SensorReading;
};