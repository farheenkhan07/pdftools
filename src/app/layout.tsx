import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "PDFTools – Free Online PDF Editor & Converter",
  description:
    "Merge, split, compress, and convert PDFs for free. No signup required. Fast, secure, and easy to use.",
  keywords: "PDF editor, merge PDF, split PDF, compress PDF, image to PDF, PDF tools",
  openGraph: {
    title: "PDFTools – Free Online PDF Editor",
    description: "All the PDF tools you need in one place. Free, fast, and secure.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
