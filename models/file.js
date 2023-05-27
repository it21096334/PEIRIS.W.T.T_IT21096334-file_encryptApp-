const mongoose = require('mongoose');


const fileSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  data: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  fileId: {
    type: String,
    unique: true,
    default: Math.random().toFixed(10) + Math.random().toFixed(10)
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
