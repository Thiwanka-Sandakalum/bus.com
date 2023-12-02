const { createBooking, getBookings, getBooking, updateBookingById, deleteBookingById } = require('../services/bookingService');
const { logger } = require('../logger/index');

const registerBooking = async (req, res) => {
    try {
        const { booking_date, booking_time, payment_method, amount_paid, bus_id } = req.body;
        const user_id = req.data.id;
        const bookingData = { booking_date, booking_time, payment_method, amount_paid, user_id, bus_id };
        await createBooking(bookingData);
        logger.info('Booking registered successfully.');
        res.status(201).json({ message: 'Successful registration' });
    } catch (error) {
        logger.error(`Error registering booking: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

const showBookings = async (req, res) => {
    try {
        const bookings = await getBookings();
        logger.info('Fetched all bookings.');
        res.status(200).json({ bookings });
    } catch (error) {
        logger.error(`Error fetching bookings: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

const showBooking = async (req, res) => {
    try {
        const user_id = req.data.id;
        const booking = await getBooking(user_id);
        if (booking) {
            logger.info('Fetched booking for user.');
            res.status(200).json({ booking });
        } else {
            logger.warn('Booking not found for user.');
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        logger.error(`Error fetching booking for user: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

const updateBooking = async (req, res) => {
    try {
        const { user_id } = req.params;
        const newData = req.body;
        const updatedBooking = await updateBookingById(user_id, newData);
        if (updatedBooking) {
            logger.info('Booking updated successfully.');
            res.status(200).json({ booking: updatedBooking });
        } else {
            logger.warn('Booking not found for update.');
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        logger.error(`Error updating booking: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

const deleteBooking = async (req, res) => {
    try {
        const { booking_id } = req.body;
        const deletedBooking = await deleteBookingById(booking_id);
        if (deletedBooking) {
            logger.info('Booking deleted successfully.');
            res.status(200).json({ message: 'Successful deletion' });
        } else {
            logger.warn('Booking not found for deletion.');
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        logger.error(`Error deleting booking: ${error.message}`);
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
