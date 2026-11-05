"use client";

import React, { useState } from "react";
import Image from "next/image";

interface BrandLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  priority?: boolean;
}

export function BrandLogo({
  className = "",
  size = 36,
  showText = false,
  priority = true,
}: BrandLogoProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Container Logo Resmi KBD */}
      <div
        style={{ width: size, height: size }}
        className="relative shrink-0 flex items-center justify-center rounded-2xl bg-white shadow-md shadow-sky-500/15 ring-1 ring-sky-200/60 overflow-hidden p-0.5"
      >
        {!imageError ? (
          <Image
            src="/logo.jpeg"
            alt="Logo Kartu Bicara Digital"
            width={Math.max(64, size * 2)}
            height={Math.max(64, size * 2)}
            className="w-full h-full object-contain rounded-xl select-none"
            priority={priority}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xs select-none">
            KBD
          </div>
        )}
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold text-slate-900 tracking-tight text-sm leading-tight">
            Kartu Bicara Digital
          </span>
          <span className="text-[9px] uppercase font-bold text-sky-600 tracking-wider">
            Model Arends
          </span>
        </div>
      )}
    </div>
  );
}
