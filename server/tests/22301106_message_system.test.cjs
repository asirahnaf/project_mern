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

describe("Feature: Messaging (ID: 22301106)", () => {
  it("should send a message between users (201)", async () => {
    const sender = await createAndLogin({ role: 'buyer' });
    const receiver = await createAndLogin({ role: 'farmer' });

    const res = await sender.agent.post(`/api/messages/send/${receiver.username}`).send({ message: 'Hello' });

    // The endpoint expects a userId in params; our helper returns username, but route expects id. Use receiver.agent to fetch list of users via conversation endpoint maybe; instead, get receiver id from /api/user/all endpoint
    const usersList = await sender.agent.get('/api/user/all');
    const user = usersList.body.find(u => u.username === receiver.username);
    const receiverId = user ? user._id : null;

    // Re-send with correct receiver id
    const res2 = await sender.agent.post(`/api/messages/send/${receiverId}`).send({ message: 'Hello again' });
    expect(res2.statusCode).toEqual(201);
    expect(res2.body.data).toHaveProperty('_id');
  });

  it('should return 400 when message body missing', async () => {
    const sender = await createAndLogin({ role: 'buyer' });
    const receiver = await createAndLogin({ role: 'buyer' });
    const usersList = await sender.agent.get('/api/user/all');
    const user = usersList.body.find(u => u.username === receiver.username);
    const receiverId = user ? user._id : null;

    const res = await sender.agent.post(`/api/messages/send/${receiverId}`).send({});
    expect(res.statusCode).toEqual(400);
  });

  it('should get conversation messages (200)', async () => {
    const a = await createAndLogin({ role: 'buyer' });
    const b = await createAndLogin({ role: 'farmer' });
    const usersList = await a.agent.get('/api/user/all');
    const user = usersList.body.find(u => u.username === b.username);
    const receiverId = user ? user._id : null;

    await a.agent.post(`/api/messages/send/${receiverId}`).send({ message: 'Hi there' });
    const res = await a.agent.get(`/api/messages/${receiverId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toBeDefined();
  });
});