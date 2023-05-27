const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json({ limit: '200mb' }));

// Configure Multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Import routes
const userRoutes = require('./routes/userR');
const authenticationRoutes = require('./routes/authenticationR');
const fileRoutes = require('./routes/fileR');
const path = require("path");


//app midleware
app.use(bodyParser.json());
app.use(express.json());

// Mount routes
app.use(userRoutes);
app.use(authenticationRoutes);
app.use(fileRoutes);

app.use(express.static(path.join(__dirname, 'public')));



//const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://fileLock_admin:File753Lock0@filelock.y18qysi.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Successfully connected to the database");
  } catch (error) {
    console.log(error);
  }
};

connectDB();

// Start the server
const PORT = 8000;

app.listen(PORT, ()=>{
    console.log(`app is running on ${PORT}`);
});