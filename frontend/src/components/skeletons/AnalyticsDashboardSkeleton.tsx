import React from "react";
import { Skeleton } from "./Skeleton";

export function AnalyticsDashboardSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Analisis Keaktifan */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-sky-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="w-48 h-6 rounded-lg bg-sky-50" />
          <Skeleton className="w-72 h-8 rounded-xl" />
          <Skeleton className="w-96 max-w-full h-3.5 rounded-lg" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="w-36 h-10 rounded-2xl bg-emerald-50 border border-emerald-100" />
          <Skeleton className="w-32 h-10 rounded-2xl bg-sky-100/70" />
        </div>
      </div>

      {/* 4 Kartu KPI Utama */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="p-5 rounded-3xl bg-white border border-sky-100 shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="w-24 h-3 rounded-md" />
              <Skeleton className="w-7 h-7 rounded-xl bg-sky-50" />
            </div>
            <Skeleton className="w-20 h-9 rounded-xl" />
            <Skeleton className="w-32 h-3 rounded-md" />
          </div>
        ))}
      </div>

      {/* Baris Grafik & Distribusi 4 Kategori */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Kolom Kiri: 4 Bar Kategori */}
        <div className="lg:col-span-8 p-5 sm:p-6 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <Skeleton className="w-64 h-6 rounded-xl" />
            <Skeleton className="w-28 h-6 rounded-xl bg-sky-50" />
          </div>
          <div className="space-y-4 pt-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="w-36 h-4 rounded-md" />
                  <Skeleton className="w-16 h-4 rounded-md" />
                </div>
                <Skeleton className="w-full h-3.5 rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        </div>

        {/* Kolom Kanan: Donut Indeks Keadilan */}
        <div className="lg:col-span-4 p-5 sm:p-6 rounded-3xl bg-white border border-sky-100 shadow-sm flex flex-col items-center justify-center space-y-4">
          <Skeleton className="w-40 h-5 rounded-lg" />
          <Skeleton className="w-36 h-36 rounded-full bg-sky-50 border-4 border-sky-100" />
          <Skeleton className="w-32 h-6 rounded-xl" />
          <Skeleton className="w-48 h-3 rounded-md" />
        </div>
      </div>
    </div>
  );
}

