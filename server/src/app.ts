import express from "express";
import { Router } from "express";
import morgan from "morgan";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.ts";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandlers.ts";
import { quizRouter } from "./routes/quizRouter.ts";
import { roomRouter } from "./routes/roomRouter.ts";
import { gamesRouter } from "./routes/gamesRouter.ts";

const apiRouter = Router();
apiRouter.use(morgan("tiny"));

apiRouter.all("/auth/{*any}", toNodeHandler(auth));

apiRouter.use(express.json());

apiRouter.use("/quizzes", quizRouter);
apiRouter.use("/rooms", roomRouter);
apiRouter.use("/games", gamesRouter);

apiRouter.use(notFoundHandler);

apiRouter.use(errorHandler);

export const app = express();

app.use("/api", apiRouter);

