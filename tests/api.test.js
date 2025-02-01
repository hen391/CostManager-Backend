const request = require("supertest");
const User = require("../models/user"); //
const mongoose = require("mongoose");
const app = require("../app");

require("dotenv").config();
jest.setTimeout(30000); // Increase timeout to 30 seconds

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // ✅ Ensure test user exists before tests run
  await User.deleteMany({});
  await User.create({
    id: "123123",
    first_name: "moshe",
    last_name: "israeli",
    birthday: new Date("1990-01-01"),
    marital_status: "single",
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("API Tests - Cost Manager", () => {
  it("should add a new cost item", async () => {
    const response = await request(app).post("/api/add").send({
      userId: "123123",
      description: "Milk",
      sum: 10,
      category: "food",
    });
    console.log("Response:", response.body); // Debugging line
    expect(response.status).toBe(201);
  });

  it("should return error for invalid category", async () => {
    const response = await request(app).post("/api/add").send({
      userId: "123123",
      description: "Car",
      sum: 200,
      category: "transportation", // ❌ Invalid category
    });

    console.log("Response:", response.body); // Debugging line
    expect(response.status).toBe(400); // ✅ Now should pass
  });
});
