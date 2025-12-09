# 🧠 Extended Shape Puzzle Components 2.0

**AI-powered infinite shape puzzle generation with 6 problem types**

A comprehensive React/TypeScript component library for creating auto-generated IQ puzzles with advanced algorithms and beautiful UI.

## ✨ What's New in 2.0

### 🎯 **5 NEW Problem Types**
- **🔍 Odd One Out** - Find the different shape based on properties
- **↔️ Analogy** - A→B :: C→? relationship puzzles
- **⬜ Grid Patterns** - Checkerboard and matrix completion
- **🪞 Symmetry** - Identify symmetric vs asymmetric shapes
- **➕ Equation** - Shape arithmetic with numeric values

### 📦 **Puzzle Pack System**
- **Pre-made Packs**: Beginner, Mixed Challenge, Advanced, Speed Challenge
- **Custom Generation**: Configure difficulty weights and problem types
- **Progress Tracking**: Score, accuracy, time analysis
- **Infinite Variety**: Every playthrough generates new problems

### 🚀 **Advanced Features**
- **15+ Generation Algorithms** across 6 problem categories
- **Smart Difficulty Scaling** from easy pattern recognition to complex reasoning
- **React Hooks Integration** for seamless state management
- **Performance Optimized** with efficient rendering and algorithms

## 🎮 Problem Types Overview

### 1️⃣ Sequence Problems (수열)
```
● → ●● → ●●● → ●●●● → ?
○ → △ → ■ → ○ → ?
```
**Algorithms**: Dot counting, shape cycling, fill progression

### 2️⃣ Odd One Out (다른 하나 찾기)
```
Find the different: ■ ■ ■ ●
3 squares + 1 circle
```
**Algorithms**: Side count parity, color differences, fill patterns

### 3️⃣ Analogy (비례 문제)
```
Triangle → Square :: Pentagon → ?
Pattern: +1 side progression
```
**Algorithms**: Shape progression, rotation+color, complex multi-attribute

### 4️⃣ Grid Patterns (격자 패턴)
```
3×3 checkerboard with missing cell
Rule: (row + col) % 2 determines color
```
**Algorithms**: Mathematical patterns, sum rules, operation grids

### 5️⃣ Symmetry (대칭 문제)
```
Find non-symmetric: ○ □ △ ⚡
Circle, square, triangle are symmetric
```
**Algorithms**: Vertical/horizontal/rotational symmetry detection

### 6️⃣ Equation (수식 문제)
```
△(3) + ■(4) = ?
Answer: 7 (pentagon or dots)
```
**Algorithms**: Side counting, dot arithmetic, complex operations

## 🚀 Quick Start

### Installation
```bash
npm install shape-puzzle-components-extended
```

### Complete App
```tsx
import { ExtendedShapePuzzleApp } from 'shape-puzzle-components-extended';

function App() {
  return (
    <ExtendedShapePuzzleApp
      onPuzzleComplete={(puzzle, isCorrect) => {
        console.log(`${puzzle.kind} puzzle: ${isCorrect ? 'Correct!' : 'Wrong'}`);
      }}
      onPackComplete={(pack, score, time) => {
        console.log(`Pack "${pack.name}" completed: ${score}/${pack.totalQuestions}`);
      }}
    />
  );
}
```

## 📦 Puzzle Pack System

### Pre-made Packs

```tsx
import {
  createBeginnerPack,
  createMixedChallengePack,
  createAdvancedPack,
  createSpeedChallengePack
} from 'shape-puzzle-components-extended';

// Beginner: Easy problems only
const beginnerPack = createBeginnerPack();
// 10 questions, 10 minutes, basic patterns

// Mixed Challenge: All types and difficulties
const mixedPack = createMixedChallengePack();
// 15 questions, 20 minutes, comprehensive test

// Advanced: Hard problems focus
const advancedPack = createAdvancedPack();
// 12 questions, 30 minutes, complex reasoning

// Speed Challenge: Quick decision making
const speedPack = createSpeedChallengePack();
// 20 questions, 5 minutes, 15 seconds per question
```

### Custom Pack Generation

```tsx
import { createPuzzlePack } from 'shape-puzzle-components-extended';

const customPack = createPuzzlePack(
  "My Custom Pack",
  "Focused on analogy and equation problems",
  {
    enabledKinds: ['analogy', 'equation', 'grid'],
    difficultyWeights: { easy: 1, medium: 3, hard: 2 },
    kindWeights: {
      'analogy': 4,
      'equation': 3,
      'grid': 2
    }
  },
  12, // questions
  900 // 15 minutes
);
```

## 🎯 Individual Component Usage

### Problem Type Renderer

```tsx
import {
  ExtendedPuzzleRenderer,
  generatePuzzle
} from 'shape-puzzle-components-extended';

function PuzzleDemo() {
  const [puzzle, setPuzzle] = useState(null);

  const generateNewPuzzle = (kind) => {
    const newPuzzle = generatePuzzle('medium', kind);
    setPuzzle(newPuzzle);
  };

  return (
    <div>
      <button onClick={() => generateNewPuzzle('analogy')}>
        Generate Analogy
      </button>
      <button onClick={() => generateNewPuzzle('equation')}>
        Generate Equation
      </button>

      {puzzle && <ExtendedPuzzleRenderer puzzle={puzzle} />}
    </div>
  );
}
```

### Answer Options with All Types

