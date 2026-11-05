"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  HelpCircle,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart3,
  ChevronDown,
  ArrowRight,
  School,
  LayoutDashboard,
  UserPen,
  LogOut,
} from "lucide-react";
import { AuthUser, getStoredUser, clearStoredUser } from "@/lib/auth";
import { ConfirmModal } from "@/components/ConfirmModal";
import { FaqPageSkeleton } from "@/components/skeletons";
import { cn } from "@/lib/utils";

type FaqCategory = "ALL" | "ARENDS" | "CARDS_TIMER" | "CLASS_MANAGEMENT" | "EVALUATION";

interface FaqItem {
  id: string;
  category: FaqCategory;
  categoryLabel: string;
  question: string;
  answer: string;
  tips?: string;
  tags: string[];
}

const FAQ_DATA: FaqItem[] = [
  {
    id: "faq-1",
    category: "ARENDS",
    categoryLabel: "Model Arends",
    question: "Apa itu Model Pembelajaran Time Token Arends?",
    answer:
      "Time Token Arends adalah model pembelajaran kooperatif terstruktur yang dikembangkan oleh Richard Arends. Model ini bertujuan melatih keterampilan sosial dan berbicara siswa secara demokratis, terukur, dan setara. Setiap siswa diberikan sejumlah 'token' atau kartu bicara sebagai tiket untuk menyampaikan gagasan dalam diskusi kelompok.",
    tips: "Model ini sangat ampuh mencegah dominasi siswa yang terlampau vokal sekaligus memberikan ruang aman bagi siswa pemalu.",
    tags: ["model", "arends", "time token", "dasar", "teori", "filosofi"],
  },
  {
    id: "faq-2",
    category: "CARDS_TIMER",
    categoryLabel: "Kartu & Timer",
    question: "Bagaimana cara kerja kuota kartu dan timer bicara digital?",
    answer:
      "Setiap siswa diberikan jatah kuota kartu bicara yang setara (standar 3 token). Setiap kali siswa angkat tangan dan dipanggil berbicara oleh guru, satu keping token akan digunakan dan timer digital otomatis menghitung durasi bicara sesuai batas waktu (standar 60 detik).",
    tips: "Jika kuota kartu siswa telah habis, siswa tersebut harus mendengarkan rekannya hingga seluruh siswa di kelas menggunakan kartu bicaranya.",
    tags: ["kuota", "token", "timer", "durasi", "waktu", "kartu bicara"],
  },
  {
    id: "faq-3",
    category: "ARENDS",
    categoryLabel: "Model Arends",
    question: "Apa saja 4 kategori taksonomi kontribusi dalam aplikasi KBD?",
    answer:
      "Aplikasi membagi kontribusi siswa menjadi 4 kategori ilmiah: (1) Bertanya: mengajukan pertanyaan kritis; (2) Menjawab: memberikan klarifikasi atau solusi; (3) Berpendapat: menyampaikan argumen atau sudut pandang baru; dan (4) Menanggapi: menyanggah atau menguatkan pendapat rekan secara santun.",
    tips: "Guru dapat mendorong siswa untuk mencoba taksonomi yang berbeda agar kemampuan berpikir kritis terasah secara menyeluruh.",
    tags: ["taksonomi", "bertanya", "menjawab", "berpendapat", "menanggapi", "kategori"],
  },
  {
    id: "faq-4",
    category: "ARENDS",
    categoryLabel: "Model Arends",
    question: "Mengapa ada indikator warna kuning berlabel 'Belum Bicara' (Idle)?",
    answer:
      "Indikator 'Belum Bicara' berwarna kuning (dengan tombol oranye 'Panggil') adalah implementasi dari prinsip inklusivitas Arends. Fitur ini membantu guru mendeteksi secara instan siapa saja siswa yang belum pernah berkontribusi, sehingga guru dapat memprioritaskan giliran berbicara untuk mereka.",
    tips: "Ajak siswa berlabel Belum Bicara dengan pertanyaan pemantik bertingkat yang tidak menghakimi agar mereka merasa percaya diri.",
    tags: ["belum bicara", "idle", "indikator", "panggil", "prioritas", "inklusif"],
  },
  {
    id: "faq-5",
    category: "CARDS_TIMER",
    categoryLabel: "Kartu & Timer",
    question: "Bagaimana sistem pengingat audio (sound effect) bekerja?",
    answer:
      "Aplikasi memanfaatkan Web Audio API bawaan peramban (tanpa perlu mengunduh berkas audio eksternal). Sistem membunyikan detak pengingat halus saat waktu bicara tersisa 10 detik terakhir, serta bunyi bel ganda saat waktu bicara telah habis. Suara dapat dibisukan sewaktu-waktu melalui tombol audio di pojok kanan atas.",
    tips: "Gunakan pengingat suara ini sebagai konsensus batas bicara yang objektif dan menyenangkan bagi kelas.",
    tags: ["audio", "suara", "bell", "pengingat", "beep", "mute"],
  },
  {
    id: "faq-6",
    category: "CLASS_MANAGEMENT",
    categoryLabel: "Manajemen Kelas",
    question: "Apakah guru dapat menambah kelas dan siswa baru secara mandiri?",
    answer:
      "Tentu saja. Guru dapat membuat ruang kelas baru melalui tombol '+ Tambah Kelas', menentukan mata pelajaran, topik diskusi, dan jatah kuota kartu. Di dalam kelas tersebut, guru dapat menambahkan siswa satu per satu lengkap dengan nama dan nomor meja tempat duduk.",
    tips: "Setiap kelas memiliki kode sesi PIN acak 6 digit yang memudahkan identifikasi sesi pembelajaran.",
    tags: ["tambah kelas", "tambah siswa", "kelas", "nomor meja", "pin", "sesi"],
  },
  {
    id: "faq-7",
    category: "EVALUATION",
    categoryLabel: "Evaluasi & Statistik",
    question: "Informasi apa saja yang dapat diperoleh pada tab Statistik & Evaluasi?",
    answer:
      "Tab Statistik menyajikan persentase keaktifan kelas, total token terpakai, rata-rata durasi bicara, distribusi 4 kategori taksonomi, serta perbandingan antara siswa yang telah aktif berbicara dan siswa yang masih pasif.",
    tips: "Gunakan metrik ini untuk penilaian formatif keaktifan diskusi dan pelaporan hasil belajar kooperatif.",
    tags: ["statistik", "evaluasi", "keaktifan", "grafik", "laporan", "nilai"],
  },
  {
    id: "faq-8",
    category: "EVALUATION",
    categoryLabel: "Evaluasi & Statistik",
    question: "Bagaimana cara melihat log kronologis riwayat penggunaan kartu bicara?",
    answer:
      "Guru dapat membuka tab 'Riwayat Token' pada navbar atas. Halaman tersebut mencatat secara terperinci setiap transaksi kartu bicara secara berurutan, meliputi nama siswa, nomor meja, jam tepat saat berbicara, jenis kategori kartu, serta durasi waktu yang dihabiskan.",
    tips: "Log ini dapat dijadikan bukti autentik ketercapaian proses pembelajaran kooperatif di kelas.",
    tags: ["riwayat token", "timeline", "log", "kronologis", "transaksi"],
  },
  {
    id: "faq-9",
    category: "CLASS_MANAGEMENT",
    categoryLabel: "Manajemen Kelas",
    question: "Apakah aplikasi Kartu Bicara Digital membutuhkan koneksi internet konstan?",
    answer:
      "Aplikasi dirancang tangguh dengan persistensi data lokal (Local Storage) di peramban web modern. Anda dapat menjalankan sesi diskusi kelas secara lancar tanpa khawatir kehilangan data ketika koneksi internet sekolah mengalami fluktuasi.",
    tips: "Pastikan Anda tidak menghapus cache peramban jika ingin mempertahankan data sesi kelas yang telah berlangsung.",
    tags: ["offline", "koneksi", "localstorage", "penyimpanan", "internet"],
  },
];

