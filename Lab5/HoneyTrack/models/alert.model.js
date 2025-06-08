// HONEYTRACK/models/alert.model.js
module.exports = (sequelize, DataTypes) => {
    const Alert = sequelize.define('Alert', {
        alert_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'user_id'
            }
        },
        sensor_id: {
            type: DataTypes.STRING,
            allowNull: true,
            references: {
                model: 'Sensors',
                key: 'sensor_id'
            }
        },
        reading_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'SensorReadings', 
                key: 'reading_id'
            }
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        alert_level: {
            type: DataTypes.STRING,
            validate: {
                isIn: [['info', 'warning', 'critical']]
            }
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        is_read: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        tableName: 'Alerts',
        timestamps: false, 
        underscored: true
    });

    Alert.associate = (models) => {
        Alert.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        Alert.belongsTo(models.Sensor, { foreignKey: 'sensor_id', as: 'sensor', allowNull: true });
        Alert.belongsTo(models.SensorReading, { foreignKey: 'reading_id', as: 'triggeringReading', allowNull: true });
    };

    return Alert;
};