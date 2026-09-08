# Smart Elephant Backend 🐘

AI-powered speech development game backend for children aged 2-6.

**Status**: Phase 1 - Backend Foundation (In Progress)

## Architecture

```
Frontend (React)
    ↓ REST API
Spring Boot Backend
    ├─ GameService (game management)
    ├─ QuestionService (question generation)
    ├─ LLMService (Claude API integration)
    └─ Controllers (REST endpoints)
    ↓
PostgreSQL (game data)
Redis (caching - Phase 2)
```

## Tech Stack

- **Java 21** with Spring Boot 3.3.2
- **PostgreSQL** for database
- **Redis** for caching (Phase 2)
- **Claude API** for LLM integration
- **Maven** for dependency management
- **Flyway** for database migrations

## Prerequisites

- Java 21+
- Maven 3.9+
- PostgreSQL 14+
- Redis (optional for Phase 1, required Phase 2+)

## Quick Start

### 1. Database Setup

```bash
# Create database
createdb smart_elephant

# Verify connection
psql -U postgres -d smart_elephant -c "SELECT 1"
```

### 2. Build & Run

```bash
# Build project
mvn clean build

# Run application
mvn spring-boot:run
```

Server starts at: `http://localhost:8080/api`

### 3. Create Test Child & Animal

```bash
# Insert test data (after starting server)
psql -U postgres -d smart_elephant << EOF
INSERT INTO children (name, age, language) VALUES ('Test Child', 4, 'en');
INSERT INTO animals (name, habitat, description) VALUES 
  ('Lion', 'savanna', 'Large carnivorous cat'),
  ('Elephant', 'savanna', 'Large herbivorous mammal'),
  ('Giraffe', 'savanna', 'Tall herbivorous mammal');
EOF
```

## API Endpoints

### Game Management

```bash
# Start a new game
POST /api/games/start
{
  "childId": 1,
  "numQuestions": 5
}

# Submit an answer
POST /api/games/answer
{
  "gameSessionId": 1,
  "questionId": "q-123",
  "animalId": 1,
  "answer": "Savanna",
  "responseTimeMs": 3500
}

# End game session
POST /api/games/{sessionId}/end
```

### Question Generation

```bash
# Get next question
GET /api/questions/next?childId=1
```

Response:
```json
{
  "questionId": "q-456",
  "animalId": 1,
  "animalName": "Lion",
  "questionText": "Where does a lion live?",
  "difficulty": "MEDIUM",
  "hints": ["Think about where this animal lives"],
  "createdAt": "2026-09-07T10:00:00"
}
```

### Animals

```bash
# Get all animals
GET /api/animals

# Get animal by ID
GET /api/animals/1

# Create animal
POST /api/animals
{
  "name": "Tiger",
  "habitat": "forest",
  "description": "Striped carnivorous cat"
}
```

## Project Structure

```
smart-elephant-backend/
├── src/main/java/com/smartelephant/
│   ├── SmartElephantApplication.java    # Main entry point
│   ├── controller/                      # REST API
│   │   ├── GameController.java
│   │   ├── QuestionController.java
│   │   └── AnimalController.java
│   ├── service/                         # Business logic
│   │   ├── GameService.java
│   │   ├── QuestionService.java
│   │   └── LLMService.java
│   ├── model/
│   │   ├── entity/                     # JPA Entities
│   │   │   ├── Animal.java
│   │   │   ├── Child.java
│   │   │   ├── GameSession.java
│   │   │   ├── Answer.java
│   │   │   └── Progress.java
│   │   ├── dto/                        # Data Transfer Objects
│   │   └── enum/                       # Enums
│   │       └── QuestionDifficulty.java
│   └── repository/                     # Data Access Layer
│       ├── AnimalRepository.java
│       ├── ChildRepository.java
│       ├── GameSessionRepository.java
│       ├── AnswerRepository.java
│       └── ProgressRepository.java
├── src/main/resources/
│   ├── application.yaml                # Configuration
│   └── db/migration/
│       └── V1__Create_tables.sql       # Database schema
├── pom.xml                             # Maven dependencies
└── README.md
```

