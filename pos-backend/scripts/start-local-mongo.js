const { MongoMemoryServer } = require("mongodb-memory-server");
const path = require("path");
const fs = require("fs");

async function startLocalMongo() {
  const dbPath = path.join(__dirname, "..", ".mongo-data");
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
  }

  console.log("🚀 Starting local standalone MongoDB instance...");
  const mongod = await MongoMemoryServer.create({
    binary: {
      version: "7.0.14",
    },
    instance: {
      port: 27017,
      dbName: "pos-db",
      storageEngine: "wiredTiger",
      dbPath: dbPath,
    },
  });

  const uri = mongod.getUri();
  console.log(`✅ Standalone MongoDB is RUNNING on: ${uri}`);
  console.log(`📁 Persistent data stored at: ${dbPath}`);
  console.log("ℹ️  Press Ctrl+C to stop the database.");

  const shutdown = async () => {
    console.log("\n🛑 Stopping MongoDB instance...");
    await mongod.stop();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

startLocalMongo().catch((err) => {
  console.error("❌ Failed to start local MongoDB:", err.message);
  process.exit(1);
});
