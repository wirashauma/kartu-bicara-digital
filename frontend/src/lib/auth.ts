import { Role } from "@/types/session";

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
  id: "teacher-1",
  name: "Dra. Sri Wahyuni, M.Pd.",
  email: "sri.wahyuni@sekolah.sch.id",
  role: "TEACHER",
  school: "SMAN 1 Teladan",
  subject: "Sosiologi / Bahasa Indonesia",
};

export const DEMO_STUDENT: AuthUser = {
  id: "std-3",
  name: "Ananda Rizky Ramadhan",
  email: "ananda.rizky@siswa.sch.id",
  role: "STUDENT",
  school: "SMAN 1 Teladan",
  className: "Kelas XI MIPA 1",
  deskNumber: 3,
  nisn: "0068192341",
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
  } catch (e) {
    console.error("Failed to save auth user:", e);
  }
}

export function clearStoredUser(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (e) {
    console.error("Failed to remove auth user:", e);
  }
}

