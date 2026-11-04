"use client";

import React, { useState, useEffect } from "react";
import { X, UserPlus, Users, Hash, Coins } from "lucide-react";
import { Student } from "@/types/session";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  classNameTitle: string;
  suggestedDeskNumber: number;
  tokensPerStudent: number;
  onAddStudent: (newStudentData: {
    name: string;
    deskNumber: number;
    tokensQuota: number;
  }) => void;
}

export function AddStudentModal({
  isOpen,
  onClose,
  classNameTitle,
  suggestedDeskNumber,
  tokensPerStudent,
  onAddStudent,
}: AddStudentModalProps) {
  const [name, setName] = useState("");
  const [deskNumber, setDeskNumber] = useState<number | "">(suggestedDeskNumber);
  const [tokensQuota, setTokensQuota] = useState(tokensPerStudent);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setDeskNumber(suggestedDeskNumber);
      setTokensQuota(tokensPerStudent);
      setName("");
      setErrorMessage("");
    }
  }, [isOpen, suggestedDeskNumber, tokensPerStudent]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Silakan masukkan nama siswa.");
      return;
    }
    if (!deskNumber || Number(deskNumber) < 1) {
      setErrorMessage("Nomor urut / absen siswa harus valid.");
      return;
    }

    onAddStudent({
      name: name.trim(),
      deskNumber: Number(deskNumber),
      tokensQuota: Number(tokensQuota) || tokensPerStudent,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Tambah Siswa Baru</h3>
              <p className="text-xs text-sky-100 mt-0.5">{classNameTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          {/* Nama Siswa */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              Nama Lengkap Siswa <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Muhammad Alfarizi"
              required
              autoFocus
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all"
            />
          </div>

          {/* Nomor Meja & Jatah Token */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-sky-600" />
                <span>Nomor Urut / Absen</span>
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={deskNumber}
                onChange={(e) =>
                  setDeskNumber(e.target.value === "" ? "" : Number(e.target.value))
                }
                required
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-sky-600" />
                <span>Jatah Token Bicara</span>
              </label>
              <input
                type="number"
                min={1}
                max={6}
                value={tokensQuota}
                onChange={(e) => setTokensQuota(Number(e.target.value))}
                required
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
              />
            </div>
          </div>

          <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-100 text-[11px] text-slate-600 flex items-start gap-2 leading-relaxed">
            <Users className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span>
              Siswa yang ditambahkan akan otomatis mendapatkan kartu bicara digital dengan {tokensQuota} token dan langsung dapat dipanggil dalam sesi diskusi kelas.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white text-xs font-bold shadow-md shadow-sky-500/20 active:scale-[0.99] transition-all flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Simpan &amp; Tambah Siswa</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

