const express = require("express");
const logger = require("../utils/logger");

const router = express.Router();

// Mock third-party API endpoint
router.get("/slots", (req, res) => {
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
    {
      date: "2025-7-22", // missing leading zero in month
      times: ["08:00", "09:30"],
      doctor: { name: "Dr. Patel", id: "d1002" },
      extra_field: "should be ignored",
    },
    {
      available_on: "2025/07/23",
      slots: [],
      provider: "Dr. Gomez",
      category: "General",
    },
    {
      available_on: "2025/07/24",
      slots: [
        { start: "14:00", end: "14:30" },
        { start: "14:00", end: "14:30" }, // duplicate slot
      ],
      provider: "Dr. Lee",
      category: "General",
      notes: "Double-booked",
    },
    {
      // Malformed entry: missing both date and available_on
      slots: [{ start: "15:00", end: "15:30" }],
      provider: "Dr. Smith",
    },
    {
      date: "2025-07-25",
      times: [],
      doctor: { name: "Dr. Smith", id: "d1001" },
    },
    {
      available_on: "2025/07/26",
      slots: [{ start: "16:00", end: "16:30" }],
      provider: "Dr. O'Neil",
      category: "Specialist",
      location: "Room 2",
    },
    {
      date: "2025-07-27",
      doctor: { name: "Dr. Strange", id: "d1003" },
    },
    {
      available_on: "2025/07/28",
      slots: [{ start: "17:00", end: "17:30" }],
    },
    {
      date: "2025-07-29",
      times: ["18:00", null, "19:00"],
      doctor: { name: "Dr. House", id: "d1004" },
    },
    {
      available_on: "2025/07/30",
      slots: [{ end: "20:30" }, { start: "20:00", end: "20:30" }],
      provider: "Dr. Watson",
    },
  ];
  logger.info("Mock API /mock-external-api/slots called");
  res.json(mockData);
});

module.exports = router;
