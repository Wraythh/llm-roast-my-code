"use client";

import { useState } from "react";
import type { Persona } from "@/types";

interface RoastDisplayProps {
  roastText: string;
  isLoading: boolean;
  persona: Persona | null;
  onShare: () => void;
  onSubmitToLeaderboard?: () => void;
  submitStatus?: "" | "submitting" | "done";
}

export default function RoastDisplay({
  roastText,
  isLoading,
  persona,
  onShare,
  onSubmitToLeaderboard,
  submitStatus = "",
}: RoastDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(roastText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading && !roastText) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg bg-zinc-900 p-8">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <span className="text-6xl">💀</span>
          <p className="text-lg text-zinc-400">正在组织语言吐槽你...</p>
        </div>
      </div>
    );
  }

  if (!roastText && !isLoading) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg bg-zinc-900 p-8">
        <p className="text-zinc-500 text-lg">
          👈 粘贴代码，选择人格，点击开始吐槽
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-lg bg-zinc-900">
      <div className="flex-1 overflow-y-auto p-6">
        {persona && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl">{persona.icon}</span>
            <span className="text-lg font-semibold text-zinc-200">
              {persona.name}
            </span>
          </div>
        )}
        <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-zinc-300">
          {roastText}
        </div>
      </div>
      <div className="flex items-center gap-3 border-t border-zinc-800 px-6 py-4">
        <button
          onClick={onShare}
          className="cursor-pointer rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          📸 生成分享图片
        </button>
        <button
          onClick={handleCopy}
          className="cursor-pointer rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-600"
        >
          {copied ? "✅ 已复制" : "📋 复制文本"}
        </button>
        {onSubmitToLeaderboard && (
          <button
            onClick={onSubmitToLeaderboard}
            disabled={submitStatus !== ""}
            className="cursor-pointer rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitStatus === "done" ? "✅ 已投稿" : submitStatus === "submitting" ? "投稿中..." : "🏆 投稿排行榜"}
          </button>
        )}
      </div>
    </div>
  );
}
