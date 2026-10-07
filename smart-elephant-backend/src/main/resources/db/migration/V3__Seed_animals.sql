-- Seed base set of animals used by the game (matches frontend animal list)
INSERT INTO animals (name, habitat, description)
SELECT 'Elephant', 'savanna', 'A large mammal known for its trunk and big ears.'
WHERE NOT EXISTS (SELECT 1 FROM animals WHERE name = 'Elephant');

INSERT INTO animals (name, habitat, description)
SELECT 'Lion', 'savanna', 'The king of the savanna, known for its mane and roar.'
WHERE NOT EXISTS (SELECT 1 FROM animals WHERE name = 'Lion');

INSERT INTO animals (name, habitat, description)
SELECT 'Penguin', 'savanna', 'A flightless bird that loves cold water and ice.'
WHERE NOT EXISTS (SELECT 1 FROM animals WHERE name = 'Penguin');

INSERT INTO animals (name, habitat, description)
SELECT 'Giraffe', 'savanna', 'The tallest land animal, known for its long neck.'
WHERE NOT EXISTS (SELECT 1 FROM animals WHERE name = 'Giraffe');

INSERT INTO animals (name, habitat, description)
SELECT 'Hippopotamus', 'savanna', 'A large semi-aquatic mammal that lives near rivers.'
WHERE NOT EXISTS (SELECT 1 FROM animals WHERE name = 'Hippopotamus');

INSERT INTO animals (name, habitat, description)
SELECT 'Zebra', 'savanna', 'A horse-like animal known for its black and white stripes.'
WHERE NOT EXISTS (SELECT 1 FROM animals WHERE name = 'Zebra');

INSERT INTO animals (name, habitat, description)
SELECT 'Leopard', 'savanna', 'A powerful big cat known for its spotted coat.'
WHERE NOT EXISTS (SELECT 1 FROM animals WHERE name = 'Leopard');
