import { db } from "../../db/index.ts";
import { questions, quiz } from "../../db/schema/quizzes.ts";
import { QuizRepository } from "../../services/db_queries/QuizRepository.ts";
import { user } from "../../db/schema/users.ts";
import type { QuizPayload } from "../../lib/zod_schemas.ts";
import { clearDb } from "./test_utils.ts";

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

  it("should create a quiz", async () => {
    const payload: QuizPayload = {
      id: "quiz_new",
      title: "New Quiz",
      description: "Desc",
      topics: ["math"],
      questions: [],
    };

    await QuizRepository.createOrUpdateQuiz(testUserId, payload.id, payload);

    const result = await db.query.quiz.findFirst({
      where: (q, { eq }) => eq(q.id, payload.id),
    });

    expect(result).toBeDefined();
    expect(result?.title).toBe("New Quiz");
  });

  it("should get quiz with questions", async () => {
    await db.insert(quiz).values({
      id: "quiz_test",
      userId: testUserId,
      title: "Existing Quiz",
      description: "Existing Desc",
      topics: [],
    });

    await db.insert(questions).values([
      {
        id: "question_1_test",
        text: "question_text",
        choices: [],
        quizId: "quiz_test",
        order: 1,
        timeLimitSeconds: 10,
        correctChoiceId: "1",
      },
      {
        id: "question_2_test",
        text: "question_text",
        choices: [],
        quizId: "quiz_test",
        order: 1,
        timeLimitSeconds: 10,
        correctChoiceId: "1",
      },
    ]);

    const result = await QuizRepository.getUserQuizById(testUserId, "quiz_test")

    expect(result).toBeDefined();
    expect(result?.title).toBe("Existing Quiz");
    expect(result?.questions).toHaveLength(2);
    expect(result?.questions[0].text).toBe("question_text");
    expect(result?.questions[1].id).toBe("question_2_test");
  });

  it("should get quizzes for user", async () => {
    await db.insert(quiz).values({
      id: "quiz_existing",
      userId: testUserId,
      title: "Existing Quiz",
      description: "Existing Desc",
      topics: [],
    });

    await db.insert(questions).values([
      {
        id: "question_1",
        text: "question_text",
        choices: [],
        quizId: "quiz_existing",
        order: 1,
        timeLimitSeconds: 10,
        correctChoiceId: "1",
      },
      {
        id: "question_2",
        text: "question_text",
        choices: [],
        quizId: "quiz_existing",
        order: 1,
        timeLimitSeconds: 10,
        correctChoiceId: "1",
      },
    ]);

    const result = await QuizRepository.getUserQuizzes(testUserId);

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Existing Quiz");
    expect(result[0].totalQuestions).toBe(2);
  });

  it("should update an existing quiz", async () => {
    await db.insert(quiz).values({
      id: "quiz_to_update",
      userId: testUserId,
      title: "Old Title",
      description: "Old Desc",
      topics: [],
    });

    const updatePayload = {
      id: "quiz_to_update",
      title: "New Title",
      description: "Old Desc",
      topics: ["math"],
      questions: [],
    };

    await QuizRepository.createOrUpdateQuiz(
      testUserId,
      updatePayload.id,
      updatePayload,
    );

    const updated = await db.query.quiz.findFirst({
      where: (q, { eq }) => eq(q.id, "quiz_to_update"),
    });

    expect(updated?.title).toBe("New Title");
    expect(updated?.description).toBe("Old Desc");
  });

  it("should delete a quiz", async () => {
    await db.insert(quiz).values({
      id: "quiz_to_delete",
      userId: testUserId,
      title: "Delete Me",
      description: "Desc",
      topics: [],
    });

    await QuizRepository.deleteQuiz("quiz_to_delete", testUserId);

    const result = await db.query.quiz.findFirst({
      where: (q, { eq }) => eq(q.id, "quiz_to_delete"),
    });
    expect(result).toBeUndefined();
  });
});
