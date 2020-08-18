const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  mobile_number: { type: Number, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  imagePath: { type: String, default: '/images/chef3.jpg' },
  date: { type: Date, default: Date.now },
  favorite_list: { type: Array },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  isAdmin: { type: Boolean, default: false }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
