const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// @route   POST api/orders
// @desc    Create a new order
// @access  Private
router.post('/', auth, async (req, res) => {
  const { items, totalAmount, deliveryAddress, paymentMethod, paymentDetails } = req.body;

  try {
    const newOrder = new Order({
      user: req.user.id,
      items,
      totalAmount,
      deliveryAddress,
      status: 'Pending'
    });

    const order = await newOrder.save();

    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user.id, {
      lastDeliveryAddress: deliveryAddress,
      lastPaymentMethod: paymentMethod,
      lastPaymentDetails: paymentDetails
    });

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/orders/history
// @desc    Get user's order history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/orders/admin
// @desc    Get all orders
// @access  Private (Admin only in reality, but keeping it simple for now)
router.get('/admin', auth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', ['name', 'email'])
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PATCH api/orders/:id/status
// @desc    Update order status
// @access  Private
router.patch('/:id/status', auth, async (req, res) => {
  const { status } = req.body;
  try {
    let order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: 'Order not found' });

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
