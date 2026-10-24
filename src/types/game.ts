/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PredictionType = 'POSITIVE' | 'NEGATIVE';
export type GroundTruth = 'POSITIVE' | 'NEGATIVE';
export type Classification = 'VP' | 'FN' | 'FP' | 'VN';

export interface CaseDossier {
  id: string;
  codeNumber: string;
  alias: string;
  title: string;
  scenario: string;
  evidence: string;
  aiPrediction: PredictionType;
  aiConfidence: number; // percentage, e.g. 84
  groundTruth: GroundTruth;
  correctClassification: Classification;
  explanation: string;
  avatarSeed: {
    gender: 'neutral' | 'masc' | 'fem';
    accentColor: string;
    archetype: string;
  };
}

export interface MatrixCounts {
  vp: number; // Verdadero Positivo
  fn: number; // Falso Negativo
  fp: number; // Falso Positivo
  vn: number; // Verdadero Negativo
  total: number;
  correct: number;
  incorrect: number;
}

export interface MetricValue {
  value: number | null; // e.g. 0.75 or null if undefined
  percentage: number | null; // e.g. 75.00
  formatted: string; // e.g. "75,00 %" or "N/A"
  isDefined: boolean;
  undefinedReason?: string;
  formula: string;
  academicSummary: string;
}

export interface EvaluationMetrics {
  accuracy: MetricValue;
  precision: MetricValue;
  recall: MetricValue;
  specificity: MetricValue;
  f1: MetricValue;
}

export interface PlayerScore {
  points: number;
  correctCount: number;
  incorrectCount: number;
  currentStreak: number;
  maxStreak: number;
  streakBonusCount: number;
  badges: string[];
}

export type ViewMode = 'menu' | 'solo' | 'instructor' | 'squad' | 'academy' | 'results';

export interface SquadParticipant {
  id: string;
  name: string;
  points: number;
  correctCount: number;
  incorrectCount: number;
  currentStreak: number;
  answers: Record<string, Classification>;
  joinedAt: number;
}

export interface SquadRoomState {
  code: string;
  instructorName: string;
  status: 'waiting' | 'active' | 'finished';
  currentCaseIndex: number;
  isRevealed: boolean;
  participants: Record<string, SquadParticipant>;
  lastUpdated: number;
}
