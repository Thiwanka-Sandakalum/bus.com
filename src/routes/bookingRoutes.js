const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/authenticationMiddleware');
const { customer_auth } = require('../middlewares/authorizationMiddleware');
const { validateBookingInput } = require("../utils/validation");
const { registerBooking, showBooking, updateBooking, deleteBooking } = require('../controllers/bookingController');




router.get('/', customer_auth, auth, showBooking);
router.post('/', validateBookingInput, customer_auth, auth, registerBooking);
router.put('/:user_id', customer_auth, auth, updateBooking);
router.delete('/', customer_auth, auth, deleteBooking);

module.exports = router;
