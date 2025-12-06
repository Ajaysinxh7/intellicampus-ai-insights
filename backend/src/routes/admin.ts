import { Router, Request, Response } from "express";
import ProfileRequest from "../models/ProfileRequest";
import User from "../models/User";
import { verifyAccessToken } from "../middleware/auth";
import { requireTeacherOrAdmin } from "../middleware/checkRole";

const router = Router();

// Middleware to ensure only admins can access these routes
// For now reusing requireTeacherOrAdmin, but ideally should be admin only.
// Let's add specific check for 'admin' role inside the routes for extra security or create new middleware.
const requireAdmin = async (req: Request, res: Response, next: any) => {
    // @ts-ignore
    if ((req as any).userRole !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admin role required." });
    }
    next();
};

// Get all pending requests
router.get("/requests", verifyAccessToken, requireTeacherOrAdmin, requireAdmin, async (req: Request, res: Response) => {
    try {
        const requests = await ProfileRequest.find({ status: "pending" })
            .populate("userId", "email name role")
            .sort({ createdAt: -1 });

        return res.json(requests);
    } catch (error) {
        console.error("Error fetching requests:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Approve or Reject a request
router.put("/requests/:id", verifyAccessToken, requireTeacherOrAdmin, requireAdmin, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { action } = req.body; // "approve" | "reject"

        if (!["approve", "reject"].includes(action)) {
            return res.status(400).json({ message: "Invalid action" });
        }

        const request = await ProfileRequest.findById(id);
        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (request.status !== "pending") {
            return res.status(400).json({ message: "Request already processed" });
        }

        if (action === "reject") {
            request.status = "rejected";
            await request.save();
            return res.json({ message: "Request rejected" });
        }

        // Approve
        if (action === "approve") {
            const user = await User.findById(request.userId);
            if (!user) {
                return res.status(404).json({ message: "User associated with request not found" });
            }

            // Apply changes
            if (request.requestedChanges.enrollmentNumber) user.enrollmentNumber = request.requestedChanges.enrollmentNumber;
            if (request.requestedChanges.branch) user.branch = request.requestedChanges.branch;
            if (request.requestedChanges.collegeName) user.collegeName = request.requestedChanges.collegeName;

            await user.save();

            request.status = "approved";
            await request.save();

            return res.json({ message: "Request approved and profile updated" });
        }
    } catch (error) {
        console.error("Error processing request:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
