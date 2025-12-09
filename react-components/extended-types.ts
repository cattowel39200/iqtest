// ============================================
// Extended Types for New Puzzle Categories
// ============================================

import { Shape } from './types';

// Extended puzzle kinds
export type PuzzleKind =
  | 'sequence'      // 기존: 수열 문제
  | 'odd-one-out'   // 새: 다른 하나 찾기
  | 'analogy'       // 새: A→B :: C→? 비례 문제
  | 'grid'          // 확장: 체커보드/패턴 채우기
  | 'symmetry'      // 새: 대칭 문제
  | 'equation';     // 새: 도형 = 숫자 식 문제

// Extended puzzle interface
export interface ExtendedPuzzle {
  difficulty: 'easy' | 'medium' | 'hard';
  kind: PuzzleKind;

  // Existing fields
  sequence?: Shape[];      // For sequence/analogy puzzles
  grid?: Shape[][];        // For grid/checkerboard puzzles
  missingCell?: { row: number; col: number };
  options: Shape[];
  correctIndex: number;
  ruleDescription: string;

  // New fields for extended types
  analogyPairs?: {
    A: Shape;
    B: Shape;
    C: Shape;
  };
  equationText?: string;   // "△ + ■ = ?"
  equationShapes?: Shape[]; // Visual representation of equation
  symmetryRule?: 'vertical' | 'horizontal' | 'rotational';
}

// Shape value mapping for equations
export const ShapeValueMapping = {
  sides: {
    circle: 0,
    triangle: 3,
    square: 4,
    pentagon: 5,
    hexagon: 6,
  },
  complexity: {
    circle: 1,
    triangle: 2,
    square: 3,
    pentagon: 4,
    hexagon: 5,
  }
} as const;

// Puzzle generation configuration
export interface PuzzleGenerationConfig {
  enabledKinds: PuzzleKind[];
  difficultyWeights: {
    easy: number;
    medium: number;
    hard: number;
  };
  kindWeights: Partial<Record<PuzzleKind, number>>;
}

// Puzzle pack for generating sets of problems
export interface PuzzlePack {
  id: string;
  name: string;
  description: string;
  totalQuestions: number;
  timeLimit?: number; // seconds
  puzzles: ExtendedPuzzle[];
  config: PuzzleGenerationConfig;
}