const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlwares/auth');
const { createorderId, verify, order } = require('../controllers/paymentcontroller');


router.post('/razorpay/:cid', isAuthenticated,order);

module.exports = router;
