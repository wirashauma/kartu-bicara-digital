import { ClassRoom, Student } from "../types/session.js";
import {
  STUDENTS_X_E3_NAMES,
  buildCleanStudents,
  generateSeedClassrooms,
} from "./seedData.js";

/**
 * Helper kompatibilitas untuk membuat student bersih
 */
export function generateInitialStudents(count: number = 36, quota: number = 3): Student[] {
  const names = STUDENTS_X_E3_NAMES.slice(0, count);
  return buildCleanStudents(names, "custom", quota);
}

/**
 * Menghasilkan kelas awal berupa Kelas X.E3 dan Kelas X.E5 yang bersih
 */
export function generateInitialClassrooms(): ClassRoom[] {
  return generateSeedClassrooms();
}
