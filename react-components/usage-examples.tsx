// ============================================
// Usage Examples for React Shape Puzzle Components
// ============================================

import React from 'react';
import {
  ShapeRenderer,
  CanvasShapeRenderer,
  PuzzleSequence,
  PuzzleGrid,
  AnswerOptions,
  DifficultySelector,
  ShapePuzzleApp,
  Shape,
  Puzzle,
} from './index';

// ============================================
// Example 1: Basic Shape Rendering
// ============================================

export const BasicShapeExample = () => {
  const sampleShape: Shape = {
    type: 'pentagon',
    fill: 'half',
    color: 'black',
    rotation: 45,
    size: 'large',
    dots: 3,
  };

  return (
    <div className="p-8 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Basic Shape Rendering</h3>
      <div className="flex gap-4 items-center">
        <div>
          <p className="text-sm text-gray-600 mb-2">SVG Renderer:</p>
          <ShapeRenderer shape={sampleShape} size={100} />
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-2">Canvas Renderer:</p>
          <CanvasShapeRenderer shape={sampleShape} size={100} />
        </div>
      </div>
    </div>
  );
};

// ============================================
// Example 2: Interactive Shape with States
// ============================================

export const InteractiveShapeExample = () => {
  const [isSelected, setIsSelected] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);

  const shape: Shape = {
    type: 'triangle',
    fill: 'quarter',
    color: 'black',
    rotation: 0,
    size: 'medium',
    dots: 2,
  };

  return (
    <div className="p-8 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Interactive Shape States</h3>
      <div className="flex gap-4 items-center mb-4">
        <ShapeRenderer
          shape={shape}
          size={80}
          onClick={() => setIsSelected(!isSelected)}
          isSelected={isSelected}
          isCorrect={isCorrect === true}
          isWrong={isCorrect === false}
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setIsCorrect(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Mark Correct
        </button>
        <button
          onClick={() => setIsCorrect(false)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Mark Wrong
        </button>
        <button
          onClick={() => setIsCorrect(null)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

// ============================================
// Example 3: Shape Sequence Display
// ============================================

export const SequenceExample = () => {
  const sequence: Shape[] = [
    { type: 'circle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 1 },
    { type: 'triangle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 2 },
    { type: 'square', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 3 },
    { type: 'pentagon', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 4 },
  ];

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Sequence Puzzle Example</h3>
      <PuzzleSequence sequence={sequence} />
    </div>
  );
};

// ============================================
// Example 4: Grid Puzzle Display
// ============================================

export const GridExample = () => {
  const grid: Shape[][] = [
    [
      { type: 'circle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 1 },
      { type: 'circle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 2 },
      { type: 'circle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 3 },
    ],
    [
      { type: 'triangle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 2 },
      { type: 'triangle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 3 },
      { type: 'triangle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 5 },
    ],
    [
      { type: 'square', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 3 },
      { type: 'square', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 4 },
      { type: 'square', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 0 }, // Missing
    ],
  ];

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Grid Puzzle Example</h3>
      <PuzzleGrid
        grid={grid}
        missingCell={{ row: 2, col: 2 }}
      />
    </div>
  );
};

// ============================================
// Example 5: Answer Options
// ============================================

export const AnswerOptionsExample = () => {
  const options: Shape[] = [
    { type: 'hexagon', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 5 },
    { type: 'pentagon', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 5 },
    { type: 'circle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 5 },
    { type: 'triangle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 5 },
  ];

  const handleAnswer = (selectedIndex: number, isCorrect: boolean) => {
    console.log(`Selected index: ${selectedIndex}, Correct: ${isCorrect}`);
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Answer Options Example</h3>
      <AnswerOptions
        options={options}
        correctIndex={1}
        onAnswer={handleAnswer}
      />
    </div>
  );
};

// ============================================
// Example 6: Difficulty Selector
// ============================================

export const DifficultySelectorExample = () => {
  const handleDifficultySelect = (difficulty: any) => {
    console.log(`Selected difficulty: ${difficulty}`);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h3 className="text-lg font-semibold mb-4 text-center">Difficulty Selector Example</h3>
      <DifficultySelector onSelect={handleDifficultySelect} />
    </div>
  );
};

// ============================================
// Example 7: Complete App
// ============================================

export const CompleteAppExample = () => {
  const handlePuzzleComplete = (puzzle: Puzzle, isCorrect: boolean) => {
    console.log('Puzzle completed:', {
      difficulty: puzzle.difficulty,
      ruleDescription: puzzle.ruleDescription,
      isCorrect,
    });
  };

  return (
    <div className="min-h-screen">
      <ShapePuzzleApp onPuzzleComplete={handlePuzzleComplete} />
    </div>
  );
};

// ============================================
// Example 8: Custom Shape Variations
// ============================================

export const ShapeVariationsExample = () => {
  const shapes: Shape[] = [
    { type: 'circle', fill: 'empty', color: 'black', rotation: 0, size: 'small' },
    { type: 'circle', fill: 'quarter', color: 'black', rotation: 0, size: 'medium' },
    { type: 'circle', fill: 'half', color: 'black', rotation: 0, size: 'large' },
    { type: 'circle', fill: 'full', color: 'black', rotation: 0, size: 'medium' },
    { type: 'triangle', fill: 'empty', color: 'gray', rotation: 45, size: 'medium' },
    { type: 'square', fill: 'half', color: 'white', rotation: 0, size: 'medium' },
    { type: 'pentagon', fill: 'quarter', color: 'black', rotation: 72, size: 'medium' },
    { type: 'hexagon', fill: 'full', color: 'gray', rotation: 30, size: 'medium' },
  ];

  return (
    <div className="p-8 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Shape Variations Example</h3>
      <div className="grid grid-cols-4 gap-4">
        {shapes.map((shape, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <ShapeRenderer shape={shape} size={60} />
            <div className="text-xs text-gray-600 text-center">
              <div>{shape.type}</div>
              <div>{shape.fill}</div>
              <div>{shape.color}</div>
              {shape.rotation !== 0 && <div>{shape.rotation}°</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// Usage in Next.js/React App
// ============================================

export const AppIntegrationExample = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Shape Puzzle Components Demo
        </h1>

        <BasicShapeExample />
        <InteractiveShapeExample />
        <SequenceExample />
        <GridExample />
        <AnswerOptionsExample />
        <ShapeVariationsExample />

        <div className="mt-16">
          <DifficultySelectorExample />
        </div>
      </div>
    </div>
  );
};