import React from "react";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50/70 via-slate-50 to-blue-50/50 flex flex-col items-center justify-center font-sans">
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-12 h-12 rounded-2xl bg-white p-1 shadow-md ring-1 ring-sky-200/50 flex items-center justify-center overflow-hidden animate-pulse">
          <Image
            src="/logo.jpeg"
            alt="Logo Kartu Bicara Digital"
            width={48}
            height={48}
            className="w-full h-full object-contain rounded-xl select-none"
            priority
          />
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-sky-700">
          <div className="w-2 h-2 rounded-full bg-sky-600 animate-ping" />
          <span>Memuat Kartu Bicara Digital...</span>
        </div>
      </div>
    </div>
  );
}
