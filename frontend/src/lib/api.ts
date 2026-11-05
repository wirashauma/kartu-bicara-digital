import {
  ClassRoom,
  Student,
  ActiveSpeaker,
  TokenType,
  Token,
  ClassStats,
} from "@/types/session";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        message: json?.message || `HTTP ${res.status} Error`,
      };
    }

    return {
      success: true,
      data: json?.data !== undefined ? json.data : json,
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message || "Jaringan tidak terhubung.",
    };
  }
}

// ==========================================
// 1. CLASSROOM MANAGEMENT APIS
// ==========================================

export async function fetchClassesApi(): Promise<ClassRoom[] | null> {
  const res = await request<ClassRoom[]>("/classes");
  if (res.success && Array.isArray(res.data)) {
    return res.data;
  }
  return null;
}

export async function fetchClassByIdApi(classId: string): Promise<ClassRoom | null> {
  const res = await request<ClassRoom>(`/classes/${classId}`);
  return res.success && res.data ? res.data : null;
}

export async function createClassApi(data: {
  name: string;
  subject: string;
  topic?: string;
  grade?: string;
  tokensPerStudent?: number;
  speechTimeLimitSeconds?: number;
}): Promise<ClassRoom | null> {
  const res = await request<ClassRoom>("/classes", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.success && res.data ? res.data : null;
}

export async function updateClassApi(
  classId: string,
  data: Partial<{
    name: string;
    subject: string;
    topic: string;
    grade: string;
    tokensPerStudent: number;
    speechTimeLimitSeconds: number;
  }>
): Promise<ClassRoom | null> {
  const res = await request<ClassRoom>(`/classes/${classId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.success && res.data ? res.data : null;
}

export async function deleteClassApi(classId: string): Promise<boolean> {
  const res = await request(`/classes/${classId}`, {
    method: "DELETE",
  });
  return Boolean(res.success);
}

export async function resetClassSessionApi(classId: string): Promise<ClassRoom | null> {
  const res = await request<ClassRoom>(`/classes/${classId}/reset`, {
    method: "POST",
  });
  return res.success && res.data ? res.data : null;
}

// ==========================================
// 2. STUDENT MANAGEMENT APIS
// ==========================================

export async function addStudentApi(
  classId: string,
  studentData: { name: string; deskNumber: number; tokensQuota?: number }
): Promise<Student | null> {
  const res = await request<Student>(`/classes/${classId}/students`, {
    method: "POST",
    body: JSON.stringify(studentData),
  });
  return res.success && res.data ? res.data : null;
}

export async function deleteStudentApi(
  classId: string,
  studentId: string
): Promise<boolean> {
  const res = await request(`/classes/${classId}/students/${studentId}`, {
    method: "DELETE",
  });
  return Boolean(res.success);
}

// ==========================================
// 3. SPEAKER & DISCUSSION APIS
// ==========================================

export async function getActiveSpeakerApi(classId: string): Promise<ActiveSpeaker | null> {
  const res = await request<ActiveSpeaker>(`/classes/${classId}/speaker`);
  return res.success ? (res.data ?? null) : null;
}

export async function startSpeakerApi(
  classId: string,
  data: { studentId: string; tokenType: TokenType; allocatedSeconds?: number }
): Promise<ActiveSpeaker | null> {
  const res = await request<ActiveSpeaker>(`/classes/${classId}/speaker/start`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.success && res.data ? res.data : null;
}

export async function pauseSpeakerApi(classId: string): Promise<ActiveSpeaker | null> {
  const res = await request<ActiveSpeaker>(`/classes/${classId}/speaker/pause`, {
    method: "POST",
  });
  return res.success && res.data ? res.data : null;
}

export async function resumeSpeakerApi(classId: string): Promise<ActiveSpeaker | null> {
  const res = await request<ActiveSpeaker>(`/classes/${classId}/speaker/resume`, {
    method: "POST",
  });
  return res.success && res.data ? res.data : null;
}

export async function extendSpeakerApi(
  classId: string,
  extraSeconds: number
): Promise<ActiveSpeaker | null> {
  const res = await request<ActiveSpeaker>(`/classes/${classId}/speaker/extend`, {
    method: "POST",
    body: JSON.stringify({ extraSeconds }),
  });
  return res.success && res.data ? res.data : null;
}

export async function finishSpeakerApi(
  classId: string,
  durationSeconds?: number
): Promise<{ student: Student; token: Token } | null> {
  const res = await request<{ student: Student; token: Token }>(
    `/classes/${classId}/speaker/finish`,
    {
      method: "POST",
      body: JSON.stringify({ durationSeconds }),
    }
  );
  return res.success && res.data ? res.data : null;
}

export async function fetchClassStatsApi(classId: string): Promise<ClassStats | null> {
  const res = await request<ClassStats>(`/classes/${classId}/stats`);
  return res.success && res.data ? res.data : null;
}

