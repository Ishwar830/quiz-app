import "dotenv/config";
import { createClient } from "redis";
import { initializeIndexes } from "../services/redis/indexManager.ts";

const redisClient = createClient({ url: process.env.REDIS_URL! });

export async function initRedis() {
  await redisClient.connect();

  await initializeIndexes();

  redisClient.on("error", (err) => {
    console.log("Redis Connection Error: ", err);
    process.exit(1);
  });
}

export default redisClient;
