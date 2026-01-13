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

describe("Feature: Reviews (ID: 22301106)", () => {
  it('buyer can post a review for an order (201)', async () => {
    const farmer = await createAndLogin({ role: 'farmer' });
    const prodRes = await farmer.agent.post('/api/product/create').send({ name: 'R1', pricePerkg: 5, stock: 20, productImage: 'http://x' });
    const productId = prodRes.body.product._id;

    const buyer = await createAndLogin({ role: 'buyer' });
    await buyer.agent.post('/api/cart/add').send({ productId, quantityKg: 1 });
    const cartId = (await buyer.agent.get('/api/cart/all')).body.data._id;
    const orderRes = await buyer.agent.post('/api/order/create').send({ cartId, address: 'Addr' });
    const orderId = Array.isArray(orderRes.body.data) ? orderRes.body.data[0]._id : orderRes.body.data._id;

    const reviewRes = await buyer.agent.post('/api/review/add').send({ orderId, rating: 5, comment: 'Great' });
    expect(reviewRes.statusCode).toEqual(201);
  });

  it('should prevent duplicate reviews (400)', async () => {
    const farmer = await createAndLogin({ role: 'farmer' });
    const prodRes = await farmer.agent.post('/api/product/create').send({ name: 'R2', pricePerkg: 5, stock: 20, productImage: 'http://x' });
    const productId = prodRes.body.product._id;

    const buyer = await createAndLogin({ role: 'buyer' });
    await buyer.agent.post('/api/cart/add').send({ productId, quantityKg: 1 });
    const cartId = (await buyer.agent.get('/api/cart/all')).body.data._id;
    const orderRes = await buyer.agent.post('/api/order/create').send({ cartId, address: 'Addr' });
    const orderId = Array.isArray(orderRes.body.data) ? orderRes.body.data[0]._id : orderRes.body.data._id;

    await buyer.agent.post('/api/review/add').send({ orderId, rating: 5, comment: 'Great' });
    const dup = await buyer.agent.post('/api/review/add').send({ orderId, rating: 4, comment: 'Still good' });
    expect(dup.statusCode).toEqual(400);
  });

  it('should retrieve reviews for a product (200)', async () => {
    const farmer = await createAndLogin({ role: 'farmer' });
    const prodRes = await farmer.agent.post('/api/product/create').send({ name: 'R3', pricePerkg: 5, stock: 20, productImage: 'http://x' });
    const productId = prodRes.body.product._id;

    const buyer = await createAndLogin({ role: 'buyer' });
    await buyer.agent.post('/api/cart/add').send({ productId, quantityKg: 1 });
    const cartId = (await buyer.agent.get('/api/cart/all')).body.data._id;
    const orderRes = await buyer.agent.post('/api/order/create').send({ cartId, address: 'Addr' });
    const orderId = Array.isArray(orderRes.body.data) ? orderRes.body.data[0]._id : orderRes.body.data._id;
    await buyer.agent.post('/api/review/add').send({ orderId, rating: 5, comment: 'Nice' });

    const res = await request(app).get(`/api/review/all/${productId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('reviews');
  });
});