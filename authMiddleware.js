// Simulated valid API keys (in a real app, store these securely)
const validApiKeys = ["abc123", "xyz789"];

function authMiddleware(req, res, next) {
  const apiKey = req.header("X-API-Key");

  if (!apiKey) {
    return res.status(401).json({ error: "API key is required" });
  }

  if (!validApiKeys.includes(apiKey)) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  next(); // Proceed to the next middleware or route handler
}

module.exports = authMiddleware;
