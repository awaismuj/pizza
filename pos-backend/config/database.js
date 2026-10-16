const mongoose = require("mongoose");
const config = require("./config");

const connectDB = async () => {
    try {
        const uri = (config.databaseURI || "mongodb://127.0.0.1:27017/pos-db")
            .replace("mongodb://localhost:27017", "mongodb://127.0.0.1:27017");
        const conn = await mongoose.connect(uri);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`❌ Database connection failed: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;