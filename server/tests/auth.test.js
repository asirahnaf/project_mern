import request from "supertest";
import { app } from "../socket/socket.js";
import { createAndLogin } from "./helpers/createTestUser.js";

describe("Feature: Auth Management (ID: 10101010)", () => {
  // PRE-CONDITION: Dynamic Auth
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
    const { agent } = await createAndLogin();
    const res = await agent.get("/api/cart/all");
    expect([200, 404]).toContain(res.statusCode); // 200 if carts exist, 404 or 200 depending on implementation
  });
});
