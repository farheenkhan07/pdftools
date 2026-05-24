import { CheckCircle, Download, RefreshCw } from "lucide-react";

interface ResultPanelProps {
  downloadUrl: string;
  fileName: string;
  onReset: () => void;
  message?: string;
}

export default function ResultPanel({ downloadUrl, fileName, onReset, message }: ResultPanelProps) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center space-y-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-9 h-9 text-green-600" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-900">Done!</h3>
        <p className="text-slate-500 text-sm mt-1">{message || "Your file is ready to download."}</p>
      </div>
      <a
        href={downloadUrl}
        download={fileName}
        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm"
      >
        <Download className="w-5 h-5" />
        Download {fileName}
      </a>
      <div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors mt-2"
        >
          <RefreshCw className="w-4 h-4" />
          Process another file
        </button>
      </div>
    </div>
  );
}
