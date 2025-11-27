import { Router, Request, Response } from "express";
import User from "../models/User";
import { verifyAccessToken } from "../middleware/auth";
import { requireTeacherOrAdmin } from "../middleware/checkRole";

const router = Router();

// Get all students (only accessible to teachers and admins)
router.get(
  "/students",
  verifyAccessToken,
  requireTeacherOrAdmin,
  async (req: Request, res: Response) => {
    try {
      const students = await User.find({ role: "student" }).select(
        "email _id role"
      );

      const studentsList = students.map((student) => ({
        id: student._id.toString(),
        email: student.email,
        name: student.email.split("@")[0], // Use email prefix as name
      }));

      return res.json(studentsList);
    } catch (error) {
      console.error("Error fetching students:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;

