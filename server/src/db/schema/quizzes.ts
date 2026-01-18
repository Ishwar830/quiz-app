import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  index,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";
import { user } from "./users.ts";

export const quiz = pgTable(
  "quiz",
  {
    id: text().primaryKey(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    title: text().notNull(),
    description: text(),
    topics: text()
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("user_quiz_index").on(table.userId)],
);

export const questions = pgTable(
  "question",
  {
    id: text().primaryKey(),
    quizId: text("quiz_id")
      .references(() => quiz.id, { onDelete: "cascade" })
      .notNull(),
    text: text().notNull(),
    choices: jsonb().$type<{ id: string; text: string }[]>().notNull(),
    order: integer().notNull(),
    correctChoiceId: text("correct_choice_id").notNull(),
    timeLimitSeconds: integer("time_limit_seconds").notNull(),
  },
  (table) => [index("quiz_question_index").on(table.quizId)],
);

export const quizRelations = relations(quiz, ({ many, one }) => ({
  questions: many(questions),
  user: one(user, {
    fields: [quiz.userId],
    references: [user.id],
  }),
}));

export const questionRelations = relations(questions, ({ one }) => ({
  quiz: one(quiz, {
    fields: [questions.quizId],
    references: [quiz.id],
  }),
}));
