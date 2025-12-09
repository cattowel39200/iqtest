// ============================================
// Puzzle Sequence Component - For Easy/Medium Difficulty Sequences
// ============================================

import React from 'react';
import { Shape } from './types';
import ShapeRenderer from './ShapeRenderer';

interface PuzzleSequenceProps {
  sequence: Shape[];
  className?: string;
  shapeSize?: number;
  showArrows?: boolean;
}

const PuzzleSequence: React.FC<PuzzleSequenceProps> = ({
  sequence,
  className = '',
  shapeSize = 70,
  showArrows = true,
}) => {
  const ArrowIcon = () => (
    <div className="flex items-center justify-center text-3xl text-blue-500 font-bold animate-pulse">
      →
    </div>
  );

  const MissingPlaceholder = () => (
    <div
      className="flex items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-dashed border-yellow-400 rounded-xl transition-all duration-300 hover:shadow-lg"
      style={{ width: shapeSize + 20, height: shapeSize + 20 }}
    >
      <span className="text-4xl text-yellow-600 font-bold animate-bounce">?</span>
    </div>
  );

  return (
    <div className={`p-6 ${className}`}>
      {/* Sequence Title */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          다음 패턴을 보고 빈칸에 들어갈 도형을 찾으세요
        </h3>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
      </div>

      {/* Sequence Display */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {sequence.map((shape, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center gap-2">
              <ShapeRenderer
                shape={shape}
                size={shapeSize}
                className="transition-all duration-300 hover:scale-110 hover:rotate-3"
              />
              <div className="text-xs text-gray-500 font-medium">
                {index + 1}
              </div>
            </div>

            {/* Arrow between shapes */}
            {showArrows && index < sequence.length - 1 && <ArrowIcon />}
          </React.Fragment>
        ))}

        {/* Arrow to missing shape */}
        {showArrows && <ArrowIcon />}

        {/* Missing shape placeholder */}
        <div className="flex flex-col items-center gap-2">
          <MissingPlaceholder />
          <div className="text-xs text-yellow-600 font-medium">
            {sequence.length + 1}
          </div>
        </div>
      </div>

      {/* Pattern hint */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
          <span className="text-sm text-blue-700 font-medium">
            패턴을 찾아보세요
          </span>
        </div>
      </div>
    </div>
  );
};

export default PuzzleSequence;