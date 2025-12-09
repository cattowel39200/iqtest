# 🧠 Shape Puzzle Components

A comprehensive React/TypeScript component library for creating auto-generated shape IQ puzzles with SVG and Canvas rendering.

## ✨ Features

- **🎨 Dual Rendering**: Both SVG and Canvas-based shape rendering
- **🧩 Smart Puzzle Generation**: Algorithmic puzzle creation based on difficulty
- **📱 Responsive Design**: Mobile-friendly with Tailwind CSS
- **⚡ High Performance**: Optimized Canvas rendering for complex animations
- **🎯 TypeScript**: Full type safety and IntelliSense support
- **🌈 Interactive States**: Hover, selected, correct/wrong animations
- **🔧 Highly Customizable**: Extensive props and styling options

## 🚀 Quick Start

### Installation

```bash
npm install shape-puzzle-components
# or
yarn add shape-puzzle-components
```

### Basic Usage

```tsx
import { ShapePuzzleApp } from 'shape-puzzle-components';

function App() {
  return (
    <ShapePuzzleApp
      onPuzzleComplete={(puzzle, isCorrect) => {
        console.log(`Puzzle completed: ${isCorrect ? 'Correct!' : 'Wrong!'}`);
      }}
    />
  );
}
```

## 🎯 Core Components

### 1. ShapeRenderer (SVG)

High-quality SVG-based shape rendering with animations and interactions.

```tsx
import { ShapeRenderer } from 'shape-puzzle-components';

const shape = {
  type: 'pentagon',
  fill: 'half',
  color: 'black',
  rotation: 45,
  size: 'large',
  dots: 3
};

<ShapeRenderer
  shape={shape}
  size={100}
  onClick={() => console.log('Shape clicked!')}
  isCorrect={true}
/>
```

### 2. CanvasShapeRenderer

High-performance Canvas-based rendering for complex scenarios.

```tsx
import { CanvasShapeRenderer } from 'shape-puzzle-components';

<CanvasShapeRenderer
  shape={shape}
  size={80}
  className="hover:scale-110"
/>
```

### 3. PuzzleSequence

Display sequence-based puzzles for easy/medium difficulty.

```tsx
import { PuzzleSequence } from 'shape-puzzle-components';

const sequence = [
  { type: 'circle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 1 },
  { type: 'triangle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 2 },
  { type: 'square', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 3 },
];

<PuzzleSequence sequence={sequence} />
```

### 4. PuzzleGrid

3×3 grid puzzles for hard difficulty challenges.

```tsx
import { PuzzleGrid } from 'shape-puzzle-components';

<PuzzleGrid
  grid={gridData}
  missingCell={{ row: 2, col: 2 }}
/>
```

### 5. AnswerOptions

Interactive answer selection with feedback.

```tsx
import { AnswerOptions } from 'shape-puzzle-components';

<AnswerOptions
  options={optionShapes}
  correctIndex={1}
  onAnswer={(selectedIndex, isCorrect) => {
    console.log(`Selected: ${selectedIndex}, Correct: ${isCorrect}`);
  }}
/>
```

### 6. DifficultySelector

Beautiful difficulty selection interface.

```tsx
import { DifficultySelector } from 'shape-puzzle-components';

<DifficultySelector
  onSelect={(difficulty) => {
    console.log(`Selected: ${difficulty}`);
  }}
/>
```

## 🎨 Shape Properties

### Shape Types
- `'circle'` - Perfect circles
- `'triangle'` - Equilateral triangles
- `'square'` - Perfect squares
- `'pentagon'` - Regular pentagons
- `'hexagon'` - Regular hexagons

### Fill Types
- `'empty'` - Outline only
- `'quarter'` - 25% filled with pattern
- `'half'` - 50% filled with pattern
- `'full'` - Completely filled

