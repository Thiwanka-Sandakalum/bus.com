const { devLogger, apiLogger } = require('./dev-logger')
const { prodLoggr } = require('./prod-logger')

require('dotenv').config();
let logger;

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === "development") {
    logger = devLogger();

} else if (process.env.NODE_ENV === "production") {
    logger=prodLoggr();
}


module.exports = {
    logger,
    apiLogger
};