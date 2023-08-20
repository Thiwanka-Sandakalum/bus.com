const RefreshToken = require('../models/RefreshToken');
require('dotenv').config();
const jwt = require('jsonwebtoken');


// Create a new refresh token
async function createToken(user_id, refresh_token) {

    try {
        const decodedToken = jwt.decode(refresh_token);

        if (decodedToken && decodedToken.exp) {
            const expirationDate = new Date(decodedToken.exp * 1000); // Convert Unix timestamp to milliseconds
            console.log('Refresh token expires on:', expirationDate);

            await RefreshToken.create({
                user_id: user_id,
                refresh_token: refresh_token,
                expire_date: expirationDate
            });

        } else {
            console.log('Invalid or missing expiration date in the token.');
            return error('Invalid or missing expiration date in the token');
        }
    } catch (error) {
        console.error('Error decoding the refresh token:', error.message);
    }

}

// Get the refresh token
async function getToken(id) {
    return await RefreshToken.findOne({ where: { user_id: id } });
}

// Remove refresh token
async function removeToken(id) {
    await RefreshToken.destroy({
        where: {
            user_id: id
        }
    });
}

module.exports = {
    createToken,
    getToken,
    removeToken
};
