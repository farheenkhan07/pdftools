"use client";

import { useState } from "react";
import { PenLine } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileUpload from "@/components/FileUpload";
import SignaturePad from "@/components/SignaturePad";
import ProcessButton from "@/components/ProcessButton";
import ResultPanel from "@/components/ResultPanel";

export default function SignPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [signature, setSignature] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [position, setPosition] = useState({ x: 50, y: 85 });
  const [sigSize, setSigSize] = useState(30);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ url: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const POSITIONS = [
    { label: "Bottom Left",   x: 20, y: 88 },
    { label: "Bottom Center", x: 50, y: 88 },
    { label: "Bottom Right",  x: 80, y: 88 },
    { label: "Top Left",      x: 20, y: 10 },
    { label: "Top Right",     x: 80, y: 10 },
    { label: "Custom",        x: -1, y: -1 },
  ];

  const [selectedPos, setSelectedPos] = useState(1); // Bottom Center

  const handlePositionSelect = (idx: number) => {
    setSelectedPos(idx);
    if (POSITIONS[idx].x !== -1) {
      setPosition({ x: POSITIONS[idx].x, y: POSITIONS[idx].y });
    }
  };

  const handleSign = async () => {
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("signature", signature!);
      formData.append("page", String(page));
      formData.append("x", String(position.x));
      formData.append("y", String(position.y));
      formData.append("width", String(sigSize));

      const res = await fetch("/api/sign", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
        return;
      }

      const blob = await res.blob();
      setResult({ url: URL.createObjectURL(blob), name: "signed.pdf" });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFiles([]);
    setSignature(null);
    setResult(null);
    setError(null);
    setPage(1);
  };

  const canSign = files.length > 0 && !!signature;

  return (
    <ToolPageLayout
      title="Sign PDF"
      description="Draw or type your signature and place it anywhere on your PDF."
      icon={<PenLine className="w-8 h-8 text-rose-600" />}
      iconBg="bg-rose-50"
    >
      {result ? (
        <ResultPanel
          downloadUrl={result.url}
          fileName={result.name}
          onReset={reset}
          message="Your PDF has been signed successfully."
        />
      ) : (
        <>
          {/* Step 1 */}
          <div>
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">
              Step 1 — Upload your PDF
            </h2>
            <FileUpload
              accept={{ "application/pdf": [".pdf"] }}
              onFilesChange={setFiles}
              files={files}
              label="Drop your PDF here"
              sublabel="Upload the PDF you want to sign (max 50 MB)"
            />
          </div>

          {/* Step 2 */}
          <div>
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">
              Step 2 — Create your signature
            </h2>
            <SignaturePad onChange={setSignature} />
          </div>

          {/* Step 3 — only show if PDF is uploaded */}
          {files.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide">
                Step 3 — Placement options
              </h2>

              {/* Page number */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Page number
                </label>
                <input
                  type="number"
                  min={1}
                  value={page}
                  onChange={(e) => setPage(Math.max(1, Number(e.target.value)))}
                  className="w-28 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
                <span className="ml-2 text-sm text-slate-400">(last page if out of range)</span>
              </div>

              {/* Position presets */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Position on page
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {POSITIONS.map((p, i) => (
                    <button
                      key={p.label}
                      onClick={() => handlePositionSelect(i)}
                      className={`py-2 px-3 rounded-xl border-2 text-xs font-medium transition-all ${
                        selectedPos === i
                          ? "border-rose-500 bg-rose-50 text-rose-700"
                          : "border-slate-200 text-slate-600 hover:border-rose-300"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom position */}
              {selectedPos === POSITIONS.length - 1 && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      X position (% from left)
                    </label>
                    <input
                      type="range" min={5} max={95} value={position.x}
                      onChange={(e) => setPosition((p) => ({ ...p, x: Number(e.target.value) }))}
                      className="w-full accent-rose-500"
                    />
                    <span className="text-xs text-slate-400">{position.x}%</span>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Y position (% from top)
                    </label>
                    <input
                      type="range" min={5} max={95} value={position.y}
                      onChange={(e) => setPosition((p) => ({ ...p, y: Number(e.target.value) }))}
                      className="w-full accent-rose-500"
                    />
                    <span className="text-xs text-slate-400">{position.y}%</span>
                  </div>
                </div>
              )}

              {/* Signature size */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Signature size
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range" min={10} max={60} value={sigSize}
                    onChange={(e) => setSigSize(Number(e.target.value))}
                    className="flex-1 accent-rose-500"
                  />
                  <span className="text-sm text-slate-500 w-16">{sigSize}% width</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <ProcessButton
            onClick={handleSign}
            loading={loading}
            disabled={!canSign}
            label="Apply Signature to PDF"
            loadingLabel="Signing…"
            trackEvent="sign_pdf"
          />

          {!signature && files.length > 0 && (
            <p className="text-center text-sm text-slate-400">Draw or type your signature above to continue.</p>
          )}
        </>
      )}
    </ToolPageLayout>
  );
}
