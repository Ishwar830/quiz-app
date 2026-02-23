import request from "supertest";
import { app } from "../../app.ts";
import {
  clearDb,
  createMockGamePayload,
  createMockGameQuestion,
  createMockGameSubmission,
} from "../db_integration/db_test_utils.ts";
import { GameRepository } from "../../services/db_queries/GameRepository.ts";
import { GameDataPayload } from "../../services/types.js";

describe("Game API Endpoints", () => {
  const testUser = {
    name: "testUser",
    email: "testUser@mail.com",
    password: "testUser",
  };

  const agent = request.agent(app);
  let userId: string;

  beforeEach(async () => {
    await clearDb();

    const response = await agent.post("/api/auth/sign-up/email").send(testUser);
    expect(response.statusCode).toBe(200);
    userId = response.body.user.id;
  });

  afterAll(async () => {
    await clearDb();
  });

  const seedGame = async (overrides: Partial<GameDataPayload> = {}) => {
    const questionId = "q1";
    const payload = createMockGamePayload(userId, {
      questions: [createMockGameQuestion(questionId, 1)],
      submissions: [createMockGameSubmission(questionId, userId)],
      rankings: [{ userId, rank: 1, score: 100 }],
      ...overrides,
    });

    const gameId = await GameRepository.saveGame(payload);
    return gameId;
  };


  describe("GET /api/games", () => {
    it("should return an empty list when user has no games", async () => {
      const response = await agent.get("/api/games");

      expect(response.statusCode).toBe(200);
      expect(response.body.data).toEqual([]);
    });

    it("should return the user's games", async () => {
      await seedGame();

      const response = await agent.get("/api/games");

      expect(response.statusCode).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toHaveProperty("rank", 1);
      expect(response.body.data[0]).toHaveProperty("score", 100);
    });

    it("should return 401 for unauthenticated requests", async () => {
      const unauthenticatedAgent = request(app);
      const response = await unauthenticatedAgent.get("/api/games");

      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBeDefined();
    });
  });

  describe("GET /api/games/:gameId", () => {
    it("should return game details for a valid game", async () => {
      const gameId = await seedGame();

      const response = await agent.get(`/api/games/${gameId}`);

      expect(response.statusCode).toBe(200);

      const { data } = response.body;
      expect(data.id).toBe(gameId);
      expect(data.questions).toHaveLength(1);
      expect(data.submissions).toHaveLength(1);
      expect(data.userRankInfo).toBeDefined();
      expect(data.userRankInfo.rank).toBe(1);
      expect(data.userRankInfo.score).toBe(100);
    });

    it("should return null data for a non-existent game", async () => {
      const response = await agent.get("/api/games/non-existent-id");

      expect(response.statusCode).toBe(200);
      expect(response.body.data).toBeNull();
    });
  });

  
  describe("GET /api/games/:gameId/rankings", () => {
    it("should return paginated rankings for a game", async () => {
      const gameId = await seedGame();

      const response = await agent.get(`/api/games/${gameId}/rankings?page=1`);

      expect(response.statusCode).toBe(200);

      const { data } = response.body;
      expect(data.items).toHaveLength(1);
      expect(data.items[0]).toHaveProperty("rank", 1);
      expect(data.items[0]).toHaveProperty("score", 100);
      expect(data.items[0]).toHaveProperty("name", testUser.name);
      expect(data.totalCount).toBe(1);
      expect(data.totalPages).toBe(1);
    });

    it("should return empty items for an out-of-range page", async () => {
      const gameId = await seedGame();

      const response = await agent.get(`/api/games/${gameId}/rankings?page=99`);

      expect(response.statusCode).toBe(200);
      expect(response.body.data.items).toHaveLength(0);
      expect(response.body.data.totalCount).toBe(1);
    });

    it("should return 400 for an invalid page parameter", async () => {
      const gameId = await seedGame();

      const response = await agent.get(
        `/api/games/${gameId}/rankings?page=abc`,
      );

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe("VALIDATION ERROR");
    });

    it("should return 400 when page is less than 1", async () => {
      const gameId = await seedGame();

      const response = await agent.get(`/api/games/${gameId}/rankings?page=0`);

      expect(response.statusCode).toBe(400);
      expect(response.body.error.code).toBe("VALIDATION ERROR");
    });

    it("should return empty items for a non-existent game", async () => {
      const response = await agent.get(
        "/api/games/non-existent-id/rankings?page=1",
      );

      expect(response.statusCode).toBe(200);
      expect(response.body.data.items).toHaveLength(0);
      expect(response.body.data.totalCount).toBe(0);
    });
  });
});
