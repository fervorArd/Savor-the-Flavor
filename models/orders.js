const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  cart: {type: Object, required:  true},
  address: {type: String, required: true},
  name: {type: String, required: true},
  date: {type: Date, default: Date.now},
  status: {type: String, default: 'order_placed'},
  paymentId: {type: String, required: true}
});

const Order = mongoose.model('Order', ProductSchema);

module.exports = Order;
