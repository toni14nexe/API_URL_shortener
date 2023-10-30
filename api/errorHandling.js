exports.usersErrorHandling = (error, res) => {
  if (error.code === 11000)
    return res.status(409).json({
      error: error,
      cause: "User Validation failed",
      message: `${
        error.keyValue?.username ? "Username" : "Email"
      } already exists`,
    });
  else if (error.errors)
    return res.status(409).json({
      error: error,
      cause: error._message,
      message: error.errors.password?.message
        ? "Password should be at least 8 letters long and should contain at least one uppercase letter, one lowercase letter, one number and one special character"
        : error.errors.email?.message ||
          error.errors.username?.message ||
          error.errors.role?.message ||
          error.errors.role?.url ||
          error.errors.role?.shortValue,
    });
  else if (error.name)
    return res.status(404).json({
      error: error,
      cause: error.name,
      message:
        error.name === "CastError"
          ? "Wrong path variable value"
          : error?.message,
    });

  return res.status(500).json({
    error: error,
    cause: "Internal server error",
    message: "Something went wrong",
  });
};
