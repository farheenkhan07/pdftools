"use client";

import { useState } from "react";
import { Scissors } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileUpload from "@/components/FileUpload";
import ProcessButton from "@/components/ProcessButton";
import ResultPanel from "@/components/ResultPanel";

export default function SplitPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<"all" | "range">("all");
  const [range, setRange] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ url: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSplit = async () => {
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("mode", mode);
      if (mode === "range") formData.append("range", range);

      const res = await fetch("/api/split", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setResult({ url, name: "split.pdf" });
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
    setRange("");
  };

  const canProcess = files.length > 0 && (mode === "all" || range.trim() !== "");

  return (
    <ToolPageLayout
      title="Split PDF"
      description="Extract specific pages from a PDF or save all pages separately."
      icon={<Scissors className="w-8 h-8 text-violet-600" />}
      iconBg="bg-violet-50"
    >
      {result ? (
        <ResultPanel
          downloadUrl={result.url}
          fileName={result.name}
          onReset={reset}
          message="Your PDF has been split successfully."
        />
      ) : (
        <>
          <FileUpload
            accept={{ "application/pdf": [".pdf"] }}
            onFilesChange={setFiles}
            files={files}
            label="Drop your PDF here"
            sublabel="Upload a PDF to split (max 50 MB)"
          />

          {files.length > 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Split mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMode("all")}
                    className={`p-4 rounded-xl border-2 text-sm font-medium transition-all ${
                      mode === "all"
                        ? "border-violet-500 bg-violet-50 text-violet-700"
                        : "border-slate-200 text-slate-600 hover:border-violet-300"
                    }`}
                  >
                    <div className="font-bold mb-1">All Pages</div>
                    <div className="text-xs opacity-70">Extract all pages</div>
                  </button>
                  <button
                    onClick={() => setMode("range")}
                    className={`p-4 rounded-xl border-2 text-sm font-medium transition-all ${
                      mode === "range"
                        ? "border-violet-500 bg-violet-50 text-violet-700"
                        : "border-slate-200 text-slate-600 hover:border-violet-300"
                    }`}
                  >
                    <div className="font-bold mb-1">Page Range</div>
                    <div className="text-xs opacity-70">e.g. 1-3, 5, 7-9</div>
                  </button>
                </div>
              </div>

              {mode === "range" && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Page range
                  </label>
                  <input
                    type="text"
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    placeholder="e.g. 1-3, 5, 7-9"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Use commas to separate pages/ranges. Pages are 1-indexed.
                  </p>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <ProcessButton
            onClick={handleSplit}
            loading={loading}
            disabled={!canProcess}
            label="Split PDF"
            loadingLabel="Splitting…"
          />
        </>
      )}
    </ToolPageLayout>
  );
}
