"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  Lightbulb,
  MessageSquare,
  Repeat2,
  Clock,
  Coins,
  X,
  Check,
  ChevronRight,
} from "lucide-react";
import { Student, TokenType, TOKEN_DEFINITIONS } from "@/types/session";
import { cn } from "@/lib/utils";

export interface TypeSelectorModalProps {
  isOpen: boolean;
  student: Student | null;
  defaultDurationSeconds?: number;
  onClose: () => void;
  onConfirm: (selectedType: TokenType, durationSeconds: number) => void;
}

const DURATION_PRESETS = [
  { seconds: 30, label: "30s", desc: "Ringkas" },
  { seconds: 60, label: "60s", desc: "Standar" },
  { seconds: 90, label: "90s", desc: "Mendalam" },
  { seconds: 120, label: "120s", desc: "Debat" },
];

export function TypeSelectorModal({
  isOpen,
  student,
  defaultDurationSeconds = 60,
  onClose,
  onConfirm,
}: TypeSelectorModalProps) {
  const [selectedType, setSelectedType] = useState<TokenType>("BERPENDAPAT");
  const [selectedDuration, setSelectedDuration] = useState<number>(defaultDurationSeconds);

  if (!isOpen || !student) return null;

  const currentMeta = TOKEN_DEFINITIONS[selectedType];
  const hasRemainingToken = student.remainingTokens > 0;

  const handleConfirm = () => {
    if (!hasRemainingToken) return;
    onConfirm(selectedType, selectedDuration);
  };

  const taxonomyItems: {
    type: TokenType;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    borderActive: string;
    bgActive: string;
    shadowActive: string;
  }[] = [
    {
      type: "BERTANYA",
      icon: HelpCircle,
      accentColor: "text-pink-600",
      borderActive: "border-pink-500",
      bgActive: "bg-pink-50/80",
      shadowActive: "shadow-pink-100",
    },
    {
      type: "MENJAWAB",
      icon: Lightbulb,
      accentColor: "text-amber-600",
      borderActive: "border-amber-500",
      bgActive: "bg-amber-50/80",
      shadowActive: "shadow-amber-100",
    },
    {
      type: "BERPENDAPAT",
      icon: MessageSquare,
      accentColor: "text-cyan-600",
      borderActive: "border-cyan-500",
      bgActive: "bg-cyan-50/80",
      shadowActive: "shadow-cyan-100",
    },
    {
      type: "MENANGGAPI",
      icon: Repeat2,
      accentColor: "text-emerald-600",
      borderActive: "border-emerald-500",
      bgActive: "bg-emerald-50/80",
      shadowActive: "shadow-emerald-100",
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop dengan blur lembut */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Container: Putih Modern Elegan */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-sky-100 overflow-hidden z-10"
        >
          {/* Header: Hijau Sage Modern + Putih */}
          <div className="px-6 py-5 bg-gradient-to-r from-sky-700 via-sky-600 to-sky-500 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center font-bold text-white shadow-inner">
                {student.deskNumber ? `#${student.deskNumber}` : "M"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/25 text-white border border-white/30">
                    Klaim Kartu Bicara
                  </span>
                  <span className="text-xs text-sky-100 font-medium">
                    #{student.deskNumber}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
                  {student.name}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-sky-100 hover:text-white hover:bg-white/15 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Status Kuota Siswa */}
            <div
              className={cn(
                "p-3.5 rounded-2xl border flex items-center justify-between text-xs sm:text-sm",
                hasRemainingToken
                  ? "bg-sky-50/80 border-sky-100"
                  : "bg-rose-50 border-rose-200 text-rose-800"
              )}
            >
              <div className="flex items-center gap-2">
                <Coins className={cn("w-4 h-4", hasRemainingToken ? "text-sky-600" : "text-rose-600")} />
                <span className="font-semibold text-slate-700">
                  Sisa Kuota Token:
                </span>
                <span
                  className={cn(
                    "font-black px-2 py-0.5 rounded-lg",
                    hasRemainingToken
                      ? "bg-sky-100 text-sky-800 border border-sky-200/60"
                      : "bg-rose-100 text-rose-700"
                  )}
                >
                  {student.remainingTokens} / {student.tokensQuota} Token
                </span>
              </div>
              {!hasRemainingToken && (
                <span className="font-bold text-rose-600 text-xs">
                  Kuota Habis
                </span>
              )}
            </div>

            {/* Pilihan 4 Kategori Taksonomi */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                Pilih Taksonomi Kontribusi (Model Arends):
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {taxonomyItems.map((item) => {
                  const meta = TOKEN_DEFINITIONS[item.type];
                  const Icon = item.icon;
                  const isChosen = selectedType === item.type;

                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setSelectedType(item.type)}
                      className={cn(
                        "relative p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between group",
                        isChosen
                          ? cn("border-2 shadow-md", item.borderActive, item.bgActive, item.shadowActive)
                          : "border-sky-100/90 bg-white hover:border-sky-300 hover:bg-sky-50/40"
                      )}
                    >
                      <div className="flex items-start justify-between w-full mb-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={cn(
                              "w-9 h-9 rounded-xl flex items-center justify-center font-bold transition-colors",
                              isChosen
                                ? cn(meta.solidBgClass, "text-white shadow-xs")
                                : cn(meta.lightBgClass, item.accentColor)
                            )}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-slate-900 block">
                              {meta.label}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400">
                              Kategori {item.type}
                            </span>
                          </div>
                        </div>

                        {isChosen ? (
                          <div
                            className={cn(
                              "w-5 h-5 rounded-full flex items-center justify-center text-white text-xs",
                              meta.solidBgClass
                            )}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-slate-300 group-hover:border-sky-400" />
                        )}
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed">
                        {meta.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pilihan Alokasi Waktu (Timer Presets) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                  Alokasi Waktu Berbicara:
                </span>
                <span className="font-bold text-sky-700">
                  {selectedDuration} Detik Terpilih
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {DURATION_PRESETS.map((preset) => {
                  const isActive = selectedDuration === preset.seconds;
                  return (
                    <button
                      key={preset.seconds}
                      type="button"
                      onClick={() => setSelectedDuration(preset.seconds)}
                      className={cn(
                        "py-2.5 px-2 rounded-xl text-center border font-bold transition-all text-xs sm:text-sm",
                        isActive
                          ? "bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-200"
                          : "bg-sky-50/60 text-slate-700 border-sky-100 hover:bg-sky-100"
                      )}
                    >
                      <div>{preset.label}</div>
                      <div
                        className={cn(
                          "text-[10px] font-medium tracking-tight",
                          isActive ? "text-sky-100" : "text-slate-400"
                        )}
                      >
                        {preset.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="px-6 py-4 bg-sky-50/40 border-t border-sky-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-sky-200 text-slate-600 font-semibold hover:bg-white hover:text-slate-900 transition-colors text-sm"
            >
              Batal
            </button>

            <button
              type="button"
              disabled={!hasRemainingToken}
              onClick={handleConfirm}
              className={cn(
                "flex-1 sm:flex-none sm:min-w-[200px] px-6 py-2.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all transform active:scale-95",
                hasRemainingToken
                  ? cn(currentMeta.solidBgClass, "hover:opacity-95 shadow-sky-600/20")
                  : "bg-slate-300 cursor-not-allowed text-slate-500 shadow-none"
              )}
            >
              <span>Mulai Bicara Sekarang</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default TypeSelectorModal;
