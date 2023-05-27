const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');



// Create a new user
router.post('/userR/new', async (req, res, next) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(201).json({
      success: false,
      error: error
    });

  }
});

// Get all users
router.get('/userR', async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Get a specific user by ID
router.get('/userR/:id', async (req, res, next) => {
  try {
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Update a user by ID
router.put('/userR/:id', async (req, res, next) => {
  try {
    const { password, ...otherFields } = req.body;

    // Check if the password field is present in the request body
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      otherFields.password = hashedPassword;
    }

    const user = await User.findByIdAndUpdate(req.params.id, otherFields, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});


// Delete a user by ID
router.delete('/userR/:id', async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
