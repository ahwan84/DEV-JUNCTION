import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

const DATA_FILE_PATH = path.join(process.cwd(), "ngo_data.json");

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        // 1. Load Data
        let dataContext = "";
        if (fs.existsSync(DATA_FILE_PATH)) {
            dataContext = fs.readFileSync(DATA_FILE_PATH, "utf-8");
        } else {
            // Fallback to data.json if ngo_data.json doesn't exist
            const fallbackPath = path.join(process.cwd(), "data.json");
            if (fs.existsSync(fallbackPath)) {
                dataContext = fs.readFileSync(fallbackPath, "utf-8");
            }
        }

        // 2. Initialize Gemini
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { response: "Error: API Key not configured." },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // 3. Construct Prompt
        const prompt = `
      You are a helpful and transparent AI assistant for an NGO called 'HopeConnect'.
      Your goal is to answer user questions based STRICTLY on the provided data.
      
      Here is the NGO's latest data (contributors, funds, impact):
      ${dataContext}

      User Question: "${message}"

      Guidelines:
      - Be polite, professional, and transparent.
      - If the answer is in the data, provide it clearly.
      - If the answer is NOT in the data, say "I don't have that information in my current records."
      - Do not make up facts.
      - Format numbers nicely (e.g., $15,000).
      - **ALWAYS use Markdown formatting** to make the response look good.
      - Use **bold** for key figures and names.
      - Use **tables** when listing multiple items (like contributors or expenses).
      - Use headers (###) to organize the response.
    `;

        // 4. Generate Response
        const result = await model.generateContent(prompt);
        const response = result.response.text();

        return NextResponse.json({ response });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
