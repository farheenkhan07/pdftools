import Link from "next/link";
import { FileText } from "lucide-react";
export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg text-indigo-600 mb-3">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              PDFTools
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Free, fast, and secure PDF tools. No signup required. All processing
              happens on our server and files are deleted immediately after.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-800 mb-3">PDF Tools</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              {[
                { href: "/merge", label: "Merge PDF" },
                { href: "/split", label: "Split PDF" },
                { href: "/compress", label: "Compress PDF" },
                { href: "/sign", label: "Sign PDF" },
                { href: "/image-to-pdf", label: "Image to PDF" },
                { href: "/pdf-to-image", label: "PDF to Image" },
                { href: "/rotate", label: "Rotate PDF" },
              ].map((t) => (
                <li key={t.href}>
                  <Link href={t.href} className="hover:text-indigo-600 transition-colors">
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-800 mb-3">Why PDFTools?</h3>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>✓ 100% Free</li>
              <li>✓ No account needed</li>
              <li>✓ Files auto-deleted</li>
              <li>✓ Works on all devices</li>
              <li>✓ No watermarks</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-8 pt-6 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} PDFTools. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
