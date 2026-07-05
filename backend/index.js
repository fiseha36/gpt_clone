import "dotenv/config";
import db from "./db/dbConfig.js";
import express from "express";
import cors from "cors";
import mainRouter from "./src/api/main.route.js";
import { errorHandler } from "./src/middleware/error-handler.js";

const app = express();

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://gptcl.netlify.app", // Old Netlify frontend
  "https://gpt-clone-gold.vercel.app", // Vercel production
  "https://gpt-clone-c49ccoo45-fiseha36s-projects.vercel.app", // Vercel preview
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, mobile apps, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// Parse incoming JSON requests
app.use(express.json());

// API routes
app.use("/api", mainRouter);

// Global error handler
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    const connection = await db.getConnection();
    connection.release();

    const PORT = process.env.PORT || 3777;

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
  }
}

// Call the function to start the server
startServer();
