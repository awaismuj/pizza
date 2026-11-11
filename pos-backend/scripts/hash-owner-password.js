const bcrypt = require("bcrypt");
const readline = require("readline");

if (!process.stdin.isTTY) {
  console.error("Run this command in a terminal to enter the owner password securely.");
  process.exitCode = 1;
} else {
  const terminal = readline.createInterface({ input: process.stdin, output: process.stdout });
  const stdin = process.stdin;
  const stdout = process.stdout;
  stdout.write("Owner password (input hidden): ");
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding("utf8");

  let password = "";
  const cleanup = () => {
    stdin.setRawMode(false);
    stdin.pause();
    stdin.removeListener("data", onData);
    terminal.close();
  };
  const onData = async (chunk) => {
    if (chunk === "\u0003") {
      cleanup();
      stdout.write("\nCancelled.\n");
      process.exitCode = 1;
      return;
    }
    if (chunk === "\r" || chunk === "\n") {
      cleanup();
      stdout.write("\n");
      const passwordBytes = Buffer.byteLength(password, "utf8");
      if (password.length < 12 || passwordBytes > 72) {
        console.error("Use an owner password with at least 12 characters and no more than 72 UTF-8 bytes.");
        process.exitCode = 1;
        return;
      }
      try {
        console.log(await bcrypt.hash(password, 12));
      } catch (error) {
        console.error("Could not hash the password:", error.message);
        process.exitCode = 1;
      }
      password = "";
      return;
    }
    if (chunk === "\u007f" || chunk === "\b") {
      password = password.slice(0, -1);
      return;
    }
    if (!/[\u0000-\u001f\u007f]/.test(chunk)) password += chunk;
  };
  stdin.on("data", onData);
}
