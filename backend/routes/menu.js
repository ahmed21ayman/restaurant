const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// @route   GET api/menu
// @desc    Get all menu items
router.get('/', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: err.message });
  }
});

// @route   POST api/menu/seed
// @desc    Seed menu items
router.post('/seed', async (req, res) => {
  try {
    await MenuItem.deleteMany({});
    const items = [
      {
        title: "Classic Margherita Pizza",
        description: "Fresh mozzarella, tomato sauce, and basil leaves on a thin crust.",
        price: 14.99,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
        category: "Pizza"
      },
      {
        title: "Double Cheese Burger",
        description: "Two smashed beef patties, cheddar cheese, pickles, and house sauce.",
        price: 12.50,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
        category: "Burgers"
      },
      {
        title: "Mediterranean Salad",
        description: "Crisp greens, feta cheese, kalamata olives, cucumbers, and vinaigrette.",
        price: 10.99,
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
        category: "Healthy"
      },
      {
        title: "Spicy Tuna Roll",
        description: "Fresh tuna, spicy mayo, and cucumber rolled in premium sushi rice.",
        price: 16.00,
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
        category: "Sushi"
      }
    ];
    await MenuItem.insertMany(items);
    res.json({ msg: "Database seeded successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: err.message });
  }
});

const auth = require('../middleware/auth');

// @route   POST api/menu
// @desc    Add a new menu item
// @access  Private Admin
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  
  const { title, description, price, image, category } = req.body;

  try {
    const newItem = new MenuItem({ title, description, price, image, category });
    const savedItem = await newItem.save();
    res.json(savedItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: err.message });
  }
});

// @route   DELETE api/menu/:id
// @desc    Delete a menu item
// @access  Private Admin
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: 'Menu item not found' });

    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Menu item removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Menu item not found' });
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
});

module.exports = router;
