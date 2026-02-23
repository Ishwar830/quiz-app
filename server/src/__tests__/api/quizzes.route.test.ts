import request from "supertest";
import { app } from "../../app.ts";
import {
  clearDb,
  getMockQuizPayloadData,
} from "../db_integration/db_test_utils.ts";

describe("Quiz API Endpoints", () => {
  const testUser = {
    name: "testUser",
    email: "testUser@mail.com",
    password: "testUser",
  };

  const agent = request.agent(app);

  beforeEach(async () => {
    await clearDb();

    const response = await agent.post("/api/auth/sign-up/email").send(testUser);
    expect(response.statusCode).toBe(200);
  });

  afterAll(async () => {
    await clearDb();
  });

  describe("POST /api/quizzes", () => {
    it("should create new quiz for user and return 200 status", async () => {
      const quizPayload = getMockQuizPayloadData();

      const response = await agent.post("/api/quizzes").send(quizPayload);

      expect(response.statusCode).toBe(200);

      const { data } = response.body;

      expect(data).toBe(quizPayload.id);
    });

    it("should not create new quiz and return 400 status", async () => {
      const quizPayload = getMockQuizPayloadData();
      //remove questions
      quizPayload.questions = [];

      // minimum question count requirement is 5

      const response = await agent.post("/api/quizzes").send(quizPayload);

      expect(response.statusCode).toBe(400);
      const { data } = response.body;
      expect(data).toBe(null);
    });
  });

  describe("GET /api/quizzes", () => {
    it("should get user quizzes", async () => {
      const quizPayload = getMockQuizPayloadData();
      await agent.post("/api/quizzes").send(quizPayload);

      const response = await agent.get("/api/quizzes");
      expect(response.statusCode).toBe(200);

      const { data } = response.body;
      expect(data).toHaveLength(1);
      expect(data[0].id).toBe(quizPayload.id);
    });
  });

  describe("delete /api/quiz/:quizId", () => {
    it("should delete user quiz", async () => {
      const quizPayload = getMockQuizPayloadData();
      await agent.post("/api/quizzes").send(quizPayload);

      const delResponse = await agent.delete(`/api/quizzes/${quizPayload.id}`);
      expect(delResponse.statusCode).toBe(200);

      const getResponse = await agent.get("/api/quizzes");
      const { data } = getResponse.body;
      expect(data).toHaveLength(0);
    });
  });

  describe("GET /api/quiz/:quizId", () => {
    it("should get specific user quiz", async () => {
      const quizPayload = getMockQuizPayloadData();
      await agent.post("/api/quizzes").send(quizPayload);

      const response = await agent.get(`/api/quizzes/${quizPayload.id}`);
      expect(response.statusCode).toBe(200);

      const { data } = response.body;
      expect(data.id).toBe(quizPayload.id);
      expect(data.title).toBe(quizPayload.title);
    });

    it("should return 404 status for not found quizzes", async () => {
      const response = await agent.get("/api/quizzes/123");
      expect(response.statusCode).toBe(404);

      const { data } = response.body;
      expect(data).toBe(null);
    });
  });
});
