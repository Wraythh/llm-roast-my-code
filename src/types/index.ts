export interface Persona {
  id: string;
  name: string;
  icon: string;
  description: string;
  systemPrompt: string;
  isPreset: boolean;
}

export interface RoastResult {
  id: string;
  code: string;
  language: string;
  persona: Persona;
  roastText: string;
  score: number;
  timestamp: number;
}

export interface LeaderboardEntry {
  id: string;
  codeSnippet: string;
  language: string;
  personaName: string;
  personaIcon: string;
  roastHighlight: string;
  score: number;
  timestamp: number;
}
