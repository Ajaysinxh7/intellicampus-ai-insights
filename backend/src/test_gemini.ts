import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

console.log("Testing Gemini API connection...");

async function test() {
    try {
        const key = process.env.GEMINI_API_KEY;
        if (!key) {
            throw new Error("GEMINI_API_KEY not found");
        }

        const genAI = new GoogleGenerativeAI(key);
        // Try gemini-1.5-flash
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log("Sending request to gemini-1.5-flash...");
        const result = await model.generateContent("Hello");
        const response = await result.response;
        const text = response.text();

        console.log("Success! Response:", text);
    } catch (e: any) {
        console.error("❌ Error:", e.message);
        if (e.response) {
            console.error("Response details:", JSON.stringify(e.response, null, 2));
        }
    }
}

test();
