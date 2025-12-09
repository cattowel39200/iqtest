// ============================================
// Extended Usage Examples - New Problem Types & Features
// ============================================

import React from 'react';
import {
  ExtendedShapePuzzleApp,
  ExtendedPuzzleRenderer,
  ExtendedAnswerOptions,
  PuzzlePackSelector,
  ExtendedPuzzle,
  generatePuzzle,
  createMixedChallengePack,
  getGeneratorStats
} from './extended-index';

// ============================================
// Example 1: Complete Extended App
// ============================================

export const CompleteExtendedAppExample = () => {
  const handlePuzzleComplete = (puzzle: ExtendedPuzzle, isCorrect: boolean) => {
    console.log('Puzzle completed:', {
      kind: puzzle.kind,
      difficulty: puzzle.difficulty,
      isCorrect,
      rule: puzzle.ruleDescription
    });
  };

  const handlePackComplete = (pack: any, score: number, totalTime: number) => {
    console.log('Pack completed:', {
      packName: pack.name,
      score,
      totalTime: Math.round(totalTime),
      accuracy: Math.round((score / pack.totalQuestions) * 100)
    });
  };

  return (
    <div className="min-h-screen">
      <ExtendedShapePuzzleApp
        onPuzzleComplete={handlePuzzleComplete}
        onPackComplete={handlePackComplete}
      />
    </div>
  );
};

// ============================================
// Example 2: Individual Problem Type Demos
// ============================================

