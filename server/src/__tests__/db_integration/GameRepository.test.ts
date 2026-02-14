import { db } from "../../db/index.ts";
import {
  games,
  gameParticipants,
  gameQuestions,
  gameSubmissions,
} from "../../db/schema/game.ts";
import { user } from "../../db/schema/users.ts";
import { GameRepository } from "../../services/db_queries/GameRepository.ts";
import { eq } from "drizzle-orm";
import { clearDb } from "./db_test_utils.ts";
import {
  createMockGamePayload,
  createMockGameQuestion,
  createMockGameSubmission,
} from "./db_test_utils.ts";

describe("Game Repository Integration Tests", () => {
  const hostUser = { id: "host-1", name: "Host User", email: "host@test.com" };
  const player1 = { id: "p1", name: "Player One", email: "p1@test.com" };
  const player2 = { id: "p2", name: "Player Two", email: "p2@test.com" };

  beforeEach(async () => {
    await clearDb();
    await db.insert(user).values([hostUser, player1, player2]);
  });

  afterAll(async () => {
    await clearDb();
  });

  it("should save a complete game with questions, participants, and submissions", async () => {
    const payload = createMockGamePayload(hostUser.id, {
      questions: [
        createMockGameQuestion("q1", 1),
        createMockGameQuestion("q2", 2),
      ],
      rankings: [
        { userId: player1.id, rank: 1, score: 100 },
        { userId: player2.id, rank: 2, score: 50 },
      ],
      submissions: [
        createMockGameSubmission("q1", player1.id),
        createMockGameSubmission("q1", player2.id),
      ],
    });

    const gameId = await GameRepository.saveGame(payload);

    const savedGame = await db.query.games.findFirst({
      where: eq(games.id, gameId),
      with: {
        questions: true,
        participants: true,
        submissions: true,
      },
    });

    expect(savedGame).toBeDefined();
    expect(savedGame?.quizTitle).toBe(payload.quizTitle);
    expect(savedGame?.questions).toHaveLength(payload.questions.length);
    expect(savedGame?.participants).toHaveLength(payload.rankings.length);
    expect(savedGame?.submissions).toHaveLength(payload.submissions.length);
  });

  it("should get games by host with correct counts", async () => {
    //Game 1: 2 participants 2 submissions
    const game1 = createMockGamePayload(hostUser.id, {
      hostId: hostUser.id,
      questions: [
        createMockGameQuestion("g1_q1", 1),
        createMockGameQuestion("g1_q2", 2),
      ],
      rankings: [
        { userId: player1.id, rank: 1, score: 100 },
        { userId: player2.id, rank: 2, score: 50 },
      ],
      submissions: [
        createMockGameSubmission("g1_q1", player1.id),
        createMockGameSubmission("g1_q1", player2.id),
      ],
    });

    await GameRepository.saveGame(game1);

    // Game 2: 2 participants, 1 submission
    const game2 = createMockGamePayload(hostUser.id, {
      hostId: hostUser.id,
      questions: [
        createMockGameQuestion("g2_q1", 1),
        createMockGameQuestion("g2_q2", 2),
      ],
      rankings: [
        { userId: player1.id, rank: 1, score: 100 },
        { userId: player2.id, rank: 2, score: 50 },
      ],
      submissions: [createMockGameSubmission("g2_q1", player1.id)],
    });

    await GameRepository.saveGame(game2);

    const result = await GameRepository.getGamesByHostId(hostUser.id);

    const [g2, g1] = result.sort(
      (a, b) => a.submissionCount - b.submissionCount,
    );

    expect(result).toHaveLength(2);

    expect(g1.submissionCount).toBe(game1.submissions.length);
    expect(g1.participantCount).toBe(game1.rankings.length);
    expect(g1.participants).toBeUndefined();

    expect(g2.submissionCount).toBe(game2.submissions.length);
  });

  it("should get games a user participated in", async () => {
    // Player 1 played this
    await GameRepository.saveGame(
      createMockGamePayload(hostUser.id, {
        hostId: hostUser.id,
        quizTitle: "P1 Game",
        rankings: [{ userId: player1.id, rank: 1, score: 100 }],
      }),
    );

    // Player 1 did NOT play this
    await GameRepository.saveGame(
      createMockGamePayload(hostUser.id, {
        hostId: hostUser.id,
        quizTitle: "P2 Game",
        rankings: [{ userId: player2.id, rank: 2, score: 50 }],
      }),
    );

    const result = await GameRepository.getGamesByUserId(player1.id);

    expect(result).toHaveLength(1);
    expect(result[0].quizTitle).toBe("P1 Game");
    expect(result[0].rank).toBe(1);
    expect(result[0].score).toBe(100);
  });

  it("should get paginated rankings", async () => {
    const gameId = await GameRepository.saveGame(
      createMockGamePayload(hostUser.id),
    );

    const dummyUsers = Array.from({ length: 15 }).map((_, i) => ({
      id: `u-${i}`,
      name: `User ${i}`,
      email: `u${i}@test.com`,
    }));
    await db.insert(user).values(dummyUsers);

    const participants = dummyUsers.map((u, index) => ({
      gameId,
      userId: u.id,
      rank: index + 1,
      score: 1000 - index,
    }));
    await db.insert(gameParticipants).values(participants);

    const page1 = await GameRepository.getGameRankings(gameId, 1);
    expect(page1.totalCount).toBe(15);
    expect(page1.items).toHaveLength(10);
    expect(page1.items[0].rank).toBe(1);

    const page2 = await GameRepository.getGameRankings(gameId, 2);
    expect(page2.items).toHaveLength(5);
    expect(page2.items[0].rank).toBe(11);
  });

  it("should return game details filtered for specific user", async () => {
    const gameId = await GameRepository.saveGame(
      createMockGamePayload(hostUser.id, {
        questions: [createMockGameQuestion("q1", 1)],
        rankings: [
          { userId: player1.id, rank: 1, score: 100 },
          { userId: player2.id, rank: 2, score: 50 }, // Other player
        ],
        submissions: [
          createMockGameSubmission("q1", player1.id),
          createMockGameSubmission("q1", player2.id) // Other player
        ],
      }),
    );

    const result = await GameRepository.getGameDetailsForUser(
      gameId,
      player1.id,
    );

    expect(result).not.toBeNull();
    expect(result?.submissions).toHaveLength(1);
    expect(result?.userRankInfo?.score).toBe(100);
  });
});
