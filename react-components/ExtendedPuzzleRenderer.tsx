// ============================================
// Extended Puzzle Renderer - All Problem Types
// ============================================

import React from 'react';
import { ExtendedPuzzle } from './extended-types';
import ShapeRenderer from './ShapeRenderer';
import PuzzleSequence from './PuzzleSequence';
import PuzzleGrid from './PuzzleGrid';

interface ExtendedPuzzleRendererProps {
  puzzle: ExtendedPuzzle;
  className?: string;
  shapeSize?: number;
}

const ExtendedPuzzleRenderer: React.FC<ExtendedPuzzleRendererProps> = ({
  puzzle,
  className = '',
  shapeSize = 70,
}) => {
  const renderPuzzleContent = () => {
    switch (puzzle.kind) {
      case 'sequence':
        return renderSequencePuzzle();

      case 'odd-one-out':
        return renderOddOneOutPuzzle();

      case 'analogy':
        return renderAnalogyPuzzle();

      case 'grid':
        return renderGridPuzzle();

      case 'symmetry':
        return renderSymmetryPuzzle();

      case 'equation':
        return renderEquationPuzzle();

      default:
        return renderSequencePuzzle(); // Fallback
    }
  };

  const renderSequencePuzzle = () => {
    if (!puzzle.sequence) return null;

    return (
      <PuzzleSequence
        sequence={puzzle.sequence}
        shapeSize={shapeSize}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl"
      />
    );
  };

  const renderOddOneOutPuzzle = () => {
    return (
      <div className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            다른 하나를 찾으세요
          </h3>
          <p className="text-sm text-gray-600">
            아래 4개 중에서 나머지와 다른 특징을 가진 도형을 선택하세요
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-red-500 mx-auto rounded-full mt-3"></div>
        </div>

        {/* Show all options as the puzzle itself */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {puzzle.options.map((option, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border-2 border-orange-200 hover:border-orange-300 transition-colors"
            >
              <ShapeRenderer
                shape={option}
                size={shapeSize}
                className="transition-transform duration-200 hover:scale-110"
              />
              <div className="text-xs text-gray-500 font-medium">
                {String.fromCharCode(65 + index)} {/* A, B, C, D */}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full border border-orange-200">
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
            <span className="text-sm text-orange-700 font-medium">
              공통점과 차이점을 찾아보세요
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderAnalogyPuzzle = () => {
    if (!puzzle.analogyPairs) return null;

    const { A, B, C } = puzzle.analogyPairs;

    return (
      <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            비례 관계를 찾으세요
          </h3>
          <p className="text-sm text-gray-600">
            A와 B의 관계를 파악하여 C에 해당하는 답을 찾으세요
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-500 mx-auto rounded-full mt-3"></div>
        </div>

        {/* Analogy display: A → B :: C → ? */}
        <div className="flex items-center justify-center gap-6 mb-8 flex-wrap">
          {/* A → B */}
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-purple-200">
            <div className="text-center">
              <ShapeRenderer shape={A} size={shapeSize} />
              <div className="text-xs text-gray-500 mt-2 font-medium">A</div>
            </div>
            <div className="text-2xl text-purple-500 font-bold">→</div>
            <div className="text-center">
              <ShapeRenderer shape={B} size={shapeSize} />
              <div className="text-xs text-gray-500 mt-2 font-medium">B</div>
            </div>
          </div>

          {/* :: separator */}
          <div className="text-3xl text-purple-400 font-bold hidden md:block">::</div>

          {/* C → ? */}
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-purple-200">
            <div className="text-center">
              <ShapeRenderer shape={C} size={shapeSize} />
              <div className="text-xs text-gray-500 mt-2 font-medium">C</div>
            </div>
            <div className="text-2xl text-purple-500 font-bold">→</div>
            <div className="text-center">
              <div
                className="flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-dashed border-purple-300 rounded-xl"
                style={{ width: shapeSize + 20, height: shapeSize + 20 }}
              >
                <span className="text-3xl text-purple-600 font-bold animate-pulse">?</span>
              </div>
              <div className="text-xs text-gray-500 mt-2 font-medium">?</div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full border border-purple-200">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
            <span className="text-sm text-purple-700 font-medium">
              A→B의 규칙을 C에 적용하세요
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderGridPuzzle = () => {
    if (!puzzle.grid || !puzzle.missingCell) return null;

    return (
      <div className="p-6 bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-2xl">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            패턴을 완성하세요
          </h3>
          <p className="text-sm text-gray-600">
            격자의 규칙을 찾아 빈칸에 들어갈 도형을 선택하세요
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-cyan-500 mx-auto rounded-full mt-3"></div>
        </div>

        <PuzzleGrid
          grid={puzzle.grid}
          missingCell={puzzle.missingCell}
          shapeSize={shapeSize}
          className="mx-auto"
        />

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-100 px-4 py-2 rounded-full border border-emerald-200">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-sm text-emerald-700 font-medium">
              행과 열의 규칙을 분석하세요
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderSymmetryPuzzle = () => {
    return (
      <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            대칭성을 확인하세요
          </h3>
          <p className="text-sm text-gray-600">
            {puzzle.symmetryRule === 'vertical' ? '좌우 대칭' :
             puzzle.symmetryRule === 'horizontal' ? '상하 대칭' : '회전 대칭'}에
            맞지 않는 도형을 찾으세요
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-400 to-purple-500 mx-auto rounded-full mt-3"></div>
        </div>

        {/* Show all options */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {puzzle.options.map((option, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border-2 border-indigo-200 hover:border-indigo-300 transition-colors"
            >
              <ShapeRenderer
                shape={option}
                size={shapeSize}
                className="transition-transform duration-200 hover:scale-110"
              />
              <div className="text-xs text-gray-500 font-medium">
                {String.fromCharCode(65 + index)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-100 px-4 py-2 rounded-full border border-indigo-200">
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
            <span className="text-sm text-indigo-700 font-medium">
              대칭축을 그어보며 확인하세요
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderEquationPuzzle = () => {
    if (!puzzle.equationShapes || !puzzle.equationText) return null;

    return (
      <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            수식을 완성하세요
          </h3>
          <p className="text-sm text-gray-600">
            각 도형이 나타내는 숫자를 계산하여 답을 구하세요
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto rounded-full mt-3"></div>
        </div>

        {/* Equation display */}
        <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
          <div className="flex items-center gap-4 p-6 bg-white rounded-xl border-2 border-amber-200">
            {puzzle.equationShapes.map((shape, index) => (
              <React.Fragment key={index}>
                <ShapeRenderer shape={shape} size={shapeSize} />
                {index < puzzle.equationShapes!.length - 1 && (
                  <span className="text-2xl font-bold text-amber-600">+</span>
                )}
              </React.Fragment>
            ))}

            <span className="text-2xl font-bold text-amber-600 mx-2">=</span>

            <div
              className="flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-dashed border-amber-300 rounded-xl"
              style={{ width: shapeSize + 10, height: shapeSize + 10 }}
            >
              <span className="text-3xl text-amber-600 font-bold animate-pulse">?</span>
            </div>
          </div>
        </div>

        {/* Rule hint */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full border border-amber-200">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
            <span className="text-sm text-amber-700 font-medium">
              도형의 변 개수 또는 점 개수를 계산하세요
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`${className}`}>
      {renderPuzzleContent()}
    </div>
  );
};

export default ExtendedPuzzleRenderer;