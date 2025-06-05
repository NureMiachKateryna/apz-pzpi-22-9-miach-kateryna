// models/user.model.js
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isEmail: true
            }
        }
        // created_at та updated_at будуть автоматично додані та керовані Sequelize
        // завдяки опціям нижче
    }, {
        tableName: 'Users',      // Явно вказуємо назву таблиці
        timestamps: true,        // Sequelize буде автоматично керувати createdAt та updatedAt
        underscored: true,       // Sequelize буде очікувати стовпці created_at та updated_at (snake_case)
                                 // і автоматично мапити їх на createdAt та updatedAt в екземплярах моделі
        // createdAt: 'created_at', // Необов'язково, якщо underscored: true і назва стовпця created_at
        // updatedAt: 'updated_at'  // Необов'язково, якщо underscored: true і назва стовпця updated_at
        hooks: {
            beforeCreate: async (user) => {
                if (user.password_hash) {
                    const salt = await bcrypt.genSalt(10);
                    user.password_hash = await bcrypt.hash(user.password_hash, salt);
                }
            },
            beforeUpdate: async (user) => {
                if (user.changed('password_hash') && user.password_hash) {
                    const salt = await bcrypt.genSalt(10);
                    user.password_hash = await bcrypt.hash(user.password_hash, salt);
                }
            }
        }
    });

    User.prototype.validPassword = async function(password) {
        return await bcrypt.compare(password, this.password_hash);
    };

    User.associate = (models) => {
        User.hasMany(models.StorageLocation, { foreignKey: 'user_id', as: 'storageLocations', onDelete: 'CASCADE' });
        User.hasMany(models.Sensor, { foreignKey: 'user_id', as: 'sensors', onDelete: 'CASCADE' });
        User.hasMany(models.HoneyBatch, { foreignKey: 'user_id', as: 'honeyBatches', onDelete: 'CASCADE' });
        User.hasMany(models.NotificationSetting, { foreignKey: 'user_id', as: 'notificationSettings', onDelete: 'CASCADE' });
        User.hasMany(models.Alert, { foreignKey: 'user_id', as: 'alerts', onDelete: 'CASCADE' });
    };

    return User;
};