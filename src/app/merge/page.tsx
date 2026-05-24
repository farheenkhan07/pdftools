"use client";

import { useState } from "react";
import { FilePlus2 } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileUpload from "@/components/FileUpload";
import ProcessButton from "@/components/ProcessButton";
import ResultPanel from "@/components/ResultPanel";

export default function MergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ url: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMerge = async () => {
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));

      const res = await fetch("/api/merge", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setResult({ url, name: "merged.pdf" });
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
      title="Merge PDF"
      description="Combine multiple PDF files into one. Files are merged in the order you upload them."
      icon={<FilePlus2 className="w-8 h-8 text-blue-600" />}
      iconBg="bg-blue-50"
    >
      {result ? (
        <ResultPanel
          downloadUrl={result.url}
          fileName={result.name}
          onReset={reset}
          message="Your PDFs have been merged successfully."
        />
      ) : (
        <>
          <FileUpload
            accept={{ "application/pdf": [".pdf"] }}
            multiple
            maxFiles={20}
            onFilesChange={setFiles}
            files={files}
            label="Drop PDF files here"
            sublabel="Upload 2 or more PDFs to merge (max 50 MB each)"
          />

          {files.length >= 2 && (
            <div className="bg-blue-50 rounded-xl px-4 py-3 text-sm text-blue-700">
              {files.length} files selected — they will be merged in order shown above.
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <ProcessButton
            onClick={handleMerge}
            loading={loading}
            disabled={files.length < 2}
            label={`Merge ${files.length > 0 ? files.length : ""} PDFs`}
            loadingLabel="Merging…"
            trackEvent="merge_pdf"
          />

          {files.length < 2 && files.length > 0 && (
            <p className="text-center text-sm text-slate-400">Add at least one more PDF to merge.</p>
          )}
        </>
      )}
    </ToolPageLayout>
  );
}
