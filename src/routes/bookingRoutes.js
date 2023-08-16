const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { auth } = require('../middlewares/authenticationMiddleware');
const { customer_auth } = require('../middlewares/authorizationMiddleware');



const paymentMethods = ['Online', 'Cash']; // Define allowed payment methods

const register_val = [
    body().notEmpty().withMessage('Body must not be empty'),
    body('booking_date').trim().notEmpty().withMessage('booking_date is required'),
    body('bus_id').trim().notEmpty().withMessage('bus_id is required'),
    body('booking_time').trim().notEmpty().withMessage('booking_time is required'),
    body('payment_method')
        .trim()
        .notEmpty()
        .withMessage('payment_method is required')
        .custom((value) => {
            if (!paymentMethods.includes(value)) {
                throw new Error('payment_method must be either "Online" or "Cash"');
            }
            return true;
        }),
    body('amount_paid')
        .trim()
        .notEmpty()
        .withMessage('amount_paid is required')
        .isDecimal({ decimal_digits: '2' })
        .withMessage('amount_paid must be a valid decimal with 2 decimal places'),
];

const { registerBooking, showBookings, showBooking, updateBooking, deleteBooking } = require('../controllers/bookingController');

// router.get('/', customer_auth, auth, showBookings);
router.get('/', customer_auth, auth, showBooking);
router.post('/', register_val, customer_auth, auth, registerBooking);
router.put('/:user_id', customer_auth, auth, updateBooking);
router.delete('/', customer_auth, auth, deleteBooking);

module.exports = router;
