// ============================================
// High-Performance Canvas Shape Renderer Component
// ============================================

import React, { useRef, useEffect } from 'react';
import { Shape, ShapeRenderProps } from './types';

const CanvasShapeRenderer: React.FC<ShapeRenderProps> = ({
  shape,
  size = 80,
  className = '',
  onClick,
  isSelected = false,
  isCorrect = false,
  isWrong = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculate responsive sizing
  const getSizeMultiplier = () => {
    switch (shape.size) {
      case 'small': return 0.7;
      case 'large': return 1.3;
      default: return 1.0;
    }
  };

  const actualSize = size * getSizeMultiplier();
  const devicePixelRatio = window.devicePixelRatio || 1;

  // Color utilities
  const getShapeColor = (): string => {
    switch (shape.color) {
      case 'black': return '#1f2937';
      case 'gray': return '#6b7280';
      case 'white': return '#ffffff';
      default: return '#1f2937';
    }
  };

  const getStrokeColor = (): string => {
    return shape.color === 'white' ? '#1f2937' : getShapeColor();
  };

  // Canvas drawing functions
  const drawShape = (ctx: CanvasRenderingContext2D) => {
    const centerX = actualSize / 2;
    const centerY = actualSize / 2;
    const radius = (actualSize - 6) / 2; // Account for stroke width
    const strokeWidth = Math.max(2, actualSize * 0.03);

    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = getStrokeColor();

    // Apply rotation if needed
    if (shape.rotation) {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((shape.rotation * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);
    }

    ctx.beginPath();

    switch (shape.type) {
      case 'circle':
        ctx.arc(centerX, centerY, radius - strokeWidth, 0, 2 * Math.PI);
        break;

      case 'triangle': {
        const height = radius * Math.sqrt(3);
        const top = centerY - height * 0.6;
        const bottom = centerY + height * 0.4;
        const left = centerX - radius * 0.9;
        const right = centerX + radius * 0.9;

        ctx.moveTo(centerX, top);
        ctx.lineTo(right, bottom);
        ctx.lineTo(left, bottom);
        ctx.closePath();
        break;
      }

      case 'square': {
        const halfSize = radius * 0.8;
        const left = centerX - halfSize;
        const top = centerY - halfSize;
        const rectSize = halfSize * 2;

        ctx.rect(left, top, rectSize, rectSize);
        break;
      }

      case 'pentagon': {
        for (let i = 0; i < 5; i++) {
          const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
          const x = centerX + radius * 0.8 * Math.cos(angle);
          const y = centerY + radius * 0.8 * Math.sin(angle);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        break;
      }

      case 'hexagon': {
        for (let i = 0; i < 6; i++) {
          const angle = (i * 2 * Math.PI / 6) - Math.PI / 2;
          const x = centerX + radius * 0.8 * Math.cos(angle);
          const y = centerY + radius * 0.8 * Math.sin(angle);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        break;
      }
    }

    // Apply fill based on fill type
    applyFill(ctx);

    // Stroke the shape
    ctx.stroke();

    // Restore context if rotated
    if (shape.rotation) {
      ctx.restore();
    }
  };

  const applyFill = (ctx: CanvasRenderingContext2D) => {
    const color = getShapeColor();

    switch (shape.fill) {
      case 'empty':
        // No fill
        break;

      case 'full':
        ctx.fillStyle = color;
        ctx.fill();
        break;

      case 'quarter':
        // Create quarter fill pattern
        ctx.fillStyle = createQuarterFillPattern(ctx, color);
        ctx.fill();
        break;

      case 'half':
        // Create half fill pattern
        ctx.fillStyle = createHalfFillPattern(ctx, color);
        ctx.fill();
        break;
    }
  };

  const createQuarterFillPattern = (ctx: CanvasRenderingContext2D, color: string) => {
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 8;
    patternCanvas.height = 8;
    const patternCtx = patternCanvas.getContext('2d')!;

    patternCtx.fillStyle = color;
    patternCtx.fillRect(0, 0, 2, 8);

    return ctx.createPattern(patternCanvas, 'repeat')!;
  };

  const createHalfFillPattern = (ctx: CanvasRenderingContext2D, color: string) => {
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 4;
    patternCanvas.height = 4;
    const patternCtx = patternCanvas.getContext('2d')!;

    patternCtx.fillStyle = color;
    patternCtx.fillRect(0, 0, 2, 4);

    return ctx.createPattern(patternCanvas, 'repeat')!;
  };

  const drawDots = (ctx: CanvasRenderingContext2D) => {
    if (!shape.dots || shape.dots <= 0) return;

    const centerX = actualSize / 2;
    const centerY = actualSize / 2;
    const dotRadius = Math.max(3, actualSize * 0.05);
    const maxRadius = actualSize * 0.25;

    ctx.fillStyle = '#1f2937';

    for (let i = 0; i < shape.dots; i++) {
      let x, y;

      if (shape.dots === 1) {
        x = centerX;
        y = centerY;
      } else {
        const angle = (i * 2 * Math.PI / shape.dots);
        const radius = Math.min(maxRadius, shape.dots * 4);
        x = centerX + radius * Math.cos(angle);
        y = centerY + radius * Math.sin(angle);
      }

      ctx.beginPath();
      ctx.arc(x, y, dotRadius, 0, 2 * Math.PI);
      ctx.fill();

      // Add subtle shadow for dots
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetY = 1;
      ctx.fill();
      ctx.shadowColor = 'transparent';
    }
  };

  // Main drawing function
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, actualSize * devicePixelRatio, actualSize * devicePixelRatio);

    // Scale for high DPI displays
    ctx.scale(devicePixelRatio, devicePixelRatio);

    // Enable anti-aliasing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw shape and dots
    drawShape(ctx);
    drawDots(ctx);
  };

  // Redraw when shape changes
  useEffect(() => {
    draw();
  }, [shape, actualSize]);

  // CSS classes for interaction states
  const getContainerClasses = () => {
    const baseClasses = `inline-block transition-all duration-300 ${className}`;
    const interactionClasses = onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : '';
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
      <canvas
        ref={canvasRef}
        width={actualSize * devicePixelRatio}
        height={actualSize * devicePixelRatio}
        style={{
          width: actualSize,
          height: actualSize,
          filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
        }}
        className="rounded-lg"
      />
    </div>
  );
};

export default CanvasShapeRenderer;