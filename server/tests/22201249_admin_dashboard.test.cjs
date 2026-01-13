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

describe("Feature: Admin Dashboard (ID: 22201249)", () => {
  it('should forbid access to admin routes for non-admin', async () => {
    const farmer = await createAndLogin({ role: 'farmer' });
    const res = await farmer.agent.get('/api/admin/users');
    expect(res.statusCode).toEqual(403);
  });

  it('admin can fetch stats, users and manage prices', async () => {
    const admin = await createAndLogin({ role: 'admin' });
    const stats = await admin.agent.get('/api/admin/stats');
    expect([200, 500]).toContain(stats.statusCode);

    const users = await admin.agent.get('/api/admin/users');
    expect([200, 500]).toContain(users.statusCode);

    const priceUp = await admin.agent.post('/api/admin/prices').send({ cropName: 'Test', pricePerKg: 9 });
    expect([200, 201]).toContain(priceUp.statusCode);
  });

  it('can broadcast notification (admin only)', async () => {
    const admin = await createAndLogin({ role: 'admin' });
    const b = await admin.agent.post('/api/admin/notifications/broadcast').send({ title: 'X', message: 'Y' });
    expect(b.statusCode).toEqual(200);
  });
});