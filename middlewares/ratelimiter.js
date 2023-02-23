const rateLimite = require('express-rate-limit');

const limiter = rateLimite({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;
