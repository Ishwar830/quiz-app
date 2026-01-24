import { createClient } from "redis";
import { initializeIndexes } from "../services/redis/indexManager.ts";

const redisClient = createClient();

export async function initRedis() {
  await redisClient.connect();

  await initializeIndexes();

  redisClient.on("error", (err) => {
    console.log("Redis Connection Error: ", err);
    process.exit(1);
  });
}

export default redisClient;
