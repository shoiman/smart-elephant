-- Seed a test child (id=1) used by the frontend's MOCK_CHILD_ID during Phase 5 development
INSERT INTO children (name, age, language)
SELECT 'Тестовый ребёнок', 4, 'ru'
WHERE NOT EXISTS (SELECT 1 FROM children WHERE id = 1);
