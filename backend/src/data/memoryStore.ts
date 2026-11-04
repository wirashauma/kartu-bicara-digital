import {
  ClassRoom,
  Student,
  Token,
  TokenType,
  ActiveSpeaker,
  ClassStats,
  User,
} from "../types/session.js";
import { generateInitialClassrooms, generateInitialStudents } from "./initialData.js";

class MemoryStore {
  private classrooms: ClassRoom[] = [];
  private activeSpeakers: Map<string, ActiveSpeaker> = new Map();
  private educatorProfile: User = {
    id: "tch-1",
    name: "Dra. Sri Wahyuni, M.Pd.",
    email: "sri.wahyuni@sekolah.sch.id",
    school: "SMAN 1 Teladan",
    subject: "Sosiologi / Bahasa Indonesia",
    role: "TEACHER",
    avatar: "DS",
  };

  constructor() {
    this.classrooms = generateInitialClassrooms();
  }

  // 1. CLASSROOM MANAGEMENT
  public getAllClassrooms(): ClassRoom[] {
    return this.classrooms;
  }

  public getClassroomById(id: string): ClassRoom | null {
    return this.classrooms.find((c) => c.id === id) || null;
  }

  public getClassroomByPin(pin: string): ClassRoom | null {
    return (
      this.classrooms.find(
        (c) => c.sessionPin.toLowerCase() === pin.toLowerCase()
      ) || null
    );
  }

  public createClassroom(data: {
    name: string;
    subject: string;
    topic?: string;
    grade?: string;
    tokensPerStudent?: number;
    speechTimeLimitSeconds?: number;
  }): ClassRoom {
    const randomPinNum = Math.floor(1000 + Math.random() * 9000);
    const sessionPin = `TT-${randomPinNum}`;

    const newClass: ClassRoom = {
      id: `class-${Date.now()}`,
      name: data.name,
      subject: data.subject,
      topic: data.topic || "Diskusi Terbuka Model Arends",
      grade: data.grade || "Kelas 11 SMA",
      sessionPin,
      tokensPerStudent: data.tokensPerStudent || 3,
      speechTimeLimitSeconds: data.speechTimeLimitSeconds || 60,
      students: generateInitialStudents(24, data.tokensPerStudent || 3),
      academicYear: "2024/2025 Genap",
      createdAt: new Date().toISOString(),
    };

    this.classrooms.unshift(newClass);
    return newClass;
  }

  public updateClassroom(
    id: string,
    data: Partial<{
      name: string;
      subject: string;
      topic: string;
      grade: string;
      tokensPerStudent: number;
      speechTimeLimitSeconds: number;
    }>
  ): ClassRoom | null {
    const classroom = this.getClassroomById(id);
    if (!classroom) return null;

    if (data.name !== undefined) classroom.name = data.name;
    if (data.subject !== undefined) classroom.subject = data.subject;
    if (data.topic !== undefined) classroom.topic = data.topic;
    if (data.grade !== undefined) classroom.grade = data.grade;
    if (data.tokensPerStudent !== undefined)
      classroom.tokensPerStudent = data.tokensPerStudent;
    if (data.speechTimeLimitSeconds !== undefined)
      classroom.speechTimeLimitSeconds = data.speechTimeLimitSeconds;

    return classroom;
  }

  public deleteClassroom(id: string): boolean {
    const index = this.classrooms.findIndex((c) => c.id === id);
    if (index === -1) return false;

    this.classrooms.splice(index, 1);
    this.activeSpeakers.delete(id);
    return true;
  }

  public resetClassroomSession(id: string): ClassRoom | null {
    const classroom = this.getClassroomById(id);
    if (!classroom) return null;

    // Reset all students' tokens and quota
    classroom.students = classroom.students.map((s) => ({
      ...s,
      remainingTokens: classroom.tokensPerStudent,
      tokensQuota: classroom.tokensPerStudent,
      usedTokens: [],
      isCurrentlySpeaking: false,
      hasSpoken: false,
      totalSpeakingTimeSeconds: 0,
      lastSpokeAt: undefined,
    }));

    this.activeSpeakers.delete(id);
    return classroom;
  }

  // 2. STUDENT MANAGEMENT
  public addStudent(
    classId: string,
    studentData: { name: string; deskNumber: number; tokensQuota?: number }
  ): Student | null {
    const classroom = this.getClassroomById(classId);
    if (!classroom) return null;

    const quota = studentData.tokensQuota || classroom.tokensPerStudent;
    const newStudent: Student = {
      id: `std-${Date.now()}-${studentData.deskNumber}`,
      name: studentData.name,
      deskNumber: studentData.deskNumber,
      tokensQuota: quota,
      remainingTokens: quota,
      usedTokens: [],
      isCurrentlySpeaking: false,
      hasSpoken: false,
      totalSpeakingTimeSeconds: 0,
    };

    classroom.students.push(newStudent);
    classroom.students.sort((a, b) => a.deskNumber - b.deskNumber);
    return newStudent;
  }

  public deleteStudent(classId: string, studentId: string): boolean {
    const classroom = this.getClassroomById(classId);
    if (!classroom) return false;

    const index = classroom.students.findIndex((s) => s.id === studentId);
    if (index === -1) return false;

    classroom.students.splice(index, 1);
    return true;
  }

