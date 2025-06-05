// models/honeyBatch.model.js
module.exports = (sequelize, DataTypes) => {
    const HoneyBatch = sequelize.define('HoneyBatch', {
        batch_id: {
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
        sort: {
            type: DataTypes.STRING
        },
        collection_date: {
            type: DataTypes.DATEONLY 
        },
        quantity: {
            type: DataTypes.REAL 
        },
        unit: {
            type: DataTypes.STRING 
        },
        storage_location_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        notes: {
            type: DataTypes.TEXT
        }
    }, {
        tableName: 'HoneyBatches',
        timestamps: true,   
        underscored: true,  
    });

    HoneyBatch.associate = (models) => {
        HoneyBatch.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        HoneyBatch.belongsTo(models.StorageLocation, { foreignKey: 'storage_location_id', as: 'storageLocation', allowNull: true });
    };

    return HoneyBatch;
};