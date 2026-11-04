"use client";

import React, { useState } from "react";
import { X, Plus, BookOpen, Clock, Coins, Sparkles, Hash } from "lucide-react";
import { ClassRoom } from "@/types/session";

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClass: (newClass: Omit<ClassRoom, "id" | "createdAt" | "students">) => void;
}

export function AddClassModal({ isOpen, onClose, onAddClass }: AddClassModalProps) {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("Kelas XI");
  const [topic, setTopic] = useState("");
  const [academicYear, setAcademicYear] = useState("2024/2025");
  const [tokensPerStudent, setTokensPerStudent] = useState(3);
  const [speechTimeLimitSeconds, setSpeechTimeLimitSeconds] = useState(60);
  const [sessionPin, setSessionPin] = useState("TT-8080");
  const [errorMessage, setErrorMessage] = useState("");

  // Generate kode PIN baru setiap kali modal dibuka di sisi client
  React.useEffect(() => {
    if (isOpen) {
      setSessionPin(`TT-${Math.floor(1000 + Math.random() * 9000)}`);
      setErrorMessage("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage("Nama kelas wajib diisi.");
      return;
    }
    if (!subject.trim()) {
      setErrorMessage("Mata pelajaran wajib diisi.");
      return;
    }

    onAddClass({
      name: name.trim(),
      subject: subject.trim(),
      grade,
      sessionPin: sessionPin.trim().toUpperCase(),
      topic: topic.trim() || "Diskusi Terbuka Model Arends",
      tokensPerStudent: Number(tokensPerStudent) || 3,
      speechTimeLimitSeconds: Number(speechTimeLimitSeconds) || 60,
      academicYear,
    });

    // Reset Form
    setName("");
    setSubject("");
    setTopic("");
    setSessionPin(`TT-${Math.floor(1000 + Math.random() * 9000)}`);
    setErrorMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="px-6 py-4.5 bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Tambah Kelas Baru</h3>
              <p className="text-xs text-sky-100 mt-0.5">
                Buat ruang diskusi kelas untuk Model Time Token Arends
              </p>
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

          {/* Nama Kelas & Tingkat */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Nama Kelas <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Kelas XI MIPA 3"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Tingkat
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all"
              >
                <option value="Kelas X">Kelas X</option>
                <option value="Kelas XI">Kelas XI</option>
                <option value="Kelas XII">Kelas XII</option>
                <option value="Umum">Umum</option>
              </select>
            </div>
          </div>

          {/* Mata Pelajaran & Tahun Ajaran */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Mata Pelajaran <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Contoh: Sosiologi"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                Tahun Ajaran
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="2024/2025"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all"
              />
            </div>
          </div>

          {/* Topik Diskusi */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              Topik Pembahasan / Tema Diskusi
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Contoh: Dinamika Sosial & Perubahan Budaya"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all"
            />
          </div>

          {/* Konfigurasi Sesi: Jatah Token & Durasi Waktu */}
          <div className="p-3.5 bg-sky-50/60 rounded-2xl border border-sky-100 grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-sky-600" />
                <span>Jatah Token</span>
              </label>
              <input
                type="number"
                min={1}
                max={6}
                value={tokensPerStudent}
                onChange={(e) => setTokensPerStudent(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center text-slate-900 focus:outline-none focus:border-sky-500"
              />
              <span className="text-[10px] text-slate-400 block text-center">kartu / siswa</span>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-sky-600" />
                <span>Waktu Bicara</span>
              </label>
              <input
                type="number"
                min={15}
                max={300}
                step={15}
                value={speechTimeLimitSeconds}
                onChange={(e) => setSpeechTimeLimitSeconds(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center text-slate-900 focus:outline-none focus:border-sky-500"
              />
              <span className="text-[10px] text-slate-400 block text-center">detik / kartu</span>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-sky-600" />
                <span>PIN Kelas</span>
              </label>
              <input
                type="text"
                value={sessionPin}
                onChange={(e) => setSessionPin(e.target.value.toUpperCase())}
                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-center text-slate-900 focus:outline-none focus:border-sky-500 uppercase tracking-wider"
              />
              <span className="text-[10px] text-slate-400 block text-center">kode gabung</span>
            </div>
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
              <Plus className="w-4 h-4" />
              <span>Buat Kelas Sekarang</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
