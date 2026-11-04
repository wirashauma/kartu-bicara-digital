import { Request, Response } from "express";
import * as XLSX from "xlsx";
import { memoryStore } from "../data/memoryStore.js";
import { TokenType, TOKEN_DEFINITIONS } from "../types/session.js";

export const exportClassExcel = (req: Request, res: Response) => {
  const classId = String(req.params.classId);
  const classroom = memoryStore.getClassroomById(classId);

  if (!classroom) {
    return res.status(404).json({ success: false, message: "Kelas tidak ditemukan" });
  }

  const profile = memoryStore.getEducatorProfile();
  const stats = memoryStore.getClassStats(classId);

  // Buat rows data
  const rows: (string | number)[][] = [
    ["LAPORAN REKAP KEAKTIFAN SISWA - KARTU BICARA DIGITAL"],
    ["IMPLEMENTASI MODEL PEMBELAJARAN KOOPERATIF TIME TOKEN ARENDS"],
    [],
    ["INFORMASI SESI DISKUSI"],
    ["Nama Kelas", classroom.name, "", "Guru / Pendidik", profile.name],
    ["Topik Diskusi", classroom.topic || "-", "", "Mata Pelajaran", classroom.subject],
    ["Kode Sesi PIN", `#${classroom.sessionPin}`, "", "Kuota Standar", `${classroom.tokensPerStudent} Kartu / Siswa`],
    [
      "Ringkasan Sesi",
      stats
        ? `${stats.studentsSpokenCount} dari ${stats.totalStudents} Siswa Aktif (${stats.participationRate}%)`
        : "-",
      "",
      "Total Token Terpakai",
      stats ? `${stats.totalTokensUsed} Kartu` : "-",
    ],
    [],
    [
      "No",
      "Nomor Siswa",
      "Nama Lengkap Siswa",
      "Status Keaktifan",
      "Token Terpakai",
      "Sisa Token",
      "Total Durasi Bicara (detik)",
      "Rincian Kartu yang Digunakan",
      "Waktu Bicara Terakhir",
    ],
  ];

  classroom.students.forEach((student, idx) => {
    // Format rincian token
    const tokenCounts: Record<TokenType, number> = {
      BERTANYA: 0,
      MENJAWAB: 0,
      BERPENDAPAT: 0,
      MENANGGAPI: 0,
    };
    student.usedTokens.forEach((t) => {
      if (tokenCounts[t.type] !== undefined) {
        tokenCounts[t.type] += 1;
      }
    });

    const breakdownStr = (["BERTANYA", "MENJAWAB", "BERPENDAPAT", "MENANGGAPI"] as TokenType[])
      .filter((type) => tokenCounts[type] > 0)
      .map((type) => `${TOKEN_DEFINITIONS[type].label} (${tokenCounts[type]})`)
      .join(", ") || "-";

    const lastTimeStr = student.lastSpokeAt
      ? new Date(student.lastSpokeAt).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }) + " WIB"
      : "-";

    rows.push([
      idx + 1,
      `#${student.deskNumber}`,
      student.name,
      student.usedTokens.length > 0 ? "Sudah Berbicara" : "Belum Berbicara",
      `${student.usedTokens.length}/${student.tokensQuota}`,
      student.remainingTokens,
      student.totalSpeakingTimeSeconds,
      breakdownStr,
      lastTimeStr,
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Set lebar kolom
  ws["!cols"] = [
    { wch: 6 },
    { wch: 14 },
    { wch: 30 },
    { wch: 18 },
    { wch: 16 },
    { wch: 12 },
    { wch: 26 },
    { wch: 40 },
    { wch: 22 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Rekap Keaktifan");

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  const safeClassName = classroom.name.replace(/[^a-zA-Z0-9]/g, "_");
  const filename = `Rekap_Diskusi_${safeClassName}_${new Date().toISOString().slice(0, 10)}.xlsx`;

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(buffer);
};
