"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Play,
  Pause,
  PlusCircle,
  Square,
  LogOut,
  Mic,
  Flame,
  Clock,
  Sparkles,
  BarChart3,
  Users,
  Coins,
  AlertTriangle,
  History,
  Settings,
  Download,
  RotateCcw,
  CheckCircle2,
  Save,
  UserPen,
  HelpCircle,
  ChevronDown,
  ArrowLeft,
  UserPlus,
  Hash,
  BookOpen,
} from "lucide-react";
import {
  ActiveSpeaker,
  ClassRoom,
  Role,
  SessionConfig,
  SessionStatus,
  Student,
  TokenType,
  TOKEN_DEFINITIONS,
  Token,
} from "@/types/session";
import {
  INITIAL_SESSION_CONFIG,
  generateInitialStudents,
  generateInitialClassrooms,
  computeClassStats,
} from "@/lib/mockData";
import { getStoredUser, clearStoredUser, AuthUser } from "@/lib/auth";
import { useAudioWarning } from "@/hooks/useAudioWarning";
import { ClassStatsHeader, TeacherTab } from "@/components/ClassStatsHeader";
import { TokenBadge } from "@/components/TokenBadge";
import { TypeSelectorModal } from "@/components/TypeSelectorModal";
import { FullscreenCountdownOverlay } from "@/components/FullscreenCountdownOverlay";
import { StudentGrid } from "@/components/StudentGrid";
import { EditProfileModal } from "@/components/EditProfileModal";
import { FaqModal } from "@/components/FaqModal";
import { ClassListView } from "@/components/ClassListView";
import { AddClassModal } from "@/components/AddClassModal";
import { AddStudentModal } from "@/components/AddStudentModal";
import { ConfirmModal } from "@/components/ConfirmModal";
import { cn } from "@/lib/utils";

export default function Home() {
  const router = useRouter();

  // 1. Pengguna Terotentikasi
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // 2. Daftar Kelas (Classrooms) & Kelas Terpilih
  const [classes, setClasses] = useState<ClassRoom[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("kbd_classrooms_v1");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (err) {
        console.error("Gagal memuat kbd_classrooms_v1 dari localStorage", err);
      }
    }
    return generateInitialClassrooms();
  });

  // Jika null, guru melihat halaman Daftar Card Kelas. Jika diisi, guru masuk ke detail kelas tersebut.
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  // Modal Tambah Kelas & Tambah Siswa
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);

  // 3. Tab Aktif untuk Pendidik
  const [activeTeacherTab, setActiveTeacherTab] = useState<TeacherTab>("DISCUSSION");

  // 4. Modal Profil, FAQ & Konfirmasi Aksi Krusial
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false);

  // Modal Konfirmasi Dialog Profesional
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isNoSpeakerAlertOpen, setIsNoSpeakerAlertOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // 5. Kelas Aktif Terpilih
  const currentClass = useMemo(() => {
    if (!selectedClassId) return null;
    return classes.find((c) => c.id === selectedClassId) || null;
  }, [classes, selectedClassId]);

  // Daftar Siswa pada Kelas Aktif
  const students = useMemo(() => {
    return currentClass ? currentClass.students : [];
  }, [currentClass]);

  // Konfigurasi Sesi yang Sinkron dengan Kelas Aktif
  const [config, setConfig] = useState<SessionConfig>(() => ({
    sessionCode: "TT-7892",
    className: "Kelas XI MIPA 1",
    topic: "Dilema Etika AI & Masa Depan Pendidikan",
    subject: "Sosiologi / Bahasa Indonesia",
    tokensPerStudent: 3,
    speechTimeLimitSeconds: 60,
    autoWarningThresholdSeconds: 10,
  }));

  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("ACTIVE");
  const [activeSpeaker, setActiveSpeaker] = useState<ActiveSpeaker | null>(null);

  // Sinkronisasi Sesi saat Kelas Berganti
  useEffect(() => {
    if (currentClass) {
      setConfig({
        sessionCode: currentClass.sessionPin,
        className: currentClass.name,
        topic: currentClass.topic || "Diskusi Terbuka Model Arends",
        subject: currentClass.subject,
        tokensPerStudent: currentClass.tokensPerStudent,
        speechTimeLimitSeconds: currentClass.speechTimeLimitSeconds,
        autoWarningThresholdSeconds: 10,
      });
      setSettingsForm({
        sessionCode: currentClass.sessionPin,
        className: currentClass.name,
        topic: currentClass.topic || "Diskusi Terbuka Model Arends",
        subject: currentClass.subject,
        tokensPerStudent: currentClass.tokensPerStudent,
        speechTimeLimitSeconds: currentClass.speechTimeLimitSeconds,
        autoWarningThresholdSeconds: 10,
      });
    }
  }, [currentClass]);

  // Simpan data kelas ke localStorage secara otomatis
  useEffect(() => {
    try {
      localStorage.setItem("kbd_classrooms_v1", JSON.stringify(classes));
    } catch (e) {
      console.error("Gagal menyimpan ke localStorage", e);
    }
  }, [classes]);

  // Pengaturan Formulir Sementara
  const [settingsForm, setSettingsForm] = useState<SessionConfig>(INITIAL_SESSION_CONFIG);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState("");

  // 6. UI Filters & Modals
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timelineFilter, setTimelineFilter] = useState<TokenType | null>(null);
  const [forceFullscreenOverlay, setForceFullscreenOverlay] = useState(false);

  // 7. Audio Hook (Web Audio API)
  const {
    isMuted,
    initAudio,
    toggleMute,
    playTickWarning,
    playFinalBuzzer,
    playSuccessChime,
    playClick,
  } = useAudioWarning({ initialMuted: false, initialVolume: 0.85 });

  // Baca pengguna tersimpan saat mount
  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const userRole: Role = currentUser ? currentUser.role : "TEACHER";

  // Siswa otomatis masuk ke kelasnya tanpa perlu memilih
  useEffect(() => {
    if (userRole === "STUDENT" && !selectedClassId && classes.length > 0) {
      const match =
        classes.find((c) => c.name === currentUser?.className) || classes[0];
      setSelectedClassId(match.id);
    }
  }, [userRole, selectedClassId, classes, currentUser]);

  const handleLogout = () => {
    setIsLogoutConfirmOpen(true);
  };

  const executeLogout = () => {
    clearStoredUser();
    setCurrentUser(null);
    setIsLogoutConfirmOpen(false);
    router.push("/login");
  };

  const handleProfileUpdated = (updatedUser: AuthUser) => {
    setCurrentUser(updatedUser);
  };

  // Helper untuk memperbarui siswa pada kelas aktif
  const setStudentsForCurrentClass = useCallback(
    (updater: (prev: Student[]) => Student[]) => {
      if (!selectedClassId) return;
      setClasses((prev) =>
        prev.map((c) => {
          if (c.id === selectedClassId) {
            return {
              ...c,
              students: updater(c.students),
            };
          }
          return c;
        })
      );
    },
    [selectedClassId]
  );

  // Handler: Tambah Kelas Baru
  const handleAddClass = (
    newClassData: Omit<ClassRoom, "id" | "createdAt" | "students">
  ) => {
    const newClass: ClassRoom = {
      ...newClassData,
      id: `class-${Date.now()}`,
      createdAt: new Date().toISOString(),
      students: [],
    };

    setClasses((prev) => [newClass, ...prev]);
    setSelectedClassId(newClass.id);
    setIsAddClassOpen(false);
  };

  // Handler: Tambah Siswa Baru ke Kelas Aktif
  const handleAddStudent = (newStudentData: {
    name: string;
    deskNumber: number;
    tokensQuota: number;
  }) => {
    if (!currentClass) return;

    const newStudent: Student = {
      id: `std-${Date.now()}-${newStudentData.deskNumber}`,
      name: newStudentData.name,
      deskNumber: newStudentData.deskNumber,
      tokensQuota: newStudentData.tokensQuota,
      remainingTokens: newStudentData.tokensQuota,
      usedTokens: [],
      isCurrentlySpeaking: false,
      hasSpoken: false,
      totalSpeakingTimeSeconds: 0,
    };

    setStudentsForCurrentClass((prev) => {
      // Pastikan urut berdasarkan nomor meja
      const updated = [...prev, newStudent];
      updated.sort((a, b) => a.deskNumber - b.deskNumber);
      return updated;
    });

    setIsAddStudentOpen(false);
  };

  // Handler: Hapus Kelas
  const handleDeleteClass = (classId: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== classId));
    if (selectedClassId === classId) {
      setSelectedClassId(null);
    }
  };

  // Handler: Hapus Siswa dari Kelas Aktif
  const executeDeleteStudent = () => {
    if (!studentToDelete) return;
    setStudentsForCurrentClass((prev) =>
      prev.filter((s) => s.id !== studentToDelete.id)
    );
    setStudentToDelete(null);
  };

  // Data siswa saat ini (jika peran adalah SISWA)
  const currentStudentData = useMemo(() => {
    if (userRole !== "STUDENT") return null;
    if (currentUser?.deskNumber) {
      return (
        students.find((s) => s.deskNumber === currentUser.deskNumber) ||
        students[0]
      );
    }
    return students[0];
  }, [userRole, currentUser, students]);

  // Statistik Kelas Komputasi Langsung
  const classStats = useMemo(() => {
    return computeClassStats(students, config.tokensPerStudent);
  }, [students, config.tokensPerStudent]);

  // Seluruh Token Terpakai secara Kronologis
  const allUsedTokens = useMemo(() => {
    const list: Token[] = students.flatMap((s) => s.usedTokens);
    list.sort((a, b) => new Date(b.usedAt).getTime() - new Date(a.usedAt).getTime());
    if (timelineFilter) {
      return list.filter((t) => t.type === timelineFilter);
    }
    return list;
  }, [students, timelineFilter]);

  // Timer Interval: Hitung Mundur Pembicara Aktif
  useEffect(() => {
    if (!activeSpeaker || activeSpeaker.isPaused) return;

    const timer = setInterval(() => {
      setActiveSpeaker((prev) => {
        if (!prev) return null;
        if (prev.remainingSeconds <= 1) {
          playFinalBuzzer();
          return {
            ...prev,
            remainingSeconds: 0,
            isPaused: true,
          };
        }
        if (prev.remainingSeconds <= config.autoWarningThresholdSeconds + 1) {
          playTickWarning();
        }
        return {
          ...prev,
          remainingSeconds: prev.remainingSeconds - 1,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    activeSpeaker,
    config.autoWarningThresholdSeconds,
    playTickWarning,
    playFinalBuzzer,
  ]);

  // Buka Modal Pemilihan Kategori Token
  const handleOpenTokenModal = useCallback((student: Student) => {
    initAudio();
    setSelectedStudentForModal(student);
    setIsModalOpen(true);
  }, [initAudio]);

  // Konfirmasi Mulai Bicara
  const handleConfirmStartSpeech = useCallback(
    (tokenType: TokenType, durationSeconds: number) => {
      if (!selectedStudentForModal) return;

      playSuccessChime();
      setIsModalOpen(false);

      const speakerData: ActiveSpeaker = {
        studentId: selectedStudentForModal.id,
        studentName: selectedStudentForModal.name,
        deskNumber: selectedStudentForModal.deskNumber,
        tokenType,
        startedAt: Date.now(),
        allocatedSeconds: durationSeconds,
        remainingSeconds: durationSeconds,
        isPaused: false,
      };

      setStudentsForCurrentClass((prev) =>
        prev.map((s) => ({
          ...s,
          isCurrentlySpeaking: s.id === selectedStudentForModal.id,
        }))
      );

      setActiveSpeaker(speakerData);
      setActiveTeacherTab("DISCUSSION");
    },
    [selectedStudentForModal, playSuccessChime, setStudentsForCurrentClass]
  );

  // Selesai Bicara
  const handleFinishSpeech = useCallback(() => {
    if (!activeSpeaker) return;

    playSuccessChime();

    const usedDuration =
      activeSpeaker.allocatedSeconds - activeSpeaker.remainingSeconds;

    const newToken: Token = {
      id: `tok-${Date.now()}`,
      type: activeSpeaker.tokenType,
      studentId: activeSpeaker.studentId,
      studentName: activeSpeaker.studentName,
      deskNumber: activeSpeaker.deskNumber,
      usedAt: new Date().toISOString(),
      durationSeconds: Math.max(5, usedDuration),
    };

    setStudentsForCurrentClass((prev) =>
      prev.map((s) => {
        if (s.id === activeSpeaker.studentId) {
          const nextRemaining = Math.max(0, s.remainingTokens - 1);
          return {
            ...s,
            isCurrentlySpeaking: false,
            hasSpoken: true,
            remainingTokens: nextRemaining,
            totalSpeakingTimeSeconds: s.totalSpeakingTimeSeconds + newToken.durationSeconds,
            usedTokens: [...s.usedTokens, newToken],
            lastSpokeAt: newToken.usedAt,
          };
        }
        return s;
      })
    );

    setActiveSpeaker(null);
    setForceFullscreenOverlay(false);
  }, [activeSpeaker, playSuccessChime, setStudentsForCurrentClass]);

  // Jeda / Lanjutkan Timer
  const handleTogglePause = useCallback(() => {
    playClick();
    setActiveSpeaker((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        isPaused: !prev.isPaused,
      };
    });
  }, [playClick]);

  // Tambah Waktu Bicara
  const handleExtendTime = useCallback(
    (seconds: number = 15) => {
      playClick();
      setActiveSpeaker((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          remainingSeconds: prev.remainingSeconds + seconds,
          allocatedSeconds: prev.allocatedSeconds + seconds,
          isPaused: false,
        };
      });
    },
    [playClick]
  );

  // Simpan Pengaturan
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setConfig(settingsForm);
    if (selectedClassId) {
      setClasses((prev) =>
        prev.map((c) => {
          if (c.id === selectedClassId) {
            return {
              ...c,
              name: settingsForm.className,
              subject: settingsForm.subject,
              topic: settingsForm.topic,
              tokensPerStudent: settingsForm.tokensPerStudent,
              speechTimeLimitSeconds: settingsForm.speechTimeLimitSeconds,
            };
          }
          return c;
        })
      );
    }
    setSettingsSavedMessage("Pengaturan sesi berhasil diperbarui.");
    setTimeout(() => setSettingsSavedMessage(""), 3000);
  };

  // Reset Sesi Kelas Ini
  const handleResetSession = () => {
    setIsResetConfirmOpen(true);
  };

  const executeResetSession = () => {
    setActiveSpeaker(null);
    setStudentsForCurrentClass(() => generateInitialStudents());
    setIsResetConfirmOpen(false);
    setSettingsSavedMessage("Sesi kelas telah direset ke kondisi awal.");
    setTimeout(() => setSettingsSavedMessage(""), 3000);
  };

  return (
    <main className="min-h-screen bg-[#F0F7FF] text-slate-900 flex flex-col font-sans">
      {/* 1. VIEW GURU / PENDIDIK */}
      {userRole === "TEACHER" ? (
        <div className="flex-1 flex flex-col">
          {/* NAVBAR GURU (Diperbesar Sesuai Permintaan dengan Fitur Kembali ke Kelas) */}
          <ClassStatsHeader
            stats={classStats}
            config={config}
            status={sessionStatus}
            activeTab={activeTeacherTab}
            onTabChange={setActiveTeacherTab}
            currentUser={currentUser}
            onLogout={handleLogout}
            onOpenEditProfile={() => setIsEditProfileOpen(true)}
            onOpenFaq={() => setIsFaqOpen(true)}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            currentClass={currentClass}
            onBackToClassList={() => setSelectedClassId(null)}
          />

          {/* ================================================================ */}
          {/* A. TAMPILAN 1: DAFTAR KELAS & TAMBAH KELAS (Saat Belum Pilih Kelas) */}
          {/* ================================================================ */}
          {!selectedClassId ? (
            <div className="flex-1 px-4 sm:px-6 py-6 max-w-7xl mx-auto w-full">
              <ClassListView
                classes={classes}
                currentUser={currentUser}
                onSelectClass={(id) => {
                  setSelectedClassId(id);
                  setActiveTeacherTab("DISCUSSION");
                }}
                onOpenAddClass={() => setIsAddClassOpen(true)}
                onDeleteClass={handleDeleteClass}
              />
            </div>
          ) : (
            /* ================================================================ */
            /* B. TAMPILAN 2: DETAIL KELAS & SELURUH SISWA (Saat Kelas Dipilih)    */
            /* ================================================================ */
            <div className="flex-1 px-4 sm:px-6 py-5 max-w-7xl mx-auto w-full">
              {/* TAB 1: SESI DISKUSI (GRID SISWA & TIMER & FITUR TAMBAH SISWA) */}
              {activeTeacherTab === "DISCUSSION" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* Banner Info Kelas & Tombol "+ Tambah Siswa" */}
                  <div className="p-4 sm:p-5 rounded-3xl bg-white border border-sky-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedClassId(null)}
                        className="p-2 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200/60 transition-colors"
                        title="Kembali ke Daftar Kelas"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                            {currentClass?.name}
                          </h2>
                          <span className="px-2 py-0.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-100 text-xs font-bold font-mono">
                            #{currentClass?.sessionPin}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {currentClass?.subject} · {currentClass?.topic}
                        </p>
                      </div>
                    </div>

                    {/* Tombol Fitur "+ Tambah Siswa" Sesuai Permintaan */}
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setIsAddStudentOpen(true)}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-500/20 active:scale-[0.99] transition-all flex items-center gap-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Tambah Siswa</span>
                      </button>
                    </div>
                  </div>

                  {/* Hero Section: Pembicara Aktif */}
                  {activeSpeaker ? (
                    <div className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-sky-600 shadow-md shadow-sky-100 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-black text-lg shadow-sm shadow-sky-200">
                          #{activeSpeaker.deskNumber}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 flex items-center gap-1 border border-sky-200/60">
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
                              Sedang Berbicara
                            </span>
                            <TokenBadge type={activeSpeaker.tokenType} size="xs" />
                          </div>
                          <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                            {activeSpeaker.studentName}
                          </h3>
                        </div>
                      </div>

                      {/* Timer & Tombol Kontrol Guru */}
                      <div className="flex items-center gap-3 sm:gap-4 ml-auto">
                        <div className="text-right">
                          <span
                            className={cn(
                              "text-3xl sm:text-4xl font-black font-mono tracking-tight",
                              activeSpeaker.remainingSeconds <= 10
                                ? "text-amber-500 animate-pulse"
                                : "text-sky-700"
                            )}
                          >
                            {activeSpeaker.remainingSeconds}s
                          </span>
                          <span className="block text-[10px] text-slate-400 font-semibold">
                            dari {activeSpeaker.allocatedSeconds}s
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={handleTogglePause}
                            title={activeSpeaker.isPaused ? "Lanjutkan" : "Jeda"}
                            className="p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-100 text-slate-700 transition-colors"
                          >
                            {activeSpeaker.isPaused ? (
                              <Play className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Pause className="w-4 h-4 text-amber-600" />
                            )}
                          </button>

                          <button
                            onClick={() => handleExtendTime(15)}
                            title="Tambah 15 Detik"
                            className="p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-100 text-sky-700 transition-colors flex items-center gap-1 text-xs font-bold"
                          >
                            <PlusCircle className="w-4 h-4 text-sky-600" />
                            <span>+15s</span>
                          </button>

                          <button
                            onClick={handleFinishSpeech}
                            title="Selesaikan Giliran Bicara"
                            className="px-3.5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white transition-colors flex items-center gap-1 text-xs font-bold shadow-xs"
                          >
                            <Square className="w-3.5 h-3.5 fill-current" />
                            <span>Selesai</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-white border border-sky-100 flex items-center justify-between text-xs text-slate-500 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
                        <span>
                          Pilih kartu siswa di bawah untuk memberikan token bicara. Prioritaskan siswa berlabel <strong className="text-amber-800">Belum</strong>.
                        </span>
                      </div>
                      <span className="font-mono text-sky-800 font-bold hidden md:inline">
                        {config.speechTimeLimitSeconds}s / kartu
                      </span>
                    </div>
                  )}

                  {/* Grid Seluruh Siswa di Kelas Tersebut */}
                  {students.length > 0 ? (
                    <StudentGrid
                      students={students}
                      onSelectStudent={handleOpenTokenModal}
                      onDeleteStudent={(s) => setStudentToDelete(s)}
                      activeSpeakerStudentId={activeSpeaker?.studentId}
                    />
                  ) : (
                    /* Empty State Siswa */
                    <div className="p-10 rounded-3xl bg-white border border-sky-100 text-center flex flex-col items-center justify-center space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                        <Users className="w-7 h-7" />
                      </div>
                      <h3 className="font-bold text-slate-800 text-base">
                        Belum ada siswa di {currentClass?.name}
                      </h3>
                      <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                        Tambahkan siswa ke kelas ini untuk memulai pemberian kartu bicara interaktif Model Arends.
                      </p>
                      <button
                        onClick={() => setIsAddStudentOpen(true)}
                        className="mt-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Tambah Siswa Sekarang</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: STATISTIK & EVALUASI */}
              {activeTeacherTab === "ANALYTICS" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-white rounded-3xl border border-sky-100 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                        <span>Tingkat Partisipasi</span>
                        <BarChart3 className="w-4 h-4 text-sky-600" />
                      </div>
                      <div className="text-2xl font-black text-slate-900">
                        {classStats.participationRate}%
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                        <div
                          className="bg-sky-600 h-full rounded-full transition-all"
                          style={{ width: `${classStats.participationRate}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-3xl border border-sky-100 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                        <span>Total Siswa Berbicara</span>
                        <Users className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="text-2xl font-black text-slate-900">
                        {classStats.studentsSpokenCount}{" "}
                        <span className="text-xs text-slate-400 font-normal">
                          / {classStats.totalStudents}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-600 font-medium pt-1">
                        Telah aktif berkontribusi
                      </p>
                    </div>

                    <div className="p-4 bg-white rounded-3xl border border-sky-100 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                        <span>Siswa Belum Berbicara</span>
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="text-2xl font-black text-amber-600">
                        {classStats.studentsIdleCount}
                      </div>
                      <p className="text-[11px] text-amber-600 font-medium pt-1">
                        Perlu diprioritaskan
                      </p>
                    </div>

                    <div className="p-4 bg-white rounded-3xl border border-sky-100 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                        <span>Token Terpakai</span>
                        <Coins className="w-4 h-4 text-sky-600" />
                      </div>
                      <div className="text-2xl font-black text-slate-900">
                        {classStats.totalTokensUsed}{" "}
                        <span className="text-xs text-slate-400 font-normal">
                          / {classStats.totalTokensAllocated}
                        </span>
                      </div>
                      <p className="text-[11px] text-sky-600 font-medium pt-1">
                        {classStats.totalTokensRemaining} token tersisa
                      </p>
                    </div>
                  </div>

                  {/* Distribusi 4 Kategori Taksonomi Kartu */}
                  <div className="p-6 bg-white rounded-3xl border border-sky-100 shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-900 text-sm">
                      Distribusi 4 Kategori Kartu Bicara (Model Arends)
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {(
                        [
                          "BERTANYA",
                          "MENJAWAB",
                          "BERPENDAPAT",
                          "MENANGGAPI",
                        ] as TokenType[]
                      ).map((type) => {
                        const def = TOKEN_DEFINITIONS[type];
                        const count = classStats.distributionByType[type] || 0;
                        return (
                          <div
                            key={type}
                            className={cn(
                              "p-3.5 rounded-2xl border flex flex-col justify-between",
                              def.lightBgClass,
                              def.borderClass
                            )}
                          >
                            <span className={cn("text-xs font-bold", def.textClass)}>
                              {def.label}
                            </span>
                            <div className="text-2xl font-black text-slate-900 mt-2">
                              {count}
                            </div>
                            <span className="text-[10px] text-slate-400">kontribusi</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Log Riwayat Kartu Bicara (Terintegrasi Rapi di Tab Statistik) */}
                  <div className="p-6 bg-white rounded-3xl border border-sky-100 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                          Log Riwayat Kartu Bicara
                        </h3>
                        <p className="text-xs text-slate-500">
                          Urutan kronologis siswa yang telah menggunakan kartu bicara di kelas ini
                        </p>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                        Total: {allUsedTokens.length} Kali
                      </span>
                    </div>

                    {allUsedTokens.length > 0 ? (
                      <div className="space-y-2">
                        {allUsedTokens.map((tok) => (
                          <div
                            key={tok.id}
                            className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 font-bold text-xs flex items-center justify-center border border-sky-100">
                                #{tok.deskNumber}
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                                  {tok.studentName}
                                </h4>
                                <span className="text-[11px] text-slate-400">
                                  {new Date(tok.usedAt).toLocaleTimeString("id-ID")} · Meja #{tok.deskNumber}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <TokenBadge type={tok.type} size="sm" />
                              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                                {tok.durationSeconds}s
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-400 text-xs">
                        Belum ada kartu bicara yang terpakai pada kelas ini.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: PENGATURAN KELAS */}
              {activeTeacherTab === "SETTINGS" && (
                <div className="max-w-2xl mx-auto p-6 bg-white rounded-3xl border border-sky-100 shadow-sm space-y-5 animate-in fade-in duration-200">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      Pengaturan Sesi {currentClass?.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Sesuaikan jatah token, durasi waktu bicara, dan topik diskusi kelas
                    </p>
                  </div>

                  {settingsSavedMessage && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                      {settingsSavedMessage}
                    </div>
                  )}

                  <form onSubmit={handleSaveSettings} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Nama Kelas
                      </label>
                      <input
                        type="text"
                        value={settingsForm.className}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, className: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Mata Pelajaran
                      </label>
                      <input
                        type="text"
                        value={settingsForm.subject}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, subject: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Topik Diskusi
                      </label>
                      <input
                        type="text"
                        value={settingsForm.topic}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, topic: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 block">
                          Jatah Token per Siswa
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={6}
                          value={settingsForm.tokensPerStudent}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              tokensPerStudent: Number(e.target.value),
                            })
                          }
                          className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700 block">
                          Waktu Bicara (Detik)
                        </label>
                        <input
                          type="number"
                          min={15}
                          max={300}
                          step={15}
                          value={settingsForm.speechTimeLimitSeconds}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              speechTimeLimitSeconds: Number(e.target.value),
                            })
                          }
                          className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handleResetSession}
                        className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
                      >
                        Reset Sesi Kelas
                      </button>

                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-all"
                      >
                        Simpan Perubahan
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* 2. VIEW SISWA / PESERTA DIDIK */
        <div className="flex-1 flex flex-col">
          <header className="w-full bg-gradient-to-r from-sky-600 via-sky-600 to-blue-600 border-b border-sky-500/40 text-white shadow-sm sticky top-0 z-30 select-none">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white text-sky-800 flex items-center justify-center font-black text-sm tracking-tight shadow-md">
                  KBD
                </div>
                <div>
                  <h1 className="text-sm sm:text-base font-black text-white leading-tight">
                    Ruang Diskusi Siswa
                  </h1>
                  <span className="text-[10px] sm:text-[11px] font-bold text-sky-100 uppercase">
                    {config.className} · PIN #{config.sessionCode}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              </div>
            </div>
          </header>

          <div className="flex-1 flex items-center justify-center p-4 max-w-md mx-auto w-full">
            {currentStudentData && (
              <div className="w-full bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-sky-900/5 border border-sky-100 space-y-5">
                <div className="text-center space-y-1">
                  <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-black text-xl mx-auto shadow-md shadow-sky-200">
                    #{currentStudentData.deskNumber}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 pt-1">
                    {currentStudentData.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Meja #{currentStudentData.deskNumber} · {config.topic}
                  </p>
                </div>

                {activeSpeaker?.studentId === currentStudentData.id ? (
                  <div className="p-4 rounded-2xl bg-sky-600 text-white text-center space-y-1 shadow-md shadow-sky-200 animate-pulse">
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-100 flex items-center justify-center gap-1">
                      <Mic className="w-3.5 h-3.5" /> Giliran Anda Berbicara
                    </span>
                    <div className="text-4xl font-black font-mono">
                      {activeSpeaker.remainingSeconds}s
                    </div>
                  </div>
                ) : activeSpeaker ? (
                  <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-100 text-center text-xs text-slate-600">
                    <span>Sedang berbicara di kelas: </span>
                    <strong className="text-sky-900">{activeSpeaker.studentName}</strong> (
                    {activeSpeaker.remainingSeconds}s)
                  </div>
                ) : null}

                <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">Sisa Kuota Bicara:</span>
                    <span className="font-extrabold text-sky-700 text-sm">
                      {currentStudentData.remainingTokens} dari {currentStudentData.tokensQuota} Token
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: currentStudentData.tokensQuota }).map((_, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "h-2.5 flex-1 rounded-full transition-colors",
                          idx < currentStudentData.remainingTokens
                            ? "bg-sky-600"
                            : "bg-sky-100"
                        )}
                      />
                    ))}
                  </div>
                </div>

                <button
                  disabled={
                    currentStudentData.remainingTokens === 0 ||
                    Boolean(activeSpeaker && activeSpeaker.studentId !== currentStudentData.id)
                  }
                  onClick={() => handleOpenTokenModal(currentStudentData)}
                  className={cn(
                    "w-full py-3 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95",
                    currentStudentData.remainingTokens > 0
                      ? "bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-700 hover:to-sky-600 text-white shadow-sky-600/20"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  )}
                >
                  <Flame className="w-4 h-4" />
                  <span>
                    {currentStudentData.remainingTokens > 0
                      ? "Klaim Kartu Bicara"
                      : "Semua Kuota Telah Digunakan"}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Tambah Kelas Baru */}
      <AddClassModal
        isOpen={isAddClassOpen}
        onClose={() => setIsAddClassOpen(false)}
        onAddClass={handleAddClass}
      />

      {/* Modal Tambah Siswa Baru ke Kelas Terpilih */}
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        classNameTitle={currentClass?.name || "Kelas"}
        suggestedDeskNumber={students.length + 1}
        tokensPerStudent={currentClass?.tokensPerStudent || 3}
        onAddStudent={handleAddStudent}
      />

      {/* Modal Pemilih Kategori Token Taksonomi (Model Arends) */}
      <TypeSelectorModal
        isOpen={isModalOpen}
        student={selectedStudentForModal}
        defaultDurationSeconds={config.speechTimeLimitSeconds}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmStartSpeech}
      />

      {/* Fullscreen Giant Animated Countdown Overlay */}
      <FullscreenCountdownOverlay
        speaker={activeSpeaker}
        forceShow={forceFullscreenOverlay}
        onExtendTime={handleExtendTime}
        onTogglePause={handleTogglePause}
        onFinishSpeech={handleFinishSpeech}
        onPlayTick={playTickWarning}
        onPlayBuzzer={playFinalBuzzer}
        isMuted={isMuted}
        onToggleMute={toggleMute}
      />

      {/* Modal Edit Profil Pengguna */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        currentUser={currentUser}
        onClose={() => setIsEditProfileOpen(false)}
        onProfileUpdated={handleProfileUpdated}
      />

      {/* Modal FAQ & Panduan Kartu Bicara Digital */}
      <FaqModal isOpen={isFaqOpen} onClose={() => setIsFaqOpen(false)} />

      {/* Modal Konfirmasi: Keluar dari Akun */}
      <ConfirmModal
        isOpen={isLogoutConfirmOpen}
        variant="warning"
        title="Keluar dari Akun?"
        message="Sesi login Anda akan diakhiri dan Anda perlu masuk kembali untuk mengakses ruang diskusi kelas."
        confirmText="Ya, Keluar Akun"
        cancelText="Batal"
        onConfirm={executeLogout}
        onCancel={() => setIsLogoutConfirmOpen(false)}
      />

      {/* Modal Konfirmasi: Reset Sesi Kelas */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        variant="danger"
        title="Reset Sesi Kelas Ini?"
        message={`Seluruh jatah keping token dan riwayat bicara siswa pada "${currentClass?.name}" akan dikembalikan ke kondisi awal.`}
        note="Tindakan ini akan mengosongkan log pembicara yang sudah tercatat pada sesi kelas ini."
        confirmText="Ya, Reset Sesi"
        cancelText="Batal"
        onConfirm={executeResetSession}
        onCancel={() => setIsResetConfirmOpen(false)}
      />

      {/* Modal Informasi: Belum Ada Pembicara Aktif */}
      <ConfirmModal
        isOpen={isNoSpeakerAlertOpen}
        variant="info"
        title="Belum Ada Siswa yang Berbicara"
        message="Silakan pilih salah satu kartu siswa dan berikan token bicara terlebih dahulu untuk menampilkan timer proyektor layar penuh."
        confirmText="Mengerti"
        showCancel={false}
        onConfirm={() => setIsNoSpeakerAlertOpen(false)}
        onCancel={() => setIsNoSpeakerAlertOpen(false)}
      />

      {/* Modal Konfirmasi: Hapus Siswa dari Kelas */}
      <ConfirmModal
        isOpen={Boolean(studentToDelete)}
        variant="danger"
        title={`Hapus Siswa "${studentToDelete?.name}"?`}
        message={`Siswa nomor meja #${studentToDelete?.deskNumber} akan dihapus dari ${currentClass?.name}.`}
        note="Data riwayat token bicara siswa ini pada kelas ini juga akan dihapus."
        confirmText="Ya, Hapus Siswa"
        cancelText="Batal"
        onConfirm={executeDeleteStudent}
        onCancel={() => setStudentToDelete(null)}
      />
    </main>
  );
}
