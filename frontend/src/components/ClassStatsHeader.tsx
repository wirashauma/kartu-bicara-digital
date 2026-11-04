"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  BarChart3,
  History,
  Settings,
  Volume2,
  VolumeX,
  LogOut,
  LogIn,
  UserPen,
  HelpCircle,
  ChevronDown,
  ArrowLeft,
  School,
} from "lucide-react";
import { ClassRoom, ClassStats, SessionConfig, SessionStatus } from "@/types/session";
import { AuthUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

// 4 Tab Utama: Sesi Diskusi, Statistik & Evaluasi, Riwayat Token, Pengaturan
export type TeacherTab = "DISCUSSION" | "ANALYTICS" | "TIMELINE" | "SETTINGS";

export interface ClassStatsHeaderProps {
  stats: ClassStats;
  config: SessionConfig;
  status: SessionStatus;
  activeTab: TeacherTab;
  onTabChange: (tab: TeacherTab) => void;
  currentUser: AuthUser | null;
  onLogout: () => void;
  onOpenEditProfile?: () => void;
  onOpenFaq?: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
  className?: string;
  currentClass?: ClassRoom | null;
  onBackToClassList?: () => void;
}

export function ClassStatsHeader({
  stats,
  activeTab,
  onTabChange,
  currentUser,
  onLogout,
  isMuted = false,
  onToggleMute,
  className,
  currentClass,
  onBackToClassList,
}: ClassStatsHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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

  // 4 Tab Menu: Sesi Diskusi, Statistik & Evaluasi, Riwayat Token, Pengaturan
  const tabs: { id: TeacherTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "DISCUSSION", label: "Sesi Diskusi", icon: MessageSquare },
    { id: "ANALYTICS", label: "Statistik & Evaluasi", icon: BarChart3 },
    { id: "TIMELINE", label: "Riwayat Token", icon: History },
    { id: "SETTINGS", label: "Pengaturan", icon: Settings },
  ];

  // Inisial foto profil
  const initials = currentUser?.name
    ? currentUser.name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "G";

  return (
    <header
      className={cn(
        "w-full bg-gradient-to-r from-sky-600 via-sky-600 to-blue-600 border-b border-sky-500/40 shadow-sm sticky top-0 z-30 text-white select-none overflow-x-clip",
        className
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* ======================================================== */}
        {/* BARIS UTAMA NAVBAR (Kompak, Proporsional, Anti-Terpotong) */}
        {/* ======================================================== */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 h-16 sm:h-18">
          
          {/* SISI KIRI: Brand Logo KBD + Breadcrumb Konteks Kelas */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 min-w-0">
            {/* Logo Brand Aplikasi */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white text-sky-700 flex items-center justify-center font-black text-xs sm:text-sm tracking-tight shadow-md group-hover:scale-105 transition-transform">
                KBD
              </div>
              <div className="hidden sm:block leading-tight">
                <span className="text-sm font-black text-white block tracking-tight">
                  Kartu Bicara Digital
                </span>
                <span className="text-[10px] font-bold text-sky-100 tracking-wider uppercase block">
                  Model Arends
                </span>
              </div>
            </Link>

            {/* Pemisah Vertikal Halus */}
            <div className="h-5 w-px bg-white/20 hidden md:block shrink-0" />

            {/* Konteks Sesi Kelas (Hanya tampil jika berada di dalam kelas) */}
            {currentClass ? (
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {onBackToClassList && (
                  <button
                    type="button"
                    onClick={onBackToClassList}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all group shrink-0"
                    title="Kembali ke Daftar Kelas"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    <span className="hidden md:inline">Daftar Kelas</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 border border-white/20 text-xs font-bold text-white shrink-0">
                <School className="w-3.5 h-3.5 text-sky-200" />
                <span>Manajemen Kelas</span>
              </div>
            )}
          </div>

          {/* SISI TENGAH: Tabs Navigasi Segmented Bersih (4 Menu Navigasi) */}
          {currentClass ? (
            <div className="hidden md:flex items-center justify-center flex-1 mx-2 min-w-0">
              <nav className="flex items-center p-1 bg-black/15 backdrop-blur-md rounded-2xl border border-white/15 gap-1 shadow-inner shrink-0">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => onTabChange(tab.id)}
                      className={cn(
                        "flex items-center gap-1.5 py-1.5 px-3 rounded-xl font-bold transition-all whitespace-nowrap text-xs",
                        isActive
                          ? "bg-white text-sky-800 shadow-sm"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <Icon className={cn("w-3.5 h-3.5", isActive ? "text-sky-600" : "text-sky-200")} />
                      <span>{tab.label}</span>
                      {tab.id === "TIMELINE" && stats.totalTokensUsed > 0 && (
                        <span
                          className={cn(
                            "ml-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold border transition-colors",
                            isActive
                              ? "bg-sky-100 text-sky-800 border-sky-200"
                              : "bg-white/20 text-white border-white/25"
                          )}
                        >
                          {stats.totalTokensUsed}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ) : (
            <div className="hidden md:flex items-center justify-center flex-1" />
          )}

          {/* SISI KANAN: Audio & Profil Dropdown (Tombol Perbesar Telah Dihapus) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Tombol Audio */}
            {onToggleMute && (
              <button
                onClick={onToggleMute}
                title={isMuted ? "Aktifkan Efek Suara" : "Bisukan Efek Suara"}
                className={cn(
                  "p-2 rounded-xl border transition-colors shrink-0",
                  isMuted
                    ? "bg-rose-500/25 text-rose-200 border-rose-300/40"
                    : "bg-white/15 text-white hover:bg-white/25 border-white/20"
                )}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            )}

            {/* Dropdown Profil Pengguna (Tidak Lagi Terpotong) */}
            <div className="relative pl-1 border-l border-white/20 shrink-0" ref={dropdownRef}>
              {currentUser ? (
                <div>
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

                    <div className="hidden xl:block text-left leading-tight">
                      <span className="text-xs font-bold text-white block max-w-[100px] truncate">
                        {currentUser.name}
                      </span>
                      <span className="text-[10px] text-sky-100 block">
                        {currentUser.role === "TEACHER" ? "Pendidik" : "Siswa"}
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
                          {currentUser.name}
                        </span>
                        <span className="text-[11px] text-sky-600 font-semibold block truncate">
                          {currentUser.role === "TEACHER" ? "Pendidik / Guru" : "Peserta Didik"}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {currentUser.email}
                        </span>
                      </div>

                      <Link
                        href="/profil"
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2 font-medium transition-colors"
                      >
                        <UserPen className="w-3.5 h-3.5 text-sky-600" />
                        <span>Halaman Profil Pendidik</span>
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
                          onLogout();
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 flex items-center gap-2 font-bold transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-600" />
                        <span>Keluar dari Akun</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 rounded-xl bg-white text-sky-800 hover:bg-sky-50 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Masuk</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SUB-BARIS KHUSUS LAYAR KECIL / MOBILE (< md breakpoint)  */}
        {/* ======================================================== */}
        {currentClass && (
          <div className="md:hidden border-t border-white/15 py-2 overflow-x-auto">
            <nav className="flex items-center p-1 bg-black/15 rounded-xl border border-white/10 gap-1 w-max mx-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                      "flex items-center gap-1.5 py-1 px-3 rounded-lg font-bold transition-all whitespace-nowrap text-xs",
                      isActive
                        ? "bg-white text-sky-800 shadow-sm"
                        : "text-white/80 hover:text-white"
                    )}
                  >
                    <Icon className={cn("w-3.5 h-3.5", isActive ? "text-sky-600" : "text-sky-200")} />
                    <span>{tab.label}</span>
                    {tab.id === "TIMELINE" && stats.totalTokensUsed > 0 && (
                      <span
                        className={cn(
                          "ml-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold border",
                          isActive
                            ? "bg-sky-100 text-sky-800 border-sky-200"
                            : "bg-white/20 text-white border-white/25"
                        )}
                      >
                        {stats.totalTokensUsed}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default ClassStatsHeader;
