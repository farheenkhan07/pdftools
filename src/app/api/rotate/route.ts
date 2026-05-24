import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, degrees } from "pdf-lib";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const rotationDeg = Number(formData.get("degrees") || 90);
    const pageMode = formData.get("pageMode") as string; // "all" | "range"
    const rangeStr = formData.get("range") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const totalPages = pdf.getPageCount();

    let targetIndices: number[] = [];
    if (pageMode === "all") {
      targetIndices = pdf.getPageIndices();
    } else {
      const parts = rangeStr?.split(",").map((s) => s.trim()) || [];
      for (const part of parts) {
        if (part.includes("-")) {
          const [start, end] = part.split("-").map(Number);
          for (let i = start; i <= end; i++) {
            if (i >= 1 && i <= totalPages) targetIndices.push(i - 1);
          }
        } else {
          const n = Number(part);
          if (n >= 1 && n <= totalPages) targetIndices.push(n - 1);
        }
      }
    }

    for (const idx of targetIndices) {
      const page = pdf.getPage(idx);
      const currentAngle = page.getRotation().angle;
      page.setRotation(degrees((currentAngle + rotationDeg) % 360));
    }

    const bytes = await pdf.save();
    return new NextResponse(Buffer.from(bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="rotated.pdf"',
      },
    });
  } catch (err) {
    console.error("[rotate]", err);
    return NextResponse.json({ error: "Failed to rotate PDF." }, { status: 500 });
  }
}
