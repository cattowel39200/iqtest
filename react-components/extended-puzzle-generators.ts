// ============================================
// Extended Puzzle Generators - New Problem Types
// ============================================

import { Shape, ShapeType, FillType, ColorType } from './types';
import { ExtendedPuzzle, ShapeValueMapping } from './extended-types';

// ============================================
// 1️⃣ ODD ONE OUT GENERATORS
// ============================================

/**
 * Generate "odd one out" puzzle based on side count parity
 * 3 shapes with even sides, 1 with odd sides (or vice versa)
 */
export function generateOddOneOutBySides(): ExtendedPuzzle {
  const typeToSides = ShapeValueMapping.sides;
  const allTypes: ShapeType[] = ['triangle', 'square', 'pentagon', 'hexagon'];
  const evenTypes = allTypes.filter(t => typeToSides[t] % 2 === 0);
  const oddTypes = allTypes.filter(t => typeToSides[t] % 2 === 1);

  const makeShape = (t: ShapeType): Shape => ({
    type: t,
    fill: 'empty',
    color: 'black',
    rotation: 0,
    size: 'medium'
  });

  const majorityEven = Math.random() < 0.5;
  const options: Shape[] = [];
  const correctIndex = Math.floor(Math.random() * 4);

  if (majorityEven) {
    // 3 even + 1 odd (odd is the answer)
    for (let i = 0; i < 4; i++) {
      if (i === correctIndex) {
        const odd = oddTypes[Math.floor(Math.random() * oddTypes.length)];
        options.push(makeShape(odd));
      } else {
        const even = evenTypes[Math.floor(Math.random() * evenTypes.length)];
        options.push(makeShape(even));
      }
    }
  } else {
    // 3 odd + 1 even (even is the answer)
    for (let i = 0; i < 4; i++) {
      if (i === correctIndex) {
        const even = evenTypes[Math.floor(Math.random() * evenTypes.length)];
        options.push(makeShape(even));
      } else {
        const odd = oddTypes[Math.floor(Math.random() * oddTypes.length)];
        options.push(makeShape(odd));
      }
    }
  }

  return {
    difficulty: 'easy',
    kind: 'odd-one-out',
    options,
    correctIndex,
    ruleDescription: `3개는 ${majorityEven ? '짝수' : '홀수'} 변 개수, 1개만 ${majorityEven ? '홀수' : '짝수'} 변`
  };
}

/**
 * Generate "odd one out" puzzle based on color
 */
export function generateOddOneOutByColor(): ExtendedPuzzle {
  const colors: ColorType[] = ['black', 'gray', 'white'];
  const majorityColor = colors[Math.floor(Math.random() * colors.length)];
  const minorityColors = colors.filter(c => c !== majorityColor);
  const minorityColor = minorityColors[Math.floor(Math.random() * minorityColors.length)];

  const options: Shape[] = [];
  const correctIndex = Math.floor(Math.random() * 4);

  const baseShape = (): Omit<Shape, 'color'> => ({
    type: 'circle',
    fill: 'full',
    rotation: 0,
    size: 'medium'
  });

  for (let i = 0; i < 4; i++) {
    if (i === correctIndex) {
      options.push({ ...baseShape(), color: minorityColor });
    } else {
      options.push({ ...baseShape(), color: majorityColor });
    }
  }

  return {
    difficulty: 'easy',
    kind: 'odd-one-out',
    options,
    correctIndex,
    ruleDescription: `3개는 ${majorityColor} 색상, 1개만 ${minorityColor} 색상`
  };
}

/**
 * Generate "odd one out" puzzle based on fill pattern
 */
