-- Progress details for the new results screens (stars for the child, progress for the parent)

-- Which question topic an answer belongs to, which attempt it was and how it ended
ALTER TABLE answers ADD COLUMN topic VARCHAR(20);                    -- HABITAT, COLOR, ... (from Question.topic)
ALTER TABLE answers ADD COLUMN attempt SMALLINT NOT NULL DEFAULT 1;  -- 1 or 2
ALTER TABLE answers ADD COLUMN outcome VARCHAR(16);                  -- FIRST_TRY | SECOND_TRY | TOGETHER
-- Answers saved before this migration keep topic and outcome NULL and are left out of the answer statistics

-- Denominator of success_rate: questions, not games (bug: 43 correct / 11 games = 391%)
ALTER TABLE progress ADD COLUMN total_questions INTEGER DEFAULT 0;

-- Animals the child has collected in the album
CREATE TABLE child_stickers (
    child_id  BIGINT    NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    animal_id BIGINT    NOT NULL REFERENCES animals(id),
    earned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (child_id, animal_id)
);

CREATE INDEX idx_answers_session_topic ON answers(game_session_id, topic);

-- One-time recalculation of existing progress with the fixed rules:
-- success_rate = correct / questions over all completed games, capped at 100;
-- level from the last 5 completed games: < 50% EASY, 50-80% MEDIUM, > 80% HARD
WITH totals AS (
    SELECT child_id,
           COUNT(*)             AS games,
           SUM(correct_answers) AS correct,
           SUM(total_questions) AS questions
    FROM game_sessions
    WHERE completed_at IS NOT NULL
    GROUP BY child_id
),
recent AS (
    SELECT child_id,
           SUM(correct_answers) AS correct,
           SUM(total_questions) AS questions
    FROM (
        SELECT child_id, correct_answers, total_questions,
               ROW_NUMBER() OVER (PARTITION BY child_id ORDER BY completed_at DESC) AS game_number
        FROM game_sessions
        WHERE completed_at IS NOT NULL
    ) numbered
    WHERE game_number <= 5
    GROUP BY child_id
)
UPDATE progress p
SET total_games     = t.games,
    total_correct   = t.correct,
    total_questions = t.questions,
    success_rate    = CASE WHEN t.questions > 0
                           THEN LEAST(100, ROUND(t.correct * 100.0 / t.questions, 2))
                           ELSE 0 END,
    current_level   = CASE WHEN r.questions IS NULL OR r.questions = 0 THEN 'EASY'
                           WHEN r.correct * 100.0 / r.questions < 50 THEN 'EASY'
                           WHEN r.correct * 100.0 / r.questions <= 80 THEN 'MEDIUM'
                           ELSE 'HARD' END
FROM totals t
LEFT JOIN recent r ON r.child_id = t.child_id
WHERE p.child_id = t.child_id;
