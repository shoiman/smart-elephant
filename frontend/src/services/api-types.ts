export const QuestionDifficulty = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
} as const;
export type QuestionDifficulty = (typeof QuestionDifficulty)[keyof typeof QuestionDifficulty];

export const Language = {
  HEBREW: 'he',
  RUSSIAN: 'ru',
  UKRAINIAN: 'uk',
} as const;
export type Language = (typeof Language)[keyof typeof Language];

export interface GameStartRequest {
  childId: number;
  numQuestions?: number;
}

export interface GameStartResponse {
  gameSessionId: number;
  childId: number;
  startedAt: string;
  numQuestions: number;
}

export interface GameSessionResponse {
  gameSessionId: number;
  childId: number;
  startedAt: string;
  completedAt: string | null;
  questionsAnswered: number;
  correctAnswers: number;
  currentScore: number;
}

export interface GameEndResponse {
  gameSessionId: number;
  completedAt: string;
  totalQuestions: number;
  correctAnswers: number;
  finalScore: number;
}

export interface Question {
  questionId: string;
  animalId: number;
  animalName: string;
  questionText: string;
  difficulty: QuestionDifficulty;
  audioUrl?: string;
  hints?: string[];
  createdAt: string;
}

export interface AnswerRequest {
  gameSessionId: number;
  questionId: string;
  animalId: number;
  answer: string;
  responseTimeMs?: number;
  questionText?: string;
  difficulty?: QuestionDifficulty | string;
}

export interface AnswerResponse {
  isCorrect: boolean;
  correctAnswer?: string;
  explanation: string;
  score: number;
  nextQuestionAvailableAt: string;
}

export interface RecentGame {
  gameSessionId: number;
  completedAt: string;
  totalQuestions: number;
  correctAnswers: number;
  finalScore: number;
  difficulty?: QuestionDifficulty;
}

export interface ProgressResponse {
  childId: number;
  totalGames: number;
  totalCorrect: number;
  successRate: number;
  currentLevel: QuestionDifficulty;
  lastGameAt: string | null;
  recentGames: RecentGame[];
}

export interface ProgressAnalyzeRequest {
  childId: number;
}

export interface PersonalizedPlan {
  focusAnimal: string;
  suggestedQuestions: number;
  nextSession: string;
}

export interface ProgressAnalysisResponse {
  childId: number;
  analysisDate: string;
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
  nextDifficulty: QuestionDifficulty;
  projectedLevel: string;
  personalizedPlan: PersonalizedPlan;
}

export interface AnimalFacts {
  size?: string;
  sound?: string;
  diet?: string;
  lifespan?: string;
  speed?: string;
  [key: string]: string | undefined;
}

export interface Animal {
  id: number;
  name: string;
  habitat: 'savanna' | 'farm' | 'river_lake';
  description: string;
  imageUrl: string;
  facts: AnimalFacts;
  funFacts?: string[];
  relatedAnimals?: number[];
}

export interface AnimalListResponse {
  animals: Animal[];
  total: number;
  page: number;
}

export interface Child {
  id: number;
  name: string;
  age: number;
  language: Language;
  createdAt: string;
  updatedAt: string;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  timestamp: string;
  path: string;
  status: number;
}

export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  timestamp: string;
}
