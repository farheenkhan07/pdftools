import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ToolPageLayoutProps {
  title: string;
  description: string;
  icon: ReactNode;
  iconBg: string;
  children: ReactNode;
}

export default function ToolPageLayout({
  title,
  description,
  icon,
  iconBg,
  children,
}: ToolPageLayoutProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        All Tools
      </Link>

      <div className="text-center mb-10">
        <div className={`w-16 h-16 ${iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
          {icon}
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">{title}</h1>
        <p className="text-slate-500 text-lg max-w-md mx-auto">{description}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
        {children}
      </div>
    </div>
  );
}
