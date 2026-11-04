/**
 * TIME TOKEN DIGITAL (MODEL ARENDS)
 * TypeScript Type Definitions
 */

export type Role = "TEACHER" | "STUDENT";

export type TokenType =
  | "BERTANYA"
  | "MENJAWAB"
  | "BERPENDAPAT"
  | "MENANGGAPI";

export interface TokenMeta {
  type: TokenType;
  label: string;
  emoji: string;
  description: string;
  colorHex: string;
  lightBgClass: string;
  solidBgClass: string;
  borderClass: string;
  textClass: string;
  badgeClass: string;
  ringClass: string;
  iconName: "HelpCircle" | "Lightbulb" | "MessageSquare" | "Repeat2";
}

export const TOKEN_DEFINITIONS: Record<TokenType, TokenMeta> = {
  BERTANYA: {
    type: "BERTANYA",
    label: "Bertanya",
    emoji: "",
    description: "Mengajukan pertanyaan kritis yang relevan untuk memperdalam pemahaman diskusi.",
    colorHex: "#EC4899",
    lightBgClass: "bg-pink-50",
    solidBgClass: "bg-pink-500",
    borderClass: "border-pink-200",
    textClass: "text-pink-600",
    badgeClass: "bg-pink-50 text-pink-700 border-pink-200",
    ringClass: "ring-pink-400 focus:ring-pink-500",
    iconName: "HelpCircle",
  },
  MENJAWAB: {
    type: "MENJAWAB",
    label: "Menjawab",
    emoji: "",
    description: "Memberikan jawaban, solusi, atau penjelasan atas pertanyaan yang diajukan teman atau guru.",
    colorHex: "#F59E0B",
    lightBgClass: "bg-amber-50",
    solidBgClass: "bg-amber-500",
    borderClass: "border-amber-200",
    textClass: "text-amber-600",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    ringClass: "ring-amber-400 focus:ring-amber-500",
    iconName: "Lightbulb",
  },
  BERPENDAPAT: {
    type: "BERPENDAPAT",
    label: "Berpendapat",
    emoji: "",
    description: "Menyampaikan sudut pandang baru, ide, atau gagasan dengan argumen logis yang kuat.",
    colorHex: "#06B6D4",
    lightBgClass: "bg-cyan-50",
    solidBgClass: "bg-cyan-500",
    borderClass: "border-cyan-200",
    textClass: "text-cyan-600",
    badgeClass: "bg-cyan-50 text-cyan-700 border-cyan-200",
    ringClass: "ring-cyan-400 focus:ring-cyan-500",
    iconName: "MessageSquare",
  },
  MENANGGAPI: {
    type: "MENANGGAPI",
    label: "Menanggapi",
    emoji: "",
    description: "Merespons, memperkuat, atau memberikan perspektif lain secara santun terhadap opini rekan.",
    colorHex: "#10B981",
    lightBgClass: "bg-emerald-50",
    solidBgClass: "bg-emerald-500",
    borderClass: "border-emerald-200",
    textClass: "text-emerald-600",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    ringClass: "ring-emerald-400 focus:ring-emerald-500",
    iconName: "Repeat2",
  },
};

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar?: string;
  deskNumber?: number;
}

export interface Token {
  id: string;
  type: TokenType;
  studentId: string;
  studentName: string;
  deskNumber?: number;
  usedAt: string; // ISO 8601 string
  durationSeconds: number;
  notes?: string;
}

export interface Student {
  id: string;
  name: string;
  deskNumber: number;
  avatarUrl?: string;
  tokensQuota: number;
  remainingTokens: number;
  usedTokens: Token[];
  isCurrentlySpeaking: boolean;
  hasSpoken: boolean; // false = Idle / Zero-Contribution Flag
  totalSpeakingTimeSeconds: number;
  lastSpokeAt?: string;
}

export type SessionStatus = "IDLE" | "ACTIVE" | "PAUSED" | "COMPLETED";

export interface ActiveSpeaker {
  studentId: string;
  studentName: string;
  deskNumber: number;
  tokenType: TokenType;
  startedAt: number; // epoch ms
  allocatedSeconds: number;
  remainingSeconds: number;
  isPaused: boolean;
}

export interface ClassStats {
  totalStudents: number;
  totalTokensAllocated: number;
  totalTokensUsed: number;
  totalTokensRemaining: number;
  studentsSpokenCount: number;
  studentsIdleCount: number; // Siswa dengan 0 kontribusi
  participationRate: number; // Persentase partisipasi (0 - 100)
  distributionByType: Record<TokenType, number>;
}

export interface SessionConfig {
  sessionCode: string;
  className: string;
  topic: string;
  subject: string;
  tokensPerStudent: number;
  speechTimeLimitSeconds: number;
  autoWarningThresholdSeconds: number;
}

export interface ClassRoom {
  id: string;
  name: string;
  subject: string;
  grade?: string;
  sessionPin: string;
  topic?: string;
  tokensPerStudent: number;
  speechTimeLimitSeconds: number;
  students: Student[];
  academicYear?: string;
  createdAt: string;
}

export interface SessionState {
  config: SessionConfig;
  status: SessionStatus;
  students: Student[];
  activeSpeaker: ActiveSpeaker | null;
  stats: ClassStats;
  history: Token[];
}

// ==========================================
// REAL-TIME SOCKET.IO EVENT CONTRACTS
// ==========================================

export interface ClientToServerEvents {
  "session:join": (payload: { sessionCode: string; user: User }) => void;
  "session:leave": (payload: { sessionCode: string; userId: string }) => void;
  "token:claim_request": (payload: {
    studentId: string;
    tokenType: TokenType;
    requestedSeconds: number;
  }) => void;
  "speaker:start": (payload: {
    studentId: string;
    tokenType: TokenType;
    allocatedSeconds: number;
  }) => void;
  "speaker:pause": (payload: { studentId: string }) => void;
  "speaker:resume": (payload: { studentId: string }) => void;
  "speaker:extend_time": (payload: { studentId: string; additionalSeconds: number }) => void;
  "speaker:finish": (payload: { studentId: string; actualDurationSeconds: number }) => void;
  "session:reset": (payload: { sessionCode: string }) => void;
}

export interface ServerToClientEvents {
  "session:sync": (state: SessionState) => void;
  "session:status_changed": (status: SessionStatus) => void;
  "speaker:updated": (activeSpeaker: ActiveSpeaker | null) => void;
  "timer:tick": (payload: { remainingSeconds: number; studentId: string }) => void;
  "token:claimed": (payload: { student: Student; token: Token }) => void;
  "notification:broadcast": (payload: {
    message: string;
    type: "info" | "warning" | "success" | "alert";
  }) => void;
  "error:occurred": (payload: { code: string; message: string }) => void;
}

