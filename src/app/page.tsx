import Link from "next/link";
import {
  FilePlus2,
  Scissors,
  Minimize2,
  ImagePlus,
  Image,
  RotateCw,
  ShieldCheck,
  Zap,
  Star,
  ArrowRight,
} from "lucide-react";

const tools = [
  {
    href: "/merge",
    icon: FilePlus2,
    title: "Merge PDF",
    desc: "Combine multiple PDFs into a single file. Reorder pages any way you want.",
    color: "bg-blue-50 text-blue-600",
    border: "border-blue-100",
    badge: "Popular",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    href: "/split",
    icon: Scissors,
    title: "Split PDF",
    desc: "Extract specific pages or split into individual pages with one click.",
    color: "bg-violet-50 text-violet-600",
    border: "border-violet-100",
  },
  {
    href: "/compress",
    icon: Minimize2,
    title: "Compress PDF",
    desc: "Reduce PDF file size while keeping the quality as high as possible.",
    color: "bg-green-50 text-green-600",
    border: "border-green-100",
    badge: "Popular",
    badgeColor: "bg-green-100 text-green-700",
  },
  {
    href: "/image-to-pdf",
    icon: ImagePlus,
    title: "Image → PDF",
    desc: "Convert JPG, PNG, or WebP images into a PDF document instantly.",
    color: "bg-orange-50 text-orange-600",
    border: "border-orange-100",
  },
  {
    href: "/pdf-to-image",
    icon: Image,
    title: "PDF → Image",
    desc: "Convert PDF pages into high-quality JPG or PNG images.",
    color: "bg-pink-50 text-pink-600",
    border: "border-pink-100",
  },
  {
    href: "/rotate",
    icon: RotateCw,
    title: "Rotate PDF",
    desc: "Rotate one, multiple, or all pages in your PDF at 90°, 180°, or 270°.",
    color: "bg-cyan-50 text-cyan-600",
    border: "border-cyan-100",
  },
];

const features = [
  {
    icon: ShieldCheck,
    title: "Secure & Private",
    desc: "Files are processed on our server and permanently deleted right after. We never store your data.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Optimized PDF engine processes your files in seconds, not minutes.",
  },
  {
    icon: Star,
    title: "No Limits",
    desc: "No watermarks, no signup, no subscriptions. All tools are completely free.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full mb-6 border border-white/20">
            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            Free PDF tools — no signup required
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight">
            All the PDF tools
            <br />
            <span className="text-indigo-200">you&apos;ll ever need</span>
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            Merge, split, compress, rotate, and convert PDFs in seconds.
            No watermarks. No account. Completely free.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/merge"
              className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-lg"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#tools"
              className="bg-white/10 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors border border-white/30"
            >
              View All Tools
            </Link>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Everything you need for PDFs
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Professional PDF tools that work right in your browser. No installation needed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className={`tool-card bg-white rounded-2xl p-6 border ${tool.border} shadow-sm hover:shadow-lg group`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${tool.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {tool.badge && (
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{tool.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Use Tool <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why use PDFTools?</h2>
            <p className="text-lg text-slate-500">Built with your privacy and convenience in mind.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="text-center">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-indigo-600 to-violet-600 py-16 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to work with PDFs?</h2>
          <p className="text-indigo-100 mb-8 text-lg">
            Pick any tool above and get started instantly. It&apos;s free, always.
          </p>
          <Link
            href="/merge"
            className="bg-white text-indigo-700 font-bold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-colors inline-flex items-center gap-2 shadow-lg text-lg"
          >
            Start Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
