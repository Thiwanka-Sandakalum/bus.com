const { getBus } = require('../services/busService');
const { getBookingCount } = require('../services/bookingService');

const bus_search = async (req, res) => {
  const { from, to, available_dates } = req.body;

  if (!from && !to && !available_dates) {
    return res.status(400).json({ error: "Request body is required" });
  }

  try {
    const busData = await getBus(from, to, available_dates);
    if (busData) {
      return res.json(busData);
    }

    // const bookedCount = await getBookingCount(from, to, available_dates);
    // if (!bookedCount) {
    //   return res.sendStatus(404);
    // }

    return res.sendStatus(404).json({ error: busData.error });

  } catch (error) {
    res.json({ error: error.message });
  }
};

module.exports = { bus_search };
