import { Router } from "express";
import classRoutes from "./classRoutes.js";
import profileRoutes from "./profileRoutes.js";

const apiRouter = Router();

apiRouter.use("/classes", classRoutes);
apiRouter.use("/profile", profileRoutes);

// Health check endpoint
apiRouter.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Kartu Bicara Digital API",
    model: "Time Token Arends",
    timestamp: new Date().toISOString(),
  });
});

export default apiRouter;

