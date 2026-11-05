import { Role } from "@/types/session";
import {
  STUDENTS_X_E3_NAMES,
  STUDENTS_X_E5_NAMES,
  generateEmailFromName,
  generateEmailWithDotFromName,
  normalizeEmailQuery,
  DEFAULT_SEED_PASSWORD,
} from "./seedData";
import { loginWithFirebase } from "./firebaseAuth";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  school?: string;
  subject?: string;
  className?: string;
  deskNumber?: number;
  nisn?: string;
  avatar?: string;
}

export const DEMO_TEACHER: AuthUser = {
  id: "tch-1",
  name: "Dra. Sri Wahyuni, M.Pd.",
  email: "sri.wahyuni@sekolah.sch.id",
  role: "TEACHER",
  school: "SMAN 1 Teladan",
  subject: "Sosiologi / Bahasa Indonesia",
};

export const DEMO_STUDENT: AuthUser = {
  id: "std-xe3-1",
  name: "Abdul Arif",
  email: "abdularif@gmail.com",
  role: "STUDENT",
  school: "SMAN 1 Teladan",
  className: "Kelas X.E3",
  deskNumber: 1,
};

const AUTH_STORAGE_KEY = "time_token_auth_user";

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("Failed to parse stored auth user:", e);
    return null;
  }
}

export function setStoredUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    document.cookie = "kbd_auth_logged_in=1; path=/; max-age=2592000; SameSite=Lax";
  } catch (e) {
    console.error("Failed to save auth user:", e);
  }
}

export function clearStoredUser(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    document.cookie = "kbd_auth_logged_in=; path=/; max-age=0; SameSite=Lax";
  } catch (e) {
    console.error("Failed to remove auth user:", e);
  }
}

/**
 * Daftar Akun Seed Lengkap untuk Frontend
 */
export function getAllSeedUsers(): AuthUser[] {
  const list: AuthUser[] = [
    DEMO_TEACHER,
    {
      id: "tch-2",
      name: "Guru Pendidik",
      email: "guru@gmail.com",
      role: "TEACHER",
      school: "SMAN 1 Teladan",
      subject: "Bahasa Indonesia",
    },
  ];

  // Siswa Kelas X.E3
  STUDENTS_X_E3_NAMES.forEach((name, idx) => {
    const deskNumber = idx + 1;
    list.push({
      id: `std-xe3-${deskNumber}`,
      name,
      email: generateEmailFromName(name),
      role: "STUDENT",
      className: "Kelas X.E3",
      deskNumber,
      school: "SMAN 1 Teladan",
    });
  });

  // Siswa Kelas X.E5
  STUDENTS_X_E5_NAMES.forEach((name, idx) => {
    const deskNumber = idx + 1;
    list.push({
      id: `std-xe5-${deskNumber}`,
      name,
      email: generateEmailFromName(name),
      role: "STUDENT",
      className: "Kelas X.E5",
      deskNumber,
      school: "SMAN 1 Teladan",
    });
  });

  return list;
}

/**
 * Fungsi otentikasi komprehensif: memanggil Firebase Authentication & Firestore SDK,
 * dengan sinkronisasi ke backend dan fallback seed offline.
 */
export async function authenticateCredentials(
  emailOrName: string,
  passwordAttempt: string,
  targetRole: Role
): Promise<{ success: boolean; user?: AuthUser; message?: string }> {
  const trimmed = emailOrName.trim();
  if (!trimmed || !passwordAttempt) {
    return { success: false, message: "Email dan kata sandi wajib diisi." };
  }

  // 1. Jalankan otentikasi langsung via Firebase SDK
  try {
    const fbRes = await loginWithFirebase(trimmed, passwordAttempt, targetRole);
    if (fbRes.success && fbRes.user) {
      return { success: true, user: fbRes.user };
    }
    if (fbRes.message && !fbRes.message.includes("Jaringan bermasalah")) {
      return { success: false, message: fbRes.message };
    }
  } catch (fbErr) {
    console.warn("Firebase Auth attempt notice:", fbErr);
  }

  // 2. Coba sinkronisasi via Backend API Express jika diperlukan
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: trimmed,
        password: passwordAttempt,
        role: targetRole,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.user) {
        setStoredUser(data.user);
        return { success: true, user: data.user };
      }
    }
  } catch {
    // Backend offline fallback
  }

  // 3. Fallback pencocokan seed offline
  const allUsers = getAllSeedUsers();
  const normalizedQuery = normalizeEmailQuery(trimmed);

  const matchedUser = allUsers.find((u) => {
    const matchRole = u.role === targetRole;
    if (!matchRole) return false;

    if (u.email.toLowerCase() === trimmed.toLowerCase()) return true;
    if (u.name.toLowerCase() === trimmed.toLowerCase()) return true;
    if (normalizeEmailQuery(u.email) === normalizedQuery) return true;
    const emailDot = generateEmailWithDotFromName(u.name);
    if (emailDot.toLowerCase() === trimmed.toLowerCase()) return true;

    return false;
  });

  if (!matchedUser) {
    return {
      success: false,
      message: `Akun ${targetRole === "STUDENT" ? "siswa" : "guru"} dengan identitas tersebut tidak ditemukan.`,
    };
  }

  if (passwordAttempt !== DEFAULT_SEED_PASSWORD) {
    return {
      success: false,
      message: "Kata sandi salah. Gunakan password yang ditentukan: password123",
    };
  }

  setStoredUser(matchedUser);
  return { success: true, user: matchedUser };
}
