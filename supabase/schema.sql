-- ==========================================================
-- RAPIDAGIL IT — Esquema de Base de Datos Supabase (PostgreSQL)
-- Ejecuta este script completo en el SQL Editor de tu proyecto Supabase
-- ==========================================================

-- 1. Tabla de Estado Global del Juego (Una sola fila id = 1)
CREATE TABLE IF NOT EXISTS game (
  id INT PRIMARY KEY DEFAULT 1,
  phase TEXT NOT NULL DEFAULT 'waiting', -- 'waiting' | 'question' | 'reveal' | 'finished'
  question_index INT NOT NULL DEFAULT 0,
  question_started_at TIMESTAMPTZ,
  total_questions INT NOT NULL DEFAULT 20,
  winner_of_question TEXT,
  last_correct_answer TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar fila inicial si no existe
INSERT INTO game (id, phase, question_index, total_questions)
VALUES (1, 'waiting', 0, 20)
ON CONFLICT (id) DO NOTHING;

-- 2. Tabla de Jugadores
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  score INT NOT NULL DEFAULT 0,
  device_id TEXT NOT NULL UNIQUE,
  avatar_color TEXT DEFAULT '#38bdf8',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de Respuestas
CREATE TABLE IF NOT EXISTS answers (
  id BIGSERIAL PRIMARY KEY,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  question_index INT NOT NULL,
  selected TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_player_question UNIQUE (player_id, question_index)
);

-- 4. Habilitar Row Level Security (RLS) y permitir lectura/escritura pública anónima
ALTER TABLE game ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Políticas para game
DROP POLICY IF EXISTS "Permitir todo en game" ON game;
CREATE POLICY "Permitir todo en game" ON game FOR ALL USING (true) WITH CHECK (true);

-- Políticas para players
DROP POLICY IF EXISTS "Permitir todo en players" ON players;
CREATE POLICY "Permitir todo en players" ON players FOR ALL USING (true) WITH CHECK (true);

-- Políticas para answers
DROP POLICY IF EXISTS "Permitir todo en answers" ON answers;
CREATE POLICY "Permitir todo en answers" ON answers FOR ALL USING (true) WITH CHECK (true);

-- 5. Habilitar Supabase Realtime para sincronizar cambios en vivo
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE game, players;
  EXCEPTION
    WHEN duplicate_object THEN
      NULL;
  END;
END $$;
