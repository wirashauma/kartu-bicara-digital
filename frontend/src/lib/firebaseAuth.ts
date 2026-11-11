import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { Role } from "@/types/session";
import {
  AuthUser,
  setStoredUser,
  clearStoredUser,
  getAllSeedUsers,
} from "./auth";
import {
  normalizeEmailQuery,
  generateEmailWithDotFromName,
  DEFAULT_SEED_PASSWORD,
} from "./seedData";

export interface FirebaseAuthResult {
  success: boolean;
  user?: AuthUser;
  firebaseUser?: FirebaseUser;
  message?: string;
  source?: "firebase" | "backend" | "seed";
}

/**
 * Mencari metadata akun seed berdasarkan input email atau nama
 */
function findSeedUserMetadata(query: string, targetRole: Role): AuthUser | null {
  const allSeedUsers = getAllSeedUsers();
  const trimmed = query.trim().toLowerCase();
  const normalizedQuery = normalizeEmailQuery(trimmed);

  return (
    allSeedUsers.find((u) => {
      if (u.role !== targetRole) return false;
      if (u.email.toLowerCase() === trimmed) return true;
      if (u.name.toLowerCase() === trimmed) return true;
      if (normalizeEmailQuery(u.email) === normalizedQuery) return true;
      const dotEmail = generateEmailWithDotFromName(u.name).toLowerCase();
      if (dotEmail === trimmed) return true;
      return false;
    }) || null
  );
}

/**
 * Sinkronisasi data profil pengguna ke Firestore Database
 */
async function syncToFirestoreDatabase(user: AuthUser, uid: string): Promise<void> {
  try {
    const userDocRef = doc(db, "users", uid);
    // Batas waktu 2000ms agar otentikasi login/register tetap secepat kilat meski Firestore belum diaktifkan di konsol
    await Promise.race([
      setDoc(
        userDocRef,
        {
          uid,
          name: user.name,
          email: user.email,
          role: user.role,
          className: user.className || null,
          deskNumber: user.deskNumber || null,
          school: user.school || "SMAN 1 Teladan",
          subject: user.subject || null,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      ),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firestore sync timeout/inactive")), 2000)
      ),
    ]);
  } catch (firestoreError: unknown) {
    // Jika Firestore API belum diaktifkan di konsol Firebase atau network timeout,
    // jangan gagalkan proses login/register pengguna.
    console.warn("Info Firestore: Database sync ditangani secara graceful.", firestoreError);
  }
}

/**
 * Otentikasi Masuk (Login) Terintegrasi Penuh dengan Firebase SDK
 */
export async function loginWithFirebase(
  emailOrName: string,
  passwordAttempt: string,
  targetRole: Role
): Promise<FirebaseAuthResult> {
  const trimmed = emailOrName.trim();
  if (!trimmed || !passwordAttempt) {
    return { success: false, message: "Email dan kata sandi wajib diisi." };
  }

  // 1. Periksa apakah pengguna merupakan salah satu akun seed resmi
  const seedMeta = findSeedUserMetadata(trimmed, targetRole);
  const targetEmail = seedMeta ? seedMeta.email : trimmed;

  try {
    let firebaseUser: FirebaseUser | null = null;

    // Coba sign in langsung dengan Firebase Auth
    try {
      const cred = await signInWithEmailAndPassword(auth, targetEmail, passwordAttempt);
      firebaseUser = cred.user;
    } catch (signInErr: unknown) {
      const errCode = (signInErr as { code?: string })?.code;

      // Jika akun terdaftar di seed namun belum ada di Firebase Auth, lakukan auto-provisioning
      if (
        (errCode === "auth/user-not-found" || errCode === "auth/invalid-credential") &&
        seedMeta &&
        passwordAttempt === DEFAULT_SEED_PASSWORD
      ) {
        try {
          const createCred = await createUserWithEmailAndPassword(
            auth,
            targetEmail,
            DEFAULT_SEED_PASSWORD
          );
          firebaseUser = createCred.user;
          await updateProfile(firebaseUser, { displayName: seedMeta.name });
        } catch {
          // Jika gagal create (misal password berbeda), biarkan throw ke handler bawah
          throw signInErr;
        }
      } else {
        throw signInErr;
      }
    }

    if (!firebaseUser) {
      return { success: false, message: "Gagal memproses otentikasi Firebase." };
    }

    // Bangun objek AuthUser
    const authUser: AuthUser = {
      id: seedMeta?.id || firebaseUser.uid,
      name: seedMeta?.name || firebaseUser.displayName || targetEmail.split("@")[0],
      email: firebaseUser.email || targetEmail,
      role: targetRole,
      className: seedMeta?.className || (targetRole === "STUDENT" ? "Kelas X.E3" : undefined),
      deskNumber: seedMeta?.deskNumber,
      school: seedMeta?.school || "SMAN 1 Teladan",
      subject: seedMeta?.subject,
    };

    // Sinkronisasi data ke Firestore Database
    await syncToFirestoreDatabase(authUser, firebaseUser.uid);

    // Simpan ke sesi lokal
    setStoredUser(authUser);

    return {
      success: true,
      user: authUser,
      firebaseUser,
      source: "firebase",
    };
  } catch (error: unknown) {
    const errCode = (error as { code?: string })?.code;

    if (errCode === "auth/wrong-password" || errCode === "auth/invalid-credential") {
      return {
        success: false,
        message: "Kata sandi salah. Silakan periksa kembali kata sandi Anda.",
      };
    }

    if (errCode === "auth/user-not-found") {
      return {
        success: false,
        message: "Akun dengan email tersebut belum terdaftar di Firebase.",
      };
    }

    if (errCode === "auth/invalid-email") {
      return {
        success: false,
        message: "Format email tidak valid. Pastikan menggunakan format @gmail.com",
      };
    }

    if (errCode === "auth/network-request-failed") {
      // Fallback offline menggunakan seed data jika offline
      if (seedMeta && passwordAttempt === DEFAULT_SEED_PASSWORD) {
        setStoredUser(seedMeta);
        return {
          success: true,
          user: seedMeta,
          source: "seed",
        };
      }
      return {
        success: false,
        message: "Jaringan bermasalah saat menghubungi server Firebase.",
      };
    }

    // Fallback toleransi untuk akun seed jika ada kendala Firebase
    if (seedMeta && passwordAttempt === DEFAULT_SEED_PASSWORD) {
      setStoredUser(seedMeta);
      return {
        success: true,
        user: seedMeta,
        source: "seed",
      };
    }

    return {
      success: false,
      message: (error as { message?: string })?.message || "Gagal masuk ke sistem.",
    };
  }
}

