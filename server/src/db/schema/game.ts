import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  index,
  jsonb,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const games = pgTable(
  "games",
  {
    id: text().notNull().primaryKey(),
    hostId: text("host_id").notNull(),
    quizTitle: text("quiz_title").notNull(),
    quizDescription: text("quiz_description"),
    quizTopics: text("quiz_topics")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    createdAt: timestamp("created_at").notNull(),
    startedAt: timestamp("started_at").notNull(),
    endedAt: timestamp("ended_at").notNull(),
  },
  (t) => [index("user_rooms_index").on(t.hostId)],
);

export const gameQuestions = pgTable(
  "game_questions",
  {
    id: text().primaryKey(),
    gameId: text("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    text: text().notNull(),
    choices: jsonb().$type<{ id: string; text: string }[]>().notNull(),
    order: integer().notNull(),
    correctChoiceId: text("correct_choice_id").notNull(),
    timeLimitSeconds: integer("time_limit_seconds").notNull(),
    startedAt: timestamp("started_at").notNull(),
    endedAt: timestamp("ended_at").notNull(),
  },
  (t) => [index("game_questions_index").on(t.gameId)],
);

export const gameSubmissions = pgTable(
  "game_submissions",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    gameId: text("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull(),
    questionId: text("question_id")
      .notNull()
      .references(() => gameQuestions.id, { onDelete: "cascade" }),
    choiceId: text("choice_id").notNull(),
    isCorrect: boolean("is_correct").notNull(),
    submittedAt: timestamp("submitted_at").notNull(),
  },
  (t) => [
    index("user_submissions_index").on(t.userId),
    index("game_submissions_index").on(t.gameId),
    index("question_index").on(t.questionId),
  ],
);

export const gameParticipants = pgTable(
  "game_participants",
  {
    id: text()
      .notNull()
      .primaryKey()
      .$defaultFn(() => nanoid()),
    gameId: text("game_id")
      .notNull()
      .references(() => games.id),
    userId: text("user_id").notNull(),
    score: integer().notNull(),
    rank: integer().notNull(),
  },
  (t) => [
    index("participants_user_index").on(t.userId),
    index("participants_game_index").on(t.gameId),
  ],
);

export const gameRelations = relations(games, ({ many }) => ({
  submissions: many(gameSubmissions),
  questions: many(gameQuestions),
  participants: many(gameParticipants),
}));

export const gameQuestionRelations = relations(
  gameQuestions,
  ({ one, many }) => ({
    game: one(games, {
      fields: [gameQuestions.gameId],
      references: [games.id],
    }),
    submissions: many(gameSubmissions),
  }),
);

export const gameSubmissionRelations = relations(
  gameSubmissions,
  ({ one }) => ({
    game: one(games, {
      fields: [gameSubmissions.gameId],
      references: [games.id],
    }),
    question: one(gameQuestions, {
      fields: [gameSubmissions.questionId],
      references: [gameQuestions.id],
    }),
  }),
);

export const gameParticipantRelations = relations(
  gameParticipants,
  ({ one }) => ({
    game: one(games, {
      fields: [gameParticipants.gameId],
      references: [games.id],
    }),
  }),
);
