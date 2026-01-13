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

describe("Feature: Insurance Claims (ID: 22201249)", () => {
  it("should allow a farmer to create a claim (201)", async () => {
    const farmer = await createAndLogin({ role: "farmer" });
    const res = await farmer.agent.post('/api/insurance/claims').send({
      cropName: 'Maize',
      incidentDate: '2024-01-01',
      description: 'Flood damage',
      incidentImage: 'http://img',
      claimAmount: 1000
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
  });

  it("should return 400 when required fields are missing", async () => {
    const farmer = await createAndLogin({ role: "farmer" });
    const res = await farmer.agent.post('/api/insurance/claims').send({});
    expect(res.statusCode).toEqual(400);
  });

  it("should allow farmer to fetch their claims (200)", async () => {
    const farmer = await createAndLogin({ role: "farmer" });
    await farmer.agent.post('/api/insurance/claims').send({
      cropName: 'Beans',
      incidentDate: '2024-01-02',
      description: 'Hail',
      claimAmount: 500
    });
    const res = await farmer.agent.get('/api/insurance/my-claims');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should restrict admin endpoints to admins only", async () => {
    const farmer = await createAndLogin({ role: "farmer" });
    const res = await farmer.agent.get('/api/insurance/all-claims');
    expect(res.statusCode).toEqual(403);

    const admin = await createAndLogin({ role: 'admin' });
    const res2 = await admin.agent.get('/api/insurance/all-claims');
    expect([200, 204, 404]).toContain(res2.statusCode);
  });

  it("should allow admin to update claim status (200) and reject invalid status (400)", async () => {
    const farmer = await createAndLogin({ role: 'farmer' });
    const claimRes = await farmer.agent.post('/api/insurance/claims').send({
      cropName: 'Rice', incidentDate: '2024-01-03', description: 'Storm', claimAmount: 300
    });

    const claimId = claimRes.body._id;
    const admin = await createAndLogin({ role: 'admin' });
    const bad = await admin.agent.put(`/api/insurance/claims/${claimId}`).send({ status: 'INVALID' });
    expect(bad.statusCode).toEqual(400);

    const ok = await admin.agent.put(`/api/insurance/claims/${claimId}`).send({ status: 'Approved' });
    expect(ok.statusCode).toEqual(200);
  });
});
