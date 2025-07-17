const { normalizeSlots } = require("../src/services/slotService");

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

console.log(normalizeSlots(mockData));
