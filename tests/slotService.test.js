const { normalizeSlots } = require("../src/services/slotService");

describe("normalizeSlots", () => {
  test("should normalize first format (date/times/doctor)", () => {
    const mockData = [
      {
        date: "2025-07-20",
        times: ["09:00", "10:30", "13:15"],
        doctor: { name: "Dr. Smith", id: "d1001" },
        type: "NewPatient",
      },
    ];

    const result = normalizeSlots(mockData);

    expect(result).toEqual([
      { date: "2025-07-20", start_time: "09:00", provider: "Dr. Smith" },
      { date: "2025-07-20", start_time: "10:30", provider: "Dr. Smith" },
      { date: "2025-07-20", start_time: "13:15", provider: "Dr. Smith" },
    ]);
  });

  test("should normalize second format (available_on/slots/provider)", () => {
    const mockData = [
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

    const result = normalizeSlots(mockData);

    expect(result).toEqual([
      { date: "2025-07-21", start_time: "10:00", provider: "Dr. Lee" },
      { date: "2025-07-21", start_time: "11:00", provider: "Dr. Lee" },
    ]);
  });

  test("should handle mixed formats in same dataset", () => {
    const mockData = [
      {
        date: "2025-07-20",
        times: ["09:00"],
        doctor: { name: "Dr. Smith", id: "d1001" },
      },
      {
        available_on: "2025/07/21",
        slots: [{ start: "10:00", end: "10:30" }],
        provider: "Dr. Lee",
      },
    ];

    const result = normalizeSlots(mockData);

    expect(result).toEqual([
      { date: "2025-07-20", start_time: "09:00", provider: "Dr. Smith" },
      { date: "2025-07-21", start_time: "10:00", provider: "Dr. Lee" },
    ]);
  });

  test("should skip entries with missing required fields", () => {
    const mockData = [
      {
        date: "2025-07-20",
        times: ["09:00"],
        doctor: { name: "Dr. Smith", id: "d1001" },
      },
      {
        // Missing both date and available_on
        slots: [{ start: "10:00", end: "10:30" }],
        provider: "Dr. Lee",
      },
      {
        date: "2025-07-22",
        // Missing times
        doctor: { name: "Dr. Patel", id: "d1002" },
      },
      {
        available_on: "2025/07/23",
        slots: [{ start: "11:00", end: "11:30" }],
        // Missing provider
      },
    ];

    const result = normalizeSlots(mockData);

    expect(result).toEqual([
      { date: "2025-07-20", start_time: "09:00", provider: "Dr. Smith" },
    ]);
  });

  test("should skip null or invalid start times", () => {
    const mockData = [
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

    const result = normalizeSlots(mockData);

    expect(result).toEqual([
      { date: "2025-07-29", start_time: "18:00", provider: "Dr. House" },
      { date: "2025-07-29", start_time: "19:00", provider: "Dr. House" },
      { date: "2025-07-30", start_time: "20:00", provider: "Dr. Watson" },
    ]);
  });

  test("should handle empty arrays", () => {
    const mockData = [
      {
        date: "2025-07-25",
        times: [],
        doctor: { name: "Dr. Smith", id: "d1001" },
      },
      {
        available_on: "2025/07/23",
        slots: [],
        provider: "Dr. Gomez",
        category: "General",
      },
    ];

    const result = normalizeSlots(mockData);

    expect(result).toEqual([]);
  });

  test("should ignore extra fields", () => {
    const mockData = [
      {
        date: "2025-7-22",
        times: ["08:00", "09:30"],
        doctor: { name: "Dr. Patel", id: "d1002" },
        extra_field: "should be ignored",
        another_field: "also ignored",
      },
    ];

    const result = normalizeSlots(mockData);

    expect(result).toEqual([
      { date: "2025-7-22", start_time: "08:00", provider: "Dr. Patel" },
      { date: "2025-7-22", start_time: "09:30", provider: "Dr. Patel" },
    ]);
  });

  test("should return empty array for empty input", () => {
    const result = normalizeSlots([]);
    expect(result).toEqual([]);
  });
});
