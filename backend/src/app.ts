import express, { Application, Request, Response } from "express";
import cors from "cors";
import apiRouter from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { config } from "./config/index.js";

const app: Application = express();

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman) or matching origin
      if (
        !origin ||
        config.corsAllowedOrigins.includes(origin) ||
        origin.includes("localhost") ||
        origin === config.clientOrigin
      ) {
        callback(null, true);
      } else if (config.nodeEnv !== "production") {
        callback(null, true); // Permissive in dev
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger in Development
if (config.nodeEnv !== "production") {
  app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
  });
}

// API Routes
app.use("/api", apiRouter);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.json({
    name: "Kartu Bicara Digital API",
    version: "1.0.0",
    docs: "/api/health",
  });
});

// 404 Not Found Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Rute ${req.method} ${req.originalUrl} tidak ditemukan`,
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;

