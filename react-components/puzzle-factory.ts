// ============================================
// Unified Puzzle Factory - All Problem Types
// ============================================

import { ExtendedPuzzle, PuzzleKind, PuzzleGenerationConfig, PuzzlePack } from './extended-types';
import {
  generateOddOneOutBySides,
  generateOddOneOutByColor,
  generateOddOneOutByFill,
  generateAnalogyShapeAndDots,
  generateAnalogyRotationColor,
  generateCheckerboardPuzzle,
  generateSymmetryOddOneOut,
  generateEquationBySides,
  generateComplexEquation
} from './extended-puzzle-generators';

// Import existing generators (assume they're converted to new format)
import {
  generateEasyCountPuzzle,
  generateEasyShapePuzzle,
  generateEasyFillPuzzle,
  generateMediumShapeDotsPuzzle,
  generateMediumRotationColorPuzzle,
  generateHardGridSumPuzzle,
  generateHardShapeOperationPuzzle
} from './shape-generator-extended';

// ============================================
// UNIFIED GENERATOR REGISTRY
// ============================================

interface GeneratorFunction {
  (): ExtendedPuzzle;
}

const PUZZLE_GENERATORS: Record<string, GeneratorFunction[]> = {
  // Easy Level Generators
  'easy-sequence': [
    generateEasyCountPuzzle,
    generateEasyShapePuzzle,
    generateEasyFillPuzzle
  ],
  'easy-odd-one-out': [
    generateOddOneOutBySides,
    generateOddOneOutByColor,
    generateOddOneOutByFill
  ],
  'easy-symmetry': [
    generateSymmetryOddOneOut
  ],

  // Medium Level Generators
  'medium-sequence': [
    generateMediumShapeDotsPuzzle,
    generateMediumRotationColorPuzzle
  ],
  'medium-analogy': [
    generateAnalogyShapeAndDots,
    generateAnalogyRotationColor
  ],
  'medium-grid': [
    generateCheckerboardPuzzle
  ],
  'medium-equation': [
    generateEquationBySides
  ],

  // Hard Level Generators
  'hard-grid': [
    generateHardGridSumPuzzle,
    generateHardShapeOperationPuzzle
  ],
  'hard-equation': [
    generateComplexEquation
  ],
  'hard-analogy': [
    generateAnalogyShapeAndDots // Can be made harder with more complex rules
  ]
};

// ============================================
// DIFFICULTY-BASED GENERATOR GROUPS
// ============================================

const DIFFICULTY_GENERATORS = {
  easy: [
    ...PUZZLE_GENERATORS['easy-sequence'],
    ...PUZZLE_GENERATORS['easy-odd-one-out'],
    ...PUZZLE_GENERATORS['easy-symmetry']
  ],
  medium: [
    ...PUZZLE_GENERATORS['medium-sequence'],
    ...PUZZLE_GENERATORS['medium-analogy'],
    ...PUZZLE_GENERATORS['medium-grid'],
    ...PUZZLE_GENERATORS['medium-equation']
  ],
  hard: [
    ...PUZZLE_GENERATORS['hard-grid'],
    ...PUZZLE_GENERATORS['hard-equation'],
    ...PUZZLE_GENERATORS['hard-analogy']
  ]
};

// ============================================
// KIND-BASED GENERATOR GROUPS
// ============================================

const KIND_GENERATORS: Record<PuzzleKind, GeneratorFunction[]> = {
  'sequence': [
    ...PUZZLE_GENERATORS['easy-sequence'],
    ...PUZZLE_GENERATORS['medium-sequence']
  ],
  'odd-one-out': [
    ...PUZZLE_GENERATORS['easy-odd-one-out']
  ],
  'analogy': [
    ...PUZZLE_GENERATORS['medium-analogy'],
    ...PUZZLE_GENERATORS['hard-analogy']
  ],
  'grid': [
    ...PUZZLE_GENERATORS['medium-grid'],
    ...PUZZLE_GENERATORS['hard-grid']
  ],
  'symmetry': [
    ...PUZZLE_GENERATORS['easy-symmetry']
  ],
  'equation': [
    ...PUZZLE_GENERATORS['medium-equation'],
    ...PUZZLE_GENERATORS['hard-equation']
  ]
};

