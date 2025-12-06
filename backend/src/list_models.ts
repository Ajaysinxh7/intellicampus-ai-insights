import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

console.log("Listing models...");

async function list() {
    try {
        const key = process.env.GEMINI_API_KEY;
        if (!key) throw new Error("No key");

        // We need to use the API directly or find the list method.
        // The SDK doesn't expose listModels on the main class easily in all versions.
        // Let's try to just use a fetch call to the API to list models.

        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("Available models:");
            data.models.forEach((m: any) => console.log(m.name));
        } else {
            console.log("No models found or error:", JSON.stringify(data, null, 2));
        }

    } catch (e: any) {
        console.error("Error:", e.message);
    }
}

list();
