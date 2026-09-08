-- Create ANIMALS table
CREATE TABLE IF NOT EXISTS animals (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    habitat VARCHAR(50) NOT NULL,
    description TEXT,
    facts_json TEXT,  -- JSON as text for now, proper jsonb mapping planned for Phase 3 (RAG)
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_animal_name UNIQUE(name)
);

-- Create CHILDREN table
CREATE TABLE IF NOT EXISTS children (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 2 AND age <= 6),
    language VARCHAR(10) NOT NULL DEFAULT 'he',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create GAME_SESSIONS table
CREATE TABLE IF NOT EXISTS game_sessions (
    id BIGSERIAL PRIMARY KEY,
    child_id BIGINT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    total_questions INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    session_score NUMERIC(5,2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create ANSWERS table
CREATE TABLE IF NOT EXISTS answers (
    id BIGSERIAL PRIMARY KEY,
    game_session_id BIGINT NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
    animal_id BIGINT NOT NULL REFERENCES animals(id),
    question_text TEXT NOT NULL,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    response_time_ms INTEGER,
    answered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create PROGRESS table
CREATE TABLE IF NOT EXISTS progress (
    id BIGSERIAL PRIMARY KEY,
    child_id BIGINT NOT NULL UNIQUE REFERENCES children(id) ON DELETE CASCADE,
    total_games INTEGER DEFAULT 0,
    total_correct INTEGER DEFAULT 0,
    success_rate NUMERIC(5,2),
    current_level VARCHAR(20) DEFAULT 'EASY',
    last_game_at TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_game_sessions_child_id ON game_sessions(child_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_created ON game_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_answers_session_id ON answers(game_session_id);
CREATE INDEX IF NOT EXISTS idx_answers_animal_id ON answers(animal_id);
CREATE INDEX IF NOT EXISTS idx_animals_habitat ON animals(habitat);
