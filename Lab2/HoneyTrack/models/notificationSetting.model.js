// models/notificationSetting.model.js
module.exports = (sequelize, DataTypes) => {
    const NotificationSetting = sequelize.define('NotificationSetting', {
        setting_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sensor_id: { 
            type: DataTypes.STRING, 
            allowNull: true 
        },
        parameter_type: { 
            type: DataTypes.STRING,
            allowNull: false
        },
        min_threshold: {
            type: DataTypes.REAL,
            allowNull: true
        },
        max_threshold: {
            type: DataTypes.REAL,
            allowNull: true
        },
        is_enabled: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    }, {
        tableName: 'NotificationSettings',
        timestamps: true,
        underscored: true
    });

    NotificationSetting.associate = (models) => {
        NotificationSetting.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        NotificationSetting.belongsTo(models.Sensor, { foreignKey: 'sensor_id', as: 'sensor', allowNull: true });
    };

    return NotificationSetting;
};
