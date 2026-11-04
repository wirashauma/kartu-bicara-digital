"use client";

import React, { useState, useEffect } from "react";
import { X, User, Mail, Building2, BookOpen, Check } from "lucide-react";
import { AuthUser, setStoredUser } from "@/lib/auth";

export interface EditProfileModalProps {
  isOpen: boolean;
  currentUser: AuthUser | null;
  onClose: () => void;
  onProfileUpdated: (updatedUser: AuthUser) => void;
}

export function EditProfileModal({
  isOpen,
  currentUser,
  onClose,
  onProfileUpdated,
}: EditProfileModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const [subject, setSubject] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setEmail(currentUser.email || "");
      setSchool(currentUser.school || "");
      setSubject(currentUser.subject || "");
    }
  }, [currentUser]);

  if (!isOpen || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AuthUser = {
      ...currentUser,
      name: name.trim(),
      email: email.trim(),
      school: school.trim(),
      subject: subject.trim(),
    };
    setStoredUser(updated);
    onProfileUpdated(updated);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl border border-sky-100 p-6 z-10 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-sky-50 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Edit Profil Pengguna</h3>
            <p className="text-xs text-slate-400">Perbarui informasi identitas akun Anda</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {saved && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Profil berhasil diperbarui</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Nama Lengkap:</label>
            <div className="relative">
              <User className="w-4 h-4 text-sky-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 bg-sky-50/40 border border-sky-100 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400/20 focus:border-sky-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Email:</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-sky-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 bg-sky-50/40 border border-sky-100 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400/20 focus:border-sky-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Asal Sekolah:</label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-sky-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-sky-50/40 border border-sky-100 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400/20 focus:border-sky-500"
              />
            </div>
          </div>

          {currentUser.role === "TEACHER" && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Mata Pelajaran:</label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-sky-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-sky-50/40 border border-sky-100 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400/20 focus:border-sky-500"
                />
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;

