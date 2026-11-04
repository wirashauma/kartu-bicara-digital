import React from "react";
import { Skeleton } from "./Skeleton";

export function DiscussionGridSkeleton() {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header Info Kelas & Tombol Tambah Siswa */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-sky-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-xl bg-sky-50" />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Skeleton className="w-48 h-6 rounded-xl" />
              <Skeleton className="w-20 h-5 rounded-lg bg-sky-50" />
            </div>
            <Skeleton className="w-64 max-w-full h-3.5 rounded-lg" />
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Skeleton className="w-36 h-10 rounded-2xl bg-sky-100/70" />
        </div>
      </div>

      {/* Baris Pencarian & Filter Tab */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-sky-100 shadow-2xs">
        <Skeleton className="w-full sm:w-72 h-8 rounded-xl bg-sky-50/70" />
        <div className="flex items-center gap-1.5">
          <Skeleton className="w-24 h-7 rounded-xl bg-sky-100/70" />
          <Skeleton className="w-28 h-7 rounded-xl bg-slate-100" />
          <Skeleton className="w-28 h-7 rounded-xl bg-slate-100" />
        </div>
      </div>

      {/* Grid Kartu Siswa (Menampilkan 8 kartu skeleton) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-3xl p-4 sm:p-5 flex flex-col justify-between bg-white border border-sky-100/90 shadow-2xs min-h-[175px] space-y-3"
          >
            {/* Top: Nomor Siswa & Status */}
            <div className="flex items-center justify-between gap-1">
              <Skeleton className="w-10 h-6 rounded-xl bg-sky-50" />
              <Skeleton className="w-14 h-5 rounded-lg bg-slate-100" />
            </div>

            {/* Nama Siswa & Kontribusi */}
            <div className="space-y-1.5">
              <Skeleton className="w-4/5 h-4 rounded-lg" />
              <Skeleton className="w-1/2 h-3 rounded-md" />
            </div>

            {/* 3 Dot Kuota */}
            <div className="flex items-center gap-2">
              <Skeleton className="w-3 h-3 rounded-full bg-sky-100" />
              <Skeleton className="w-3 h-3 rounded-full bg-sky-100" />
              <Skeleton className="w-3 h-3 rounded-full bg-sky-100" />
            </div>

            {/* Tombol Beri Token */}
            <Skeleton className="w-full h-9 rounded-xl bg-sky-100/60" />
          </div>
        ))}
      </div>
    </div>
  );
}

