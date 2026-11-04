import { Server, Socket } from "socket.io";
import { memoryStore } from "../data/memoryStore.js";
import { TokenType } from "../types/session.js";

// Map to hold running interval tickers per classroom
const roomTimers: Map<string, NodeJS.Timeout> = new Map();

export function setupSessionSockets(io: Server) {
  io.on("connection", (socket: Socket) => {
    // 1. Join Classroom Room
    socket.on("session:join", ({ classId, role, userName }: { classId: string; role?: string; userName?: string }) => {
      socket.join(classId);

      const classroom = memoryStore.getClassroomById(classId);
      const activeSpeaker = memoryStore.getActiveSpeaker(classId);
      const stats = memoryStore.getClassStats(classId);

      // Send current state snapshot
      socket.emit("session:sync", {
        classroom,
        activeSpeaker,
        stats,
      });

      // Notify others in room
      socket.to(classId).emit("user:joined", {
        socketId: socket.id,
        role: role || "GUEST",
        userName: userName || "Pengguna",
      });
    });

    // 2. Leave Classroom Room
    socket.on("session:leave", ({ classId }: { classId: string }) => {
      socket.leave(classId);
    });

    // 3. Start Speaker Turn
    socket.on(
      "speaker:start",
      ({
        classId,
        studentId,
        tokenType,
        allocatedSeconds,
      }: {
        classId: string;
        studentId: string;
        tokenType: TokenType;
        allocatedSeconds?: number;
      }) => {
        const speaker = memoryStore.startSpeaker(classId, {
          studentId,
          tokenType,
          allocatedSeconds,
        });

        if (!speaker) {
          socket.emit("speaker:error", { message: "Gagal memulai sesi bicara." });
          return;
        }

        // Start server synchronized timer loop for this room
        startRoomTimer(io, classId);

        // Broadcast to all participants in this classroom
        io.to(classId).emit("speaker:started", speaker);
        io.to(classId).emit("session:sync", {
          classroom: memoryStore.getClassroomById(classId),
          activeSpeaker: speaker,
          stats: memoryStore.getClassStats(classId),
        });
      }
    );

    // 4. Pause Timer
    socket.on("speaker:pause", ({ classId }: { classId: string }) => {
      const speaker = memoryStore.pauseSpeaker(classId);
      if (speaker) {
        io.to(classId).emit("speaker:paused", speaker);
      }
    });

    // 5. Resume Timer
    socket.on("speaker:resume", ({ classId }: { classId: string }) => {
      const speaker = memoryStore.resumeSpeaker(classId);
      if (speaker) {
        io.to(classId).emit("speaker:resumed", speaker);
      }
    });

    // 6. Extend Time (+15s / +30s)
    socket.on("speaker:extend_time", ({ classId, extraSeconds }: { classId: string; extraSeconds: number }) => {
      const speaker = memoryStore.extendSpeaker(classId, extraSeconds);
      if (speaker) {
        io.to(classId).emit("speaker:extended", speaker);
      }
    });

    // 7. Finish Speaker
    socket.on("speaker:finish", ({ classId }: { classId: string }) => {
      stopRoomTimer(classId);
      const result = memoryStore.finishSpeaker(classId);

      if (result.token) {
        io.to(classId).emit("speaker:finished", result);
        io.to(classId).emit("session:sync", {
          classroom: memoryStore.getClassroomById(classId),
          activeSpeaker: null,
          stats: memoryStore.getClassStats(classId),
        });
      }
    });

    // 8. Class Data Updated (Reset / Student added / etc.)
    socket.on("session:refresh", ({ classId }: { classId: string }) => {
      io.to(classId).emit("session:sync", {
        classroom: memoryStore.getClassroomById(classId),
        activeSpeaker: memoryStore.getActiveSpeaker(classId),
        stats: memoryStore.getClassStats(classId),
      });
    });

    socket.on("disconnect", () => {
      // Cleanup if needed
    });
  });
}

function startRoomTimer(io: Server, classId: string) {
  stopRoomTimer(classId);

  const timer = setInterval(() => {
    const { speaker, isFinished } = memoryStore.tickSpeakerTimer(classId);

    if (speaker) {
      // Emit tick per second to all connected clients
      io.to(classId).emit("timer:tick", {
        remainingSeconds: speaker.remainingSeconds,
        allocatedSeconds: speaker.allocatedSeconds,
        isPaused: speaker.isPaused,
      });

      if (isFinished) {
        stopRoomTimer(classId);
        io.to(classId).emit("timer:time_up", {
          speaker,
        });
      }
    } else {
      stopRoomTimer(classId);
    }
  }, 1000);

  roomTimers.set(classId, timer);
}

function stopRoomTimer(classId: string) {
  const existing = roomTimers.get(classId);
  if (existing) {
    clearInterval(existing);
    roomTimers.delete(classId);
  }
}

