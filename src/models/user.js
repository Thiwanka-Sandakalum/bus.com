const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.UUID, // Use UUID type for the ID
            defaultValue: () => uuidv4(), // Set a default value to generate UUIDs
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone_number: {
            type: DataTypes.CHAR(10),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value) {
                const hashedPassword = bcrypt.hashSync(value, 10);
                this.setDataValue('password', hashedPassword);
            },
        },
        role: {
            type: DataTypes.ENUM('customer', 'driver'),
            allowNull: false,
        },
    }
);

User.sync()
    .then(() => {
        console.log('User table created successfully.');
    })
    .catch((error) => {
        console.error('Unable to create User table:', error);
    });

module.exports = User;
