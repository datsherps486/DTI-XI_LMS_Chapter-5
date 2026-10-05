import React from 'react';

interface PointerArrowProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color?: string;
  isCurvedLoop?: boolean;
  isSelfLoop?: boolean;
  isCycle?: boolean;
  isBidirectional?: boolean;
  label?: string;
  isHovered?: boolean;
  onDisconnect?: () => void;
}

export const PointerArrow: React.FC<PointerArrowProps> = ({
  startX,
  startY,
  endX,
  endY,
  color = '#38bdf8',
  isSelfLoop = false,
  isCycle = false,
  label,
  onDisconnect,
}) => {
  // Self loop (points to itself)
  if (isSelfLoop) {
    const r = 36;
    const pathD = `M ${startX} ${startY - 15} C ${startX + 50} ${startY - 70}, ${startX - 50} ${startY - 70}, ${startX - 15} ${startY - 15}`;
    return (
      <g className="group cursor-pointer">
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          markerEnd={`url(#arrowhead-${color.replace('#', '')})`}
          className="transition-all duration-150"
        />
        {/* Invisible wider stroke for easy click/hover */}
        <path
          d={pathD}
          fill="none"
          stroke="transparent"
          strokeWidth="16"
          onClick={onDisconnect}
        />
        {label && (
          <text
            x={startX}
            y={startY - 65}
            fill={color}
            fontSize="10"
            fontFamily="JetBrains Mono"
            textAnchor="middle"
          >
            {label}
          </text>
        )}
      </g>
    );
  }

  const dx = endX - startX;
  const dy = endY - startY;
  const isBackwards = dx < 10; // Target is behind or vertically aligned

  let pathD = '';
  let midX = (startX + endX) / 2;
  let midY = (startY + endY) / 2;

  if (isBackwards || isCycle) {
    // Elegant bottom arch or top loop to route around other nodes cleanly
    const archOffset = Math.min(180, Math.max(90, Math.abs(dx) * 0.35));
    const controlY = Math.max(startY, endY) + archOffset;
    pathD = `M ${startX} ${startY} C ${startX + 60} ${controlY}, ${endX - 60} ${controlY}, ${endX} ${endY}`;
    midX = (startX + endX) / 2;
    midY = controlY - 20;
  } else {
    // Smooth horizontal cubic bezier curve
    const curvature = Math.min(120, Math.max(40, dx * 0.45));
    pathD = `M ${startX} ${startY} C ${startX + curvature} ${startY}, ${endX - curvature} ${endY}, ${endX} ${endY}`;
  }

  const markerId = `arrowhead-${color.replace('#', '')}`;

  return (
    <g className="group">
      {/* Glow shadow when cycle or highlighted */}
      {isCycle && (
        <path
          d={pathD}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="6"
          strokeOpacity="0.25"
        />
      )}

      {/* Main visible arrow line */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeDasharray={isCycle ? '6,4' : undefined}
        markerEnd={`url(#${markerId})`}
        className="transition-colors duration-150"
      />

      {/* Invisible wider hit area for disconnection */}
      <path
        d={pathD}
        fill="none"
        stroke="transparent"
        strokeWidth="18"
        className="cursor-pointer"
        onClick={onDisconnect}
      />

      {/* Optional disconnect indicator on hover */}
      {onDisconnect && (
        <g
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer"
          onClick={onDisconnect}
          transform={`translate(${midX}, ${midY})`}
        >
          <circle r="11" fill="#0f172a" stroke="#ef4444" strokeWidth="1.5" />
          <path d="M -4 -4 L 4 4 M -4 4 L 4 -4" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      )}

      {label && (
        <text
          x={midX}
          y={midY - 8}
          fill={color}
          fontSize="10"
          fontFamily="JetBrains Mono"
          textAnchor="middle"
          className="select-none"
        >
          {label}
        </text>
      )}
    </g>
  );
};
