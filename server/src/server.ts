import "dotenv/config";
import express from "express";
import apiRouter from "./apiRouter.ts";
import { initRedis } from "./lib/redis.ts";
import { initSocket } from "./services/socket.ts";
import path from "node:path";

const PORT = process.env.PORT || 8000;

await initRedis();

const app = express();

app.use("/api", apiRouter);

if (process.env.NODE_ENV === "production") {
  const distPath = path.resolve(import.meta.dirname, "../../../client/dist");
  app.use(express.static(distPath));

  app.get("/", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  app.get("/{*any}", (_req, res) => {
    res.redirect("/");
  });
}

const server = app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});

server.on("error", (err) => {
  console.error("Server Error: ", err);
});

initSocket(server);
