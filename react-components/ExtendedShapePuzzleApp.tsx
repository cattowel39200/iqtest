// ============================================
// Extended Shape Puzzle App - Complete System
// ============================================

import React, { useState, useEffect } from 'react';
import { ExtendedPuzzle, PuzzlePack, FeedbackState } from './extended-types';
import {
  createBeginnerPack,
  createMixedChallengePack,
  createAdvancedPack,
  createSpeedChallengePack,
  getGeneratorStats
} from './puzzle-factory';
import PuzzlePackSelector from './PuzzlePackSelector';
import ExtendedPuzzleRenderer from './ExtendedPuzzleRenderer';
import ExtendedAnswerOptions from './ExtendedAnswerOptions';

interface ExtendedShapePuzzleAppProps {
  className?: string;
  onPuzzleComplete?: (puzzle: ExtendedPuzzle, isCorrect: boolean) => void;
  onPackComplete?: (pack: PuzzlePack, score: number, totalTime: number) => void;
}

const ExtendedShapePuzzleApp: React.FC<ExtendedShapePuzzleAppProps> = ({
  className = '',
  onPuzzleComplete,
  onPackComplete,
}) => {
  // App state
  const [currentScreen, setCurrentScreen] = useState<'pack-selection' | 'puzzle' | 'pack-results'>('pack-selection');
  const [currentPack, setCurrentPack] = useState<PuzzlePack | null>(null);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState<ExtendedPuzzle | null>(null);

  // Quiz state
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [userAnswers, setUserAnswers] = useState<Array<{ answer: number; isCorrect: boolean; timeSpent: number }>>([]);
  const [feedback, setFeedback] = useState<FeedbackState>({
    show: false,
    type: 'success',
    message: '',
  });

  // Pack results
  const [packResults, setPackResults] = useState<{
    score: number;
    totalTime: number;
    accuracy: number;
    completedQuestions: number;
  } | null>(null);

  // ============================================
  // TIMER MANAGEMENT
  // ============================================

  const startTimer = (duration: number) => {
    setTimeRemaining(duration);
    setStartTime(Date.now());

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimer(interval);
  };

  const stopTimer = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };

  const handleTimeUp = () => {
    // Auto-submit current puzzle or end pack
    if (currentPack && currentPuzzleIndex < currentPack.puzzles.length) {
      endPack();
    }
  };

  // ============================================
  // PACK MANAGEMENT
  // ============================================

  const handlePackSelect = (packName: string) => {
    let selectedPack: PuzzlePack;

    switch (packName) {
      case '초심자 팩':
        selectedPack = createBeginnerPack();
        break;
      case '고수 전용 팩':
        selectedPack = createAdvancedPack();
        break;
      case '스피드 챌린지 팩':
        selectedPack = createSpeedChallengePack();
        break;
      case '종합 도전 팩':
      default:
        selectedPack = createMixedChallengePack();
        break;
    }

    setCurrentPack(selectedPack);
    setCurrentPuzzleIndex(0);
    setUserAnswers([]);
    setCurrentPuzzle(selectedPack.puzzles[0]);
    setCurrentScreen('puzzle');

    // Start timer if pack has time limit
    if (selectedPack.timeLimit) {
      startTimer(selectedPack.timeLimit);
    }
  };

  const nextPuzzle = () => {
    if (!currentPack) return;

    const nextIndex = currentPuzzleIndex + 1;

    if (nextIndex >= currentPack.puzzles.length) {
      endPack();
    } else {
      setCurrentPuzzleIndex(nextIndex);
      setCurrentPuzzle(currentPack.puzzles[nextIndex]);
      setFeedback({ show: false, type: 'success', message: '' });
    }
  };

  const endPack = () => {
    stopTimer();

    // Calculate results
    const correctAnswers = userAnswers.filter(a => a.isCorrect).length;
    const totalQuestions = userAnswers.length;
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    const totalTime = startTime ? (Date.now() - startTime) / 1000 : 0;

    const results = {
      score: correctAnswers,
      totalTime: Math.round(totalTime),
      accuracy: Math.round(accuracy),
      completedQuestions: totalQuestions
    };

    setPackResults(results);
    setCurrentScreen('pack-results');

    // Call pack completion callback
    if (onPackComplete && currentPack) {
      onPackComplete(currentPack, correctAnswers, totalTime);
    }
  };

  const restartApp = () => {
    setCurrentScreen('pack-selection');
    setCurrentPack(null);
    setCurrentPuzzle(null);
    setCurrentPuzzleIndex(0);
    setUserAnswers([]);
    setFeedback({ show: false, type: 'success', message: '' });
    setPackResults(null);
    stopTimer();
  };

  // ============================================
  // PUZZLE INTERACTION
  // ============================================

  const handleAnswer = (selectedIndex: number, isCorrect: boolean) => {
    if (!currentPuzzle) return;

    const questionTime = startTime ? (Date.now() - startTime) / 1000 : 0;

    // Record answer
    setUserAnswers(prev => [...prev, {
      answer: selectedIndex,
      isCorrect,
      timeSpent: questionTime
    }]);

    // Set feedback
    setFeedback({
      show: true,
      type: isCorrect ? 'success' : 'error',
      message: isCorrect ? '정답입니다! 🎉' : '아쉽네요! 😅',
      ruleExplanation: currentPuzzle.ruleDescription,
    });

    // Call puzzle completion callback
    onPuzzleComplete?.(currentPuzzle, isCorrect);

    // Auto-advance after delay
    setTimeout(() => {
      nextPuzzle();
    }, 2500);
  };

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPackProgress = (): number => {
    if (!currentPack) return 0;
    return ((currentPuzzleIndex) / currentPack.totalQuestions) * 100;
  };

  const getPuzzleTypeIcon = (kind: string): string => {
    const icons = {
      'sequence': '🔢',
      'odd-one-out': '🔍',
      'analogy': '↔️',
      'grid': '⬜',
      'symmetry': '🪞',
      'equation': '➕'
    };
    return icons[kind] || '🧩';
  };

  // ============================================
  // RENDER METHODS
  // ============================================

  const renderHeader = () => (
    <header className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              🧠 도형 IQ 테스트 2.0
            </h1>
            <p className="text-gray-600 mt-1">
              AI 자동 생성 • 6가지 문제유형 • 무한 도전
            </p>
          </div>

          {currentPack && (
            <div className="text-right">
              <div className="text-sm text-gray-600">
                {currentPack.name}
              </div>
              <div className="font-semibold text-gray-800">
                {userAnswers.length + 1}/{currentPack.totalQuestions}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );

  const renderPackSelection = () => (
    <div className="py-12">
      <PuzzlePackSelector onPackSelect={handlePackSelect} />

      {/* System Stats */}
      <div className="mt-16 max-w-4xl mx-auto p-6">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            ⚙️ 시스템 통계
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-lg p-3 border">
              <div className="text-2xl font-bold text-blue-600">6</div>
              <div className="text-sm text-gray-600">문제 유형</div>
            </div>
            <div className="bg-white rounded-lg p-3 border">
              <div className="text-2xl font-bold text-green-600">∞</div>
              <div className="text-sm text-gray-600">생성 가능</div>
            </div>
            <div className="bg-white rounded-lg p-3 border">
              <div className="text-2xl font-bold text-purple-600">15+</div>
              <div className="text-sm text-gray-600">알고리즘</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPuzzle = () => {
    if (!currentPuzzle || !currentPack) return null;

    return (
      <div className="py-8">
        {/* Progress and Timer */}
        <div className="max-w-4xl mx-auto px-6 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  문제 {currentPuzzleIndex + 1} / {currentPack.totalQuestions}
                </span>
                <span className="text-sm text-gray-500">
                  {getPuzzleTypeIcon(currentPuzzle.kind)} {
                    currentPuzzle.kind === 'sequence' ? '수열' :
                    currentPuzzle.kind === 'odd-one-out' ? '다른하나' :
                    currentPuzzle.kind === 'analogy' ? '비례' :
                    currentPuzzle.kind === 'grid' ? '격자' :
                    currentPuzzle.kind === 'symmetry' ? '대칭' :
                    currentPuzzle.kind === 'equation' ? '수식' : '퍼즐'
                  }
                </span>
              </div>

              {timeRemaining !== null && (
                <div className="text-lg font-bold text-blue-600">
                  ⏱️ {formatTime(timeRemaining)}
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getPackProgress()}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Puzzle Content */}
        <div className="max-w-5xl mx-auto px-6 space-y-8">
          <ExtendedPuzzleRenderer puzzle={currentPuzzle} />
          <ExtendedAnswerOptions
            puzzle={currentPuzzle}
            onAnswer={handleAnswer}
            disabled={feedback.show}
          />
        </div>
      </div>
    );
  };

  const renderPackResults = () => {
    if (!packResults || !currentPack) return null;

    return (
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Results Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              🎊 테스트 완료!
            </h2>
            <p className="text-lg text-gray-600">
              {currentPack.name} 결과
            </p>
          </div>

          {/* Score Display */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-green-600">
                  {packResults.score}
                </div>
                <div className="text-sm text-gray-600">정답 수</div>
                <div className="text-xs text-gray-500">
                  / {currentPack.totalQuestions}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-4xl font-bold text-blue-600">
                  {packResults.accuracy}%
                </div>
                <div className="text-sm text-gray-600">정답률</div>
              </div>

              <div className="space-y-2">
                <div className="text-4xl font-bold text-purple-600">
                  {formatTime(packResults.totalTime)}
                </div>
                <div className="text-sm text-gray-600">소요 시간</div>
              </div>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4 text-center">상세 분석</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">평균 문제당 시간:</span>
                <span className="font-semibold">
                  {Math.round(packResults.totalTime / packResults.completedQuestions)}초
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">완료한 문제:</span>
                <span className="font-semibold">
                  {packResults.completedQuestions} / {currentPack.totalQuestions}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">추정 IQ 범위:</span>
                <span className="font-semibold">
                  {packResults.accuracy >= 90 ? '130+' :
                   packResults.accuracy >= 75 ? '115-130' :
                   packResults.accuracy >= 60 ? '100-115' :
                   packResults.accuracy >= 40 ? '85-100' : '85 미만'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={restartApp}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:scale-105 transition-transform duration-200"
            >
              다른 팩 도전하기
            </button>
            <button
              onClick={() => handlePackSelect(currentPack.name)}
              className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200"
            >
              같은 팩 재도전
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${className}`}>
      {renderHeader()}

      <main className="min-h-[calc(100vh-120px)]">
        {currentScreen === 'pack-selection' && renderPackSelection()}
        {currentScreen === 'puzzle' && renderPuzzle()}
        {currentScreen === 'pack-results' && renderPackResults()}
      </main>

      {/* Back button for puzzle screen */}
      {currentScreen === 'puzzle' && (
        <div className="fixed top-4 left-4">
          <button
            onClick={restartApp}
            className="px-4 py-2 bg-white bg-opacity-90 text-gray-700 rounded-xl text-sm hover:bg-opacity-100 transition-colors duration-200 shadow-lg"
          >
            ← 팩 선택으로
          </button>
        </div>
      )}
    </div>
  );
};

export default ExtendedShapePuzzleApp;