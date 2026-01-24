import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE_PATH = path.join(process.cwd(), "data.json");

export async function POST(req: Request) {
    try {
        const { content } = await req.json();

        // Validate JSON again just in case
        JSON.parse(content);

        // Write to file
        fs.writeFileSync(DATA_FILE_PATH, content);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
