const request = require("supertest");

let app;

beforeAll(async () => {
  // ensure server routes are mounted but do not listen on a port in test env
  // Run in dev mode so cookies are set without 'secure' flag, and skip server listen
  process.env.NODE_ENV = "development";
  process.env.SKIP_SERVER = "true";
  const path = require("path");
  await import(path.resolve(__dirname, "../server.js"));
  const mod = await import(path.resolve(__dirname, "../socket/socket.js"));
  app = mod.app;
});

describe("Feature: Auth Management (ID: 10101010)", () => {
  it("should signup a new user and return 201", async () => {
    const username = `user_${Date.now()}`;
    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        firstname: "Test",
        lastname: "User",
        username,
        password: "Password123!",
        confirmPassword: "Password123!",
        email: `${username}@example.com`,
        role: "buyer",
        gender: "male",
        phone: "1234567890",
        dob: "1990-01-01",
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("id");
  });

  it("should login an existing user and set auth cookie", async () => {
    const username = `user_${Date.now()}`;
    const password = "Password123!";

    await request(app).post("/api/auth/signup").send({
      firstname: "Test",
      lastname: "User",
      username,
      password,
      confirmPassword: password,
      email: `${username}@example.com`,
      role: "buyer",
      gender: "male",
      phone: "1234567890",
      dob: "1990-01-01",
    });

    const res = await request(app).post("/api/auth/signin").send({
      username,
      password,
    });

    expect(res.statusCode).toEqual(200);
    expect(res.headers["set-cookie"]).toBeDefined();
    expect(res.body).toHaveProperty("data");
  });

  it("should return 400 for invalid credentials", async () => {
    const res = await request(app).post("/api/auth/signin").send({
      username: "nonexistent",
      password: "wrongpassword",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should forbid access to protected route without auth cookie", async () => {
    const res = await request(app).get("/api/cart/all");
    expect([401, 500]).toContain(res.statusCode);
  });

  it("should allow access to protected route when authenticated", async () => {
    const agent = request.agent(app);

    const username = `login_${Date.now()}`;
    const password = "Password123!";

    await agent.post("/api/auth/signup").send({
      firstname: "A",
      lastname: "B",
      username,
      password,
      confirmPassword: password,
      email: `${username}@example.com`,
      role: "buyer",
      gender: "male",
      phone: "1234567890",
      dob: "1990-01-01",
    });

    await agent.post("/api/auth/signin").send({ username, password });

    const res = await agent.get("/api/cart/all");
    expect([200, 404]).toContain(res.statusCode);
  });
});
