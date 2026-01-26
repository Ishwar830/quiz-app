export const KeyManager = {
  room: (roomId: string) => `room:${roomId}`,
  quiz: (quizId: string) => `quiz:${quizId}`,
  member: (roomId: string, userId: string) => `room:${roomId}:member:${userId}`,
  gameState: (roomId: string) => `state:${roomId}`,
  submission: (roomId: string, userId: string, questionId: string) =>
    `submission:${roomId}:${userId}:${questionId}`,
  submissionCount: (roomId: string, questionId: string) =>
    `submissionCount:${roomId}:${questionId}`,
  answer: (questionId: string) => `answer:${questionId}`,
  leaderboard: (roomId: string) => `leaderboard:${roomId}`
};
