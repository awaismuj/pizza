const { spawn } = require("child_process");
const path = require("path");

const services = [
  {
    name: "MONGO",
    cmd: "npm",
    args: ["run", "mongo"],
    cwd: path.join(__dirname, "pos-backend"),
    color: "\x1b[32m", // Green
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

const RESET = "\x1b[0m";

console.log("\x1b[1m🚀 Starting GenZ Pizza Land Services...\x1b[0m\n");

const processes = [];

services.forEach((service) => {
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
  });

  processes.push(proc);
});

function shutdown() {
  console.log("\n\x1b[33m🛑 Stopping all services...\x1b[0m");
  processes.forEach((proc) => {
    try {
      proc.kill("SIGINT");
    } catch (e) {}
  });
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
