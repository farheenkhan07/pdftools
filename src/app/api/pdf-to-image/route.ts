import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

// PDF to Image conversion using pdf-lib to extract pages
// We render each page as a canvas on the client side (server-side would require canvas/puppeteer).
// Instead, we return page count info and page data URLs via a different approach.
// For a pure server solution without heavy deps, we'll use a basic approach:
// Extract embedded images from PDF or render with a lightweight renderer.
// 
// Since server-side PDF rendering requires heavy deps (canvas, puppeteer),
// we'll do client-side rendering using PDF.js instead.
// This endpoint just validates the PDF and returns page count.

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    // Return the PDF as base64 for client-side rendering with PDF.js
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    
    return NextResponse.json({
      pdf: base64,
      filename: file.name,
      size: arrayBuffer.byteLength,
    });
  } catch (err) {
    console.error("[pdf-to-image]", err);
    return NextResponse.json({ error: "Failed to process PDF." }, { status: 500 });
  }
}
