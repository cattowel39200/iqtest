// ============================================
// Main Shape Puzzle Application Component
// ============================================

import React, { useState, useEffect } from 'react';
import { Puzzle, DifficultyType, FeedbackState } from './types';
import DifficultySelector from './DifficultySelector';
import PuzzleSequence from './PuzzleSequence';
import PuzzleGrid from './PuzzleGrid';
import AnswerOptions from './AnswerOptions';

interface ShapePuzzleAppProps {
  className?: string;
  onPuzzleComplete?: (puzzle: Puzzle, isCorrect: boolean) => void;
}

const ShapePuzzleApp: React.FC<ShapePuzzleAppProps> = ({
  className = '',
  onPuzzleComplete,
}) => {
  const [currentDifficulty, setCurrentDifficulty] = useState<DifficultyType | null>(null);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>({
    show: false,
    type: 'success',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Mock puzzle generator (in real app, this would come from your shape-generator)
  const generateMockPuzzle = (difficulty: DifficultyType): Puzzle => {
    // This is a simplified version - in reality, you'd use the algorithms from shape-generator.js
    const mockPuzzles: Record<DifficultyType, Puzzle> = {
      easy: {
        difficulty: 'easy',
        sequence: [
          { type: 'circle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 1 },
          { type: 'circle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 2 },
          { type: 'circle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 3 },
          { type: 'circle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 4 },
        ],
        options: [
          { type: 'circle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 5 },
          { type: 'circle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 6 },
          { type: 'circle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 7 },
          { type: 'circle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 4 },
        ],
        correctIndex: 0,
        ruleDescription: '점 개수가 1씩 증가하는 규칙',
      },
      medium: {
        difficulty: 'medium',
        sequence: [
          { type: 'circle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 1 },
          { type: 'triangle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 2 },
          { type: 'square', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 3 },
          { type: 'circle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 4 },
        ],
        options: [
          { type: 'triangle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 5 },
          { type: 'square', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 5 },
          { type: 'pentagon', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 5 },
          { type: 'hexagon', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 5 },
        ],
        correctIndex: 0,
        ruleDescription: '모양 순환(원→삼→사→원) + 점 개수 1씩 증가',
      },
      hard: {
        difficulty: 'hard',
        sequence: [],
        grid: [
          [
            { type: 'circle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 1 },
            { type: 'circle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 2 },
            { type: 'circle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 3 },
          ],
          [
            { type: 'circle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 2 },
            { type: 'circle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 3 },
            { type: 'circle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 5 },
          ],
          [
            { type: 'circle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 3 },
            { type: 'circle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 4 },
            { type: 'circle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 0 }, // Missing
          ],
        ],
        missingCell: { row: 2, col: 2 },
        options: [
          { type: 'circle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 7 },
          { type: 'circle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 8 },
          { type: 'circle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 6 },
          { type: 'circle', fill: 'empty', color: 'black', rotation: 0, size: 'medium', dots: 9 },
        ],
        correctIndex: 0,
        ruleDescription: '각 행에서 3번째 칸 = 1번째 + 2번째 (3 + 4 = 7)',
      },
    };

    return mockPuzzles[difficulty];
  };

  const handleDifficultySelect = async (difficulty: DifficultyType) => {
    setIsLoading(true);
    setCurrentDifficulty(difficulty);

    // Simulate loading time for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    const newPuzzle = generateMockPuzzle(difficulty);
    setCurrentPuzzle(newPuzzle);
    setIsLoading(false);
  };

  const handleAnswer = (selectedIndex: number, isCorrect: boolean) => {
    if (!currentPuzzle) return;

    setFeedback({
      show: true,
      type: isCorrect ? 'success' : 'error',
      message: isCorrect ? '정답입니다! 🎉' : '아쉽네요! 😅',
      ruleExplanation: currentPuzzle.ruleDescription,
    });

    // Call parent callback if provided
    onPuzzleComplete?.(currentPuzzle, isCorrect);
  };

  const generateNewPuzzle = async () => {
    if (!currentDifficulty) return;

    setIsLoading(true);
    setFeedback({ show: false, type: 'success', message: '' });

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 500));

    const newPuzzle = generateMockPuzzle(currentDifficulty);
    setCurrentPuzzle(newPuzzle);
    setIsLoading(false);
  };

  const backToDifficultySelection = () => {
    setCurrentDifficulty(null);
    setCurrentPuzzle(null);
    setFeedback({ show: false, type: 'success', message: '' });
  };

  const getDifficultyName = (difficulty: DifficultyType): string => {
    const names = { easy: '초급', medium: '중급', hard: '고급' };
    return names[difficulty];
  };

  const getDifficultyColor = (difficulty: DifficultyType): string => {
    const colors = {
      easy: 'from-green-400 to-emerald-500',
      medium: 'from-yellow-400 to-orange-500',
      hard: 'from-red-400 to-pink-500',
    };
    return colors[difficulty];
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${className}`}>
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🧠 도형 IQ 테스트
            </h1>
            <p className="text-lg text-gray-600">
              AI가 자동 생성하는 무한 도형 퍼즐
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {!currentDifficulty ? (
          // Difficulty Selection Screen
          <DifficultySelector onSelect={handleDifficultySelect} />
        ) : (
          // Puzzle Screen
          <div className="space-y-8">
            {/* Puzzle Header */}
            <div className="flex justify-between items-center bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${getDifficultyColor(currentDifficulty)}`}></div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {getDifficultyName(currentDifficulty)} 난이도
                </h2>
              </div>
              <button
                onClick={backToDifficultySelection}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200"
              >
                다른 난이도 선택
              </button>
            </div>

            {isLoading ? (
              // Loading State
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-lg text-gray-600">새로운 퍼즐 생성 중...</p>
                </div>
              </div>
            ) : currentPuzzle ? (
              // Puzzle Content
              <div className="space-y-8">
                {/* Puzzle Display */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  {currentPuzzle.grid ? (
                    <PuzzleGrid
                      grid={currentPuzzle.grid}
                      missingCell={currentPuzzle.missingCell}
                      className="p-8"
                    />
                  ) : (
                    <PuzzleSequence
                      sequence={currentPuzzle.sequence}
                      className="p-8"
                    />
                  )}
                </div>

                {/* Answer Options */}
                <div className="bg-white rounded-2xl shadow-lg">
                  <AnswerOptions
                    options={currentPuzzle.options}
                    correctIndex={currentPuzzle.correctIndex}
                    onAnswer={handleAnswer}
                    disabled={feedback.show}
                  />
                </div>

                {/* Feedback */}
                {feedback.show && (
                  <div className={`p-6 rounded-2xl shadow-lg ${
                    feedback.type === 'success'
                      ? 'bg-green-50 border-2 border-green-200'
                      : 'bg-red-50 border-2 border-red-200'
                  }`}>
                    <div className="text-center">
                      <p className={`text-lg font-semibold mb-2 ${
                        feedback.type === 'success' ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {feedback.message}
                      </p>
                      {feedback.ruleExplanation && (
                        <p className="text-gray-700 italic">
                          규칙: {feedback.ruleExplanation}
                        </p>
                      )}
                      <button
                        onClick={generateNewPuzzle}
                        className={`mt-4 px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                          feedback.type === 'success'
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        } hover:scale-105 active:scale-95`}
                      >
                        새로운 문제 생성 →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
};

export default ShapePuzzleApp;