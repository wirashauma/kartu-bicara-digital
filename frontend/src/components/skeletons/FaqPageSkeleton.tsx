import React from "react";
import { Skeleton } from "./Skeleton";

export function FaqPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#F0F7FF] text-slate-900 font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="w-full bg-gradient-to-r from-sky-600 via-sky-600 to-blue-600 border-b border-sky-500/40 text-white shadow-sm sticky top-0 z-30 select-none">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3 h-16 sm:h-18">
            <div className="flex items-center gap-3">
              <Skeleton className="w-24 h-9 rounded-xl bg-white/20" />
              <div className="flex items-center gap-2 pl-3 border-l border-white/20">
                <div className="w-8 h-8 rounded-xl bg-white/25 flex items-center justify-center font-black text-xs text-white/50">
                  KBD
                </div>
                <Skeleton className="w-44 h-4 rounded-md bg-white/30" />
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
        {/* Hero Banner Pencarian */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-sky-100 shadow-sm text-center space-y-4">
          <div className="space-y-1.5 max-w-lg mx-auto">
            <Skeleton className="w-64 h-7 mx-auto rounded-xl" />
            <Skeleton className="w-96 max-w-full h-3.5 mx-auto rounded-md" />
          </div>
          <Skeleton className="w-full max-w-md h-12 mx-auto rounded-2xl bg-sky-50/70" />
        </div>

        {/* Chips Kategori */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Skeleton className="w-24 h-9 rounded-xl bg-sky-600/80" />
          <Skeleton className="w-32 h-9 rounded-xl bg-white border border-sky-100" />
          <Skeleton className="w-32 h-9 rounded-xl bg-white border border-sky-100" />
          <Skeleton className="w-36 h-9 rounded-xl bg-white border border-sky-100" />
          <Skeleton className="w-28 h-9 rounded-xl bg-white border border-sky-100" />
        </div>

        {/* Daftar Kartu FAQ (4 cards skeleton) */}
        <div className="space-y-3.5">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-sky-100 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="w-28 h-5 rounded-lg bg-sky-50" />
                <Skeleton className="w-6 h-6 rounded-lg bg-slate-100" />
              </div>
              <Skeleton className="w-3/4 h-5 rounded-md" />
              <Skeleton className="w-full h-3.5 rounded-md" />
              <Skeleton className="w-4/5 h-3.5 rounded-md" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

