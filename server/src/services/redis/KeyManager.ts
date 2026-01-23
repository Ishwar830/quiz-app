export const KeyManager = {
  room: (roomId: string) => `room:${roomId}`,
  quiz: (quizId: string) => `quiz:${quizId}`,
  member: (roomId: string, userId: string) => `room:${roomId}:member:${userId}`,
};
