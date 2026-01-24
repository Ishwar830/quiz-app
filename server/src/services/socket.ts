import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "node:http";
import { MemberManager } from "./MemberManager.ts";
import { GameStateManager } from "./GameStateManager.ts";
import { GameEventEmitter } from "./GameStateManager.ts";
import { RoomManager } from "./RoomManager.ts";
import { SubmissionManager } from "./SubmissionManager.ts";

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

    const countdownEndsAt = await GameStateManager.startQuiz(roomId);
    io.to(roomId).emit("question:countdown", countdownEndsAt);
  } catch (err) {
    socket.emit("room:permission-error", (err as Error).message);
  }
}

async function handleNextQuestionTrigger(socket: Socket) {
  const userId = socket.data.userId;
  const roomId = socket.data.roomId;

  try {
    const questionData = await GameStateManager.moveToNextQuestion(roomId);
    if (questionData) io.to(roomId).emit("question:update", questionData);
    else io.to(roomId).emit("quiz:end");
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
  GameEventEmitter.on("startQuestion", (payload) => {
    const { roomId, questionData } = payload;
    io.to(roomId).emit("question:update", questionData);
  });

  GameEventEmitter.on("submissionCountUpdate", (payload) => {
    const { roomId, data } = payload;
    io.to(`${roomId}:spectators`).emit("question:analytics", data);
  });
}
