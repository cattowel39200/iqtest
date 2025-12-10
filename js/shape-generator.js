// ============================================
// Shape Generator - Based on 문제유형.txt Algorithm Design
// ============================================

// Type definitions based on the specification
const ShapeTypes = {
    CIRCLE: 'circle',
    TRIANGLE: 'triangle',
    SQUARE: 'square',
    PENTAGON: 'pentagon',
    HEXAGON: 'hexagon'
};

const FillTypes = {
    EMPTY: 'empty',
    QUARTER: 'quarter',
    HALF: 'half',
    FULL: 'full'
};

const ColorTypes = {
    BLACK: 'black',
    GRAY: 'gray',
    WHITE: 'white'
};

const SizeTypes = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large'
};

// Shape class definition
class Shape {
    constructor(type, fill, color, rotation, size, dots) {
        this.type = type;
        this.fill = fill;
        this.color = color;
        this.rotation = rotation || 0;
        this.size = size;
        this.dots = dots;
    }

    // Create a copy of the shape
    clone() {
        return new Shape(this.type, this.fill, this.color, this.rotation, this.size, this.dots);
    }
}

// Puzzle class definition
class Puzzle {
    constructor(difficulty, sequence, options, correctIndex, ruleDescription, grid, missingCell) {
        this.difficulty = difficulty;
        this.sequence = sequence || [];
        this.options = options;
        this.correctIndex = correctIndex;
        this.ruleDescription = ruleDescription;
        this.grid = grid;
        this.missingCell = missingCell;
    }
}

// ============================================
// Helper Functions for Pattern Generation
// ============================================

const polygonOrder = [ShapeTypes.CIRCLE, ShapeTypes.TRIANGLE, ShapeTypes.SQUARE, ShapeTypes.PENTAGON, ShapeTypes.HEXAGON];
const fillOrder = [FillTypes.FULL, FillTypes.QUARTER, FillTypes.HALF, FillTypes.FULL];
const colorOrder = [ColorTypes.BLACK, ColorTypes.GRAY, ColorTypes.WHITE];
const sizeOrder = [SizeTypes.SMALL, SizeTypes.MEDIUM, SizeTypes.LARGE];

function nextPolygon(current) {
    const idx = polygonOrder.indexOf(current);
    return polygonOrder[(idx + 1) % polygonOrder.length];
}

function nextFill(current) {
    const idx = fillOrder.indexOf(current);
    return fillOrder[(idx + 1) % fillOrder.length];
}

function nextColor(current) {
    const idx = colorOrder.indexOf(current);
    return colorOrder[(idx + 1) % colorOrder.length];
}

function nextSize(current) {
    const idx = sizeOrder.indexOf(current);
    return sizeOrder[(idx + 1) % sizeOrder.length];
}

function nextRotation(r) {
    return (r + 90) % 360;
}

function toggleColor(c) {
    return c === ColorTypes.BLACK ? ColorTypes.WHITE : ColorTypes.BLACK;
}

// Random selection helpers
function randomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ============================================
// Easy Level Generators (Single Property Changes)
// ============================================

function generateEasyCountPuzzle() {
    const length = 4;
    const base = Math.floor(Math.random() * 3) + 1; // 1-3
    const step = Math.floor(Math.random() * 2) + 1; // 1-2

    const sequence = [];
    for (let i = 0; i < length; i++) {
        sequence.push(new Shape(
            ShapeTypes.CIRCLE,
            FillTypes.FULL,
            ColorTypes.BLACK,
            0,
            SizeTypes.MEDIUM,
            base + step * i
        ));
    }

    const correctDots = base + step * length;

    // Generate options with correct answer and distractors
    const optionsDots = new Set([correctDots]);
    while (optionsDots.size < 4) {
        const delta = Math.floor(Math.random() * 3) + 1;
        const newDots = correctDots + (Math.random() < 0.5 ? delta : -delta);
        if (newDots > 0) {
            optionsDots.add(newDots);
        }
    }

    const dotsArray = shuffleArray(Array.from(optionsDots));
    const correctIndex = dotsArray.indexOf(correctDots);

    const options = dotsArray.map(d => new Shape(
        ShapeTypes.CIRCLE,
        FillTypes.FULL,
        ColorTypes.BLACK,
        0,
        SizeTypes.MEDIUM,
        d
    ));

    return new Puzzle(
        'easy',
        sequence,
        options,
        correctIndex,
        `점 개수가 ${step}씩 증가하는 규칙`
    );
}

