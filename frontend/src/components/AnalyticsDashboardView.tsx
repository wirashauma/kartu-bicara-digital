"use client";

import React, { useMemo } from "react";
import {
  Users,
  AlertTriangle,
  Coins,
  Clock,
  ChevronRight,
  Flame,
  UserX,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";
import {
  ClassStats,
  Student,
  ClassRoom,
  Token,
  TokenType,
  TOKEN_DEFINITIONS,
} from "@/types/session";
import { AuthUser } from "@/lib/auth";
import { TokenBadge } from "@/components/TokenBadge";
import { exportClassDiscussionToExcel } from "@/lib/excelExport";
import { cn } from "@/lib/utils";

export interface AnalyticsDashboardViewProps {
  stats: ClassStats;
  students: Student[];
  currentClass: ClassRoom | null;
  allUsedTokens: Token[];
  currentUser?: AuthUser | null;
  onCallStudent?: (student: Student) => void;
  onSwitchToTimeline?: () => void;
}

export function AnalyticsDashboardView({
  stats,
  students,
  currentClass,
  allUsedTokens,
  currentUser,
  onCallStudent,
  onSwitchToTimeline,
}: AnalyticsDashboardViewProps) {
  // Hitung total detik bicara akumulatif seluruh kelas
  const totalSpeakingSeconds = useMemo(() => {
    return allUsedTokens.reduce((acc, curr) => acc + (curr.durationSeconds || 0), 0);
  }, [allUsedTokens]);

  // Format durasi detik ke format menit dan detik yang mudah dibaca orang awam
  const formatMinutesSeconds = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs} detik`;
    return `${mins} menit ${secs > 0 ? `${secs} detik` : ""}`;
  };

  // Rata-rata durasi per kartu terpakai
  const averageDuration = useMemo(() => {
    if (allUsedTokens.length === 0) return 0;
    return Math.round(totalSpeakingSeconds / allUsedTokens.length);
  }, [allUsedTokens, totalSpeakingSeconds]);

  // Daftar Siswa Paling Aktif (Top Kontributor)
  const topActiveStudents = useMemo(() => {
    return [...students]
      .filter((s) => s.hasSpoken || (s.usedTokens && s.usedTokens.length > 0))
      .sort((a, b) => (b.usedTokens?.length || 0) - (a.usedTokens?.length || 0))
      .slice(0, 4);
  }, [students]);

  // Daftar Siswa Belum Berbicara (Perlu Didorong)
  const idleStudents = useMemo(() => {
    return students.filter((s) => !s.hasSpoken || (s.usedTokens && s.usedTokens.length === 0));
  }, [students]);

  // Indeks Keadilan Giliran (Fairness Index: 0 - 100)
  const fairnessIndex = useMemo(() => {
    if (stats.totalStudents === 0) return 100;
    const base = stats.participationRate;
    return Math.min(100, Math.round(50 + base * 0.5));
  }, [stats.participationRate, stats.totalStudents]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* ======================================================== */}
      {/* 1. HEADER BANNER KELAS (Ringkas, Bersih & Lapang)        */}
      {/* ======================================================== */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-sky-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold border border-sky-200/80">
              Laporan Evaluasi Pembelajaran
            </span>
            <span className="text-xs text-slate-300">•</span>
            <span className="text-xs font-semibold text-slate-500">
              Model Time Token Arends
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Statistik Keaktifan: {currentClass?.name || "Kelas"}
          </h2>

          <p className="text-xs sm:text-sm text-slate-500">
            Topik:{" "}
            <span className="font-semibold text-slate-800">
              {currentClass?.topic || "Diskusi Terbuka"}
            </span>{" "}
            · Mata Pelajaran: {currentClass?.subject || "-"}
          </p>
        </div>

        {/* Tombol Aksi: Ekspor Excel & Riwayat */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 sm:pt-0">
          <button
            type="button"
            onClick={() =>
              exportClassDiscussionToExcel({
                currentClass,
                stats,
                students,
                allUsedTokens,
                currentUser: currentUser || null,
              })
            }
            className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 font-bold text-xs flex items-center gap-2 transition-all shadow-2xs hover:shadow-xs group"
            title="Unduh rekap keaktifan siswa format Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            <span>Ekspor Excel (.xlsx)</span>
          </button>

          {onSwitchToTimeline && (
            <button
              type="button"
              onClick={onSwitchToTimeline}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-sm"
            >
              <span>Lihat Log Riwayat</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. TOP 4 METRIC KPI CARDS (Spacious, Clean & Visual)     */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* KPI 1: Tingkat Partisipasi dengan Radial Ring Visual */}
        <div className="p-5 sm:p-6 bg-white rounded-3xl border border-sky-100 shadow-2xs flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 block">
              Tingkat Partisipasi
            </span>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {stats.participationRate}%
            </div>
            <span className="text-[11px] font-semibold text-sky-700 block">
              {stats.studentsSpokenCount} dari {stats.totalStudents} Siswa Aktif
            </span>
          </div>

          {/* SVG Donut Ring Mini */}
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-sky-600 transition-all duration-500"
                strokeDasharray={`${stats.participationRate}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-[10px] font-black text-slate-700">
              {stats.participationRate}%
            </div>
          </div>
        </div>

        {/* KPI 2: Siswa Belum Berbicara */}
        <div className="p-5 sm:p-6 bg-white rounded-3xl border border-sky-100 shadow-2xs flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <span>Siswa Belum Bicara</span>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-amber-600 tracking-tight">
              {stats.studentsIdleCount}
            </div>
            <span className="text-[11px] font-semibold text-amber-600 block">
              Prioritas giliran berikutnya
            </span>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60 shadow-2xs shrink-0">
            <UserX className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3: Rata-Rata Waktu Bicara */}
        <div className="p-5 sm:p-6 bg-white rounded-3xl border border-sky-100 shadow-2xs flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 block">
              Rata-Rata Durasi Bicara
            </span>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {averageDuration}s
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 block">
              Total {formatMinutesSeconds(totalSpeakingSeconds)} sesi
            </span>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/60 shadow-2xs shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4: Kuota Token Terpakai */}
        <div className="p-5 sm:p-6 bg-white rounded-3xl border border-sky-100 shadow-2xs flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-500 block">
              Token Kartu Terpakai
            </span>
            <div className="text-3xl font-black text-slate-900 tracking-tight">
              {stats.totalTokensUsed}{" "}
              <span className="text-xs font-bold text-slate-400">
                / {stats.totalTokensAllocated}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-sky-700 block">
              {stats.totalTokensRemaining} token masih tersisa
            </span>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-200/60 shadow-2xs shrink-0">
            <Coins className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. DUA GRAFIK UTAMA: TAKSONOMI & KESETARAAN DISKUSI       */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRAFIK A: DIAGRAM BATANG 4 TAKSONOMI BICARA (Bersih, Rapi & Tidak Menumpuk) */}
        <div className="lg:col-span-2 p-6 sm:p-7 bg-white rounded-3xl border border-sky-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-sky-50 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Grafik Distribusi 4 Kategori Kartu Bicara (Arends)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Memperlihatkan ragam keterampilan berpikir kritis yang telah dipraktikkan siswa
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-sky-50 text-sky-800 border border-sky-100">
              Total {stats.totalTokensUsed} Kontribusi
            </span>
          </div>

          {/* Batang Progresif Interaktif per Kategori dengan Ruang Longgar */}
          <div className="space-y-5 pt-1">
            {(
              [
                "BERTANYA",
                "MENJAWAB",
                "BERPENDAPAT",
                "MENANGGAPI",
              ] as TokenType[]
            ).map((type) => {
              const def = TOKEN_DEFINITIONS[type];
              const count = stats.distributionByType[type] || 0;
              const percentage =
                stats.totalTokensUsed > 0
                  ? Math.round((count / stats.totalTokensUsed) * 100)
                  : 0;

              return (
                <div key={type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <TokenBadge type={type} size="sm" />

                    <div className="flex items-baseline gap-2 font-mono">
                      <span className="text-sm font-black text-slate-900">
                        {count} kali
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        ({percentage}%)
                      </span>
                    </div>
                  </div>

                  {/* Visual Bar Progres yang Luas & Mulus */}
                  <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        def.solidBgClass
                      )}
                      style={{
                        width: `${Math.max(percentage > 0 ? 3 : 0, percentage)}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* GRAFIK B: INDEKS KEADILAN & KESETARAAN BICARA */}
        <div className="p-6 sm:p-7 bg-white rounded-3xl border border-sky-100 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="border-b border-sky-50 pb-4">
            <h3 className="text-base font-bold text-slate-900">
              Indeks Keadilan Giliran
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Mengukur tingkat demokrasi dan kesetaraan hak bicara
            </p>
          </div>

          {/* Visual Gauge Skor Keadilan */}
          <div className="text-center py-3 space-y-3">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-sky-500 to-emerald-400 p-1.5 shadow-md">
                <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-slate-900 tracking-tight font-mono">
                    {fairnessIndex}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                    Skor / 100
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-700 block flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {fairnessIndex >= 75
                  ? "Tingkat Kesetaraan Sangat Baik"
                  : "Partisipasi Masih Terpusat"}
              </span>
              <p className="text-[11px] text-slate-400 max-w-[220px] mx-auto leading-relaxed">
                Sistem kartu kuota sukses mencegah monopoli pembicara dominan di kelas.
              </p>
            </div>
          </div>

          {/* Rasio Dua Warna (Siswa Aktif vs Siswa Belum Bicara) */}
          <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-sky-800 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                Aktif: {stats.studentsSpokenCount} Siswa
              </span>
              <span className="text-amber-700 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Belum: {stats.studentsIdleCount} Siswa
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-amber-100 overflow-hidden flex">
              <div
                className="bg-sky-600 h-full transition-all duration-500"
                style={{ width: `${stats.participationRate}%` }}
                title={`Aktif: ${stats.participationRate}%`}
              />
              <div
                className="bg-amber-400 h-full transition-all duration-500"
                style={{ width: `${100 - stats.participationRate}%` }}
                title={`Belum Bicara: ${100 - stats.participationRate}%`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. TABEL & CARD KOMPARASI SISWA: AKTIF VS PRIORITAS PANGGIL */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* KOLOM KIRI: SISWA PALING AKTIF (TOP KONTRIBUTOR) */}
        <div className="p-6 sm:p-7 bg-white rounded-3xl border border-sky-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-sky-50 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
                <Flame className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Siswa Paling Aktif (Top Kontributor)
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Siswa yang telah memanfaatkan kuota kartu bicaranya
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-xl">
              {topActiveStudents.length} Siswa
            </span>
          </div>

          <div className="space-y-3">
            {topActiveStudents.length > 0 ? (
              topActiveStudents.map((student, idx) => (
                <div
                  key={student.id}
                  className="p-3.5 sm:p-4 rounded-2xl bg-sky-50/30 border border-sky-100/80 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-white border border-sky-200 text-sky-800 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                      #{idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {student.name}
                      </h4>
                      <span className="text-[11px] text-slate-400">
                        Meja #{student.deskNumber} · Sisa {student.remainingTokens} token
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-sky-800 bg-white px-3 py-1 rounded-lg border border-sky-100 block">
                      {student.usedTokens?.length || 0} Kartu
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                      {student.totalSpeakingTimeSeconds || 0}s bicara
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                Belum ada siswa yang berbicara pada sesi ini.
              </div>
            )}
          </div>
        </div>

        {/* KOLOM KANAN: SISWA BELUM BERBICARA (PRIORITAS DIPANGGIL GURU) */}
        <div className="p-6 sm:p-7 bg-white rounded-3xl border border-sky-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-sky-50 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Siswa Belum Berbicara (Perlu Didorong)
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Prioritas pemanggilan untuk menciptakan keadilan diskusi
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-xl">
              {idleStudents.length} Siswa
            </span>
          </div>

          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {idleStudents.length > 0 ? (
              idleStudents.slice(0, 5).map((student) => (
                <div
                  key={student.id}
                  className="p-3.5 sm:p-4 rounded-2xl bg-amber-50/30 border border-amber-200/60 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0">
                      #{student.deskNumber}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {student.name}
                      </h4>
                      <span className="text-[11px] text-amber-700 font-semibold">
                        Status: Belum ada kontribusi
                      </span>
                    </div>
                  </div>

                  {onCallStudent ? (
                    <button
                      type="button"
                      onClick={() => onCallStudent(student)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
                    >
                      <span>Panggil</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 shrink-0">
                      Meja #{student.deskNumber}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-emerald-600 font-bold text-xs bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Luar biasa! 100% siswa di kelas ini telah berbicara secara adil.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboardView;
