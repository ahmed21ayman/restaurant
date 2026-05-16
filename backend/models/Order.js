const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String }
  }],
  totalAmount: { type: Number, required: true },
  deliveryAddress: {
    fullName: { type: String, required: true },
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    phone: { type: String, required: true }
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Preparing', 'On the way', 'Delivered', 'Cancelled'], 
    default: 'Pending' 
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
