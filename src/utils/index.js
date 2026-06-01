import {prisma} from "../config/prisma.js";
import {sendCommandToDevice} from "../service/sendCommandToDevice.js";
import logger from "./logger.js";
import {redisClient} from "./redis.js";

let currentTimer = null;

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

export async function syncAutomationToRedis() {
  try {
    const activeAutomations = await prisma.automation.findMany({
      where: {
        isActive: true,
      },
      include: {
        device: true,
        component: true,
      },
    });

    const pipeline = redisClient.multi();

    activeAutomations.forEach((auto) => {
      const redisKey = `automation:config:${auto.id}`;
      const score = timeToMinutes(auto.time);

      pipeline.hSet(redisKey, {
        id: String(auto.id),
        macaddress: String(auto.device.macaddress),
        deviceId: String(auto.deviceId),
        componentId: String(auto.componentId),
        pin: String(auto.component.pin),
        action: String(auto.action),
        time: String(auto.time),
        duration: String(auto.duration),
      });

      pipeline.zAdd("automation:queue", {
        score: score,
        value: String(auto.id),
      });
    });
    await pipeline.exec();

    logger.info("Synchronize successfully, Configuration has set to redis");
  } catch (error) {
    logger.error("Failed to sychronize to redis");
    logger.error(error);
    throw error;
  }
}

export async function scheduleNextJob() {
  try {
    const currentMinutes = getCurrentMinutesFromMidnight();

    const nextJobClosest = await redisClient.zRangeByScore(
      "automation:queue",
      currentMinutes,
      2880,
      {
        LIMIT: {
          offset: 0,
          count: 1,
        },
      },
    );

    if (nextJobClosest.length === 0) {
      logger.info("Automation schedule not found. Re-check on 1 hours");
      currentTimer = setTimeout(scheduleNextJob, 3600000);
      return;
    }

    const targetMinutes = await redisClient.zScore(
      "automation:queue",
      nextJobClosest[0],
    );

    const jobToExecute = await redisClient.zRangeByScore(
      "automation:queue",
      targetMinutes,
      targetMinutes,
    );

    const delayInMinutes = targetMinutes - currentMinutes;
    const delayInMilliseconds = delayInMinutes * 60 * 1000;

    logger.info(
      `Worker slept. Found ${jobToExecute.length} concurrent automation at ${targetMinutes} (${delayInMinutes} minutes left)`,
    );

    if (currentTimer) clearTimeout(currentTimer);

    currentTimer = setTimeout(async () => {
      logger.info(
        `Time to wake up!. Executing ${jobToExecute.length} automations at once`,
      );

      for (const jobId of jobToExecute) {
        const config = await redisClient.hGetAll(`automation:config:${jobId}`);

        if (config && Object.keys(config).length > 0) {
          // exec
          sendCommandToDevice(
            config.macaddress,
            config.componentId,
            config.action,
            config.duration,
            config.pin,
          );

          const nextScore = targetMinutes + 1440;
          await redisClient.zAdd("automation:queue", {
            score: nextScore,
            value: jobId,
          });
        }
      }

      scheduleNextJob();
    }, delayInMilliseconds);
  } catch (error) {
    logger.error("Failed to handle schedule");
  }
}
