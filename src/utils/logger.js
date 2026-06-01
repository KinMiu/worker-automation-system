const getDevTime = () => {
  return new Date().toLocaleString();
};

const logger = {
  info: (message, ...args) => {
    console.log(`[INFO] ${getDevTime()} - ${message}`, ...args);
  },
  error: (message, ...args) => {
    console.log(`[ERROR] ${getDevTime()} - ${message}`, ...args);
  },
  warn: (message, ...args) => {
    console.log(`[WARN] ${getDevTime()} - ${message}`, ...args);
  },
};

export default logger;
