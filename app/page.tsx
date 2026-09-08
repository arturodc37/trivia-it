"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { joinGameAction } from "./actions";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { GameState } from "@/lib/types";
import { Sparkles, Users, Zap, Shield, HelpCircle, ArrowRight, Smartphone, Trophy } from "lucide-react";

const AVATAR_COLORS = [
  { name: "Cyan", value: "#06b6d4" },
  { name: "Emerald", value: "#10b981" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Sky", value: "#38bdf8" },
];

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0].value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playerCount, setPlayerCount] = useState<number>(0);
  const [gameState, setGameState] = useState<GameState | null>(null);

  // Initialize or retrieve unique device ID
  useEffect(() => {
    let deviceId = localStorage.getItem("rapidagil_device_id");
    if (!deviceId) {
      deviceId = "dev_" + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
      localStorage.setItem("rapidagil_device_id", deviceId);
    }
    const savedName = localStorage.getItem("rapidagil_player_name");
    if (savedName) setName(savedName);
    const savedColor = localStorage.getItem("rapidagil_avatar_color");
    if (savedColor) setSelectedColor(savedColor);

    // Fetch initial player count and game status if supabase is configured
    if (isSupabaseConfigured) {
      supabase.from("players").select("id", { count: "exact" }).then(({ count }) => {
        if (count !== null) setPlayerCount(count);
      });

      supabase.from("game").select("*").eq("id", 1).single().then(({ data }) => {
        if (data) setGameState(data as GameState);
      });

      // Realtime subscription for player count
      const channel = supabase
        .channel("home_lobby")
        .on("postgres_changes", { event: "*", schema: "public", table: "players" }, () => {
          supabase.from("players").select("id", { count: "exact" }).then(({ count }) => {
            if (count !== null) setPlayerCount(count);
          });
        })
        .on("postgres_changes", { event: "UPDATE", schema: "public", table: "game" }, (payload) => {
          setGameState(payload.new as GameState);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError("Por favor escribe tu apodo o nombre");
      return;
    }

    setLoading(true);
    setError(null);

    const deviceId = localStorage.getItem("rapidagil_device_id") || "dev_" + Math.random().toString(36);
    localStorage.setItem("rapidagil_player_name", cleanName);
    localStorage.setItem("rapidagil_avatar_color", selectedColor);

    try {
      const res = await joinGameAction(cleanName, deviceId, selectedColor);
      if (res.success) {
        if (res.playerId) {
          localStorage.setItem("rapidagil_player_id", res.playerId);
        }
        router.push("/game");
      } else {
        setError(res.error || "No se pudo conectar al juego");
        setLoading(false);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error inesperado de conexión");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 max-w-md mx-auto">
      {/* Top Header & Brand */}
      <div className="w-full text-center pt-6 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4 animate-pulse">
          <Zap className="w-3.5 h-3.5" />
          Trivia IT en Vivo
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
          Rapidagil IT
        </h1>
        <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">
          ¿Quién es el más rápido de la sala? El primero en acertar se lleva el punto.
        </p>

        {/* Live Lobby Pill */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/60 shadow-inner">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span><strong className="text-white font-bold">{playerCount}</strong> jugadores listos</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60">
            <span className={`w-2 h-2 rounded-full ${
              gameState?.phase === "question" ? "bg-amber-400 animate-ping" : "bg-emerald-400"
            }`} />
            <span className="text-slate-300">
              {gameState?.phase === "question" ? "Partida en curso" : "Sala abierta"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Join Card */}
      <div className="w-full glass-panel rounded-2xl p-6 shadow-2xl border border-slate-800 relative overflow-hidden my-auto">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-rose-500" />

        <form onSubmit={handleJoin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Tu Nombre o Alias
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                placeholder="Ej. Alex_Dev, Hackerman..."
                maxLength={20}
                required
                className="w-full bg-slate-900/90 text-white placeholder-slate-500 px-4 py-3.5 rounded-xl border border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none text-base font-medium transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Color Avatar Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Color de tu Avatar
            </label>
            <div className="flex items-center justify-between gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
              {AVATAR_COLORS.map((col) => (
                <button
                  key={col.value}
                  type="button"
                  onClick={() => setSelectedColor(col.value)}
                  style={{ backgroundColor: col.value }}
                  className={`w-9 h-9 rounded-lg transition-all transform flex items-center justify-center ${
                    selectedColor === col.value
                      ? "ring-2 ring-white scale-110 shadow-lg shadow-cyan-500/30"
                      : "opacity-60 hover:opacity-100 hover:scale-105"
                  }`}
                  aria-label={col.name}
                >
                  {selectedColor === col.value && (
                    <Sparkles className="w-4 h-4 text-slate-950 stroke-[3]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full py-4 px-6 rounded-xl font-bold text-base bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Unirse al Desafío</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Quick Rules */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span><strong>15 segundos</strong> por pregunta.</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <span>El <strong>primero</strong> en marcar la respuesta correcta suma 1 punto.</span>
          </div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>Todos los móviles sincronizados en tiempo real.</span>
          </div>
        </div>
      </div>

      {/* Footer / Admin Link */}
      <footer className="w-full text-center py-4 text-xs text-slate-500 flex items-center justify-between">
        <span>Rapidagil IT • v1.0</span>
        <a
          href="/admin"
          className="text-slate-400 hover:text-cyan-400 underline underline-offset-4 transition-colors"
        >
          Panel Organizador (Admin) →
        </a>
      </footer>
    </main>
  );
}
