import { Request, Response } from "express";
import { memoryStore } from "../data/memoryStore.js";
import { TokenType } from "../types/session.js";

export const getActiveSpeaker = (req: Request, res: Response) => {
  const classId = String(req.params.classId);
  const speaker = memoryStore.getActiveSpeaker(classId);
  res.json({ success: true, data: speaker });
};

export const startSpeaker = (req: Request, res: Response) => {
  const classId = String(req.params.classId);
  const { studentId, tokenType, allocatedSeconds } = req.body;

  if (!studentId || !tokenType) {
    return res.status(400).json({ success: false, message: "studentId dan tokenType wajib diisi" });
  }

  const validTypes: TokenType[] = ["BERTANYA", "MENJAWAB", "BERPENDAPAT", "MENANGGAPI"];
  if (!validTypes.includes(tokenType)) {
    return res.status(400).json({ success: false, message: "Tipe kartu bicara tidak valid" });
  }

  const speaker = memoryStore.startSpeaker(classId, {
    studentId,
    tokenType,
    allocatedSeconds: allocatedSeconds ? Number(allocatedSeconds) : undefined,
  });

  if (!speaker) {
    return res.status(400).json({
      success: false,
      message: "Gagal memulai giliran bicara. Pastikan kuota token siswa masih tersedia.",
    });
  }

  res.json({ success: true, message: "Giliran bicara dimulai", data: speaker });
};

export const pauseSpeaker = (req: Request, res: Response) => {
  const classId = String(req.params.classId);
  const speaker = memoryStore.pauseSpeaker(classId);

  if (!speaker) {
    return res.status(404).json({ success: false, message: "Tidak ada pembicara aktif di kelas ini" });
  }

  res.json({ success: true, message: "Timer bicara dijeda", data: speaker });
};

export const resumeSpeaker = (req: Request, res: Response) => {
  const classId = String(req.params.classId);
  const speaker = memoryStore.resumeSpeaker(classId);

  if (!speaker) {
    return res.status(404).json({ success: false, message: "Tidak ada pembicara aktif di kelas ini" });
  }

  res.json({ success: true, message: "Timer bicara dilanjutkan", data: speaker });
};

export const extendSpeaker = (req: Request, res: Response) => {
  const classId = String(req.params.classId);
  const { extraSeconds } = req.body;

  const seconds = extraSeconds ? Number(extraSeconds) : 15;
  const speaker = memoryStore.extendSpeaker(classId, seconds);

  if (!speaker) {
    return res.status(404).json({ success: false, message: "Tidak ada pembicara aktif di kelas ini" });
  }

  res.json({ success: true, message: `Waktu bicara ditambah ${seconds} detik`, data: speaker });
};

export const finishSpeaker = (req: Request, res: Response) => {
  const classId = String(req.params.classId);
  const { durationSeconds } = req.body || {};
  const result = memoryStore.finishSpeaker(
    classId,
    durationSeconds !== undefined ? Number(durationSeconds) : undefined
  );

  if (!result.student) {
    return res.status(404).json({ success: false, message: "Tidak ada sesi bicara aktif untuk diselesaikan" });
  }

  res.json({
    success: true,
    message: "Giliran bicara selesai. Token berhasil dicatat.",
    data: result,
  });
};
