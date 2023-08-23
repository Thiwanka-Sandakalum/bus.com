const { getBus } = require('../services/busService');
const { getBookings, getbooking_count } = require('../services/bookingService');

const bus_search = async (req, res) => {
  const { from, to, available_dates, date } = req.body;

  // Validate if required fields are provided
  if (!from || !to || !available_dates) {
    return res.status(400).json({ error: "from, to, and available_dates are required" });
  }

  try {
    // Call the service function to get bus data based on search criteria
    const busData = await getBus(from, to, available_dates);

    // Calculate and update seat counts for each bus
    for (const bus of busData) {
      const count = await getbooking_count(date, bus.id);
      bus.seat_count -= count;
    }

    res.status(200).json(busData);

  } catch (error) {
    console.error(error);
    // Handle any errors that occurred during the search
    res.status(500).json({ error: "An error occurred while searching for buses" });
  }
};

module.exports = { bus_search };
