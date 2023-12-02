const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('../config/database');
const User = require('./user');
const Bus = require('./bus');


const Booking = sequelize.define('Bookings', {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true,
  },
  booking_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  booking_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  payment_method: {
    type: DataTypes.ENUM('Cash', 'Online'),
    allowNull: false,
  },
  amount_paid: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
});

Booking.belongsTo(User, { foreignKey: 'user_id' });
Booking.belongsTo(Bus, { foreignKey: 'bus_id' });

Booking.sync()
  .then(() => {
    console.log('Booking table created successfully.');
  })
  .catch((error) => {
    console.error('Unable to create booking table:', error);
  });

module.exports = Booking;
