const express = require("express");
const axios = require("axios");
const { normalizeSlots } = require("../services/slotService");
const authMiddleware = require("../middlewares/auth");
const logger = require("../utils/logger");

const router = express.Router();

// Internal API endpoint with query filters, pagination, and authentication
router.get("/available-slots", authMiddleware, async (req, res) => {
  try {
    // Call the mock PMS endpoint
    const response = await axios.get(
      "http://localhost:3000/mock-external-api/slots"
    );
    let normalizedData = normalizeSlots(response.data);

    // Apply query filters
    const { provider, date } = req.query;

    if (provider) {
      normalizedData = normalizedData.filter(
        (slot) => slot.provider.toLowerCase() === provider.toLowerCase()
      );
    }

    if (date) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        logger.warn(`Invalid date format: ${date}`);
        return res.status(400).json({
          error: "Invalid date format. Use YYYY-MM-DD",
          code: "INVALID_DATE",
        });
      }
      normalizedData = normalizedData.filter((slot) => slot.date === date);
    }

    // Apply pagination
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    // Validate pagination parameters
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      logger.warn(
        `Invalid pagination parameters: page=${req.query.page}, limit=${req.query.limit}`
      );
      return res.status(400).json({
        error: "Page and limit must be positive integers",
        code: "INVALID_PAGINATION",
      });
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = normalizedData.slice(startIndex, endIndex);

    // Log successful request
    logger.info(`Successfully processed /api/available-slots`, {
      query: req.query,
      resultCount: paginatedData.length,
    });

    // Return paginated data with metadata
    res.json({
      data: paginatedData,
      total: normalizedData.length,
      page,
      limit,
      totalPages: Math.ceil(normalizedData.length / limit),
    });
  } catch (error) {
    logger.error("Error fetching or normalizing data", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({
      error: "Internal server error",
      code: "SERVER_ERROR",
    });
  }
});

module.exports = router;
