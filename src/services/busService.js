const Bus = require('../models/bus');

async function createBus(busData) {
    return await Bus.create(busData);
}

async function getBuses() {
    return await Bus.findAll();
}

async function getBus(from, to, available_dates	) {
    return await Bus.findAll({
        where: {
            from: from,
            to: to,
            available_dates: available_dates
        }
    });
}


async function getBusByPhoneNumber(phoneNumber) {
    return await Bus.findOne({ where: { phone_number: phoneNumber } });
}

async function getBusByVehicleNumber(vehicleNumber) {
    return await Bus.findOne({ where: { vehicle_number: vehicleNumber } });
}


async function getBusById(busId) {
    return await Bus.findByPk(busId);
}

async function updateBusById(busId, newData) {
    return await Bus.update(newData, {
        where: {
            id: busId,
        },
    });
}

async function deleteBusById(busId) {
    return await Bus.destroy({
        where: {
            id: busId,
        },
    });
}

module.exports = {
    createBus,
    getBusByPhoneNumber,
    getBusByVehicleNumber,
    getBuses,
    getBus,
    getBusById,
    updateBusById,
    deleteBusById,
};
