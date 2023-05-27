
const mongoose = require('mongoose');

const authenticationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  loggedInAt: {
    type: Date,
    default: Date.now
  }
});

const Authentication = mongoose.model('Authentication', authenticationSchema);

module.exports = Authentication;
