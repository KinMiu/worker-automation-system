import {getChannel} from "../utils/amqp.js";
import {scheduleNextJob} from "../utils/index.js";
import logger from "../utils/logger.js";
import {redisClient} from "../utils/redis.js";

function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

function getCurrentMinutesFromMidnight() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  return hours * 60 + minutes;
}

export const startSyncConsumer = async () => {
  try {
    const channel = getChannel();
    const queueName = "automation:sync";

    await channel.assertQueue(queueName, {durable: true});
    logger.info(
      `AMQP Sync Consumer started. Listening  for schedule update...`,
    );

    channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        try {
          const {eventType, data} = JSON.parse(msg.content.toString());
          console.log(data);
          logger.info(
            `Catched the ${eventType} event for Schedule ID: ${data.id}`,
          );

          const hashKey = `automation:config:${data.id}`;

          if (eventType === "Deleted") {
            logger.info(
              `Detected schedule is deleted. Perform cleaner schedule in redis...`,
            );

            const pipeline = redisClient.multi();

            pipeline.del(hashKey);
            pipeline.zRem(`automation:queue`, String(data.id));

            await pipeline.exec();
            logger.info(`successfully deleted ID ${data.id} from redis memory`);
          } else {
            const newScore = timeToMinutes(data.time);

            const isExisting = await redisClient.exists(hashKey);

            if (isExisting) {
              logger.info(`Found the old schedule. Perform update in redis`);
            } else {
              logger.info(
                `Detected the new schedule. Insert new schedule to redis`,
              );
            }

            const pipeline = redisClient.multi();

            pipeline.hSet(hashKey, {
              id: String(data.id),
              macaddress: String(data.macAddress),
              deviceId: String(data.deviceId),
              componentId: String(data.componentId),
              pin: String(data.pin),
              action: String(data.action),
              time: String(data.time),
              duration: String(data.duration),
            });

            pipeline.zAdd("automation:queue", {
              score: newScore,
              value: String(data.id),
            });

            await pipeline.exec();
            logger.info(
              `successfully to sychronize Redis memory for id ${data.id}`,
            );
          }

          await scheduleNextJob();

          channel.ack(msg);
        } catch (error) {
          logger.error("Failed to Synchronize schedule data", error);
          channel.ack(msg);
        }
      }
    });
  } catch (error) {
    logger.error("Failed to running AMQP to sync consumer", error);
  }
};
