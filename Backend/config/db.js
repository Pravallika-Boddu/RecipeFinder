const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const connectDB = async () => {
    try {
        // Check if MONGODB_URI is set
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not set in .env file");
        }

        // MongoDB connection options
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        };

        // Connect to MongoDB
        const conn = await mongoose.connect(process.env.MONGODB_URI, options);
        mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Failed:`, error.message);

        // Retry connection after 5 seconds
        console.log("Retrying connection in 5 seconds...");
        setTimeout(connectDB, 5000);
    }
};

module.exports = connectDB;