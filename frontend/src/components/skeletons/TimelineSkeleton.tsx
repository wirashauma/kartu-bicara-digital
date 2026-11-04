import React from "react";
import { Skeleton } from "./Skeleton";

export function TimelineSkeleton() {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header Riwayat Token */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-sky-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <Skeleton className="w-52 h-7 rounded-xl" />
          <Skeleton className="w-72 max-w-full h-3.5 rounded-lg" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="w-36 h-10 rounded-2xl bg-emerald-50 border border-emerald-100" />
          <Skeleton className="w-24 h-8 rounded-xl bg-sky-50" />
        </div>
      </div>

      {/* Filter Kategori Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Skeleton className="w-20 h-8 rounded-xl bg-sky-100/70" />
        <Skeleton className="w-24 h-8 rounded-xl bg-slate-100" />
        <Skeleton className="w-24 h-8 rounded-xl bg-slate-100" />
        <Skeleton className="w-28 h-8 rounded-xl bg-slate-100" />
        <Skeleton className="w-28 h-8 rounded-xl bg-slate-100" />
      </div>

      {/* Daftar Item Timeline (6 baris) */}
      <div className="space-y-2.5">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="w-9 h-9 rounded-xl bg-sky-50" />
              <div className="space-y-1.5">
                <Skeleton className="w-40 h-4 rounded-md" />
                <Skeleton className="w-28 h-3 rounded-md" />
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Skeleton className="w-20 h-6 rounded-lg bg-sky-50" />
              <Skeleton className="w-12 h-6 rounded-lg bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

