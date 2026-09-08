export type Option = "A" | "B" | "C" | "D";
export type GamePhase = "waiting" | "question" | "reveal" | "finished";

export interface Question {
  id: number;
  category: "Redes" | "Bases de Datos" | "Programación" | "Cloud & DevOps" | "Ciberseguridad";
  question: string;
  codeSnippet?: string;
  options: Record<Option, string>;
  answer: Option;
  explanation: string;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  device_id: string;
  joined_at: string;
  avatar_color?: string;
}

export interface GameState {
  id: number;
  phase: GamePhase;
  question_index: number;
  question_started_at: string | null;
  total_questions: number;
  winner_of_question: string | null;
  last_correct_answer: Option | null;
}

export interface AnswerRecord {
  player_id: string;
  player_name: string;
  question_index: number;
  selected: Option;
  is_correct: boolean;
  points_earned: number;
  answered_at: string;
}
