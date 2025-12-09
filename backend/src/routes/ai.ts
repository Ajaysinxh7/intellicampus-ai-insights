import { Router, Request, Response } from "express";
import multer from "multer";
import OpenAI from "openai";
import User from "../models/User";
import { verifyAccessToken } from "../middleware/auth";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Initialize OpenAI
// Ensure OPENAI_API_KEY is in .env
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function extractDataMock(buffer: Buffer, prompt: string): Promise<any> {
    // This is a placeholder if we didn't have OpenAI. 
    // But since we are implementing real logic:
    return null;
}

// Convert buffer to base64 for OpenAI
const bufferToBase64 = (buffer: Buffer) => {
    return buffer.toString("base64");
};

// Helper to find user by enrollment
const findUserByEnrollment = async (enrollmentNo: string) => {
    // Case insensitive search might be safer, but exact match for now as per requirement
    // strict enrollmentNo usually.
    return await User.findOne({ enrollmentNumber: enrollmentNo });
};

// POST /api/ai/attendance-from-image
router.post(
    "/attendance-from-image",
    verifyAccessToken,
    upload.single("image"),
    async (req: Request, res: Response) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "No image file provided" });
            }

            const { subject } = req.body;
            if (!subject) {
                return res.status(400).json({ message: "Subject is required" });
            }

            const base64Image = bufferToBase64(req.file.buffer);

            const prompt = `
        You are an OCR assistant. Analyze the image which contains a student attendance sheet.
        Extract a JSON array where each item has: 
        - enrollmentNo (string)
        - status ('present' or 'absent')
        
        The sheet is likely a table. If status is ambiguous or empty, mark as 'absent' or skip if unclear.
        Only return the raw JSON array. Do not include markdown formatting like \`\`\`json.
      `;

            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: prompt },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpeg;base64,${base64Image}`,
                                },
                            },
                        ],
                    },
                ],
                max_tokens: 1000,
            });

            const content = response.choices[0].message.content;
            console.log("AI Response (Attendance):", content);

            if (!content) {
                return res.status(500).json({ message: "Failed to get response from AI" });
            }

            // Clean the output if it has markdown block
            const cleanContent = content.replace(/```json/g, "").replace(/```/g, "").trim();

            let parsedData;
            try {
                parsedData = JSON.parse(cleanContent);
            } catch (e) {
                console.error("JSON Parse Error:", e);
                return res.status(500).json({ message: "Failed to parse AI output as JSON" });
            }

            if (!Array.isArray(parsedData)) {
                return res.status(500).json({ message: "AI output is not an array" });
            }

            // Map to users
            const results = await Promise.all(
                parsedData.map(async (item: any) => {
                    const user = await findUserByEnrollment(item.enrollmentNo);
                    return {
                        enrollmentNo: item.enrollmentNo,
                        userId: user ? user._id : null,
                        name: user ? user.name : "Unknown",
                        email: user ? user.email : null,
                        subject,
                        status: item.status?.toLowerCase() === "present" ? "present" : "absent"
                    };
                })
            );

            return res.json(results);

        } catch (error) {
            console.error("AI Attendance Error:", error);
            return res.status(500).json({ message: "Internal server error processing image" });
        }
    }
);

// POST /api/ai/marks-from-image
router.post(
    "/marks-from-image",
    verifyAccessToken,
    upload.single("image"),
    async (req: Request, res: Response) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "No image file provided" });
            }

            const { subject, totalMarks } = req.body;
            if (!subject) {
                return res.status(400).json({ message: "Subject is required" });
            }

            const base64Image = bufferToBase64(req.file.buffer);

            const prompt = `
          You are an OCR assistant. Analyze the image which contains a student marks sheet.
          Extract a JSON array where each item has: 
          - enrollmentNo (string)
          - marksObtained (number)
          
          The sheet is likely a table. 
          Only return the raw JSON array. Do not include markdown formatting like \`\`\`json.
        `;

            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: prompt },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/jpeg;base64,${base64Image}`,
                                },
                            },
                        ],
                    },
                ],
                max_tokens: 1000,
            });

            const content = response.choices[0].message.content;
            console.log("AI Response (Marks):", content);

            if (!content) {
                return res.status(500).json({ message: "Failed to get response from AI" });
            }

            // Clean the output if it has markdown block
            const cleanContent = content.replace(/```json/g, "").replace(/```/g, "").trim();

            let parsedData;
            try {
                parsedData = JSON.parse(cleanContent);
            } catch (e) {
                console.error("JSON Parse Error:", e);
                return res.status(500).json({ message: "Failed to parse AI output as JSON" });
            }

            if (!Array.isArray(parsedData)) {
                return res.status(500).json({ message: "AI output is not an array" });
            }

            // Map to users
            const results = await Promise.all(
                parsedData.map(async (item: any) => {
                    const user = await findUserByEnrollment(item.enrollmentNo);
                    return {
                        enrollmentNo: item.enrollmentNo,
                        userId: user ? user._id : null,
                        name: user ? user.name : "Unknown",
                        email: user ? user.email : null,
                        subject,
                        marksObtained: typeof item.marksObtained === 'number' ? item.marksObtained : parseFloat(item.marksObtained) || 0,
                        totalMarks: totalMarks ? parseFloat(totalMarks) : 100 // Default or from input
                    };
                })
            );

            return res.json(results);

        } catch (error) {
            console.error("AI Marks Error:", error);
            return res.status(500).json({ message: "Internal server error processing image" });
        }
    }
);

export default router;
