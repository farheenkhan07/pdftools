"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Pen, Type, Trash2 } from "lucide-react";

interface SignaturePadProps {
  onChange: (dataUrl: string | null) => void;
}

export default function SignaturePad({ onChange }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"draw" | "type">("draw");
  const [typedName, setTypedName] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const getCanvas = () => canvasRef.current;
  const getCtx = () => canvasRef.current?.getContext("2d");

  const initCanvas = useCallback(() => {
    const canvas = getCanvas();
    const ctx = getCtx();
    if (!canvas || !ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = getCanvas();
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    lastPos.current = getPos(e);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const ctx = getCtx();
    if (!ctx || !lastPos.current) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
    setIsEmpty(false);
    onChange(getCanvas()!.toDataURL("image/png"));
  };

  const endDraw = () => {
    setIsDrawing(false);
    lastPos.current = null;
  };

  const clear = () => {
    initCanvas();
    setIsEmpty(true);
    setTypedName("");
    onChange(null);
  };

  const renderTyped = useCallback((name: string) => {
    const canvas = getCanvas();
    const ctx = getCtx();
    if (!canvas || !ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (!name.trim()) { onChange(null); setIsEmpty(true); return; }
    ctx.fillStyle = "#1e293b";
    ctx.font = `italic ${Math.min(canvas.height * 0.55, 64)}px "Georgia", serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name, canvas.width / 2, canvas.height / 2);
    setIsEmpty(false);
    onChange(canvas.toDataURL("image/png"));
  }, [onChange]);

  useEffect(() => {
    if (mode === "type") renderTyped(typedName);
  }, [typedName, mode, renderTyped]);

  const switchMode = (m: "draw" | "type") => {
    setMode(m);
    clear();
  };

  return (
    <div className="space-y-3">
      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => switchMode("draw")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            mode === "draw"
              ? "bg-indigo-600 text-white shadow"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Pen className="w-4 h-4" /> Draw
        </button>
        <button
          onClick={() => switchMode("type")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            mode === "type"
              ? "bg-indigo-600 text-white shadow"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Type className="w-4 h-4" /> Type
        </button>
      </div>

      {/* Canvas */}
      <div className="relative border-2 border-dashed border-slate-300 rounded-xl overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          width={600}
          height={180}
          className="w-full touch-none cursor-crosshair"
          style={{ display: mode === "draw" ? "block" : "none" }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        <canvas
          ref={mode === "type" ? canvasRef : undefined}
          width={600}
          height={180}
          className="w-full"
          style={{ display: mode === "type" ? "block" : "none" }}
        />
        {mode === "draw" && isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-slate-300 text-sm select-none">Sign here with your mouse or finger</p>
          </div>
        )}
      </div>

      {/* Type input */}
      {mode === "type" && (
        <input
          type="text"
          value={typedName}
          onChange={(e) => setTypedName(e.target.value)}
          placeholder="Type your name…"
          className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
        />
      )}

      {/* Clear */}
      {!isEmpty && (
        <button
          onClick={clear}
          className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors"
        >
          <Trash2 className="w-4 h-4" /> Clear signature
        </button>
      )}
    </div>
  );
}
