function normalizeSlots(mockData) {
  const normalized = [];

  mockData.forEach((item) => {
    let date, provider, times;

    // Handle first format
    if (item.date && item.times && item.doctor) {
      date = item.date; // Already in YYYY-MM-DD
      provider = item.doctor.name;
      times = item.times.map((time) => ({ start_time: time }));
    }
    // Handle second format
    else if (item.available_on && item.slots && item.provider) {
      // Convert available_on (YYYY/MM/DD) to YYYY-MM-DD
      date = item.available_on.split("/").join("-");
      provider = item.provider;
      times = item.slots.map((slot) => ({ start_time: slot.start }));
    } else {
      // Skip invalid data entries
      return;
    }

    // Add each time slot as a separate entry
    times.forEach((time) => {
      normalized.push({
        date,
        start_time: time.start_time,
        provider,
      });
    });
  });

  return normalized;
}

module.exports = { normalizeSlots };
