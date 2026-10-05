import React, { useState, useRef } from 'react';
import { LLNode, ListMode, PointerMarker } from '../../types/linkedList';
import { Trash2, Flag, Edit3, Link2 } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface NodeCardProps {
  node: LLNode;
  mode: ListMode;
  isHead: boolean;
  isTail: boolean;
  pointers: PointerMarker[];
  isCycleNode: boolean;
  isDetached: boolean;
  onDragStart: (e: React.PointerEvent, nodeId: string) => void;
  onStartConnect: (e: React.PointerEvent, nodeId: string, port: 'next' | 'prev') => void;
  onUpdateValue: (nodeId: string, newVal: string | number) => void;
  onSetHead: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onHoverPort?: (nodeId: string | null) => void;
  isSelected?: boolean;
}

export const NodeCard: React.FC<NodeCardProps> = ({
  node,
  mode,
  isHead,
  isTail,
  pointers,
  isCycleNode,
  isDetached,
  onDragStart,
  onStartConnect,
  onUpdateValue,
  onSetHead,
  onDeleteNode,
  onHoverPort,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(node.val));
  const inputRef = useRef<HTMLInputElement>(null);

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleFinishEdit = () => {
    setIsEditing(false);
    const trimmed = editValue.trim();
    if (trimmed !== '') {
      const num = Number(trimmed);
      onUpdateValue(node.id, isNaN(num) ? trimmed : num);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFinishEdit();
    } else if (e.key === 'Escape') {
      setEditValue(String(node.val));
      setIsEditing(false);
    }
  };

  // State-specific border & background styles
  let cardBorderColor = 'border-slate-700/80';
  let cardBg = 'bg-slate-900/95';
  let glowEffect = '';

  if (node.state === 'active') {
    cardBorderColor = 'border-indigo-400 ring-2 ring-indigo-500/30';
    cardBg = 'bg-slate-850';
  } else if (node.state === 'visiting') {
    cardBorderColor = 'border-amber-400 ring-2 ring-amber-500/30';
    cardBg = 'bg-amber-950/20';
  } else if (node.state === 'target') {
    cardBorderColor = 'border-emerald-400 ring-2 ring-emerald-500/30';
    cardBg = 'bg-emerald-950/20';
  } else if (node.state === 'cycle' || isCycleNode) {
    cardBorderColor = 'border-violet-400 ring-2 ring-violet-500/20';
    cardBg = 'bg-violet-950/20';
    glowEffect = 'shadow-[0_0_15px_rgba(167,139,250,0.15)]';
  } else if (node.state === 'new') {
    cardBorderColor = 'border-sky-400 ring-2 ring-sky-500/30';
    cardBg = 'bg-sky-950/20';
  } else if (node.state === 'deleted') {
    cardBorderColor = 'border-rose-500/60 opacity-60';
    cardBg = 'bg-rose-950/20';
  } else if (isDetached) {
    cardBorderColor = 'border-dashed border-slate-600/70 opacity-80';
  }

  return (
    <div
      style={{
        transform: `translate(${node.x}px, ${node.y}px)`,
      }}
      className={`absolute left-0 top-0 select-none-all group cursor-grab active:cursor-grabbing transition-shadow duration-150 ${glowEffect}`}
      onPointerDown={(e) => onDragStart(e, node.id)}
      onPointerEnter={() => onHoverPort?.(node.id)}
      onPointerLeave={() => onHoverPort?.(null)}
    >
      {/* Floating Pointer Badges above Node */}
      <div className="absolute -top-7 left-0 right-0 flex flex-wrap items-center justify-center gap-1.5 pointer-events-none z-10">
        {isHead && (
          <span className="px-2 py-0.5 text-[11px] font-semibold tracking-wide bg-indigo-500 text-white rounded shadow-sm flex items-center gap-1">
            <Flag className="w-2.5 h-2.5" /> HEAD
          </span>
        )}
        {isTail && !isHead && (
          <span className="px-2 py-0.5 text-[11px] font-semibold tracking-wide bg-emerald-600 text-white rounded shadow-sm">
            TAIL
          </span>
        )}
        {pointers.map((p) => (
          <span
            key={p.name}
            className={`px-1.5 py-0.5 text-[10px] font-mono font-medium rounded shadow-sm ${p.bgColor} ${p.color}`}
          >
            {p.name}
          </span>
        ))}
      </div>

      {/* Main Node Card Shell */}
      <div
        className={`w-40 rounded-xl border backdrop-blur-md shadow-lg transition-colors ${cardBorderColor} ${cardBg} overflow-hidden`}
      >
        {/* Header / Memory Address Bar */}
        <div className="px-2.5 py-1.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px] text-slate-400 tracking-tight" title="Simulated Heap Memory Address">
            {node.address}
          </span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!isHead && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundManager.playClick();
                  onSetHead(node.id);
                }}
                title="Set as HEAD pointer"
                className="p-1 hover:text-indigo-400 text-slate-400 transition-colors"
              >
                <Flag className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                soundManager.playDisconnect();
                onDeleteNode(node.id);
              }}
              title="Delete node"
              className="p-1 hover:text-rose-400 text-slate-400 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Node Internal Anatomy: Data & Pointer Port(s) */}
        <div className="p-2.5 flex items-center justify-between gap-2">
          {/* Optional Prev Port for Doubly Linked List */}
          {mode === 'doubly' && (
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-mono text-slate-400 mb-1">prev</span>
              <div
                onPointerDown={(e) => {
                  e.stopPropagation();
                  soundManager.playClick();
                  onStartConnect(e, node.id, 'prev');
                }}
                className="w-5 h-7 rounded border border-slate-700 bg-slate-800/80 hover:bg-indigo-500 hover:border-indigo-400 cursor-crosshair flex items-center justify-center transition-colors group/port"
                title="Drag to connect PREV pointer"
              >
                <div className="w-2 h-2 rounded-full bg-slate-400 group-hover/port:bg-white" />
              </div>
            </div>
          )}

          {/* Node Value Data Box */}
          <div
            onClick={handleStartEdit}
            className="flex-1 bg-slate-950/70 border border-slate-800/90 rounded-lg p-2 text-center hover:border-slate-700 cursor-text transition-colors group/val"
            title="Click to edit value"
          >
            <div className="text-[9px] font-mono uppercase tracking-wider text-slate-400 mb-0.5 flex items-center justify-center gap-1">
              <span>data</span>
              <Edit3 className="w-2.5 h-2.5 opacity-0 group-hover/val:opacity-80" />
            </div>
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleFinishEdit}
                onKeyDown={handleKeyDown}
                className="w-full text-center text-sm font-semibold bg-transparent border-b border-indigo-400 text-white focus:outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="text-base font-semibold text-slate-100 font-mono tabular-nums">
                {String(node.val)}
              </span>
            )}
          </div>

          {/* Next Pointer Port Handle */}
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-mono text-slate-400 mb-1">next</span>
            <div
              onPointerDown={(e) => {
                e.stopPropagation();
                soundManager.playClick();
                onStartConnect(e, node.id, 'next');
              }}
              className="w-6 h-7 rounded border border-sky-500/40 bg-sky-950/40 hover:bg-sky-500 hover:border-sky-300 cursor-crosshair flex items-center justify-center transition-all group/nextport shadow-sm"
              title="Drag from this handle to connect to another node or NULL"
            >
              <Link2 className="w-3.5 h-3.5 text-sky-400 group-hover/nextport:text-white transition-colors" />
            </div>
          </div>
        </div>

        {/* Detached Notice if disconnected */}
        {isDetached && !isHead && (
          <div className="px-2 py-1 bg-amber-500/10 border-t border-amber-500/20 text-[10px] text-amber-300/80 text-center">
            Orphan (not linked from HEAD)
          </div>
        )}
      </div>
    </div>
  );
};
