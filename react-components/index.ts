// ============================================
// Component Exports - Main Entry Point
// ============================================

// Type definitions
export * from './types';

// Core components
export { default as ShapeRenderer } from './ShapeRenderer';
export { default as CanvasShapeRenderer } from './CanvasShapeRenderer';

// Puzzle components
export { default as PuzzleSequence } from './PuzzleSequence';
export { default as PuzzleGrid } from './PuzzleGrid';
export { default as AnswerOptions } from './AnswerOptions';
export { default as DifficultySelector } from './DifficultySelector';

// Main app component
export { default as ShapePuzzleApp } from './ShapePuzzleApp';