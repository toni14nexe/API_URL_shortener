exports.responseHandler = (res, status, response) => {
  let message = "";
  if (status === 200) message = "Request was successful";
  if (status === 201) message = "Successfully saved";

  message = response?.message;

  res.status(status).json({
    message: message,
    ...response,
  });
};

exports.errorHandler = (res, error) => {
  let errorStats = {
    status: 0,
    cause: "",
    message: "",
  };

  // Error 401
  if (error.status === 401)
    errorStats = {
      status: 409,
      cause: "Unauthorized",
      message: error?.message,
    };
  // Error 409
  else if (error.code === 11000)
    errorStats = {
      status: 409,
      cause: "User Validation failed",
      message: `${
        error.keyValue?.username ? "Username" : "Email"
      } already exists`,
    };
  else if (error.errors || error.status === 409)
    errorStats = {
      status: 409,
      cause: error._message,
      message: error.errors?.password?.message
        ? "Password should be at least 8 letters long and should contain at least one uppercase letter, one lowercase letter, one number and one special character"
        : error.errors?.email?.message ||
          error.errors?.username?.message ||
          error.errors?.role?.message ||
          error.errors?.role?.url ||
          error.errors?.role?.shortValue,
    };
  // Error 404
  else if (error.name || error.status === 404)
    errorStats = {
      status: 404,
      cause: error.name,
      message:
        error.name === "CastError"
          ? "Wrong path variable value"
          : error?.message,
    };
  // Error 500
  else
    errorStats = {
      status: 500,
      cause: "Internal server error",
      message: "Something went wrong",
    };

  return res.status(errorStats.status).json({
    error: error,
    cause: errorStats.cause,
    message: error?.message || errorStats.message,
  });
};
