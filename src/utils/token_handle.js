const cron = require('node-cron');
const { Op } = require('sequelize');
const { removeToken } = require('../services/RefreshToken'); // Import your removeToken function
const RefreshToken = require('../models/RefreshToken');

// Define a scheduled job to remove expired tokens
function scheduleTokenCleanup() {
    // Run the cleanup task every hour (at the beginning of the hour)
    cron.schedule('0 * * * *', async () => {
        try {
            const now = new Date();
            const expiredTokens = await RefreshToken.findAll({
                where: {
                    expire_date: {
                        [Op.lt]: now,
                    },
                },
            });

            for (const token of expiredTokens) {
                await removeToken(token.user_id);
                console.log(`Expired token removed for user ${token.user_id}`);
            }
        } catch (error) {
            console.error('Error during token cleanup:', error);
        }
    });
}

module.exports = { scheduleTokenCleanup };
