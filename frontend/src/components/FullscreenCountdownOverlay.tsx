"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusCircle,
  Square,
  Pause,
  Play,
  Volume2,
  VolumeX,
  AlertOctagon,
} from "lucide-react";
import { ActiveSpeaker, TOKEN_DEFINITIONS } from "@/types/session";
import { TokenBadge } from "@/components/TokenBadge";
import { cn } from "@/lib/utils";

export interface FullscreenCountdownOverlayProps {
  speaker: ActiveSpeaker | null;
  onExtendTime?: (additionalSeconds: number) => void;
  onTogglePause?: () => void;
  onFinishSpeech?: () => void;
  onPlayTick?: (remainingSeconds: number) => void;
  onPlayBuzzer?: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
  forceShow?: boolean;
  className?: string;
}

export function FullscreenCountdownOverlay({
  speaker,
  onExtendTime,
  onTogglePause,
  onFinishSpeech,
  onPlayTick,
  onPlayBuzzer,
  isMuted = false,
  onToggleMute,
  forceShow = false,
  className,
}: FullscreenCountdownOverlayProps) {
  const prevSecondsRef = useRef<number | null>(null);

  const remaining = speaker ? speaker.remainingSeconds : 0;
  const isCriticalWindow = remaining <= 10;
  const isTimeUp = remaining <= 0;
  const isVisible = !!speaker && (isCriticalWindow || forceShow);

  // Play audio triggers on countdown tick
  useEffect(() => {
    if (!speaker || speaker.isPaused) return;

    if (prevSecondsRef.current !== remaining) {
      prevSecondsRef.current = remaining;

      if (remaining > 0 && remaining <= 10) {
        onPlayTick?.(remaining);
      } else if (remaining === 0) {
        onPlayBuzzer?.();
      }
    }
  }, [remaining, speaker, onPlayTick, onPlayBuzzer]);

  if (!isVisible || !speaker) return null;

  const meta = TOKEN_DEFINITIONS[speaker.tokenType];
  const allocated = Math.max(1, speaker.allocatedSeconds);
  const progressPercent = Math.min(100, Math.max(0, (remaining / allocated) * 100));

  // Visual state styling
  const isSuperUrgent = remaining <= 3 && remaining > 0;
  const urgencyBg = isTimeUp
    ? "from-rose-950 via-red-900 to-slate-950"
    : isSuperUrgent
    ? "from-red-950 via-rose-900 to-slate-950"
    : isCriticalWindow
    ? "from-amber-950/90 via-sky-950 to-slate-950"
    : "from-sky-950 via-stone-900 to-slate-950";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className={cn(
          "fixed inset-0 z-50 flex flex-col justify-between p-6 sm:p-10 bg-gradient-to-b overflow-hidden select-none",
          urgencyBg,
          className
        )}
      >
        {/* Pulsating emergency vignette border effect on critical 10s */}
        {isCriticalWindow && (
          <motion.div
            animate={{
              opacity: isSuperUrgent ? [0.4, 0.85, 0.4] : [0.2, 0.5, 0.2],
            }}
            transition={{
              repeat: Infinity,
              duration: isSuperUrgent ? 0.5 : 1,
              ease: "easeInOut",
            }}
            className={cn(
              "absolute inset-0 pointer-events-none ring-inset ring-[14px] sm:ring-[20px]",
              isTimeUp
                ? "ring-red-600"
                : isSuperUrgent
                ? "ring-rose-500"
                : "ring-amber-500"
            )}
          />
        )}

        {/* Top Header Section */}
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide">
                PROYEKTOR KELAS AKTIF
              </span>
            </div>

            {speaker.isPaused && (
              <span className="px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-bold flex items-center gap-1.5 animate-pulse">
                <Pause className="w-3.5 h-3.5" /> DIJEDA
              </span>
            )}
          </div>

          {/* Quick Audio Toggle */}
          {onToggleMute && (
            <button
              onClick={onToggleMute}
              className="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center gap-2 text-xs font-semibold backdrop-blur-md transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              <span className="hidden sm:inline">{isMuted ? "Audio Bisu" : "Audio Nyala"}</span>
            </button>
          )}
        </div>

        {/* Center Countdown Display */}
        <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center space-y-6">
          {/* Active Student Card */}
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
              <span className="px-3.5 py-1 rounded-xl bg-white/15 text-white text-xs sm:text-sm font-bold tracking-wider backdrop-blur-md border border-white/20">
                #{speaker.deskNumber}
              </span>
              <TokenBadge type={speaker.tokenType} size="md" />
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
              {speaker.studentName}
            </h2>
          </div>

          {/* Giant Animated Number & Circular Ring */}
          <div className="relative flex items-center justify-center">
            {/* SVG Progress Ring */}
            <svg className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 -rotate-90 transform" viewBox="0 0 200 200">
              {/* Background Track */}
              <circle
                cx="100"
                cy="100"
                r="86"
                stroke="currentColor"
                strokeWidth="10"
                className="text-white/10"
                fill="transparent"
              />
              {/* Foreground Animated Ring */}
              <circle
                cx="100"
                cy="100"
                r="86"
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 86}
                strokeDashoffset={2 * Math.PI * 86 * (1 - progressPercent / 100)}
                strokeLinecap="round"
                className={cn(
                  "transition-all duration-300",
                  isTimeUp
                    ? "text-red-500"
                    : isSuperUrgent
                    ? "text-rose-500"
                    : isCriticalWindow
                    ? "text-amber-400"
                    : "text-sky-400"
                )}
                fill="transparent"
              />
            </svg>

            {/* Giant Number Inside Ring */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <AnimatePresence mode="popLayout">
                {isTimeUp ? (
                  <motion.div
                    key="timeup"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [1, 1.08, 1], opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="flex flex-col items-center text-red-400"
                  >
                    <AlertOctagon className="w-16 h-16 sm:w-20 sm:h-20 mb-2 animate-bounce" />
                    <span className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-wider text-white">
                      WAKTU HABIS
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-rose-300 mt-1">
                      Token Berhasil Digunakan
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key={remaining}
                    initial={{ scale: 1.35, opacity: 0.4 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.85, opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className="flex flex-col items-center"
                  >
                    <span
                      className={cn(
                        "text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter tabular-nums drop-shadow-xl",
                        isSuperUrgent
                          ? "text-rose-400"
                          : isCriticalWindow
                          ? "text-amber-300"
                          : "text-white"
                      )}
                    >
                      {remaining}
                    </span>
                    <span className="text-xs sm:text-sm font-bold tracking-widest text-slate-300 uppercase mt-[-8px]">
                      Detik Tersisa
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Subtitle Info */}
          <p className="text-xs sm:text-base text-slate-300 max-w-lg font-medium drop-shadow-sm">
            {meta.description}
          </p>
        </div>

        {/* Bottom Teacher Action Controls */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4 border-t border-white/10">
          {/* Pause / Resume Button */}
          {onTogglePause && (
            <button
              onClick={onTogglePause}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold flex items-center gap-2 text-sm backdrop-blur-md transition-all active:scale-95"
            >
              {speaker.isPaused ? (
                <>
                  <Play className="w-4 h-4 text-emerald-400" />
                  <span>Lanjutkan Timer</span>
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 text-amber-400" />
                  <span>Jeda Sementara</span>
                </>
              )}
            </button>
          )}

          {/* +15 Seconds Extension */}
          {onExtendTime && (
            <button
              onClick={() => onExtendTime(15)}
              className="px-5 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 border border-sky-400/40 text-white font-bold flex items-center gap-2 text-sm shadow-lg shadow-sky-600/30 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+15 Detik</span>
            </button>
          )}

          {/* Finish Gracefully */}
          {onFinishSpeech && (
            <button
              onClick={onFinishSpeech}
              className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 border border-rose-400/40 text-white font-bold flex items-center gap-2 text-sm shadow-lg shadow-rose-600/30 transition-all active:scale-95"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>Selesai Bicara</span>
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default FullscreenCountdownOverlay;

