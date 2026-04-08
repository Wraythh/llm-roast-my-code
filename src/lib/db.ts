import type { LeaderboardEntry } from "@/types";

const entries: LeaderboardEntry[] = [];

export function getEntries(): LeaderboardEntry[] {
  return [...entries].sort((a, b) => b.score - a.score).slice(0, 50);
}

export function addEntry(entry: LeaderboardEntry) {
  entries.push(entry);
}
