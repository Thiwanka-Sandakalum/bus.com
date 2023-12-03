const Booking = require('../models/booking');
const Bus=require('../models/bus');

async function createBooking(bookingData) {
    return await Booking.create(bookingData);
}

async function getbooking_count(date, bus_id) {
    return await Booking.count({
        where: {
            booking_date: date,
            bus_id: bus_id
        }
    })
}

async function getBookings() {
    return await Booking.findAll();
}

async function getBooking(user_id) {
    return await Booking.findAll({
        where: {
            user_id: user_id,
        },
        include: [
            {
                model: Bus,
                attributes: ['vehicle_number', 'from', 'to', 'available_dates', 'available_times', 'fees', 'seat_count', 'facilities'],
                required: true,
            },
        ],
    });
}


async function updateBookingById(user_id, newData) {
    return await Booking.update(newData, {
        where: {
            id: user_id,
        },
    });
}

async function deleteBookingById(booking_id) {
    return await Booking.destroy({
        where: {
            id: booking_id,
        },
    });
}

module.exports = {
    getbooking_count,
    createBooking,
    getBookings,
    getBooking,
    updateBookingById,
    deleteBookingById,
};
