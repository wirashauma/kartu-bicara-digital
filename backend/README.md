# Backend - Time Token Digital (Model Arends)

Modul server real-time untuk aplikasi **Time Token Digital (Model Pembelajaran Kooperatif Arends)**.

## Peran & Tanggung Jawab Backend
1. **Room & Session Management**: Mengatur sesi kelas, kode PIN unik, dan verifikasi peran (Guru / Siswa).
2. **Synchronized Timer Engine**: Sumber kebenaran tunggal (*single source of truth*) untuk hitung mundur durasi bicara siswa.
3. **Socket.io Real-time Broadcast**: Mengalirkan pembaruan status ke proyektor guru dan seluruh perangkat murid secara instan tanpa jeda.
4. **Data Persistence & Audit Log**: Mencatat riwayat taksonomi token (Bertanya, Menjawab, Berpendapat, Menanggapi) serta durasi bicara untuk penilaian partisipasi kelas.

## Kontrak Event Socket.io (Sesuai `frontend/src/types/session.ts`)
- `session:join` / `session:leave`
- `token:claim_request` / `token:claimed`
- `speaker:start` / `speaker:pause` / `speaker:resume` / `speaker:extend_time` / `speaker:finish`
- `timer:tick` (disinkronkan per detik)
- `session:sync` / `session:status_changed`