function generateEasyShapePuzzle() {
    const length = 4;
    const startIdx = Math.floor(Math.random() * 3); // Start from random shape

    const sequence = [];
    for (let i = 0; i < length; i++) {
        sequence.push(new Shape(
            polygonOrder[(startIdx + i) % polygonOrder.length],
            FillTypes.FULL,
            ColorTypes.BLACK,
            0,
            SizeTypes.MEDIUM,
            1
        ));
    }

    const correctShape = polygonOrder[(startIdx + length) % polygonOrder.length];

    // Generate options
    const correctOption = new Shape(correctShape, FillTypes.FULL, ColorTypes.BLACK, 0, SizeTypes.MEDIUM, 1);
    const wrongOptions = [];

    // Add 3 wrong shapes
    for (let i = 1; i <= 3; i++) {
        wrongOptions.push(new Shape(
            polygonOrder[(polygonOrder.indexOf(correctShape) + i) % polygonOrder.length],
            FillTypes.FULL,
            ColorTypes.BLACK,
            0,
            SizeTypes.MEDIUM,
            1
        ));
    }

    const allOptions = shuffleArray([correctOption, ...wrongOptions]);
    const correctIndex = allOptions.indexOf(correctOption);

    return new Puzzle(
        'easy',
        sequence,
        allOptions,
        correctIndex,
        '도형 종류가 순서대로 변하는 규칙'
    );
}

function generateEasyFillPuzzle() {
    const length = 4;
    const startIdx = Math.floor(Math.random() * fillOrder.length);

    const sequence = [];
    for (let i = 0; i < length; i++) {
        sequence.push(new Shape(
            ShapeTypes.CIRCLE,
            fillOrder[(startIdx + i) % fillOrder.length],
            ColorTypes.BLACK,
            0,
            SizeTypes.MEDIUM
        ));
    }

    const correctFill = fillOrder[(startIdx + length) % fillOrder.length];

    const correctOption = new Shape(ShapeTypes.CIRCLE, correctFill, ColorTypes.BLACK, 0, SizeTypes.MEDIUM);
    const wrongOptions = fillOrder.filter(f => f !== correctFill).slice(0, 3).map(f =>
        new Shape(ShapeTypes.CIRCLE, f, ColorTypes.BLACK, 0, SizeTypes.MEDIUM)
    );

    const allOptions = shuffleArray([correctOption, ...wrongOptions]);
    const correctIndex = allOptions.indexOf(correctOption);

    return new Puzzle(
        'easy',
        sequence,
        allOptions,
        correctIndex,
        '도형 채움 정도가 순서대로 변하는 규칙'
    );
}

// ============================================
// Medium Level Generators (Two Property Changes)
// ============================================

