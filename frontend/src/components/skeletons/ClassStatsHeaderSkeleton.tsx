import React from "react";
import { Skeleton } from "./Skeleton";
import { cn } from "@/lib/utils";

export function ClassStatsHeaderSkeleton({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "w-full bg-gradient-to-r from-sky-600 via-sky-600 to-blue-600 border-b border-sky-500/40 shadow-sm sticky top-0 z-30 select-none",
        className
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between gap-3 h-16 sm:h-18">
          {/* Sisi Kiri: Brand Logo & Title */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/30 backdrop-blur-sm flex items-center justify-center font-black text-xs sm:text-sm text-white/50">
              KBD
            </div>
            <div className="hidden sm:flex flex-col gap-1.5">
              <Skeleton className="w-32 h-3.5 bg-white/30 rounded-md" />
              <Skeleton className="w-20 h-2.5 bg-white/20 rounded-md" />
            </div>
          </div>

          {/* Sisi Tengah: Tab Navigasi Segmented */}
          <div className="hidden md:flex items-center justify-center flex-1 mx-4">
            <div className="flex items-center p-1 bg-black/15 backdrop-blur-md rounded-2xl border border-white/15 gap-1.5">
              <Skeleton className="w-24 h-7 bg-white/35 rounded-xl" />
              <Skeleton className="w-28 h-7 bg-white/20 rounded-xl" />
              <Skeleton className="w-26 h-7 bg-white/20 rounded-xl" />
              <Skeleton className="w-20 h-7 bg-white/20 rounded-xl" />
            </div>
          </div>

          {/* Sisi Kanan: Audio & Profile Avatar Bulat */}
          <div className="flex items-center gap-3 shrink-0">
            <Skeleton className="w-8 h-8 rounded-xl bg-white/20" />
            <div className="flex items-center gap-2 pl-2 border-l border-white/20">
              <Skeleton className="w-9 h-9 rounded-full bg-white/30 ring-2 ring-white/40" />
              <div className="hidden lg:flex flex-col gap-1">
                <Skeleton className="w-24 h-3 bg-white/30 rounded-md" />
                <Skeleton className="w-16 h-2 bg-white/20 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

