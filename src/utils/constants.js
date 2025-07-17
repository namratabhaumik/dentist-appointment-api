// API keys (in production, use environment variables)
const dotenv = require("dotenv");
dotenv.config();

const VALID_API_KEYS = process.env.API_KEYS
  ? process.env.API_KEYS.split(",").map((k) => k.trim())
  : [];

module.exports = {
  VALID_API_KEYS,
};
