const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('../config/database');

const RefreshToken = sequelize.define(
    'RefreshToken',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: () => uuidv4(),
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
        tableName: 'refresh_tokens',
        timestamps: true,
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
