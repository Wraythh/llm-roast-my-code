"use client";

import { useState } from "react";
import { Persona } from "@/types";
import { DEFAULT_PERSONAS } from "@/data/personas";

interface PersonaSelectorProps {
  selectedPersona: Persona | null;
  onSelect: (persona: Persona) => void;
}

const STORAGE_KEY = "custom-personas";

function loadCustomPersonas(): Persona[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCustomPersonas(personas: Persona[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(personas));
}

export default function PersonaSelector({
  selectedPersona,
  onSelect,
}: PersonaSelectorProps) {
  const [customPersonas, setCustomPersonas] = useState<Persona[]>(() => loadCustomPersonas());
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formIcon, setFormIcon] = useState("");
  const [formPrompt, setFormPrompt] = useState("");

  const handleDelete = (id: string) => {
    const updated = customPersonas.filter((p) => p.id !== id);
    setCustomPersonas(updated);
    saveCustomPersonas(updated);
  };

  const handleCreate = () => {
    if (!formName.trim() || !formPrompt.trim()) return;
    const newPersona: Persona = {
      id: Date.now().toString(),
      name: formName.trim(),
      icon: formIcon.trim() || "🎭",
      description: formPrompt.trim(),
      systemPrompt: formPrompt.trim(),
      isPreset: false,
    };
    const updated = [...customPersonas, newPersona];
    setCustomPersonas(updated);
    saveCustomPersonas(updated);
    onSelect(newPersona);
    setFormName("");
    setFormIcon("");
    setFormPrompt("");
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {DEFAULT_PERSONAS.map((persona) => (
          <button
            key={persona.id}
            onClick={() => onSelect(persona)}
            className={`cursor-pointer rounded-lg border p-3 text-left transition-colors hover:bg-zinc-800 ${
              selectedPersona?.id === persona.id
                ? "border-purple-500 bg-zinc-800"
                : "border-zinc-700 bg-zinc-900"
            }`}
          >
            <span className="text-2xl">{persona.icon}</span>
            <div className="mt-1 text-sm font-medium text-zinc-100">
              {persona.name}
            </div>
            <div className="mt-0.5 text-xs text-zinc-400 line-clamp-2">
              {persona.description}
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-zinc-400">我的人格</h3>

        {customPersonas.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {customPersonas.map((persona) => (
              <button
                key={persona.id}
                onClick={() => onSelect(persona)}
                className={`relative cursor-pointer rounded-lg border p-3 text-left transition-colors hover:bg-zinc-800 ${
                  selectedPersona?.id === persona.id
                    ? "border-purple-500 bg-zinc-800"
                    : "border-zinc-700 bg-zinc-900"
                }`}
              >
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(persona.id);
                  }}
                  className="absolute top-1 right-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded text-xs text-zinc-500 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
                >
                  ×
                </span>
                <span className="text-2xl">{persona.icon}</span>
                <div className="mt-1 text-sm font-medium text-zinc-100">
                  {persona.name}
                </div>
                <div className="mt-0.5 text-xs text-zinc-400 line-clamp-2">
                  {persona.description}
                </div>
              </button>
            ))}
          </div>
        )}

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full cursor-pointer rounded-lg border border-dashed border-zinc-700 p-3 text-sm text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200"
          >
            + 创建新人格
          </button>
        )}

        {showForm && (
          <div className="space-y-3 rounded-lg border border-zinc-700 bg-zinc-900 p-4">
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="人格名称"
              className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-purple-500"
            />
            <input
              type="text"
              value={formIcon}
              onChange={(e) => setFormIcon(e.target.value)}
              placeholder="输入一个 emoji"
              className="w-full rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-purple-500"
            />
            <textarea
              value={formPrompt}
              onChange={(e) => setFormPrompt(e.target.value)}
              placeholder="例：你是鲁迅先生，用犀利的文笔吐槽这段代码..."
              rows={3}
              className="w-full resize-none rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-purple-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                className="cursor-pointer rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
              >
                保存并使用
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormName("");
                  setFormIcon("");
                  setFormPrompt("");
                }}
                className="cursor-pointer rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-600"
              >
                取消
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