// ============================================
// CORE GENERATOR FUNCTIONS
// ============================================

/**
 * Generate single puzzle by difficulty
 */
export function generatePuzzleByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): ExtendedPuzzle {
  const generators = DIFFICULTY_GENERATORS[difficulty];
  if (!generators || generators.length === 0) {
    throw new Error(`No generators available for difficulty: ${difficulty}`);
  }

  const randomGenerator = generators[Math.floor(Math.random() * generators.length)];
  return randomGenerator();
}

/**
 * Generate single puzzle by kind
 */
export function generatePuzzleByKind(kind: PuzzleKind): ExtendedPuzzle {
  const generators = KIND_GENERATORS[kind];
  if (!generators || generators.length === 0) {
    throw new Error(`No generators available for kind: ${kind}`);
  }

  const randomGenerator = generators[Math.floor(Math.random() * generators.length)];
  return randomGenerator();
}

/**
 * Generate puzzle with specific difficulty and kind
 */
export function generatePuzzle(
  difficulty?: 'easy' | 'medium' | 'hard',
  kind?: PuzzleKind
): ExtendedPuzzle {
  if (difficulty && kind) {
    // Both specified - find generators that match both
    const difficultyGens = DIFFICULTY_GENERATORS[difficulty];
    const kindGens = KIND_GENERATORS[kind];
    const intersection = difficultyGens.filter(gen => kindGens.includes(gen));

    if (intersection.length === 0) {
      console.warn(`No generators for difficulty=${difficulty} and kind=${kind}. Falling back to difficulty only.`);
      return generatePuzzleByDifficulty(difficulty);
    }

    const randomGenerator = intersection[Math.floor(Math.random() * intersection.length)];
    return randomGenerator();
  } else if (difficulty) {
    return generatePuzzleByDifficulty(difficulty);
  } else if (kind) {
    return generatePuzzleByKind(kind);
  } else {
    // Random from all generators
    const allGenerators = Object.values(DIFFICULTY_GENERATORS).flat();
    const randomGenerator = allGenerators[Math.floor(Math.random() * allGenerators.length)];
    return randomGenerator();
  }
}

// ============================================
// PUZZLE PACK GENERATION
// ============================================

/**
 * Generate a set of puzzles based on configuration
 */
export function generatePuzzlePack(config: PuzzleGenerationConfig, count: number): ExtendedPuzzle[] {
  const puzzles: ExtendedPuzzle[] = [];

  for (let i = 0; i < count; i++) {
    // Choose difficulty based on weights
    const difficulty = weightedRandomChoice(config.difficultyWeights);

    // Choose kind based on enabled kinds and weights
    const enabledKinds = config.enabledKinds;
    const kindWeights = Object.fromEntries(
      enabledKinds.map(kind => [kind, config.kindWeights[kind] || 1])
    );
    const kind = weightedRandomChoice(kindWeights) as PuzzleKind;

    try {
      const puzzle = generatePuzzle(difficulty, kind);
      puzzles.push(puzzle);
    } catch (error) {
      console.warn(`Failed to generate puzzle for ${difficulty}/${kind}, using fallback`);
      puzzles.push(generatePuzzle(difficulty));
    }
  }

  return puzzles;
}

/**
 * Create predefined puzzle pack
 */
