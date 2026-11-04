import { ClassRoom, Student, Token, TokenType } from "../types/session.js";

const INDONESIAN_STUDENT_NAMES = [
  "Ahmad Faiz Pratama",
  "Alya Nur Sabrina",
  "Ananda Rizky Ramadhan",
  "Bayu Wicaksono",
  "Bunga Cantika Putri",
  "Christian Daniel Wijaya",
  "Dafina Aulia Zahra",
  "Dimas Arya Saputra",
  "Fadhil Muhammad Ihsan",
  "Fanya Kirana Dewi",
  "Galang Rambu Anarki",
  "Gita Gutawa Wardani",
  "Hafizh Al-Farisi",
  "Indah Permatasari",
  "Jasmine Nurul Izzah",
  "Kevin Julio Pratama",
  "Larasati Dewi Anjani",
  "Muhammad Alfarizi",
  "Nadia Syakira Putri",
  "Rafi Ahmad Fauzan",
  "Rania Putri Azzahra",
  "Satria Bagus Pambudi",
  "Tiara Andini Lestari",
  "Zahra Amelia Santoso",
];

export function generateInitialStudents(count: number = 24, quota: number = 3): Student[] {
  const students: Student[] = [];

  for (let i = 0; i < count; i++) {
    const deskNumber = i + 1;
    const name = INDONESIAN_STUDENT_NAMES[i % INDONESIAN_STUDENT_NAMES.length];

    // Seed realistic distributed tokens for the first 12 active students
    let usedTokens: Token[] = [];
    let hasSpoken = false;
    let totalSpeakingTimeSeconds = 0;
    let remainingTokens = quota;

    if (i < 12) {
      hasSpoken = true;
      const types: TokenType[] =
        i % 3 === 0
          ? ["BERTANYA", "MENJAWAB"]
          : i % 2 === 0
          ? ["MENJAWAB"]
          : ["BERTANYA"];

      usedTokens = types.map((type, idx) => ({
        id: `seed-tok-${deskNumber}-${idx}`,
        type,
        studentId: `std-${deskNumber}`,
        studentName: name,
        deskNumber,
        usedAt: new Date(Date.now() - (12 - i) * 60000 + idx * 25000).toISOString(),
        durationSeconds: 45 + (i % 4) * 10,
      }));

      remainingTokens = Math.max(0, quota - usedTokens.length);
      totalSpeakingTimeSeconds = usedTokens.reduce((acc, t) => acc + t.durationSeconds, 0);
    }

    students.push({
      id: `std-${deskNumber}`,
      name,
      deskNumber,
      tokensQuota: quota,
      remainingTokens,
      usedTokens,
      isCurrentlySpeaking: false,
      hasSpoken,
      totalSpeakingTimeSeconds,
      lastSpokeAt: usedTokens.length > 0 ? usedTokens[usedTokens.length - 1].usedAt : undefined,
    });
  }

  return students;
}

export function generateInitialClassrooms(): ClassRoom[] {
  return [
    {
      id: "class-1",
      name: "Kelas XI MIPA 1",
      subject: "Sosiologi / Bahasa Indonesia",
      grade: "Kelas 11 SMA",
      sessionPin: "TT-7892",
      topic: "Dilema Etika AI & Masa Depan Pendidikan",
      tokensPerStudent: 3,
      speechTimeLimitSeconds: 60,
      students: generateInitialStudents(24, 3),
      academicYear: "2024/2025 Genap",
      createdAt: new Date().toISOString(),
    },
    {
      id: "class-2",
      name: "Kelas XI MIPA 2",
      subject: "Bahasa Indonesia",
      grade: "Kelas 11 SMA",
      sessionPin: "TT-7893",
      topic: "Teks Debat & Argumentasi Kritis",
      tokensPerStudent: 3,
      speechTimeLimitSeconds: 60,
      students: generateInitialStudents(24, 3),
      academicYear: "2024/2025 Genap",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "class-3",
      name: "Kelas X-E1",
      subject: "Pendidikan Pancasila & Kewarganegaraan",
      grade: "Kelas 10 SMA",
      sessionPin: "TT-6021",
      topic: "Gotong Royong dalam Keberagaman Budaya Bangsa",
      tokensPerStudent: 2,
      speechTimeLimitSeconds: 90,
      students: generateInitialStudents(20, 2),
      academicYear: "2024/2025 Genap",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ];
}

