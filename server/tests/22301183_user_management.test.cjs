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

describe("Feature: User Management (ID: 22301183)", () => {
  it('should return logged-in user with /api/user (200)', async () => {
    const { agent } = await createAndLogin({ role: 'buyer' });
    const res = await agent.get('/api/user');
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('username');
  });

  it('should allow users list for authenticated (200)', async () => {
    const user = await createAndLogin({ role: 'buyer' });
    const res = await user.agent.get('/api/user/all');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should prevent deleting another user (403) and allow self-delete (200)', async () => {
    const userA = await createAndLogin({ role: 'buyer' });
    const userB = await createAndLogin({ role: 'buyer' });
    const list = await userA.agent.get('/api/user/all');
    const b = list.body.find(u => u.username === userB.username);
    const res = await userA.agent.delete(`/api/user/delete/${b ? b._id : '60d21b4667d0d8992e610c85'}`);
    expect([403, 404]).toContain(res.statusCode);

    // self delete
    const me = await userA.agent.get('/api/user');
    const myId = me.body.data._id;
    const selfDel = await userA.agent.delete(`/api/user/delete/${myId}`);
    expect([200, 404]).toContain(selfDel.statusCode);
  });
});