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

describe("Feature: Notifications (ID: 22301183)", () => {
  it("admin can broadcast a notification and user can fetch it", async () => {
    const admin = await createAndLogin({ role: 'admin' });

    const broadcastRes = await admin.agent.post('/api/admin/notifications/broadcast').send({ title: 'Hi', message: 'Test', type: 'admin_update' });
    expect(broadcastRes.statusCode).toEqual(200);

    const user = await createAndLogin({ role: 'buyer' });
    const list = await user.agent.get('/api/notifications');
    expect(list.statusCode).toEqual(200);
    expect(list.body).toHaveProperty('notifications');

    const unread = await user.agent.get('/api/notifications/unread-count');
    expect(unread.statusCode).toEqual(200);
    expect(unread.body).toHaveProperty('count');

    // Mark first notification as read if exists
    const first = list.body.notifications && list.body.notifications[0];
    if (first) {
      const mark = await user.agent.patch(`/api/notifications/${first._id}/read`);
      expect(mark.statusCode).toEqual(200);

      const markAll = await user.agent.patch('/api/notifications/read-all');
      expect(markAll.statusCode).toEqual(200);

      const del = await user.agent.delete(`/api/notifications/${first._id}`);
      expect(del.statusCode).toEqual(200);
    }
  });
});