function generateMediumShapeDotsPuzzle() {
    const length = 5;
    const shapeOrder = [ShapeTypes.CIRCLE, ShapeTypes.TRIANGLE, ShapeTypes.SQUARE];
    const sequence = [];
    let dots = Math.floor(Math.random() * 3) + 1; // Start with 1-3 dots

    for (let i = 0; i < length; i++) {
        sequence.push(new Shape(
            shapeOrder[i % shapeOrder.length],
            FillTypes.FULL,
            ColorTypes.BLACK,
            0,
            SizeTypes.MEDIUM,
            dots
        ));
        dots++;
    }

    const correctShape = new Shape(
        shapeOrder[length % shapeOrder.length],
        FillTypes.FULL,
        ColorTypes.BLACK,
        0,
        SizeTypes.MEDIUM,
        dots
    );

    // Generate options with shape/dots variations
    const options = [];
    const correctIndex = Math.floor(Math.random() * 4);

    for (let i = 0; i < 4; i++) {
        if (i === correctIndex) {
            options.push(correctShape);
        } else {
            const wrongShape = correctShape.clone();
            if (Math.random() < 0.5) {
                // Wrong shape type
                wrongShape.type = randomFromArray(shapeOrder.filter(s => s !== correctShape.type));
            } else {
                // Wrong dots count
                wrongShape.dots = correctShape.dots + (Math.random() < 0.5 ? -1 : 1);
                if (wrongShape.dots < 1) wrongShape.dots = correctShape.dots + 2;
            }
            options.push(wrongShape);
        }
    }

    return new Puzzle(
        'medium',
        sequence,
        options,
        correctIndex,
        '모양 순환 + 점 개수 1씩 증가'
    );
}

function generateMediumRotationColorPuzzle() {
    const length = 4;
    const sequence = [];
    let rotation = 0;
    let color = ColorTypes.BLACK;

    for (let i = 0; i < length; i++) {
        sequence.push(new Shape(
            ShapeTypes.TRIANGLE,
            FillTypes.FULL,
            color,
            rotation,
            SizeTypes.MEDIUM
        ));
        rotation = nextRotation(rotation);
        color = toggleColor(color);
    }

    const correctShape = new Shape(
        ShapeTypes.TRIANGLE,
        FillTypes.FULL,
        color,
        rotation,
        SizeTypes.MEDIUM
    );

    const options = [];
    const correctIndex = Math.floor(Math.random() * 4);

    for (let i = 0; i < 4; i++) {
        if (i === correctIndex) {
            options.push(correctShape);
        } else {
            const wrongShape = correctShape.clone();
            if (Math.random() < 0.5) {
                wrongShape.rotation = (correctShape.rotation + 90) % 360;
            } else {
                wrongShape.color = toggleColor(correctShape.color);
            }
            options.push(wrongShape);
        }
    }

    return new Puzzle(
        'medium',
        sequence,
        options,
        correctIndex,
        '회전 90도씩 + 색상 교대'
    );
}

// ============================================
// Hard Level Generators (Grid and Complex Rules)
// ============================================

function generateHardGridSumPuzzle() {
    const rows = 3;
    const cols = 3;
    const grid = [];

    // Generate base values
    const baseValue = Math.floor(Math.random() * 3) + 1; // 1-3

    for (let r = 0; r < rows; r++) {
        const row = [];
        const a = baseValue + r;
        const b = a + 1;
        const c = a + b; // Sum rule: third = first + second

        [a, b, c].forEach(dots => {
            row.push(new Shape(
                ShapeTypes.CIRCLE,
                FillTypes.FULL,
                ColorTypes.BLACK,
                0,
                SizeTypes.MEDIUM,
                dots
            ));
        });
        grid.push(row);
    }

    // Make last cell missing
    const missingRow = 2;
    const missingCol = 2;
    const correctDots = grid[missingRow][missingCol].dots;
    grid[missingRow][missingCol] = new Shape(
        ShapeTypes.CIRCLE,
        FillTypes.FULL,
        ColorTypes.BLACK,
        0,
        SizeTypes.MEDIUM
    ); // No dots - represents missing

    // Generate options
    const optionsDots = new Set([correctDots]);
    while (optionsDots.size < 4) {
        const delta = Math.floor(Math.random() * 4) + 1;
        const newDots = correctDots + (Math.random() < 0.5 ? delta : -delta);
        if (newDots > 0) {
            optionsDots.add(newDots);
        }
    }

    const dotsArray = shuffleArray(Array.from(optionsDots));
    const correctIndex = dotsArray.indexOf(correctDots);

    const options = dotsArray.map(d => new Shape(
        ShapeTypes.CIRCLE,
        FillTypes.FULL,
        ColorTypes.BLACK,
        0,
        SizeTypes.MEDIUM,
        d
    ));

    return new Puzzle(
        'hard',
        [], // No sequence for grid puzzles
        options,
        correctIndex,
        '각 행에서 3번째 칸 = 1번째 + 2번째',
        grid,
        { row: missingRow, col: missingCol }
    );
}

