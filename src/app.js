const express = require('express');
const app = express();
const cors = require('cors');
const user_router = require('./routes/userRoutes');
const bus_router = require('./routes/busRoutes');
const booking_router = require('./routes/bookingRoutes');
const { scheduleTokenCleanup } = require('./utils/token_handle');
const {logger,apiLogger} = require('./logger/index');
require('dotenv').config();

scheduleTokenCleanup();

var corsOptions = {
    origin: process.env.ORIGIN_URL
}

app.use((req, res, next) => {
    apiLogger.http(`${req.method} ${req.url}`);
    next();
  });
  
const PORT = 3000 || process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


app.use('/user', cors(corsOptions), user_router);
app.use('/bus', cors(corsOptions), bus_router);
app.use('/booking', cors(corsOptions), booking_router);

app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
});
