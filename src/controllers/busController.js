const { createBus, getBuses, getBusByVehicleNumber, getBusById, updateBusById, deleteBusById } = require('../services/busService');
const { validationResult } = require('express-validator');
const { logger } = require('../logger/index');

const registerBus = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn('Validation error during bus registration');
            return res.status(400).json({ errors: errors.array() });
        }

        const busData = req.body;
        const existingBus = await getBusByVehicleNumber(busData.vehicle_number);

        if (existingBus) {
            logger.warn('Bus registration attempt with duplicate vehicle number');
            return res.status(409).json({ message: 'This vehicle_number is already registered' });
        }

        const newBus = await createBus(busData);
        logger.info('Bus registered successfully.');
        res.status(201).json({ bus: newBus });
    } catch (error) {
        logger.error(`Error registering bus: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

const showBuses = async (req, res) => {
    try {
        const buses = await getBuses();
        logger.info('Fetched all buses.');
        res.status(200).json({ buses });
    } catch (error) {
        logger.error(`Error fetching buses: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

const showBus = async (req, res) => {
    try {
        const { vehicle_number } = req.params;
        const bus = await getBusById(vehicle_number);
        if (bus) {
            logger.info(`Fetched bus with vehicle number: ${vehicle_number}`);
            res.status(200).json({ bus });
        } else {
            logger.warn(`Bus not found with vehicle number: ${vehicle_number}`);
            res.status(404).json({ message: 'Bus not found' });
        }
    } catch (error) {
        logger.error(`Error fetching bus: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

const updateBus = async (req, res) => {
    try {
        const { vehicle_number } = req.params;
        const newData = req.body;
        const updatedBus = await updateBusById(vehicle_number, newData);
        if (updatedBus) {
            logger.info(`Bus updated successfully with vehicle number: ${vehicle_number}`);
            res.status(200).json({ bus: updatedBus });
        } else {
            logger.warn(`Bus not found for update with vehicle number: ${vehicle_number}`);
            res.status(404).json({ message: 'Bus not found' });
        }
    } catch (error) {
        logger.error(`Error updating bus: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

const deleteBus = async (req, res) => {
    try {
        const { vehicle_number } = req.params;
        const deletedBus = await deleteBusById(vehicle_number);
        if (deletedBus) {
            logger.info(`Bus deleted successfully with vehicle number: ${vehicle_number}`);
            res.status(200).json({ bus: deletedBus });
        } else {
            logger.warn(`Bus not found for deletion with vehicle number: ${vehicle_number}`);
            res.status(404).json({ message: 'Bus not found' });
        }
    } catch (error) {
        logger.error(`Error deleting bus: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    registerBus,
    showBuses,
    showBus,
    updateBus,
    deleteBus,
};
