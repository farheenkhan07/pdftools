"use client";

import { useState } from "react";
import { RotateCw } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileUpload from "@/components/FileUpload";
import ProcessButton from "@/components/ProcessButton";
import ResultPanel from "@/components/ResultPanel";

const ROTATION_OPTIONS = [
  { degrees: 90, label: "90° Clockwise" },
  { degrees: 180, label: "180°" },
  { degrees: 270, label: "90° Counter-clockwise" },
];

export default function RotatePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [degrees, setDegrees] = useState(90);
  const [pageMode, setPageMode] = useState<"all" | "range">("all");
  const [range, setRange] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ url: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRotate = async () => {
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("degrees", String(degrees));
      formData.append("pageMode", pageMode);
      if (pageMode === "range") formData.append("range", range);

      const res = await fetch("/api/rotate", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setResult({ url, name: "rotated.pdf" });
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

  const canProcess = files.length > 0 && (pageMode === "all" || range.trim() !== "");

  return (
    <ToolPageLayout
      title="Rotate PDF"
      description="Rotate pages in your PDF by 90°, 180°, or 270°. Apply to all or specific pages."
      icon={<RotateCw className="w-8 h-8 text-cyan-600" />}
      iconBg="bg-cyan-50"
    >
      {result ? (
        <ResultPanel
          downloadUrl={result.url}
          fileName={result.name}
          onReset={reset}
          message="Your PDF pages have been rotated."
        />
      ) : (
        <>
          <FileUpload
            accept={{ "application/pdf": [".pdf"] }}
            onFilesChange={setFiles}
            files={files}
            label="Drop your PDF here"
            sublabel="Upload a PDF to rotate (max 50 MB)"
          />

          {files.length > 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Rotation angle
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {ROTATION_OPTIONS.map((opt) => (
                    <button
                      key={opt.degrees}
                      onClick={() => setDegrees(opt.degrees)}
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition-all flex flex-col items-center gap-2 ${
                        degrees === opt.degrees
                          ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                          : "border-slate-200 text-slate-600 hover:border-cyan-300"
                      }`}
                    >
                      <RotateCw
                        className="w-5 h-5"
                        style={{
                          transform: `rotate(${
                            opt.degrees === 90 ? 0 : opt.degrees === 180 ? 90 : 180
                          }deg)`,
                        }}
                      />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Which pages?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPageMode("all")}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      pageMode === "all"
                        ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                        : "border-slate-200 text-slate-600 hover:border-cyan-300"
                    }`}
                  >
                    All Pages
                  </button>
                  <button
                    onClick={() => setPageMode("range")}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      pageMode === "range"
                        ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                        : "border-slate-200 text-slate-600 hover:border-cyan-300"
                    }`}
                  >
                    Specific Pages
                  </button>
                </div>
              </div>

              {pageMode === "range" && (
                <div>
                  <input
                    type="text"
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    placeholder="e.g. 1-3, 5, 7-9"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Separate pages/ranges with commas. Pages are 1-indexed.
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
            onClick={handleRotate}
            loading={loading}
            disabled={!canProcess}
            label="Rotate PDF"
            loadingLabel="Rotating…"
          />
        </>
      )}
    </ToolPageLayout>
  );
}
