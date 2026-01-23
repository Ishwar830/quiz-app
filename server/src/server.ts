import "dotenv/config";
import app from "./app.js";
import { initRedis } from "./lib/redis.ts";

const PORT = process.env.PORT || 8000;

await initRedis();

const server = app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});

server.on("error", (err) => {
  console.error("Server Error: ", err);
});
