import {createClient} from "redis";
import logger from "./logger.js";

const redisUrl = process.env.REDIS_URL || "redis:localhost:6379";

export const redisClient = createClient({
  url: redisUrl,
});

redisClient.on("error", (err) => logger.error("Redis Client Error: ", err));
redisClient.on("connect", () => logger.info("Menghubungkan ke redis..."));
redisClient.on("ready", () =>
  logger.info("Worker successfully connected to Redis"),
);

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  return redisClient;
}
