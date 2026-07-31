import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and add timestamp to avoid collisions
    const safeFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
    const uniqueFilename = `${Date.now()}-${safeFilename}`;
    
    // Ensure the uploads directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Ignore if exists
    }

    const filepath = path.join(uploadDir, uniqueFilename);
    await writeFile(filepath, buffer);

    return NextResponse.json({ url: `/uploads/${uniqueFilename}` }, { status: 201 });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
