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
  choices: Array<{id: string, text: string}>;
  correctChoiceId: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  topics: Array<string>;
  questions: Array<Question>;
}

export type QuizMeta = Omit<Quiz, "questions">;