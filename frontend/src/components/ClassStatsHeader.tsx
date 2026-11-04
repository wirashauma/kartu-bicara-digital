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
  Maximize2,
  Hash,
  LogOut,
  LogIn,
  UserPen,
  HelpCircle,
  ChevronDown,
  ArrowLeft,
  School,
  BookOpen,
} from "lucide-react";
import { ClassRoom, ClassStats, SessionConfig, SessionStatus } from "@/types/session";
import { AuthUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

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
  onToggleFullscreen?: () => void;
  className?: string;
  currentClass?: ClassRoom | null;
  onBackToClassList?: () => void;
}

export function ClassStatsHeader({
  stats,
  config,
  status,
  activeTab,
  onTabChange,
  currentUser,
  onLogout,
  onOpenEditProfile,
  onOpenFaq,
  isMuted = false,
  onToggleMute,
  onToggleFullscreen,
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

  const tabs: { id: TeacherTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "DISCUSSION", label: "Sesi Diskusi", icon: MessageSquare },
    { id: "ANALYTICS", label: "Statistik & Evaluasi", icon: BarChart3 },
    { id: "TIMELINE", label: "Riwayat Token", icon: History },
    { id: "SETTINGS", label: "Pengaturan", icon: Settings },
  ];

  // User initials for photo profile avatar
  const initials = currentUser?.name
    ? currentUser.name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "G";

  return (
    <header className={cn("w-full bg-gradient-to-r from-sky-700 via-sky-600 to-blue-700 border-b border-sky-800/40 shadow-sm sticky top-0 z-30 text-white", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Navbar Diperbesar Sesuai Permintaan Pengguna (py-3.5 sm:py-4) */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 sm:py-3.5 md:py-4">
          
          {/* Sisi Kiri: Logo KBD, Tombol Kembali (jika di dalam kelas), & PIN Sesi */}
          <div className="flex items-center gap-3 sm:gap-3.5">
            {currentClass && onBackToClassList ? (
              <button
                type="button"
                onClick={onBackToClassList}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs sm:text-sm font-bold text-white transition-all group"
                title="Kembali ke Daftar Kelas"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span className="hidden sm:inline">Daftar Kelas</span>
              </button>
            ) : null}

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white text-sky-800 flex items-center justify-center font-black text-sm tracking-tight shadow-md group-hover:scale-105 transition-transform">
                KBD
              </div>
              <div>
                <span className="text-sm sm:text-base font-black text-white block leading-tight">
                  Kartu Bicara Digital
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-sky-100 tracking-wide uppercase">
                  Model Arends
                </span>
              </div>
            </Link>

            {currentClass ? (
              <div className="flex items-center gap-2 pl-2 border-l border-white/20">
                <span className="hidden lg:inline-block text-xs font-bold text-white px-2.5 py-1 rounded-lg bg-white/10">
                  {currentClass.name}
                </span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-white/15 border border-white/20 text-xs sm:text-sm font-bold">
                  <Hash className="w-3.5 h-3.5 text-sky-200" />
                  <span className="font-mono text-white">{currentClass.sessionPin}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse ml-0.5" />
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 border border-white/20 text-xs font-bold">
                <School className="w-3.5 h-3.5 text-sky-200" />
                <span className="text-white">Manajemen Kelas</span>
              </div>
            )}
          </div>

          {/* Sisi Kanan: Audio, Layar Penuh, dan Foto Profil Dropdown */}
          <div className="flex items-center gap-2 sm:gap-2.5 order-2 md:order-3">
            {/* Audio Toggle */}
            {onToggleMute && (
              <button
                onClick={onToggleMute}
                title={isMuted ? "Aktifkan Efek Suara" : "Bisukan Efek Suara"}
                className={cn(
                  "p-2 sm:p-2.5 rounded-xl border transition-colors",
                  isMuted
                    ? "bg-rose-500/25 text-rose-200 border-rose-300/40"
                    : "bg-white/15 text-white hover:bg-white/25 border-white/20"
                )}
              >
                {isMuted ? <VolumeX className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> : <Volume2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}
              </button>
            )}

            {/* Fullscreen Proyektor */}
            {onToggleFullscreen && (
              <button
                onClick={onToggleFullscreen}
                title="Mode Layar Penuh Proyektor"
                className="p-2 sm:p-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-colors"
              >
                <Maximize2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>
            )}

            {/* Foto Profil dengan Dropdown */}
            <div className="relative pl-1 border-l border-white/20" ref={dropdownRef}>
              {currentUser ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-1.5 sm:gap-2 p-1 rounded-2xl hover:bg-white/15 transition-colors focus:outline-none"
                    title="Menu Profil Pengguna"
                  >
                    <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-sky-800 font-black text-xs sm:text-sm flex items-center justify-center border-2 border-sky-300 shadow-sm">
                      <span>{initials}</span>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-sky-700" />
                    </div>
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 text-sky-100 transition-transform hidden sm:block",
                        isDropdownOpen && "rotate-180 text-white"
                      )}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white text-slate-800 shadow-xl border border-sky-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                      {/* Header Info Akun */}
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

                      {/* Edit Profil Pendidik */}
                      {onOpenEditProfile && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            onOpenEditProfile();
                          }}
                          className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2 font-medium transition-colors"
                        >
                          <UserPen className="w-3.5 h-3.5 text-sky-600" />
                          <span>Edit Profil Pendidik</span>
                        </button>
                      )}

                      {/* FAQ & Bantuan */}
                      {onOpenFaq && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            onOpenFaq();
                          }}
                          className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2 font-medium transition-colors"
                        >
                          <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                          <span>FAQ & Panduan Model Arends</span>
                        </button>
                      )}

                      <div className="my-1 border-t border-slate-100" />

                      {/* Keluar dari Akun */}
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
                  className="px-4 py-2 rounded-xl bg-white text-sky-800 hover:bg-sky-50 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk</span>
                </Link>
              )}
            </div>
          </div>

          {/* Sisi Tengah: TABS NAVBAR (Hanya tampil jika sedang berada di dalam kelas) */}
          {currentClass ? (
            <nav className="flex items-center p-1 bg-black/15 rounded-2xl border border-white/15 gap-1 overflow-x-auto max-w-full text-xs order-3 md:order-2 w-full md:w-auto justify-start md:justify-center">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                      "flex items-center gap-1.5 py-1.5 sm:py-2 px-3 sm:px-4 rounded-xl font-bold transition-all whitespace-nowrap select-none text-xs sm:text-[13px]",
                      isActive
                        ? "bg-white text-sky-800 shadow-sm border border-white"
                        : "text-white/85 hover:text-white hover:bg-white/15"
                    )}
                  >
                    <Icon className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", isActive ? "text-sky-600" : "text-sky-200")} />
                    <span>{tab.label}</span>

                    {tab.id === "ANALYTICS" && stats.studentsIdleCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] bg-amber-400 text-amber-950 font-black border border-amber-300">
                        {stats.studentsIdleCount}
                      </span>
                    )}
                    {tab.id === "TIMELINE" && stats.totalTokensUsed > 0 && (
                      <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[9px] bg-white/20 text-white font-bold border border-white/25">
                        {stats.totalTokensUsed}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          ) : (
            <div className="order-3 md:order-2 hidden md:flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white/10 text-xs font-semibold text-sky-100">
              <BookOpen className="w-4 h-4 text-sky-300" />
              <span>Silakan pilih kelas untuk mengaktifkan sesi kartu bicara</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default ClassStatsHeader;
