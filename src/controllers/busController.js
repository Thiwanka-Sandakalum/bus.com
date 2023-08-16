const { createBus, getBuses, getBusByVehicleNumber, getBusByPhoneNumber, getBusById, updateBusById, deleteBusById } = require('../services/busService');
const { validationResult } = require('express-validator');

const registerBus = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const busData = req.body;
        const [vehicle_number, phone_number] = await Promise.all([
            getBusByVehicleNumber(busData.vehicle_number),
            // getBusByPhoneNumber(busData.phone_number)
        ]);

        if (vehicle_number) {
            return res.status(409).json({ message: 'This vehicle_number is already registered' });
        }

        // if (phone_number) {
        //     return res.status(409).json({ message: 'This phone_number is already registered' });
        // }

        const newBus = await createBus(busData);
        res.status(201).json({ bus: newBus });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



const showBuses = async (req, res) => {
    try {
        const buses = await getBuses();
        res.status(200).json({ buses });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const showBus = async (req, res) => {
    try {
        const { vehicle_number } = req.params;
        const bus = await getBusById(vehicle_number);
        if (bus) {
            res.status(200).json({ bus });
        } else {
            res.status(404).json({ message: 'Bus not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateBus = async (req, res) => {
    try {
        const { vehicle_number } = req.params;
        const newData = req.body;
        const updatedBus = await updateBusById(vehicle_number, newData);
        if (updatedBus) {
            res.status(200).json({ bus: updatedBus });
        } else {
            res.status(404).json({ message: 'Bus not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteBus = async (req, res) => {
    try {
        const { vehicle_number } = req.params;
        const deletedBus = await deleteBusById(vehicle_number);
        if (deletedBus) {
            res.status(200).json({ bus: deletedBus });
        } else {
            res.status(404).json({ message: 'Bus not found' });
        }
    } catch (error) {
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
