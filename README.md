# Kartu Bicara Digital (KBD) — Model Pembelajaran Kooperatif Time Token Arends

[![Next.js](https://img.shields.io/badge/Next.js-16.4.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express.js-4.21.2-lightgrey?style=for-the-badge&logo=express)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.4.1-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-336791?style=for-the-badge&logo=postgresql)](https://supabase.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

Aplikasi web modern berbasis model pembelajaran kooperatif **Time Token Arends** (Richard Arends). Dirancang khusus untuk memoderasi dan mendistribusikan hak berbicara di ruang kelas secara **demokratis, adil, transparan, dan terukur**.

Aplikasi ini menggantikan kartu kupon fisik konvensional dengan sistem kuota token digital, hitung mundur *real-time* presisi tinggi, pelabelan keterampilan berpikir taksonomi, evaluasi indeks keadilan, serta pelaporan otomatis format Excel (`.xlsx`).

---

## 📌 Daftar Isi
1. [Latar Belakang Pedagogis](#-latar-belakang-pedagogis-model-arends)
2. [Fitur-Fitur Utama](#-fitur-fitur-utama)
3. [Arsitektur & Tech Stack](#-arsitektur--tech-stack)
4. [Daftar Akun Pengguna Bawaan (Seed)](#-daftar-akun-pengguna-bawaan-seed)
5. [Skema Database (Prisma ORM & Supabase)](#-skema-database-prisma-orm--supabase)
6. [Panduan Instalasi & Menjalankan](#-panduan-instalasi--menjalankan-proyek)
7. [Daftar Endpoint REST API](#-daftar-endpoint-rest-api)
8. [Pengujian Kualitas & UAT](#-pengujian-kualitas--uat)

---

## 🎓 Latar Belakang Pedagogis: Model Arends

Dalam pembelajaran diskusi kelompok atau kelas tradisional, sering timbul dua masalah mendasar:
1. **Dominasi Pembicara Aktif (*The Talkative Student*)**: Sebagian kecil siswa yang vokal cenderung memonopoli alur diskusi.
2. **Kecenderungan Pasif (*The Reluctant/Shy Student*)**: Siswa yang pendiam enggan atau ragu menyuarakan pendapatnya.

Model **Time Token Arends** mengatasi masalah ini dengan membagikan sejumlah kartu bicara (kuota token) kepada setiap peserta didik:
- Setiap kali seorang siswa ingin berbicara, ia harus menyerahkan 1 kartu bicara dan hanya memiliki durasi waktu bicara yang dibatasi oleh pewaktu (misal 60 detik).
- Siswa yang kuotanya telah habis **tidak diperkenankan berbicara lagi** sampai seluruh rekannya telah memanfaatkan kartu bicaranya.
- Dengan cara ini, diskusi kelas berlangsung teratur, demokratis, dan seluruh siswa mendapatkan kesempatan yang setara untuk melatih keterampilan berbicara di depan umum.

---

## ✨ Fitur-Fitur Utama

### 1. 🗂️ 4 Taksonomi Keterampilan Berbicara
Setiap kali siswa dipanggil atau meminta giliran bicara, guru mengategorikan kontribusinya ke dalam salah satu dari 4 taksonomi kartu bicara:
- 🙋‍♀️ **Bertanya** (*Pink*): Mengajukan pertanyaan kritis yang relevan untuk memperdalam pemahaman materi.
- 💡 **Menjawab** (*Amber*): Memberikan jawaban, penjelasan, atau solusi atas pertanyaan teman atau guru.
- 💬 **Berpendapat** (*Cyan*): Menyampaikan sudut pandang baru, gagasan, atau ide dengan penalaran logis.
- 🔄 **Menanggapi** (*Emerald*): Mengafirmasi, memperkuat, atau menyanggah argumen rekan secara santun dan etis.

### 2. ⏱️ Engine Timer & Durasi Bicara Presisi Tinggi (Drift-Free)
- **Kalkulasi Nyata Berbasis Timestamp (`Date.now()`)**: Menjamin penghitungan durasi bicara 100% akurat tanpa *timer drift* akibat lag atau *re-render* peramban.
- **Kontrol Pendidik Interaktif**: Dilengkapi tombol **Jeda (Pause)**, **Lanjutkan (Resume)**, dan **Tambah Waktu (+15s)**. Waktu saat jeda tidak akan pernah terhitung ke dalam durasi bicara siswa.
- **Pencatatan Waktu Nyata**: Durasi bicara dicatat detik per detik murni sesuai kenyataan (misal 3 detik, 18 detik, 45 detik).
- **Fullscreen Giant Animated Overlay**: Tampilan layar penuh dengan efek visual denyut urgensi pada 10 detik terakhir dan bunyi *buzzer* otomatis saat waktu habis.

### 3. 🏫 Manajemen Kelas & Sinkronisasi Kuota Dinamis
- **Multi-Kelas & PIN Sesi 6-Digit**: Mendukung banyak rombel kelas sekaligus (bawaan: Kelas X.E3 PIN `#382910` dan Kelas X.E5 PIN `#491820`).
- **Sinkronisasi Otomatis Kuota Token**: Jika guru mengubah jatah token per siswa di menu Pengaturan (misal 3 $\rightarrow$ 4 token), sisa token seluruh siswa otomatis bertambah secara dinamis $\max(0, \text{Kuota Baru} - \text{Token Terpakai})$.
- **Manajemen Siswa Sesuai Presensi**: Daftar siswa terstruktur rapi berdasarkan nomor urut absensi resmi (bukan nomor meja fisik).
- **Inisialisasi Kelas Baru Kosong**: Pembuatan kelas baru selalu dimulai dalam kondisi bersih (0 siswa) tanpa data dummy.

### 4. 📊 Statistik, Evaluasi & Indeks Keadilan Diskusi
- **Tingkat Partisipasi Kelas**: Persentase rasio siswa aktif berbicara dibanding total siswa terdaftar.
- **Indeks Keadilan Giliran (Fairness Index)**: Skor metrik keadilan partisipasi (0–100) untuk mengukur keberhasilan pencegahan monopoli bicara.
- **Diagram Batang Taksonomi Interaktif**: Visualisasi perbandingan distribusi kontribusi 4 kategori kartu bicara.
- **Daftar Prioritas Panggilan**: Pengelompokan siswa *Top Kontributor* dan siswa *Belum Berbicara* agar guru dapat memberikan stimulus dengan tepat sasaran.

### 5. 📑 Rekap & Ekspor Laporan Excel Otomatis (`.xlsx`)
Laporan terstruktur dengan penataan gaya profesional siap cetak:
- **Sheet 1 (Rekap Keaktifan Siswa)**: Rekapitulasi per siswa (No, No. Absen, Nama Siswa, Status Keaktifan, Token Terpakai, Total Waktu Bicara, Rincian Jenis Kartu, Waktu Bicara Terakhir, dan Total Kelas).
- **Sheet 2 (Log Riwayat Transaksi)**: Urutan kronologis lengkap setiap pemakaian kartu bicara beserta taksonomi dan waktu kejadian.

### 6. 🔐 Multi-Role & Quick Login 1-Click
- **Role Pendidik (Guru)**: Akses ke manajemen kelas, kontrol timer, statistik evaluasi, pengaturan sesi, dan ekspor Excel.
- **Role Peserta Didik (Siswa)**: Dashboard siswa untuk melihat jatah kuota kartu miliknya secara langsung, status aktif sesi, dan riwayat bicara pribadinya.
- **Fitur Quick Login**: Akses masuk instan 1-klik untuk akun demo resmi tanpa perlu mengetik manual:
  - `Guru Mutia` (`mutiapuspitasari@gmail.com`)
  - `Siswa Abdul Arif` (`Kelas X.E3`)
  - `Siswa Adelya Alsa Sakhira` (`Kelas X.E5`)

---

## 🛠️ Arsitektur & Tech Stack

```
kartu-bicara-digital/
├── frontend/             # Next.js 16 (App Router) + React 19 + Tailwind CSS v4
│   ├── src/app/          # Halaman: /, /login, /register, /profile, /faq
│   ├── src/components/   # Komponen UI: Timer, Grid Siswa, Header, Modal, Dashboard
│   ├── src/lib/          # API Client, Firebase Auth, Excel Export, State Helpers
│   └── src/types/        # Kontrak antarmuka TypeScript sesi & data model
│
├── backend/              # Node.js + Express.js + Prisma ORM + Socket.io
│   ├── prisma/           # Schema Prisma & Client PostgreSQL
│   ├── src/config/       # Konfigurasi Prisma, Firebase SDK, & Environment
│   ├── src/controllers/  # Auth, Class, Student, Speaker, Stats, Profile Controllers
│   ├── src/data/         # Memory Store Sinkron & Seed Data Rombel Presensi
│   ├── src/routes/       # Router REST API Express
│   └── src/sockets/      # WebSocket Server untuk sinkronisasi real-time
│
└── package.json          # Root Monorepo Orchestrator & Script Typecheck
```

### Rincian Teknologi
| Lapisan / Komponen | Teknologi yang Digunakan | Keterangan |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 16.4.5 (Turbopack)** | App Router, Server Components & Static Optimization |
| **Frontend UI Library** | **React 19.3.0** | Hooks modern, `useMemo`, `useCallback`, `useRef` |
| **Desain & Styling** | **Tailwind CSS v4** | Modern fluid styling, Lucide React Icons |
| **Animasi & Interaktivitas** | **Framer Motion 14 & Canvas Confetti** | Animasi *countdown overlay* & selebrasi |
| **Excel Generator** | **xlsx-js-style** | Ekspor laporan berkas `.xlsx` dengan styling tabel formal |
| **Backend Framework** | **Express.js 4.21** | RESTful API server dengan modular routing |
| **Bahasa Pemrograman** | **TypeScript 5.7+** | Type-safe end-to-end tanpa error (`tsc --noEmit`) |
| **Database ORM** | **Prisma ORM 6.4.1** | Schema migration, client generator, query duration logging |
| **Basis Data Utama** | **PostgreSQL (Supabase Cloud)** | Port 6543 (PgBouncer Pooler) & Port 5432 (Session Direct) |
| **Otentikasi Ganda** | **Firebase Auth + Prisma Verify** | Otentikasi cloud Firebase SDK dan verifikasi akun lokal |
| **Komunikasi Real-time** | **Socket.io 4.8** | Sinkronisasi event giliran bicara ke seluruh layar klien |

---

## 👥 Daftar Akun Pengguna Bawaan (Seed)

Seluruh akun telah disematkan di dalam database PostgreSQL Supabase dan Firebase Auth dengan kata sandi default: **`password123`**.

### 1. Akun Guru (Pendidik)
| Nama Guru | Alamat Email | Peran |
| :--- | :--- | :--- |
| **Mutia Puspita Sari, S.Pd.** | `mutiapuspitasari@gmail.com` | `TEACHER` |
| **Dra. Sri Wahyuni, M.Pd.** | `sri.wahyuni@sekolah.sch.id` | `TEACHER` |
| **Guru Pendidik (Standar)** | `guru@gmail.com` | `TEACHER` |

### 2. Akun Siswa Kelas X.E3 (36 Siswa Resmi)
Format: `nama@gmail.com` (tanpa spasi / dengan titik) · Sandi: `password123`
- Absen #1: `abdularif@gmail.com` (Abdul Arif)
- Absen #2: `abelfanesyaoktari@gmail.com` (Abel Fanesya Oktari)
- Absen #3: `abelmeysaandala@gmail.com` (Abel Meysa Andala)
- ... hingga Absen #36: `yopifebrian@gmail.com` (Yopi Febrian)

### 3. Akun Siswa Kelas X.E5 (36 Siswa Resmi)
Format: `nama@gmail.com` (tanpa spasi / dengan titik) · Sandi: `password123`
- Absen #1: `adelyaalsasakhira@gmail.com` (Adelya Alsa Sakhira)
- Absen #2: `adikaarfani@gmail.com` (Adika Arfani)
- Absen #3: `aditiasaputrapratama@gmail.com` (Aditia Saputra Pratama)
- ... hingga Absen #36: `yusufarrafi@gmail.com` (Yusuf Ar Rafi)

---

## 🗄️ Skema Database (Prisma ORM & Supabase)

Relasi data dipetakan secara terstruktur di [`backend/prisma/schema.prisma`](file:///e:/Real%20Project/kartu-bicara-digital/backend/prisma/schema.prisma):

```mermaid
erDiagram
    User ||--o{ Student : "menghubungkan akun"
    ClassRoom ||--|{ Student : "memiliki siswa"
    ClassRoom ||--o{ Token : "memiliki riwayat"
    ClassRoom ||--o| ActiveSpeaker : "memiliki pembicara aktif"
    Student ||--o{ Token : "menggunakan kartu"

    User {
        string id PK
        string email UK
        string password
        string name
        enum role "TEACHER / STUDENT"
        int deskNumber
        string className
    }

    ClassRoom {
        string id PK
        string name
        string subject
        string topic
        int tokensPerStudent
        int speechTimeLimitSeconds
        string sessionPin
    }

    Student {
        string id PK
        string name
        int deskNumber
        int tokensQuota
        int remainingTokens
        int totalSpeakingTimeSeconds
        boolean hasSpoken
        boolean isCurrentlySpeaking
    }

    Token {
        string id PK
        enum type "BERTANYA / MENJAWAB / BERPENDAPAT / MENANGGAPI"
        string studentId FK
        string studentName
        int deskNumber
        int durationSeconds
        datetime usedAt
    }

    ActiveSpeaker {
        string id PK
        string classRoomId FK
        string studentId
        string studentName
        int deskNumber
        enum tokenType
        int allocatedSeconds
        int remainingSeconds
        boolean isPaused
        datetime startedAt
    }
```

---

## 🚀 Panduan Instalasi & Menjalankan Proyek

### Prasyarat
- **Node.js** v20.x atau lebih baru
- **npm** v10.x atau lebih baru

### 1. Kloning Repositori & Persiapan Dependensi
```bash
# Instalasi dependensi backend
npm --prefix backend install

# Instalasi dependensi frontend
npm --prefix frontend install
```

### 2. Konfigurasi Lingkungan (`.env`)
Pastikan berkas `backend/.env` telah terkonfigurasi dengan string koneksi Supabase:
```env
PORT=5000
DATABASE_URL="postgresql://postgres.koddzwcausfyydwunxqf:vkD%24k%2BKauzk3YJ_@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.koddzwcausfyydwunxqf:vkD%24k%2BKauzk3YJ_@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
PRISMA_LOG=true
```

Dan berkas `frontend/.env`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 3. Migrasi & Seeding Database (Opsional jika ingin reset data)
```bash
# Sinkronisasi schema ke database
npx --prefix backend prisma db push

# Menjalankan seeding akun resmi & kelas presensi
npx tsx backend/src/seedPrisma.ts
```

### 4. Menjalankan Server Pengembangan
Buka dua terminal terpisah:

**Terminal 1 (Backend API & WebSocket):**
```bash
npm --prefix backend run dev
# Server aktif di http://localhost:5000
```

**Terminal 2 (Frontend Next.js):**
```bash
npm --prefix frontend run dev
# Aplikasi aktif di http://localhost:3000
```

---

## 🌐 Daftar Endpoint REST API

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Status kesehatan server, uptime, & koneksi database |
| `POST` | `/api/auth/login` | Masuk akun pengguna (Email & Kata Sandi) |
| `POST` | `/api/auth/register` | Pendaftaran akun siswa baru |
| `GET` | `/api/auth/seed-users` | Menampilkan seluruh ringkasan akun seed resmi |
| `GET` | `/api/classes` | Mengambil seluruh daftar rombel ruang kelas |
| `GET` | `/api/classes/:id` | Mengambil detail kelas dan daftar siswa lengkap |
| `GET` | `/api/classes/pin/:pin` | Menemukan ruang kelas berdasarkan PIN Sesi 6-digit |
| `POST` | `/api/classes` | Membuat ruang kelas baru |
| `PUT` | `/api/classes/:id` | Memperbarui informasi sesi & kuota token dinamis |
| `DELETE` | `/api/classes/:id` | Menghapus ruang kelas beserta seluruh riwayatnya |
| `POST` | `/api/classes/:id/reset` | Mereset sesi diskusi kelas ke kondisi kuota awal |
| `POST` | `/api/classes/:id/students` | Menambahkan siswa baru ke dalam kelas |
| `DELETE` | `/api/classes/:id/students/:studentId` | Menghapus siswa dari kelas |
| `GET` | `/api/classes/:id/speaker` | Mengambil status pembicara aktif di kelas |
| `POST` | `/api/classes/:id/speaker/start` | Memulai giliran bicara siswa dengan token taksonomi |
| `POST` | `/api/classes/:id/speaker/pause` | Menjeda hitung mundur pembicara aktif |
| `POST` | `/api/classes/:id/speaker/resume` | Melanjutkan hitung mundur pembicara aktif |
| `POST` | `/api/classes/:id/speaker/extend` | Menambah waktu bicara (+15 detik atau kustom) |
| `POST` | `/api/classes/:id/speaker/finish` | Menyelesaikan giliran bicara & mencatat durasi riil |
| `GET` | `/api/classes/:id/stats` | Mengambil analitik taksonomi & keaktifan kelas |
| `GET` | `/api/classes/:id/export/excel` | Mengunduh berkas laporan rekap keaktifan (`.xlsx`) |

---

## 🧪 Pengujian Kualitas & UAT

Sistem dilengkapi suite pengujian otomatis menyeluruh untuk menjamin stabilitas produksi:

### 1. Pengecekan Tipe Data TypeScript (`tsc --noEmit`)
Menjamin 0 kesalahan kompilasi tipe data di seluruh workspace:
```bash
npm run typecheck
```
*Output: `Exit code: 0` (Backend & Frontend Type-check Clean).*

### 2. End-to-End User Acceptance Testing (UAT)
Menjalankan 32 pengujian simulasi interaksi mulai dari autentikasi, manajemen kelas, giliran bicara, hingga integritas query database:
```bash
npx tsx backend/src/runUAT.ts
```
*Hasil: **32 dari 32 tes LULUS (100% Pass Rate)**.*

---

## 📄 Lisensi & Hak Cipta
Dikembangkan untuk implementasi inovasi teknologi pendidikan digital model pembelajaran kooperatif Time Token Arends. Hak cipta dilindungi undang-undang.
