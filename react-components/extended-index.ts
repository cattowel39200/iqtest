// ============================================
// Extended Components Export - All New Features
// ============================================

// Core types (existing + extended)
export * from './types';
export * from './extended-types';

// Core shape rendering components (existing)
export { default as ShapeRenderer } from './ShapeRenderer';
export { default as CanvasShapeRenderer } from './CanvasShapeRenderer';

// Basic puzzle components (existing)
export { default as PuzzleSequence } from './PuzzleSequence';
export { default as PuzzleGrid } from './PuzzleGrid';
export { default as AnswerOptions } from './AnswerOptions';
export { default as DifficultySelector } from './DifficultySelector';
export { default as ShapePuzzleApp } from './ShapePuzzleApp';

// NEW: Extended puzzle generators
export * from './extended-puzzle-generators';
export * from './shape-generator-extended';
export * from './puzzle-factory';

// NEW: Extended UI components
export { default as ExtendedPuzzleRenderer } from './ExtendedPuzzleRenderer';
export { default as ExtendedAnswerOptions } from './ExtendedAnswerOptions';
export { default as PuzzlePackSelector } from './PuzzlePackSelector';
export { default as ExtendedShapePuzzleApp } from './ExtendedShapePuzzleApp';

// NEW: Predefined puzzle pack creators
export {
  createBeginnerPack,
  createMixedChallengePack,
  createAdvancedPack,
  createSpeedChallengePack,
  createPuzzlePack,
  generatePuzzle,
  generatePuzzleByDifficulty,
  generatePuzzleByKind,
  generatePuzzlePack,
  getGeneratorStats
} from './puzzle-factory';