import { Router } from "express";
import {
  login,
  register,
  getMe,
  getUsers,
  getSeedUsers,
} from "../controllers/authController.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", getMe);
router.get("/users", getUsers);
router.get("/seed-users", getSeedUsers);

export default router;

