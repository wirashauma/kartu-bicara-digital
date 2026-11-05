"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Mic,
  Search,
  Flame,
  Trash2,
} from "lucide-react";
import { Student, TokenType } from "@/types/session";
import { cn } from "@/lib/utils";

export interface StudentGridProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onDeleteStudent?: (student: Student) => void;
  activeSpeakerStudentId?: string | null;
  activeTokenFilter?: TokenType | null;
  className?: string;
}

type FilterTab = "ALL" | "IDLE" | "ACTIVE_SPEAKING" | "HAS_SPOKEN";

export function StudentGrid({
  students,
  onSelectStudent,
  onDeleteStudent,
  activeSpeakerStudentId,
  activeTokenFilter,
  className,
}: StudentGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");

  // Filtering logic
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // 1. Search filter
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.deskNumber.toString().includes(searchQuery);

      if (!matchesSearch) return false;

      // 2. Token taxonomy filter (from parent header)
      if (activeTokenFilter) {
        const hasUsedCategory = student.usedTokens.some(
          (t) => t.type === activeTokenFilter
        );
        if (!hasUsedCategory) return false;
      }

      // 3. Tab filter
      switch (activeTab) {
        case "IDLE":
          return !student.hasSpoken || student.usedTokens.length === 0;
        case "ACTIVE_SPEAKING":
          return student.isCurrentlySpeaking || student.id === activeSpeakerStudentId;
        case "HAS_SPOKEN":
          return student.hasSpoken && student.usedTokens.length > 0;
        case "ALL":
        default:
          return true;
      }
    });
  }, [students, searchQuery, activeTab, activeTokenFilter, activeSpeakerStudentId]);

  // Tab counters
  const idleCount = useMemo(
    () => students.filter((s) => !s.hasSpoken || s.usedTokens.length === 0).length,
    [students]
  );
  const spokenCount = useMemo(
    () => students.filter((s) => s.hasSpoken && s.usedTokens.length > 0).length,
    [students]
  );

  const handlePickRandomIdle = () => {
    const idleList = students.filter(
      (s) => (!s.hasSpoken || s.usedTokens.length === 0) && s.remainingTokens > 0
    );
    if (idleList.length > 0) {
      const chosen = idleList[Math.floor(Math.random() * idleList.length)];
      onSelectStudent(chosen);
    } else {
      const activeList = students.filter((s) => s.remainingTokens > 0);
      if (activeList.length > 0) {
        const chosen = activeList[Math.floor(Math.random() * activeList.length)];
        onSelectStudent(chosen);
      }
    }
  };

  return (
    <section className={cn("w-full space-y-3.5", className)}>
      {/* Search & Filter: Bersih, Ramping, Tidak Berantakan */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-sky-100 shadow-2xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-sky-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama atau nomor siswa..."
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

        {/* Tab Filter Chips & Tombol Panggil Acak */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={handlePickRandomIdle}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all whitespace-nowrap"
            title="Pilih acak siswa yang belum berbicara (Model Arends)"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Panggil Acak</span>
          </button>

          <button
            onClick={() => setActiveTab("ALL")}
            className={cn(
              "px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap",
              activeTab === "ALL"
                ? "bg-sky-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-sky-50"
            )}
          >
            Semua ({students.length})
          </button>

          <button
            onClick={() => setActiveTab("IDLE")}
            className={cn(
              "px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1 border",
              activeTab === "IDLE"
                ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                : "bg-amber-50/80 text-amber-800 border-amber-200/80 hover:bg-amber-100"
            )}
          >
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            <span>Belum Bicara ({idleCount})</span>
          </button>

          <button
            onClick={() => setActiveTab("HAS_SPOKEN")}
            className={cn(
              "px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap",
              activeTab === "HAS_SPOKEN"
                ? "bg-sky-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-sky-50"
            )}
          >
            Sudah Bicara ({spokenCount})
          </button>
        </div>
      </div>

      {/* Grid of 36 Students: 1 Baris 4 Card Lebih Besar & Nyaman */}
      {filteredStudents.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-3xl border border-sky-100 shadow-2xs space-y-2">
          <p className="text-xs font-bold text-slate-700">Tidak ada siswa yang sesuai pencarian</p>
          <p className="text-[11px] text-slate-400">Coba ubah kata kunci atau reset filter kategori.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          <AnimatePresence mode="popLayout">
            {filteredStudents.map((student) => {
              const isSpeaking =
                student.isCurrentlySpeaking || student.id === activeSpeakerStudentId;
              const isIdle = !student.hasSpoken || student.usedTokens.length === 0;
              const isExhausted = student.remainingTokens === 0;

              return (
                <motion.div
                  key={student.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    "rounded-3xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 select-none bg-white min-h-[175px]",
                    isSpeaking
                      ? "border-2 border-sky-600 shadow-md shadow-sky-200/50 ring-2 ring-sky-400/30"
                      : isIdle
                      ? "border-2 border-amber-300 hover:border-amber-400 shadow-xs bg-amber-50/20"
                      : isExhausted
                      ? "border border-slate-200 opacity-70"
                      : "border border-sky-100/90 hover:border-sky-300 hover:shadow-xs"
                  )}
                >
                  {/* Top: Nomor Siswa & Badge Status */}
                  <div className="flex items-center justify-between gap-1 mb-2.5">
                    <span
                      className={cn(
                        "text-xs font-mono font-bold px-2.5 py-1 rounded-xl",
                        isSpeaking
                          ? "bg-sky-600 text-white"
                          : isIdle
                          ? "bg-amber-100 text-amber-900 font-extrabold border border-amber-200"
                          : "bg-sky-50 text-sky-800 border border-sky-200/60"
                      )}
                    >
                      #{student.deskNumber}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {isSpeaking ? (
                        <span className="flex items-center gap-1.5 text-[10px] font-black px-2 py-0.5 rounded-lg bg-sky-600 text-white animate-pulse">
                          <Mic className="w-3 h-3" />
                          <span>Bicara</span>
                        </span>
                      ) : isIdle ? (
                        <span className="text-[10px] font-black text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-lg border border-amber-300">
                          Belum
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-slate-400">
                          {student.remainingTokens} sisa
                        </span>
                      )}

                      {onDeleteStudent && !isSpeaking && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteStudent(student);
                          }}
                          title="Hapus Siswa dari Kelas"
                          className="p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Student Name */}
                  <div className="mb-3">
                    <h4
                      className={cn(
                        "text-sm sm:text-base font-extrabold truncate tracking-tight",
                        isSpeaking ? "text-sky-950 font-black" : "text-slate-800"
                      )}
                      title={student.name}
                    >
                      {student.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {student.usedTokens.length > 0
                        ? `${student.usedTokens.length} token terpakai`
                        : "0 kontribusi"}
                    </p>
                  </div>

                  {/* Token Quota Indicators: 3 Dot Elegan & Lebih Terlihat */}
                  <div className="flex items-center gap-2 mb-3.5">
                    {Array.from({ length: student.tokensQuota }).map((_, idx) => {
                      const isUsed = idx >= student.remainingTokens;
                      const tok = student.usedTokens[idx];
                      return (
                        <div
                          key={idx}
                          title={isUsed && tok ? `Digunakan: ${tok.type}` : "Token Tersedia"}
                          className={cn(
                            "w-3.5 h-3.5 rounded-full transition-all",
                            isUsed
                              ? tok?.type === "BERTANYA"
                                ? "bg-pink-500 shadow-xs shadow-pink-200"
                                : tok?.type === "MENJAWAB"
                                ? "bg-amber-500 shadow-xs shadow-amber-200"
                                : tok?.type === "BERPENDAPAT"
                                ? "bg-cyan-500 shadow-xs shadow-cyan-200"
                                : "bg-emerald-500 shadow-xs shadow-emerald-200"
                              : "bg-sky-100 border border-sky-200/60"
                          )}
                        />
                      );
                    })}
                  </div>

                  {/* Action Button: Ramping, Lebih Besar & Mudah Ditekan */}
                  <button
                    type="button"
                    disabled={isExhausted || isSpeaking}
                    onClick={() => onSelectStudent(student)}
                    className={cn(
                      "w-full py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5",
                      isSpeaking
                        ? "bg-sky-600 text-white cursor-default"
                        : isIdle
                        ? "bg-amber-500 hover:bg-amber-600 text-white active:scale-95 shadow-sm shadow-amber-200"
                        : isExhausted
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-sky-50 text-sky-800 hover:bg-sky-600 hover:text-white border border-sky-200/70 hover:border-sky-600 active:scale-95"
                    )}
                  >
                    {isSpeaking ? (
                      <span>Sedang Bicara</span>
                    ) : isIdle ? (
                      <>
                        <Flame className="w-3.5 h-3.5" />
                        <span>Panggil</span>
                      </>
                    ) : isExhausted ? (
                      <span>Selesai</span>
                    ) : (
                      <span>Beri Token</span>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}

export default StudentGrid;
