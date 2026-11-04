import { Request, Response } from "express";
import { memoryStore } from "../data/memoryStore.js";

export const getProfile = (req: Request, res: Response) => {
  const profile = memoryStore.getEducatorProfile();
  res.json({ success: true, data: profile });
};

export const updateProfile = (req: Request, res: Response) => {
  const updated = memoryStore.updateEducatorProfile(req.body);
  res.json({ success: true, message: "Profil berhasil diperbarui", data: updated });
};

