export const successResponse = (
  res,
  data = null,
  message = "success",
  code = 200,
) => {
  return res.status(code).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res,
  message = "Something went wrong",
  code = 500,
  error = null,
) => {
  return res.status(code).json({
    success: false,
    message,
    error,
  });
};
