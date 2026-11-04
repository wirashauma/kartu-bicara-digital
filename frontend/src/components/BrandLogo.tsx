import React from "react";

interface BrandLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function BrandLogo({ className = "", size = 32, showText = false }: BrandLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Geometric Crown / Crest Icon in Modern Light Blue Gradient */}
      <div
        style={{ width: size, height: size }}
        className="relative shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 shadow-md shadow-sky-500/25 ring-1 ring-sky-300/40"
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/5 h-3/5 text-white"
        >
          {/* Geometric Crown & Discussion Wings */}
          <path
            d="M 16 5 L 21 12 L 28 8 L 25 18 L 16 23 L 7 18 L 4 8 L 11 12 Z"
            fill="currentColor"
          />
          {/* Base Anchor / Digital Card Foundation */}
          <path
            d="M 10 23 L 16 27 L 22 23 L 22 26 L 16 30 L 10 26 Z"
            fill="currentColor"
            opacity="0.85"
          />
          {/* Core Spark Node */}
          <circle cx="16" cy="15" r="2.2" fill="#fde047" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold text-slate-900 tracking-tight text-sm leading-tight">
            Kartu Bicara
          </span>
          <span className="text-[9px] uppercase font-bold text-sky-600 tracking-wider">
            Platform Digital
          </span>
        </div>
      )}
    </div>
  );
}
