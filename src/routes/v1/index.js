const express = require('express');
const BookingController = require('../../controller/booking-controller');

const router = express.Router();


router.post('/bookings', BookingController.create);


module.exports = router;