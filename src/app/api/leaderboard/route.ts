import { NextResponse } from "next/server";
import { getEntries, addEntry } from "@/lib/db";
import type { LeaderboardEntry } from "@/types";

export async function GET() {
  return NextResponse.json(getEntries());
}

export async function POST(request: Request) {
  const body = await request.json();

  const entry: LeaderboardEntry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    codeSnippet: String(body.codeSnippet).slice(0, 300),
    language: String(body.language),
    personaName: String(body.personaName),
    personaIcon: String(body.personaIcon),
    roastHighlight: String(body.roastHighlight).slice(0, 300),
    score: Number(body.score),
    timestamp: Date.now(),
  };

  addEntry(entry);
  return NextResponse.json(entry, { status: 201 });
}
