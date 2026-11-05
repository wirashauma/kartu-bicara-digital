# Backend - Time Token Digital (Model Arends)

Modul server REST API & Real-time WebSocket untuk aplikasi **Time Token Digital (Model Pembelajaran Kooperatif Arends)** menggunakan Express.js, TypeScript, dan Socket.io.

## Akun Seed & Data Kelas Nyata

Seluruh data dummy acak telah dihapus dan digantikan oleh akun seed resmi dari daftar presensi:
- **Kelas X.E3** (36 Siswa)
- **Kelas X.E5** (36 Siswa)
- **Kata Sandi Standar untuk Seluruh Akun**: `password123`
- **Format Email**: `nama@gmail.com` (tanpa spasi / dengan titik)

### 1. Akun Guru (Pendidik)
- **Email Guru Utama**: `sri.wahyuni@sekolah.sch.id` | Sandi: `password123`
- **Email Guru Standar**: `guru@gmail.com` | Sandi: `password123`

### 2. Akun Siswa Kelas X.E3 (36 Siswa)
- **Siswa 1**: `abdularif@gmail.com` (Abdul Arif) | Meja #1
- **Siswa 2**: `abelfanesyaoktari@gmail.com` (Abel Fanesya Oktari) | Meja #2
- ... hingga Siswa 36: `yopifebrian@gmail.com` (Yopi Febrian) | Meja #36
- Sandi: `password123`

### 3. Akun Siswa Kelas X.E5 (36 Siswa)
- **Siswa 1**: `adelyaalsasakhira@gmail.com` (Adelya Alsa Sakhira) | Meja #1
- **Siswa 2**: `adikaarfani@gmail.com` (Adika Arfani) | Meja #2
- ... hingga Siswa 36: `yusufarrafi@gmail.com` (Yusuf Ar Rafi) | Meja #36
- Sandi: `password123`

## Menjalankan Server
```bash
# Menjalankan dalam mode pengembangan
npm run dev

# Membangun kode TypeScript
npm run build

# Menjalankan server hasil build
npm start
```

## Daftar Endpoint REST API
- `POST /api/auth/login` - Masuk dengan email & sandi (siswa/guru)
- `POST /api/auth/register` - Pendaftaran akun baru
- `GET /api/auth/seed-users` - Ringkasan seluruh 74 akun seed
- `GET /api/classes` - Daftar seluruh kelas (Kelas X.E3 & Kelas X.E5)
- `GET /api/classes/:id` - Detail kelas beserta 36 siswanya
- `GET /api/classes/:id/stats` - Statistik keaktifan diskusi
- `GET /api/classes/:id/export/excel` - Unduh laporan diskusi (.xlsx)


