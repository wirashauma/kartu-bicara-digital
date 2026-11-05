import { ClassRoom, ClassStats, SessionConfig, Student, TokenType } from "@/types/session";
import {
  STUDENTS_X_E3_NAMES,
  buildCleanStudents,
  generateSeedClassrooms,
} from "./seedData";

export const INITIAL_SESSION_CONFIG: SessionConfig = {
  sessionCode: "TT-1031",
  className: "Kelas X.E3",
  topic: "Diskusi Terbuka Model Arends",
  subject: "Bahasa Indonesia / Sosiologi",
  tokensPerStudent: 3,
  speechTimeLimitSeconds: 60,
  autoWarningThresholdSeconds: 10,
};

/**
 * Menghasilkan data siswa awal untuk Kelas X.E3 tanpa data dummy riwayat bicara
 */
export function generateInitialStudents(): Student[] {
  return buildCleanStudents(STUDENTS_X_E3_NAMES, "xe3", 3);
}

/**
 * Komputasi statistik partisipasi Time Token
 */
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

/**
 * Menghasilkan kelas Kelas X.E3 dan Kelas X.E5 yang bersih dari dummy data
 */
export function generateInitialClassrooms(): ClassRoom[] {
  return generateSeedClassrooms();
}
