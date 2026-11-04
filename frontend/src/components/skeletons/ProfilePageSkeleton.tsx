import React from "react";
import { Skeleton } from "./Skeleton";

export function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-[#F0F7FF] text-slate-900 font-sans flex flex-col">
      {/* Navbar Skeleton */}
      <header className="w-full bg-gradient-to-r from-sky-600 via-sky-600 to-blue-600 border-b border-sky-500/40 text-white shadow-sm sticky top-0 z-30 select-none">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3 h-16 sm:h-18">
            <div className="flex items-center gap-3">
              <Skeleton className="w-24 h-9 rounded-xl bg-white/20" />
              <div className="flex items-center gap-2 pl-3 border-l border-white/20">
                <div className="w-8 h-8 rounded-xl bg-white/25 flex items-center justify-center font-black text-xs text-white/50">
                  KBD
                </div>
                <Skeleton className="w-32 h-4 rounded-md bg-white/30" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Skeleton className="w-28 h-8 rounded-xl bg-white/20" />
              <Skeleton className="w-9 h-9 rounded-full bg-white/30" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-200">
        {/* Banner Profil Guru */}
        <div className="bg-white rounded-3xl border border-sky-100 shadow-sm overflow-hidden">
          {/* Cover Biru Gradient */}
          <div className="h-32 sm:h-40 bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 p-6 flex justify-end">
            <Skeleton className="w-36 h-7 rounded-full bg-white/25" />
          </div>

          {/* Konten Profil di Bawah Cover */}
          <div className="px-6 sm:px-8 pb-7 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white p-1.5 shadow-lg border-4 border-white shrink-0" />
              <div className="space-y-2 pb-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <Skeleton className="w-52 h-6 rounded-lg" />
                  <Skeleton className="w-24 h-5 rounded-full bg-sky-50" />
                </div>
                <Skeleton className="w-72 max-w-full h-3.5 rounded-md" />
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 shrink-0">
              <Skeleton className="w-32 h-12 rounded-2xl bg-sky-50/70" />
              <Skeleton className="w-32 h-12 rounded-2xl bg-sky-50/70" />
            </div>
          </div>
        </div>

        {/* Tab Navigasi Profil */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Skeleton className="w-44 h-11 rounded-2xl bg-sky-600/80" />
          <Skeleton className="w-40 h-11 rounded-2xl bg-white border border-sky-100" />
          <Skeleton className="w-40 h-11 rounded-2xl bg-white border border-sky-100" />
        </div>

        {/* Card Formulir */}
        <div className="bg-white rounded-3xl border border-sky-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="space-y-1.5 pb-4 border-b border-slate-100">
            <Skeleton className="w-56 h-6 rounded-lg" />
            <Skeleton className="w-96 max-w-full h-3.5 rounded-md" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="w-28 h-3.5 rounded-md" />
              <Skeleton className="w-full h-11 rounded-xl bg-slate-50" />
            </div>
            <div className="space-y-2">
              <Skeleton className="w-28 h-3.5 rounded-md" />
              <Skeleton className="w-full h-11 rounded-xl bg-slate-50" />
            </div>
            <div className="space-y-2">
              <Skeleton className="w-28 h-3.5 rounded-md" />
              <Skeleton className="w-full h-11 rounded-xl bg-slate-50" />
            </div>
            <div className="space-y-2">
              <Skeleton className="w-28 h-3.5 rounded-md" />
              <Skeleton className="w-full h-11 rounded-xl bg-slate-50" />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Skeleton className="w-44 h-11 rounded-xl bg-sky-600/80" />
          </div>
        </div>
      </main>
    </div>
  );
}

