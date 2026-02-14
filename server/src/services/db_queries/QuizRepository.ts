import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { questions, quiz } from "../../db/schema/quizzes.ts";
import type { QuizPayload } from "../../lib/zod_schemas.ts";
import { user } from "../../db/schema/users.ts";

const getUserQuizzes = async (userId: string) => {
  const res = await db.query.quiz.findMany({
    where: eq(quiz.userId, userId),
    with: {
      questions: {
        columns: {
          id: true,
        },
      },
    },
  });

  const result = res.map((quiz) => ({
    ...quiz,
    totalQuestions: quiz.questions.length,
    questions: undefined,
  }));

  return result;
};

const getUserQuizById = async (userId: string, quizId: string) => {
  const result = await db.query.quiz.findFirst({
    where: and(eq(quiz.userId, userId), eq(quiz.id, quizId)),
    with: {
      questions: {
        orderBy: (questions, { asc }) => [asc(questions.order)],
      },
    },
  });

  return result;
};

const createOrUpdateQuiz = async (
  userId: string,
  quizId: string,
  data: QuizPayload,
) => {
  const quizWithId = await getUserQuizById(userId, quizId);

  if (quizWithId) {
    return await updateQuiz(quizId, userId, data);
  }

  return await createQuiz(userId, data);
};

const deleteQuiz = async (quizId: string, userId: string) => {
  await db
    .delete(quiz)
    .where(and(eq(quiz.id, quizId), eq(quiz.userId, userId)));

  return true;
};

const createQuiz = async (userId: string, data: QuizPayload) => {
  return await db.transaction(async (tx) => {
    await tx.insert(quiz).values({
      userId,
      id: data.id,
      title: data.title,
      description: data.description,
      topics: data.topics || [],
    });

    if (data.questions && data.questions.length > 0) {
      const questionsToInsert = data.questions.map((q) => ({
        ...q,
        quizId: data.id,
      }));

      await tx.insert(questions).values(questionsToInsert);
    }

    return data.id;
  });
};

const updateQuiz = async (
  quizId: string,
  userId: string,
  data: QuizPayload,
) => {
  return await db.transaction(async (tx) => {
    const [updatedQuiz] = await tx
      .update(quiz)
      .set({
        title: data.title,
        description: data.description,
        topics: data.topics || [],
      })
      .where(and(eq(quiz.id, quizId), eq(quiz.userId, userId)))
      .returning();

    if (!updatedQuiz) {
      throw new Error(
        "Quiz not found or you do not have permission to edit it.",
      );
    }

    const existingQuestions = await tx
      .select({ id: questions.id })
      .from(questions)
      .where(eq(questions.quizId, quizId));

    const existingIds = new Set(existingQuestions.map((q) => q.id));
    const incomingIds = new Set(data.questions.map((q) => q.id));

    const idsToDelete = [...existingIds].filter((id) => !incomingIds.has(id));

    if (idsToDelete.length > 0) {
      await tx.delete(questions).where(inArray(questions.id, idsToDelete));
    }

    for (const q of data.questions) {
      await tx
        .insert(questions)
        .values({ ...q, quizId: updatedQuiz.id })
        .onConflictDoUpdate({
          target: questions.id,
          set: { ...q },
        });
    }

    return updatedQuiz.id;
  });
};

export const QuizRepository = {
  getUserQuizzes,
  getUserQuizById,
  deleteQuiz,
  createOrUpdateQuiz,
} as const;
