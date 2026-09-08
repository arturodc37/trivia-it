"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { QUESTIONS } from "@/data/questions";
import { GameState, Player, Option } from "@/lib/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { submitAnswerAction, advanceToNextQuestionAction, timeoutQuestionAction } from "../actions";
import { sounds } from "@/lib/sounds";
import confetti from "canvas-confetti";
import {
  Trophy,
  Users,
  Timer,
  CheckCircle2,
  XCircle,
  Zap,
  Crown,
  Sparkles,
  Home as HomeIcon,
  HelpCircle,
} from "lucide-react";

const QUESTION_DURATION = 15; // 15 seconds per question

const OPTION_STYLES: Record<Option, { label: string; bg: string; border: string; glow: string; text: string }> = {
  A: {
    label: "A",
    bg: "bg-blue-600/15 hover:bg-blue-600/30 active:bg-blue-600/40",
    border: "border-blue-500/40 hover:border-blue-400",
    glow: "shadow-blue-500/20",
    text: "text-blue-400",
  },
  B: {
    label: "B",
    bg: "bg-purple-600/15 hover:bg-purple-600/30 active:bg-purple-600/40",
    border: "border-purple-500/40 hover:border-purple-400",
    glow: "shadow-purple-500/20",
    text: "text-purple-400",
  },
  C: {
    label: "C",
    bg: "bg-amber-600/15 hover:bg-amber-600/30 active:bg-amber-600/40",
    border: "border-amber-500/40 hover:border-amber-400",
    glow: "shadow-amber-500/20",
    text: "text-amber-400",
  },
  D: {
    label: "D",
    bg: "bg-rose-600/15 hover:bg-rose-600/30 active:bg-rose-600/40",
    border: "border-rose-500/40 hover:border-rose-400",
    glow: "shadow-rose-500/20",
    text: "text-rose-400",
  },
};

