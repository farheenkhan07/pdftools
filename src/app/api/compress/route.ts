import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export const runtime = "nodejs";
export const maxDuration = 60;

// pdf-lib compress: re-save with compression (removes redundant data)
// For heavy compression we strip metadata and use object streams
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

    // Remove metadata to reduce size
    pdf.setTitle("");
    pdf.setAuthor("");
    pdf.setSubject("");
    pdf.setKeywords([]);
    pdf.setProducer("");
    pdf.setCreator("");

    const bytes = await pdf.save({
      useObjectStreams: true,
      addDefaultPage: false,
      objectsPerTick: 50,
    });

    return new NextResponse(Buffer.from(bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="compressed.pdf"',
        "X-Original-Size": String(arrayBuffer.byteLength),
        "X-Compressed-Size": String(bytes.byteLength),
      },
    });
  } catch (err) {
    console.error("[compress]", err);
    return NextResponse.json({ error: "Failed to compress PDF." }, { status: 500 });
  }
}
