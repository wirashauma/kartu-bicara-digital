"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface AuthIllustrationProps {
  tagline?: string;
  subtext?: string;
}

export function AuthIllustration({
  tagline = "Model Pembelajaran Kooperatif Arends",
  subtext = "Diskusi kelas lebih aktif, adil, dan terukur dengan kartu bicara interaktif.",
}: AuthIllustrationProps) {
  return (
    <div className="hidden lg:flex w-full h-full bg-gradient-to-br from-sky-50/60 via-slate-50/40 to-blue-50/50 p-6 xl:p-8 flex-col items-center justify-center border-l border-sky-100/80 relative select-none overflow-hidden">
      {/* Soft Ambient Light Behind Image */}
      <div className="absolute w-72 h-72 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Classroom Illustration & Clean Caption */}
      <div className="relative w-full max-w-sm flex flex-col items-center justify-center z-10">
        <div className="w-full bg-white/90 p-2 sm:p-2.5 rounded-2xl shadow-sm border border-sky-100/80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/login.jpeg"
            alt="Suasana Diskusi Kelas Kartu Bicara Digital"
            className="w-full h-auto max-h-[250px] xl:max-h-[290px] object-contain rounded-xl"
          />
        </div>

        {/* Minimalist, Elegant Caption (No crowded text stack) */}
        <div className="mt-4 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-sky-100 shadow-2xs text-xs font-semibold text-sky-700">
            <Sparkles className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span>{tagline}</span>
          </div>

          <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed font-normal">
            {subtext}
          </p>
        </div>
      </div>
    </div>
  );
}
