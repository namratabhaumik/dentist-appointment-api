# Dentist Appointment Sync API

This project implements a backend service that simulates integration with a third-party dental practice management system (PMS). The service provides a mock API, normalizes its inconsistent data, and exposes a clean internal API with additional features like query filters, pagination, authentication, and logging.

## Features

- **Mock Third-Party API**: Simulates a PMS endpoint at `/mock-external-api/slots` with two inconsistent data formats.
- **Data Normalization**: Converts the mock API's inconsistent data into a unified format.
- **Internal API**: Exposes a clean endpoint at `/api/available-slots` that fetches, normalizes, and returns appointment slots.
- **Bonus Features**:
  - **Query Filters**: Supports filtering by `provider` (e.g., `?provider=Dr.%20Lee`) and `date` (e.g., `?date=2025-07-21`).
  - **Pagination**: Supports `page` and `limit` query parameters (e.g., `?page=1&limit=2`) with metadata (total, page, limit, totalPages).
  - **Basic Authentication**: Requires an `X-API-Key` header with valid keys (`abc123` or `xyz789`).
  - **Error Handling and Logging**: Logs requests, errors, and warnings to console and `logs/app.log` using Winston.

## Project Structure

```
dentist-appointment-api/
│
├── src/
│   ├── api/
│   │   ├── availableSlots.js         # Internal API route/controller
│   │   └── mockExternalApi.js        # Mock external API route/controller
│   ├── middlewares/
│   │   └── auth.js                   # Authentication middleware
│   ├── services/
│   │   └── slotService.js            # Data normalization and business logic
│   ├── utils/
│   │   ├── logger.js                 # Winston logger setup
│   │   └── constants.js              # API keys and other constants
│   └── app.js                        # Express app setup (routes, middleware)
│
├── logs/
│   └── app.log                       # Winston log file
│
├── tests/
│   └── (test files can be added here for future unit testing)
│
├── .env                              # Environment variables (API keys, port)
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js                         # Entry point (loads app.js, starts server)
```

## Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)
- npm (included with Node.js)
- Git (optional, for cloning the repository)

### Installation

1. Clone the repository (or download the source):
   ```bash
   git clone https://github.com/namratabhaumik/dentist-appointment-api.git
   cd dentist-appointment-api
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
4. The server will run at `http://localhost:3000` (or the port set in `.env`).

### Testing the API

Use tools like `curl` or Postman to test the endpoints:

- **Mock API**: `curl http://localhost:3000/mock-external-api/slots`
- **Internal API** (requires API key):
  ```bash
  curl -H "X-API-Key: abc123" "http://localhost:3000/api/available-slots?page=1&limit=2"
  ```
  - With filters: `curl -H "X-API-Key: abc123" "http://localhost:3000/api/available-slots?provider=Dr.%20Lee&date=2025-07-21"`
- Logs are written to `logs/app.log`.

## Approach and Assumptions

### Approach

- **Tech Stack**: Built with Node.js and Express for a lightweight, scalable backend. Used `axios` for HTTP requests and `winston` for logging.
- **Modular Design**: Separated concerns into `src/api/` (routes), `src/services/` (data normalization), `src/middlewares/` (authentication), and `src/utils/` (logging and constants).
- **Mock API**: Simulates a third-party PMS with two inconsistent data formats (one with `date/times/doctor`, another with `available_on/slots/provider`) to mimic real-world variability.
- **Normalization**: Handles both formats, converting them into a unified structure with `date`, `start_time`, and `provider` fields. Validates dates and skips invalid entries.
- **Internal API**: Fetches data from the mock API, applies normalization, and supports filtering and pagination. Returns structured responses with metadata.
- **Bonus Features**:
  - Query filters handle case-insensitive provider names and validate date formats.
  - Pagination includes metadata for total items and pages.
  - Authentication uses a simple API key system for security.
  - Logging captures request details, errors, and warnings for debugging.

### Assumptions

- The mock API is hosted locally at `http://localhost:3000/mock-external-api/slots` for simplicity.
- API keys are stored in `src/utils/constants.js` for this demo; in production, they would be in a secure database or environment variables.
- Query parameters like `provider` require URL encoding (e.g., Using `%20` to denote blank spaces) as per standard HTTP practices.
- No database is used, as the focus is on API logic and data transformation.
- The mock data is static but could be extended with more variability or edge cases.

## API Structure

### Mock API

- **Endpoint**: `GET /mock-external-api/slots`
- **Sample Request:**
  ```bash
  curl http://localhost:3000/mock-external-api/slots
  ```
- **Sample Response:**
  ```json
  [
    {
      "date": "2025-07-20",
      "times": ["09:00", "10:30", "13:15"],
      "doctor": { "name": "Dr. Smith", "id": "d1001" },
      "type": "NewPatient"
    },
    {
      "available_on": "2025/07/21",
      "slots": [
        { "start": "10:00", "end": "10:30" },
        { "start": "11:00", "end": "11:30" }
      ],
      "provider": "Dr. Lee",
      "category": "General"
    },
    {
      "date": "2025-7-22",
      "times": ["08:00", "09:30"],
      "doctor": { "name": "Dr. Patel", "id": "d1002" },
      "extra_field": "should be ignored"
    }
    // ... additional entries with various formats, edge cases, and malformed data
    // including empty slots, duplicate entries, missing fields, null values, etc.
  ]
  ```
- **Note:** The mock API returns a larger and more varied dataset, including messy, non-uniform, and malformed entries to better simulate real-world scenarios.

### Internal API

- **Endpoint**: `GET /api/available-slots`
- **Headers**: `X-API-Key: abc123` (or `xyz789`)
- **Query Parameters**:
  - `provider` (optional): Filter by provider name (e.g., `Dr.%20Lee`).
  - `date` (optional): Filter by date (YYYY-MM-DD).
  - `page` (optional): Page number (default: 1).
  - `limit` (optional): Items per page (default: 10).

