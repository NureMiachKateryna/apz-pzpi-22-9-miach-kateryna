// models/storageLocation.model.js
module.exports = (sequelize, DataTypes) => {
    const StorageLocation = sequelize.define('StorageLocation', {
        location_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT
        }
    }, {
        tableName: 'StorageLocations',
        timestamps: true,
        underscored: true
    });

    StorageLocation.associate = (models) => {
        StorageLocation.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        StorageLocation.hasMany(models.Sensor, { foreignKey: 'location_id', as: 'sensors', onDelete: 'SET NULL' });
        StorageLocation.hasMany(models.HoneyBatch, { foreignKey: 'storage_location_id', as: 'honeyBatches', onDelete: 'SET NULL' });
    };

    return StorageLocation;
};