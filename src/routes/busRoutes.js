const express = require('express');
const router = express.Router();
const { registerBus, showBuses } = require('../controllers/busController');
const {validateBusInput}=require("../utils/validation");


router.post('/', validateBusInput, registerBus);
router.get('/', showBuses);


// Routes
// router.get('/', showBuses);
// router.get('/:busId', showBus);
// router.post('/', registerBusRules, registerBus);
// router.put('/:busId', updateBus);
// router.delete('/:busId', deleteBus);

module.exports = router;
