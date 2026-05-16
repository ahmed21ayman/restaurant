const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  lastDeliveryAddress: { type: Object, default: null },
  lastPaymentMethod: { type: String, default: 'online' },
  lastPaymentDetails: { type: Object, default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
