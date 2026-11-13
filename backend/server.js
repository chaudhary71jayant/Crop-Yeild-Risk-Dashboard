import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./src/config/env.js";
import { logger } from "./src/config/logger.js";
import districtRoutes from "./src/routes/districts.routes.js";
import { errorHandler } from "./src/middleware/errorHandler.middleware.js";

const app = express();
const PORT = env.PORT;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000"
];

if (process.env.FRONTEND_URL) {
  process.env.FRONTEND_URL.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
    .forEach((origin) => {
      if (!allowedOrigins.includes(origin)) {
        allowedOrigins.push(origin);
      }
    });
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true
  })
);

app.use(
  morgan("dev", {
    stream: { write: (message) => logger.http(message.trim()) }
  })
);

app.get("/", (req, res) => {
  res.send("The server is running bro.");
});

app.use("/api/v1", districtRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`The server is Listening at http://localhost:${PORT}`);
});