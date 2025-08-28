import express from "express";
import {
  addApplication,
  getApplications,
  updateStatus,
  deleteApplication,
} from "../controllers/applicationControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes protected → only recruiter can access
router.post("/", protect, addApplication);
router.get("/", protect, getApplications);
router.put("/:id/status", protect, updateStatus);
router.delete("/:id", protect, deleteApplication);

export default router;
