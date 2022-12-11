const rateLimit = require('express-rate-limit');

const requestRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 15 min in milliseconds
  max: 30,
  message: "Error: You have reached maximum requests. Please try again after 30 minutes", 
  statusCode: 429,
  headers: true,
});
module.exports = { requestRateLimiter }
