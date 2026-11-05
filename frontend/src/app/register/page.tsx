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
} from "lucide-react";
import { Role } from "@/types/session";
import { setStoredUser, DEMO_TEACHER, DEMO_STUDENT, AuthUser } from "@/lib/auth";
import { registerWithFirebase } from "@/lib/firebaseAuth";
import { BrandLogo } from "@/components/BrandLogo";
import { GoogleIcon } from "@/components/GoogleIcon";
import { AuthIllustration } from "@/components/AuthIllustration";

export default function RegisterPage() {
  const router = useRouter();

  // Peran: Guru vs Siswa
  const [role, setRole] = useState<Role>("TEACHER");

  // Kolom Formulir Bersih (Nama Lengkap, Asal Sekolah & Nomor Meja ditiadakan)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Status Tampilan
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Akses Cepat Demo (1-Click)
  const handleQuickDevLogin = (targetRole: Role) => {
    const user: AuthUser = targetRole === "TEACHER" ? DEMO_TEACHER : DEMO_STUDENT;
    setStoredUser(user);
    setSuccessMessage(`Berhasil masuk sebagai ${user.name}`);
    setTimeout(() => {
      router.push("/");
    }, 350);
  };

  // Daftar Akun dengan Google
  const handleGoogleRegister = () => {
    setIsLoading(true);
    setErrorMessage("");
    setTimeout(() => {
      setIsLoading(false);
      const user: AuthUser =
        role === "TEACHER"
          ? {
              id: `google-teacher-${Date.now()}`,
              name: "Pendidik Baru (Google)",
              email: "guru.baru@gmail.com",
              role: "TEACHER",
              school: "SMAN 1 Teladan",
              subject: "Bahasa & Sosiologi",
            }
          : {
              id: `google-std-${Date.now()}`,
              name: "Siswa Baru (Google)",
              email: "siswa.baru@gmail.com",
              role: "STUDENT",
              school: "SMAN 1 Teladan",
              className: "Kelas XI MIPA 1",
            };
      setStoredUser(user);
      setSuccessMessage("Pendaftaran akun Google berhasil!");
      setTimeout(() => {
        router.push("/");
      }, 400);
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Silakan lengkapi alamat email dan kata sandi.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Kata sandi minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok dengan kata sandi.");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("Anda harus menyetujui Ketentuan Layanan & Kebijakan Privasi.");
      return;
    }

    setIsLoading(true);

    try {
      const namePrefix = email.split("@")[0].replace(/[._]/g, " ");
      const formattedName = namePrefix
        ? namePrefix.replace(/\b\w/g, (c) => c.toUpperCase())
        : role === "TEACHER"
        ? "Guru Baru"
        : "Siswa Baru";

      const res = await registerWithFirebase({
        email: email.trim(),
        password,
        role,
        name: formattedName,
        className: role === "STUDENT" ? "Kelas X.E3" : undefined,
        school: "SMAN 1 Teladan",
      });

      setIsLoading(false);

      if (res.success && res.user) {
        setSuccessMessage("Akun berhasil didaftarkan di Firebase! Mengalihkan...");
        setTimeout(() => {
          router.replace("/");
        }, 300);
      } else {
        setErrorMessage(res.message || "Gagal mendaftarkan akun.");
      }
    } catch {
      setIsLoading(false);
      setErrorMessage("Terjadi kesalahan sistem saat mendaftarkan akun.");
    }
  };

  return (
    <div className="h-screen max-h-screen w-full flex items-center justify-center p-3 sm:p-5 md:p-6 bg-gradient-to-br from-sky-50/70 via-slate-50 to-blue-50/50 font-sans text-slate-800 antialiased selection:bg-sky-100 selection:text-sky-900 overflow-hidden relative">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* ======================================================== */}
      {/* FLOATING CARD CONTAINER (Identik dengan Login, Pas 1 Layar Tanpa Scroll) */}
      {/* ======================================================== */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl shadow-sky-950/6 border border-sky-100 overflow-hidden grid grid-cols-1 lg:grid-cols-2 relative z-10 my-auto">
        
        {/* KOLOM KIRI: Formulir Pendaftaran */}
        <div className="p-6 sm:p-8 lg:p-9 flex flex-col justify-center">
          <div className="max-w-[370px] w-full mx-auto">
            {/* Logo Brand KBD */}
            <div className="mb-3">
              <div className="inline-block">
                <BrandLogo size={44} showText={false} />
              </div>
            </div>

            {/* Judul & Subjudul dalam Bahasa Indonesia yang Lega & Nyaman */}
            <div className="mb-4">
              <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight">
                Buat Akun Baru
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                Daftar untuk mengelola ruang diskusi &amp; keaktifan siswa.
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

            {/* FORMULIR PENDAFTARAN (Bersih & Rapi: Email + Sandi + Konfirmasi Sandi) */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Alamat Email */}
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
                      role === "TEACHER" ? "guru@sekolah.sch.id" : "siswa@sekolah.sch.id"
                    }
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all shadow-2xs"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Kata Sandi & Konfirmasi Sandi (2 Kolom Sejajar Proporsional) */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 karakter"
                      required
                      className="w-full px-3 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Konfirmasi Sandi
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi sandi"
                      required
                      className="w-full px-3 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Persetujuan Syarat & Privasi */}
              <div className="pt-0.5">
                <label className="inline-flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300 accent-sky-600 cursor-pointer shrink-0"
                  />
                  <span>
                    Saya menyetujui{" "}
                    <span className="font-semibold text-sky-600 hover:underline">Ketentuan Layanan</span> &amp;{" "}
                    <span className="font-semibold text-sky-600 hover:underline">Privasi</span> KBD.
                  </span>
                </label>
              </div>

              {/* Tombol Daftar Akun */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold text-sm shadow-md shadow-sky-500/20 active:scale-[0.99] transition-all disabled:opacity-70 disabled:pointer-events-none"
              >
                {isLoading ? "Membuat Akun..." : "Daftar Akun Baru"}
              </button>
            </form>

            {/* Garis Pembagi */}
            <div className="relative my-3.5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-3 text-xs text-slate-400 font-medium">
                Atau daftar dengan
              </span>
            </div>

            {/* Tombol Daftar dengan Google */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-2xs hover:border-slate-300 active:scale-[0.99] transition-all"
            >
              <GoogleIcon className="w-4 h-4 shrink-0" />
              <span>Daftar dengan Google</span>
            </button>

            {/* Tautan Masuk */}
            <p className="text-xs sm:text-sm text-slate-600 text-center mt-3.5">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="font-semibold text-sky-600 hover:text-sky-700 underline underline-offset-2 ml-1"
              >
                Masuk di sini
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
          tagline="Komunitas Pendidik Digital"
          subtext="Bangun budaya kelas yang berani berpendapat, kritis, dan santun."
        />
      </div>
    </div>
  );
}
