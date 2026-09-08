"use server";

import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { QUESTIONS } from "@/data/questions";
import { Option, GamePhase } from "@/lib/types";

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
    .single();

  if (existingPlayer) {
    // Actualizar nombre y avatar si cambió
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
  selected: Option
) {
  if (!isSupabaseConfigured) {
    return { success: true, isDemo: true, isCorrect: true };
  }

  const question = QUESTIONS[questionIndex];
  if (!question) {
    return { success: false, error: "Pregunta no encontrada" };
  }

  const isCorrect = question.answer === selected;

  // Registrar respuesta en la tabla answers
  const { error: answerError } = await supabase.from("answers").insert({
    player_id: playerId,
    player_name: playerName,
    question_index: questionIndex,
    selected: selected,
    is_correct: isCorrect,
    answered_at: new Date().toISOString(),
  });

  // Si ya había respondido (error de constraint único), ignorar
  if (answerError && answerError.code === "23505") {
    return { success: false, alreadyAnswered: true };
  }

  // Si acertó, verificar si el juego sigue en fase 'question' para esta misma pregunta
  if (isCorrect) {
    const { data: currentGame } = await supabase
      .from("game")
      .select("phase, question_index, winner_of_question")
      .eq("id", 1)
      .single();

    if (
      currentGame &&
      currentGame.phase === "question" &&
      currentGame.question_index === questionIndex &&
      !currentGame.winner_of_question
    ) {
      // Este jugador fue el PRIMERO en acertar
      // 1. Incrementar puntuación del jugador
      const { data: player } = await supabase
        .from("players")
        .select("score")
        .eq("id", playerId)
        .single();

      if (player) {
        await supabase
          .from("players")
          .update({ score: (player.score || 0) + 1 })
          .eq("id", playerId);
      }

      // 2. Marcar en game que hubo ganador y pasar a 'reveal'
      await supabase
        .from("game")
        .update({
          phase: "reveal",
          winner_of_question: playerName,
          last_correct_answer: question.answer,
          updated_at: new Date().toISOString(),
        })
        .eq("id", 1);

      return { success: true, isCorrect: true, firstWinner: true };
    }
  }

  return { success: true, isCorrect: isCorrect, firstWinner: false };
}

export async function advanceToNextQuestionAction(currentQuestionIndex: number) {
  if (!isSupabaseConfigured) return { success: true };

  const { data: game } = await supabase
    .from("game")
    .select("total_questions, question_index")
    .eq("id", 1)
    .single();

  const total = game?.total_questions || 20;
  const nextIdx = currentQuestionIndex + 1;

  if (nextIdx >= total || nextIdx >= QUESTIONS.length) {
    // Fin del juego
    await supabase
      .from("game")
      .update({
        phase: "finished",
        winner_of_question: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);
  } else {
    // Siguiente pregunta
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

export async function timeoutQuestionAction(questionIndex: number) {
  if (!isSupabaseConfigured) return { success: true };

  const question = QUESTIONS[questionIndex];
  const { data: game } = await supabase
    .from("game")
    .select("phase, question_index")
    .eq("id", 1)
    .single();

  // Solo cambiar si aún sigue en fase question para esa pregunta
  if (game && game.phase === "question" && game.question_index === questionIndex) {
    await supabase
      .from("game")
      .update({
        phase: "reveal",
        winner_of_question: null,
        last_correct_answer: question ? question.answer : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);
  }

  return { success: true };
}

export async function startGameAction(totalQuestions: number = 20) {
  if (!isSupabaseConfigured) return { success: true };

  // Reiniciar puntajes de jugadores
  await supabase.from("players").update({ score: 0 }).neq("id", "00000000-0000-0000-0000-000000000000");

  // Limpiar respuestas previas
  await supabase.from("answers").delete().neq("id", -1);

  // Iniciar juego en la pregunta 0
  const count = Math.min(Math.max(5, totalQuestions), QUESTIONS.length);

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

  await supabase.from("answers").delete().neq("id", -1);
  await supabase.from("players").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await resetGameAction();

  return { success: true };
}
