import { Router } from "express";
import {
  getClasses,
  getClassById,
  getClassByPin,
  createClass,
  updateClass,
  deleteClass,
  resetClass,
} from "../controllers/classController.js";
import {
  getStudents,
  addStudent,
  deleteStudent,
} from "../controllers/studentController.js";
import {
  getActiveSpeaker,
  startSpeaker,
  pauseSpeaker,
  resumeSpeaker,
  extendSpeaker,
  finishSpeaker,
} from "../controllers/speakerController.js";
import {
  getClassStats,
  getClassTokens,
} from "../controllers/statsController.js";
import { exportClassExcel } from "../controllers/exportController.js";

const router = Router();

// Classroom CRUD & Reset
router.get("/", getClasses);
router.post("/", createClass);
router.get("/pin/:pin", getClassByPin);
router.get("/:id", getClassById);
router.put("/:id", updateClass);
router.delete("/:id", deleteClass);
router.post("/:id/reset", resetClass);

// Student CRUD
router.get("/:classId/students", getStudents);
router.post("/:classId/students", addStudent);
router.delete("/:classId/students/:studentId", deleteStudent);

// Active Speaker & Discussion Engine
router.get("/:classId/speaker", getActiveSpeaker);
router.post("/:classId/speaker/start", startSpeaker);
router.post("/:classId/speaker/pause", pauseSpeaker);
router.post("/:classId/speaker/resume", resumeSpeaker);
router.post("/:classId/speaker/extend", extendSpeaker);
router.post("/:classId/speaker/finish", finishSpeaker);

// Stats & Token History
router.get("/:classId/stats", getClassStats);
router.get("/:classId/tokens", getClassTokens);

// Excel Export
router.get("/:classId/export/excel", exportClassExcel);

export default router;

