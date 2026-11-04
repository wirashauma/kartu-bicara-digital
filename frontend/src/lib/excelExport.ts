import XLSX from "xlsx-js-style";
import { ClassRoom, ClassStats, Student, Token, TOKEN_DEFINITIONS } from "@/types/session";
import { AuthUser } from "@/lib/auth";

export interface ExportExcelParams {
  currentClass: ClassRoom | null;
  stats: ClassStats;
  students: Student[];
  allUsedTokens: Token[];
  currentUser: AuthUser | null;
}

export function exportClassDiscussionToExcel({
  currentClass,
  stats,
  students,
  allUsedTokens,
  currentUser,
}: ExportExcelParams): void {
  const className = currentClass?.name || "Kelas";
  const topic = currentClass?.topic || "Diskusi Terbuka Model Arends";
  const subject = currentClass?.subject || "Umum";
  const tokensPerStudent = currentClass?.tokensPerStudent || 3;
  const teacherName = currentUser?.name || "Dra. Sri Wahyuni, M.Pd.";

  const today = new Date();
  const dateFormatted = today.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeFormatted = today.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const wb = XLSX.utils.book_new();

  // =========================================================================
  // 1. DATA SHEET: REKAP KEAKTIFAN SISWA
  // =========================================================================
  const ws: XLSX.WorkSheet = {};

  // Definisi Style Elegan
  const titleStyle1 = {
    font: { name: "Calibri", sz: 14, bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "0284C7" } }, // Sky 600
    alignment: { vertical: "center", horizontal: "center" },
  };

  const titleStyle2 = {
    font: { name: "Calibri", sz: 10, bold: true, color: { rgb: "E0F2FE" } },
    fill: { fgColor: { rgb: "0369A1" } }, // Sky 700
    alignment: { vertical: "center", horizontal: "center" },
  };

  const metaStyle1 = {
    font: { name: "Calibri", sz: 10, bold: true, color: { rgb: "0369A1" } },
    fill: { fgColor: { rgb: "F0F9FF" } }, // Sky 50
    alignment: { vertical: "center", horizontal: "center" },
    border: {
      bottom: { style: "thin", color: { rgb: "BAE6FD" } },
    },
  };

  const metaStyle2 = {
    font: { name: "Calibri", sz: 9, italic: true, color: { rgb: "475569" } },
    fill: { fgColor: { rgb: "F8FAFC" } },
    alignment: { vertical: "center", horizontal: "center" },
    border: {
      bottom: { style: "thin", color: { rgb: "E2E8F0" } },
    },
  };

  const tableHeaderStyle = {
    font: { name: "Calibri", sz: 11, bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "0284C7" } }, // Sky 600
    alignment: { vertical: "center", horizontal: "center", wrapText: true },
    border: {
      top: { style: "medium", color: { rgb: "0369A1" } },
      bottom: { style: "medium", color: { rgb: "0369A1" } },
      left: { style: "thin", color: { rgb: "38BDF8" } },
      right: { style: "thin", color: { rgb: "38BDF8" } },
    },
  };

  const borderThin = {
    top: { style: "thin", color: { rgb: "E2E8F0" } },
    bottom: { style: "thin", color: { rgb: "E2E8F0" } },
    left: { style: "thin", color: { rgb: "E2E8F0" } },
    right: { style: "thin", color: { rgb: "E2E8F0" } },
  };

  const cellCenter = (bg: string) => ({
    font: { name: "Calibri", sz: 10, color: { rgb: "1E293B" } },
    fill: { fgColor: { rgb: bg } },
    alignment: { vertical: "center", horizontal: "center" },
    border: borderThin,
  });

  const cellLeft = (bg: string) => ({
    font: { name: "Calibri", sz: 10, color: { rgb: "1E293B" } },
    fill: { fgColor: { rgb: bg } },
    alignment: { vertical: "center", horizontal: "left" },
    border: borderThin,
  });

  const cellActiveStatus = {
    font: { name: "Calibri", sz: 10, bold: true, color: { rgb: "065F46" } }, // Emerald 800
    fill: { fgColor: { rgb: "ECFDF5" } }, // Emerald 50
    alignment: { vertical: "center", horizontal: "center" },
    border: borderThin,
  };

  const cellIdleStatus = {
    font: { name: "Calibri", sz: 10, bold: true, color: { rgb: "92400E" } }, // Amber 800
    fill: { fgColor: { rgb: "FFFBEB" } }, // Amber 50
    alignment: { vertical: "center", horizontal: "center" },
    border: borderThin,
  };

  const totalRowStyle = {
    font: { name: "Calibri", sz: 10, bold: true, color: { rgb: "0369A1" } },
    fill: { fgColor: { rgb: "E0F2FE" } }, // Sky 100
    alignment: { vertical: "center", horizontal: "center" },
    border: {
      top: { style: "medium", color: { rgb: "0284C7" } },
      bottom: { style: "medium", color: { rgb: "0284C7" } },
      left: { style: "thin", color: { rgb: "BAE6FD" } },
      right: { style: "thin", color: { rgb: "BAE6FD" } },
    },
  };

  // Helper untuk set cell value & style
  const setCell = (r: number, c: number, v: string | number, style: any, type: "s" | "n" = "s") => {
    const cellRef = XLSX.utils.encode_cell({ r, c });
    ws[cellRef] = { v, t: type, s: style };
  };

  // BARIS 1: JUDUL UTAMA (Merged A1:H1)
  setCell(0, 0, "LAPORAN KEAKTIFAN SISWA - KARTU BICARA DIGITAL", titleStyle1);

  // BARIS 2: SUB-JUDUL MODEL ARENDS (Merged A2:H2)
  setCell(1, 0, "MODEL PEMBELAJARAN KOOPERATIF TIME TOKEN ARENDS", titleStyle2);

  // BARIS 3: INFORMASI KELAS (Merged A3:H3)
  setCell(
    2,
    0,
    `Kelas: ${className}   |   Mata Pelajaran: ${subject}   |   Topik: ${topic}   |   Pendidik: ${teacherName}`,
    metaStyle1
  );

  // BARIS 4: STATISTIK & WAKTU (Merged A4:H4)
  setCell(
    3,
    0,
    `Waktu Unduh: ${dateFormatted}, ${timeFormatted} WIB   |   Partisipasi: ${stats.studentsSpokenCount}/${stats.totalStudents} Siswa (${stats.participationRate}%)   |   Belum Bicara: ${stats.studentsIdleCount} Siswa`,
    metaStyle2
  );

  // BARIS 5: Kosong sebagai pemisah visual

  // BARIS 6: HEADER TABEL DATA SISWA (r: 5)
  const headers = [
    "No",
    "No. Meja",
    "Nama Siswa",
    "Status Keaktifan",
    "Token Terpakai",
    "Total Bicara (detik)",
    "Jenis Kartu",
    "Pemakaian Terakhir",
  ];

  headers.forEach((h, cIdx) => {
    setCell(5, cIdx, h, tableHeaderStyle);
  });

  // Urutkan siswa berdasarkan nomor meja
  const sortedStudents = [...students].sort((a, b) => a.deskNumber - b.deskNumber);

  // BARIS 7 dst: DATA SISWA
  let rowIdx = 6;
  let totalSpeakingSecondsSum = 0;

  sortedStudents.forEach((student, sIdx) => {
    const quota = student.tokensQuota || tokensPerStudent;
    const remaining = student.remainingTokens;
    const usedCount = Math.max(0, quota - remaining);
    const hasSpoken = student.hasSpoken || usedCount > 0;
    const totalSecs = student.totalSpeakingTimeSeconds || 0;
    totalSpeakingSecondsSum += totalSecs;

    // Rincian jenis kartu yang dipakai
    const cardTypeCounts: Record<string, number> = {};
    if (student.usedTokens && student.usedTokens.length > 0) {
      student.usedTokens.forEach((t) => {
        const label = TOKEN_DEFINITIONS[t.type]?.label || t.type;
        cardTypeCounts[label] = (cardTypeCounts[label] || 0) + 1;
      });
    }

    const cardDetails =
      Object.keys(cardTypeCounts).length > 0
        ? Object.entries(cardTypeCounts)
            .map(([label, count]) => `${label} (${count})`)
            .join(", ")
        : "-";

    // Waktu pemakaian terakhir
    let lastSpokenText = "-";
    if (student.usedTokens && student.usedTokens.length > 0) {
      const lastToken = student.usedTokens[student.usedTokens.length - 1];
      if (lastToken?.usedAt) {
        lastSpokenText = new Date(lastToken.usedAt).toLocaleTimeString("id-ID");
      }
    }

    const rowBg = sIdx % 2 === 0 ? "FFFFFF" : "F8FAFC"; // Zebra striping

    setCell(rowIdx, 0, sIdx + 1, cellCenter(rowBg), "n");
    setCell(rowIdx, 1, `Meja #${student.deskNumber}`, cellCenter(rowBg));
    setCell(rowIdx, 2, student.name, cellLeft(rowBg));
    setCell(
      rowIdx,
      3,
      hasSpoken ? "Sudah Berbicara" : "Belum Berbicara",
      hasSpoken ? cellActiveStatus : cellIdleStatus
    );
    setCell(rowIdx, 4, `${usedCount}/${quota}`, cellCenter(rowBg));
    setCell(rowIdx, 5, totalSecs, cellCenter(rowBg), "n");
    setCell(rowIdx, 6, cardDetails, cellLeft(rowBg));
    setCell(rowIdx, 7, lastSpokenText, cellCenter(rowBg));

    rowIdx++;
  });

  // BARIS TOTAL
  setCell(rowIdx, 0, "TOTAL KELAS", totalRowStyle);
  setCell(rowIdx, 1, "", totalRowStyle);
  setCell(rowIdx, 2, `${stats.totalStudents} Siswa Terdaftar`, totalRowStyle);
  setCell(rowIdx, 3, `${stats.studentsSpokenCount} Siswa Aktif (${stats.participationRate}%)`, totalRowStyle);
  setCell(rowIdx, 4, `${stats.totalTokensUsed}/${stats.totalTokensAllocated}`, totalRowStyle);
  setCell(rowIdx, 5, totalSpeakingSecondsSum, totalRowStyle, "n");
  setCell(rowIdx, 6, `Rata-rata: ${stats.totalTokensUsed > 0 ? Math.round(totalSpeakingSecondsSum / stats.totalTokensUsed) : 0}s/kartu`, totalRowStyle);
  setCell(rowIdx, 7, `Keadilan: ${Math.round(50 + stats.participationRate * 0.5)}/100`, totalRowStyle);

  // Range Sheet
  ws["!ref"] = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: rowIdx, c: 7 },
  });

  // Merges untuk Kop Header
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }, // Row 1: Judul Utama
    { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } }, // Row 2: Model Arends
    { s: { r: 2, c: 0 }, e: { r: 2, c: 7 } }, // Row 3: Info Kelas
    { s: { r: 3, c: 0 }, e: { r: 3, c: 7 } }, // Row 4: Waktu & Statistik
    { s: { r: rowIdx, c: 0 }, e: { r: rowIdx, c: 1 } }, // Row Total: Merge No & No Meja
  ];

  // Lebar Kolom Proporsional (Anti-Terpotong)
  ws["!cols"] = [
    { wch: 6 }, // A: No
    { wch: 12 }, // B: No. Meja
    { wch: 28 }, // C: Nama Siswa
    { wch: 18 }, // D: Status Keaktifan
    { wch: 16 }, // E: Token Terpakai
    { wch: 22 }, // F: Total Bicara (detik)
    { wch: 32 }, // G: Jenis Kartu
    { wch: 20 }, // H: Pemakaian Terakhir
  ];

  // Tinggi Baris
  ws["!rows"] = [
    { hpt: 28 }, // Row 1: Judul
    { hpt: 20 }, // Row 2: Sub-judul
    { hpt: 22 }, // Row 3: Meta 1
    { hpt: 20 }, // Row 4: Meta 2
    { hpt: 12 }, // Row 5: Blank
    { hpt: 26 }, // Row 6: Header Table
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Rekap Keaktifan Siswa");

  // =========================================================================
  // 2. SHEET 2: LOG KRONOLOGIS TRANSAKSI KARTU (TIMELINE)
  // =========================================================================
  const ws2Data: (string | number)[][] = [
    ["LOG KRONOLOGIS TRANSAKSI KARTU BICARA"],
    [`Kelas: ${className}   |   Topik: ${topic}   |   Total Transaksi: ${allUsedTokens.length} kali`],
    [],
    ["No", "Waktu Transaksi", "Nama Siswa", "No. Meja", "Kategori Kartu", "Durasi Bicara (detik)", "Keterangan Taksonomi"],
  ];

  if (allUsedTokens.length > 0) {
    allUsedTokens.forEach((tok, idx) => {
      const def = TOKEN_DEFINITIONS[tok.type];
      ws2Data.push([
        idx + 1,
        new Date(tok.usedAt).toLocaleTimeString("id-ID") + " WIB",
        tok.studentName,
        `Meja #${tok.deskNumber || "-"}`,
        def?.label || tok.type,
        tok.durationSeconds,
        def?.description || "-",
      ]);
    });
  } else {
    ws2Data.push(["-", "-", "Belum ada riwayat transaksi kartu pada sesi ini.", "-", "-", "-", "-"]);
  }

  const ws2 = XLSX.utils.aoa_to_sheet(ws2Data);
  ws2["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } },
  ];
  ws2["!cols"] = [
    { wch: 6 },
    { wch: 20 },
    { wch: 28 },
    { wch: 12 },
    { wch: 20 },
    { wch: 22 },
    { wch: 50 },
  ];
  XLSX.utils.book_append_sheet(wb, ws2, "Log Riwayat Transaksi");

  // Format Nama File Elegan
  const safeClassName = className.replace(/[^a-zA-Z0-9]/g, "_");
  const dateStr = today.toISOString().split("T")[0];
  const fileName = `Rekap_Diskusi_${safeClassName}_${dateStr}.xlsx`;

  // Tulis berkas Excel
  XLSX.writeFile(wb, fileName);
}
