import dotenv from "dotenv";
import mqtt from "mqtt";
import logger from "./logger.js";

dotenv.config();

const brokerUrl = process.env.MQTT_BROKER_URL;
const clientIdPrefix = process.env.MQTT_CLIENT_PREFIX || "GH_iot_system_";

const mqttClient = mqtt.connect(brokerUrl, {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  clientId: `${clientIdPrefix}${Math.random().toString(16).slice(3)}`,
});

mqttClient.on("connect", () => {
  logger.info("Automation Worker successfully connected to MQTT Broker");
});

mqttClient.on("error", (err) => {
  logger.error("MQTT Connection Error: ", err);
});

export default mqttClient;
