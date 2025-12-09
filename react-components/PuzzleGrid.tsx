// ============================================
// Puzzle Grid Component - For Hard Difficulty 3x3 Grids
// ============================================

import React from 'react';
import { Shape, GridCell } from './types';
import ShapeRenderer from './ShapeRenderer';

interface PuzzleGridProps {
  grid: Shape[][];
  missingCell?: GridCell;
  className?: string;
  shapeSize?: number;
}

const PuzzleGrid: React.FC<PuzzleGridProps> = ({
  grid,
  missingCell,
  className = '',
  shapeSize = 60,
}) => {
  const isMissingCell = (row: number, col: number): boolean => {
    return missingCell?.row === row && missingCell?.col === col;
  };

  const MissingCellPlaceholder = () => (
    <div
      className="flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-400 rounded-lg transition-all duration-300 hover:bg-gray-200"
      style={{ width: shapeSize, height: shapeSize }}
    >
      <span className="text-3xl text-gray-500 font-bold animate-pulse">?</span>
    </div>
  );

  return (
    <div className={`inline-block p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-200 ${className}`}>
      <div className="grid grid-cols-3 gap-3">
        {grid.map((row, rowIndex) =>
          row.map((shape, colIndex) => (
            <div
              key={`cell-${rowIndex}-${colIndex}`}
              className={`
                flex items-center justify-center p-2 rounded-lg transition-all duration-300
                ${isMissingCell(rowIndex, colIndex)
                  ? 'bg-white border-2 border-dashed border-blue-300 shadow-inner'
                  : 'bg-white border border-gray-200 shadow-sm hover:shadow-md'
                }
              `}
            >
              {isMissingCell(rowIndex, colIndex) ? (
                <MissingCellPlaceholder />
              ) : (
                <ShapeRenderer
                  shape={shape}
                  size={shapeSize}
                  className="transition-transform duration-200 hover:scale-110"
                />
              )}
            </div>
          ))
        )}
      </div>

      {/* Grid explanation */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 font-medium">
          그리드의 규칙을 찾아 빈칸을 채우세요
        </p>
      </div>
    </div>
  );
};

export default PuzzleGrid;