/**
 * Pendaftaran (Register) Akun Baru Terintegrasi Penuh dengan Firebase SDK & Firestore
 */
export async function registerWithFirebase(params: {
  email: string;
  password: string;
  role: Role;
  name?: string;
  className?: string;
  school?: string;
}): Promise<FirebaseAuthResult> {
  const { email, password, role, name, className, school } = params;

  if (!email || !password) {
    return { success: false, message: "Email dan kata sandi wajib diisi." };
  }

  if (password.length < 6) {
    return { success: false, message: "Kata sandi minimal 6 karakter." };
  }

  try {
    // 1. Buat akun di Firebase Auth
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const firebaseUser = cred.user;

    const displayName =
      name ||
      email
        .split("@")[0]
        .replace(/[._]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

    // 2. Perbarui profil di Firebase Auth
    await updateProfile(firebaseUser, { displayName });

    const newUser: AuthUser = {
      id: firebaseUser.uid,
      name: displayName,
      email: firebaseUser.email || email.trim(),
      role,
      className: role === "STUDENT" ? className || "Kelas X.E3" : undefined,
      school: school || "SMAN 1 Teladan",
    };

    // 3. Simpan ke Firestore Database
    await syncToFirestoreDatabase(newUser, firebaseUser.uid);

    // 4. Sinkronkan juga ke Express Backend
    try {
      await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newUser.email,
          password,
          role: newUser.role,
          name: newUser.name,
          className: newUser.className,
          school: newUser.school,
        }),
      });
    } catch {
      // Backend offline notice (optional)
    }

    // 5. Simpan sesi aktif
    setStoredUser(newUser);

    return {
      success: true,
      user: newUser,
      firebaseUser,
      source: "firebase",
    };
  } catch (error: unknown) {
    const errCode = (error as { code?: string })?.code;

    if (errCode === "auth/email-already-in-use") {
      return {
        success: false,
        message: "Email ini sudah terdaftar. Silakan langsung masuk di halaman login.",
      };
    }

    if (errCode === "auth/invalid-email") {
      return {
        success: false,
        message: "Alamat email tidak valid.",
      };
    }

    if (errCode === "auth/weak-password") {
      return {
        success: false,
        message: "Kata sandi terlalu lemah. Minimal 6 karakter.",
      };
    }

    return {
      success: false,
      message: (error as { message?: string })?.message || "Gagal mendaftarkan akun di Firebase.",
    };
  }
}

/**
 * Logout dari Firebase
 */
export async function logoutWithFirebase(): Promise<void> {
  try {
    await signOut(auth);
  } catch (e) {
    console.error("Gagal signOut dari Firebase:", e);
  } finally {
    clearStoredUser();
  }
}

/**
 * Kirim email reset kata sandi melalui Firebase Auth
 */
export async function sendPasswordReset(email: string): Promise<{ success: boolean; message?: string }> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      message: (error as { message?: string })?.message || "Gagal mengirim tautan reset kata sandi.",
    };
  }
}

