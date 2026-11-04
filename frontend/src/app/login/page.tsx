"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Zap,
  Presentation,
  GraduationCap,
  X,
} from "lucide-react";
import { Role } from "@/types/session";
import { setStoredUser, DEMO_TEACHER, DEMO_STUDENT, AuthUser } from "@/lib/auth";
import { BrandLogo } from "@/components/BrandLogo";
import { GoogleIcon } from "@/components/GoogleIcon";
import { AuthIllustration } from "@/components/AuthIllustration";

export default function LoginPage() {
  const router = useRouter();

  // Peran: Guru vs Siswa
  const [role, setRole] = useState<Role>("TEACHER");

  // Input Formulir (Guru & Siswa sama-sama menggunakan Email dan Kata Sandi)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Status Tampilan
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Akses Cepat Demo (1-Click)
  const handleQuickDevLogin = (targetRole: Role) => {
    const user: AuthUser = targetRole === "TEACHER" ? DEMO_TEACHER : DEMO_STUDENT;
    setStoredUser(user);
    setSuccessMessage(`Berhasil masuk sebagai ${user.name}`);
    setTimeout(() => {
      router.push("/");
    }, 350);
  };

  // Masuk dengan Google
  const handleGoogleLogin = () => {
    setIsLoading(true);
    setErrorMessage("");
    setTimeout(() => {
      setIsLoading(false);
      const user: AuthUser =
        role === "TEACHER"
          ? {
              id: "google-teacher-1",
              name: "Dra. Sri Wahyuni (Google)",
              email: "sri.wahyuni.edu@gmail.com",
              role: "TEACHER",
              school: "SMAN 1 Teladan",
              subject: "Sosiologi / Bahasa Indonesia",
            }
          : {
              id: "google-std-1",
              name: "Ananda Rizky (Google)",
              email: "ananda.rizky.std@gmail.com",
              role: "STUDENT",
              school: "SMAN 1 Teladan",
              className: "Kelas XI MIPA 1",
            };
      setStoredUser(user);
      setSuccessMessage("Berhasil masuk dengan akun Google!");
      setTimeout(() => {
        router.push("/");
      }, 350);
    }, 500);
  };

  // Kirim Formulir Masuk (Berlaku untuk Guru & Siswa via Email & Sandi)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Silakan lengkapi alamat email dan kata sandi.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const user: AuthUser =
        role === "TEACHER"
          ? {
              id: "teacher-1",
              name: email.toLowerCase().includes("sri") ? DEMO_TEACHER.name : "Bapak/Ibu Guru",
              email: email.trim(),
              role: "TEACHER",
              school: "SMAN 1 Teladan",
              subject: "Sosiologi / Bahasa Indonesia",
            }
          : {
              id: "student-1",
              name: email.toLowerCase().includes("ananda") ? DEMO_STUDENT.name : "Ananda Rizky",
              email: email.trim(),
              role: "STUDENT",
              school: "SMAN 1 Teladan",
              className: "Kelas XI MIPA 1",
            };
      setStoredUser(user);
      router.push("/");
    }, 350);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setIsForgotModalOpen(false);
      setForgotSuccess(false);
      setForgotEmail("");
      setSuccessMessage("Tautan reset kata sandi telah dikirim ke email Anda.");
    }, 1000);
  };

  return (
    <div className="h-screen max-h-screen w-full flex items-center justify-center p-3 sm:p-5 md:p-6 bg-gradient-to-br from-sky-50/70 via-slate-50 to-blue-50/50 font-sans text-slate-800 antialiased selection:bg-sky-100 selection:text-sky-900 overflow-hidden relative">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* ======================================================== */}
      {/* FLOATING CARD CONTAINER (Proporsional, Bebas Scroll) */}
      {/* ======================================================== */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl shadow-sky-950/6 border border-sky-100 overflow-hidden grid grid-cols-1 lg:grid-cols-2 relative z-10 my-auto">
        
        {/* KOLOM KIRI: Formulir Masuk */}
        <div className="p-6 sm:p-8 lg:p-9 flex flex-col justify-center">
          <div className="max-w-[370px] w-full mx-auto">
            {/* Logo Brand KBD */}
            <div className="mb-3">
              <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
                <BrandLogo size={32} showText={false} />
              </Link>
            </div>

            {/* Judul & Subjudul dalam Bahasa Indonesia yang Lega */}
            <div className="mb-4">
              <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight">
                Selamat Datang
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                Masuk ke ruang diskusi kelas &amp; kartu bicara digital.
              </p>
            </div>

            {/* Pemilih Peran (Guru & Siswa tanpa tanda kurung) */}
            <div className="grid grid-cols-2 p-1 bg-slate-100/80 rounded-xl gap-1 mb-4 border border-slate-200/50">
              <button
                type="button"
                onClick={() => {
                  setRole("TEACHER");
                  setErrorMessage("");
                }}
                className={`py-2 px-3 rounded-lg font-semibold text-xs sm:text-[13px] flex items-center justify-center gap-2 transition-all duration-200 ${
                  role === "TEACHER"
                    ? "bg-white text-sky-700 shadow-xs font-bold border border-slate-200/60"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Presentation className="w-3.5 h-3.5 text-sky-600" />
                <span>Guru</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole("STUDENT");
                  setErrorMessage("");
                }}
                className={`py-2 px-3 rounded-lg font-semibold text-xs sm:text-[13px] flex items-center justify-center gap-2 transition-all duration-200 ${
                  role === "STUDENT"
                    ? "bg-white text-sky-700 shadow-xs font-bold border border-slate-200/60"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
                <span>Siswa</span>
              </button>
            </div>

            {/* Pesan Kesalahan & Sukses */}
            {errorMessage && (
              <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* FORMULIR MASUK (Sama untuk Guru & Siswa: Email + Kata Sandi) */}
            <form onSubmit={handleLogin} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  {role === "TEACHER" ? "Email Guru / Institusi" : "Email Siswa"}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      role === "TEACHER" ? "nama.guru@sekolah.sch.id" : "nama.siswa@sekolah.sch.id"
                    }
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all shadow-2xs"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    required
                    className="w-full px-3.5 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-0.5 text-xs text-slate-600">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300 accent-sky-600 cursor-pointer"
                  />
                  <span>Ingat saya</span>
                </label>

                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="font-semibold text-sky-600 hover:text-sky-700 hover:underline transition-colors"
                >
                  Lupa kata sandi?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold text-sm shadow-md shadow-sky-500/20 active:scale-[0.99] transition-all disabled:opacity-70 disabled:pointer-events-none"
              >
                {isLoading ? "Memproses..." : "Masuk ke Akun"}
              </button>
            </form>

            {/* Garis Pembagi yang Rapi */}
            <div className="relative my-3.5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-3 text-xs text-slate-400 font-medium">
                Atau masuk dengan
              </span>
            </div>

            {/* Tombol Masuk dengan Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-2xs hover:border-slate-300 active:scale-[0.99] transition-all"
            >
              <GoogleIcon className="w-4 h-4 shrink-0" />
              <span>Masuk dengan Google</span>
            </button>

            {/* Tautan Daftar yang Jelas & Terpisah */}
            <p className="text-xs sm:text-sm text-slate-600 text-center mt-3.5">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="font-semibold text-sky-600 hover:text-sky-700 underline underline-offset-2 ml-1"
              >
                Daftar sekarang
              </Link>
            </p>

            {/* Akses Cepat Demo (Minimalist, Rapi di Bagian Bawah) */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="text-slate-500 font-medium">Demo Cepat:</span>
                <button
                  type="button"
                  onClick={() => handleQuickDevLogin("TEACHER")}
                  className="font-semibold text-sky-600 hover:text-sky-700 hover:underline"
                >
                  Guru
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => handleQuickDevLogin("STUDENT")}
                  className="font-semibold text-sky-600 hover:text-sky-700 hover:underline"
                >
                  Siswa
                </button>
              </div>
              <span>v1.2</span>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Gambar Ilustrasi */}
        <AuthIllustration
          tagline="Model Pembelajaran Kooperatif Arends"
          subtext="Diskusi kelas lebih aktif, adil, dan teratur dengan kartu bicara interaktif."
        />
      </div>

      {/* MODAL: Lupa Kata Sandi */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl border border-slate-100 space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Atur Ulang Kata Sandi</h3>
              <button
                onClick={() => setIsForgotModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Masukkan alamat email Anda untuk menerima tautan pembuatan kata sandi baru.
            </p>

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="nama.guru@sekolah.sch.id"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
              />

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="w-1/2 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs"
                >
                  {forgotSuccess ? "Terkirim!" : "Kirim Tautan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
