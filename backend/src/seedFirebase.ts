import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  STUDENTS_X_E3_NAMES,
  STUDENTS_X_E5_NAMES,
  generateEmailFromName,
  DEFAULT_SEED_PASSWORD,
} from "./data/seedData.js";

const firebaseConfig = {
  apiKey: "AIzaSyCXEa7yf1O6mr7w-KbqZl_FJJqq9rdd148",
  authDomain: "kartu-bicara-digital-2f0ce.firebaseapp.com",
  projectId: "kartu-bicara-digital-2f0ce",
  storageBucket: "kartu-bicara-digital-2f0ce.firebasestorage.app",
  messagingSenderId: "314652631775",
  appId: "1:314652631775:web:571700af43272963807f6a",
  measurementId: "G-P8MRBLY589",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

async function seedAllToFirebase() {
  console.log("🚀 Menyinkronkan seluruh akun seed ke Firebase Auth...");

  const allAccounts: { name: string; email: string; role: string; className?: string }[] = [];

  // Pendidik
  allAccounts.push(
    { name: "Dra. Sri Wahyuni, M.Pd.", email: "sri.wahyuni@sekolah.sch.id", role: "TEACHER" },
    { name: "Guru Pendidik", email: "guru@gmail.com", role: "TEACHER" },
    { name: "Mutia Puspita Sari, S.Pd.", email: "mutiapuspitasari@gmail.com", role: "TEACHER" }
  );

  // Kelas X.E3
  STUDENTS_X_E3_NAMES.forEach((name) => {
    allAccounts.push({
      name,
      email: generateEmailFromName(name),
      role: "STUDENT",
      className: "Kelas X.E3",
    });
  });

  // Kelas X.E5
  STUDENTS_X_E5_NAMES.forEach((name) => {
    allAccounts.push({
      name,
      email: generateEmailFromName(name),
      role: "STUDENT",
      className: "Kelas X.E5",
    });
  });

  let successCount = 0;
  let alreadyExistsCount = 0;

  for (const acc of allAccounts) {
    try {
      // Coba sign in terlebih dahulu
      await signInWithEmailAndPassword(auth, acc.email, DEFAULT_SEED_PASSWORD);
      alreadyExistsCount++;
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === "auth/user-not-found" || code === "auth/invalid-credential") {
        try {
          const cred = await createUserWithEmailAndPassword(
            auth,
            acc.email,
            DEFAULT_SEED_PASSWORD
          );
          await updateProfile(cred.user, { displayName: acc.name });
          successCount++;
          console.log(`[+] Terdaftar di Firebase: ${acc.name} (${acc.email})`);
        } catch (createErr) {
          console.warn(`[!] Gagal mendaftar ${acc.email}:`, (createErr as Error).message);
        }
      } else {
        console.warn(`[?] Error sign in ${acc.email}:`, code);
      }
    }
  }

  console.log("=====================================================");
  console.log(`✨ SINKRONISASI SELESAI:`);
  console.log(`   - Akun baru dibuat di Firebase Auth: ${successCount}`);
  console.log(`   - Akun yang sudah ada sebelumnya:     ${alreadyExistsCount}`);
  console.log(`   - Total akun aktif di Firebase Auth:  ${successCount + alreadyExistsCount} dari ${allAccounts.length}`);
  console.log("=====================================================");
  process.exit(0);
}

seedAllToFirebase().catch((e) => {
  console.error("Error seeding to Firebase:", e);
  process.exit(1);
});

