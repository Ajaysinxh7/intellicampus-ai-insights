import { Router, Request, Response } from "express";
import User from "../models/User";
import { verifyAccessToken } from "../middleware/auth";
import { requireTeacherOrAdmin } from "../middleware/checkRole";

const router = Router();

// Get current user profile
router.get("/profile", verifyAccessToken, async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

import ProfileRequest from "../models/ProfileRequest";

// Submit a profile change request
router.post("/profile-request", verifyAccessToken, async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.userId;
    const { enrollmentNumber, branch, collegeName } = req.body;

    // Check for existing pending request
    const existingRequest = await ProfileRequest.findOne({ userId, status: "pending" });
    if (existingRequest) {
      return res.status(400).json({ message: "You already have a pending request." });
    }

    const newRequest = new ProfileRequest({
      userId,
      requestedChanges: {
        enrollmentNumber,
        branch,
        collegeName
      }
    });

    await newRequest.save();

    return res.status(201).json({
      message: "Profile change request submitted successfully",
      request: newRequest
    });
  } catch (error) {
    console.error("Error submitting profile request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Check status of profile request
router.get("/profile-request/status", verifyAccessToken, async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.user.userId;
    const request = await ProfileRequest.findOne({ userId, status: "pending" });

    if (!request) {
      return res.json({ hasPendingRequest: false });
    }

    return res.json({
      hasPendingRequest: true,
      request
    });
  } catch (error) {
    console.error("Error fetching request status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

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


