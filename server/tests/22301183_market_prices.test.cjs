const request = require("supertest");
const { createAndLogin } = require("./helpers/createTestUser.cjs");
let app;

beforeAll(async () => {
  process.env.NODE_ENV = "development";
  process.env.SKIP_SERVER = "true";
  await import("../server.js");
  const mod = await import("../socket/socket.js");
  app = mod.app;
});

describe("Feature: Market Prices (ID: 22301183)", () => {
  it("should fetch market prices publicly (200)", async () => {
    const res = await request(app).get('/api/market/prices');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should allow admin to upsert market price (200) and non-admin is forbidden (403)", async () => {
    const admin = await createAndLogin({ role: 'admin' });
    const up = await admin.agent.post('/api/admin/prices').send({ cropName: 'Maize', pricePerKg: 15, category: 'cereal' });
    expect([200, 201]).toContain(up.statusCode);

    const farmer = await createAndLogin({ role: 'farmer' });
    const res = await farmer.agent.post('/api/admin/prices').send({ cropName: 'Maize', pricePerKg: 20 });
    expect(res.statusCode).toEqual(403);
  });
});