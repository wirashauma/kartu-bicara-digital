/**
 * TIME TOKEN DIGITAL (MODEL ARENDS)
 * Backend TypeScript Type Definitions
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
}

export const TOKEN_DEFINITIONS: Record<TokenType, TokenMeta> = {
  BERTANYA: {
    type: "BERTANYA",
    label: "Bertanya",
    emoji: "",
    description: "Mengajukan pertanyaan kritis yang relevan untuk memperdalam pemahaman diskusi.",
    colorHex: "#EC4899",
  },
  MENJAWAB: {
    type: "MENJAWAB",
    label: "Menjawab",
    emoji: "",
    description: "Memberikan jawaban, solusi, atau penjelasan atas pertanyaan yang diajukan teman atau guru.",
    colorHex: "#F59E0B",
  },
  BERPENDAPAT: {
    type: "BERPENDAPAT",
    label: "Berpendapat",
    emoji: "",
    description: "Menyampaikan sudut pandang baru, ide, atau gagasan dengan argumen logis yang kuat.",
    colorHex: "#06B6D4",
  },
  MENANGGAPI: {
    type: "MENANGGAPI",
    label: "Menanggapi",
    emoji: "",
    description: "Merespons, memperkuat, atau memberikan perspektif lain secara santun terhadap opini rekan.",
    colorHex: "#10B981",
  },
};

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar?: string;
  deskNumber?: number;
  email?: string;
  school?: string;
  subject?: string;
  className?: string;
}

export interface UserAccount extends User {
  password?: string;
  emailWithDot?: string;
  nisn?: string;
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
  hasSpoken: boolean;
  totalSpeakingTimeSeconds: number;
  lastSpokeAt?: string;
}

export type SessionStatus = "IDLE" | "ACTIVE" | "PAUSED" | "COMPLETED";

export interface ActiveSpeaker {
  studentId: string;
  studentName: string;
  deskNumber: number;
  tokenType: TokenType;
  startedAt: number;
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
  studentsIdleCount: number;
  participationRate: number;
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

