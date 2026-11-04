"use client";

import React, { useState, useMemo } from "react";
import {
  Student,
  Token,
  TokenType,
  ClassStats,
  SessionConfig,
  ActiveSpeaker,
  TOKEN_DEFINITIONS,
} from "@/types/session";
import { TokenBadge } from "@/components/TokenBadge";
import { cn } from "@/lib/utils";
import {
  User,
  Users,
  Mic,
  Clock,
  LogOut,
  Search,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

export type StudentTab = "MY_HISTORY" | "CLASS_HISTORY";

interface StudentDashboardViewProps {
  student: Student;
  activeSpeaker: ActiveSpeaker | null;
  allClassTokens: Token[];
  classStats: ClassStats;
  config: SessionConfig;
  onLogout: () => void;
}

export function StudentDashboardView({
  student,
  activeSpeaker,
  allClassTokens,
  classStats,
  config,
  onLogout,
}: StudentDashboardViewProps) {
  // Hanya 2 Tab Riwayat: Riwayat Saya & Riwayat Kelas
  const [activeTab, setActiveTab] = useState<StudentTab>("MY_HISTORY");
  const [classFilter, setClassFilter] = useState<TokenType | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Riwayat token pribadi (diurutkan terbaru ke terlama)
  const myTokens = useMemo(() => {
    return [...student.usedTokens].sort(
      (a, b) => new Date(b.usedAt).getTime() - new Date(a.usedAt).getTime()
    );
  }, [student.usedTokens]);

  // Breakdown 4 Kategori milik siswa sendiri
  const myCategoryCounts = useMemo(() => {
    const counts: Record<TokenType, number> = {
      BERTANYA: 0,
      MENJAWAB: 0,
      BERPENDAPAT: 0,
      MENANGGAPI: 0,
    };
    student.usedTokens.forEach((t) => {
      if (counts[t.type] !== undefined) {
        counts[t.type] += 1;
      }
    });
    return counts;
  }, [student.usedTokens]);

  // Riwayat kelas yang difilter dan dicari
  const filteredClassTokens = useMemo(() => {
    return allClassTokens.filter((tok) => {
      const matchType = classFilter === "ALL" || tok.type === classFilter;
      const matchSearch =
        searchQuery.trim() === "" ||
        tok.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(tok.deskNumber).includes(searchQuery.trim());
      return matchType && matchSearch;
    });
  }, [allClassTokens, classFilter, searchQuery]);

  // Format durasi detik ke teks rapi (contoh: 1m 40s atau 45s)
  const formatDuration = (totalSeconds: number) => {
    if (!totalSeconds || totalSeconds <= 0) return "0s";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${seconds > 0 ? `${seconds}s` : ""}`;
    }
    return `${seconds}s`;
  };

  const isMyTurn = activeSpeaker?.studentId === student.id;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F0F7FF] text-slate-900 font-sans">
      {/* ======================================================== */}
      {/* 1. NAVBAR SISWA (KONSISTEN DENGAN NAVBAR GURU)            */}
      {/* ======================================================== */}
      <header className="w-full bg-gradient-to-r from-sky-600 via-sky-600 to-blue-600 border-b border-sky-500/40 text-white shadow-sm sticky top-0 z-30 select-none">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3 h-16 sm:h-18">
            {/* Sisi Kiri: Brand & Konteks Kelas Siswa */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white text-sky-700 flex items-center justify-center font-black text-xs sm:text-sm tracking-tight shadow-md">
                KBD
              </div>
              <div className="leading-tight">
                <h1 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
                  <span>Ruang Diskusi Siswa</span>
                </h1>
                <span className="text-[10px] sm:text-[11px] font-bold text-sky-100 uppercase tracking-wide">
                  {config.className} · PIN #{config.sessionCode}
                </span>
              </div>
            </div>

            {/* Sisi Tengah: Tab Navigasi Segmented (Riwayat Saya & Riwayat Kelas) */}
            <nav className="hidden sm:flex items-center p-1 bg-black/15 backdrop-blur-md rounded-2xl border border-white/15 gap-1 shadow-inner">
              <button
                type="button"
                onClick={() => setActiveTab("MY_HISTORY")}
                className={cn(
                  "flex items-center gap-2 py-1.5 px-4 rounded-xl font-bold transition-all text-xs whitespace-nowrap",
                  activeTab === "MY_HISTORY"
                    ? "bg-white text-sky-800 shadow-sm"
                    : "text-white/85 hover:text-white hover:bg-white/10"
                )}
              >
                <User className="w-3.5 h-3.5" />
                <span>Riwayat Saya</span>
                {myTokens.length > 0 && (
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded-full text-[9px] font-black border transition-colors",
                      activeTab === "MY_HISTORY"
                        ? "bg-sky-100 text-sky-800 border-sky-200"
                        : "bg-white/20 text-white border-white/25"
                    )}
                  >
                    {myTokens.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("CLASS_HISTORY")}
                className={cn(
                  "flex items-center gap-2 py-1.5 px-4 rounded-xl font-bold transition-all text-xs whitespace-nowrap",
                  activeTab === "CLASS_HISTORY"
                    ? "bg-white text-sky-800 shadow-sm"
                    : "text-white/85 hover:text-white hover:bg-white/10"
                )}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Riwayat Kelas</span>
                {allClassTokens.length > 0 && (
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded-full text-[9px] font-black border transition-colors",
                      activeTab === "CLASS_HISTORY"
                        ? "bg-sky-100 text-sky-800 border-sky-200"
                        : "bg-white/20 text-white border-white/25"
                    )}
                  >
                    {allClassTokens.length}
                  </span>
                )}
              </button>
            </nav>

            {/* Sisi Kanan: Badge Siswa & Tombol Keluar */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-white/20 text-right">
                <div>
                  <span className="block text-xs font-bold text-white truncate max-w-[140px]">
                    {student.name}
                  </span>
                  <span className="block text-[10px] text-sky-200 font-mono">
                    #{student.deskNumber}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-black text-xs text-white">
                  #{student.deskNumber}
                </div>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 transition-colors shadow-2xs"
                title="Keluar dari Ruang Siswa"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sub-Navigasi Tab Khusus Mobile */}
        <div className="sm:hidden border-t border-white/15 bg-sky-700/60 px-3 py-2 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("MY_HISTORY")}
            className={cn(
              "flex-1 py-1.5 px-2 rounded-xl text-center text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5",
              activeTab === "MY_HISTORY"
                ? "bg-white text-sky-800 shadow-xs"
                : "text-white/80 hover:bg-white/10"
            )}
          >
            <User className="w-3.5 h-3.5" />
            <span>Riwayat Saya</span>
            {myTokens.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-white/20">
                {myTokens.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("CLASS_HISTORY")}
            className={cn(
              "flex-1 py-1.5 px-2 rounded-xl text-center text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5",
              activeTab === "CLASS_HISTORY"
                ? "bg-white text-sky-800 shadow-xs"
                : "text-white/80 hover:bg-white/10"
            )}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Riwayat Kelas</span>
            {allClassTokens.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-white/20">
                {allClassTokens.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. BODY CONTENT (HANYA MELIHAT RIWAYAT)                   */}
      {/* ======================================================== */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        {/* ==================================================== */}
        {/* BANNER STATUS GILIRAN BICARA SECARA REAL-TIME        */}
        {/* ==================================================== */}
        {activeSpeaker && isMyTurn ? (
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-sky-600 via-sky-600 to-blue-600 text-white shadow-xl shadow-sky-600/20 border border-sky-400/40 text-center space-y-2 animate-pulse">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider backdrop-blur-md">
              <Mic className="w-4 h-4 animate-bounce" /> Giliran Anda Sedang Berbicara!
            </span>
            <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight">
              {activeSpeaker.remainingSeconds}s
            </div>
            <p className="text-xs text-sky-100 font-medium">
              Kartu Bicara yang diberikan Guru:{" "}
              <strong className="text-white underline underline-offset-4">
                {TOKEN_DEFINITIONS[activeSpeaker.tokenType as TokenType]?.label}
              </strong>
            </p>
          </div>
        ) : activeSpeaker ? (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-sky-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 text-xs text-sky-950 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping" />
              <span>
                Sedang Berbicara di Depan Kelas:{" "}
                <strong className="text-sky-900 font-black">
                  {activeSpeaker.studentName}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              <TokenBadge type={activeSpeaker.tokenType} size="sm" />
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-100">
                {activeSpeaker.remainingSeconds}s tersisa
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-white/80 border border-sky-100 shadow-2xs text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
              <span>
                Pemberian kartu bicara dikontrol sepenuhnya oleh Guru di depan kelas.
              </span>
            </span>
            <span className="text-[11px] font-bold text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-100 self-start sm:self-auto">
              Mode Menyimak Diskusi
            </span>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 1: RIWAYAT SAYA (TRACK RECORD PRIBADI SISWA)       */}
        {/* ==================================================== */}
        {activeTab === "MY_HISTORY" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Card Profil & Kuota Token Siswa */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-sky-200 shrink-0">
                    #{student.deskNumber}
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                      {student.name}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      #{student.deskNumber} · {config.subject} · {config.topic}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span
                    className={cn(
                      "px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border",
                      myTokens.length > 0
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    )}
                  >
                    {myTokens.length > 0 ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Sudah Berpartisipasi</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Menunggu Giliran Guru</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Progress Kuota Token Siswa (Read-Only) */}
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600">Sisa Kuota Bicara:</span>
                  <span className="font-extrabold text-sky-700 text-sm">
                    {student.remainingTokens} dari {student.tokensQuota} Token
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {Array.from({ length: student.tokensQuota }).map((_, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "h-2.5 flex-1 rounded-full transition-colors",
                        idx < student.remainingTokens ? "bg-sky-600" : "bg-sky-100"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Statistik Pribadi: 3 Metrik Utama */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-sky-100 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
                  Token Digunakan
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-sky-700">
                    {student.usedTokens.length}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    / {student.tokensQuota} Kuota
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {student.remainingTokens} token bicara masih tersisa
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-sky-100 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
                  Total Waktu Bicara
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-slate-800">
                    {formatDuration(student.totalSpeakingTimeSeconds)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Akumulasi durasi menyampaikan gagasan
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-sky-100 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
                  Ragam Keterampilan
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-slate-800">
                    {
                      Object.values(myCategoryCounts).filter((c) => c > 0).length
                    }{" "}
                    / 4
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">Kategori</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Variasi taksonomi berpikir kritis Arends
                </p>
              </div>
            </div>

            {/* Breakdown 4 Kategori Milik Siswa */}
            <div className="p-5 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Distribusi Kategori Kartu yang Pernah Anda Gunakan
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {(["BERTANYA", "MENJAWAB", "BERPENDAPAT", "MENANGGAPI"] as TokenType[]).map(
                  (type) => {
                    const meta = TOKEN_DEFINITIONS[type];
                    const count = myCategoryCounts[type];
                    return (
                      <div
                        key={type}
                        className={cn(
                          "p-3 rounded-2xl border flex flex-col justify-between transition-all",
                          count > 0
                            ? `${meta.lightBgClass} ${meta.borderClass}`
                            : "bg-slate-50/60 border-slate-200/60 opacity-60"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={cn(
                              "text-xs font-bold",
                              count > 0 ? meta.textClass : "text-slate-500"
                            )}
                          >
                            {meta.label}
                          </span>
                          <span
                            className={cn(
                              "text-xs font-black px-2 py-0.5 rounded-lg",
                              count > 0
                                ? "bg-white shadow-2xs text-slate-800"
                                : "text-slate-400"
                            )}
                          >
                            {count}x
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* Daftar Kronologis Penggunaan Token Saya */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Log Pemakaian Kartu Bicara Anda
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Urutan kartu bicara yang telah Anda pakai selama sesi diskusi
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-100">
                  Total: {myTokens.length} Catatan
                </span>
              </div>

              {myTokens.length > 0 ? (
                <div className="space-y-2.5">
                  {myTokens.map((tok, idx) => {
                    const meta = TOKEN_DEFINITIONS[tok.type];
                    const usedDate = new Date(tok.usedAt);
                    const formattedTime = usedDate.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    });

                    return (
                      <div
                        key={tok.id || idx}
                        className="p-4 rounded-2xl bg-white border border-sky-100 hover:border-sky-300 transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 font-bold text-xs flex items-center justify-center border border-sky-100 shrink-0 mt-0.5 sm:mt-0">
                            #{myTokens.length - idx}
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <TokenBadge type={tok.type} size="sm" />
                              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                                <Clock className="w-3 h-3" />
                                {formattedTime} WIB
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 pt-0.5">
                              {meta.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
                            {tok.durationSeconds} detik
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-10 text-center rounded-2xl bg-sky-50/40 border border-dashed border-sky-200 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-white text-sky-600 flex items-center justify-center mx-auto shadow-xs border border-sky-100">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      Belum Ada Riwayat Bicara
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Anda belum diberikan giliran bicara pada sesi ini. Guru akan memanggil dan memberikan kartu bicara saat giliran Anda tiba.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: RIWAYAT KELAS (LIVE FEED AKTIVITAS TEMAN)       */}
        {/* ==================================================== */}
        {activeTab === "CLASS_HISTORY" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header Riwayat Kelas */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-sky-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 text-xs font-mono font-bold">
                    {config.className}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Riwayat Diskusi Kelas
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Pantau kontribusi rekan sekelas secara terbuka dan transparan sesuai etika diskusi kooperatif
                </p>
              </div>

              {/* Ringkasan Singkat Sesi */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold">
                  {classStats.studentsSpokenCount} / {classStats.totalStudents} Siswa Aktif ({classStats.participationRate}%)
                </span>
              </div>
            </div>

            {/* Filter Kategori & Pencarian Rekan */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-sky-100 shadow-2xs">
              {/* Input Pencarian */}
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 text-sky-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama teman atau nomor..."
                  className="w-full pl-9 pr-4 py-1.5 bg-sky-50/40 border border-sky-100 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/20 focus:border-sky-500 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-sky-700 font-bold"
                  >
                    Hapus
                  </button>
                )}
              </div>

              {/* Chips Filter 4 Kategori */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                <button
                  type="button"
                  onClick={() => setClassFilter("ALL")}
                  className={cn(
                    "px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap",
                    classFilter === "ALL"
                      ? "bg-sky-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-sky-50"
                  )}
                >
                  Semua ({allClassTokens.length})
                </button>

                {(["BERTANYA", "MENJAWAB", "BERPENDAPAT", "MENANGGAPI"] as TokenType[]).map(
                  (type) => {
                    const meta = TOKEN_DEFINITIONS[type];
                    const isSelected = classFilter === type;
                    const count = classStats.distributionByType[type] || 0;

                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setClassFilter(type)}
                        className={cn(
                          "px-2.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5",
                          isSelected
                            ? "bg-sky-600 text-white shadow-xs"
                            : "text-slate-600 hover:bg-sky-50"
                        )}
                      >
                        <span>{meta.label}</span>
                        <span
                          className={cn(
                            "text-[10px] px-1.5 py-0.2 rounded-full",
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 text-slate-600"
                          )}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Live Feed List Token Se-Kelas */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-1">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Aktivitas Bicara Rekan Se-Kelas
                </h3>
                <span className="text-xs font-bold text-slate-400">
                  {filteredClassTokens.length} dari {allClassTokens.length} Catatan
                </span>
              </div>

              {filteredClassTokens.length > 0 ? (
                <div className="space-y-2.5">
                  {filteredClassTokens.map((tok) => {
                    const isMe = tok.studentId === student.id;
                    const usedDate = new Date(tok.usedAt);
                    const formattedTime = usedDate.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    });

                    return (
                      <div
                        key={tok.id}
                        className={cn(
                          "p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                          isMe
                            ? "bg-sky-50/70 border-sky-300 ring-2 ring-sky-300/40 shadow-xs"
                            : "bg-white border-slate-200/80 hover:border-sky-200 shadow-2xs"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-xl font-bold text-xs flex items-center justify-center border shrink-0",
                              isMe
                                ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                                : "bg-sky-50 text-sky-700 border-sky-100"
                            )}
                          >
                            #{tok.deskNumber}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                                {tok.studentName}
                              </h4>
                              {isMe && (
                                <span className="px-2 py-0.2 rounded-md bg-sky-600 text-white text-[10px] font-black uppercase tracking-wide">
                                  Saya
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-mono">
                              {formattedTime} WIB · #{tok.deskNumber}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                          <TokenBadge type={tok.type} size="sm" />
                          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                            {tok.durationSeconds}s
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-10 text-center rounded-2xl bg-sky-50/30 border border-dashed border-sky-200 text-slate-400 text-xs space-y-1">
                  <p className="font-bold text-slate-600">
                    Tidak ada catatan riwayat diskusi yang cocok.
                  </p>
                  <p>
                    {searchQuery
                      ? "Coba ubah kata kunci pencarian Anda."
                      : "Belum ada token dengan kategori terpilih."}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
