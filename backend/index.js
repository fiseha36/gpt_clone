// import "dotenv/config";
// import express from "express";
// import db from "./db/dbConfig.js";
// import mainRouter from "./src/api/main.route.js";
// import cors from "cors";
// import { errorHandler } from "./src/middleware/error-handler.js";

// // app.post("api/chat/conversations",(req,res)=>{res.send("post method")})
// //  app.get("api/chat/conversations",(req,res)=>{res.send("get method")})
// const app = express();

// app.use(cors({
//   origin: "http://localhost:5173"
// }))

// app.use(express.json());

// // app.use(express.urlencoded({ extended: true }));
// app.use("/api",mainRouter);
// app.use(errorHandler);

// async function startServer() {
//   const PORT = 3888;

//   try {
//     // Establishing database connection
//     const connection = await db.getConnection();
//     connection.release();
//     console.log("Db connected");

//     // Starting the Express server
//     app.listen(PORT, (err) => {
//       if (err) {
//         throw err;
//       }
//       console.log(`Server is running on port http://localhost:${PORT}`);
//     });
//   } catch (error) {
//     // Catching any errors during connection or startup
//     console.error("Error starting server:", error.message);
//   }
// }

// startServer();

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
  "https://gptcl.netlify.app", // Production frontend
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