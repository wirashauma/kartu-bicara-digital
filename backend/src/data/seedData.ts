import { ClassRoom, Student, UserAccount } from "../types/session.js";

export const DEFAULT_SEED_PASSWORD = "password123";

export const STUDENTS_X_E3_NAMES: string[] = [
  "Abdul Arif",
  "Abel Fanesya Oktari",
  "Abel Meysa Andala",
  "Adelvia Anwar",
  "Adib Endjie Syakiil",
  "Asyfa Claudia Putri",
  "Citra Ramadhani Vanelsa",
  "Citra Wahyuni",
  "Cut Tia Amanda Putri",
  "Dela Safitri",
  "Demoza Samanthia",
  "Hanif Maulana",
  "Harby Liasril Putra",
  "Haris Ferdiansah",
  "Hestia Dwi Qarila",
  "Ibnu Fauzan Koto",
  "Iftitahul Aulia",
  "Laras Chaniago",
  "Latifah Zahra",
  "Lusi Yani",
  "Luzy Neza Safitri",
  "M Thoriq Muafaq",
  "Muhammad Alghifari Fahrezi",
  "Muhammad Arrazaq Athalla Efanda",
  "Nasyifa Fahratul Khaira",
  "Natasya",
  "Nauza Dira Cania",
  "Nayla Syifa Fawwazah",
  "Niko Julian Saputra",
  "Oksal Bintang Risandi",
  "Rani Juanisa Fitria",
  "Rasti Gustiami Putri",
  "Ratna Juwita",
  "Rofi Alifia Khairun Nisa",
  "Suci Ananda",
  "Yopi Febrian",
];

export const STUDENTS_X_E5_NAMES: string[] = [
  "Adelya Alsa Sakhira",
  "Adika Arfani",
  "Aditia Saputra Pratama",
  "Aditya Hamdani",
  "Adzkia Madina Nasywa",
  "Erneste Fanesya Lizardo",
  "Ezi Putri Hamidi",
  "Fadil Mayora Putra",
  "Fadlan Yayan Putra",
  "Fadli El Shyrazi",
  "Fahim Arya Ramadhan",
  "Fahri Abid Azrivi",
  "Faiza Ramadhan",
  "Faizah Salsabila",
  "Fajar Pratama",
  "Fajrina Leona Salsabila",
  "Fanisa Meysa Putri",
  "Fathin Donel",
  "Fauziah Pitriani",
  "Felina Fitri Erly",
  "Fellya Ramadhani Fitri",
  "Fhatir Al Ikhsan",
  "Fidyanaysila",
  "Fikri Adiva Rahman",
  "Fitriani",
  "Gebi Kumala Sari",
  "Geraldi Juanda Putra",
  "Ghea Hibna Syawal",
  "Gilang Pratama",
  "Habib Armanovid",
  "Hafiza Putria Chandra",
  "Hanifatuddiniyah Yulizar",
  "Syahira Nevriza",
  "Syakira Annajmi",
  "Syauqia Hufaira Augsoco",
  "Yusuf Ar Rafi",
];

/**
 * Normalisasi nama menjadi format email tanpa spasi
 * Contoh: "Abdul Arif" -> "abdularif@gmail.com"
 */
