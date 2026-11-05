import { Request, Response, NextFunction } from "express";
import { memoryStore } from "../data/memoryStore.js";
import { Role } from "../types/session.js";

/**
 * POST /api/auth/login
 * Masuk menggunakan email (atau nama) dan kata sandi
 */
export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email dan kata sandi wajib diisi.",
      });
      return;
    }

    const authResult = memoryStore.authenticateUser(
      email,
      password,
      role as Role | undefined
    );

    if (!authResult.success || !authResult.user) {
      res.status(401).json({
        success: false,
        message: authResult.message || "Autentikasi gagal.",
      });
      return;
    }

    // Buat token sesi sederhana
    const token = `kbd_session_${authResult.user.id}_${Date.now()}`;

    res.status(200).json({
      success: true,
      message: `Selamat datang kembali, ${authResult.user.name}!`,
      token,
      user: authResult.user,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/register
 * Pendaftaran pengguna baru
 */
export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, email, password, role, className, school } = req.body;

    if (!email || !password || !role) {
      res.status(400).json({
        success: false,
        message: "Email, kata sandi, dan peran (role) wajib diisi.",
      });
      return;
    }

    const displayName =
      name ||
      email
        .split("@")[0]
        .replace(/[._]/g, " ")
        .replace(/\b\w/g, (c: string) => c.toUpperCase());

    const user = memoryStore.registerUser({
      name: displayName,
      email,
      password,
      role,
      className,
      school,
    });

    const token = `kbd_session_${user.id}_${Date.now()}`;

    res.status(201).json({
      success: true,
      message: "Pendaftaran berhasil!",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/auth/me
 * Mengambil profil pengguna yang sedang login berdasarkan user ID di header/param
 */
export async function getMe(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = (req.headers["x-user-id"] as string) || (req.query.userId as string);
    if (!userId) {
      // Default ke profil pendidik
      const profile = memoryStore.getEducatorProfile();
      res.status(200).json({ success: true, user: profile });
      return;
    }

    const user = memoryStore.getUserById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: "Pengguna tidak ditemukan." });
      return;
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/auth/users
 * Mendapatkan seluruh daftar akun (tanpa password)
 */
export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const role = req.query.role as Role | undefined;
    let users = memoryStore.getAllUsers();
    if (role) {
      users = users.filter((u) => u.role === role);
    }
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/auth/seed-users
 * Mendapatkan ringkasan akun seed untuk kemudahan pengujian dan dokumentasi
 */
export async function getSeedUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const allUsers = memoryStore.getAllUsers();

    const teachers = allUsers.filter((u) => u.role === "TEACHER");
    const classXE3 = allUsers.filter(
      (u) => u.role === "STUDENT" && u.className === "Kelas X.E3"
    );
    const classXE5 = allUsers.filter(
      (u) => u.role === "STUDENT" && u.className === "Kelas X.E5"
    );

    res.status(200).json({
      success: true,
      defaultPassword: "password123",
      counts: {
        teachers: teachers.length,
        classXE3: classXE3.length,
        classXE5: classXE5.length,
        total: allUsers.length,
      },
      groups: {
        teachers,
        classXE3,
        classXE5,
      },
    });
  } catch (error) {
    next(error);
  }
}

