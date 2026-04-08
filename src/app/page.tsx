"use client";

import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import type { Persona } from "@/types";
import PersonaSelector from "@/components/PersonaSelector";
import RoastDisplay from "@/components/RoastDisplay";
import ShareCard from "@/components/ShareCard";
import Leaderboard from "@/components/Leaderboard";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-zinc-900 rounded-lg">
      <p className="text-zinc-500">加载编辑器中...</p>
    </div>
  ),
});

const LANGUAGES = [
  "python",
  "javascript",
  "typescript",
  "java",
  "c",
  "cpp",
  "go",
  "rust",
  "shell",
  "sql",
  "html",
  "css",
  "json",
  "yaml",
  "markdown",
];

export default function Home() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [roastText, setRoastText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"" | "submitting" | "done">("");
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const handleSubmitToLeaderboard = useCallback(async () => {
    if (!roastText || !selectedPersona) return;
    setSubmitStatus("submitting");
    const scoreMatch = roastText.match(/(\d{1,3})\s*[/／]\s*100/);
    const score = scoreMatch ? Math.min(parseInt(scoreMatch[1], 10), 100) : Math.floor(Math.random() * 40) + 60;
    try {
      await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codeSnippet: code.slice(0, 300),
          language,
          personaName: selectedPersona.name,
          personaIcon: selectedPersona.icon,
          roastHighlight: roastText.slice(0, 300),
          score,
        }),
      });
      setSubmitStatus("done");
    } catch {
      setSubmitStatus("");
    }
  }, [roastText, selectedPersona, code, language]);

  const handleRoast = useCallback(async () => {
    if (!code.trim()) {
      setError("请先粘贴代码");
      return;
    }
    if (!selectedPersona) {
      setError("请选择一个吐槽人格");
      return;
    }

    setError("");
    setRoastText("");
    setIsLoading(true);
    setSubmitStatus("");

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          systemPrompt: selectedPersona.systemPrompt,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "请求失败");
        setIsLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setError("无法读取响应流");
        setIsLoading(false);
        return;
      }

      const decoder = new TextDecoder();
      let text = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        text += chunk;
        setRoastText(text);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError("请求出错，请重试");
    } finally {
      setIsLoading(false);
    }
  }, [code, language, selectedPersona]);

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔥</span>
          <h1 className="text-xl font-bold text-zinc-100">Roast My Code</h1>
          <span className="text-sm text-zinc-500">AI 毒舌代码吐槽器</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowLeaderboard(true)}
            className="cursor-pointer text-sm text-zinc-500 transition-colors hover:text-zinc-300"
          >
            🏆 排行榜
          </button>
          <a
            href="https://github.com/Wraythh/llm-roast-my-code"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
          >
            GitHub
          </a>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-1/2 flex-col border-r border-zinc-800">
          <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="cursor-pointer rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200 outline-none focus:border-purple-500"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <button
              onClick={handleRoast}
              disabled={isLoading}
              className="cursor-pointer rounded-lg bg-gradient-to-r from-red-600 to-orange-600 px-5 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "🔥 吐槽中..." : "🔥 开始吐槽"}
            </button>
            {error && (
              <span className="text-sm text-red-400">{error}</span>
            )}
          </div>

          <div className="flex-1">
            <MonacoEditor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                padding: { top: 16 },
                wordWrap: "on",
              }}
            />
          </div>

          <div className="border-t border-zinc-800 p-4">
            <h2 className="mb-3 text-sm font-medium text-zinc-400">
              选择吐槽人格
            </h2>
            <PersonaSelector
              selectedPersona={selectedPersona}
              onSelect={setSelectedPersona}
            />
          </div>
        </div>

        <div className="flex w-1/2 flex-col">
          <RoastDisplay
            roastText={roastText}
            isLoading={isLoading}
            persona={selectedPersona}
            onShare={() => setShowShare(true)}
            onSubmitToLeaderboard={roastText && !isLoading ? handleSubmitToLeaderboard : undefined}
            submitStatus={submitStatus}
          />
        </div>
      </div>

      <ShareCard
        roastText={roastText}
        persona={selectedPersona}
        code={code}
        language={language}
        visible={showShare}
        onClose={() => setShowShare(false)}
      />

      <Leaderboard
        visible={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
      />
    </div>
  );
}
