"use client";

import { useRef, useCallback } from "react";
import html2canvas from "html2canvas";
import type { Persona } from "@/types";

interface ShareCardProps {
  roastText: string;
  persona: Persona | null;
  code: string;
  language: string;
  visible: boolean;
  onClose: () => void;
}

export default function ShareCard({
  roastText,
  persona,
  code,
  language,
  visible,
  onClose,
}: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const codeLines = code.split("\n");
  const displayCode =
    codeLines.length > 8
      ? codeLines.slice(0, 8).join("\n") + "\n..."
      : code;

  const roastHighlight = roastText.slice(0, 300) + (roastText.length > 300 ? "..." : "");

  const handleDownload = useCallback(async () => {
    const el = document.getElementById("share-card");
    if (!el) return;
    const canvas = await html2canvas(el, {
      backgroundColor: null,
      scale: 2,
    });
    const link = document.createElement("a");
    link.download = "roast-my-code.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex flex-col items-center gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          ref={cardRef}
          id="share-card"
          className="w-[480px] rounded-2xl bg-gradient-to-br from-zinc-900 via-purple-950 to-zinc-900 p-8 shadow-2xl"
        >
          <div className="mb-6 flex items-center justify-between">
            <span className="text-xl font-bold text-white">🔥 Roast My Code</span>
            {persona && (
              <div className="flex items-center gap-2">
                <span className="text-lg">{persona.icon}</span>
                <span className="text-sm font-medium text-zinc-300">
                  {persona.name}
                </span>
              </div>
            )}
          </div>

          <div className="mb-4 rounded-lg bg-black/40 p-4">
            <div className="mb-2 text-xs font-medium text-zinc-500">
              {language}
            </div>
            <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-zinc-400">
              {displayCode}
            </pre>
          </div>

          <div className="mb-6 rounded-lg bg-black/30 p-4">
            <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-zinc-200">
              {roastHighlight}
            </p>
          </div>

          <div className="text-center text-xs text-zinc-600">
            roast-my-code.vercel.app
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            className="cursor-pointer rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            下载图片
          </button>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg bg-zinc-700 px-6 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-600"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
