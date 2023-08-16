const { createBooking, getBookings, getBooking, updateBookingById, deleteBookingById } = require('../services/bookingService');

const registerBooking = async (req, res) => {
    try {
        const { booking_date, booking_time, payment_method, amount_paid, bus_id } = req.body;
        const user_id = req.data.id;
        const bookingData = { booking_date, booking_time, payment_method, amount_paid, user_id, bus_id }
        await createBooking(bookingData);
        res.status(201).json({ massage: "sucessful register" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const showBookings = async (req, res) => {
    try {
        const bookings = await getBookings();
        res.status(200).json({ bookings });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const showBooking = async (req, res) => {
    try {
        const user_id = req.data.id;
        const booking = await getBooking(user_id);
        if (booking) {
            res.status(200).json({ booking });
            // console.log(booking)
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateBooking = async (req, res) => {
    try {
        const { user_id } = req.params;
        const newData = req.body;
        const updatedBooking = await updateBookingById(user_id, newData);
        if (updatedBooking) {
            res.status(200).json({ booking: updatedBooking });
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteBooking = async (req, res) => {
    try {
        const { booking_id } = req.body;
        const deletedBooking = await deleteBookingById(booking_id);
        if (deletedBooking) {
            res.status(200).json({ massage:"successful deleted" });
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    registerBooking,
    showBookings,
    showBooking,
    updateBooking,
    deleteBooking,
};
