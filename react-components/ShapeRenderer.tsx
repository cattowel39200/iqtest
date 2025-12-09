// ============================================
// SVG Shape Renderer Component
// ============================================

import React from 'react';
import { Shape, ShapeRenderProps, AnimationState } from './types';

const ShapeRenderer: React.FC<ShapeRenderProps> = ({
  shape,
  size = 80,
  className = '',
  onClick,
  isSelected = false,
  isCorrect = false,
  isWrong = false,
}) => {
  // Calculate responsive sizing
  const getSizeMultiplier = () => {
    switch (shape.size) {
      case 'small': return 0.7;
      case 'large': return 1.3;
      default: return 1.0; // medium
    }
  };

  const actualSize = size * getSizeMultiplier();
  const strokeWidth = Math.max(2, actualSize * 0.03);

  // Color mapping
  const getShapeColor = () => {
    switch (shape.color) {
      case 'black': return '#1f2937';
      case 'gray': return '#6b7280';
      case 'white': return '#ffffff';
      default: return '#1f2937';
    }
  };

  const getStrokeColor = () => {
    return shape.color === 'white' ? '#1f2937' : getShapeColor();
  };

  // Fill pattern based on fill type
  const getFillColor = () => {
    const baseColor = getShapeColor();
    switch (shape.fill) {
      case 'empty': return 'transparent';
      case 'quarter': return `url(#quarter-fill-${shape.color})`;
      case 'half': return `url(#half-fill-${shape.color})`;
      case 'full': return baseColor;
      default: return 'transparent';
    }
  };

  // SVG Path generators for different shapes
  const generatePath = (): string => {
    const centerX = actualSize / 2;
    const centerY = actualSize / 2;
    const radius = (actualSize - strokeWidth * 2) / 2;

    switch (shape.type) {
      case 'circle':
        return `M ${centerX - radius} ${centerY}
                A ${radius} ${radius} 0 1 1 ${centerX + radius} ${centerY}
                A ${radius} ${radius} 0 1 1 ${centerX - radius} ${centerY}`;

      case 'triangle': {
        const height = radius * Math.sqrt(3);
        const top = centerY - height * 0.6;
        const bottom = centerY + height * 0.4;
        const left = centerX - radius;
        const right = centerX + radius;
        return `M ${centerX} ${top} L ${right} ${bottom} L ${left} ${bottom} Z`;
      }

      case 'square': {
        const halfSize = radius * 0.9;
        return `M ${centerX - halfSize} ${centerY - halfSize}
                L ${centerX + halfSize} ${centerY - halfSize}
                L ${centerX + halfSize} ${centerY + halfSize}
                L ${centerX - halfSize} ${centerY + halfSize} Z`;
      }

      case 'pentagon': {
        const points: string[] = [];
        for (let i = 0; i < 5; i++) {
          const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
          const x = centerX + radius * 0.9 * Math.cos(angle);
          const y = centerY + radius * 0.9 * Math.sin(angle);
          points.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
        }
        return points.join(' ') + ' Z';
      }

      case 'hexagon': {
        const points: string[] = [];
        for (let i = 0; i < 6; i++) {
          const angle = (i * 2 * Math.PI / 6) - Math.PI / 2;
          const x = centerX + radius * 0.9 * Math.cos(angle);
          const y = centerY + radius * 0.9 * Math.sin(angle);
          points.push(i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
        }
        return points.join(' ') + ' Z';
      }

      default:
        return '';
    }
  };

  // Generate dots for the shape
  const generateDots = () => {
    if (!shape.dots || shape.dots <= 0) return null;

    const dots: JSX.Element[] = [];
    const centerX = actualSize / 2;
    const centerY = actualSize / 2;
    const dotRadius = Math.max(2, actualSize * 0.04);
    const maxRadius = actualSize * 0.3;

    // Arrange dots in circular pattern
    for (let i = 0; i < shape.dots; i++) {
      let x, y;

      if (shape.dots === 1) {
        x = centerX;
        y = centerY;
      } else {
        const angle = (i * 2 * Math.PI / shape.dots);
        const radius = Math.min(maxRadius, shape.dots * 3);
        x = centerX + radius * Math.cos(angle);
        y = centerY + radius * Math.sin(angle);
      }

      dots.push(
        <circle
          key={i}
          cx={x}
          cy={y}
          r={dotRadius}
          fill="#1f2937"
          className="drop-shadow-sm"
        />
      );
    }

    return dots;
  };

  // CSS classes for interaction states
  const getContainerClasses = () => {
    const baseClasses = `inline-block transition-all duration-300 ${className}`;
    const interactionClasses = onClick ? 'cursor-pointer hover:scale-105' : '';
    const stateClasses = [
      isSelected ? 'ring-4 ring-blue-400 ring-opacity-60' : '',
      isCorrect ? 'ring-4 ring-green-400 ring-opacity-60 animate-pulse' : '',
      isWrong ? 'ring-4 ring-red-400 ring-opacity-60 animate-bounce' : '',
    ].join(' ');

    return `${baseClasses} ${interactionClasses} ${stateClasses}`.trim();
  };

  return (
    <div
      className={getContainerClasses()}
      onClick={onClick}
      style={{
        transform: `rotate(${shape.rotation || 0}deg)`,
        transformOrigin: 'center'
      }}
    >
      <svg
        width={actualSize}
        height={actualSize}
        viewBox={`0 0 ${actualSize} ${actualSize}`}
        className="drop-shadow-md"
      >
        {/* Define gradient patterns for partial fills */}
        <defs>
          <pattern
            id={`quarter-fill-${shape.color}`}
            patternUnits="userSpaceOnUse"
            width="4"
            height="4"
          >
            <rect width="1" height="4" fill={getShapeColor()} />
            <rect x="1" width="3" height="4" fill="transparent" />
          </pattern>

          <pattern
            id={`half-fill-${shape.color}`}
            patternUnits="userSpaceOnUse"
            width="2"
            height="2"
          >
            <rect width="1" height="2" fill={getShapeColor()} />
            <rect x="1" width="1" height="2" fill="transparent" />
          </pattern>
        </defs>

        {/* Main shape */}
        <path
          d={generatePath()}
          fill={getFillColor()}
          stroke={getStrokeColor()}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
          className="transition-all duration-200"
        />

        {/* Dots overlay */}
        {generateDots()}
      </svg>
    </div>
  );
};

export default ShapeRenderer;