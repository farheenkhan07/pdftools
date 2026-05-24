"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, FileText } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const tools = [
    { href: "/merge", label: "Merge PDF" },
    { href: "/split", label: "Split PDF" },
    { href: "/compress", label: "Compress PDF" },
    { href: "/sign", label: "Sign PDF" },
    { href: "/image-to-pdf", label: "Image → PDF" },
    { href: "/pdf-to-image", label: "PDF → Image" },
    { href: "/rotate", label: "Rotate PDF" },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            PDFToolsByFarheen
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {tools.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors"
              >
                {t.label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-3 space-y-1">
          {tools.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="block text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {t.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
