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

// Internal API endpoint
app.get("/api/available-slots", async (req, res) => {
  try {
    // Call the mock PMS endpoint
    const response = await axios.get(
      "http://localhost:3000/mock-external-api/slots"
    );
    const mockData = response.data;

    // Normalize the data
    const normalizedData = normalizeSlots(mockData);

    // Return the unified format
    res.json(normalizedData);
  } catch (error) {
    console.error("Error fetching or normalizing data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
