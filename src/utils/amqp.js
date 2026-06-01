import amqp from "amqplib";
import dotenv from "dotenv";
import logger from "./logger.js";

dotenv.config();

let connection = null;
let channel = null;

const rmqConfig = {
  protocol: "amqp",
  hostname: process.env.AMQP_HOST || "localhost",
  port: process.env.AMQP_PORT || 5672,
  username: process.env.AMQP_USER || "guest",
  password: process.env.AMQP_PASS || "guest",
  vhost: process.env.AMQP_VHOST || "/",
};

export const connectAMQP = async () => {
  return new Promise(async (resolve, reject) => {
    if (channel) return resolve(channel);
    try {
      connection = await amqp.connect(rmqConfig);

      channel = await connection.createChannel();
      logger.info("Backend successfully connected to AMQP Broker (RabbitMQ)");

      connection.on("error", (err) => {
        logger.error("AMQP Connection Error: ", err);
      });

      connection.on("close", () => {
        logger.warn("AMQP Connection Closed. Attempting to reconnect...");
        connection = null;
        channel = null;
        setTimeout(connectAMQP, 5000);
      });

      resolve(channel);
    } catch (error) {
      logger.error(
        "Failed to connect to AMQP Broker, retrying in 5s...",
        error.message,
      );
      setTimeout(connectAMQP, 5000);
    }
  });
};

export const getChannel = () => {
  if (!channel) {
    throw new Error(
      "AMQP Channel is not initialized yet. Please wait for connection.",
    );
  }
  return channel;
};

export const closeAMQP = async () => {
  try {
    if (channel) await channel.close();
    if (connection) await connection.close();
    logger.info("AMQP Connection closed gracefully");
  } catch (error) {
    logger.error("Error closing AMQP connection: ", error.message);
  }
};