## Phase 1 Implementation

### ✅ Completed

- [x] Maven project setup
- [x] Database entities (Animal, Child, GameSession, Answer, Progress)
- [x] Repositories (JPA)
- [x] REST API Controllers
- [x] GameService (start game, submit answer, end game)
- [x] QuestionService (generate next question)
- [x] LLMService (mock for Phase 1)
- [x] Flyway migrations
- [x] Application configuration

### Current Status

Game flow works:
1. ✅ Client calls `POST /games/start` → game session created
2. ✅ Client calls `GET /questions/next?childId=1` → question generated
3. ✅ Client calls `POST /games/answer` → answer validated
4. ✅ Client calls `POST /games/{id}/end` → game completed, progress updated

### 🚀 Phase 2 (Next)

- [ ] Claude API integration (real API calls, not mock)
- [ ] Prompt caching
- [ ] Redis caching
- [ ] Performance optimization

### 📋 Phase 3-5

- RAG system with pgvector
- Long-context progress analysis
- Frontend integration
- Deployment

## Configuration

### application.yaml

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/smart_elephant
    username: postgres
    password: password

app:
  claude:
    api-key: ${CLAUDE_API_KEY}  # Set this environment variable
    model: claude-3-5-sonnet-20241022
    max-tokens: 500
```

### Environment Variables

```bash
export CLAUDE_API_KEY="sk-ant-xxx..."
```

## Testing

### Manual Testing with curl

```bash
# 1. Create a child
curl -X POST http://localhost:8080/api/animals \
  -H "Content-Type: application/json" \
  -d '{"name":"Lion","habitat":"savanna","description":"Large cat"}'

# 2. Start a game
curl -X POST http://localhost:8080/api/games/start \
  -H "Content-Type: application/json" \
  -d '{"childId":1,"numQuestions":5}'

# 3. Get next question
curl "http://localhost:8080/api/questions/next?childId=1"

# 4. Submit answer
curl -X POST http://localhost:8080/api/games/answer \
  -H "Content-Type: application/json" \
  -d '{"gameSessionId":1,"questionId":"q-1","animalId":1,"answer":"Savanna","responseTimeMs":3000}'

# 5. End game
curl -X POST http://localhost:8080/api/games/1/end
```

## Development Tips

### Enable debug logging

```yaml
logging:
  level:
    com.smartelephant: DEBUG
    org.springframework.web: DEBUG
```

### Database inspection

```bash
# Connect to database
psql -U postgres -d smart_elephant

# View tables
\dt

# View data
SELECT * FROM children;
SELECT * FROM game_sessions;
SELECT * FROM answers;
```

## Performance Targets

| Metric | Target |
|--------|--------|
| Question Generation | < 2 sec |
| Answer Validation | < 1 sec |
| API Response Time | < 500 ms |
| Cache Hit Rate | > 70% |

## Troubleshooting

### PostgreSQL Connection Error

```
ERROR: connection to server at "localhost" (127.0.0.1), port 5432 failed
```

**Solution**: Ensure PostgreSQL is running

```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### Flyway Migration Error

```
ERROR: Flyway migration failed
```

**Solution**: Check database schema

```bash
psql -U postgres -d smart_elephant -c "SELECT * FROM flyway_schema_history;"
```

## Next Steps

1. ✅ Test basic game flow
2. 🔲 Integrate real Claude API
3. 🔲 Add Redis caching
4. 🔲 Implement RAG system
5. 🔲 Frontend integration

## Contact

- Author: Nata Shoiman
- Email: natarud1988@gmail.com
- Project: Smart Elephant Speech Development Game

---

**Version**: 1.0.0  
**Date**: 2026-09-07  
**Status**: Phase 1 - Working Backend Foundation
