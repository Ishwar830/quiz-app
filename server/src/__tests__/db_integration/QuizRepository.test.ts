import { db } from "../../db/index.ts";
import { QuizRepository } from "../../services/db_queries/QuizRepository.ts";
import { user } from "../../db/schema/users.ts";
import {
  clearDb,
  getMockQuizPayloadData,
  insertMockQuizForUser,
} from "./db_test_utils.ts";

describe("Quiz Repository Integration Tests", () => {
  const testUserId = "test-123";

  beforeEach(async () => {
    await clearDb();

    await db.insert(user).values({
      id: testUserId,
      name: "test-user",
      email: "test@email.com",
    });
  });

  afterAll(async () => {
    await clearDb();
  });

  it("should create a quiz", async () => {
    const mockQuiz = getMockQuizPayloadData();

    await QuizRepository.createOrUpdateQuiz(testUserId, mockQuiz.id, mockQuiz);

    const result = await db.query.quiz.findFirst({
      where: (q, { eq }) => eq(q.id, mockQuiz.id),
    });

    expect(result).toBeDefined();
    expect(result?.title).toBe(mockQuiz.title);
  });

  it("should get quiz with questions", async () => {
    const mockQuiz = await insertMockQuizForUser(testUserId);

    const result = await QuizRepository.getUserQuizById(
      testUserId,
      mockQuiz.id,
    );

    expect(result).toBeDefined();
    expect(result?.title).toBe(mockQuiz.title);
    expect(result?.questions).toHaveLength(2);
    expect(result?.questions[0].text).toBe(mockQuiz.questions[0].text);
    expect(result?.questions[1].id).toBe(mockQuiz.questions[1].id);
  });

  it("should get quizzes for user", async () => {
    const mockQuiz = await insertMockQuizForUser(testUserId);

    const result = await QuizRepository.getUserQuizzes(testUserId);

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe(mockQuiz.title);
    expect(result[0].totalQuestions).toBe(mockQuiz.questions.length);
  });

  it("should update an existing quiz", async () => {
    const mockQuiz = await insertMockQuizForUser(testUserId);

    const updatePayload = {
      id: mockQuiz.id,
      title: "New Title",
      description: "Old Desc",
      topics: ["math"],
      questions: [],
    };

    await QuizRepository.createOrUpdateQuiz(
      testUserId,
      mockQuiz.id,
      updatePayload,
    );

    const updated = await db.query.quiz.findFirst({
      where: (q, { eq }) => eq(q.id, mockQuiz.id),
    });

    expect(updated?.title).toBe("New Title");
    expect(updated?.description).toBe("Old Desc");
  });

  it("should delete a quiz", async () => {
    const mockQuiz = await insertMockQuizForUser(testUserId);

    await QuizRepository.deleteQuiz(mockQuiz.id, testUserId);

    const result = await db.query.quiz.findFirst({
      where: (q, { eq }) => eq(q.id, mockQuiz.id),
    });
    expect(result).toBeUndefined();
  });
});
