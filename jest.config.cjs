module.exports = {
  testEnvironment: "node",
  testTimeout: 30000,
  setupFilesAfterEnv: ["<rootDir>/server/tests/setup.cjs"],
  testMatch: ["**/server/tests/**/*.test.cjs"],
};
