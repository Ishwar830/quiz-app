import { db } from "../../db/index.ts";
import {
  gameParticipants,
  gameQuestions,
  games,
  gameSubmissions,
} from "../../db/schema/game.ts";
import { questions, quiz } from "../../db/schema/quizzes.ts";
import { user } from "../../db/schema/users.ts";

export const clearDb = async () => {
  await db.delete(gameParticipants);
  await db.delete(gameSubmissions);
  await db.delete(gameQuestions);
  await db.delete(games);
  await db.delete(questions);
  await db.delete(quiz);
  await db.delete(user);
};