  // 3. SPEAKER & DISCUSSION ENGINE
  public getActiveSpeaker(classId: string): ActiveSpeaker | null {
    return this.activeSpeakers.get(classId) || null;
  }

  public startSpeaker(
    classId: string,
    data: {
      studentId: string;
      tokenType: TokenType;
      allocatedSeconds?: number;
    }
  ): ActiveSpeaker | null {
    const classroom = this.getClassroomById(classId);
    if (!classroom) return null;

    const student = classroom.students.find((s) => s.id === data.studentId);
    if (!student || student.remainingTokens <= 0) return null;

    const allocated = data.allocatedSeconds || classroom.speechTimeLimitSeconds;

    const speaker: ActiveSpeaker = {
      studentId: student.id,
      studentName: student.name,
      deskNumber: student.deskNumber,
      tokenType: data.tokenType,
      startedAt: Date.now(),
      allocatedSeconds: allocated,
      remainingSeconds: allocated,
      isPaused: false,
    };

    // Update student state
    student.isCurrentlySpeaking = true;
    this.activeSpeakers.set(classId, speaker);
    return speaker;
  }

  public pauseSpeaker(classId: string): ActiveSpeaker | null {
    const speaker = this.activeSpeakers.get(classId);
    if (!speaker) return null;
    speaker.isPaused = true;
    return speaker;
  }

  public resumeSpeaker(classId: string): ActiveSpeaker | null {
    const speaker = this.activeSpeakers.get(classId);
    if (!speaker) return null;
    speaker.isPaused = false;
    return speaker;
  }

  public extendSpeaker(classId: string, extraSeconds: number): ActiveSpeaker | null {
    const speaker = this.activeSpeakers.get(classId);
    if (!speaker) return null;
    speaker.allocatedSeconds += extraSeconds;
    speaker.remainingSeconds += extraSeconds;
    speaker.isPaused = false;
    return speaker;
  }

  public tickSpeakerTimer(classId: string): {
    speaker: ActiveSpeaker | null;
    isFinished: boolean;
  } {
    const speaker = this.activeSpeakers.get(classId);
    if (!speaker || speaker.isPaused) {
      return { speaker: speaker || null, isFinished: false };
    }

    if (speaker.remainingSeconds > 0) {
      speaker.remainingSeconds -= 1;
    }

    return { speaker, isFinished: speaker.remainingSeconds === 0 };
  }

  public finishSpeaker(classId: string): {
    student: Student | null;
    token: Token | null;
  } {
    const speaker = this.activeSpeakers.get(classId);
    if (!speaker) return { student: null, token: null };

    const classroom = this.getClassroomById(classId);
    if (!classroom) return { student: null, token: null };

    const student = classroom.students.find((s) => s.id === speaker.studentId);
    if (!student) return { student: null, token: null };

    const usedDuration = Math.max(
      5,
      speaker.allocatedSeconds - speaker.remainingSeconds
    );

    const newToken: Token = {
      id: `tok-${Date.now()}`,
      type: speaker.tokenType,
      studentId: student.id,
      studentName: student.name,
      deskNumber: student.deskNumber,
      usedAt: new Date().toISOString(),
      durationSeconds: usedDuration,
    };

    student.isCurrentlySpeaking = false;
    student.hasSpoken = true;
    student.remainingTokens = Math.max(0, student.remainingTokens - 1);
    student.totalSpeakingTimeSeconds += usedDuration;
    student.usedTokens.push(newToken);
    student.lastSpokeAt = newToken.usedAt;

    this.activeSpeakers.delete(classId);
    return { student, token: newToken };
  }

  // 4. STATS & ANALYTICS COMPUTATION
  public getClassStats(classId: string): ClassStats | null {
    const classroom = this.getClassroomById(classId);
    if (!classroom) return null;

    const totalStudents = classroom.students.length;
    const totalTokensAllocated = totalStudents * classroom.tokensPerStudent;
    const totalTokensUsed = classroom.students.reduce(
      (acc, s) => acc + s.usedTokens.length,
      0
    );
    const totalTokensRemaining = Math.max(0, totalTokensAllocated - totalTokensUsed);

    const studentsSpokenCount = classroom.students.filter(
      (s) => s.hasSpoken && s.usedTokens.length > 0
    ).length;
    const studentsIdleCount = totalStudents - studentsSpokenCount;
    const participationRate =
      totalStudents > 0 ? Math.round((studentsSpokenCount / totalStudents) * 100) : 0;

    const distributionByType: Record<TokenType, number> = {
      BERTANYA: 0,
      MENJAWAB: 0,
      BERPENDAPAT: 0,
      MENANGGAPI: 0,
    };

    classroom.students.forEach((s) => {
      s.usedTokens.forEach((t) => {
        if (distributionByType[t.type] !== undefined) {
          distributionByType[t.type] += 1;
        }
      });
    });

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

  // 5. EDUCATOR PROFILE
  public getEducatorProfile(): User {
    return this.educatorProfile;
  }

  public updateEducatorProfile(data: Partial<User>): User {
    this.educatorProfile = {
      ...this.educatorProfile,
      ...data,
    };
    return this.educatorProfile;
  }
}

export const memoryStore = new MemoryStore();