export function generateOddOneOutByFill(): ExtendedPuzzle {
  const fills: FillType[] = ['empty', 'quarter', 'half', 'full'];
  const majorityFill = fills[Math.floor(Math.random() * fills.length)];
  const minorityFills = fills.filter(f => f !== majorityFill);
  const minorityFill = minorityFills[Math.floor(Math.random() * minorityFills.length)];

  const options: Shape[] = [];
  const correctIndex = Math.floor(Math.random() * 4);

  const baseShape = (): Omit<Shape, 'fill'> => ({
    type: 'square',
    color: 'black',
    rotation: 0,
    size: 'medium'
  });

  for (let i = 0; i < 4; i++) {
    if (i === correctIndex) {
      options.push({ ...baseShape(), fill: minorityFill });
    } else {
      options.push({ ...baseShape(), fill: majorityFill });
    }
  }

  return {
    difficulty: 'easy',
    kind: 'odd-one-out',
    options,
    correctIndex,
    ruleDescription: `3개는 ${majorityFill} 채움, 1개만 ${minorityFill} 채움`
  };
}

// ============================================
// 2️⃣ ANALOGY GENERATORS (A→B :: C→?)
// ============================================

/**
 * Helper function to get next shape type in sequence
 */
function nextShapeType(type: ShapeType): ShapeType {
  const order: ShapeType[] = ['circle', 'triangle', 'square', 'pentagon', 'hexagon'];
  const idx = order.indexOf(type);
  return order[(idx + 1) % order.length];
}

/**
 * Generate analogy puzzle: shape type progression + dots increment
 */
export function generateAnalogyShapeAndDots(): ExtendedPuzzle {
  // Generate A
  const shapeTypes: ShapeType[] = ['triangle', 'square', 'pentagon'];
  const A: Shape = {
    type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
    fill: 'empty',
    color: 'black',
    rotation: 0,
    size: 'medium',
    dots: Math.floor(Math.random() * 3) + 2 // 2-4 dots
  };

  // B = A with next shape type + 1 more dot
  const B: Shape = {
    ...A,
    type: nextShapeType(A.type),
    dots: (A.dots ?? 0) + 1
  };

  // C = random starting point
  const C: Shape = {
    type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
    fill: 'empty',
    color: 'black',
    rotation: 0,
    size: 'medium',
    dots: Math.floor(Math.random() * 3) + 2
  };

  // Correct answer = apply same rule to C
  const correct: Shape = {
    ...C,
    type: nextShapeType(C.type),
    dots: (C.dots ?? 0) + 1
  };

  // Generate options
  const options: Shape[] = [];
  const correctIndex = Math.floor(Math.random() * 4);

  for (let i = 0; i < 4; i++) {
    if (i === correctIndex) {
      options.push(correct);
    } else {
      // Generate wrong answers by changing either type or dots
      const wrongAnswer = { ...correct };
      if (Math.random() < 0.5) {
        // Wrong shape type
        wrongAnswer.type = nextShapeType(correct.type);
      } else {
        // Wrong dot count
        wrongAnswer.dots = (correct.dots ?? 0) + (Math.random() < 0.5 ? -1 : 1);
        if ((wrongAnswer.dots ?? 0) < 1) wrongAnswer.dots = (correct.dots ?? 0) + 2;
      }
      options.push(wrongAnswer);
    }
  }

  return {
    difficulty: 'medium',
    kind: 'analogy',
    analogyPairs: { A, B, C },
    options,
    correctIndex,
    ruleDescription: '도형 타입 한 단계 증가 + 점 개수 +1'
  };
}

/**
 * Generate analogy puzzle: rotation + color change
 */
export function generateAnalogyRotationColor(): ExtendedPuzzle {
  const A: Shape = {
    type: 'triangle',
    fill: 'empty',
    color: 'black',
    rotation: 0,
    size: 'medium'
  };

  const B: Shape = {
    ...A,
    rotation: 90,
    color: 'white'
  };

  const C: Shape = {
    type: 'square',
    fill: 'empty',
    color: 'gray',
    rotation: 180,
    size: 'medium'
  };

  const correct: Shape = {
    ...C,
    rotation: (C.rotation + 90) % 360,
    color: C.color === 'black' ? 'white' : C.color === 'white' ? 'gray' : 'black'
  };

  const options: Shape[] = [];
  const correctIndex = Math.floor(Math.random() * 4);

  for (let i = 0; i < 4; i++) {
    if (i === correctIndex) {
      options.push(correct);
    } else {
      const wrong = { ...correct };
      if (Math.random() < 0.5) {
        wrong.rotation = (correct.rotation + 90) % 360;
      } else {
        wrong.color = wrong.color === 'black' ? 'white' : 'black';
      }
      options.push(wrong);
    }
  }

  return {
    difficulty: 'medium',
    kind: 'analogy',
    analogyPairs: { A, B, C },
    options,
    correctIndex,
    ruleDescription: '90도 회전 + 색상 변경'
  };
}

