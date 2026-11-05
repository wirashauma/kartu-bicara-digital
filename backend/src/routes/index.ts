import { Router } from "express";
import classRoutes from "./classRoutes.js";
import profileRoutes from "./profileRoutes.js";
import authRoutes from "./authRoutes.js";

const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/classes", classRoutes);
apiRouter.use("/profile", profileRoutes);

// Health check endpoint
apiRouter.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: Math.floor(process.uptime()),
    service: "Kartu Bicara Digital API",
    model: "Time Token Arends",
    database: "PostgreSQL Supabase (Prisma)",
    timestamp: new Date().toISOString(),
  });
});

export default apiRouter;

