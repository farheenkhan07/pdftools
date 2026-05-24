"use client";

import { useState } from "react";
import { Minimize2 } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileUpload from "@/components/FileUpload";
import ProcessButton from "@/components/ProcessButton";
import ResultPanel from "@/components/ResultPanel";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function CompressPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    url: string;
    name: string;
    originalSize: number;
    compressedSize: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompress = async () => {
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", files[0]);

      const res = await fetch("/api/compress", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
        return;
      }

      const originalSize = Number(res.headers.get("X-Original-Size") || files[0].size);
      const compressedSize = Number(res.headers.get("X-Compressed-Size") || 0);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setResult({ url, name: "compressed.pdf", originalSize, compressedSize: compressedSize || blob.size });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFiles([]);
    setResult(null);
    setError(null);
  };

  const savings = result
    ? Math.round(((result.originalSize - result.compressedSize) / result.originalSize) * 100)
    : 0;

  return (
    <ToolPageLayout
      title="Compress PDF"
      description="Reduce your PDF file size while preserving quality. Great for email attachments."
      icon={<Minimize2 className="w-8 h-8 text-green-600" />}
      iconBg="bg-green-50"
    >
      {result ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-xs text-slate-500 mb-1">Original</div>
              <div className="font-bold text-slate-800">{formatBytes(result.originalSize)}</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-xs text-green-600 mb-1">Saved</div>
              <div className="font-bold text-green-700">{savings > 0 ? `${savings}%` : "—"}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-xs text-slate-500 mb-1">Compressed</div>
              <div className="font-bold text-slate-800">{formatBytes(result.compressedSize)}</div>
            </div>
          </div>
          <ResultPanel
            downloadUrl={result.url}
            fileName={result.name}
            onReset={reset}
            message={
              savings > 0
                ? `Saved ${savings}% of the original file size!`
                : "File processed. This PDF was already well-optimized."
            }
          />
        </div>
      ) : (
        <>
          <FileUpload
            accept={{ "application/pdf": [".pdf"] }}
            onFilesChange={setFiles}
            files={files}
            label="Drop your PDF here"
            sublabel="Upload a PDF to compress (max 50 MB)"
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <ProcessButton
            onClick={handleCompress}
            loading={loading}
            disabled={files.length === 0}
            label="Compress PDF"
            loadingLabel="Compressing…"
          />
        </>
      )}
    </ToolPageLayout>
  );
}