export function createPuzzlePack(
  name: string,
  description: string,
  config: PuzzleGenerationConfig,
  questionCount: number = 10,
  timeLimit?: number
): PuzzlePack {
  const puzzles = generatePuzzlePack(config, questionCount);

  return {
    id: `pack_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    totalQuestions: questionCount,
    timeLimit,
    puzzles,
    config
  };
}

// ============================================
// PREDEFINED PUZZLE PACKS
// ============================================

/**
 * Beginner Pack - Easy puzzles only
 */
export function createBeginnerPack(): PuzzlePack {
  return createPuzzlePack(
    "초심자 팩",
    "쉬운 문제만으로 구성된 입문용 팩",
    {
      enabledKinds: ['sequence', 'odd-one-out', 'symmetry'],
      difficultyWeights: { easy: 1, medium: 0, hard: 0 },
      kindWeights: { 'sequence': 2, 'odd-one-out': 2, 'symmetry': 1 }
    },
    10,
    600 // 10 minutes
  );
}

/**
 * Mixed Challenge Pack - All difficulties
 */
export function createMixedChallengePack(): PuzzlePack {
  return createPuzzlePack(
    "종합 도전 팩",
    "모든 난이도와 유형이 섞인 종합 테스트",
    {
      enabledKinds: ['sequence', 'odd-one-out', 'analogy', 'grid', 'symmetry', 'equation'],
      difficultyWeights: { easy: 3, medium: 4, hard: 2 },
      kindWeights: {
        'sequence': 2,
        'odd-one-out': 2,
        'analogy': 3,
        'grid': 2,
        'symmetry': 1,
        'equation': 2
      }
    },
    15,
    1200 // 20 minutes
  );
}

/**
 * Advanced Pack - Hard puzzles focus
 */
export function createAdvancedPack(): PuzzlePack {
  return createPuzzlePack(
    "고수 전용 팩",
    "고난도 문제 중심의 전문가용 팩",
    {
      enabledKinds: ['analogy', 'grid', 'equation'],
      difficultyWeights: { easy: 0, medium: 3, hard: 5 },
      kindWeights: {
        'analogy': 3,
        'grid': 3,
        'equation': 4
      }
    },
    12,
    1800 // 30 minutes
  );
}

/**
 * Speed Challenge Pack - Quick problems
 */
export function createSpeedChallengePack(): PuzzlePack {
  return createPuzzlePack(
    "스피드 챌린지 팩",
    "빠른 판단력을 기르는 단시간 집중 팩",
    {
      enabledKinds: ['odd-one-out', 'symmetry', 'sequence'],
      difficultyWeights: { easy: 4, medium: 3, hard: 1 },
      kindWeights: {
        'odd-one-out': 4,
        'symmetry': 3,
        'sequence': 2
      }
    },
    20,
    300 // 5 minutes - 15 seconds per question
  );
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Weighted random choice from object of weights
 */
function weightedRandomChoice<T extends string>(weights: Record<T, number>): T {
  const entries = Object.entries(weights) as [T, number][];
  const totalWeight = entries.reduce((sum, [_, weight]) => sum + weight, 0);

  if (totalWeight === 0) {
    throw new Error('Total weight cannot be zero');
  }

  let random = Math.random() * totalWeight;

  for (const [key, weight] of entries) {
    random -= weight;
    if (random <= 0) {
      return key;
    }
  }

  // Fallback (shouldn't reach here)
  return entries[0][0];
}

/**
 * Get statistics about available generators
 */
export function getGeneratorStats() {
  const stats = {
    totalGenerators: 0,
    byDifficulty: {} as Record<string, number>,
    byKind: {} as Record<string, number>,
    combinations: [] as Array<{ difficulty: string; kind: string; count: number }>
  };

  // Count by difficulty
  Object.entries(DIFFICULTY_GENERATORS).forEach(([difficulty, generators]) => {
    stats.byDifficulty[difficulty] = generators.length;
    stats.totalGenerators += generators.length;
  });

  // Count by kind
  Object.entries(KIND_GENERATORS).forEach(([kind, generators]) => {
    stats.byKind[kind] = generators.length;
  });

  return stats;
}