// HONEYTRACK/models/user.model.js
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
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'ROLE_USER', 
            allowNull: false,
            validate: {
                isIn: [['ROLE_USER', 'ROLE_ADMIN']]
            }
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true, 
            allowNull: false
        }
       
    }, {
        tableName: 'Users',
        timestamps: true,
        underscored: true,
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