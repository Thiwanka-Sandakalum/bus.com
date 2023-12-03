const userService = require('../services/userService');

async function ps_validate(id) {
    const password = await userService.getPswd(id);
    console.log({ password: password.password });
}

function validateUserInput(req, res, next) {
    const { name, password, role, phone_number } = req.body;

    if (!name || !password || !role || !phone_number) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (role !== 'driver' && role !== 'customer') {
        return res.status(400).json({ error: 'Role must be either "driver" or "customer"' });
    }

    if (phone_number.length !== 10 || isNaN(phone_number)) {
        return res.status(400).json({ error: 'Invalid phone number' });
    }

    next();
};

function validateBusInput(req, res, next) {
    const { vehicle_number, from, to, available_dates, available_times, seat_count } = req.body;

    if (!vehicle_number || !from || !to || !available_dates || !available_times || !seat_count) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (vehicle_number.length < 3 || vehicle_number.length > 7) {
        return res.status(400).json({ error: 'Vehicle number must be between 3 and 7 characters' });
    }

    next();
};


function validateBookingInput(req, res, next) {
    const paymentMethods = ['Online', 'Cash'];

    const { booking_date, bus_id, booking_time, payment_method, amount_paid } = req.body;

    if (!booking_date || !bus_id || !booking_time || !payment_method || !amount_paid) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (!paymentMethods.includes(payment_method)) {
        return res.status(400).json({ error: 'Payment method must be either "Online" or "Cash"' });
    }

    if (isNaN(amount_paid) || parseFloat(amount_paid).toFixed(2) !== amount_paid) {
        return res.status(400).json({ error: 'Amount paid must be a valid decimal with 2 decimal places' });
    }

    next();
};
module.exports = { ps_validate, validateUserInput, validateBusInput, validateBookingInput }