export default function GamePage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState<string>("");
  const [playerId, setPlayerId] = useState<string>("");
  const [avatarColor, setAvatarColor] = useState<string>("#38bdf8");

  // Game state
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
  const [selectedAnswer, setSelectedAnswer] = useState<Option | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [answerResult, setAnswerResult] = useState<{ isCorrect?: boolean; pointsEarned?: number } | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(QUESTION_DURATION);

  const prevPhaseRef = useRef<string>("waiting");
  const prevQuestionIdxRef = useRef<number>(-1);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load player info from localStorage
  useEffect(() => {
    const name = localStorage.getItem("rapidagil_player_name");
    const id = localStorage.getItem("rapidagil_player_id");
    const color = localStorage.getItem("rapidagil_avatar_color") || "#38bdf8";

    if (!name) {
      router.push("/");
      return;
    }

    setPlayerName(name);
    setPlayerId(id || name);
    setAvatarColor(color);
  }, [router]);

  // Fetch initial game state and players
  const fetchGameState = useCallback(async () => {
    if (!isSupabaseConfigured) return;

    const { data: gData } = await supabase.from("game").select("*").eq("id", 1).single();
    if (gData) setGameState(gData as GameState);

    const { data: pData } = await supabase.from("players").select("*").order("score", { ascending: false });
    if (pData) setPlayers(pData as Player[]);
  }, []);

  // Supabase Realtime subscriptions
  useEffect(() => {
    fetchGameState();

    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel("game_arena_realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "game" }, (payload) => {
        if (payload.new) {
          setGameState(payload.new as GameState);
        }
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
  }, [fetchGameState]);

  // Phase & Question transition handling
  useEffect(() => {
    const currentQIdx = gameState.question_index;
    const currentPhase = gameState.phase;

    // Reset local selection when entering a new question
    if (currentPhase === "question" && (prevPhaseRef.current !== "question" || prevQuestionIdxRef.current !== currentQIdx)) {
      setSelectedAnswer(null);
      setIsSubmitting(false);
      setAnswerResult(null);
      setTimeLeft(QUESTION_DURATION);
      sounds.playClick();
    }

    // When phase becomes reveal: play sound and wait 3.5s before next question
    if (currentPhase === "reveal" && prevPhaseRef.current !== "reveal") {
      if (answerResult?.isCorrect) {
        sounds.playCorrect();
      } else {
        sounds.playWrong();
      }

      // Auto-advance to next question after 3.5 seconds of reveal
      const timeout = setTimeout(() => {
        advanceToNextQuestionAction(gameState.question_index);
      }, 3500);

      return () => clearTimeout(timeout);
    }

    // When game finishes, trigger confetti & fanfare
    if (currentPhase === "finished" && prevPhaseRef.current !== "finished") {
      sounds.playWinner();
      try {
        confetti({
          particleCount: 140,
          spread: 85,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe confetti fallback
      }
    }

    prevPhaseRef.current = currentPhase;
    prevQuestionIdxRef.current = currentQIdx;
  }, [gameState.phase, gameState.question_index, answerResult]);

  // 15-Second Timer logic for question phase
  useEffect(() => {
    if (gameState.phase !== "question") {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    const updateTimer = () => {
      if (gameState.question_started_at) {
        const started = new Date(gameState.question_started_at).getTime();
        const now = Date.now();
        const elapsedSec = Math.floor((now - started) / 1000);
        const remaining = Math.max(0, QUESTION_DURATION - elapsedSec);
        setTimeLeft(remaining);

        if (remaining <= 5 && remaining > 0) {
          sounds.playTick();
        }

        // When 15 seconds run out, trigger reveal
        if (remaining === 0) {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          timeoutQuestionAction(gameState.question_index);
        }
      } else {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            timeoutQuestionAction(gameState.question_index);
            return 0;
          }
          if (prev <= 5) sounds.playTick();
          return prev - 1;
        });
      }
    };

    updateTimer();
    timerIntervalRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [gameState.phase, gameState.question_started_at, gameState.question_index]);

  // Handle Option Click
  const handleSelectOption = async (optionKey: Option) => {
    if (selectedAnswer || isSubmitting || gameState.phase !== "question") return;

    setSelectedAnswer(optionKey);
    setIsSubmitting(true);
    sounds.playClick();

    const currentRemainingSeconds = Math.max(1, timeLeft);

    try {
      const res = await submitAnswerAction(playerId, playerName, gameState.question_index, optionKey, currentRemainingSeconds);
      if (res.success) {
        setAnswerResult({
          isCorrect: res.isCorrect,
          pointsEarned: res.pointsEarned,
        });

        if (res.isCorrect) {
          sounds.playCorrect();
        } else {
          sounds.playWrong();
        }
      }
    } catch (e) {
      console.error("Error al enviar respuesta:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = QUESTIONS[gameState.question_index] || QUESTIONS[0];
  const myPlayer = players.find((p) => p.name === playerName || p.id === playerId);
  const myRank = players.findIndex((p) => p.name === playerName || p.id === playerId) + 1;

  // ==========================================
  // RENDER: 1. WAITING / LOBBY ROOM
  // ==========================================
  if (gameState.phase === "waiting") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 max-w-lg mx-auto">
        <header className="w-full text-center pt-6 pb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Sala de Espera
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Rapidagil IT</h1>
          <p className="text-slate-400 text-sm mt-1">El anfitrión iniciará la partida en breve...</p>
        </header>

        {/* My Player Banner */}
        <div className="w-full glass-panel rounded-2xl p-5 border border-slate-800 flex items-center justify-between shadow-xl my-4">
          <div className="flex items-center gap-3.5">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-slate-950 text-xl shadow-md"
              style={{ backgroundColor: avatarColor }}
            >
              {playerName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Jugando como</span>
              <h3 className="text-lg font-bold text-white truncate max-w-[180px]">{playerName}</h3>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-emerald-400 font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              Conectado
            </span>
          </div>
        </div>

        {/* Joined Players List */}
        <div className="w-full glass-panel rounded-2xl p-5 border border-slate-800 flex-1 flex flex-col min-h-[260px] max-h-[380px] mb-4 overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Jugadores en la sala</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300">
              {players.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto py-3 space-y-2 pr-1">
            {players.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-8">
                <Users className="w-8 h-8 mb-2 opacity-40 animate-pulse" />
                <p className="text-sm">Esperando a que se unan los demás jugadores...</p>
              </div>
            ) : (
              players.map((p, idx) => (
                <div
                  key={p.id || idx}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                    p.name === playerName
                      ? "bg-cyan-500/10 border-cyan-500/40 shadow-sm"
                      : "bg-slate-900/60 border-slate-800/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-slate-950 text-xs shadow-inner"
                      style={{ backgroundColor: p.avatar_color || "#38bdf8" }}
                    >
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-medium text-sm text-slate-200 truncate max-w-[170px]">
                      {p.name} {p.name === playerName && <span className="text-xs text-cyan-400">(Tú)</span>}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">#{idx + 1}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer info */}
        <footer className="w-full text-center py-2 text-xs text-slate-500">
          <span>La partida comenzará tan pronto como el organizador dé inicio.</span>
        </footer>
      </main>
    );
  }

  // ==========================================
  // RENDER: 2. QUESTION & REVEAL PHASES
  // ==========================================
  if (gameState.phase === "question" || gameState.phase === "reveal") {
    const isReveal = gameState.phase === "reveal";
    const timerPercent = (timeLeft / QUESTION_DURATION) * 100;
    const isUrgent = timeLeft <= 5;

    return (
      <main className="min-h-screen flex flex-col justify-between p-3 sm:p-6 max-w-lg mx-auto select-none">
        {/* Top Header Bar */}
        <div className="w-full space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700 font-bold text-white">
                Pregunta {gameState.question_index + 1} / {gameState.total_questions}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-semibold">
                {currentQuestion.category}
              </span>
            </div>

            {/* My Score Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold">
              <Trophy className="w-3.5 h-3.5 text-cyan-400" />
              <span>{myPlayer?.score || 0} pts</span>
              {myRank > 0 && <span className="text-slate-400 font-normal ml-1">#{myRank}</span>}
            </div>
          </div>

          {/* 15-Second Progress Timer Bar */}
          <div className="w-full h-2.5 bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isUrgent ? "bg-rose-500 shadow-lg shadow-rose-500/50" : "bg-gradient-to-r from-cyan-400 to-blue-500"
              }`}
              style={{ width: `${timerPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs px-1">
            <div className="flex items-center gap-1.5 font-bold font-mono">
              <Timer className={`w-3.5 h-3.5 ${isUrgent ? "text-rose-400 animate-bounce" : "text-cyan-400"}`} />
              <span className={isUrgent ? "text-rose-400 font-extrabold" : "text-slate-300"}>
                {timeLeft}s restantes
              </span>
            </div>
            <span className="text-amber-400 font-semibold text-[11px] flex items-center gap-1">
              <Zap className="w-3 h-3" /> ¡Acierta rápido = hasta +15 pts!
            </span>
          </div>
        </div>

        {/* Reveal Overlay Banner */}
        {isReveal && (
          <div className="w-full my-2 animate-fade-in">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-2 border-emerald-500 text-center shadow-xl shadow-emerald-500/20">
              <div className="inline-flex items-center gap-2 text-emerald-400 font-extrabold text-sm uppercase tracking-wide">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Respuesta Correcta: Opción {currentQuestion.answer}
              </div>

              {/* Personal round score feedback */}
              {answerResult?.isCorrect ? (
                <p className="text-emerald-300 font-bold text-xs mt-1.5 bg-emerald-500/10 py-1 px-3 rounded-full inline-block border border-emerald-500/30">
                  🎉 ¡Sumaste +{answerResult.pointsEarned} puntos en esta ronda!
                </p>
              ) : answerResult ? (
                <p className="text-rose-300 text-xs mt-1.5">
                  Marcaste opción incorrecta (+0 pts). ¡A por la siguiente!
                </p>
              ) : (
                <p className="text-slate-400 text-xs mt-1.5">
                  No enviaste respuesta a tiempo (+0 pts).
                </p>
              )}
            </div>
          </div>
        )}

        {/* Question Concept Card */}
        <div className="w-full glass-panel rounded-2xl p-5 sm:p-6 border border-slate-700/80 shadow-2xl my-auto">
          <span className="text-xs uppercase tracking-wider font-extrabold text-cyan-400 mb-2 block">
            Concepto #{gameState.question_index + 1}
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
            {currentQuestion.question}
          </h2>

          {/* Explanation during reveal */}
          {isReveal && (
            <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800 animate-fade-in">
              <strong className="text-cyan-400 block mb-1">💡 Explicación:</strong>
              {currentQuestion.explanation}
            </div>
          )}
        </div>

        {/* 4 Interactive Option Buttons */}
        <div className="w-full grid grid-cols-1 gap-3 my-3">
          {(["A", "B", "C", "D"] as Option[]).map((opt) => {
            const style = OPTION_STYLES[opt];
            const isSelectedByMe = selectedAnswer === opt;
            const isCorrectAnswer = isReveal && currentQuestion.answer === opt;
            const isWrongAnswer = isReveal && isSelectedByMe && currentQuestion.answer !== opt;

            let buttonClass = `${style.bg} ${style.border} ${style.glow}`;

            if (isCorrectAnswer) {
              buttonClass = "bg-emerald-500/25 border-emerald-400 shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400";
            } else if (isWrongAnswer) {
              buttonClass = "bg-rose-500/20 border-rose-500/60 opacity-60";
            } else if (isSelectedByMe) {
              buttonClass = "bg-cyan-500/30 border-cyan-400 ring-2 ring-cyan-400/80 shadow-lg shadow-cyan-500/30";
            } else if (selectedAnswer && !isReveal) {
              buttonClass = "opacity-40 pointer-events-none border-slate-800 bg-slate-900/40";
            }

            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelectOption(opt)}
                disabled={Boolean(selectedAnswer) || isReveal}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all transform active:scale-[0.98] flex items-start gap-3.5 relative overflow-hidden cursor-pointer ${buttonClass}`}
              >
                {/* Option Letter Badge */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-sm flex-shrink-0 font-mono ${
                    isCorrectAnswer
                      ? "bg-emerald-400 text-slate-950 font-bold"
                      : isSelectedByMe
                      ? "bg-cyan-400 text-slate-950"
                      : "bg-slate-800 text-white border border-slate-700"
                  }`}
                >
                  {opt}
                </div>

                <div className="flex-1 text-sm font-semibold text-slate-100 leading-snug pt-1">
                  {currentQuestion.options[opt]}
                </div>

                {isCorrectAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1" />
                )}
                {isWrongAnswer && (
                  <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom feedback status */}
        <div className="w-full text-center py-2 min-h-[32px] text-xs">
          {selectedAnswer && !isReveal && (
            <div className="inline-flex items-center gap-2 text-cyan-300 bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/30 animate-pulse font-medium">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>
                Respuesta registrada (Opción {selectedAnswer}). Esperando a que termine el tiempo ({timeLeft}s)...
              </span>
            </div>
          )}
        </div>
      </main>
    );
  }

  // ==========================================
  // RENDER: 3. FINISHED / PODIUM SCREEN
  // ==========================================
  if (gameState.phase === "finished") {
    const top3 = players.slice(0, 3);

    return (
      <main className="min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 max-w-lg mx-auto">
        <header className="w-full text-center pt-4 pb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-3 animate-bounce">
            <Trophy className="w-4 h-4 text-amber-400" />
            ¡Partida Finalizada!
          </div>
          <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
            Podio de Ganadores
          </h1>
          <p className="text-slate-400 text-xs mt-1">Puntaje total acumulado por velocidad y aciertos</p>
        </header>

        {/* Top 3 Podium Cards */}
        <div className="w-full my-4 flex items-end justify-center gap-2 sm:gap-3 pt-6">
          {/* 2nd Place */}
          {top3[1] && (
            <div className="flex-1 flex flex-col items-center">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-slate-950 text-base shadow-md mb-2 border-2 border-slate-300"
                style={{ backgroundColor: top3[1].avatar_color || "#94a3b8" }}
              >
                {top3[1].name.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-xs font-bold text-slate-200 truncate max-w-[90px] text-center">
                {top3[1].name}
              </span>
              <span className="text-xs text-slate-400 font-semibold">{top3[1].score} pts</span>
              <div className="w-full h-24 bg-gradient-to-t from-slate-800 to-slate-700/80 rounded-t-xl mt-2 flex flex-col items-center justify-center border-t-2 border-slate-300">
                <span className="text-2xl font-black text-slate-300">2°</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Plata</span>
              </div>
            </div>
          )}

          {/* 1st Place - Champion */}
          {top3[0] && (
            <div className="flex-[1.2] flex flex-col items-center -mt-6">
              <Crown className="w-8 h-8 text-amber-400 fill-amber-400 animate-bounce mb-1" />
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-slate-950 text-xl shadow-xl shadow-amber-500/30 mb-2 border-2 border-amber-400 ring-4 ring-amber-400/20"
                style={{ backgroundColor: top3[0].avatar_color || "#f59e0b" }}
              >
                {top3[0].name.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-sm font-extrabold text-amber-300 truncate max-w-[110px] text-center">
                {top3[0].name}
              </span>
              <span className="text-xs text-amber-200 font-bold">{top3[0].score} pts</span>
              <div className="w-full h-32 bg-gradient-to-t from-amber-600/40 via-amber-500/30 to-amber-400/20 rounded-t-2xl mt-2 flex flex-col items-center justify-center border-t-4 border-amber-400 shadow-lg shadow-amber-500/20">
                <span className="text-3xl font-black text-amber-300">1°</span>
                <span className="text-xs uppercase tracking-wider text-amber-400 font-black">Campeón</span>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {top3[2] && (
            <div className="flex-1 flex flex-col items-center">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-slate-950 text-base shadow-md mb-2 border-2 border-amber-700"
                style={{ backgroundColor: top3[2].avatar_color || "#b45309" }}
              >
                {top3[2].name.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-xs font-bold text-slate-200 truncate max-w-[90px] text-center">
                {top3[2].name}
              </span>
              <span className="text-xs text-slate-400 font-semibold">{top3[2].score} pts</span>
              <div className="w-full h-20 bg-gradient-to-t from-slate-900 to-amber-950/60 rounded-t-xl mt-2 flex flex-col items-center justify-center border-t-2 border-amber-700">
                <span className="text-xl font-black text-amber-600">3°</span>
                <span className="text-[10px] uppercase tracking-wider text-amber-600/80 font-bold">Bronce</span>
              </div>
            </div>
          )}
        </div>

        {/* Full Leaderboard */}
        <div className="w-full glass-panel rounded-2xl p-4 border border-slate-800 flex-1 max-h-[220px] overflow-y-auto mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            Tabla General de Posiciones
          </h3>

          <div className="space-y-1.5">
            {players.map((p, idx) => (
              <div
                key={p.id || idx}
                className={`flex items-center justify-between p-2 rounded-xl border text-xs ${
                  p.name === playerName
                    ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-bold"
                    : "bg-slate-900/50 border-slate-800/80 text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 text-center font-bold text-slate-400">#{idx + 1}</span>
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center font-bold text-slate-950 text-[10px]"
                    style={{ backgroundColor: p.avatar_color || "#38bdf8" }}
                  >
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="truncate max-w-[150px]">{p.name} {p.name === playerName && "(Tú)"}</span>
                </div>
                <span className="font-mono font-bold text-white">{p.score} pts</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Round Banner / Live sync indicator */}
        <div className="w-full text-center p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 mb-3 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Esperando que el organizador inicie una nueva partida...</span>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("rapidagil_player_name");
              localStorage.removeItem("rapidagil_player_id");
              router.push("/");
            }}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <span>Cambiar de Jugador / Salir</span>
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20 flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <HomeIcon className="w-4 h-4" />
            <span>Volver al Inicio</span>
          </button>
        </div>
      </main>
    );
  }

  return null;
}
