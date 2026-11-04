import { Request, Response } from "express";
import { memoryStore } from "../data/memoryStore.js";
import { Token } from "../types/session.js";

export const getClassStats = (req: Request, res: Response) => {
  const classId = String(req.params.classId);
  const stats = memoryStore.getClassStats(classId);

  if (!stats) {
    return res.status(404).json({ success: false, message: "Kelas tidak ditemukan" });
  }

  res.json({ success: true, data: stats });
};

export const getClassTokens = (req: Request, res: Response) => {
  const classId = String(req.params.classId);
  const classroom = memoryStore.getClassroomById(classId);

  if (!classroom) {
    return res.status(404).json({ success: false, message: "Kelas tidak ditemukan" });
  }

  const { type } = req.query;
  const allTokens: Token[] = classroom.students.flatMap((s) => s.usedTokens);
  allTokens.sort((a, b) => new Date(b.usedAt).getTime() - new Date(a.usedAt).getTime());

  const filtered = type
    ? allTokens.filter((t) => t.type === String(type).toUpperCase())
    : allTokens;

  res.json({
    success: true,
    total: filtered.length,
    data: filtered,
  });
};
