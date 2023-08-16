const RefreshToken = require('../models/RefreshToken');
require('dotenv').config();


// Create a new refresh token
async function createToken(user_id, refresh_token) {
    const now = Date.now(); // Current time in milliseconds
    const expirationDuration = parseInt(process.env.DURATION_REFRESH_TOKEN); // Duration in milliseconds
    const expire_date = new Date(now + expirationDuration);

    await RefreshToken.create({
        user_id: user_id,
        refresh_token: refresh_token,
        expire_date: expire_date
    });
}

// Get the refresh token
async function getToken(id) {
    return await RefreshToken.findOne({ where: { user_id: id } });
}

// remove refresh token
async function removeToken(id) {
    await RefreshToken.destroy({
        where: {
            user_id: id
        }
    });
}

module.exports = {
    createToken, getToken, removeToken
};
