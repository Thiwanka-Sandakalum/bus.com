const cron = require('node-cron');
const { Op } = require('sequelize');
const { removeToken } = require('../services/RefreshToken');
const RefreshToken = require('../models/RefreshToken');
const { logger } = require('../logger/index');

function scheduleTokenCleanup() {
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
                logger.info(`Expired token removed for user ${token.user_id}`);
            }
        } catch (error) {
            logger.error(`Error during token cleanup: ${error.message}`);
        }
    });
}

module.exports = { scheduleTokenCleanup };
