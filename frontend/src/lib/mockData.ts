import { ClassRoom, ClassStats, SessionConfig, Student, TokenType } from "@/types/session";

// 36 Nama Siswa Khas Indonesia untuk Simulasi Kelas Nyata Model Arends
const STUDENT_NAMES: string[] = [
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
  "Jonathan Kevin Tan",
  "Kania Dewi Anggraini",
  "Luthfi Pratama Hakim",
  "M. Zaidan Al-Ghazali",
  "Nadia Syakira Putri",
  "Naufal Abiyyu Karim",
  "Nurul Azizah Rahma",
  "Pandu Satria Perkasa",
  "Qonita Zahrotul Wardah",
  "Rafi Raditya Wardhana",
  "Raisa Amanda Bella",
  "Reza Aditya Pratama",
  "Salma Nadhifah Kusuma",
  "Siti Sarah Nurhaliza",
  "Syahrul Gunawan",
  "Talitha Zahra Amalia",
  "Tegar Bagus Pambudi",
  "Umar bin Khattab",
  "Vania Clarissa Chandra",
  "Wahyu Aji Pangestu",
  "Zahra Amelia Putri",
];

export const INITIAL_SESSION_CONFIG: SessionConfig = {
  sessionCode: "TT-7892",
  className: "Kelas XI MIPA 1",
  topic: "Dilema Etika AI & Masa Depan Pendidikan",
  subject: "Sosiologi / Bahasa Indonesia",
  tokensPerStudent: 3,
  speechTimeLimitSeconds: 60,
  autoWarningThresholdSeconds: 10,
};

// Generate realistic initial student data (some idle, some active)
export function generateInitialStudents(): Student[] {
  const tokenTaxonomies: TokenType[] = [
    "BERTANYA",
    "MENJAWAB",
    "BERPENDAPAT",
    "MENANGGAPI",
  ];

  return STUDENT_NAMES.map((name, index) => {
    const deskNumber = index + 1;
    const tokensQuota = 3;

    // Skenario simulasi:
    // Sebagian siswa sudah pernah bicara, sebagian masih Idle (0 token)
    let usedCount = 0;
    if (deskNumber % 4 === 1) usedCount = 2; // 2 token terpakai
    else if (deskNumber % 4 === 2) usedCount = 1; // 1 token terpakai
    else if (deskNumber % 4 === 3) usedCount = 0; // IDLE FLAG!
    else usedCount = 0; // IDLE FLAG!

    const baseTime = 1730700000000; // Fixed timestamp for static prerender safety
    const usedTokens = Array.from({ length: usedCount }).map((_, i) => {
      const type = tokenTaxonomies[(index + i) % tokenTaxonomies.length];
      return {
        id: `tok-${deskNumber}-${i + 1}`,
        type,
        studentId: `std-${deskNumber}`,
        studentName: name,
        deskNumber,
        usedAt: new Date(baseTime - (36 - index) * 60000).toISOString(),
        durationSeconds: 45 + (i * 10),
      };
    });

    const hasSpoken = usedTokens.length > 0;
    const remainingTokens = tokensQuota - usedTokens.length;
    const totalSpeakingTimeSeconds = usedTokens.reduce(
      (acc, t) => acc + t.durationSeconds,
      0
    );

    return {
      id: `std-${deskNumber}`,
      name,
      deskNumber,
      tokensQuota,
      remainingTokens,
      usedTokens,
      isCurrentlySpeaking: false,
      hasSpoken,
      totalSpeakingTimeSeconds,
      lastSpokeAt: usedTokens.length > 0 ? usedTokens[usedTokens.length - 1].usedAt : undefined,
    };
  });
}

export function computeClassStats(
  students: Student[],
  tokensPerStudent: number
): ClassStats {
  const totalStudents = students.length;
  const totalTokensAllocated = totalStudents * tokensPerStudent;

  let totalTokensUsed = 0;
  let studentsSpokenCount = 0;
  let studentsIdleCount = 0;

  const distributionByType: Record<TokenType, number> = {
    BERTANYA: 0,
    MENJAWAB: 0,
    BERPENDAPAT: 0,
    MENANGGAPI: 0,
  };

  students.forEach((s) => {
    totalTokensUsed += s.usedTokens.length;
    if (s.hasSpoken && s.usedTokens.length > 0) {
      studentsSpokenCount++;
    } else {
      studentsIdleCount++;
    }

    s.usedTokens.forEach((t) => {
      distributionByType[t.type] = (distributionByType[t.type] || 0) + 1;
    });
  });

  const totalTokensRemaining = Math.max(0, totalTokensAllocated - totalTokensUsed);
  const participationRate =
    totalStudents > 0 ? Math.round((studentsSpokenCount / totalStudents) * 100) : 0;

  return {
    totalStudents,
    totalTokensAllocated,
    totalTokensUsed,
    totalTokensRemaining,
    studentsSpokenCount,
    studentsIdleCount,
    participationRate,
    distributionByType,
  };
}

export function generateInitialClassrooms(): ClassRoom[] {
  const baseStudents = generateInitialStudents();

  return [
    {
      id: "class-1",
      name: "Kelas XI MIPA 1",
      subject: "Sosiologi / Bahasa Indonesia",
      grade: "Kelas XI",
      sessionPin: "TT-7892",
      topic: "Dilema Etika AI & Masa Depan Pendidikan",
      tokensPerStudent: 3,
      speechTimeLimitSeconds: 60,
      students: baseStudents,
      academicYear: "2024/2025",
      createdAt: "2026-11-01T08:00:00.000Z",
    },
    {
      id: "class-2",
      name: "Kelas XI MIPA 2",
      subject: "Bahasa Indonesia",
      grade: "Kelas XI",
      sessionPin: "TT-7893",
      topic: "Teks Debat & Argumentasi Kritis",
      tokensPerStudent: 3,
      speechTimeLimitSeconds: 60,
      students: baseStudents.slice(0, 24).map((s, idx) => ({
        ...s,
        id: `std-c2-${idx + 1}`,
        deskNumber: idx + 1,
      })),
      academicYear: "2024/2025",
      createdAt: "2026-11-02T08:00:00.000Z",
    },
    {
      id: "class-3",
      name: "Kelas X IPS 1",
      subject: "Sosiologi",
      grade: "Kelas X",
      sessionPin: "TT-5120",
      topic: "Interaksi Sosial & Dinamika Kelompok",
      tokensPerStudent: 3,
      speechTimeLimitSeconds: 60,
      students: baseStudents.slice(0, 30).map((s, idx) => ({
        ...s,
        id: `std-c3-${idx + 1}`,
        deskNumber: idx + 1,
      })),
      academicYear: "2024/2025",
      createdAt: "2026-11-03T08:00:00.000Z",
    },
  ];
}

