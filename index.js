const express = require("express");
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