export function generateEmailFromName(name: string): string {
  const clean = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${clean}@gmail.com`;
}

/**
 * Normalisasi nama menjadi format email dengan titik
 * Contoh: "Abdul Arif" -> "abdul.arif@gmail.com"
 */
export function generateEmailWithDotFromName(name: string): string {
  const clean = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ".")
    .replace(/[^a-z0-9.]/g, "");
  return `${clean}@gmail.com`;
}

/**
 * Helper untuk normalisasi pencarian email
 */
export function normalizeEmailQuery(query: string): string {
  return query
    .toLowerCase()
    .trim()
    .replace(/@gmail\.com$/i, "")
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Membangun array Student bersih tanpa dummy data
 */
export function buildCleanStudents(
  names: string[],
  classPrefix: string,
  quota: number = 3
): Student[] {
  return names.map((name, idx) => {
    const deskNumber = idx + 1;
    return {
      id: `std-${classPrefix}-${deskNumber}`,
      name,
      deskNumber,
      tokensQuota: quota,
      remainingTokens: quota,
      usedTokens: [], // Bersih tanpa data dummy
      isCurrentlySpeaking: false,
      hasSpoken: false,
      totalSpeakingTimeSeconds: 0,
    };
  });
}

/**
 * Membuat Kelas X.E3 dan Kelas X.E5 yang sudah terisi siswa bersih
 */
export function generateSeedClassrooms(): ClassRoom[] {
  const now = new Date().toISOString();

  const classXE3: ClassRoom = {
    id: "class-xe3",
    name: "Kelas X.E3",
    subject: "Bahasa Indonesia / Sosiologi",
    grade: "Kelas 10 SMA",
    sessionPin: "TT-1031",
    topic: "Diskusi Terbuka Model Arends",
    tokensPerStudent: 3,
    speechTimeLimitSeconds: 60,
    students: buildCleanStudents(STUDENTS_X_E3_NAMES, "xe3", 3),
    academicYear: "2024/2025 Genap",
    createdAt: now,
  };

  const classXE5: ClassRoom = {
    id: "class-xe5",
    name: "Kelas X.E5",
    subject: "Bahasa Indonesia / Sosiologi",
    grade: "Kelas 10 SMA",
    sessionPin: "TT-1051",
    topic: "Diskusi Terbuka Model Arends",
    tokensPerStudent: 3,
    speechTimeLimitSeconds: 60,
    students: buildCleanStudents(STUDENTS_X_E5_NAMES, "xe5", 3),
    academicYear: "2024/2025 Genap",
    createdAt: now,
  };

  return [classXE3, classXE5];
}

/**
 * Membangun akun seed terdaftar (Pendidik + 36 Siswa X.E3 + 36 Siswa X.E5)
 */
export function generateSeedUsers(): UserAccount[] {
  const users: UserAccount[] = [];

  // 1. Akun Guru Utama
  users.push({
    id: "tch-1",
    name: "Dra. Sri Wahyuni, M.Pd.",
    email: "sri.wahyuni@sekolah.sch.id",
    emailWithDot: "sri.wahyuni@gmail.com",
    password: DEFAULT_SEED_PASSWORD,
    school: "SMAN 1 Teladan",
    subject: "Sosiologi / Bahasa Indonesia",
    role: "TEACHER",
    avatar: "DS",
  });

  // 2. Akun Guru Alternatif / Standar
  users.push({
    id: "tch-2",
    name: "Guru Pendidik",
    email: "guru@gmail.com",
    emailWithDot: "guru@gmail.com",
    password: DEFAULT_SEED_PASSWORD,
    school: "SMAN 1 Teladan",
    subject: "Bahasa Indonesia",
    role: "TEACHER",
    avatar: "GP",
  });

  // 3. Akun Guru: Mutia Puspita Sari
  users.push({
    id: "tch-3",
    name: "Mutia Puspita Sari, S.Pd.",
    email: "mutiapuspitasari@gmail.com",
    emailWithDot: "mutia.puspitasari@gmail.com",
    password: DEFAULT_SEED_PASSWORD,
    school: "SMAN 1 Teladan",
    subject: "Bahasa Indonesia",
    role: "TEACHER",
    avatar: "MP",
  });

  // 4. Akun Siswa Kelas X.E3 (36 Siswa)
  STUDENTS_X_E3_NAMES.forEach((name, idx) => {
    const deskNumber = idx + 1;
    users.push({
      id: `std-xe3-${deskNumber}`,
      name,
      email: generateEmailFromName(name),
      emailWithDot: generateEmailWithDotFromName(name),
      password: DEFAULT_SEED_PASSWORD,
      role: "STUDENT",
      className: "Kelas X.E3",
      deskNumber,
      school: "SMAN 1 Teladan",
    });
  });

  // 4. Akun Siswa Kelas X.E5 (36 Siswa)
  STUDENTS_X_E5_NAMES.forEach((name, idx) => {
    const deskNumber = idx + 1;
    users.push({
      id: `std-xe5-${deskNumber}`,
      name,
      email: generateEmailFromName(name),
      emailWithDot: generateEmailWithDotFromName(name),
      password: DEFAULT_SEED_PASSWORD,
      role: "STUDENT",
      className: "Kelas X.E5",
      deskNumber,
      school: "SMAN 1 Teladan",
    });
  });

  return users;
}

