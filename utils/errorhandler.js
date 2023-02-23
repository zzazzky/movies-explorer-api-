const mongoose = require('mongoose');

const { ValidationError } = mongoose.Error.ValidationError;
const { CastError } = mongoose.Error.CastError;
const NotFoundError = require('./NotFoundError');
const UnauthorizedError = require('./UnauthorizedError');
const ForbiddenError = require('./ForbiddenError');
const ConflictError = require('./ConflictError');
const BadRequestError = require('./BadRequestError');
const ServerError = require('./ServerError');

const errorHandler = (err, req, res, next) => {
  let handledError;
  if (
    err instanceof ForbiddenError
    || err instanceof NotFoundError
    || err instanceof UnauthorizedError
    || err instanceof ConflictError
  ) {
    handledError = err;
  } else if (err.code === 11000) {
    handledError = new ConflictError(err.message);
  } else if (err instanceof ValidationError || err instanceof CastError) {
    handledError = new BadRequestError(err.message);
  } else {
    handledError = new ServerError();
  }
  res.status(handledError.statusCode).send({ message: handledError.message });
  next();
};

module.exports = { errorHandler };