### Colors
- `'black'` - Dark gray (#1f2937)
- `'gray'` - Medium gray (#6b7280)
- `'white'` - White with black outline

### Sizes
- `'small'` - 70% of base size
- `'medium'` - 100% of base size (default)
- `'large'` - 130% of base size

## 🎮 Difficulty Levels

### Easy (초급)
- Single property changes
- Dot count progression: ●, ●●, ●●●, ?
- Shape cycling: ○, △, ■, ○, ?
- Fill progression: empty → quarter → half → full

### Medium (중급)
- Two simultaneous property changes
- Shape + dots combination
- Rotation + color alternation

### Hard (고급)
- 3×3 grid puzzles
- Mathematical operations (sum rules)
- Complex pattern recognition

## 🎯 TypeScript Types

```tsx
interface Shape {
  type: 'circle' | 'triangle' | 'square' | 'pentagon' | 'hexagon';
  fill: 'empty' | 'quarter' | 'half' | 'full';
  color: 'black' | 'gray' | 'white';
  rotation: number; // 0, 90, 180, 270
  size: 'small' | 'medium' | 'large';
  dots?: number;
}

interface Puzzle {
  difficulty: 'easy' | 'medium' | 'hard';
  sequence: Shape[];
  grid?: Shape[][];
  missingCell?: { row: number; col: number };
  options: Shape[];
  correctIndex: number;
  ruleDescription: string;
}
```

## 🎨 Styling with Tailwind

### Custom Classes

The components include pre-built Tailwind classes for:

```css
/* Animation States */
.animate-pulse-slow { animation: pulse 3s infinite; }
.hover:scale-110 { transform: scale(1.1); }

/* Shadow Effects */
.shadow-correct { box-shadow: 0 0 20px rgba(34, 197, 94, 0.4); }
.shadow-wrong { box-shadow: 0 0 20px rgba(239, 68, 68, 0.4); }

/* Interactive States */
.ring-green-400 { ring-color: rgb(74 222 128); }
.ring-red-400 { ring-color: rgb(248 113 113); }
```

### Custom Styling

```tsx
<ShapeRenderer
  shape={shape}
  className="hover:rotate-12 transition-transform duration-500"
/>
```

## 📱 Responsive Design

All components are built mobile-first with responsive breakpoints:

```css
/* Mobile First */
.grid-cols-1

/* Tablet */
@media (min-width: 768px) {
  .md:grid-cols-2
}

/* Desktop */
@media (min-width: 1024px) {
  .lg:grid-cols-4
}
```

## ⚡ Performance Optimizations

### Canvas Rendering
- High DPI display support
- Efficient redrawing with React.useEffect
- Hardware-accelerated transformations

### SVG Rendering
- Optimized path generation
- CSS-based animations
- Minimal DOM updates

### Memory Management
- Automatic cleanup of Canvas contexts
- Efficient pattern caching
- Optimized re-renders with React.memo

## 🔧 Advanced Configuration

### Custom Puzzle Generator

```tsx
import { generatePuzzle } from './shape-generator';

const customPuzzle = generatePuzzle('hard', {
  gridSize: 4, // 4x4 instead of 3x3
  optionsCount: 6, // 6 options instead of 4
});
```

### Theme Customization

```tsx
const customTheme = {
  colors: {
    primary: '#667eea',
    success: '#4ade80',
    error: '#f87171',
  }
};

<ShapePuzzleApp theme={customTheme} />
```

## 📖 Complete Example

```tsx
import React from 'react';
import {
  ShapePuzzleApp,
  ShapeRenderer,
  type Puzzle
} from 'shape-puzzle-components';

function PuzzleDemo() {
  const handlePuzzleComplete = (puzzle: Puzzle, isCorrect: boolean) => {
    console.log('Puzzle result:', {
      difficulty: puzzle.difficulty,
      rule: puzzle.ruleDescription,
      success: isCorrect
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <ShapePuzzleApp onPuzzleComplete={handlePuzzleComplete} />
    </div>
  );
}

export default PuzzleDemo;
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- 📧 Email: support@shapepuzzle.com
- 💬 Discord: [Shape Puzzle Community](https://discord.gg/shapepuzzle)
- 📚 Documentation: [shapepuzzle.gitbook.io](https://shapepuzzle.gitbook.io)

---

Made with ❤️ by the Shape Puzzle Team