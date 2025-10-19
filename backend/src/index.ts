import express from "express";
import dotenv from "dotenv";

// read environment variables from .env file
dotenv.config();
const PORT = process.env.PORT ?? 8000;

const app = express();

// Parse JSON request bodies
app.use(express.json());

// CORS middleware - adjust as needed for your frontend
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Root route
app.get("/", (_, res) => {
  res.json({ message: "Hello from Express!" });
});

// API routes
app.get("/api/hello", (_, res) => {
  res.json({ message: "Hello, frontend!" });
});

// Data points route for graphing - simulates real-time sensor data
app.get("/api/data", (_, res) => {
  interface DataPoint {
    timestamp: number; // Unix timestamp in milliseconds
    value: number;
    metric2: number;
    metric3: number;
  }

  // Return a single data point representing current sensor reading
  const dataPoint: DataPoint = {
    timestamp: Date.now(),
    value: Math.floor(Math.random() * 100) + 50,
    metric2: Math.floor(Math.random() * 80) + 20,
    metric3: Math.floor(Math.random() * 60) + 40,
  };

  res.json({ dataPoint });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
