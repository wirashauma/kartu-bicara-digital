"use client";

import React from "react";
import { X, HelpCircle } from "lucide-react";

export interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FaqModal({ isOpen, onClose }: FaqModalProps) {
  if (!isOpen) return null;

  const faqs = [
    {
      q: "Apa itu Kartu Bicara Digital?",
      a: "Kartu Bicara Digital adalah media pembelajaran interaktif berbasis web yang mengadaptasi model pembelajaran kooperatif Time Token Arends. Aplikasi ini memastikan setiap siswa memperoleh kesempatan berbicara yang adil, setara, dan bertanggung jawab.",
    },
    {
      q: "Bagaimana cara kerja kuota token bicara?",
      a: "Setiap siswa diberikan sejumlah kuota kartu bicara (standar 3 token). Setiap kali siswa menyampaikan kontribusi di kelas, satu keping token akan digunakan dan durasi bicara dihitung melalui timer digital terpadu.",
    },
    {
      q: "Apa tujuan dari penanda Belum Bicara (Idle Flag)?",
      a: "Penanda berbingkai kuning (Idle) berfungsi mengingatkan guru secara visual mengenai siswa yang belum pernah berbicara sama sekali. Model Arends menekankan prioritas giliran bicara kepada siswa tersebut agar tidak terjadi monopoli pembicaraan oleh siswa yang dominan.",
    },
    {
      q: "Apa saja 4 kategori taksonomi kontribusi?",
      a: "Taksonomi kontribusi terdiri dari: Bertanya (mengajukan pertanyaan kritis), Menjawab (memberikan solusi atau penjelasan), Berpendapat (menyampaikan sudut pandang atau argumen logis), dan Menanggapi (memberikan tanggapan santun terhadap pendapat rekan).",
    },
    {
      q: "Bagaimana sistem pengingat waktu (audio warning) bekerja?",
      a: "Sistem Web Audio API secara otomatis membunyikan detak peringatan (tick beep) saat waktu bicara tersisa 10 detik atau kurang, dan membunyikan bel akhir (buzzer) saat durasi waktu bicara telah habis.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-sky-100 p-6 z-10 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-sky-50 pb-3 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-sky-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Pertanyaan Umum (FAQ)</h3>
              <p className="text-xs text-slate-400">Panduan penggunaan Kartu Bicara Digital Model Arends</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 pt-1">
          {faqs.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl bg-sky-50/40 border border-sky-100 space-y-1.5"
            >
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-start gap-2">
                <span className="w-5 h-5 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5 border border-sky-200/60">
                  {index + 1}
                </span>
                <span>{item.q}</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-7">
                {item.a}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-sky-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export default FaqModal;

