export const safeMessage = (devMessage, prodMessage) => {
  const message =
    process.env.NODE_ENV === "development" ? devMessage : prodMessage;
  return new Error(message);
};
