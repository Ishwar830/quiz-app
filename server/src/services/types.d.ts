export interface Room {
  id: string;
  host: {
    id: string;
    name: string;
  };
  quizMeta: QuizMeta;
}

export interface RoomMember {
  id: string;
  name: string;
  role: "PLAYER" | "SPECTATOR";
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  order: number;
  timeLimitSeconds: number;
  choices: Array<{ id: string; text: string }>;
  correctChoiceId: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  topics: Array<string>;
  questions: Array<Question>;
}

export type QuizMeta = Omit<Quiz, "questions"> & { totalQuestions: number };

export type QuestionInfo = Omit<Question, "correctChoiceId"> & {
  submissionStartTime: number;
  submissionEndTime: number;
};

export interface CountdownInfo {
  endsAt: number;
  duration: number;
}

export interface RankInfo {
  userId: string;
  rank: number;
  name: string;
  score: number;
}

export interface GameState {
  room: Room;
  status: "WAITING" | "COUNTDOWN" | "QUESTION_ACTIVE" | "FINISHED";
  quizStartedAt: number | null;
  quizEndedAt: number | null;
  currentQuestionInfo: QuestionInfo | null;
  countdownInfo: CountdownInfo | null;
  topRankings: Array<RankInfo> | null;
}

export interface Submission {
  roomId: string;
  userId: string;
  questionId: string;
  choiceId: string;
  submittedAt: Date;
  isCorrect: boolean;
}

interface GameQuestion extends Question {
  startedAt: Date;
  endedAt: Date;
}

interface GameDataPayload {
  hostId: string;
  quizTitle: string;
  quizDescription: string | null;
  quizTopics: Array<string>;
  createdAt: Date;
  startedAt: Date;
  endedAt: Date;
  questions: Array<GameQuestion>;
  submissions: Array<Submission>;
  rankings: Array<RankInfo>;
}

export type SubmissionPayload = Omit<Submission, "isCorrect">;
