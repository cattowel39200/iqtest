// ============================================
// Extended Shape Generator - Compatibility Bridge
// ============================================

import { Shape, ShapeType, FillType, ColorType } from './types';
import { ExtendedPuzzle } from './extended-types';

// ============================================
// HELPER FUNCTIONS
// ============================================

const polygonOrder: ShapeType[] = ['circle', 'triangle', 'square', 'pentagon', 'hexagon'];
const fillOrder: FillType[] = ['empty', 'quarter', 'half', 'full'];
const colorOrder: ColorType[] = ['black', 'gray', 'white'];

function nextPolygon(current: ShapeType): ShapeType {
  const idx = polygonOrder.indexOf(current);
  return polygonOrder[(idx + 1) % polygonOrder.length];
}

function nextFill(current: FillType): FillType {
  const idx = fillOrder.indexOf(current);
  return fillOrder[(idx + 1) % fillOrder.length];
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ============================================
// EASY LEVEL GENERATORS (CONVERTED)
// ============================================

export function generateEasyCountPuzzle(): ExtendedPuzzle {
  const length = 4;
  const base = Math.floor(Math.random() * 3) + 1;
  const step = Math.floor(Math.random() * 2) + 1;

  const sequence: Shape[] = [];
  for (let i = 0; i < length; i++) {
    sequence.push({
      type: 'circle',
      fill: 'empty',
      color: 'black',
      rotation: 0,
      size: 'medium',
      dots: base + step * i
    });
  }

  const correctDots = base + step * length;
  const optionsDots = new Set<number>([correctDots]);

  while (optionsDots.size < 4) {
    const delta = Math.floor(Math.random() * 3) + 1;
    const newDots = correctDots + (Math.random() < 0.5 ? delta : -delta);
    if (newDots > 0) {
      optionsDots.add(newDots);
    }
  }

  const dotsArray = shuffleArray(Array.from(optionsDots));
  const correctIndex = dotsArray.indexOf(correctDots);

  const options: Shape[] = dotsArray.map(d => ({
    type: 'circle',
    fill: 'empty',
    color: 'black',
    rotation: 0,
    size: 'medium',
    dots: d
  }));

  return {
    difficulty: 'easy',
    kind: 'sequence',
    sequence,
    options,
    correctIndex,
    ruleDescription: `점 개수가 ${step}씩 증가하는 규칙`
  };
}

export function generateEasyShapePuzzle(): ExtendedPuzzle {
  const length = 4;
  const startIdx = Math.floor(Math.random() * 3);

  const sequence: Shape[] = [];
  for (let i = 0; i < length; i++) {
    sequence.push({
      type: polygonOrder[(startIdx + i) % polygonOrder.length],
      fill: 'empty',
      color: 'black',
      rotation: 0,
      size: 'medium',
      dots: 1
    });
  }

  const correctShape = polygonOrder[(startIdx + length) % polygonOrder.length];
  const correctOption: Shape = {
    type: correctShape,
    fill: 'empty',
    color: 'black',
    rotation: 0,
    size: 'medium',
    dots: 1
  };

  const wrongOptions: Shape[] = [];
  for (let i = 1; i <= 3; i++) {
    wrongOptions.push({
      type: polygonOrder[(polygonOrder.indexOf(correctShape) + i) % polygonOrder.length],
      fill: 'empty',
      color: 'black',
      rotation: 0,
      size: 'medium',
      dots: 1
    });
  }

  const allOptions = shuffleArray([correctOption, ...wrongOptions]);
  const correctIndex = allOptions.findIndex(option => option.type === correctShape);

  return {
    difficulty: 'easy',
    kind: 'sequence',
    sequence,
    options: allOptions,
    correctIndex,
    ruleDescription: '도형 종류가 순서대로 변하는 규칙'
  };
}

export function generateEasyFillPuzzle(): ExtendedPuzzle {
  const length = 4;
  const startIdx = Math.floor(Math.random() * fillOrder.length);

  const sequence: Shape[] = [];
  for (let i = 0; i < length; i++) {
    sequence.push({
      type: 'circle',
      fill: fillOrder[(startIdx + i) % fillOrder.length],
      color: 'black',
      rotation: 0,
      size: 'medium'
    });
  }

  const correctFill = fillOrder[(startIdx + length) % fillOrder.length];
  const correctOption: Shape = {
    type: 'circle',
    fill: correctFill,
    color: 'black',
    rotation: 0,
    size: 'medium'
  };

  const wrongOptions: Shape[] = fillOrder
    .filter(f => f !== correctFill)
    .slice(0, 3)
    .map(f => ({
      type: 'circle',
      fill: f,
      color: 'black',
      rotation: 0,
      size: 'medium'
    }));

  const allOptions = shuffleArray([correctOption, ...wrongOptions]);
  const correctIndex = allOptions.findIndex(option => option.fill === correctFill);

  return {
    difficulty: 'easy',
    kind: 'sequence',
    sequence,
    options: allOptions,
    correctIndex,
    ruleDescription: '도형 채움 정도가 순서대로 변하는 규칙'
  };
}

// ============================================
// MEDIUM LEVEL GENERATORS (CONVERTED)
// ============================================

export function generateMediumShapeDotsPuzzle(): ExtendedPuzzle {
  const length = 5;
  const shapeOrder: ShapeType[] = ['circle', 'triangle', 'square'];
  const sequence: Shape[] = [];
  let dots = Math.floor(Math.random() * 3) + 1;

  for (let i = 0; i < length; i++) {
    sequence.push({
      type: shapeOrder[i % shapeOrder.length],
      fill: 'empty',
      color: 'black',
      rotation: 0,
      size: 'medium',
      dots
    });
    dots++;
  }

  const correctShape: Shape = {
    type: shapeOrder[length % shapeOrder.length],
    fill: 'empty',
    color: 'black',
    rotation: 0,
    size: 'medium',
    dots
  };

  const options: Shape[] = [];
  const correctIndex = Math.floor(Math.random() * 4);

  for (let i = 0; i < 4; i++) {
    if (i === correctIndex) {
      options.push(correctShape);
    } else {
      const wrongShape = { ...correctShape };
      if (Math.random() < 0.5) {
        wrongShape.type = shapeOrder.find(s => s !== correctShape.type) || 'circle';
      } else {
        wrongShape.dots = (correctShape.dots ?? 0) + (Math.random() < 0.5 ? -1 : 1);
        if ((wrongShape.dots ?? 0) < 1) wrongShape.dots = (correctShape.dots ?? 0) + 2;
      }
      options.push(wrongShape);
    }
  }

  return {
    difficulty: 'medium',
    kind: 'sequence',
    sequence,
    options,
    correctIndex,
    ruleDescription: '모양 순환 + 점 개수 1씩 증가'
  };
}

export function generateMediumRotationColorPuzzle(): ExtendedPuzzle {
  const length = 4;
  const sequence: Shape[] = [];
  let rotation = 0;
  let color: ColorType = 'black';

  for (let i = 0; i < length; i++) {
    sequence.push({
      type: 'triangle',
      fill: 'empty',
      color,
      rotation,
      size: 'medium'
    });
    rotation = (rotation + 90) % 360;
    color = color === 'black' ? 'white' : 'black';
  }

  const correctShape: Shape = {
    type: 'triangle',
    fill: 'empty',
    color,
    rotation,
    size: 'medium'
  };

  const options: Shape[] = [];
  const correctIndex = Math.floor(Math.random() * 4);

  for (let i = 0; i < 4; i++) {
    if (i === correctIndex) {
      options.push(correctShape);
    } else {
      const wrongShape = { ...correctShape };
      if (Math.random() < 0.5) {
        wrongShape.rotation = (correctShape.rotation + 90) % 360;
      } else {
        wrongShape.color = correctShape.color === 'black' ? 'white' : 'black';
      }
      options.push(wrongShape);
    }
  }

  return {
    difficulty: 'medium',
    kind: 'sequence',
    sequence,
    options,
    correctIndex,
    ruleDescription: '회전 90도씩 + 색상 교대'
  };
}

// ============================================
// HARD LEVEL GENERATORS (CONVERTED)
// ============================================

export function generateHardGridSumPuzzle(): ExtendedPuzzle {
  const rows = 3;
  const cols = 3;
  const grid: Shape[][] = [];

  const baseValue = Math.floor(Math.random() * 3) + 1;

  for (let r = 0; r < rows; r++) {
    const row: Shape[] = [];
    const a = baseValue + r;
    const b = a + 1;
    const c = a + b;

    [a, b, c].forEach(dots => {
      row.push({
        type: 'circle',
        fill: 'empty',
        color: 'black',
        rotation: 0,
        size: 'medium',
        dots
      });
    });
    grid.push(row);
  }

  const missingRow = 2;
  const missingCol = 2;
  const correctDots = grid[missingRow][missingCol].dots;

  grid[missingRow][missingCol] = {
    type: 'circle',
    fill: 'empty',
    color: 'black',
    rotation: 0,
    size: 'medium'
  };

  const optionsDots = new Set<number>([correctDots!]);
  while (optionsDots.size < 4) {
    const delta = Math.floor(Math.random() * 4) + 1;
    const newDots = correctDots! + (Math.random() < 0.5 ? delta : -delta);
    if (newDots > 0) {
      optionsDots.add(newDots);
    }
  }

  const dotsArray = shuffleArray(Array.from(optionsDots));
  const correctIndex = dotsArray.indexOf(correctDots!);

  const options: Shape[] = dotsArray.map(d => ({
    type: 'circle',
    fill: 'empty',
    color: 'black',
    rotation: 0,
    size: 'medium',
    dots: d
  }));

  return {
    difficulty: 'hard',
    kind: 'grid',
    grid,
    missingCell: { row: missingRow, col: missingCol },
    options,
    correctIndex,
    ruleDescription: '각 행에서 3번째 칸 = 1번째 + 2번째'
  };
}

export function generateHardShapeOperationPuzzle(): ExtendedPuzzle {
  const shapeSides: Record<ShapeType, number> = {
    circle: 0,
    triangle: 3,
    square: 4,
    pentagon: 5,
    hexagon: 6
  };

  const shapes = Object.keys(shapeSides) as ShapeType[];
  const grid: Shape[][] = [];

  for (let r = 0; r < 3; r++) {
    const row: Shape[] = [];
    const shapeA = shapes[Math.floor(Math.random() * shapes.length)];
    const shapeB = shapes[Math.floor(Math.random() * shapes.length)];
    const sidesSum = shapeSides[shapeA] + shapeSides[shapeB];

    let resultShape: ShapeType = 'triangle';
    for (const [shape, sides] of Object.entries(shapeSides) as [ShapeType, number][]) {
      if (sides === sidesSum || (sidesSum > 6 && sides === 6)) {
        resultShape = shape;
        break;
      }
    }

    row.push(
      { type: shapeA, fill: 'empty', color: 'black', rotation: 0, size: 'medium' },
      { type: shapeB, fill: 'empty', color: 'black', rotation: 0, size: 'medium' },
      { type: resultShape, fill: 'empty', color: 'black', rotation: 0, size: 'medium' }
    );

    grid.push(row);
  }

  const missingRow = 2;
  const missingCol = 2;
  const correctShape = grid[missingRow][missingCol].type;

  grid[missingRow][missingCol] = {
    type: 'circle', // Placeholder
    fill: 'empty',
    color: 'gray',
    rotation: 0,
    size: 'medium'
  };

  const correctOption: Shape = {
    type: correctShape,
    fill: 'empty',
    color: 'black',
    rotation: 0,
    size: 'medium'
  };

  const wrongOptions: Shape[] = shapes
    .filter(s => s !== correctShape)
    .slice(0, 3)
    .map(s => ({
      type: s,
      fill: 'empty',
      color: 'black',
      rotation: 0,
      size: 'medium'
    }));

  const allOptions = shuffleArray([correctOption, ...wrongOptions]);
  const correctIndex = allOptions.findIndex(option => option.type === correctShape);

  return {
    difficulty: 'hard',
    kind: 'grid',
    grid,
    missingCell: { row: missingRow, col: missingCol },
    options: allOptions,
    correctIndex,
    ruleDescription: '변 개수 합 규칙: 첫 번째 + 두 번째 = 세 번째'
  };
}