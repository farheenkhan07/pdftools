import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const mode = formData.get("mode") as string; // "all" | "range"
    const rangeStr = formData.get("range") as string; // e.g. "1-3,5,7-9"

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const srcPdf = await PDFDocument.load(arrayBuffer);
    const totalPages = srcPdf.getPageCount();

    let pageIndices: number[] = [];

    if (mode === "all") {
      // Return all pages as individual PDFs packed in a zip-like multipart,
      // but for simplicity we return one merged PDF with one page each zipped.
      // Easiest: return a single PDF per extracted range, here we do range by default.
      pageIndices = srcPdf.getPageIndices();
    } else {
      // Parse range string like "1-3,5,7-9" (1-indexed)
      const parts = rangeStr.split(",").map((s) => s.trim());
      for (const part of parts) {
        if (part.includes("-")) {
          const [start, end] = part.split("-").map(Number);
          for (let i = start; i <= end; i++) {
            if (i >= 1 && i <= totalPages) pageIndices.push(i - 1);
          }
        } else {
          const n = Number(part);
          if (n >= 1 && n <= totalPages) pageIndices.push(n - 1);
        }
      }
    }

    if (pageIndices.length === 0) {
      return NextResponse.json({ error: "No valid pages selected." }, { status: 400 });
    }

    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(srcPdf, pageIndices);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const bytes = await newPdf.save();
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="split.pdf"',
        "X-Total-Pages": String(totalPages),
      },
    });
  } catch (err) {
    console.error("[split]", err);
    return NextResponse.json({ error: "Failed to split PDF." }, { status: 500 });
  }
}
