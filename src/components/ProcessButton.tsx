import { Loader2 } from "lucide-react";

interface ProcessButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
  label: string;
  loadingLabel?: string;
}

export default function ProcessButton({
  onClick,
  loading,
  disabled,
  label,
  loadingLabel = "Processing…",
}: ProcessButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold text-lg transition-all
        ${disabled || loading
          ? "bg-slate-200 text-slate-400 cursor-not-allowed"
          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg active:scale-[0.99]"
        }`}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          {loadingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}
