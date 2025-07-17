const express = require("express");
const axios = require("axios");
const { normalizeSlots } = require("./normalizeSlots");
const app = express();
const port = 3000;

// Mock third-party API endpoint
app.get("/mock-external-api/slots", (req, res) => {
  const mockData = [
    {
      date: "2025-07-20",
      times: ["09:00", "10:30", "13:15"],
      doctor: { name: "Dr. Smith", id: "d1001" },
      type: "NewPatient",
    },
    {
      available_on: "2025/07/21",
      slots: [
        { start: "10:00", end: "10:30" },
        { start: "11:00", end: "11:30" },
      ],
      provider: "Dr. Lee",
      category: "General",
    },
  ];
  res.json(mockData);
});

// Internal API endpoint with query filters
app.get("/api/available-slots", async (req, res) => {
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
      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        return res
          .status(400)
          .json({ error: "Invalid date format. Use YYYY-MM-DD" });
      }
      normalizedData = normalizedData.filter((slot) => slot.date === date);
    }

    // Return filtered data
    res.json(normalizedData);
  } catch (error) {
    console.error("Error fetching or normalizing data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
