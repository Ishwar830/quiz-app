import { createClient } from "redis";

const redisClient = createClient();

export async function initRedis() {
  await redisClient.connect();

  redisClient.on("error", (err) => {
    console.log("Redis Connection Error: ", err);
    process.exit(1);
  });
}

export default redisClient;
