// controllers/honeyBatch.controller.js
const honeyBatchService = require('../services/honeyBatchService');

exports.createHoneyBatch = async (req, res, next) => {
    try {
        const userId = req.user.user_id; 
        const batchData = req.body; 
        const newBatch = await honeyBatchService.createHoneyBatch(userId, batchData);
        res.status(201).json(newBatch);
    } catch (error) {
       
        next(error); 
    }
};

exports.getAllHoneyBatches = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const batches = await honeyBatchService.getAllHoneyBatchesForUser(userId, req.query);
        res.status(200).json(batches);
    } catch (error) {
        next(error);
    }
};

exports.getHoneyBatchById = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const batchId = parseInt(req.params.batchId);
         if (isNaN(batchId)) return res.status(400).json({ error: 'Invalid batch ID' });

        const batch = await honeyBatchService.getHoneyBatchById(batchId, userId);
        if (!batch) return res.status(404).json({ error: 'Honey batch not found' });
        res.status(200).json(batch);
    } catch (error) {
        next(error);
    }
};

exports.updateHoneyBatch = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const batchId = parseInt(req.params.batchId);
        if (isNaN(batchId)) return res.status(400).json({ error: 'Invalid batch ID' });
        const updateData = req.body;

        const updatedBatch = await honeyBatchService.updateHoneyBatch(batchId, userId, updateData);
        if (!updatedBatch) return res.status(404).json({ error: 'Honey batch not found for update' });
        res.status(200).json(updatedBatch);
    } catch (error) {
        next(error);
    }
};

exports.deleteHoneyBatch = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const batchId = parseInt(req.params.batchId);
        if (isNaN(batchId)) return res.status(400).json({ error: 'Invalid batch ID' });

        await honeyBatchService.deleteHoneyBatch(batchId, userId);
        res.status(204).send();
    } catch (error) {
    
        next(error);
    }
};

exports.getHoneyBatchesCount = async (req, res, next) => {
    try {
        const userId = req.user.user_id;
        const result = await honeyBatchService.getHoneyBatchesCountForUser(userId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};