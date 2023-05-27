


const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Authentication = require('../models/authentication');

// Route to validate login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Validate the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Create a new authentication entry
    const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1h' });
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // Token expires in 1 hour

    const authentication = new Authentication({
      user: user._id,
      token,
      expiresAt,
      loggedInAt: Date.now()
    });
    await authentication.save();

    res.status(200).json({
      success: true,
      data: user,
      message: 'Login successful'});
  } catch (error) {
    console.error(error);
    res.status(200).json({
      success: false,
      data: error,
      message: 'Login successful'});

  }
});


// Route to logout
router.post('/logout', async (req, res) => {
  try {
    const { token } = req.body;

    // Update the loggedInAt field to mark the logout time
    await Authentication.findOneAndUpdate({ token }, { $set: { loggedInAt: null } });

    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
