"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { GameState, Player } from "@/lib/types";
import { QUESTIONS } from "@/data/questions";
import {
  startGameAction,
  resetGameAction,
  advanceToNextQuestionAction,
  timeoutQuestionAction,
  clearAllPlayersAction,
} from "../actions";
import {
  Shield,
  Play,
  RotateCcw,
  SkipForward,
  Eye,
  Trash2,
  Users,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  Zap,
} from "lucide-react";

export default function AdminPage() {
  const [gameState, setGameState] = useState<GameState>({
    id: 1,
    phase: "waiting",
    question_index: 0,
    question_started_at: null,
    total_questions: 20,
    winner_of_question: null,
    last_correct_answer: null,
  });

  const [players, setPlayers] = useState<Player[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [gameUrl, setGameUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setGameUrl(window.location.origin);
    }
  }, []);

  const fetchState = useCallback(async () => {
    if (!isSupabaseConfigured) return;

    const { data: gData } = await supabase.from("game").select("*").eq("id", 1).single();
    if (gData) {
      setGameState(gData as GameState);
      setQuestionCount(gData.total_questions || 20);
    }

    const { data: pData } = await supabase.from("players").select("*").order("score", { ascending: false });
    if (pData) setPlayers(pData as Player[]);
  }, []);

  useEffect(() => {
    fetchState();

    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel("admin_realtime_monitor")
      .on("postgres_changes", { event: "*", schema: "public", table: "game" }, (payload) => {
        if (payload.new) setGameState(payload.new as GameState);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "players" }, () => {
        supabase
          .from("players")
          .select("*")
          .order("score", { ascending: false })
          .then(({ data }) => {
            if (data) setPlayers(data as Player[]);
          });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchState]);

  const handleStartGame = async () => {
    setLoadingAction("start");
    await startGameAction(questionCount);
    setLoadingAction(null);
  };

  const handleNextQuestion = async () => {
    setLoadingAction("next");
    await advanceToNextQuestionAction(gameState.question_index);
    setLoadingAction(null);
  };

  const handleForceReveal = async () => {
    setLoadingAction("reveal");
    await timeoutQuestionAction(gameState.question_index);
    setLoadingAction(null);
  };

  const handleResetGame = async () => {
    if (confirm("¿Seguro que deseas reiniciar el juego a la sala de espera?")) {
      setLoadingAction("reset");
      await resetGameAction();
      setLoadingAction(null);
    }
  };

  const handleClearPlayers = async () => {
    if (confirm("¿Seguro que deseas eliminar todos los jugadores registrados y reiniciar puntuaciones?")) {
      setLoadingAction("clear");
      await clearAllPlayersAction();
      setLoadingAction(null);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.origin);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const currentQ = QUESTIONS[gameState.question_index] || QUESTIONS[0];

  return (
    <main className="min-h-screen bg-[#0b0f19] text-slate-100 p-4 sm:p-8 max-w-6xl mx-auto">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5" />
            Panel de Control del Organizador
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            Rapidagil IT <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 font-mono font-normal">ADMIN</span>
          </h1>
        </div>

        {/* Join URL and Projector Mode */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
            <span>{copiedLink ? "¡Enlace Copiado!" : "Copiar Enlace para Jugadores"}</span>
          </button>

          <a
            href="/game"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 flex items-center gap-2 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Abrir Vista de Juego</span>
          </a>
        </div>
      </header>

      {/* Supabase Status Alert */}
      {!isSupabaseConfigured && (
        <div className="my-6 p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-500/50 text-amber-300 flex items-start gap-3.5">
          <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5 text-amber-400" />
          <div className="text-xs space-y-1">
            <strong className="text-sm font-bold block text-white">Variables de Supabase no configuradas en este entorno</strong>
            <p>
              Para juego multijugador sincronizado entre múltiples celulares, añade las variables de entorno{" "}
              <code className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-200">NEXT_PUBLIC_SUPABASE_URL</code> y{" "}
              <code className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-200">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> en tu dashboard de Vercel.
            </p>
          </div>
        </div>
      )}

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
        {/* LEFT COLUMN: Controls & Game State (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Action Buttons Card */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Controles de la Partida
            </h2>

            {/* Questions count selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div>
                <label className="text-xs font-bold text-slate-300 block">Número de Preguntas por Partida</label>
                <span className="text-[11px] text-slate-500">Total en banco: {QUESTIONS.length} preguntas de IT</span>
              </div>
              <div className="flex items-center gap-2">
                {[10, 20, 30, 50].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuestionCount(num)}
                    disabled={gameState.phase === "question" || gameState.phase === "reveal"}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      questionCount === num
                        ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30"
                        : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {/* Start / Restart Game */}
              <button
                type="button"
                onClick={handleStartGame}
                disabled={Boolean(loadingAction)}
                className="py-3.5 px-5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{gameState.phase === "waiting" ? "Iniciar Partida" : "Reiniciar & Comenzar"}</span>
              </button>

              {/* Next Question */}
              <button
                type="button"
                onClick={handleNextQuestion}
                disabled={Boolean(loadingAction) || gameState.phase === "waiting" || gameState.phase === "finished"}
                className="py-3.5 px-5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                <SkipForward className="w-4 h-4" />
                <span>Siguiente Pregunta</span>
              </button>

              {/* Force Reveal */}
              <button
                type="button"
                onClick={handleForceReveal}
                disabled={Boolean(loadingAction) || gameState.phase !== "question"}
                className="py-3 px-4 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Revelar Respuesta Actual</span>
              </button>

              {/* Reset to Lobby */}
              <button
                type="button"
                onClick={handleResetGame}
                disabled={Boolean(loadingAction)}
                className="py-3 px-4 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Volver a Sala de Espera</span>
              </button>
            </div>

            {/* Clear All Players Danger Button */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-500">¿Nuevo evento o grupo?</span>
              <button
                type="button"
                onClick={handleClearPlayers}
                disabled={Boolean(loadingAction)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar Todos los Jugadores</span>
              </button>
            </div>
          </div>

          {/* Live Question Monitor */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                Monitor de Pregunta en Pantalla
              </h2>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                gameState.phase === "question"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse"
                  : gameState.phase === "reveal"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : gameState.phase === "finished"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                  : "bg-slate-800 text-slate-400"
              }`}>
                Fase: {gameState.phase}
              </span>
            </div>

            {gameState.phase !== "waiting" ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>Pregunta {gameState.question_index + 1} de {gameState.total_questions}</span>
                    <span className="text-cyan-400 font-semibold">{currentQ.category}</span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug">{currentQ.question}</h3>
                </div>

                {/* Options Review */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {(["A", "B", "C", "D"] as const).map((opt) => (
                    <div
                      key={opt}
                      className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                        currentQ.answer === opt
                          ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-200 font-bold"
                          : "bg-slate-900/40 border-slate-800/80 text-slate-400"
                      }`}
                    >
                      <span className={`w-5 h-5 rounded flex items-center justify-center font-mono text-[11px] font-bold ${
                        currentQ.answer === opt ? "bg-emerald-400 text-slate-950" : "bg-slate-800 text-slate-300"
                      }`}>
                        {opt}
                      </span>
                      <span className="leading-snug">{currentQ.options[opt]}</span>
                      {currentQ.answer === opt && <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto flex-shrink-0" />}
                    </div>
                  ))}
                </div>

                {gameState.winner_of_question && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Ganador de esta pregunta: <strong>{gameState.winner_of_question}</strong> (+1 pt)</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 text-sm">
                El juego está en sala de espera. Haz clic en "Iniciar Partida" para comenzar.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Realtime Leaderboard (1 col) */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col h-full min-h-[500px]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              Ranking ({players.length})
            </h2>
            <span className="text-xs text-slate-500">Tiempo Real</span>
          </div>

          <div className="flex-1 overflow-y-auto py-3 space-y-2 pr-1">
            {players.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12">
                <Users className="w-8 h-8 mb-2 opacity-40" />
                <p className="text-xs">No hay jugadores conectados aún.</p>
                <p className="text-[11px] text-slate-600 mt-1">Comparte la URL para que ingresen.</p>
              </div>
            ) : (
              players.map((p, idx) => (
                <div
                  key={p.id || idx}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    idx === 0
                      ? "bg-amber-500/10 border-amber-500/40 text-amber-200"
                      : idx === 1
                      ? "bg-slate-700/20 border-slate-500/40 text-slate-200"
                      : idx === 2
                      ? "bg-amber-950/20 border-amber-700/40 text-amber-300"
                      : "bg-slate-900/50 border-slate-800/80 text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs w-4 text-slate-500">#{idx + 1}</span>
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-slate-950 text-xs shadow-sm"
                      style={{ backgroundColor: p.avatar_color || "#38bdf8" }}
                    >
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold truncate max-w-[110px]">{p.name}</span>
                  </div>
                  <span className="font-mono font-bold text-xs bg-slate-800 px-2 py-1 rounded-md text-white">
                    {p.score} pts
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
