import React from "react";
import { Skeleton } from "./Skeleton";

export function AuthSkeleton() {
  return (
    <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xl space-y-6 animate-in fade-in duration-200">
        {/* Logo Brand */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-black text-sm shadow-md">
            KBD
          </div>
          <Skeleton className="w-48 h-6 rounded-lg" />
          <Skeleton className="w-64 h-3.5 rounded-md" />
        </div>

        {/* Tab Switcher Peran */}
        <div className="p-1 rounded-2xl bg-sky-50 border border-sky-100 flex gap-1">
          <Skeleton className="flex-1 h-9 rounded-xl bg-white shadow-2xs" />
          <Skeleton className="flex-1 h-9 rounded-xl bg-transparent" />
        </div>

        {/* Form Inputs */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Skeleton className="w-24 h-3 rounded-md" />
            <Skeleton className="w-full h-11 rounded-xl bg-slate-50" />
          </div>

          <div className="space-y-1.5">
            <Skeleton className="w-24 h-3 rounded-md" />
            <Skeleton className="w-full h-11 rounded-xl bg-slate-50" />
          </div>

          <div className="flex justify-between items-center pt-1">
            <Skeleton className="w-32 h-4 rounded-md" />
            <Skeleton className="w-28 h-4 rounded-md" />
          </div>

          <Skeleton className="w-full h-12 rounded-2xl bg-sky-600/80" />
        </div>
      </div>
    </div>
  );
}

