const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('../config/database');
const User = require('./user');

const Bus = sequelize.define('Bus', {
  id: {
    type: DataTypes.UUID, // Use UUID type for the ID
    defaultValue: () => uuidv4(), // Set a default value to generate UUIDs
    primaryKey: true,
  },
  vehicle_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  from: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  to: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  available_dates: {
    type: DataTypes.ENUM('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
    allowNull: false,
  },
  available_times: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fees: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  seat_count: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  facilities: {
    type: DataTypes.ENUM('Wifi', 'AC'),
    allowNull: false,
  }
});

Bus.belongsTo(User, { foreignKey: 'user_id' });

Bus.sync()
  .then(() => {
    console.log('Bus table created successfully.');
  })
  .catch((error) => {
    console.error('Unable to create Bus table:', error);
  });

module.exports = Bus;
