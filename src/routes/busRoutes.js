const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { registerBus, showBuses, showBus, updateBus, deleteBus } = require('../controllers/busController');

const registerBusRules = [
    body('vehicle_number')
        .trim()
        .notEmpty().withMessage('vehicle number is required')
        .isLength({ min: 3, max: 7 }).withMessage('vehicle number must below 7 characters'),

    body('from').trim().notEmpty().withMessage('Name is required'),
    body('to').trim().notEmpty().withMessage('Name is required'),
    body('available_dates').trim().notEmpty().withMessage('available_dates is required'),
    body('available_times').trim().notEmpty().withMessage('available_times is required'),
    body('seat_count').trim().notEmpty().withMessage('seat_count is required'),

    // body('phone_number')
    //     .trim()
    //     .notEmpty().withMessage('Phone number is required')
    //     .isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 characters')
    //     .isNumeric().withMessage('Invalid phone number')

];

// Routes
router.get('/', showBuses);
router.get('/:busId', showBus);
router.post('/', registerBusRules, registerBus);
router.put('/:busId', updateBus);
router.delete('/:busId', deleteBus);

module.exports = router;
