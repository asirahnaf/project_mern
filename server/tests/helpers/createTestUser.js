const request = require("supertest");

module.exports.createAndLogin = async ({ role = "buyer", overrides = {} } = {}) => {
  // import app dynamically since socket exports an ESM module
  const mod = await import("../../socket/socket.js");
  const app = mod.app;
  const agent = request.agent(app);
  const username = `testuser_${role}_${Date.now()}`;
  const password = "Password123!";

  const payload = {
    firstname: overrides.firstname || "Test",
    lastname: overrides.lastname || "User",
    username,
    password,
    confirmPassword: password,
    email: overrides.email || `${username}@example.com`,
    role,
    gender: overrides.gender || "male",
    phone: overrides.phone || "1234567890",
    dob: overrides.dob || "1990-01-01",
  };

  // Sign up
  await agent.post("/api/auth/signup").send(payload);

  // Sign in to ensure cookie set
  await agent.post("/api/auth/signin").send({ username, password });

  return { agent, username, password };
};
