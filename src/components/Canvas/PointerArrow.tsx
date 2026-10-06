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
  isPrevPointer?: boolean;
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
  isPrevPointer = false,
  label,
  onDisconnect,
}) => {
  // Self loop (node points to itself)
  if (isSelfLoop) {
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
        {/* Invisible wider hit area */}
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

  let pathD = '';
  let midX = (startX + endX) / 2;
  let midY = (startY + endY) / 2;

  const isPrev = isPrevPointer || label === 'prev';

  if (isPrev) {
    // Direct backward pointer arrow for Doubly Linked List (e.g. Node B -> Node A)
    if (Math.abs(dy) < 25) {
      // Horizontal straight arrow between adjacent nodes
      pathD = `M ${startX} ${startY} L ${endX} ${endY}`;
    } else {
      // Gentle S-curve if nodes are at different Y coordinates
      const curvature = Math.min(80, Math.max(30, Math.abs(dx) * 0.35));
      const dir = dx < 0 ? -1 : 1;
      pathD = `M ${startX} ${startY} C ${startX + dir * curvature} ${startY}, ${endX - dir * curvature} ${endY}, ${endX} ${endY}`;
    }
    midX = (startX + endX) / 2;
    midY = (startY + endY) / 2;
  } else if (isCycle || (dx < 10 && !isSelfLoop)) {
    // Loop back / cycle arching around other nodes
    const archOffset = Math.min(180, Math.max(90, Math.abs(dx) * 0.35));
    const controlY = Math.max(startY, endY) + archOffset;
    pathD = `M ${startX} ${startY} C ${startX + 60} ${controlY}, ${endX - 60} ${controlY}, ${endX} ${endY}`;
    midX = (startX + endX) / 2;
    midY = controlY - 20;
  } else {
    // Normal forward next pointer arrow (e.g. Node A -> Node B)
    const curvature = Math.min(120, Math.max(40, dx * 0.45));
    pathD = `M ${startX} ${startY} C ${startX + curvature} ${startY}, ${endX - curvature} ${endY}, ${endX} ${endY}`;
    midX = (startX + endX) / 2;
    midY = (startY + endY) / 2;
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
          <circle r="10" fill="#0f172a" stroke="#ef4444" strokeWidth="1.5" />
          <path d="M -3.5 -3.5 L 3.5 3.5 M -3.5 3.5 L 3.5 -3.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      )}

      {label && (
        <text
          x={midX}
          y={isPrev ? midY + 13 : midY - 7}
          fill={color}
          fontSize="10"
          fontFamily="JetBrains Mono"
          fontWeight="600"
          textAnchor="middle"
          className="select-none pointer-events-none drop-shadow-sm"
        >
          {label}
        </text>
      )}
    </g>
  );
};
