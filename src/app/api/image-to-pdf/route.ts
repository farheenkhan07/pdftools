import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No images provided." }, { status: 400 });
    }

    const pdf = await PDFDocument.create();

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);
      const mimeType = file.type;

      let image;
      if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
        image = await pdf.embedJpg(uint8);
      } else if (mimeType === "image/png") {
        image = await pdf.embedPng(uint8);
      } else {
        // Try treating as PNG
        try {
          image = await pdf.embedPng(uint8);
        } catch {
          image = await pdf.embedJpg(uint8);
        }
      }

      const page = pdf.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
    }

    const bytes = await pdf.save();
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="images.pdf"',
      },
    });
  } catch (err) {
    console.error("[image-to-pdf]", err);
    return NextResponse.json({ error: "Failed to convert images to PDF." }, { status: 500 });
  }
}
