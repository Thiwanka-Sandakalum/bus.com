const express = require('express');
const app = express();
const cors = require('cors');
const bodyparser = require('body-parser')
const user_router = require('./routes/userRoutes');
const bus_router = require('./routes/busRoutes');
const booking_router = require('./routes/bookingRoutes');
const {scheduleTokenCleanup} = require('./utils/token_handle');

// Start the scheduled job for token cleanup
scheduleTokenCleanup();


const PORT = 3000 || environment.port;
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.use(cors());


app.use('/user', user_router);

app.use('/bus', bus_router);

app.use('/booking', booking_router);


app.listen(PORT, console.log(`server listening on port ${PORT}`));