```tsx
import { ExtendedAnswerOptions } from 'shape-puzzle-components-extended';

<ExtendedAnswerOptions
  puzzle={puzzle}
  onAnswer={(selectedIndex, isCorrect) => {
    console.log('Answer:', { selectedIndex, isCorrect });
  }}
  disabled={showingFeedback}
/>
```

## 🎨 Advanced Algorithms

### Odd One Out Generation
```tsx
// Find shapes that don't match a pattern
function generateOddOneOutBySides() {
  const evenSided = ['square', 'hexagon'];  // 4, 6 sides
  const oddSided = ['triangle', 'pentagon']; // 3, 5 sides
  // Generate 3 even + 1 odd, or vice versa
}
```

### Analogy Pattern Matching
```tsx
// A→B :: C→? relationship
function generateAnalogyShapeAndDots() {
  const A = { type: 'triangle', dots: 2 };
  const B = { type: 'square', dots: 3 };    // +1 side, +1 dot
  const C = { type: 'pentagon', dots: 4 };
  const answer = { type: 'hexagon', dots: 5 }; // Apply same rule
}
```

### Grid Pattern Completion
```tsx
// Checkerboard with mathematical rules
function generateCheckerboardPuzzle() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const isBlack = (r + c) % 2 === 0;
      grid[r][c] = { color: isBlack ? 'black' : 'white' };
    }
  }
  // Remove one cell, user must determine correct color
}
```

### Shape Equation System
```tsx
// Convert shapes to numbers for arithmetic
const ShapeValues = {
  triangle: 3,  // sides
  square: 4,
  pentagon: 5
};

// Triangle + Square = Pentagon (3 + 4 = 7, closest is pentagon)
```

## 📊 Generation Statistics

```tsx
import { getGeneratorStats } from 'shape-puzzle-components-extended';

const stats = getGeneratorStats();
console.log(stats);
// {
//   totalGenerators: 15+,
//   byDifficulty: { easy: 5, medium: 7, hard: 3 },
//   byKind: { sequence: 3, 'odd-one-out': 3, analogy: 2, ... }
// }
```

## 🎯 Problem Difficulty Progression

### Easy (초급)
- **Single attribute changes**: dots, shape type, fill, color
- **Visual recognition**: immediately obvious patterns
- **Examples**: ●→●●→●●● or ○→△→■

### Medium (중급)
- **Dual attribute changes**: shape+dots, rotation+color
- **Pattern inference**: requires analysis to spot rule
- **Examples**: A→B relationships, simple grids

### Hard (고급)
- **Complex relationships**: 3×3 grids with math operations
- **Multi-step reasoning**: equation solving, symmetry analysis
- **Examples**: (A+B)-C operations, pattern completion

## 🔧 TypeScript Integration

```tsx
import type {
  ExtendedPuzzle,
  PuzzleKind,
  PuzzlePack,
  PuzzleGenerationConfig
} from 'shape-puzzle-components-extended';

const puzzle: ExtendedPuzzle = {
  difficulty: 'medium',
  kind: 'analogy',
  analogyPairs: { A, B, C },
  options: [...],
  correctIndex: 1,
  ruleDescription: 'Shape progression + dot increment'
};

const config: PuzzleGenerationConfig = {
  enabledKinds: ['analogy', 'equation'],
  difficultyWeights: { easy: 1, medium: 2, hard: 1 },
  kindWeights: { analogy: 3, equation: 2 }
};
```

## 🎨 Custom Styling

All components support Tailwind CSS customization:

```tsx
<ExtendedPuzzleRenderer
  puzzle={puzzle}
  className="bg-gradient-to-br from-purple-50 to-pink-50"
/>

<ExtendedAnswerOptions
  puzzle={puzzle}
  shapeSize={100}
  className="max-w-4xl mx-auto"
/>
```

## 📱 Responsive Features

- **Mobile-first design** with touch-optimized interactions
- **Adaptive layouts** that work on all screen sizes
- **Performance optimized** for both SVG and Canvas rendering
- **Accessibility support** with proper ARIA labels

## 🔄 Migration from v1.x

The extended version maintains full backward compatibility:

```tsx
// v1.x still works
import { ShapeRenderer, PuzzleSequence } from 'shape-puzzle-components';

// v2.x adds new features
import {
  ExtendedShapePuzzleApp,
  generatePuzzle
} from 'shape-puzzle-components-extended';
```

## 📈 Performance & Scalability

- **Lazy Loading**: Components load only when needed
- **Algorithm Optimization**: O(1) puzzle generation
- **Memory Efficiency**: Automatic cleanup and garbage collection
- **Bundle Size**: Tree-shakeable exports for minimal footprint

## 🎓 Educational Applications

Perfect for:
- **IQ Testing Platforms**: Comprehensive cognitive assessment
- **Educational Games**: Pattern recognition and logical reasoning
- **Brain Training Apps**: Daily mental exercise routines
- **Research Tools**: Cognitive psychology experiments

## 🔮 Future Roadmap

- **3D Shape Support**: Volumetric puzzles and spatial reasoning
- **Adaptive Difficulty**: AI-powered dynamic difficulty adjustment
- **Multiplayer Mode**: Competitive puzzle solving
- **Analytics Dashboard**: Detailed performance insights

## 🤝 Contributing

We welcome contributions! The modular architecture makes it easy to:

1. **Add new problem types** by implementing the generator interface
2. **Extend algorithms** with additional pattern recognition rules
3. **Enhance UI components** with new visual effects
4. **Optimize performance** with better rendering techniques

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**

> 🧠 **"Infinite puzzles, infinite possibilities"** - Every generation creates unique challenges tailored to test different aspects of cognitive ability.