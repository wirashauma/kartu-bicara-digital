import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50/70 via-slate-50 to-blue-50/50 flex flex-col items-center justify-center font-sans">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-black text-sm shadow-md animate-pulse">
          KBD
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-sky-700">
          <div className="w-2 h-2 rounded-full bg-sky-600 animate-ping" />
          <span>Memuat Kartu Bicara Digital...</span>
        </div>
      </div>
    </div>
  );
}

