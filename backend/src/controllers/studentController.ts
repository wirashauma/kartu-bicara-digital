import { Request, Response } from "express";
import { memoryStore } from "../data/memoryStore.js";

export const getStudents = (req: Request, res: Response) => {
  const classId = String(req.params.classId);
  const classroom = memoryStore.getClassroomById(classId);

  if (!classroom) {
    return res.status(404).json({ success: false, message: "Kelas tidak ditemukan" });
  }

  res.json({ success: true, data: classroom.students });
};

export const addStudent = (req: Request, res: Response) => {
  const classId = String(req.params.classId);
  const { name, deskNumber, tokensQuota } = req.body;

  if (!name || deskNumber === undefined) {
    return res.status(400).json({ success: false, message: "Nama dan nomor urut siswa wajib diisi" });
  }

  const newStudent = memoryStore.addStudent(classId, {
    name: String(name).trim(),
    deskNumber: Number(deskNumber),
    tokensQuota: tokensQuota ? Number(tokensQuota) : undefined,
  });

  if (!newStudent) {
    return res.status(404).json({ success: false, message: "Kelas tidak ditemukan" });
  }

  res.status(201).json({ success: true, message: "Siswa berhasil ditambahkan", data: newStudent });
};

export const deleteStudent = (req: Request, res: Response) => {
  const classId = String(req.params.classId);
  const studentId = String(req.params.studentId);
  const success = memoryStore.deleteStudent(classId, studentId);

  if (!success) {
    return res.status(404).json({ success: false, message: "Siswa atau kelas tidak ditemukan" });
  }

  res.json({ success: true, message: "Siswa berhasil dihapus dari kelas" });
};