#### Sample Requests and Responses

- **Filter by Provider (Dr. Patel):**

  ```bash
  curl -H "X-API-Key: abc123" "http://localhost:3000/api/available-slots?provider=Dr.%20Patel"
  ```

  **Sample Response:**

  ```json
  {
    "data": [
      { "date": "2025-7-22", "start_time": "08:00", "provider": "Dr. Patel" },
      { "date": "2025-7-22", "start_time": "09:30", "provider": "Dr. Patel" }
    ],
    "total": 2,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
  ```

- **Filter by Provider (Dr. O'Neil):**

  ```bash
  curl -H "X-API-Key: abc123" "http://localhost:3000/api/available-slots?provider=Dr.%20O%27Neil"
  ```

  **Sample Response:**

  ```json
  {
    "data": [
      { "date": "2025-07-26", "start_time": "16:00", "provider": "Dr. O'Neil" }
    ],
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
  ```

- **Filter by Provider (Dr. Gomez, no slots):**

  ```bash
  curl -H "X-API-Key: abc123" "http://localhost:3000/api/available-slots?provider=Dr.%20Gomez"
  ```

  **Sample Response:**

  ```json
  {
    "data": [],
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 0
  }
  ```

- **Filter by Provider and Date (Dr. Lee, 2025-07-24, duplicate slots):**

  ```bash
  curl -H "X-API-Key: abc123" "http://localhost:3000/api/available-slots?provider=Dr.%20Lee&date=2025-07-24"
  ```

  **Sample Response:**

  ```json
  {
    "data": [
      { "date": "2025-07-24", "start_time": "14:00", "provider": "Dr. Lee" },
      { "date": "2025-07-24", "start_time": "14:00", "provider": "Dr. Lee" }
    ],
    "total": 2,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
  ```

- **Malformed Entry (should be skipped):**

  - The entry missing both `date` and `available_on` will not appear in the normalized results.

- **Empty Times Array (Dr. Smith, 2025-07-25):**

  - The entry with an empty `times` array will not produce any slots in the normalized results.

- **All Filters and Pagination Combined (Dr. Lee, 2025-07-21, page=1, limit=1):**

  ```bash
  curl -H "X-API-Key: abc123" "http://localhost:3000/api/available-slots?provider=Dr.%20Lee&date=2025-07-21&page=1&limit=1"
  ```

  **Sample Response:**

  ```json
  {
    "data": [
      { "date": "2025-07-21", "start_time": "10:00", "provider": "Dr. Lee" }
    ],
    "total": 2,
    "page": 1,
    "limit": 1,
    "totalPages": 2
  }
  ```

- **Entry with times containing a null value (Dr. House):**

  ```bash
  curl -H "X-API-Key: abc123" "http://localhost:3000/api/available-slots?provider=Dr.%20House"
  ```

  **Sample Response:**

  ```json
  {
    "data": [
      { "date": "2025-07-29", "start_time": "18:00", "provider": "Dr. House" },
      { "date": "2025-07-29", "start_time": "19:00", "provider": "Dr. House" }
    ],
    "total": 2,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
  ```

- **Entry with slots containing an object missing start (Dr. Watson):**
  ```bash
  curl -H "X-API-Key: abc123" "http://localhost:3000/api/available-slots?provider=Dr.%20Watson"
  ```
  **Sample Response:**
  ```json
  {
    "data": [
      { "date": "2025-07-30", "start_time": "20:00", "provider": "Dr. Watson" }
    ],
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
  ```

#### Error Scenarios

- **Missing API Key:**

  ```bash
  curl "http://localhost:3000/api/available-slots"
  ```

  **Expected Response:**

  ```json
  {
    "error": "API key is required",
    "code": "MISSING_API_KEY"
  }
  ```

- **Invalid API Key:**

  ```bash
  curl -H "X-API-Key: wrongkey" "http://localhost:3000/api/available-slots"
  ```

  **Expected Response:**

  ```json
  {
    "error": "Invalid API key",
    "code": "INVALID_API_KEY"
  }
  ```

- **Invalid Date Format:**

  ```bash
  curl -H "X-API-Key: abc123" "http://localhost:3000/api/available-slots?date=21-07-2025"
  ```

  **Expected Response:**

  ```json
  {
    "error": "Invalid date format. Use YYYY-MM-DD",
    "code": "INVALID_DATE"
  }
  ```

- **Invalid Pagination Parameters:**
  ```bash
  curl -H "X-API-Key: abc123" "http://localhost:3000/api/available-slots?page=0&limit=-5"
  ```
  **Expected Response:**
  ```json
  {
    "error": "Page and limit must be positive integers",
    "code": "INVALID_PAGINATION"
  }
  ```

## Bonus Features Implemented

- **Query Filters**: Supports filtering by provider and date with case-insensitive provider matching and date format validation.
- **Pagination**: Implements pagination with `page` and `limit` parameters, including metadata for total items and pages.
- **Authentication**: Enforces API key validation via the `X-API-Key` header.
- **Error Handling and Logging**: Uses Winston to log requests, warnings, and errors to console and `logs/app.log` with timestamps and structured data.

## Potential Improvements

- Add rate limiting to prevent API abuse (e.g., using `express-rate-limit`).
- Implement sorting for consistent result ordering (e.g., by date and time).
- Add unit tests with a framework like Jest to ensure reliability.
- In a production system, a webhook endpoint can be immplemented that third-party PMS systems call whenever appointment slots are updated. The API would process these incoming webhook events to update internal availability in real time, ensuring the platform always reflects the latest schedule.
