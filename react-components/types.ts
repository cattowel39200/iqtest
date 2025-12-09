// ============================================
// TypeScript Type Definitions for Shape Puzzle System
// ============================================

export type ShapeType = 'circle' | 'triangle' | 'square' | 'pentagon' | 'hexagon';
export type FillType = 'empty' | 'quarter' | 'half' | 'full';
export type ColorType = 'black' | 'gray' | 'white';
export type SizeType = 'small' | 'medium' | 'large';
export type DifficultyType = 'easy' | 'medium' | 'hard';

export interface Shape {
  type: ShapeType;
  fill: FillType;
  color: ColorType;
  rotation: number; // 0, 90, 180, 270
  size: SizeType;
  dots?: number; // Optional dots count
}

export interface GridCell {
  row: number;
  col: number;
}

export interface Puzzle {
  difficulty: DifficultyType;
  sequence: Shape[];      // For sequence-based puzzles
  grid?: Shape[][];       // For grid-based puzzles (3x3)
  missingCell?: GridCell; // Location of missing cell in grid
  options: Shape[];       // Answer choices
  correctIndex: number;   // Index of correct answer
  ruleDescription: string; // Explanation of the pattern
}

export interface ShapeRenderProps {
  shape: Shape;
  size?: number; // Override size in pixels
  className?: string;
  onClick?: () => void;
  isSelected?: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
}

export interface PuzzleGeneratorConfig {
  difficulty: DifficultyType;
  sequenceLength?: number;
  gridSize?: number;
  optionsCount?: number;
}

// Animation and interaction states
export interface AnimationState {
  isAnimating: boolean;
  animationType: 'pulse' | 'shake' | 'glow' | 'none';
  duration: number;
}

// Feedback states
export interface FeedbackState {
  show: boolean;
  type: 'success' | 'error' | 'hint';
  message: string;
  ruleExplanation?: string;
}