export const ProblemTypeShowcase = () => {
  const [currentPuzzle, setCurrentPuzzle] = React.useState<ExtendedPuzzle | null>(null);

  const generatePuzzleByType = (kind: any) => {
    try {
      const puzzle = generatePuzzle(undefined, kind);
      setCurrentPuzzle(puzzle);
    } catch (error) {
      console.error('Failed to generate puzzle:', error);
      // Fallback
      const fallbackPuzzle = generatePuzzle('medium');
      setCurrentPuzzle(fallbackPuzzle);
    }
  };

  const handleAnswer = (selectedIndex: number, isCorrect: boolean) => {
    console.log(`Answer: ${selectedIndex}, Correct: ${isCorrect}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          🧩 새로운 문제 유형 쇼케이스
        </h1>

        {/* Problem Type Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => generatePuzzleByType('sequence')}
            className="p-4 bg-blue-100 hover:bg-blue-200 rounded-xl text-center transition-colors"
          >
            <div className="text-2xl mb-2">🔢</div>
            <div className="font-semibold">수열 문제</div>
          </button>

          <button
            onClick={() => generatePuzzleByType('odd-one-out')}
            className="p-4 bg-orange-100 hover:bg-orange-200 rounded-xl text-center transition-colors"
          >
            <div className="text-2xl mb-2">🔍</div>
            <div className="font-semibold">다른하나 찾기</div>
          </button>

          <button
            onClick={() => generatePuzzleByType('analogy')}
            className="p-4 bg-purple-100 hover:bg-purple-200 rounded-xl text-center transition-colors"
          >
            <div className="text-2xl mb-2">↔️</div>
            <div className="font-semibold">비례 문제</div>
          </button>

          <button
            onClick={() => generatePuzzleByType('grid')}
            className="p-4 bg-green-100 hover:bg-green-200 rounded-xl text-center transition-colors"
          >
            <div className="text-2xl mb-2">⬜</div>
            <div className="font-semibold">격자 패턴</div>
          </button>

          <button
            onClick={() => generatePuzzleByType('symmetry')}
            className="p-4 bg-indigo-100 hover:bg-indigo-200 rounded-xl text-center transition-colors"
          >
            <div className="text-2xl mb-2">🪞</div>
            <div className="font-semibold">대칭 문제</div>
          </button>

          <button
            onClick={() => generatePuzzleByType('equation')}
            className="p-4 bg-yellow-100 hover:bg-yellow-200 rounded-xl text-center transition-colors"
          >
            <div className="text-2xl mb-2">➕</div>
            <div className="font-semibold">수식 문제</div>
          </button>
        </div>

        {/* Current Puzzle Display */}
        {currentPuzzle && (
          <div className="space-y-8">
            <ExtendedPuzzleRenderer puzzle={currentPuzzle} />
            <ExtendedAnswerOptions
              puzzle={currentPuzzle}
              onAnswer={handleAnswer}
            />
          </div>
        )}

        {!currentPuzzle && (
          <div className="text-center py-12 bg-white rounded-2xl">
            <div className="text-gray-500">
              위의 문제 유형 버튼을 클릭하여 문제를 생성해보세요
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// Example 3: Pack Selector Demo
// ============================================

export const PackSelectorExample = () => {
  const [selectedPack, setSelectedPack] = React.useState<string | null>(null);

  const handlePackSelect = (packName: string) => {
    setSelectedPack(packName);
    console.log('Selected pack:', packName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="p-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          📦 문제팩 선택기 데모
        </h1>

        <PuzzlePackSelector onPackSelect={handlePackSelect} />

        {selectedPack && (
          <div className="mt-8 text-center">
            <div className="bg-white rounded-xl p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-2">선택된 팩</h3>
              <p className="text-blue-600 font-bold">{selectedPack}</p>
              <p className="text-sm text-gray-600 mt-2">
                실제 앱에서는 이제 해당 팩으로 테스트가 시작됩니다
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// Example 4: Generator Statistics
// ============================================

export const GeneratorStatsExample = () => {
  const [stats, setStats] = React.useState<any>(null);

  React.useEffect(() => {
    try {
      const generatorStats = getGeneratorStats();
      setStats(generatorStats);
    } catch (error) {
      console.error('Failed to get generator stats:', error);
    }
  }, []);

  if (!stats) {
    return (
      <div className="p-8">
        <div className="text-center">통계 로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-r from-gray-50 to-blue-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          📊 알고리즘 생성기 통계
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {stats.totalGenerators}
            </div>
            <div className="text-gray-600">총 생성기 수</div>
          </div>

          <div className="bg-white rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-600">
              {Object.keys(stats.byKind).length}
            </div>
            <div className="text-gray-600">문제 유형</div>
          </div>

          <div className="bg-white rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">∞</div>
            <div className="text-gray-600">생성 가능 문제</div>
          </div>
        </div>

        {/* Difficulty breakdown */}
        <div className="bg-white rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">난이도별 생성기 수</h3>
          <div className="space-y-3">
            {Object.entries(stats.byDifficulty).map(([difficulty, count]: [string, any]) => (
              <div key={difficulty} className="flex justify-between items-center">
                <span className="capitalize font-medium">
                  {difficulty === 'easy' ? '초급' :
                   difficulty === 'medium' ? '중급' : '고급'}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(count / stats.totalGenerators) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-blue-600">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kind breakdown */}
        <div className="bg-white rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">문제 유형별 생성기 수</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(stats.byKind).map(([kind, count]: [string, any]) => (
              <div key={kind} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-700">{count}</div>
                <div className="text-sm text-gray-600 capitalize">
                  {kind === 'sequence' ? '수열' :
                   kind === 'odd-one-out' ? '다른하나' :
                   kind === 'analogy' ? '비례' :
                   kind === 'grid' ? '격자' :
                   kind === 'symmetry' ? '대칭' :
                   kind === 'equation' ? '수식' : kind}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Example 5: Custom Puzzle Pack Creation
// ============================================

export const CustomPackExample = () => {
  const [generatedPack, setGeneratedPack] = React.useState<any>(null);

  const createCustomPack = () => {
    const pack = createMixedChallengePack();
    setGeneratedPack(pack);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          🎨 커스텀 문제팩 생성
        </h1>

        <div className="text-center mb-8">
          <button
            onClick={createCustomPack}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform"
          >
            종합 도전 팩 생성하기
          </button>
        </div>

        {generatedPack && (
          <div className="bg-white rounded-xl p-6 space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold">{generatedPack.name}</h3>
              <p className="text-gray-600">{generatedPack.description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-lg font-bold text-blue-600">
                  {generatedPack.totalQuestions}
                </div>
                <div className="text-sm text-gray-600">문항 수</div>
              </div>

              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-lg font-bold text-green-600">
                  {Math.round(generatedPack.timeLimit / 60)}분
                </div>
                <div className="text-sm text-gray-600">제한 시간</div>
              </div>

              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-lg font-bold text-purple-600">
                  {generatedPack.config.enabledKinds.length}
                </div>
                <div className="text-sm text-gray-600">문제 유형</div>
              </div>

              <div className="bg-orange-50 rounded-lg p-3">
                <div className="text-lg font-bold text-orange-600">
                  {Math.round(generatedPack.timeLimit / generatedPack.totalQuestions)}초
                </div>
                <div className="text-sm text-gray-600">문항당 시간</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">생성된 문제들:</h4>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {generatedPack.puzzles.map((puzzle: ExtendedPuzzle, index: number) => (
                  <div key={index} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                    <span>문제 {index + 1}</span>
                    <span className="font-medium">
                      {puzzle.kind === 'sequence' ? '🔢 수열' :
                       puzzle.kind === 'odd-one-out' ? '🔍 다른하나' :
                       puzzle.kind === 'analogy' ? '↔️ 비례' :
                       puzzle.kind === 'grid' ? '⬜ 격자' :
                       puzzle.kind === 'symmetry' ? '🪞 대칭' :
                       puzzle.kind === 'equation' ? '➕ 수식' : puzzle.kind}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      puzzle.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      puzzle.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {puzzle.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// Main Demo App
// ============================================

export const ExtendedDemoApp = () => {
  const [currentDemo, setCurrentDemo] = React.useState<string>('complete');

  const demos = [
    { id: 'complete', name: '완전한 앱', component: CompleteExtendedAppExample },
    { id: 'showcase', name: '문제 유형 쇼케이스', component: ProblemTypeShowcase },
    { id: 'packs', name: '문제팩 선택기', component: PackSelectorExample },
    { id: 'stats', name: '생성기 통계', component: GeneratorStatsExample },
    { id: 'custom', name: '커스텀 팩 생성', component: CustomPackExample },
  ];

  const CurrentComponent = demos.find(d => d.id === currentDemo)?.component || CompleteExtendedAppExample;

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-lg p-4">
        <div className="max-w-6xl mx-auto flex gap-4 overflow-x-auto">
          {demos.map((demo) => (
            <button
              key={demo.id}
              onClick={() => setCurrentDemo(demo.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                currentDemo === demo.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {demo.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Current Demo */}
      <CurrentComponent />
    </div>
  );
};