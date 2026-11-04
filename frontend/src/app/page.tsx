"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Play,
  Pause,
  PlusCircle,
  Square,
  Sparkles,
  Users,
  ArrowLeft,
  UserPlus,
  FileSpreadsheet,
} from "lucide-react";
import {
  ActiveSpeaker,
  ClassRoom,
  Role,
  SessionConfig,
  SessionStatus,
  Student,
  TokenType,
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
import { AnalyticsDashboardView } from "@/components/AnalyticsDashboardView";
import { StudentDashboardView } from "@/components/StudentDashboardView";
import {
  ClassStatsHeaderSkeleton,
  ClassListSkeleton,
} from "@/components/skeletons";
import { exportClassDiscussionToExcel } from "@/lib/excelExport";
import { cn } from "@/lib/utils";

export default function Home() {
  const router = useRouter();

  // 1. Pengguna Terotentikasi & Hydration Status
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // 2. Daftar Kelas (Classrooms) & Kelas Terpilih
  const [classes, setClasses] = useState<ClassRoom[]>(() => generateInitialClassrooms());

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

  // Pengaturan Formulir Sementara
  const [settingsForm, setSettingsForm] = useState<SessionConfig>(INITIAL_SESSION_CONFIG);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState("");

  const sessionStatus: SessionStatus = "ACTIVE";
  const [activeSpeaker, setActiveSpeaker] = useState<ActiveSpeaker | null>(null);

  // Sinkronisasi Sesi saat Kelas Berganti
  useEffect(() => {
    if (currentClass) {
      const timer = setTimeout(() => {
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
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [currentClass]);

  // Simpan data kelas ke localStorage secara otomatis
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("kbd_classrooms_v1", JSON.stringify(classes));
    } catch (e) {
      console.error("Gagal menyimpan ke localStorage", e);
    }
  }, [classes, isHydrated]);

  // Simpan ID kelas aktif ke localStorage secara otomatis (agar tidak balik ke list kelas saat refresh)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      if (selectedClassId) {
        localStorage.setItem("kbd_selected_class_id_v1", selectedClassId);
      } else {
        localStorage.removeItem("kbd_selected_class_id_v1");
      }
    } catch (e) {
      console.error("Gagal menyimpan kbd_selected_class_id_v1", e);
    }
  }, [selectedClassId, isHydrated]);

  // Validasi ID kelas: Jika ID yang tersimpan tidak ditemukan di classes, reset ke null
  useEffect(() => {
    if (!isHydrated) return;
    if (selectedClassId && classes.length > 0) {
      const exists = classes.some((c) => c.id === selectedClassId);
      if (!exists) {
        const timer = setTimeout(() => setSelectedClassId(null), 0);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedClassId, classes, isHydrated]);

  // Simpan tab aktif pendidik ke localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem("kbd_active_teacher_tab_v1", activeTeacherTab);
    } catch (e) {
      console.error("Gagal menyimpan kbd_active_teacher_tab_v1", e);
    }
  }, [activeTeacherTab, isHydrated]);

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

  // Baca pengguna & status tersimpan saat mount (Mencegah Hydration Mismatch)
  useEffect(() => {
    const timer = setTimeout(() => {
      // 1. Pengguna tersimpan
      const user = getStoredUser();
      if (user) {
        setCurrentUser(user);
      }

      // 2. Daftar kelas tersimpan
      try {
        const savedClasses = localStorage.getItem("kbd_classrooms_v1");
        if (savedClasses) {
          const parsed = JSON.parse(savedClasses);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setClasses(parsed);
          }
        }
      } catch (e) {
        console.error("Gagal memuat kbd_classrooms_v1", e);
      }

      // 3. ID kelas terpilih terakhir
      try {
        const savedClassId = localStorage.getItem("kbd_selected_class_id_v1");
        if (savedClassId) {
          setSelectedClassId(savedClassId);
        }
      } catch (e) {
        console.error("Gagal memuat kbd_selected_class_id_v1", e);
      }

      // 4. Tab aktif terakhir
      try {
        const savedTab = localStorage.getItem("kbd_active_teacher_tab_v1") as TeacherTab;
        if (
          savedTab &&
          ["DISCUSSION", "ANALYTICS", "TIMELINE", "SETTINGS"].includes(savedTab)
        ) {
          setActiveTeacherTab(savedTab);
        }
      } catch (e) {
        console.error("Gagal memuat kbd_active_teacher_tab_v1", e);
      }

      setIsHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const userRole: Role = currentUser ? currentUser.role : "TEACHER";

  // Siswa otomatis masuk ke kelasnya tanpa perlu memilih
  useEffect(() => {
    if (userRole === "STUDENT" && !selectedClassId && classes.length > 0) {
      const match =
        classes.find((c) => c.name === currentUser?.className) || classes[0];
      const timer = setTimeout(() => setSelectedClassId(match.id), 0);
      return () => clearTimeout(timer);
    }
  }, [userRole, selectedClassId, classes, currentUser]);

  const handleLogout = () => {
    setIsLogoutConfirmOpen(true);
  };

  const executeLogout = () => {
    clearStoredUser();
    setCurrentUser(null);
    setSelectedClassId(null);
    try {
      localStorage.removeItem("kbd_selected_class_id_v1");
      localStorage.removeItem("kbd_active_teacher_tab_v1");
    } catch {}
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

  // Seluruh Token Terpakai Tanpa Filter (Untuk Riwayat Siswa & Live Feed)
  const allClassTokensUnfiltered = useMemo(() => {
    const list: Token[] = students.flatMap((s) => s.usedTokens);
    list.sort((a, b) => new Date(b.usedAt).getTime() - new Date(a.usedAt).getTime());
    return list;
  }, [students]);

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

  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-[#F0F7FF] text-slate-900 flex flex-col font-sans">
        <ClassStatsHeaderSkeleton />
        <div className="flex-1 px-4 sm:px-6 py-6 max-w-7xl mx-auto w-full">
          <ClassListSkeleton />
        </div>
      </main>
    );
  }

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
                <AnalyticsDashboardView
                  stats={classStats}
                  students={students}
                  currentClass={currentClass}
                  allUsedTokens={allUsedTokens}
                  currentUser={currentUser}
                  onCallStudent={(student) => {
                    setSelectedStudentForModal(student);
                    setIsModalOpen(true);
                  }}
                  onSwitchToTimeline={() => setActiveTeacherTab("TIMELINE")}
                />
              )}

              {/* TAB 3: RIWAYAT TOKEN */}
              {activeTeacherTab === "TIMELINE" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 sm:p-5 rounded-3xl bg-white border border-sky-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                        Log Riwayat Kartu Bicara
                      </h3>
                      <p className="text-xs text-slate-500">
                        Urutan kronologis siswa yang telah menggunakan kartu bicara di kelas ini
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() =>
                          exportClassDiscussionToExcel({
                            currentClass,
                            stats: classStats,
                            students,
                            allUsedTokens,
                            currentUser,
                          })
                        }
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs group"
                        title="Unduh rekap data sesi ini dalam format Excel (.xlsx)"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                        <span>Ekspor Excel (.xlsx)</span>
                      </button>

                      <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-100">
                        Total: {allUsedTokens.length} Kali
                      </span>
                    </div>
                  </div>

                  {/* Kategori Filter Token */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {[
                      { label: "Semua Kategori", val: null },
                      { label: "Bertanya", val: "BERTANYA" as TokenType },
                      { label: "Menjawab", val: "MENJAWAB" as TokenType },
                      { label: "Berpendapat", val: "BERPENDAPAT" as TokenType },
                      { label: "Sanggahan", val: "SANGGAHAN" as TokenType },
                    ].map((btn) => (
                      <button
                        key={btn.label}
                        type="button"
                        onClick={() => setTimelineFilter(btn.val)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border",
                          timelineFilter === btn.val
                            ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                            : "bg-white text-slate-600 border-slate-200/80 hover:bg-sky-50 hover:text-sky-700"
                        )}
                      >
                        {btn.label}
                      </button>
                    ))}
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
                                {new Date(tok.usedAt).toLocaleTimeString("id-ID")} · #{tok.deskNumber}
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
                    <div className="p-10 rounded-3xl bg-white border border-sky-100 text-center text-slate-400 text-xs">
                      Belum ada token yang terpakai pada kelas ini.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: PENGATURAN KELAS */}
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
        currentStudentData ? (
          <StudentDashboardView
            student={currentStudentData}
            activeSpeaker={activeSpeaker}
            allClassTokens={allClassTokensUnfiltered}
            classStats={classStats}
            config={config}
            onLogout={handleLogout}
          />
        ) : null
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
        message={`Siswa #${studentToDelete?.deskNumber} (${studentToDelete?.name}) akan dihapus dari ${currentClass?.name}.`}
        note="Data riwayat token bicara siswa ini pada kelas ini juga akan dihapus."
        confirmText="Ya, Hapus Siswa"
        cancelText="Batal"
        onConfirm={executeDeleteStudent}
        onCancel={() => setStudentToDelete(null)}
      />
    </main>
  );
}
