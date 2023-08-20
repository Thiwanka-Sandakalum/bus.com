const { getBus } = require('../services/busService');
const { getBookingCount } = require('../services/bookingService');

const bus_search = async (req, res) => {
  const { from, to, available_dates } = req.body;

  // Validate if required fields are provided
  if (!from && !to && !available_dates) {
    return res.status(400).json({ error: "from, to, dates are required" });
  }

  try {
    // Call the service function to get bus data based on search criteria
    const busData = await getBus(from, to, available_dates);
    
    return res.status(200).json(busData);

    // if (busData.length > 0) {
    //   return res.status(200).json(busData);
    // } else {
    //   return res.status(404).json({ message: "No buses found matching the criteria" });
    // }

    // You can uncomment the following section if you want to check booked counts as well
    /*
    const bookedCount = await getBookingCount(from, to, available_dates);
    if (!bookedCount) {
      return res.status(404).json({ message: "Bookings not found" });
    }
    */

  } catch (error) {
    // Handle any errors that occurred during the search
    res.status(500).json({ error: "An error occurred while searching for buses" });
  }
};

module.exports = { bus_search };
