// services/honeyBatchService.js
const { HoneyBatch, User, StorageLocation } = require('../models');

async function createHoneyBatch(userId, batchData) {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error('User not found for creating honey batch.');
    }
    if (batchData.storage_location_id) {
        const location = await StorageLocation.findOne({
            where: { location_id: batchData.storage_location_id, user_id: userId }
        });
        if (!location) {
            throw new Error('Storage location not found or access denied for this batch.');
        }
    }
    try {
        const newBatch = await HoneyBatch.create({ ...batchData, user_id: userId });
        return newBatch.get({ plain: true });
    } catch (error) {
        console.error("Error creating honey batch:", error);
        throw new Error("Could not create honey batch.");
    }
}

async function getHoneyBatchById(batchId, userId) {
    const batch = await HoneyBatch.findOne({
        where: { batch_id: batchId, user_id: userId },
        include: [
            { model: User, as: 'user', attributes: ['user_id', 'username', 'email'] },
            { model: StorageLocation, as: 'storageLocation' }
        ]
    });
    return batch ? batch.get({ plain: true }) : null;
}

async function getAllHoneyBatchesForUser(userId, queryOptions = {}) {
  
    const { sort, storage_location_id } = queryOptions;
    let whereClause = { user_id: userId };
    if (storage_location_id) {
        whereClause.storage_location_id = storage_location_id;
    }
 

    let orderClause = [['created_at', 'DESC']];
    if (sort) { 
        const [field, direction] = sort.split('_');
        if (['name', 'sort', 'collection_date', 'quantity'].includes(field) && ['asc', 'desc'].includes(direction)) {
            orderClause = [[field, direction.toUpperCase()]];
        }
    }

    const batches = await HoneyBatch.findAll({
        where: whereClause,
        include: [
            { model: StorageLocation, as: 'storageLocation' }
        ],
        order: orderClause
    });
    return batches.map(b => b.get({ plain: true }));
}

async function updateHoneyBatch(batchId, userId, updateData) {
    const batch = await HoneyBatch.findOne({
        where: { batch_id: batchId, user_id: userId }
    });
    if (!batch) {
        throw new Error('Honey batch not found or access denied.');
    }
    if (updateData.storage_location_id && updateData.storage_location_id !== batch.storage_location_id) {
        const location = await StorageLocation.findOne({
            where: { location_id: updateData.storage_location_id, user_id: userId }
        });
        if (!location) {
            throw new Error('Target storage location not found or access denied.');
        }
    }
    try {
        const updatedBatch = await batch.update(updateData);
        return updatedBatch.get({ plain: true });
    } catch (error) {
        console.error(`Error updating honey batch ${batchId}:`, error);
        throw new Error("Could not update honey batch.");
    }
}

async function deleteHoneyBatch(batchId, userId) {
    const batch = await HoneyBatch.findOne({
        where: { batch_id: batchId, user_id: userId }
    });
    if (!batch) {
        throw new Error('Honey batch not found or access denied.');
    }
    await batch.destroy();
    return { message: 'Honey batch deleted successfully.' };
}

async function getHoneyBatchesCountForUser(userId) {
    try {
        const count = await HoneyBatch.count({ where: { user_id: userId } });
        return { count };
    } catch (error) {
        console.error(`Error fetching honey batch count for user ${userId}:`, error);
        throw new Error("Could not fetch honey batch count.");
    }
}

module.exports = {
    createHoneyBatch,
    getHoneyBatchById,
    getAllHoneyBatchesForUser,
    updateHoneyBatch,
    deleteHoneyBatch,
    getHoneyBatchesCountForUser
};