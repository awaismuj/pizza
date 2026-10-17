const mongoose = require("mongoose");
const config = require("./config");

const connectDB = async (retries = 5, delay = 2000) => {
    const uri = (config.databaseURI || "mongodb://127.0.0.1:27017/pos-db")
        .replace("mongodb://localhost:27017", "mongodb://127.0.0.1:27017");
    
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const conn = await mongoose.connect(uri);
            console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
            return conn;
        } catch (error) {
            console.log(`⚠️  MongoDB connection attempt ${attempt}/${retries} failed: ${error.message}`);
            if (attempt === retries) {
                console.log(`❌ Database connection failed permanently.`);
                process.exit(1);
            }
            await new Promise((res) => setTimeout(res, delay));
        }
    }
};

module.exports = connectDB;