// ============================================
// 3️⃣ CHECKERBOARD/GRID PATTERN GENERATORS
// ============================================

/**
 * Generate checkerboard pattern puzzle
 */
export function generateCheckerboardPuzzle(): ExtendedPuzzle {
  const size = 4;
  const grid: Shape[][] = [];

  // Create checkerboard pattern
  for (let r = 0; r < size; r++) {
    const row: Shape[] = [];
    for (let c = 0; c < size; c++) {
      const isBlack = (r + c) % 2 === 0;
      row.push({
        type: 'square',
        fill: 'full',
        color: isBlack ? 'black' : 'white',
        rotation: 0,
        size: 'medium'
      });
    }
    grid.push(row);
  }

  // Choose missing cell
  const missingRow = Math.floor(Math.random() * size);
  const missingCol = Math.floor(Math.random() * size);
  const correctColor = grid[missingRow][missingCol].color;

  // Mark cell as missing
  grid[missingRow][missingCol] = {
    ...grid[missingRow][missingCol],
    color: 'gray' // Placeholder for missing
  };

  // Generate options
  const options: Shape[] = [];
  const correctIndex = Math.floor(Math.random() * 4);
  const colors: ColorType[] = ['black', 'white'];

  for (let i = 0; i < 4; i++) {
    if (i === correctIndex) {
      options.push({
        type: 'square',
        fill: 'full',
        color: correctColor,
        rotation: 0,
        size: 'medium'
      });
    } else {
      options.push({
        type: 'square',
        fill: 'full',
        color: colors.find(c => c !== correctColor) || 'gray',
        rotation: 0,
        size: 'medium'
      });
    }
  }

  return {
    difficulty: 'medium',
    kind: 'grid',
    grid,
    missingCell: { row: missingRow, col: missingCol },
    options,
    correctIndex,
    ruleDescription: '행+열 합이 짝수면 검정, 홀수면 흰색 체커보드 패턴'
  };
}

// ============================================
// 4️⃣ SYMMETRY GENERATORS
// ============================================

/**
 * Check if shape is vertically symmetric
 */
function isVerticallySymmetric(shape: Shape): boolean {
  // Simple rules: circle, square are always symmetric
  // Triangle is symmetric only at 0° rotation
  if (shape.type === 'circle' || shape.type === 'square') return true;
  if (shape.type === 'triangle' && shape.rotation === 0) return true;
  if (shape.type === 'pentagon' && shape.rotation === 0) return true;
  if (shape.type === 'hexagon' && (shape.rotation === 0 || shape.rotation === 90)) return true;
  return false;
}

/**
 * Generate symmetry-based odd one out puzzle
 */
export function generateSymmetryOddOneOut(): ExtendedPuzzle {
  const createSymmetricShape = (): Shape => {
    const symmetricOptions = [
      { type: 'circle' as ShapeType, rotation: 0 },
      { type: 'square' as ShapeType, rotation: 0 },
      { type: 'triangle' as ShapeType, rotation: 0 }
    ];
    const choice = symmetricOptions[Math.floor(Math.random() * symmetricOptions.length)];

    return {
      type: choice.type,
      fill: 'empty',
      color: 'black',
      rotation: choice.rotation,
      size: 'medium'
    };
  };

  const createAsymmetricShape = (): Shape => ({
    type: 'triangle',
    fill: 'empty',
    color: 'black',
    rotation: 90, // Deliberately asymmetric
    size: 'medium'
  });

  const options: Shape[] = [];
  const correctIndex = Math.floor(Math.random() * 4);

  for (let i = 0; i < 4; i++) {
    if (i === correctIndex) {
      options.push(createAsymmetricShape()); // The odd one out
    } else {
      options.push(createSymmetricShape());
    }
  }

  return {
    difficulty: 'easy',
    kind: 'symmetry',
    options,
    correctIndex,
    ruleDescription: '3개는 좌우 대칭, 1개만 비대칭',
    symmetryRule: 'vertical'
  };
}

