const { spawn } = require("child_process");
const path = require("path");

const RESET = "\x1b[0m";

const services = [
  {
    name: "MONGO",
    cmd: "npm",
    args: ["run", "mongo"],
    cwd: path.join(__dirname, "pos-backend"),
    color: "\x1b[32m", // Green
    isDatabase: true,
  },
  {
    name: "BACKEND",
    cmd: "npm",
    args: ["run", "dev"],
    cwd: path.join(__dirname, "pos-backend"),
    color: "\x1b[34m", // Blue
  },
  {
    name: "POS-FRONTEND",
    cmd: "npm",
    args: ["run", "dev"],
    cwd: path.join(__dirname, "pos-frontend"),
    color: "\x1b[35m", // Magenta
  },
  {
    name: "STOREFRONT",
    cmd: "npm",
    args: ["run", "dev"],
    cwd: path.join(__dirname, "online-store"),
    color: "\x1b[36m", // Cyan
  },
];

console.log("\x1b[1m🚀 Starting GenZ Pizza Land Services...\x1b[0m\n");

const processes = [];

let isShuttingDown = false;

function startService(service) {
  const proc = spawn(service.cmd, service.args, {
    cwd: service.cwd,
    shell: true,
    env: { ...process.env, FORCE_COLOR: "1" },
  });

  const prefix = `${service.color}[${service.name}]${RESET} `;

  proc.stdout.on("data", (data) => {
    const lines = data.toString().trim().split("\n");
    lines.forEach((line) => {
      if (line) console.log(`${prefix}${line}`);
    });
  });

  proc.stderr.on("data", (data) => {
    const lines = data.toString().trim().split("\n");
    lines.forEach((line) => {
      if (line) console.error(`${prefix}${line}`);
    });
  });

  proc.on("close", (code) => {
    console.log(`${prefix}exited with code ${code}`);
    if (service.isDatabase && code !== 0 && !isShuttingDown) {
      console.log(`${prefix}Database exited with code ${code}. Reconnecting in 2s...`);
      setTimeout(() => startService(service), 2000);
    }
  });

  processes.push(proc);
  return proc;
}

// Start database first, then launch remaining services once ready or after a short delay
const dbService = services.find((s) => s.isDatabase);
const appServices = services.filter((s) => !s.isDatabase);

let appServicesStarted = false;
function startAppServices() {
  if (appServicesStarted) return;
  appServicesStarted = true;
  appServices.forEach(startService);
}

if (dbService) {
  const dbProc = startService(dbService);
  dbProc.stdout.on("data", (data) => {
    const str = data.toString();
    if (str.includes("RUNNING on:") || str.includes("already in use") || str.includes("failed to start")) {
      setTimeout(startAppServices, 500);
    }
  });
  // Fallback in case stdout doesn't match or external mongo is used
  setTimeout(startAppServices, 4000);
} else {
  startAppServices();
}

function shutdown() {
  isShuttingDown = true;
  console.log("\n\x1b[33m🛑 Stopping all services...\x1b[0m");
  processes.forEach((proc) => {
    try {
      if (process.platform === "win32") {
        require("child_process").execSync(`taskkill /pid ${proc.pid} /T /F 2>nul`);
      } else {
        proc.kill("SIGINT");
      }
    } catch (e) {}
  });
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