function generateHardShapeOperationPuzzle() {
    const grid = [];

    // Define shape-to-sides mapping
    const shapeSides = {
        [ShapeTypes.TRIANGLE]: 3,
        [ShapeTypes.SQUARE]: 4,
        [ShapeTypes.PENTAGON]: 5,
        [ShapeTypes.HEXAGON]: 6
    };

    const shapes = Object.keys(shapeSides);

    for (let r = 0; r < 3; r++) {
        const row = [];
        const shapeA = randomFromArray(shapes);
        const shapeB = randomFromArray(shapes);
        const sidesSum = shapeSides[shapeA] + shapeSides[shapeB];

        // Find shape that matches the sum (or closest)
        let resultShape = ShapeTypes.TRIANGLE;
        for (const [shape, sides] of Object.entries(shapeSides)) {
            if (sides === sidesSum || (sidesSum > 6 && sides === 6)) {
                resultShape = shape;
                break;
            }
        }

        row.push(new Shape(shapeA, FillTypes.FULL, ColorTypes.BLACK, 0, SizeTypes.MEDIUM));
        row.push(new Shape(shapeB, FillTypes.FULL, ColorTypes.BLACK, 0, SizeTypes.MEDIUM));
        row.push(new Shape(resultShape, FillTypes.FULL, ColorTypes.BLACK, 0, SizeTypes.MEDIUM));

        grid.push(row);
    }

    // Make last cell missing
    const missingRow = 2;
    const missingCol = 2;
    const correctShape = grid[missingRow][missingCol].type;
    grid[missingRow][missingCol] = new Shape(
        null, // No type - represents missing
        FillTypes.FULL,
        ColorTypes.BLACK,
        0,
        SizeTypes.MEDIUM
    );

    // Generate options
    const correctOption = new Shape(correctShape, FillTypes.FULL, ColorTypes.BLACK, 0, SizeTypes.MEDIUM);
    const wrongOptions = shapes.filter(s => s !== correctShape).slice(0, 3).map(s =>
        new Shape(s, FillTypes.FULL, ColorTypes.BLACK, 0, SizeTypes.MEDIUM)
    );

    const allOptions = shuffleArray([correctOption, ...wrongOptions]);
    const correctIndex = allOptions.indexOf(correctOption);

    return new Puzzle(
        'hard',
        [],
        allOptions,
        correctIndex,
        '변 개수 합 규칙: 첫 번째 + 두 번째 = 세 번째',
        grid,
        { row: missingRow, col: missingCol }
    );
}

// ============================================
// Main Generator Function
// ============================================

function generatePuzzle(difficulty) {
    switch (difficulty) {
        case 'easy':
            const easyGenerators = [
                generateEasyCountPuzzle,
                generateEasyShapePuzzle,
                generateEasyFillPuzzle
            ];
            return randomFromArray(easyGenerators)();

        case 'medium':
            const mediumGenerators = [
                generateMediumShapeDotsPuzzle,
                generateMediumRotationColorPuzzle
            ];
            return randomFromArray(mediumGenerators)();

        case 'hard':
            const hardGenerators = [
                generateHardGridSumPuzzle,
                generateHardShapeOperationPuzzle
            ];
            return randomFromArray(hardGenerators)();

        default:
            return generateEasyCountPuzzle();
    }
}

// ============================================
// Extended Puzzle Generation for Game Modes
// ============================================

// Extended puzzle generator compatible with game modes
function generateExtendedPuzzle(type, difficulty = 'medium') {
    switch (type) {
        case 'odd-one-out':
            return generateOddOneOutPuzzle(difficulty);
        case 'analogy':
            return generateAnalogyPuzzle(difficulty);
        case 'sequence':
            return generatePuzzle(difficulty);
        case 'grid':
            return generatePuzzle('hard'); // Grid puzzles are typically hard
        case 'equation':
            return generateEquationPuzzle(difficulty);
        default:
            return generatePuzzle(difficulty);
    }
}

