const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const File = require('../models/file');
const User = require("../models/user");

// Configure Multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });




router.post('/upload', upload.single('file'),
    async (req, res, next) => {

      try {
        const file = new File(req.body);
        file.fileId = new Date().getTime().toString() + (Math.random() * 100).toFixed(2).toString();
        await file.save();
        res.status(201).json({
          success: true
        });
      } catch (error) {
        res.status(201).json({
          success: false,
          error: error
        });
      }

});

// Route to get all uploaded files
router.get('/files', async (req, res, next) => {
  try {
    let data = req.query;
    console.log(data);
    const files = await File.find({
      user: data['uid']
    });
    res.json({
      success: true,
      data: files
    });
  } catch (error) {
    res.json({
      success: false,
      error: error
    });
  }
});

// Route to download and decrypt a file
router.get('/files/:id', async (req, res, next) => {
  try {
    const fileId = req.params.id;

    // Find the file in the database
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Decrypt the file data
    const decipher = crypto.createDecipher('aes-256-cbc', file.encryptionKey);
    const decryptedData = Buffer.concat([decipher.update(Buffer.from(file.encryptedData, 'base64')), decipher.final()]);

    // Set the appropriate headers for the file download
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${file.fileName}"`
    });

    // Send the decrypted file data as the response
    res.send(decryptedData);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
