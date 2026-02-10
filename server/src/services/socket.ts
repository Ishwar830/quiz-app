import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "node:http";
import { MemberManager } from "./room/MemberManager.ts";
import { GameStateManager } from "./game/GameStateManager.ts";
import { GameEventEmitter } from "./game/GameStateManager.ts";
import { RoomManager } from "./room/RoomManager.ts";
import { SubmissionManager } from "./game/SubmissionManager.ts";
import { setupAnalyticsHandler } from "./game/AnalyticsManager.ts";
import type { GameState } from "./types.d.ts";

export let io: Server;

export function initSocket(server: HttpServer) {
  io = new Server(server);

  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      return next(new Error("User not authenticated"));
    }
    socket.data.userId = userId;
    next();
  });

  io.on("connection", onConnection);
  setupGameEventHandlers();
  setupAnalyticsHandler();
}

function onConnection(socket: Socket) {
  socket.on("room:join", (roomId: string) => handleRoomJoin(socket, roomId));
  socket.on("quiz:start", () => handleQuizStart(socket));
  socket.on("question:next", () => handleNextQuestionTrigger(socket));
  socket.on("question:submit", (submission, callback) =>
    handleSubmission(socket, submission, callback),
  );

  socket.onAny((event, ...args) => {
    console.log(event, "  ", args);
  });

  socket.onAnyOutgoing((event, ...args) => {
    if (event == "question:analytics") return;
    console.log(event, "  ", args);
  });
}

async function handleRoomJoin(socket: Socket, roomId: string) {
  try {
    const member = await MemberManager.getMemberInfo(
      roomId,
      socket.data.userId,
    );

    if (!member) throw new Error("Unauthorized access");

    socket.data.roomId = roomId;

    if (member.role === "SPECTATOR") {
      socket.join(`${roomId}:spectators`);
    }

    socket.join(roomId);
  } catch (err) {
    socket.emit("error", (err as Error).message);
  }
}

async function handleQuizStart(socket: Socket) {
  const userId = socket.data.userId;
  const roomId = socket.data.roomId;

  try {
    const room = await RoomManager.getRoomInfo(roomId);
    if (room.host.id !== userId)
      throw new Error("Permission denied, only host can start game");

    await GameStateManager.startQuiz(roomId);
  } catch (err) {
    socket.emit("room:permission-error", (err as Error).message);
  }
}

async function handleNextQuestionTrigger(socket: Socket) {
  const roomId = socket.data.roomId;

  try {
    await GameStateManager.prepareNextQuestion(roomId);
  } catch (err) {
    socket.emit("error", (err as Error).message);
  }
}

async function handleSubmission(
  socket: Socket,
  submissionData: {
    questionId: string;
    choiceId: string;
  },
  callback: Function,
) {
  const userId = socket.data.userId;
  const roomId = socket.data.roomId;

  const submissionPayload = {
    roomId,
    userId,
    submittedAt: Date.now(),
    ...submissionData,
  };

  const submission = await SubmissionManager.submitAnswer(submissionPayload);

  callback({ success: true, submission });
}

function setupGameEventHandlers() {
  GameEventEmitter.on(
    "startQuestion",
    ({ room, currentQuestionInfo }: GameState) => {
      io.to(room.id).emit("question:update", currentQuestionInfo);
    },
  );

  GameEventEmitter.on(
    "startCountdown",
    ({ room, countdownInfo }: GameState) => {
      io.to(room.id).emit("question:countdown", countdownInfo!.endsAt);
    },
  );

  GameEventEmitter.on("quizEnded", (gameState: GameState) => {
    io.to(gameState.room.id).emit("quiz:end", gameState);
  });

  GameEventEmitter.on("submissionCountUpdate", (payload) => {
    const { roomId, data } = payload;
    io.to(`${roomId}:spectators`).emit("question:analytics", data);
  });
}
