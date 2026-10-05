import React from 'react';

interface NullTerminalProps {
  x: number;
  y: number;
  onHoverTerminal?: (isHovered: boolean) => void;
  isDropTarget?: boolean;
}

export const NullTerminal: React.FC<NullTerminalProps> = ({
  x,
  y,
  onHoverTerminal,
  isDropTarget,
}) => {
  return (
    <div
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      className="absolute left-0 top-0 select-none-all pointer-events-auto"
      onPointerEnter={() => onHoverTerminal?.(true)}
      onPointerLeave={() => onHoverTerminal?.(false)}
    >
      <div
        className={`px-3 py-2 rounded-lg border flex items-center gap-1.5 transition-all ${
          isDropTarget
            ? 'border-sky-400 bg-sky-950/70 scale-105 shadow-md shadow-sky-500/20 ring-2 ring-sky-400/40'
            : 'border-slate-800 bg-slate-950/70 text-slate-400 hover:border-slate-700'
        }`}
        title="NULL Terminal (End of Linked List)"
      >
        <span className="font-mono text-xs font-semibold tracking-wider text-slate-300">
          NULL
        </span>
        <svg
          className="w-3.5 h-3.5 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
      </div>
    </div>
  );
};
