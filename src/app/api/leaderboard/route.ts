import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { LeaderboardEntry } from "@/types";

interface LeaderboardRow {
  id: string;
  code_snippet: string;
  language: string;
  persona_name: string;
  persona_icon: string;
  roast_highlight: string;
  score: number;
  timestamp: number;
}

function rowToEntry(row: LeaderboardRow): LeaderboardEntry {
  return {
    id: row.id,
    codeSnippet: row.code_snippet,
    language: row.language,
    personaName: row.persona_name,
    personaIcon: row.persona_icon,
    roastHighlight: row.roast_highlight,
    score: row.score,
    timestamp: row.timestamp,
  };
}

export async function GET() {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM leaderboard ORDER BY score DESC LIMIT 50")
    .all() as LeaderboardRow[];

  return NextResponse.json(rows.map(rowToEntry));
}

export async function POST(request: Request) {
  const body = await request.json();

  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const timestamp = Date.now();

  const entry: LeaderboardRow = {
    id,
    code_snippet: String(body.codeSnippet).slice(0, 300),
    language: String(body.language),
    persona_name: String(body.personaName),
    persona_icon: String(body.personaIcon),
    roast_highlight: String(body.roastHighlight).slice(0, 300),
    score: Number(body.score),
    timestamp,
  };

  const db = getDb();
  db.prepare(
    `INSERT INTO leaderboard (id, code_snippet, language, persona_name, persona_icon, roast_highlight, score, timestamp)
     VALUES (@id, @code_snippet, @language, @persona_name, @persona_icon, @roast_highlight, @score, @timestamp)`
  ).run(entry);

  return NextResponse.json(rowToEntry(entry), { status: 201 });
}
