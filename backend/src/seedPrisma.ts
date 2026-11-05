import { prisma } from "./config/prisma.js";
import {
  STUDENTS_X_E3_NAMES,
  STUDENTS_X_E5_NAMES,
  DEFAULT_SEED_PASSWORD,
  generateEmailFromName,
} from "./data/seedData.js";

async function seedPrismaDatabase() {
  console.log("=====================================================");
  console.log("🌱 MEMULAI SEED DATABASE POSTGRESQL (SUPABASE + PRISMA)");
  console.log("=====================================================");

  try {
    // 1. Bersihkan data dummy lama jika ada
    await prisma.token.deleteMany({});
    await prisma.activeSpeaker.deleteMany({});
    await prisma.student.deleteMany({});
    await prisma.classRoom.deleteMany({});
    await prisma.user.deleteMany({});
    console.log("🧹 Berhasil membersihkan tabel database.");

    // 2. Buat Akun Guru Pendidik
    const teacher1 = await prisma.user.create({
      data: {
        id: "usr-guru-1",
        email: "guru.pembimbing@gmail.com",
        password: DEFAULT_SEED_PASSWORD,
        name: "Dra. Sri Wahyuni, M.Pd.",
        role: "TEACHER",
      },
    });

    const teacher2 = await prisma.user.create({
      data: {
        id: "usr-guru-2",
        email: "guru.penguji@gmail.com",
        password: DEFAULT_SEED_PASSWORD,
        name: "Budi Santoso, S.Pd.",
        role: "TEACHER",
      },
    });

    // Alias guru sederhana
    await prisma.user.create({
      data: {
        id: "usr-guru-simple",
        email: "guru@gmail.com",
        password: DEFAULT_SEED_PASSWORD,
        name: "Guru Pendidik",
        role: "TEACHER",
      },
    });

    console.log(`✅ [GURU] 3 Akun Guru dibuat (${teacher1.email}, ${teacher2.email}, guru@gmail.com).`);

    // 3. Buat Ruang Kelas X.E3
    const classXE3 = await prisma.classRoom.create({
      data: {
        id: "class-xe3",
        name: "Kelas X.E3",
        subject: "Bahasa Indonesia",
        topic: "Teks Negosiasi & Debat Kritis",
        grade: "X",
        tokensPerStudent: 3,
        speechTimeLimitSeconds: 60,
        sessionPin: "382910",
      },
    });

    // 4. Buat Ruang Kelas X.E5
    const classXE5 = await prisma.classRoom.create({
      data: {
        id: "class-xe5",
        name: "Kelas X.E5",
        subject: "Bahasa Indonesia",
        topic: "Teks Anekdot & Retorika Publik",
        grade: "X",
        tokensPerStudent: 3,
        speechTimeLimitSeconds: 60,
        sessionPin: "491820",
      },
    });

    console.log("✅ [KELAS] 2 Rombel dibuat: Kelas X.E3 (#382910) dan Kelas X.E5 (#491820).");

    // 5. Seed Siswa Kelas X.E3 (36 Siswa)
    console.log("⏳ Mengunggah 36 siswa Kelas X.E3 ke database...");
    for (let i = 0; i < STUDENTS_X_E3_NAMES.length; i++) {
      const name = STUDENTS_X_E3_NAMES[i];
      const deskNumber = i + 1;
      const email = generateEmailFromName(name);

      const user = await prisma.user.create({
        data: {
          id: `usr-xe3-${deskNumber}`,
          email,
          password: DEFAULT_SEED_PASSWORD,
          name,
          role: "STUDENT",
          deskNumber,
          className: "Kelas X.E3",
        },
      });

      await prisma.student.create({
        data: {
          id: `std-xe3-${deskNumber}`,
          name,
          deskNumber,
          tokensQuota: 3,
          remainingTokens: 3,
          totalSpeakingTimeSeconds: 0,
          hasSpoken: false,
          isCurrentlySpeaking: false,
          classRoomId: classXE3.id,
          userId: user.id,
        },
      });
    }
    console.log("✅ [SISWA X.E3] 36 Siswa berhasil disimpan.");

    // 6. Seed Siswa Kelas X.E5 (36 Siswa)
    console.log("⏳ Mengunggah 36 siswa Kelas X.E5 ke database...");
    for (let i = 0; i < STUDENTS_X_E5_NAMES.length; i++) {
      const name = STUDENTS_X_E5_NAMES[i];
      const deskNumber = i + 1;
      const email = generateEmailFromName(name);

      const user = await prisma.user.create({
        data: {
          id: `usr-xe5-${deskNumber}`,
          email,
          password: DEFAULT_SEED_PASSWORD,
          name,
          role: "STUDENT",
          deskNumber,
          className: "Kelas X.E5",
        },
      });

      await prisma.student.create({
        data: {
          id: `std-xe5-${deskNumber}`,
          name,
          deskNumber,
          tokensQuota: 3,
          remainingTokens: 3,
          totalSpeakingTimeSeconds: 0,
          hasSpoken: false,
          isCurrentlySpeaking: false,
          classRoomId: classXE5.id,
          userId: user.id,
        },
      });
    }
    console.log("✅ [SISWA X.E5] 36 Siswa berhasil disimpan.");

    // Verifikasi total
    const totalUsers = await prisma.user.count();
    const totalStudents = await prisma.student.count();
    const totalClasses = await prisma.classRoom.count();

    console.log("=====================================================");
    console.log("🎉 SEED PRISMA SELESAI DENGAN SUKSES!");
    console.log(`📊 Total User Akun: ${totalUsers}`);
    console.log(`📊 Total Siswa:     ${totalStudents}`);
    console.log(`📊 Total Kelas:     ${totalClasses}`);
    console.log("=====================================================");
  } catch (error) {
    console.error("❌ Gagal seeding database Prisma:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedPrismaDatabase();