// Generate odd-one-out puzzle
function generateOddOneOutPuzzle(difficulty) {
    const shapes = ['circle', 'triangle', 'square', 'pentagon', 'hexagon'];
    const colors = ['black'];
    const fills = ['full'];

    // Create 3 similar + 1 different
    const majorityType = randomFromArray(shapes);
    const minorityType = randomFromArray(shapes.filter(s => s !== majorityType));
    const commonColor = randomFromArray(colors);
    const commonFill = randomFromArray(fills);

    const options = [];
    const correctIndex = Math.floor(Math.random() * 4);

    for (let i = 0; i < 4; i++) {
        options.push(new Shape(
            i === correctIndex ? minorityType : majorityType,
            commonFill,
            commonColor,
            0,
            'medium'
        ));
    }

    return {
        kind: 'odd-one-out',
        difficulty: difficulty,
        options: options,
        correctIndex: correctIndex,
        ruleDescription: `3개는 ${majorityType}, 1개만 ${minorityType}`
    };
}

// Generate analogy puzzle
function generateAnalogyPuzzle(difficulty) {
    const shapes = ['triangle', 'square', 'pentagon', 'hexagon'];

    // A -> B relationship (add 1 side)
    const A = randomFromArray(shapes.slice(0, -1));
    const AIndex = shapes.indexOf(A);
    const B = shapes[AIndex + 1];

    // C -> D (apply same relationship)
    const validC = shapes.slice(0, -1); // Exclude last shape to ensure D exists
    const C = randomFromArray(validC);
    const CIndex = shapes.indexOf(C);
    const D = shapes[CIndex + 1]; // Always valid now

    const makeShape = (type) => new Shape(type, 'full', 'black', 0, 'medium');

    // Create wrong options ensuring no duplicates
    const allShapes = ['triangle', 'square', 'pentagon', 'hexagon', 'circle'];
    let wrongOptions = allShapes.filter(s => s !== D);

    // Shuffle and take exactly 3 different options
    wrongOptions.sort(() => Math.random() - 0.5);
    wrongOptions = wrongOptions.slice(0, 3);

    // Ensure we have exactly 4 unique options
    const options = [D, ...wrongOptions];
    options.sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(D);

    return {
        kind: 'analogy',
        difficulty: difficulty,
        analogyPairs: {
            A: makeShape(A),
            B: makeShape(B),
            C: makeShape(C)
        },
        options: options.map(makeShape),
        correctIndex: correctIndex,
        ruleDescription: `${A}→${B} 관계를 ${C}→? 에 적용`
    };
}

// Generate equation puzzle
function generateEquationPuzzle(difficulty) {
    const shapes = ['triangle', 'square', 'pentagon', 'hexagon'];
    const values = { triangle: 3, square: 4, pentagon: 5, hexagon: 6 };

    const shape1 = randomFromArray(shapes);
    const shape2 = randomFromArray(shapes);
    const result = values[shape1] + values[shape2];

    // Find shape with exact value match
    const resultShape = Object.keys(values).find(s => values[s] === result) || 'hexagon';

    // Create exactly 3 wrong options, ensuring no duplicates
    let wrongOptions = shapes.filter(s => s !== resultShape);
    wrongOptions.sort(() => Math.random() - 0.5);
    wrongOptions = wrongOptions.slice(0, 3);

    // Ensure 4 unique options
    const options = [resultShape, ...wrongOptions];
    options.sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(resultShape);

    return {
        kind: 'equation',
        difficulty: difficulty,
        equation: {
            problem: `${shape1}(${values[shape1]}) + ${shape2}(${values[shape2]}) = ?`
        },
        options: options.map(type => new Shape(type, 'full', 'black', 0, 'medium')),
        correctIndex: correctIndex,
        ruleDescription: `도형의 변 개수를 더하기: ${values[shape1]} + ${values[shape2]} = ${result}`
    };
}