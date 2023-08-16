const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('../config/database');

const RefreshToken = sequelize.define(
    'RefreshTokens',
    {
        id: {
            type: DataTypes.UUID, // Use UUID type for the ID
            defaultValue: () => uuidv4(), // Set a default value to generate UUIDs
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        refresh_token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expire_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
    },
    {
        tableName: 'refresh_tokens', // Specify the table name if different from the model name
        timestamps: true, // Set to false if you don't want Sequelize to automatically manage createdAt and updatedAt fields
    }
);

RefreshToken.sync()
    .then(() => {
        console.log('RefreshToken table created successfully.');
    })
    .catch((error) => {
        console.error('Unable to create RefreshToken table:', error);
    });

module.exports = RefreshToken;
