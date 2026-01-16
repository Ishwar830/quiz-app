import express from "express";
import morgan from "morgan";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

const app = express();
app.use(morgan("tiny"));

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

export default app;
