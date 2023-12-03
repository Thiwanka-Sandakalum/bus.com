const { getBus } = require('../services/busService');
const { getBookings, getbooking_count } = require('../services/bookingService');
const { logger } = require('../logger/index');

const bus_search = async (req, res) => {
  const { from, to, available_dates, date } = req.body;

  if (!from || !to || !available_dates) {
    logger.warn("Invalid request parameters for bus search.");
    return res.status(400).json({ error: "from, to, and available_dates are required" });
  }

  try {
    const busData = await getBus(from, to, available_dates);

    for (const bus of busData) {
      const count = await getbooking_count(date, bus.id);
      bus.seat_count -= count;
    }

    logger.info("Bus search successful.");
    res.status(200).json(busData);

  } catch (error) {
    logger.error(`Error occurred during bus search: ${error.message}`);
    console.error(error);
    res.status(500).json({ error: "An error occurred while searching for buses" });
  }
};

module.exports = { bus_search };
