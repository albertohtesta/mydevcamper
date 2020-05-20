const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  // esta rutina recibe el err normal o el errorResponse (que es una subclase nuestra) segun le mande el controller
  let error = { ...err };
  error.message = err.message;
  // log to console for dev
  console.log(`objeto error: ${err}`);

  // Moongose bad object
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
