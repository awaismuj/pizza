const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const net = require("net");

function isPortOpen(port, host = "127.0.0.1") {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1500);
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.once("error", () => {
      resolve(false);
    });
    socket.connect(port, host);
  });
}

async function startLocalMongo() {
  const dbPath = path.join(__dirname, "..", ".mongo-data");
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
  }

  // Check if an existing MongoDB instance is already running on port 27017
  const portAlreadyActive = await isPortOpen(27017);
  if (portAlreadyActive) {
    console.log("✅ Standalone MongoDB is RUNNING on: mongodb://127.0.0.1:27017/");
    console.log(`📁 Persistent data stored at: ${dbPath}`);
    console.log("ℹ️  Connected to running instance.");
    setInterval(() => {}, 3600000);
    return;
  }

  const binaryPath = path.join(
    process.env.HOME || "/home/shahzaib",
    ".cache/mongodb-binaries/mongod-x64-ubuntu-7.0.14"
  );

  console.log("🚀 Starting local standalone MongoDB instance...");

  const args = [
    "--dbpath", dbPath,
    "--port", "27017",
    "--bind_ip", "127.0.0.1",
  ];

  const mongodProc = spawn(binaryPath, args, {
    stdio: ["ignore", "pipe", "pipe"],
  });

  mongodProc.stdout.on("data", (data) => {
    const str = data.toString();
    if (str.includes('"msg":"Waiting for connections"') || str.includes("Waiting for connections")) {
      console.log("✅ Standalone MongoDB is RUNNING on: mongodb://127.0.0.1:27017/");
      console.log(`📁 Persistent data stored at: ${dbPath}`);
      console.log("ℹ️  Press Ctrl+C to stop the database.");
    }
  });

  mongodProc.stderr.on("data", (data) => {
    console.error(data.toString());
  });

  mongodProc.on("close", (code) => {
    console.log(`MongoDB exited with code ${code}`);
    process.exit(code || 0);
  });

  const shutdown = () => {
    console.log("\n🛑 Stopping MongoDB instance...");
    mongodProc.kill("SIGINT");
    setTimeout(() => mongodProc.kill("SIGKILL"), 3000);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

startLocalMongo().catch((err) => {
  console.error("❌ Failed to start local MongoDB:", err.message);
  process.exit(1);
});
