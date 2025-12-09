// ============================================
// Extended Answer Options - Supports All Problem Types
// ============================================

import React, { useState } from 'react';
import { ExtendedPuzzle } from './extended-types';
import ShapeRenderer from './ShapeRenderer';

interface ExtendedAnswerOptionsProps {
  puzzle: ExtendedPuzzle;
  onAnswer: (selectedIndex: number, isCorrect: boolean) => void;
  className?: string;
  shapeSize?: number;
  disabled?: boolean;
}

const ExtendedAnswerOptions: React.FC<ExtendedAnswerOptionsProps> = ({
  puzzle,
  onAnswer,
  className = '',
  shapeSize = 70,
  disabled = false,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleOptionClick = (index: number) => {
    if (disabled || showResult) return;

    const isCorrect = index === puzzle.correctIndex;
    setSelectedIndex(index);
    setShowResult(true);

    // Call parent callback with delay for animation
    setTimeout(() => {
      onAnswer(index, isCorrect);
    }, 600);
  };

  const getOptionClasses = (index: number) => {
    const baseClasses = `
      p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
      transform hover:scale-105 hover:-translate-y-1 hover:shadow-lg
      active:scale-95 active:translate-y-0
    `;

    if (!showResult) {
      return `${baseClasses} bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50`;
    }

    // Show results
    if (index === puzzle.correctIndex) {
      return `${baseClasses} bg-green-50 border-green-400 shadow-green-200 shadow-lg animate-pulse`;
    }

    if (index === selectedIndex && index !== puzzle.correctIndex) {
      return `${baseClasses} bg-red-50 border-red-400 shadow-red-200 shadow-lg animate-bounce`;
    }

    return `${baseClasses} bg-gray-50 border-gray-300 opacity-60`;
  };

  const getOptionIcon = (index: number) => {
    if (!showResult) return null;

    if (index === puzzle.correctIndex) {
      return (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold animate-bounce">
          ✓
        </div>
      );
    }

    if (index === selectedIndex && index !== puzzle.correctIndex) {
      return (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold animate-bounce">
          ✗
        </div>
      );
    }

    return null;
  };

  const getInstructionText = () => {
    switch (puzzle.kind) {
      case 'odd-one-out':
        return '나머지와 다른 특징을 가진 도형을 선택하세요';
      case 'analogy':
        return 'C에 적용할 정답을 선택하세요';
      case 'grid':
        return '빈칸에 들어갈 도형을 선택하세요';
      case 'symmetry':
        return '대칭 규칙에 맞지 않는 도형을 선택하세요';
      case 'equation':
        return '계산 결과에 맞는 답을 선택하세요';
      case 'sequence':
      default:
        return '패턴에 맞는 다음 도형을 선택하세요';
    }
  };

  const getPuzzleKindColor = () => {
    switch (puzzle.kind) {
      case 'odd-one-out':
        return { bg: 'from-orange-400 to-red-500', border: 'border-orange-200' };
      case 'analogy':
        return { bg: 'from-purple-400 to-pink-500', border: 'border-purple-200' };
      case 'grid':
        return { bg: 'from-emerald-400 to-cyan-500', border: 'border-emerald-200' };
      case 'symmetry':
        return { bg: 'from-indigo-400 to-purple-500', border: 'border-indigo-200' };
      case 'equation':
        return { bg: 'from-amber-400 to-orange-500', border: 'border-amber-200' };
      case 'sequence':
      default:
        return { bg: 'from-blue-400 to-purple-500', border: 'border-blue-200' };
    }
  };

  const renderOptionContent = (option: any, index: number) => {
    // For equation puzzles, show numbers instead of complex shapes
    if (puzzle.kind === 'equation' && option.dots !== undefined) {
      return (
        <div className="flex flex-col items-center gap-3">
          <div
            className="bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-300"
            style={{ width: shapeSize, height: shapeSize }}
          >
            <span className="text-2xl font-bold text-gray-700">
              {option.dots}
            </span>
          </div>
          <div className="text-sm font-medium text-gray-600">
            {option.dots}
          </div>
        </div>
      );
    }

    // For odd-one-out puzzles in the main puzzle area, don't show options here
    if (puzzle.kind === 'odd-one-out') {
      return (
        <div className="flex flex-col items-center gap-3">
          <ShapeRenderer
            shape={option}
            size={shapeSize}
            isSelected={selectedIndex === index && !showResult}
            isCorrect={showResult && index === puzzle.correctIndex}
            isWrong={showResult && index === selectedIndex && index !== puzzle.correctIndex}
          />
          <div className="text-sm font-medium text-gray-600">
            선택 {String.fromCharCode(65 + index)}
          </div>
        </div>
      );
    }

    // Default shape rendering
    return (
      <div className="flex flex-col items-center gap-3">
        <ShapeRenderer
          shape={option}
          size={shapeSize}
          isSelected={selectedIndex === index && !showResult}
          isCorrect={showResult && index === puzzle.correctIndex}
          isWrong={showResult && index === selectedIndex && index !== puzzle.correctIndex}
        />
        <div className="text-sm font-medium text-gray-600">
          선택 {index + 1}
        </div>
      </div>
    );
  };

  const colorScheme = getPuzzleKindColor();

  return (
    <div className={`p-6 ${className}`}>
      {/* Section Title */}
      <div className="text-center mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">
          정답을 선택하세요
        </h4>
        <p className="text-sm text-gray-600 mb-3">
          {getInstructionText()}
        </p>
        <div className={`w-20 h-1 bg-gradient-to-r ${colorScheme.bg} mx-auto rounded-full`}></div>
      </div>

      {/* Options Grid */}
      <div className={`grid ${
        puzzle.kind === 'equation' ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-4'
      } gap-4 max-w-4xl mx-auto`}>
        {puzzle.options.map((option, index) => (
          <div
            key={index}
            className={`relative ${getOptionClasses(index)}`}
            onClick={() => handleOptionClick(index)}
          >
            {/* Option content */}
            {renderOptionContent(option, index)}

            {/* Result icon */}
            {getOptionIcon(index)}

            {/* Loading overlay when processing */}
            {selectedIndex === index && !showResult && (
              <div className="absolute inset-0 bg-blue-100 bg-opacity-50 rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Instructions */}
      {!showResult && !disabled && (
        <div className="mt-6 text-center">
          <div className={`inline-flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border ${colorScheme.border}`}>
            <span className={`w-2 h-2 bg-gradient-to-r ${colorScheme.bg} rounded-full animate-pulse`}></span>
            <span className="text-sm text-gray-600">
              위의 보기 중에서 알맞은 답을 클릭하세요
            </span>
          </div>
        </div>
      )}

      {/* Result feedback */}
      {showResult && (
        <div className="mt-6 text-center">
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${
            selectedIndex === puzzle.correctIndex
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}>
            <span className="text-lg">
              {selectedIndex === puzzle.correctIndex ? '🎉' : '😅'}
            </span>
            <div className="text-left">
              <div className="font-semibold">
                {selectedIndex === puzzle.correctIndex ? '정답입니다!' : '아쉽네요!'}
              </div>
              {puzzle.ruleDescription && (
                <div className="text-xs opacity-80 mt-1">
                  규칙: {puzzle.ruleDescription}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Difficulty indicator */}
      <div className="mt-4 text-center">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
          puzzle.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
          puzzle.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {puzzle.difficulty === 'easy' ? '초급' :
           puzzle.difficulty === 'medium' ? '중급' : '고급'} •{' '}
          {puzzle.kind === 'odd-one-out' ? '다른 하나 찾기' :
           puzzle.kind === 'analogy' ? '비례 문제' :
           puzzle.kind === 'grid' ? '격자 패턴' :
           puzzle.kind === 'symmetry' ? '대칭 문제' :
           puzzle.kind === 'equation' ? '수식 문제' : '수열 문제'}
        </span>
      </div>
    </div>
  );
};

export default ExtendedAnswerOptions;