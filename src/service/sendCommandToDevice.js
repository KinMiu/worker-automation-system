import logger from "../utils/logger.js";
import mqttClient from "../utils/mqtt.js";

export function sendCommandToDevice(
  macAddress,
  componentId,
  action,
  duration,
  pin,
) {
  const topic = `command/${macAddress}`;

  const payload = JSON.stringify({
    componentId: componentId,
    pin: pin,
    command: action,
    duration: Number(duration),
  });

  mqttClient.publish(topic, payload, {qos: 1}, (err) => {
    if (err) {
      logger.error("Failed to publish MQTT message: ", err);
    } else {
      logger.info(`successfully Published to ${topic}`);
    }
  });
}
