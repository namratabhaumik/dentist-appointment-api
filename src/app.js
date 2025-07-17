const express = require("express");
const mockExternalApiRouter = require("./api/mockExternalApi");
const availableSlotsRouter = require("./api/availableSlots");
const logger = require("./utils/logger");

const app = express();

// Logging middleware for all requests
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Mount routers
app.use("/mock-external-api", mockExternalApiRouter);
app.use("/api", availableSlotsRouter);

// Error handler
app.use((err, req, res, next) => {
  logger.error("Unhandled error", { message: err.message, stack: err.stack });
  res
    .status(500)
    .json({ error: "Internal server error", code: "SERVER_ERROR" });
});

module.exports = app;
