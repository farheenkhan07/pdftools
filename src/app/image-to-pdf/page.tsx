"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileUpload from "@/components/FileUpload";
import ProcessButton from "@/components/ProcessButton";
import ResultPanel from "@/components/ResultPanel";

export default function ImageToPdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ url: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));

      const res = await fetch("/api/image-to-pdf", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setResult({ url, name: "images.pdf" });
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

  return (
    <ToolPageLayout
      title="Image → PDF"
      description="Convert JPG, PNG, or WebP images into a PDF. Multiple images become multiple pages."
      icon={<ImagePlus className="w-8 h-8 text-orange-600" />}
      iconBg="bg-orange-50"
    >
      {result ? (
        <ResultPanel
          downloadUrl={result.url}
          fileName={result.name}
          onReset={reset}
          message={`${files.length} image${files.length > 1 ? "s" : ""} converted to PDF successfully.`}
        />
      ) : (
        <>
          <FileUpload
            accept={{
              "image/jpeg": [".jpg", ".jpeg"],
              "image/png": [".png"],
              "image/webp": [".webp"],
            }}
            multiple
            maxFiles={30}
            onFilesChange={setFiles}
            files={files}
            label="Drop images here"
            sublabel="JPG, PNG, WebP supported. Each image becomes a page."
          />

          {files.length > 0 && (
            <div className="bg-orange-50 rounded-xl px-4 py-3 text-sm text-orange-700">
              {files.length} image{files.length > 1 ? "s" : ""} selected — each will become a separate page.
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
            label={`Convert to PDF`}
            loadingLabel="Converting…"
            trackEvent="image_to_pdf"
          />
        </>
      )}
    </ToolPageLayout>
  );
}
