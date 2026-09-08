"use server";

import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { QUESTIONS } from "@/data/questions";
import { Option } from "@/lib/types";

export async function joinGameAction(name: string, deviceId: string, avatarColor: string = "#38bdf8") {
  if (!isSupabaseConfigured) {
    return { success: true, isDemo: true, playerId: `demo-${deviceId}` };
  }

  const cleanName = name.trim().slice(0, 25);
  if (!cleanName) {
    return { success: false, error: "El nombre es obligatorio" };
  }

  // Buscar si ya existe por device_id
  const { data: existingPlayer } = await supabase
    .from("players")
    .select("id, name, score, avatar_color")
    .eq("device_id", deviceId)
    .maybeSingle();

  if (existingPlayer) {
    await supabase
      .from("players")
      .update({ name: cleanName, avatar_color: avatarColor, last_seen: new Date().toISOString() })
      .eq("id", existingPlayer.id);

    return { success: true, playerId: existingPlayer.id, name: cleanName };
  }

  // Insertar nuevo jugador
  const { data: newPlayer, error } = await supabase
    .from("players")
    .insert({
      name: cleanName,
      device_id: deviceId,
      score: 0,
      avatar_color: avatarColor,
      joined_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error al unirse a la partida:", error);
    return { success: false, error: error.message };
  }

  return { success: true, playerId: newPlayer.id, name: cleanName };
}

export async function submitAnswerAction(
  playerId: string,
  playerName: string,
  questionIndex: number,
  selected: Option,
  remainingSeconds: number = 15
) {
  if (!isSupabaseConfigured) {
    const isCorrect = QUESTIONS[questionIndex]?.answer === selected;
    const points = isCorrect ? Math.max(1, Math.min(15, Math.round(remainingSeconds))) : 0;
    return { success: true, isDemo: true, isCorrect, pointsEarned: points };
  }

  const question = QUESTIONS[questionIndex];
  if (!question) {
    return { success: false, error: "Pregunta no encontrada" };
  }

  // Comprobar si ya respondió para evitar duplicados
  const { data: existingAnswer } = await supabase
    .from("answers")
    .select("id")
    .eq("player_id", playerId)
    .eq("question_index", questionIndex)
    .maybeSingle();

  if (existingAnswer) {
    return { success: false, alreadyAnswered: true };
  }

  const isCorrect = question.answer === selected;
  // Puntos basados en el tiempo restante: Ej. 14s restantes = 14 puntos
  const pointsEarned = isCorrect ? Math.max(1, Math.min(15, Math.round(remainingSeconds))) : 0;

  // Registrar la respuesta del jugador
  await supabase.from("answers").insert({
    player_id: playerId,
    player_name: playerName,
    question_index: questionIndex,
    selected: selected,
    is_correct: isCorrect,
    answered_at: new Date().toISOString(),
  });

  // Si acertó, sumar sus puntos calculados según la velocidad
  if (isCorrect && pointsEarned > 0) {
    const { data: player } = await supabase
      .from("players")
      .select("score")
      .eq("id", playerId)
      .maybeSingle();

    if (player) {
      await supabase
        .from("players")
        .update({ score: (player.score || 0) + pointsEarned })
        .eq("id", playerId);
    }
  }

  return {
    success: true,
    isCorrect,
    pointsEarned,
  };
}

export async function timeoutQuestionAction(questionIndex: number) {
  if (!isSupabaseConfigured) return { success: true };

  const question = QUESTIONS[questionIndex];
  const { data: game } = await supabase
    .from("game")
    .select("phase, question_index")
    .eq("id", 1)
    .maybeSingle();

  // Cambiar a fase 'reveal' cuando se termina el tiempo de 15s
  if (game && game.phase === "question" && game.question_index === questionIndex) {
    const { data: correctAnswers } = await supabase
      .from("answers")
      .select("player_name")
      .eq("question_index", questionIndex)
      .eq("is_correct", true)
      .order("answered_at", { ascending: true })
      .limit(1);

    const fastestWinner = correctAnswers && correctAnswers.length > 0 ? correctAnswers[0].player_name : null;

    await supabase
      .from("game")
      .update({
        phase: "reveal",
        winner_of_question: fastestWinner,
        last_correct_answer: question ? question.answer : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);
  }

  return { success: true };
}

export async function advanceToNextQuestionAction(currentQuestionIndex: number) {
  if (!isSupabaseConfigured) return { success: true };

  const { data: game } = await supabase
    .from("game")
    .select("total_questions, question_index, phase")
    .eq("id", 1)
    .maybeSingle();

  if (!game) return { success: false };

  const total = game.total_questions || 20;
  const nextIdx = currentQuestionIndex + 1;

  if (nextIdx >= total || nextIdx >= QUESTIONS.length) {
    // Fin del juego -> Podio
    await supabase
      .from("game")
      .update({
        phase: "finished",
        winner_of_question: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);
  } else {
    // Siguiente pregunta con 15 segundos completos
    await supabase
      .from("game")
      .update({
        phase: "question",
        question_index: nextIdx,
        question_started_at: new Date().toISOString(),
        winner_of_question: null,
        last_correct_answer: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);
  }

  return { success: true };
}

export async function startGameAction(totalQuestions: number = 20) {
  if (!isSupabaseConfigured) return { success: true };

  // 1. Reiniciar puntajes de todos los jugadores a 0
  await supabase.from("players").update({ score: 0 }).not("id", "is", null);

  // 2. Limpiar historial de respuestas de partidas anteriores
  await supabase.from("answers").delete().gte("id", 0);

  const count = Math.min(Math.max(5, totalQuestions), QUESTIONS.length);

  // 3. Iniciar juego en la pregunta 0
  await supabase
    .from("game")
    .update({
      phase: "question",
      question_index: 0,
      question_started_at: new Date().toISOString(),
      total_questions: count,
      winner_of_question: null,
      last_correct_answer: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  return { success: true };
}

export async function resetGameAction() {
  if (!isSupabaseConfigured) return { success: true };

  // Reiniciar puntajes a 0 y limpiar respuestas
  await supabase.from("players").update({ score: 0 }).not("id", "is", null);
  await supabase.from("answers").delete().gte("id", 0);

  // Volver a sala de espera
  await supabase
    .from("game")
    .update({
      phase: "waiting",
      question_index: 0,
      question_started_at: null,
      winner_of_question: null,
      last_correct_answer: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  return { success: true };
}

export async function clearAllPlayersAction() {
  if (!isSupabaseConfigured) return { success: true };

  // Borrar todas las respuestas y todos los jugadores
  await supabase.from("answers").delete().gte("id", 0);
  await supabase.from("players").delete().not("id", "is", null);

  // Volver a sala de espera limpia
  await supabase
    .from("game")
    .update({
      phase: "waiting",
      question_index: 0,
      question_started_at: null,
      winner_of_question: null,
      last_correct_answer: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  return { success: true };
}
