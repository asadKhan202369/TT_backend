const Razorpay = require('razorpay');

const instance = new Razorpay({
  key_id: 'rzp_test_e0p4ROsVzyQ7xL',
  key_secret: 'DwGCKSi05b7yDJc6VijYVM6Y',
});

module.exports = {
  instance,
};
