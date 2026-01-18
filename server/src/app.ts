import express from "express";
import morgan from "morgan";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandlers.js";
import { quizRouter } from "./routes/quizRouter.ts";

const app = express();
app.use(morgan("tiny"));

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

app.use("/api/quizzes", quizRouter);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
