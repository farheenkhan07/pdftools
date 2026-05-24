import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const signatureDataUrl = formData.get("signature") as string;
    const pageNum = Number(formData.get("page") || 1);
    const xPct = Number(formData.get("x") || 50);   // % from left
    const yPct = Number(formData.get("y") || 85);   // % from top
    const widthPct = Number(formData.get("width") || 30); // % of page width

    if (!file || !signatureDataUrl) {
      return NextResponse.json({ error: "PDF and signature are required." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const totalPages = pdf.getPageCount();

    const pageIndex = Math.min(Math.max(pageNum - 1, 0), totalPages - 1);
    const page = pdf.getPage(pageIndex);
    const { width: pageWidth, height: pageHeight } = page.getSize();

    // Decode base64 PNG from data URL
    const base64 = signatureDataUrl.replace(/^data:image\/png;base64,/, "");
    const sigBytes = Buffer.from(base64, "base64");
    const sigImage = await pdf.embedPng(sigBytes);

    const sigWidth = pageWidth * (widthPct / 100);
    const sigHeight = sigWidth * (sigImage.height / sigImage.width);
    const x = pageWidth * (xPct / 100) - sigWidth / 2;
    // PDF y-axis is from bottom; convert from top-percentage
    const y = pageHeight - pageHeight * (yPct / 100) - sigHeight / 2;

    page.drawImage(sigImage, {
      x: Math.max(0, x),
      y: Math.max(0, y),
      width: sigWidth,
      height: sigHeight,
    });

    const bytes = await pdf.save();
    return new NextResponse(Buffer.from(bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="signed.pdf"',
      },
    });
  } catch (err) {
    console.error("[sign]", err);
    return NextResponse.json({ error: "Failed to sign PDF." }, { status: 500 });
  }
}
