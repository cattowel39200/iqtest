// ============================================
// Difficulty Selector Component
// ============================================

import React from 'react';
import { DifficultyType } from './types';

interface DifficultyOption {
  type: DifficultyType;
  icon: string;
  title: string;
  description: string;
  timeEstimate: string;
  features: string[];
  color: {
    bg: string;
    border: string;
    hover: string;
    text: string;
  };
}

interface DifficultySelectorProps {
  onSelect: (difficulty: DifficultyType) => void;
  className?: string;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  onSelect,
  className = '',
}) => {
  const difficultyOptions: DifficultyOption[] = [
    {
      type: 'easy',
      icon: '🟢',
      title: '초급',
      description: '도형 개수/크기만 바뀌는 쉬운 문제',
      timeEstimate: '1-2분',
      features: ['점 개수 증가', '도형 순환', '채움 변화'],
      color: {
        bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
        border: 'border-green-300',
        hover: 'hover:border-green-400 hover:shadow-green-200',
        text: 'text-green-800',
      },
    },
    {
      type: 'medium',
      icon: '🟡',
      title: '중급',
      description: '두 가지 규칙(모양+점, 회전+색상)이 섞인 문제',
      timeEstimate: '2-3분',
      features: ['복합 속성', '모양+점수', '회전+색상'],
      color: {
        bg: 'bg-gradient-to-br from-yellow-50 to-orange-50',
        border: 'border-yellow-300',
        hover: 'hover:border-yellow-400 hover:shadow-yellow-200',
        text: 'text-yellow-800',
      },
    },
    {
      type: 'hard',
      icon: '🔴',
      title: '고급',
      description: '3×3 그리드, 합/차, 복합 규칙 문제',
      timeEstimate: '3-5분',
      features: ['3×3 그리드', '도형 연산', '복합 규칙'],
      color: {
        bg: 'bg-gradient-to-br from-red-50 to-pink-50',
        border: 'border-red-300',
        hover: 'hover:border-red-400 hover:shadow-red-200',
        text: 'text-red-800',
      },
    },
  ];

  const handleDifficultyClick = (difficulty: DifficultyType) => {
    onSelect(difficulty);
  };

  return (
    <div className={`max-w-6xl mx-auto p-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          난이도를 선택하세요
        </h2>
        <p className="text-lg text-gray-600">
          각 난이도별로 다른 알고리즘이 문제를 자동 생성합니다
        </p>
        <div className="mt-4 w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
      </div>

      {/* Difficulty Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {difficultyOptions.map((option) => (
          <div
            key={option.type}
            className={`
              ${option.color.bg} ${option.color.border} ${option.color.hover}
              border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300
              transform hover:scale-105 hover:-translate-y-2 hover:shadow-xl
              active:scale-100 active:translate-y-0
            `}
            onClick={() => handleDifficultyClick(option.type)}
          >
            {/* Icon and Title */}
            <div className="text-center mb-4">
              <div className="text-5xl mb-3 animate-bounce">
                {option.icon}
              </div>
              <h3 className={`text-2xl font-bold ${option.color.text} mb-2`}>
                {option.title}
              </h3>
              <div className="text-sm text-gray-600 font-medium">
                예상 시간: {option.timeEstimate}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-center mb-4 leading-relaxed">
              {option.description}
            </p>

            {/* Features */}
            <div className="space-y-2 mb-6">
              {option.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Start Button */}
            <button
              className={`
                w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300
                ${option.color.text} bg-white border-2 ${option.color.border}
                hover:bg-opacity-90 hover:scale-105 active:scale-95
                focus:outline-none focus:ring-4 focus:ring-opacity-30
              `}
              onClick={(e) => {
                e.stopPropagation();
                handleDifficultyClick(option.type);
              }}
            >
              시작하기 →
            </button>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 px-6 py-3 rounded-full border border-blue-200">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
          <span className="text-sm text-blue-700 font-medium">
            각 문제는 AI 알고리즘이 실시간으로 생성합니다
          </span>
        </div>
      </div>
    </div>
  );
};

export default DifficultySelector;