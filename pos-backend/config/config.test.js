const test = require("node:test");
const assert = require("node:assert/strict");

test("parses PORT as a numeric TCP port", () => {
  const previousPort = process.env.PORT;
  const configPath = require.resolve("./config");
  process.env.PORT = "3005";
  delete require.cache[configPath];

  try {
    const config = require("./config");
    assert.equal(config.port, 3005);
    assert.equal(typeof config.port, "number");
  } finally {
    delete require.cache[configPath];
    if (previousPort === undefined) {
      delete process.env.PORT;
    } else {
      process.env.PORT = previousPort;
    }
  }
});
