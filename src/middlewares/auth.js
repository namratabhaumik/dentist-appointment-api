const logger = require("../utils/logger");
const { VALID_API_KEYS } = require("../utils/constants");

// This middleware enforces API key authentication for protected endpoints.
// API key auth is used as a simple access control mechanism for demonstration or internal use.
// It is not suitable for production-grade security, but provides basic protection for this API.
function authMiddleware(req, res, next) {
  const apiKey = req.header("X-API-Key");

  if (!apiKey) {
    logger.warn("API key missing in request");
    return res.status(401).json({
      error: "API key is required",
      code: "MISSING_API_KEY",
    });
  }

  if (!VALID_API_KEYS.includes(apiKey)) {
    logger.warn(`Invalid API key provided: ${apiKey}`);
    return res.status(401).json({
      error: "Invalid API key",
      code: "INVALID_API_KEY",
    });
  }

  logger.info(`Authenticated request with API key: ${apiKey}`);
  next();
}

module.exports = authMiddleware;
