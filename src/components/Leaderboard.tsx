"use client";

import { useState, useEffect, useCallback } from "react";
import type { LeaderboardEntry } from "@/types";

interface LeaderboardProps {
  visible: boolean;
  onClose: () => void;
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "刚刚";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  return `${days}天前`;
}

function getRankStyle(rank: number) {
  if (rank === 1) return "text-yellow-500 border-yellow-500";
  if (rank === 2) return "text-zinc-400 border-zinc-400";
  if (rank === 3) return "text-amber-700 border-amber-700";
  return "text-zinc-600 border-transparent";
}

function getRankLabel(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}

export default function Leaderboard({ visible, onClose }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();
      setEntries(data);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    fetchLeaderboard();
  }, [visible, fetchLeaderboard]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-[480px] flex-col border-l border-zinc-800 bg-zinc-950 transition-transform duration-300 ease-in-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <h2 className="text-lg font-bold text-zinc-100">
            🏆 禁止编程指数排行榜
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-2xl text-zinc-500 transition-colors hover:text-zinc-200"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {loading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-lg bg-zinc-900 p-4"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-zinc-800" />
                    <div className="h-4 w-24 rounded bg-zinc-800" />
                    <div className="ml-auto h-6 w-16 rounded bg-zinc-800" />
                  </div>
                  <div className="mb-2 h-3 w-full rounded bg-zinc-800" />
                  <div className="h-3 w-3/4 rounded bg-zinc-800" />
                </div>
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <span className="text-5xl">🦗</span>
              <p className="text-zinc-500">
                还没有人投稿，快来成为第一个被吐槽的人！
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {entries.map((entry, index) => {
                const rank = index + 1;
                const rankStyle = getRankStyle(rank);
                const borderClass =
                  rank <= 3 ? rankStyle.split(" ")[1] : "border-transparent";
                return (
                  <div
                    key={entry.id}
                    className={`rounded-lg border bg-zinc-900 p-4 ${borderClass}`}
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <span
                        className={`text-lg font-bold ${rankStyle.split(" ")[0]}`}
                      >
                        {getRankLabel(rank)}
                      </span>
                      <span className="text-xl">{entry.personaIcon}</span>
                      <span className="text-sm font-medium text-zinc-300">
                        {entry.personaName}
                      </span>
                      <span className="ml-auto text-2xl font-bold text-red-500">
                        {entry.score}
                        <span className="text-sm text-red-500/60">/100</span>
                      </span>
                    </div>
                    <div className="mb-2 truncate rounded bg-zinc-800 px-3 py-1.5 font-mono text-xs text-zinc-400">
                      {entry.codeSnippet}
                    </div>
                    <p className="line-clamp-2 text-sm leading-relaxed text-zinc-400">
                      {entry.roastHighlight}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-500">
                        {entry.language}
                      </span>
                      <span className="text-xs text-zinc-600">
                        {formatTimeAgo(entry.timestamp)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
