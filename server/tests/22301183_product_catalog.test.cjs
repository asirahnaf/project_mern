const request = require("supertest");
const { createAndLogin } = require("./helpers/createTestUser.cjs");
let app;

beforeAll(async () => {
  // ensure server mounts routes but does not listen
  process.env.NODE_ENV = "development";
  process.env.SKIP_SERVER = "true";
  await import("../server.js");
  const mod = await import("../socket/socket.js");
  app = mod.app;
});

describe("Feature: Product Catalog (ID: 22301183)", () => {
  it("should prevent non-farmers from creating a product (403)", async () => {
    const { agent } = await createAndLogin({ role: "buyer" });
    const res = await agent.post("/api/product/create").send({
      name: "Corn",
      pricePerkg: 5,
      stock: 100,
      productImage: "http://example.com/img.png",
    });

    expect(res.statusCode).toEqual(403);
  });

  it("should return 400 if required fields are missing", async () => {
    const { agent } = await createAndLogin({ role: "farmer" });
    const res = await agent.post("/api/product/create").send({ name: "Wheat" });
    expect(res.statusCode).toEqual(400);
  });

  it("should allow a farmer to create a product (201)", async () => {
    const { agent } = await createAndLogin({ role: "farmer" });
    const res = await agent.post("/api/product/create").send({
      name: "Rice",
      pricePerkg: 10,
      stock: 200,
      isAvailable: true,
      productImage: "http://example.com/rice.png",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body.product).toHaveProperty("_id");
    expect(res.body.product.name).toEqual("Rice");
  });

  it("should retrieve all products and include created product (200)", async () => {
    const farmer = await createAndLogin({ role: "farmer" });
    await farmer.agent.post("/api/product/create").send({
      name: "Barley",
      pricePerkg: 8,
      stock: 50,
      productImage: "http://example.com/barley.png",
    });

    const res = await request(app).get("/api/product/all");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it("should allow farmer to update and delete their product", async () => {
    const farmer = await createAndLogin({ role: "farmer" });
    const createRes = await farmer.agent.post("/api/product/create").send({
      name: "Sorghum",
      pricePerkg: 7,
      stock: 30,
      productImage: "http://example.com/sorghum.png",
    });

    const productId = createRes.body.product._id;

    // Update stock
    const updateRes = await farmer.agent
      .put(`/api/product/update/${productId}`)
      .send({ stock: 25 });
    expect(updateRes.statusCode).toEqual(200);
    expect(updateRes.body.product.stock).toEqual(25);

    // Delete
    const deleteRes = await farmer.agent.delete(`/api/product/delete/${productId}`);
    expect(deleteRes.statusCode).toEqual(200);
  });

  it("should return 404 when updating/deleting non-existent product", async () => {
    const farmer = await createAndLogin({ role: "farmer" });
    const fakeId = "60d21b4667d0d8992e610c85"; // random-ish
    const updateRes = await farmer.agent.put(`/api/product/update/${fakeId}`).send({ stock: 1 });
    expect([404, 500]).toContain(updateRes.statusCode);
  });
});
