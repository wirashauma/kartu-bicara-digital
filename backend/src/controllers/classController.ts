import { Request, Response } from "express";
import { memoryStore } from "../data/memoryStore.js";

export const getClasses = (req: Request, res: Response) => {
  const classes = memoryStore.getAllClassrooms();
  res.json({ success: true, data: classes });
};

export const getClassById = (req: Request, res: Response) => {
  const id = String(req.params.id);
  const classroom = memoryStore.getClassroomById(id);

  if (!classroom) {
    return res.status(404).json({ success: false, message: "Kelas tidak ditemukan" });
  }

  res.json({ success: true, data: classroom });
};

export const getClassByPin = (req: Request, res: Response) => {
  const pin = String(req.params.pin);
  const classroom = memoryStore.getClassroomByPin(pin);

  if (!classroom) {
    return res.status(404).json({ success: false, message: "Kode PIN kelas tidak valid" });
  }

  res.json({ success: true, data: classroom });
};

export const createClass = (req: Request, res: Response) => {
  const { name, subject, topic, grade, tokensPerStudent, speechTimeLimitSeconds } = req.body;

  if (!name || !subject) {
    return res.status(400).json({ success: false, message: "Nama kelas dan mata pelajaran wajib diisi" });
  }

  const newClass = memoryStore.createClassroom({
    name,
    subject,
    topic,
    grade,
    tokensPerStudent: tokensPerStudent ? Number(tokensPerStudent) : 3,
    speechTimeLimitSeconds: speechTimeLimitSeconds ? Number(speechTimeLimitSeconds) : 60,
  });

  res.status(201).json({ success: true, message: "Kelas berhasil dibuat", data: newClass });
};

export const updateClass = (req: Request, res: Response) => {
  const id = String(req.params.id);
  const updated = memoryStore.updateClassroom(id, req.body);

  if (!updated) {
    return res.status(404).json({ success: false, message: "Kelas tidak ditemukan" });
  }

  res.json({ success: true, message: "Pengaturan kelas berhasil diperbarui", data: updated });
};

export const deleteClass = (req: Request, res: Response) => {
  const id = String(req.params.id);
  const success = memoryStore.deleteClassroom(id);

  if (!success) {
    return res.status(404).json({ success: false, message: "Kelas tidak ditemukan" });
  }

  res.json({ success: true, message: "Kelas berhasil dihapus" });
};

export const resetClass = (req: Request, res: Response) => {
  const id = String(req.params.id);
  const resetClassroom = memoryStore.resetClassroomSession(id);

  if (!resetClassroom) {
    return res.status(404).json({ success: false, message: "Kelas tidak ditemukan" });
  }

  res.json({ success: true, message: "Sesi kelas berhasil direset ke kondisi awal", data: resetClassroom });
};
