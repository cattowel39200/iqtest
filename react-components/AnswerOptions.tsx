// ============================================
// Answer Options Component - Interactive Shape Selection
// ============================================

import React, { useState } from 'react';
import { Shape } from './types';
import ShapeRenderer from './ShapeRenderer';

interface AnswerOptionsProps {
  options: Shape[];
  correctIndex: number;
  onAnswer: (selectedIndex: number, isCorrect: boolean) => void;
  className?: string;
  shapeSize?: number;
  disabled?: boolean;
}

const AnswerOptions: React.FC<AnswerOptionsProps> = ({
  options,
  correctIndex,
  onAnswer,
  className = '',
  shapeSize = 80,
  disabled = false,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleOptionClick = (index: number) => {
    if (disabled || showResult) return;

    const isCorrect = index === correctIndex;
    setSelectedIndex(index);
    setShowResult(true);

    // Call parent callback
    setTimeout(() => {
      onAnswer(index, isCorrect);
    }, 500);
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
    if (index === correctIndex) {
      return `${baseClasses} bg-green-50 border-green-400 shadow-green-200 shadow-lg animate-pulse`;
    }

    if (index === selectedIndex && index !== correctIndex) {
      return `${baseClasses} bg-red-50 border-red-400 shadow-red-200 shadow-lg animate-bounce`;
    }

    return `${baseClasses} bg-gray-50 border-gray-300 opacity-60`;
  };

  const getOptionIcon = (index: number) => {
    if (!showResult) return null;

    if (index === correctIndex) {
      return (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold animate-bounce">
          ✓
        </div>
      );
    }

    if (index === selectedIndex && index !== correctIndex) {
      return (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold animate-bounce">
          ✗
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`p-6 ${className}`}>
      {/* Section Title */}
      <div className="text-center mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">
          정답을 선택하세요
        </h4>
        <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-500 mx-auto rounded-full"></div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        {options.map((option, index) => (
          <div
            key={index}
            className={`relative ${getOptionClasses(index)}`}
            onClick={() => handleOptionClick(index)}
          >
            {/* Option content */}
            <div className="flex flex-col items-center gap-3">
              <ShapeRenderer
                shape={option}
                size={shapeSize}
                isSelected={selectedIndex === index && !showResult}
                isCorrect={showResult && index === correctIndex}
                isWrong={showResult && index === selectedIndex && index !== correctIndex}
              />

              {/* Option label */}
              <div className="text-sm font-medium text-gray-600">
                선택 {index + 1}
              </div>
            </div>

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
          <p className="text-sm text-gray-500">
            위의 보기 중에서 패턴에 맞는 도형을 클릭하세요
          </p>
        </div>
      )}

      {/* Result feedback */}
      {showResult && (
        <div className="mt-6 text-center">
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${
            selectedIndex === correctIndex
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}>
            <span className="text-lg">
              {selectedIndex === correctIndex ? '🎉' : '😅'}
            </span>
            <span className="font-semibold">
              {selectedIndex === correctIndex ? '정답입니다!' : '아쉽네요!'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnswerOptions;