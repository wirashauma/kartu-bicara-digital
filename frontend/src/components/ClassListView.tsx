"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  BookOpen,
  Users,
  Clock,
  Coins,
  ArrowRight,
  Hash,
  Sparkles,
  School,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { ClassRoom } from "@/types/session";
import { AuthUser } from "@/lib/auth";

interface ClassListViewProps {
  classes: ClassRoom[];
  currentUser: AuthUser | null;
  onSelectClass: (classId: string) => void;
  onOpenAddClass: () => void;
  onDeleteClass?: (classId: string) => void;
}

export function ClassListView({
  classes,
  currentUser,
  onSelectClass,
  onOpenAddClass,
  onDeleteClass,
}: ClassListViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClasses = useMemo(() => {
    if (!searchQuery.trim()) return classes;
    const q = searchQuery.toLowerCase();
    return classes.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        c.sessionPin.toLowerCase().includes(q) ||
        (c.topic && c.topic.toLowerCase().includes(q))
    );
  }, [classes, searchQuery]);

  const totalStudentsAll = useMemo(() => {
    return classes.reduce((acc, c) => acc + c.students.length, 0);
  }, [classes]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner: Greeting, Metrics & Primary "+ Tambah Kelas" Action */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-sky-100 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Ambient subtle glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-100/50 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/60 text-xs font-bold text-sky-700 mb-2">
            <School className="w-3.5 h-3.5 text-sky-600" />
            <span>Manajemen Ruang Kelas Pendidik</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Selamat Datang, {currentUser?.name || "Bapak/Ibu Guru"}
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
            Pilih salah satu kelas di bawah untuk mengelola sesi kartu bicara dan melihat seluruh siswa, atau tambahkan kelas baru untuk sesi diskusi berikutnya.
          </p>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-semibold">
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>{classes.length} Kelas Tersedia</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 font-semibold">
              <Users className="w-4 h-4 text-sky-600" />
              <span>{totalStudentsAll} Siswa Terdaftar</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Model Arends Aktif</span>
            </span>
          </div>
        </div>

        {/* Primary Action Button: "+ Tambah Kelas Baru" */}
        <div className="relative z-10 shrink-0">
          <button
            type="button"
            onClick={onOpenAddClass}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-sm shadow-lg shadow-sky-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            <span>Tambah Kelas Baru</span>
          </button>
        </div>
      </div>

      {/* Search Bar & Section Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            Daftar Kelas yang Tersedia
          </h2>
          <p className="text-xs text-slate-500">
            Klik kartu kelas untuk membuka sesi dan menambahkan siswa
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-sky-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama kelas atau mapel..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 hover:text-slate-600 font-bold"
            >
              Hapus
            </button>
          )}
        </div>
      </div>

      {/* Grid Card-Card Kelas yang Tersedia */}
      {filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClasses.map((item) => {
            return (
              <div
                key={item.id}
                onClick={() => onSelectClass(item.id)}
                className="group relative bg-white rounded-3xl p-5 sm:p-6 border border-sky-100 shadow-sm hover:shadow-xl hover:shadow-sky-500/10 hover:border-sky-300 transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                {/* Header Card Kelas */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-100 text-[11px] font-bold">
                      {item.grade || "Kelas XI"}
                    </span>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-700">
                      <Hash className="w-3 h-3 text-sky-600" />
                      <span>{item.sessionPin}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 group-hover:text-sky-600 transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-xs font-semibold text-sky-700 mt-1">
                    {item.subject}
                  </p>

                  {item.topic && (
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                      &ldquo;{item.topic}&rdquo;
                    </p>
                  )}
                </div>

                {/* Body Metrics Card */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-sky-50/50 border border-sky-100/70 text-center mb-4">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-semibold">Total Siswa</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                        <Users className="w-3.5 h-3.5 text-sky-600" />
                        <span>{item.students.length}</span>
                      </span>
                    </div>

                    <div className="border-x border-sky-100">
                      <span className="block text-[10px] text-slate-400 font-semibold">Bicara</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-sky-600" />
                        <span>{item.speechTimeLimitSeconds}s</span>
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] text-slate-400 font-semibold">Jatah Token</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                        <Coins className="w-3.5 h-3.5 text-sky-600" />
                        <span>{item.tokensPerStudent}</span>
                      </span>
                    </div>
                  </div>

                  {/* Tombol Aksi Buka Sesi */}
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectClass(item.id);
                      }}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all group-hover:bg-gradient-to-r group-hover:from-sky-500 group-hover:to-blue-600"
                    >
                      <span>Buka Kelas &amp; Siswa</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    {onDeleteClass && classes.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Apakah Anda yakin ingin menghapus "${item.name}"?`)) {
                            onDeleteClass(item.id);
                          }
                        }}
                        title="Hapus Kelas"
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-10 rounded-3xl bg-white border border-sky-100 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">Tidak ada kelas yang ditemukan</h3>
          <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
            {searchQuery
              ? `Tidak ada kelas yang cocok dengan kata kunci "${searchQuery}". Silakan coba kata kunci lain.`
              : "Belum ada kelas yang dibuat. Mulai dengan membuat kelas pertama Anda."}
          </p>
          <button
            onClick={onOpenAddClass}
            className="mt-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kelas Sekarang</span>
          </button>
        </div>
      )}
    </div>
  );
}

