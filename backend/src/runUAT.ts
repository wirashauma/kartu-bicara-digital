import { prisma } from "./config/prisma.js";

const BACKEND_BASE = "http://localhost:5000";
const FRONTEND_BASE = "http://localhost:3000";

interface TestResult {
  suite: string;
  test: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, suite: string, test: string, details?: string) {
  if (condition) {
    results.push({ suite, test, passed: true, details });
    console.log(`  ✅ [PASS] ${test}`);
  } else {
    results.push({ suite, test, passed: false, details });
    console.error(`  ❌ [FAIL] ${test} - ${details || "Kondisi tidak terpenuhi"}`);
  }
}

async function runUAT() {
  console.log("==================================================================");
  console.log("🧪 MEMULAI UAT (USER ACCEPTANCE TESTING) END-TO-END SISTEM");
  console.log("==================================================================");

  // -----------------------------------------------------------------------------
  // SUITE 1: KONEKTIVITAS & HEALTH CHECK
  // -----------------------------------------------------------------------------
  console.log("\n📦 SUITE 1: Server Health & Proxy Check");
  try {
    const resBackendHealth = await fetch(`${BACKEND_BASE}/api/health`);
    const dataBackendHealth: any = await resBackendHealth.json();
    assert(
      resBackendHealth.status === 200 && dataBackendHealth.status === "ok",
      "Suite 1",
      "Backend Express Health Check (/api/health) mengembalikan 200 OK",
      `Uptime: ${dataBackendHealth.uptime}s`
    );

    const resFrontendHealth = await fetch(`${FRONTEND_BASE}/api/health`);
    const dataFrontendHealth: any = await resFrontendHealth.json();
    assert(
      resFrontendHealth.status === 200 && dataFrontendHealth.status === "ok",
      "Suite 1",
      "Frontend Next.js Reverse Proxy (/api/* -> :5000) terhubung sempurna",
      `Status: ${dataFrontendHealth.status}`
    );
  } catch (err) {
    assert(false, "Suite 1", "Konektivitas server gagal", (err as Error).message);
  }

  // -----------------------------------------------------------------------------
  // SUITE 2: HALAMAN & ROUTE FRONTEND NEXT.JS (HTTP 200)
  // -----------------------------------------------------------------------------
  console.log("\n🌐 SUITE 2: Frontend Pages Availability & SSR");
  const routes = [
    { path: "/", name: "Halaman Utama / Dashboard Guru & Siswa" },
    { path: "/login", name: "Halaman Autentikasi Masuk (Login)" },
    { path: "/register", name: "Halaman Pendaftaran Akun (Register)" },
    { path: "/faq", name: "Halaman Bantuan & FAQ" },
    { path: "/profile", name: "Halaman Profil Pengguna" },
  ];

  for (const r of routes) {
    try {
      const res = await fetch(`${FRONTEND_BASE}${r.path}`);
      assert(
        res.status === 200,
        "Suite 2",
        `Halaman ${r.name} (${r.path}) dapat diakses (HTTP 200)`,
        `Status: ${res.status}`
      );
    } catch (err) {
      assert(false, "Suite 2", `Halaman ${r.path} gagal dimuat`, (err as Error).message);
    }
  }

  // -----------------------------------------------------------------------------
  // SUITE 3: AUTENTIKASI PENDIDIK & SISWA
  // -----------------------------------------------------------------------------
  console.log("\n🔐 SUITE 3: Autentikasi & Akun Seed");
  try {
    // 3.1 Login Guru Pendidik
    const resTeacherLogin = await fetch(`${BACKEND_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "guru.pembimbing@gmail.com",
        password: "password123",
        role: "TEACHER",
      }),
    });
    const dataTeacher: any = await resTeacherLogin.json();
    assert(
      resTeacherLogin.status === 200 &&
        dataTeacher.success &&
        dataTeacher.user.role === "TEACHER",
      "Suite 3",
      "Login Guru Pendidik (guru.pembimbing@gmail.com) berhasil dengan role TEACHER",
      `Nama: ${dataTeacher.user?.name}`
    );

    // 3.2 Login Siswa Kelas X.E3
    const resStudentXE3 = await fetch(`${BACKEND_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "abdul.arif@gmail.com",
        password: "password123",
        role: "STUDENT",
      }),
    });
    const dataXE3: any = await resStudentXE3.json();
    assert(
      resStudentXE3.status === 200 &&
        dataXE3.success &&
        dataXE3.user.deskNumber === 1 &&
        dataXE3.user.className === "Kelas X.E3",
      "Suite 3",
      "Login Siswa Kelas X.E3 (abdul.arif@gmail.com) berhasil dengan Nomor Meja #1",
      `Siswa: ${dataXE3.user?.name}, Kelas: ${dataXE3.user?.className}`
    );

    // 3.3 Login Siswa Kelas X.E5
    const resStudentXE5 = await fetch(`${BACKEND_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "adelya.alsa.sakhira@gmail.com",
        password: "password123",
        role: "STUDENT",
      }),
    });
    const dataXE5: any = await resStudentXE5.json();
    assert(
      resStudentXE5.status === 200 &&
        dataXE5.success &&
        dataXE5.user.deskNumber === 1 &&
        dataXE5.user.className === "Kelas X.E5",
      "Suite 3",
      "Login Siswa Kelas X.E5 (adelya.alsa.sakhira@gmail.com) berhasil dengan Nomor Meja #1",
      `Siswa: ${dataXE5.user?.name}, Kelas: ${dataXE5.user?.className}`
    );

    // 3.4 Proteksi Kata Sandi Salah
    const resWrongPass = await fetch(`${BACKEND_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "guru.pembimbing@gmail.com",
        password: "passwordSALAH",
        role: "TEACHER",
      }),
    });
    assert(
      resWrongPass.status === 401,
      "Suite 3",
      "Proteksi keamanan menolak kata sandi yang salah (HTTP 401)"
    );

    // 3.5 Pendaftaran Akun Dinamis
    const testRegEmail = `siswa.uat.${Date.now()}@gmail.com`;
    const resRegister = await fetch(`${BACKEND_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Siswa UAT Otomatis",
        email: testRegEmail,
        password: "password123",
        role: "STUDENT",
        className: "Kelas X.E3",
        school: "SMAN 1 Teladan",
      }),
    });
    const dataReg: any = await resRegister.json();
    assert(
      resRegister.status === 201 && dataReg.success,
      "Suite 3",
      "Registrasi akun siswa baru terintegrasi ke sistem",
      `Email: ${testRegEmail}`
    );
  } catch (err) {
    assert(false, "Suite 3", "Gagal pada pengujian autentikasi", (err as Error).message);
  }

  // -----------------------------------------------------------------------------
  // SUITE 4: MANAJEMEN KELAS & SISWA (CRUD)
  // -----------------------------------------------------------------------------
  console.log("\n🏫 SUITE 4: Manajemen Kelas & Siswa (CRUD)");
  let testClassId = "";
  let testStudentId = "";
  try {
    // 4.1 Ambil Semua Kelas
    const resGetClasses = await fetch(`${BACKEND_BASE}/api/classes`);
    const dataClasses: any = await resGetClasses.json();
    const hasXE3 = dataClasses.data?.some((c: any) => c.name === "Kelas X.E3");
    const hasXE5 = dataClasses.data?.some((c: any) => c.name === "Kelas X.E5");
    assert(
      resGetClasses.status === 200 && hasXE3 && hasXE5,
      "Suite 4",
      "Katalog kelas memuat Kelas X.E3 dan Kelas X.E5 secara utuh",
      `Total Kelas: ${dataClasses.data?.length}`
    );

    // 4.2 Verifikasi Siswa Kelas X.E3
    const classXE3 = dataClasses.data?.find((c: any) => c.name === "Kelas X.E3");
    assert(
      classXE3 && classXE3.students?.length === 36,
      "Suite 4",
      "Kelas X.E3 memiliki 36 siswa resmi tanpa data dummy",
      `Jumlah Siswa: ${classXE3?.students?.length}`
    );

    // 4.3 Verifikasi Siswa Kelas X.E5
    const classXE5 = dataClasses.data?.find((c: any) => c.name === "Kelas X.E5");
    assert(
      classXE5 && classXE5.students?.length === 36,
      "Suite 4",
      "Kelas X.E5 memiliki 36 siswa resmi tanpa data dummy",
      `Jumlah Siswa: ${classXE5?.students?.length}`
    );

    // 4.4 Ambil Kelas via PIN Sesi
    const resPin = await fetch(`${BACKEND_BASE}/api/classes/pin/382910`);
    const dataPin: any = await resPin.json();
    assert(
      resPin.status === 200 && dataPin.data?.name === "Kelas X.E3",
      "Suite 4",
      "Pencarian kelas via PIN Sesi (#382910) berhasil menemukan Kelas X.E3"
    );

    // 4.5 Buat Kelas Baru (UAT)
    const resCreateClass = await fetch(`${BACKEND_BASE}/api/classes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Kelas UAT Simulasi",
        subject: "Bahasa Indonesia",
        topic: "Simulasi UAT",
        grade: "X",
        tokensPerStudent: 3,
        speechTimeLimitSeconds: 45,
      }),
    });
    const dataCreateClass: any = await resCreateClass.json();
    testClassId = dataCreateClass.data?.id;
    assert(
      resCreateClass.status === 201 && Boolean(testClassId),
      "Suite 4",
      "Pembuatan ruang kelas baru (POST /api/classes) berhasil",
      `ID: ${testClassId}`
    );

    // 4.6 Tambah Siswa Baru ke Kelas Tersebut
    const resAddStudent = await fetch(`${BACKEND_BASE}/api/classes/${testClassId}/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Siswa UAT Tambahan",
        deskNumber: 99,
        tokensQuota: 3,
      }),
    });
    const dataAddStudent: any = await resAddStudent.json();
    testStudentId = dataAddStudent.data?.id;
    assert(
      resAddStudent.status === 201 && Boolean(testStudentId),
      "Suite 4",
      "Penambahan siswa baru ke kelas aktif berhasil",
      `Siswa: ${dataAddStudent.data?.name} (Meja #${dataAddStudent.data?.deskNumber})`
    );

    // 4.7 Hapus Siswa dari Kelas
    const resDeleteStudent = await fetch(
      `${BACKEND_BASE}/api/classes/${testClassId}/students/${testStudentId}`,
      { method: "DELETE" }
    );
    assert(
      resDeleteStudent.status === 200,
      "Suite 4",
      "Penghapusan siswa dari kelas berhasil"
    );

    // 4.8 Hapus Kelas Simulasi
    const resDeleteClass = await fetch(`${BACKEND_BASE}/api/classes/${testClassId}`, {
      method: "DELETE",
    });
    assert(
      resDeleteClass.status === 200,
      "Suite 4",
      "Penghapusan kelas simulasi (DELETE /api/classes/:id) berhasil"
    );
  } catch (err) {
    assert(false, "Suite 4", "Gagal pada pengujian manajemen kelas", (err as Error).message);
  }

  // -----------------------------------------------------------------------------
  // SUITE 5: SIKLUS DISKUSI MODEL ARENDS (SPEAKER ENGINE & TIMER)
  // -----------------------------------------------------------------------------
  console.log("\n⏱️ SUITE 5: Siklus Diskusi Model Arends (Speaker & Token)");
  try {
    const classId = "class-xe3";
    const studentId = "std-xe3-1"; // Abdul Arif

    // 5.1 Mulai Bicara (Start Speaker)
    const resStart = await fetch(`${BACKEND_BASE}/api/classes/${classId}/speaker/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId,
        tokenType: "BERTANYA",
        allocatedSeconds: 60,
      }),
    });
    const dataStart: any = await resStart.json();
    assert(
      resStart.status === 200 &&
        dataStart.success &&
        dataStart.data.tokenType === "BERTANYA" &&
        dataStart.data.studentName === "Abdul Arif",
      "Suite 5",
      "Mulai bicara (Start Speaker) menetapkan siswa aktif dengan token BERTANYA",
      `Siswa Aktif: ${dataStart.data?.studentName}`
    );

    // 5.2 Ambil Status Pembicara Aktif
    const resActive = await fetch(`${BACKEND_BASE}/api/classes/${classId}/speaker`);
    const dataActive: any = await resActive.json();
    assert(
      resActive.status === 200 && dataActive.data?.studentId === studentId,
      "Suite 5",
      "Endpoint getActiveSpeaker memvalidasi giliran siswa yang sedang berbicara"
    );

    // 5.3 Jeda Timer (Pause)
    const resPause = await fetch(`${BACKEND_BASE}/api/classes/${classId}/speaker/pause`, {
      method: "POST",
    });
    const dataPause: any = await resPause.json();
    assert(
      resPause.status === 200 && dataPause.data?.isPaused === true,
      "Suite 5",
      "Fungsi jeda waktu (Pause Timer) berhasil menghentikan hitung mundur"
    );

    // 5.4 Lanjutkan Timer (Resume)
    const resResume = await fetch(`${BACKEND_BASE}/api/classes/${classId}/speaker/resume`, {
      method: "POST",
    });
    const dataResume: any = await resResume.json();
    assert(
      resResume.status === 200 && dataResume.data?.isPaused === false,
      "Suite 5",
      "Fungsi lanjutkan waktu (Resume Timer) mengaktifkan kembali hitung mundur"
    );

    // 5.5 Tambah Waktu Bicara (+15 detik)
    const prevAllocated = dataResume.data.allocatedSeconds;
    const resExtend = await fetch(`${BACKEND_BASE}/api/classes/${classId}/speaker/extend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ extraSeconds: 15 }),
    });
    const dataExtend: any = await resExtend.json();
    assert(
      resExtend.status === 200 &&
        dataExtend.data?.allocatedSeconds === prevAllocated + 15,
      "Suite 5",
      "Fungsi tambah waktu (+15 detik) menambah durasi bicara dengan tepat",
      `Durasi baru: ${dataExtend.data?.allocatedSeconds}s`
    );

    // 5.6 Selesaikan Bicara (Finish Speaker & Consume Token)
    const resFinish = await fetch(`${BACKEND_BASE}/api/classes/${classId}/speaker/finish`, {
      method: "POST",
    });
    const dataFinish: any = await resFinish.json();
    assert(
      resFinish.status === 200 &&
        dataFinish.success &&
        dataFinish.data.student.remainingTokens === 2 &&
        dataFinish.data.student.hasSpoken === true &&
        dataFinish.data.token.type === "BERTANYA",
      "Suite 5",
      "Selesai bicara mengurangi sisa token siswa (3 -> 2) dan mencatat riwayat token BERTANYA",
      `Sisa Token: ${dataFinish.data?.student?.remainingTokens}, Durasi: ${dataFinish.data?.token?.durationSeconds}s`
    );

    // 5.7 Ambil Statistik Kelas Terkini
    const resStats = await fetch(`${BACKEND_BASE}/api/classes/${classId}/stats`);
    const dataStats: any = await resStats.json();
    assert(
      resStats.status === 200 &&
        dataStats.data?.distributionByType?.BERTANYA === 1 &&
        dataStats.data?.studentsSpokenCount === 1,
      "Suite 5",
      "Statistik analitik kelas memperbarui jumlah giliran bicara dan taksonomi BERTANYA",
      `Partisipasi: ${dataStats.data?.participationRate}%`
    );

    // 5.8 Reset Sesi Kelas
    const resReset = await fetch(`${BACKEND_BASE}/api/classes/${classId}/reset`, {
      method: "POST",
    });
    const dataReset: any = await resReset.json();
    const abdulReset = dataReset.data?.students?.find((s: any) => s.id === studentId);
    assert(
      resReset.status === 200 &&
        abdulReset &&
        abdulReset.remainingTokens === 3 &&
        abdulReset.usedTokens.length === 0,
      "Suite 5",
      "Reset sesi kelas memulihkan kuota kartu bicara siswa kembali penuh (3 token) tanpa menghapus nama siswa",
      `Nama Siswa Tetap: ${abdulReset?.name}, Sisa Token: ${abdulReset?.remainingTokens}`
    );
  } catch (err) {
    assert(false, "Suite 5", "Gagal pada pengujian siklus diskusi", (err as Error).message);
  }

  // -----------------------------------------------------------------------------
  // SUITE 6: INTEGRITAS DATABASE POSTGRESQL (SUPABASE VIA PRISMA)
  // -----------------------------------------------------------------------------
  console.log("\n🐘 SUITE 6: Integritas Database PostgreSQL Supabase via Prisma");
  try {
    const userCount = await prisma.user.count();
    assert(
      userCount >= 75,
      "Suite 6",
      `Database PostgreSQL Supabase memuat ${userCount} akun pengguna (>= 75)`,
      `Total Users: ${userCount}`
    );

    const classroomCount = await prisma.classRoom.count();
    assert(
      classroomCount >= 2,
      "Suite 6",
      `Database PostgreSQL Supabase memuat ${classroomCount} rombel kelas resmi`,
      `Total Classrooms: ${classroomCount}`
    );

    const studentCount = await prisma.student.count();
    assert(
      studentCount >= 72,
      "Suite 6",
      `Database PostgreSQL Supabase memuat ${studentCount} relasi siswa resmi (36 X.E3 + 36 X.E5)`,
      `Total Students: ${studentCount}`
    );

    const teachers = await prisma.user.findMany({
      where: { role: "TEACHER" },
    });
    assert(
      teachers.length >= 2,
      "Suite 6",
      "Akun guru pendidik terverifikasi di PostgreSQL",
      `Guru Terdaftar: ${teachers.map((t) => t.email).join(", ")}`
    );
  } catch (err) {
    assert(false, "Suite 6", "Gagal pada integritas database Prisma", (err as Error).message);
  }

  // -----------------------------------------------------------------------------
  // RINGKASAN AKHIR UAT
  // -----------------------------------------------------------------------------
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;
  const totalCount = results.length;
  const passPercentage = Math.round((passedCount / totalCount) * 100);

  console.log("\n==================================================================");
  console.log("📊 HASIL LAPORAN UAT (USER ACCEPTANCE TESTING)");
  console.log("==================================================================");
  console.log(`Total Pengujian:  ${totalCount}`);
  console.log(`Lulus (Passed):   ${passedCount}`);
  console.log(`Gagal (Failed):   ${failedCount}`);
  console.log(`Tingkat Kelulusan: ${passPercentage}%`);
  console.log("==================================================================");

  if (failedCount === 0) {
    console.log("🎉 SELURUH SISTEM 100% LULUS PENGUJIAN UAT DAN INTEGRASI DATABASE!");
  } else {
    console.log(`⚠️ Terdapat ${failedCount} pengujian yang memerlukan perbaikan.`);
    process.exit(1);
  }
}

runUAT().then(() => {
  prisma.$disconnect();
});
