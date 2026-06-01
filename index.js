import dotenv from "dotenv";
import logger from "./src/utils/logger.js";
import {prisma} from "./src/config/prisma.js";
import {connectRedis, redisClient} from "./src/utils/redis.js";
import {scheduleNextJob, syncAutomationToRedis} from "./src/utils/index.js";
import {closeAMQP, connectAMQP} from "./src/utils/amqp.js";
import {startSyncConsumer} from "./src/service/consumer.js";

dotenv.config();

async function startServer() {
  try {
    await prisma.$connect();
    await connectRedis();
    logger.info("Database connected successfully");

    await connectAMQP();

    await syncAutomationToRedis();

    setTimeout(async () => {
      try {
        // Jalankan consumer setelah channel dipastikan aman / tidak null
        await startSyncConsumer();

        // Jalankan scheduler utama
        await scheduleNextJob();

        logger.info("Worker System & Sync Consumer are fully Running");
      } catch (innerError) {
        logger.error("Failed to initialize background workers:", innerError);
      }
    }, 1500);

    logger.info("Worker System is Running");
  } catch (error) {
    logger.error("Failed to connect to database");
    logger.error(error);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  logger.info("Shutting down...");
  await closeAMQP();
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
