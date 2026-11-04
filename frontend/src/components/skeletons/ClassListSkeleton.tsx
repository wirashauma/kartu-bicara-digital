import React from "react";
import { Skeleton } from "./Skeleton";

export function ClassListSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner & Tombol Tambah Kelas */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-sky-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="w-56 h-7 rounded-xl" />
          <Skeleton className="w-80 max-w-full h-4 rounded-lg" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="w-36 h-10 rounded-2xl bg-sky-100/70" />
        </div>
      </div>

      {/* Grid Kartu Kelas (Menampilkan 6 kartu skeleton) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="p-5 rounded-3xl bg-white border border-sky-100 shadow-2xs space-y-4"
          >
            {/* Header Card: PIN & Badge */}
            <div className="flex items-center justify-between">
              <Skeleton className="w-20 h-6 rounded-xl bg-sky-50" />
              <Skeleton className="w-16 h-5 rounded-lg bg-slate-100" />
            </div>

            {/* Nama Kelas & Topik */}
            <div className="space-y-2">
              <Skeleton className="w-3/4 h-6 rounded-xl" />
              <Skeleton className="w-full h-3.5 rounded-lg" />
              <Skeleton className="w-2/3 h-3.5 rounded-lg" />
            </div>

            {/* Statistik Siswa & Jatah Token */}
            <div className="p-3 rounded-2xl bg-sky-50/50 border border-sky-100/60 flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="w-16 h-2.5 rounded-md" />
                <Skeleton className="w-12 h-4 rounded-md" />
              </div>
              <div className="space-y-1 text-right">
                <Skeleton className="w-16 h-2.5 rounded-md" />
                <Skeleton className="w-10 h-4 rounded-md" />
              </div>
            </div>

            {/* Tombol Masuk Kelas */}
            <Skeleton className="w-full h-11 rounded-2xl bg-sky-100/70" />
          </div>
        ))}
      </div>
    </div>
  );
}