// ============================================
// 5️⃣ EQUATION GENERATORS
// ============================================

/**
 * Generate equation puzzle using shape sides
 */
export function generateEquationBySides(): ExtendedPuzzle {
  const types: ShapeType[] = ['triangle', 'square', 'pentagon', 'hexagon'];
  const pickType = () => types[Math.floor(Math.random() * types.length)];

  const type1 = pickType();
  const type2 = pickType();

  const value1 = ShapeValueMapping.sides[type1];
  const value2 = ShapeValueMapping.sides[type2];
  const answer = value1 + value2;

  // Create equation shapes for visual representation
  const equationShapes: Shape[] = [
    { type: type1, fill: 'empty', color: 'black', rotation: 0, size: 'medium' },
    { type: type2, fill: 'empty', color: 'black', rotation: 0, size: 'medium' }
  ];

  const equationText = `${type1} + ${type2} = ?`;

  // Generate answer options
  const optionValues = new Set<number>([answer]);
  while (optionValues.size < 4) {
    const delta = Math.floor(Math.random() * 3) + 1;
    const newValue = answer + (Math.random() < 0.5 ? -delta : delta);
    if (newValue > 0) {
      optionValues.add(newValue);
    }
  }

  const values = Array.from(optionValues);
  const correctIndex = values.indexOf(answer);

  // Create option shapes (circles with dots representing numbers)
  const options: Shape[] = values.map(v => ({
    type: 'circle',
    fill: 'empty',
    color: 'black',
    rotation: 0,
    size: 'medium',
    dots: v
  }));

  return {
    difficulty: 'medium',
    kind: 'equation',
    options,
    correctIndex,
    ruleDescription: '각 도형의 변 개수를 더한 값',
    equationText,
    equationShapes
  };
}

/**
 * Generate complex equation puzzle
 */
export function generateComplexEquation(): ExtendedPuzzle {
  const types: ShapeType[] = ['triangle', 'square', 'pentagon'];
  const type1 = types[Math.floor(Math.random() * types.length)];
  const type2 = types[Math.floor(Math.random() * types.length)];
  const type3 = types[Math.floor(Math.random() * types.length)];

  const sides1 = ShapeValueMapping.sides[type1];
  const sides2 = ShapeValueMapping.sides[type2];
  const sides3 = ShapeValueMapping.sides[type3];

  // Rule: (shape1 + shape2) - shape3
  const answer = (sides1 + sides2) - sides3;

  const equationShapes: Shape[] = [
    { type: type1, fill: 'empty', color: 'black', rotation: 0, size: 'medium' },
    { type: type2, fill: 'empty', color: 'black', rotation: 0, size: 'medium' },
    { type: type3, fill: 'empty', color: 'black', rotation: 0, size: 'medium' }
  ];

  const equationText = `(${type1} + ${type2}) - ${type3} = ?`;

  // Generate options
  const optionValues = new Set<number>([answer]);
  while (optionValues.size < 4) {
    const delta = Math.floor(Math.random() * 3) + 1;
    const newValue = answer + (Math.random() < 0.5 ? -delta : delta);
    optionValues.add(newValue);
  }

  const values = Array.from(optionValues);
  const correctIndex = values.indexOf(answer);

  const options: Shape[] = values.map(v => ({
    type: 'circle',
    fill: 'empty',
    color: 'black',
    rotation: 0,
    size: 'medium',
    dots: Math.abs(v) // Use absolute value for dots
  }));

  return {
    difficulty: 'hard',
    kind: 'equation',
    options,
    correctIndex,
    ruleDescription: '(첫 번째 + 두 번째) - 세 번째 도형의 변 개수',
    equationText,
    equationShapes
  };
}