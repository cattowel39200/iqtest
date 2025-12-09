// ============================================
// Puzzle Pack Selector - Choose from Pre-made Packs
// ============================================

import React from 'react';
import { PuzzlePack, PuzzleKind } from './extended-types';

interface PuzzlePackInfo {
  name: string;
  description: string;
  difficulty: string;
  totalQuestions: number;
  timeLimit?: number;
  features: string[];
  kinds: PuzzleKind[];
  color: {
    bg: string;
    border: string;
    text: string;
  };
}

interface PuzzlePackSelectorProps {
  onPackSelect: (packName: string) => void;
  className?: string;
}

const PuzzlePackSelector: React.FC<PuzzlePackSelectorProps> = ({
  onPackSelect,
  className = '',
}) => {
  const puzzlePacks: PuzzlePackInfo[] = [
    {
      name: '초심자 팩',
      description: '도형 퍼즐을 처음 접하는 분들을 위한 기초 입문 팩',
      difficulty: '초급',
      totalQuestions: 10,
      timeLimit: 600, // 10분
      features: ['쉬운 수열', '색상/모양 구분', '기본 대칭'],
      kinds: ['sequence', 'odd-one-out', 'symmetry'],
      color: {
        bg: 'from-green-400 to-emerald-500',
        border: 'border-green-300',
        text: 'text-green-800',
      },
    },
    {
      name: '종합 도전 팩',
      description: '모든 유형과 난이도가 균형잡힌 표준 테스트 팩',
      difficulty: '혼합',
      totalQuestions: 15,
      timeLimit: 1200, // 20분
      features: ['6가지 문제유형', '난이도 점진상승', '실력 종합측정'],
      kinds: ['sequence', 'odd-one-out', 'analogy', 'grid', 'symmetry', 'equation'],
      color: {
        bg: 'from-blue-400 to-purple-500',
        border: 'border-blue-300',
        text: 'text-blue-800',
      },
    },
    {
      name: '고수 전용 팩',
      description: '고난도 추론과 복합 연산이 필요한 전문가용 팩',
      difficulty: '고급',
      totalQuestions: 12,
      timeLimit: 1800, // 30분
      features: ['복잡한 격자규칙', '수식 연산', '다단계 추론'],
      kinds: ['analogy', 'grid', 'equation'],
      color: {
        bg: 'from-red-400 to-pink-500',
        border: 'border-red-300',
        text: 'text-red-800',
      },
    },
    {
      name: '스피드 챌린지 팩',
      description: '빠른 판단력과 직감을 기르는 고속 문제 해결 팩',
      difficulty: '스피드',
      totalQuestions: 20,
      timeLimit: 300, // 5분
      features: ['직관적 문제', '15초당 1문제', '반응속도 중시'],
      kinds: ['odd-one-out', 'symmetry', 'sequence'],
      color: {
        bg: 'from-orange-400 to-yellow-500',
        border: 'border-orange-300',
        text: 'text-orange-800',
      },
    },
  ];

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}분`;
  };

  const getKindDisplayName = (kind: PuzzleKind): string => {
    const names = {
      'sequence': '수열',
      'odd-one-out': '다른하나',
      'analogy': '비례',
      'grid': '격자',
      'symmetry': '대칭',
      'equation': '수식',
    };
    return names[kind];
  };

  return (
    <div className={`max-w-7xl mx-auto p-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          🎯 문제팩을 선택하세요
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          각 팩은 다른 알고리즘과 난이도로 구성되어 다양한 사고능력을 측정합니다
        </p>
        <div className="mt-4 w-32 h-1 bg-gradient-to-r from-indigo-400 to-purple-500 mx-auto rounded-full"></div>
      </div>

      {/* Pack Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {puzzlePacks.map((pack) => (
          <div
            key={pack.name}
            className={`
              bg-white rounded-2xl border-2 ${pack.color.border} p-6
              cursor-pointer transition-all duration-300
              hover:scale-102 hover:-translate-y-2 hover:shadow-xl
              active:scale-100 active:translate-y-0
            `}
            onClick={() => onPackSelect(pack.name)}
          >
            {/* Pack Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className={`text-xl font-bold ${pack.color.text} mb-2`}>
                  {pack.name}
                </h3>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${pack.color.bg} text-white`}>
                  {pack.difficulty} 난이도
                </div>
              </div>
              <div className="text-right text-sm text-gray-600">
                <div className="font-semibold">{pack.totalQuestions}문항</div>
                <div>{pack.timeLimit ? formatTime(pack.timeLimit) : '무제한'}</div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-4 leading-relaxed">
              {pack.description}
            </p>

            {/* Features */}
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-600 mb-2">주요 특징:</div>
              <div className="flex flex-wrap gap-2">
                {pack.features.map((feature, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Problem Types */}
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-600 mb-2">포함 문제유형:</div>
              <div className="flex flex-wrap gap-2">
                {pack.kinds.map((kind, index) => (
                  <span
                    key={index}
                    className={`bg-gradient-to-r ${pack.color.bg} text-white px-2 py-1 rounded-md text-xs font-medium`}
                  >
                    {getKindDisplayName(kind)}
                  </span>
                ))}
              </div>
            </div>

            {/* Time per question */}
            <div className="bg-gray-50 rounded-xl p-3 mb-4">
              <div className="text-center">
                <div className="text-xs text-gray-500">문항당 평균 시간</div>
                <div className="text-lg font-bold text-gray-700">
                  {pack.timeLimit ? Math.round(pack.timeLimit / pack.totalQuestions) : '∞'}초
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              className={`
                w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300
                bg-gradient-to-r ${pack.color.bg} text-white
                hover:shadow-lg hover:scale-105 active:scale-95
                focus:outline-none focus:ring-4 focus:ring-opacity-30
              `}
              onClick={(e) => {
                e.stopPropagation();
                onPackSelect(pack.name);
              }}
            >
              이 팩으로 시작하기 →
            </button>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-2xl">🧠</span>
            <span className="text-lg font-semibold text-gray-800">
              AI 자동 생성 시스템
            </span>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            각 문제팩의 문제들은 고도화된 알고리즘이 실시간으로 생성하므로,
            동일한 팩을 여러번 풀어도 매번 새로운 문제를 만날 수 있습니다.
          </p>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-4 max-w-3xl mx-auto">
            {['수열', '다른하나', '비례', '격자', '대칭', '수식'].map((type, index) => (
              <div key={index} className="text-center p-2 bg-white rounded-lg border">
                <div className="text-xs text-gray-500">{type}</div>
                <div className="text-lg font-bold text-blue-600">∞</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PuzzlePackSelector;