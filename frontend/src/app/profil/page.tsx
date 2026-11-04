"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Building2,
  BookOpen,
  Shield,
  Save,
  CheckCircle2,
  LogOut,
  Sliders,
  School,
  Key,
  BadgeCheck,
  Phone,
  Clock,
  Layers,
  ChevronDown,
  LayoutDashboard,
  HelpCircle,
} from "lucide-react";
import {
  AuthUser,
  getStoredUser,
  setStoredUser,
  clearStoredUser,
  DEMO_TEACHER,
} from "@/lib/auth";
import { ConfirmModal } from "@/components/ConfirmModal";
import { ProfilePageSkeleton } from "@/components/skeletons";
import { cn } from "@/lib/utils";

type ProfileTab = "INFO" | "PREFERENCES" | "SECURITY";

export default function ProfilePage() {
  const router = useRouter();

  // State Pengguna
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeTab, setActiveTab] = useState<ProfileTab>("INFO");
  const [isLoaded, setIsLoaded] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    school: "",
    subject: "",
    nip: "",
    phone: "",
    bio: "",
    // Preferensi
    defaultDuration: 60,
    defaultTokens: 3,
    soundEffects: true,
    // Keamanan
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notifikasi & Modal
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isPasswordSuccess, setIsPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Dropdown Profil Bulat di Navbar
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Muat data profil saat komponen siap
  useEffect(() => {
    const timer = setTimeout(() => {
      const stored = getStoredUser() || DEMO_TEACHER;
      setUser(stored);
      setFormData((prev) => ({
        ...prev,
        name: stored.name || "",
        email: stored.email || "",
        school: stored.school || "SMAN 1 Teladan",
        subject: stored.subject || "Sosiologi / Bahasa Indonesia",
        nip: "19840512 200801 2 006",
        phone: "+62 812-3456-7890",
        bio: "Guru penggerak yang berdedikasi membangun iklim diskusi kelas yang adil, kritis, dan berkarakter melalui model kooperatif Time Token Arends.",
      }));
      setIsLoaded(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Simpan Perubahan Data Diri
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updatedUser: AuthUser = {
      ...user,
      name: formData.name.trim(),
      email: formData.email.trim(),
      school: formData.school.trim(),
      subject: formData.subject.trim(),
    };

    setStoredUser(updatedUser);
    setUser(updatedUser);

    setSaveSuccessMessage("Profil Anda berhasil diperbarui dan disimpan.");
    setTimeout(() => {
      setSaveSuccessMessage(null);
    }, 3500);
  };

  // Simpan Kata Sandi
  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!formData.newPassword) {
      setPasswordError("Silakan masukkan kata sandi baru.");
      return;
    }

    if (formData.newPassword.length < 6) {
      setPasswordError("Kata sandi baru minimal harus 6 karakter.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordError("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    setIsPasswordSuccess(true);
    setFormData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));

    setTimeout(() => {
      setIsPasswordSuccess(false);
    }, 3500);
  };

  // Logout
  const handleLogout = () => {
    clearStoredUser();
    router.push("/login");
  };

  if (!isLoaded) {
    return <ProfilePageSkeleton />;
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "G";

  return (
    <div className="min-h-screen bg-[#F0F7FF] text-slate-900 flex flex-col font-sans">
      {/* ======================================================== */}
      {/* 1. TOP NAVBAR KHUSUS HALAMAN PROFIL                      */}
      {/* ======================================================== */}
      <header className="w-full bg-gradient-to-r from-sky-600 via-sky-600 to-blue-600 border-b border-sky-500/40 text-white shadow-sm sticky top-0 z-30 select-none">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs sm:text-sm font-bold text-white transition-all group"
              title="Kembali ke Dashboard Kelas"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Kembali</span>
            </Link>

            <div className="h-5 w-px bg-white/20 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white text-sky-700 flex items-center justify-center font-black text-xs shadow-sm">
                KBD
              </div>
              <span className="text-sm font-black text-white tracking-tight hidden sm:inline">
                Profil Pengguna
              </span>
            </div>
          </div>

          {/* SISI KANAN: Avatar Profil Bulat dengan Dropdown Persis di Dashboard */}
          <div className="relative pl-1 shrink-0" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-2xl hover:bg-white/15 border border-transparent hover:border-white/15 transition-all focus:outline-none"
              title="Menu Profil Pengguna"
            >
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-sky-800 font-black text-xs flex items-center justify-center border-2 border-sky-300 shadow-sm shrink-0">
                <span>{initials}</span>
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border-2 border-sky-700" />
              </div>

              <div className="hidden sm:block text-left leading-tight">
                <span className="text-xs font-bold text-white block max-w-[120px] truncate">
                  {user?.name}
                </span>
                <span className="text-[10px] text-sky-100 block">
                  {user?.role === "TEACHER" ? "Pendidik" : "Siswa"}
                </span>
              </div>

              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 text-sky-100 transition-transform hidden sm:block",
                  isDropdownOpen && "rotate-180 text-white"
                )}
              />
            </button>

            {/* Dropdown Menu Mengambang */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white text-slate-800 shadow-xl border border-sky-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900 block truncate">
                    {user?.name}
                  </span>
                  <span className="text-[11px] text-sky-600 font-semibold block truncate">
                    {user?.role === "TEACHER" ? "Pendidik / Guru" : "Peserta Didik"}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {user?.email}
                  </span>
                </div>

                <Link
                  href="/"
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2 font-medium transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-sky-600" />
                  <span>Dashboard Sesi Kelas</span>
                </Link>

                <Link
                  href="/faq"
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2 font-medium transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                  <span>Pusat Bantuan & FAQ</span>
                </Link>

                <div className="my-1 border-t border-slate-100" />

                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 flex items-center gap-2 font-bold transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span>Keluar dari Akun</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. MAIN CONTAINER & HERO PROFILE CARD                    */}
      {/* ======================================================== */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        {/* Banner Profil Identitas */}
        <div className="relative rounded-3xl bg-white border border-sky-100 shadow-sm overflow-hidden">
          {/* Header Biru Muda Bergradasi */}
          <div className="h-28 sm:h-36 bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold border border-white/25">
              <BadgeCheck className="w-4 h-4 text-emerald-300" />
              <span>Akun Terverifikasi</span>
            </div>
          </div>

          {/* Avatar & Identitas */}
          <div className="px-5 sm:px-8 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Lingkaran Avatar */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white p-1.5 shadow-xl border-4 border-white shrink-0">
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-sky-600 to-blue-700 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-inner">
                  {initials}
                </div>
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
              </div>

              {/* Teks Identitas */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {user?.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200">
                    {user?.role === "TEACHER" ? "Pendidik / Guru" : "Peserta Didik"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-2">
                  <span>{user?.email}</span>
                  <span>•</span>
                  <span>{user?.school || "SMAN 1 Teladan"}</span>
                </p>
              </div>
            </div>

            {/* Quick Stats Badges */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 pt-2 sm:pt-0">
              <div className="px-3.5 py-2 rounded-2xl bg-sky-50 border border-sky-100 text-center">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                  Model Diskusi
                </span>
                <span className="text-xs font-black text-sky-800">
                  Time Token Arends
                </span>
              </div>
              <div className="px-3.5 py-2 rounded-2xl bg-sky-50 border border-sky-100 text-center">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                  Peran Akun
                </span>
                <span className="text-xs font-black text-sky-800">
                  {user?.role === "TEACHER" ? "Pengajar Utama" : "Anggota Kelas"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notifikasi Sukses Simpan */}
        {saveSuccessMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-in fade-in duration-200 shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{saveSuccessMessage}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. TABS NAVIGASI PENGATURAN PROFIL                       */}
        {/* ======================================================== */}
        <div className="flex items-center gap-2 border-b border-sky-100 pb-3">
          <button
            onClick={() => setActiveTab("INFO")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all",
              activeTab === "INFO"
                ? "bg-sky-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-700 border border-sky-100"
            )}
          >
            <User className="w-4 h-4" />
            <span>Data Pribadi & Institusi</span>
          </button>

          <button
            onClick={() => setActiveTab("PREFERENCES")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all",
              activeTab === "PREFERENCES"
                ? "bg-sky-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-700 border border-sky-100"
            )}
          >
            <Sliders className="w-4 h-4" />
            <span>Preferensi Kelas</span>
          </button>

          <button
            onClick={() => setActiveTab("SECURITY")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all",
              activeTab === "SECURITY"
                ? "bg-sky-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-700 border border-sky-100"
            )}
          >
            <Shield className="w-4 h-4" />
            <span>Keamanan & Sandi</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* 4. KONTEN TAB 1: INFORMASI DATA PRIBADI                  */}
        {/* ======================================================== */}
        {activeTab === "INFO" && (
          <form onSubmit={handleSaveProfile} className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-7 shadow-sm space-y-5">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Informasi Profil Pendidik
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Perbarui identitas formal untuk keperluan laporan hasil diskusi dan evaluasi kooperatif
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nama Lengkap & Gelar */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-sky-600" />
                    <span>Nama Lengkap & Gelar</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Contoh: Dra. Sri Wahyuni, M.Pd."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sky-100 bg-sky-50/30 text-xs sm:text-sm text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400/20 focus:border-sky-500 transition-all"
                  />
                </div>

                {/* Email Institusi */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-sky-600" />
                    <span>Email Institusi / Akun</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="nama@sekolah.sch.id"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sky-100 bg-sky-50/30 text-xs sm:text-sm text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400/20 focus:border-sky-500 transition-all"
                  />
                </div>

                {/* Asal Sekolah */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>Asal Sekolah / Lembaga</span>
                  </label>
                  <input
                    type="text"
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                    placeholder="Contoh: SMAN 1 Teladan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sky-100 bg-sky-50/30 text-xs sm:text-sm text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400/20 focus:border-sky-500 transition-all"
                  />
                </div>

                {/* Mata Pelajaran Diampu */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                    <span>Mata Pelajaran Diampu</span>
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Contoh: Sosiologi / Bahasa Indonesia"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sky-100 bg-sky-50/30 text-xs sm:text-sm text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400/20 focus:border-sky-500 transition-all"
                  />
                </div>

                {/* NIP / Nomor Pegawai */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-sky-600" />
                    <span>NIP / ID Guru (Opsional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    placeholder="19840512 200801 2 006"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sky-100 bg-sky-50/30 text-xs sm:text-sm text-slate-800 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400/20 focus:border-sky-500 transition-all"
                  />
                </div>

                {/* Nomor Kontak WhatsApp */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-sky-600" />
                    <span>Nomor WhatsApp / Kontak</span>
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+62 812-3456-7890"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sky-100 bg-sky-50/30 text-xs sm:text-sm text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400/20 focus:border-sky-500 transition-all"
                  />
                </div>
              </div>

              {/* Bio Singkat Pengajar */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Bio Singkat & Visi Pembelajaran
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Ceritakan singkat metode pengajaran kooperatif yang Anda terapkan..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sky-100 bg-sky-50/30 text-xs sm:text-sm text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400/20 focus:border-sky-500 transition-all"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Profil</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* 5. KONTEN TAB 2: PREFERENSI SESI KELAS                   */}
        {/* ======================================================== */}
        {activeTab === "PREFERENCES" && (
          <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-7 shadow-sm space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Preferensi Standar Sesi Pembelajaran
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Aturan baku yang otomatis diterapkan ketika Anda membuka sesi kelas baru
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-sky-50/40 border border-sky-100 space-y-2">
                <div className="flex items-center gap-2 text-sky-800">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-bold">Durasi Standar Bicara</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={15}
                    max={300}
                    step={5}
                    value={formData.defaultDuration}
                    onChange={(e) =>
                      setFormData({ ...formData, defaultDuration: Number(e.target.value) })
                    }
                    className="w-24 px-3 py-1.5 rounded-xl border border-sky-200 bg-white text-sm font-black font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <span className="text-xs font-semibold text-slate-500">detik / kartu</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Standar Model Arends: 60 detik untuk argumen terstruktur
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50/40 border border-sky-100 space-y-2">
                <div className="flex items-center gap-2 text-sky-800">
                  <Layers className="w-4 h-4" />
                  <span className="text-xs font-bold">Jatah Kuota Kartu per Siswa</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.defaultTokens}
                    onChange={(e) =>
                      setFormData({ ...formData, defaultTokens: Number(e.target.value) })
                    }
                    className="w-24 px-3 py-1.5 rounded-xl border border-sky-200 bg-white text-sm font-black font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <span className="text-xs font-semibold text-slate-500">keping kartu</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Idealnya 2 - 4 kartu agar seluruh siswa memiliki giliran merata
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/40 border border-sky-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Efek Suara Bel & Detak Timer (Web Audio API)
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Membunyikan pengingat 10 detik terakhir dan bel waktu habis
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.soundEffects}
                  onChange={(e) =>
                    setFormData({ ...formData, soundEffects: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setSaveSuccessMessage("Preferensi standar kelas berhasil disimpan.");
                  setTimeout(() => setSaveSuccessMessage(null), 3000);
                }}
                className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Preferensi</span>
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 6. KONTEN TAB 3: KEAMANAN & KATA SANDI                   */}
        {/* ======================================================== */}
        {activeTab === "SECURITY" && (
          <form onSubmit={handleSavePassword} className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-7 shadow-sm space-y-5">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Keamanan Akun & Kata Sandi
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pastikan kata sandi Anda kuat untuk melindungi data rekam jejak diskusi kelas
                </p>
              </div>

              {isPasswordSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kata sandi Anda berhasil diperbarui.</span>
                </div>
              )}

              {passwordError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div className="max-w-md space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Kata Sandi Baru (Min. 6 Karakter)
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-sky-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, newPassword: e.target.value })
                      }
                      placeholder="Masukkan kata sandi baru"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-sky-100 bg-sky-50/30 text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400/20 focus:border-sky-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Konfirmasi Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-sky-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                      }
                      placeholder="Ulangi kata sandi baru"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-sky-100 bg-sky-50/30 text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400/20 focus:border-sky-500 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
                >
                  <Key className="w-4 h-4" />
                  <span>Perbarui Kata Sandi</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </main>

      {/* Modal Dialog Konfirmasi Keluar */}
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        variant="danger"
        title="Keluar dari Akun Pendidik?"
        message="Anda akan keluar dari sesi ini. Seluruh data rekap diskusi kelas yang tersimpan di perangkat lokal akan tetap aman."
        confirmText="Ya, Keluar Akun"
        cancelText="Batal"
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
}