export default function FaqPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [selectedCategory, setSelectedCategory] = useState<FaqCategory>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>("faq-1");

  useEffect(() => {
    const timer = setTimeout(() => {
      setUser(getStoredUser());
      setIsLoaded(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearStoredUser();
    router.replace("/login");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "G";

  // Filter FAQ berdasarkan kategori dan kata kunci pencarian
  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchCategory =
        selectedCategory === "ALL" || item.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchCategory;

      const matchText =
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q));

      return matchCategory && matchText;
    });
  }, [selectedCategory, searchQuery]);

  // Toggle accordion
  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const categories: { id: FaqCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "ALL", label: "Semua Topik", icon: HelpCircle },
    { id: "ARENDS", label: "Model Arends", icon: BookOpen },
    { id: "CARDS_TIMER", label: "Kartu & Timer", icon: Clock },
    { id: "CLASS_MANAGEMENT", label: "Manajemen Kelas", icon: School },
    { id: "EVALUATION", label: "Evaluasi & Statistik", icon: BarChart3 },
  ];

  if (!isLoaded) {
    return <FaqPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F0F7FF] text-slate-900 flex flex-col font-sans">
      {/* ======================================================== */}
      {/* 1. TOP NAVBAR PUSAT BANTUAN & FAQ                        */}
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
                Pusat Bantuan & FAQ
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
                  href="/profil"
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2 font-medium transition-colors"
                >
                  <UserPen className="w-3.5 h-3.5 text-sky-600" />
                  <span>Halaman Profil Saya</span>
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
      {/* 2. HERO SEARCH SECTION                                   */}
      {/* ======================================================== */}
      <section className="bg-gradient-to-b from-sky-100/60 to-transparent py-8 sm:py-12 border-b border-sky-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 border border-sky-200/80 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Panduan & Pedoman Model Pembelajaran Kooperatif</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Bagaimana Kami Dapat Membantu Anda?
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Temukan jawaban komprehensif mengenai tata cara penerapan model Time Token Arends,
            penggunaan kartu bicara interaktif, serta panduan evaluasi keaktifan siswa di kelas.
          </p>

          {/* Kolom Pencarian FAQ */}
          <div className="max-w-xl mx-auto pt-2">
            <div className="relative">
              <Search className="w-5 h-5 text-sky-600 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pertanyaan, kata kunci: kuota, idle, timer, taksonomi..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-sky-200/80 shadow-md shadow-sky-100 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. MAIN ACCORDION & TOPICS CONTAINER                     */}
      {/* ======================================================== */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Filter Kategori Topik */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0",
                  isSelected
                    ? "bg-sky-600 text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-700 border border-sky-100"
                )}
              >
                <Icon className={cn("w-3.5 h-3.5", isSelected ? "text-white" : "text-sky-600")} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Daftar Accordion Pertanyaan */}
        <div className="space-y-3.5">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const isExpanded = expandedId === faq.id;

              return (
                <div
                  key={faq.id}
                  className={cn(
                    "rounded-3xl bg-white border transition-all duration-200 overflow-hidden",
                    isExpanded
                      ? "border-sky-300 shadow-md shadow-sky-50"
                      : "border-sky-100 hover:border-sky-200 shadow-2xs"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-3 focus:outline-none"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 mt-0.5 transition-colors",
                          isExpanded
                            ? "bg-sky-600 text-white"
                            : "bg-sky-50 text-sky-800 border border-sky-100"
                        )}
                      >
                        {index + 1}
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 block">
                          {faq.categoryLabel}
                        </span>
                        <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                          {faq.question}
                        </h2>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 shrink-0 transition-transform duration-200",
                        isExpanded && "rotate-180 bg-sky-50 text-sky-700"
                      )}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-sky-50 space-y-3.5 animate-in fade-in duration-200">
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-10 sm:pl-11">
                        {faq.answer}
                      </p>

                      {faq.tips && (
                        <div className="ml-10 sm:ml-11 p-3.5 rounded-2xl bg-sky-50/60 border border-sky-200/70 text-xs text-sky-900 flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block text-sky-950">Tips Pedagogis Guru:</span>
                            <span className="text-slate-600">{faq.tips}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white border border-sky-100 space-y-3">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                Pertanyaan Tidak Ditemukan
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Tidak ada topik yang cocok dengan kata kunci &quot;{searchQuery}&quot;. Coba gunakan kata kunci lain seperti: token, taksonomi, durasi, atau audio.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("ALL");
                }}
                className="px-4 py-2 rounded-xl bg-sky-50 text-sky-700 font-bold text-xs hover:bg-sky-100 transition-colors"
              >
                Tampilkan Semua Pertanyaan
              </button>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* 4. SINTAKS MODEL PEMBELAJARAN TIME TOKEN ARENDS          */}
        {/* ======================================================== */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-6">
          <div className="border-b border-sky-50 pb-4">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block">
              Pedoman Praktik Guru
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-0.5">
              4 Langkah Sintaks Model Time Token Arends
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Panduan implementasi bertahap di ruang kelas agar iklim diskusi berjalan tertib, merata, dan antusias.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Langkah 1 */}
            <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                1
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                Pengondisian & Kuota
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Guru membuka kelas, memperkenalkan topik bahasan, dan membagikan kuota kartu bicara digital (2-4 kartu) untuk tiap siswa.
              </p>
            </div>

            {/* Langkah 2 */}
            <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                2
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                Aturan & 4 Taksonomi
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Guru menjelaskan aturan main: 1 kartu bicara berlaku untuk 1 kali kontribusi (Bertanya, Menjawab, Berpendapat, Menanggapi).
              </p>
            </div>

            {/* Langkah 3 */}
            <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                3
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                Diskusi dengan Timer
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Siswa mengutarakan ide secara bergantian sesuai timer digital. Siswa yang belum bicara diprioritaskan untuk dipanggil lebih dulu.
              </p>
            </div>

            {/* Langkah 4 */}
            <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                4
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                Refleksi & Evaluasi
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Guru bersama siswa menyimpulkan hasil diskusi dan meninjau grafik keterlibatan di tab Statistik & Evaluasi KBD.
              </p>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 5. CTA CARD MULAI SESI DISKUSI                           */}
        {/* ======================================================== */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-sky-600 via-sky-600 to-blue-600 text-white shadow-lg shadow-sky-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-black tracking-tight">
              Siap Memulai Sesi Diskusi Kelas yang Adil?
            </h3>
            <p className="text-xs sm:text-sm text-sky-100 max-w-xl">
              Kembali ke dashboard utama untuk memilih kelas, membagikan token bicara, dan mengaktifkan timer interaktif.
            </p>
          </div>

          <Link
            href="/"
            className="px-6 py-3 rounded-2xl bg-white text-sky-800 hover:bg-sky-50 font-black text-xs sm:text-sm flex items-center gap-2 shrink-0 shadow-md transition-all group"
          >
            <span>Buka Dashboard Kelas</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>

      {/* Footer Hak Cipta & Info */}
      <footer className="border-t border-sky-100 bg-white py-6 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-slate-400">
          Kartu Bicara Digital (KBD) · Implementasi Model Pembelajaran Kooperatif Time Token Arends
        </div>
      </footer>

      {/* Modal Dialog Konfirmasi Keluar */}
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        variant="danger"
        title="Keluar dari Akun?"
        message="Anda akan keluar dari sesi ini dan diarahkan ke halaman login."
        confirmText="Ya, Keluar Akun"
        cancelText="Batal"
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
}

