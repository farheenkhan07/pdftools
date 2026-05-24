"use client";

import { useState, useRef, useCallback } from "react";
import { Image, Download, Loader2 } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileUpload from "@/components/FileUpload";
import ProcessButton from "@/components/ProcessButton";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pdfjsLib: any;
  }
}

function loadPdfJs(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) { resolve(); return; }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function PdfToImagePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleConvert = useCallback(async () => {
    setError(null);
    setImages([]);
    setLoading(true);
    setProgress(0);
    try {
      await loadPdfJs();

      const arrayBuffer = await files[0].arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const total = pdf.numPages;
      const rendered: string[] = [];

      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport }).promise;
        rendered.push(canvas.toDataURL("image/jpeg", 0.92));
        setProgress(Math.round((i / total) * 100));
      }

      setImages(rendered);
    } catch {
      setError("Failed to convert PDF. Please try another file.");
    } finally {
      setLoading(false);
    }
  }, [files]);

  const reset = () => {
    setFiles([]);
    setImages([]);
    setError(null);
    setProgress(0);
  };

  const downloadImage = (dataUrl: string, index: number) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `page-${index + 1}.jpg`;
    a.click();
  };

  const downloadAll = () => {
    images.forEach((img, i) => {
      setTimeout(() => downloadImage(img, i), i * 200);
    });
  };

  return (
    <ToolPageLayout
      title="PDF → Image"
      description="Convert each page of your PDF into a high-quality JPG image."
      icon={<Image className="w-8 h-8 text-pink-600" />}
      iconBg="bg-pink-50"
    >
      {images.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">
              {images.length} page{images.length > 1 ? "s" : ""} converted
            </p>
            <button
              onClick={downloadAll}
              className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              <Download className="w-4 h-4" />
              Download All
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((img, i) => (
              <div key={i} className="group relative rounded-xl overflow-hidden border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`Page ${i + 1}`} className="w-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => downloadImage(img, i)}
                    className="bg-white text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Page {i + 1}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={reset}
            className="w-full text-sm text-slate-500 hover:text-slate-700 py-2 transition-colors"
          >
            Convert another PDF
          </button>
        </div>
      ) : (
        <>
          <FileUpload
            accept={{ "application/pdf": [".pdf"] }}
            onFilesChange={setFiles}
            files={files}
            label="Drop your PDF here"
            sublabel="Upload a PDF to convert to images (max 50 MB)"
          />

          {loading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Converting pages…
                </span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-pink-500 h-2 rounded-full progress-bar"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <ProcessButton
            onClick={handleConvert}
            loading={loading}
            disabled={files.length === 0}
            label="Convert to Images"
            loadingLabel="Converting…"
          />
        </>
      )}
    </ToolPageLayout>
  );
}
