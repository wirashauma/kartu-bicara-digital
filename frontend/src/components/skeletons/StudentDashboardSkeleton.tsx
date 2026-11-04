import React from "react";
import { Skeleton } from "./Skeleton";

export function StudentDashboardSkeleton() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F0F7FF] font-sans">
      {/* Top Navbar Siswa Skeleton */}
      <header className="w-full bg-gradient-to-r from-sky-600 via-sky-600 to-blue-600 border-b border-sky-500/40 text-white shadow-sm sticky top-0 z-30 select-none">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3 h-16 sm:h-18">
            {/* Kiri */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/30 backdrop-blur-sm flex items-center justify-center font-black text-xs sm:text-sm text-white/50">
                KBD
              </div>
              <div className="space-y-1">
                <Skeleton className="w-36 h-3.5 bg-white/35 rounded-md" />
                <Skeleton className="w-24 h-2.5 bg-white/20 rounded-md" />
              </div>
            </div>

            {/* Tengah: 2 Tab Riwayat */}
            <div className="hidden sm:flex items-center p-1 bg-black/15 backdrop-blur-md rounded-2xl border border-white/15 gap-1.5">
              <Skeleton className="w-32 h-7 bg-white/35 rounded-xl" />
              <Skeleton className="w-32 h-7 bg-white/20 rounded-xl" />
            </div>

            {/* Kanan */}
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-full bg-white/30" />
              <Skeleton className="w-16 h-8 rounded-xl bg-white/20" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-200">
        {/* Live Status Banner Skeleton */}
        <div className="p-3.5 rounded-2xl bg-white border border-sky-100 shadow-2xs flex items-center justify-between">
          <Skeleton className="w-72 max-w-full h-4 rounded-md" />
          <Skeleton className="w-28 h-6 rounded-lg bg-sky-50" />
        </div>

        {/* Card Profil & Kuota Token Siswa */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <Skeleton className="w-12 h-12 rounded-2xl bg-sky-100" />
              <div className="space-y-1.5">
                <Skeleton className="w-48 h-5 rounded-lg" />
                <Skeleton className="w-36 h-3.5 rounded-md" />
              </div>
            </div>
            <Skeleton className="w-32 h-7 rounded-xl bg-slate-100" />
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-2.5">
            <div className="flex justify-between">
              <Skeleton className="w-28 h-3.5 rounded-md" />
              <Skeleton className="w-24 h-4 rounded-md" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-2.5 flex-1 rounded-full bg-sky-200/80" />
              <Skeleton className="h-2.5 flex-1 rounded-full bg-sky-200/80" />
              <Skeleton className="h-2.5 flex-1 rounded-full bg-sky-100" />
            </div>
          </div>
        </div>

        {/* 3 Metrik Utama Pribadi */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-sky-100 shadow-2xs space-y-2.5"
            >
              <Skeleton className="w-24 h-3 rounded-md" />
              <Skeleton className="w-16 h-8 rounded-lg" />
              <Skeleton className="w-36 h-2.5 rounded-md" />
            </div>
          ))}
        </div>

        {/* 4 Kategori Arends */}
        <div className="p-5 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-3">
          <Skeleton className="w-64 h-3.5 rounded-md" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
              >
                <Skeleton className="w-16 h-3.5 rounded-md" />
                <Skeleton className="w-8 h-4 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Log Pemakaian Kartu */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-3.5">
          <div className="flex justify-between">
            <Skeleton className="w-48 h-5 rounded-md" />
            <Skeleton className="w-24 h-6 rounded-xl bg-sky-50" />
          </div>
          <div className="space-y-2.5 pt-1">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white border border-sky-100 shadow-2xs flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="w-9 h-9 rounded-xl bg-sky-50" />
                  <div className="space-y-1">
                    <Skeleton className="w-24 h-5 rounded-lg bg-sky-50" />
                    <Skeleton className="w-48 h-3 rounded-md" />
                  </div>
                </div>
                <Skeleton className="w-16 h-6 rounded-lg bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

