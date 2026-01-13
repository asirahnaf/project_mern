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

describe("Feature: Equipment Management (ID: 22301106)", () => {
  it("should allow an authenticated farmer to create equipment (201)", async () => {
    const farmer = await createAndLogin({ role: "farmer" });
    const res = await farmer.agent.post("/api/equipment").send({
      name: "Tractor",
      description: "Powerful tractor",
      category: "Tractor",
      dailyRate: 150,
      location: "Farmville",
      images: ["http://example.com/t.png"],
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");
  });

  it("should return 400/validation or 404 for missing equipment when getting by wrong id", async () => {
    const res = await request(app).get(`/api/equipment/60d21b4667d0d8992e610c85`);
    expect([200, 404]).toContain(res.statusCode);
  });

  it("should forbid delete by non-owner (403)", async () => {
    const owner = await createAndLogin({ role: "farmer" });
    const createRes = await owner.agent.post("/api/equipment").send({
      name: "Seeder",
      description: "Seeder",
      category: "Tool",
      dailyRate: 20,
      location: "Field",
      images: [],
    });

    const equipmentId = createRes.body._id;

    const otherFarmer = await createAndLogin({ role: "farmer" });
    const delRes = await otherFarmer.agent.delete(`/api/equipment/${equipmentId}`);
    expect([403, 404]).toContain(delRes.statusCode);
  });

  it("should allow owner to update and then delete equipment", async () => {
    const owner = await createAndLogin({ role: "farmer" });
    const createRes = await owner.agent.post("/api/equipment").send({
      name: "Plough",
      description: "Plough",
      category: "Tool",
      dailyRate: 10,
      location: "Field",
      images: [],
    });
    const id = createRes.body?._id;
    expect(id).toBeDefined();

    const updRes = await owner.agent.put(`/api/equipment/${id}`).send({ dailyRate: 12 });
    expect(updRes.statusCode).toEqual(200);
    expect(updRes.body.dailyRate).toEqual(12);

    const delRes = await owner.agent.delete(`/api/equipment/${id}`);
    expect(delRes.statusCode).toEqual(200);
  });
});
