import React, { useState } from 'react';
import { ListMode, OperationType } from '../../types/linkedList';
import { PRESETS } from '../../data/presets';
import { soundManager } from '../../utils/audio';
import {
  Plus,
  Trash2,
  Search,
  RefreshCw,
  Repeat,
  Shuffle,
  ChevronDown,
  RotateCcw,
  Footprints,
  ArrowUpDown,
  Cloud,
} from 'lucide-react';

interface OperationToolbarProps {
  mode: ListMode;
  onModeChange: (mode: ListMode) => void;
  onSelectPreset: (presetId: string) => void;
  onRunOperation: (op: OperationType, args?: { val?: number | string; index?: number }) => void;
  onRandomize: () => void;
  onClear: () => void;
  onResetToOriginal: () => void;
  onOpenCloudModal?: () => void;
  disabled?: boolean;
}

export const OperationToolbar: React.FC<OperationToolbarProps> = ({
  mode,
  onModeChange,
  onSelectPreset,
  onRunOperation,
  onRandomize,
  onClear,
  onResetToOriginal,
  onOpenCloudModal,
  disabled = false,
}) => {
  const [insertVal, setInsertVal] = useState<string>('99');
  const [insertIndex, setInsertIndex] = useState<string>('2');
  const [searchVal, setSearchVal] = useState<string>('30');
  const [searchPos, setSearchPos] = useState<string>('3');
  const [deleteVal, setDeleteVal] = useState<string>('20');

  const [activeDropdown, setActiveDropdown] = useState<'insert' | 'delete' | 'search' | 'preset' | null>(null);

  const toggleDropdown = (name: 'insert' | 'delete' | 'search' | 'preset') => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const closeDropdowns = () => setActiveDropdown(null);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 shadow-md flex flex-wrap items-center justify-between gap-3 relative">
      {/* Left: Reset to Original & Mode Selector & Presets */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Reset to Original Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onResetToOriginal();
          }}
          title="Reset simulator to Figure 5.1 original linked list layout"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-200 bg-sky-950/70 border border-sky-600/50 hover:bg-sky-900/60 hover:border-sky-400 text-sky-100 rounded-lg transition-colors whitespace-nowrap shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
          <span>Reset to Original</span>
        </button>

        {/* Linked List Mode Selector */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
          {(
            [
              { id: 'singly', label: 'Singly (p. 66)' },
              { id: 'doubly', label: 'Doubly (p. 67)' },
              { id: 'circular', label: 'Circular (p. 67)' },
              { id: 'playground', label: 'Playground' },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              disabled={disabled}
              onClick={() => {
                soundManager.playClick();
                onModeChange(m.id);
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                mode === m.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 disabled:opacity-40'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Textbook Presets Menu */}
        <div className="relative">
          <button
            disabled={disabled}
            onClick={() => toggleDropdown('preset')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-950 border border-slate-800 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-40"
          >
            <span>Textbook Presets</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {activeDropdown === 'preset' && (
            <div className="absolute top-full left-0 mt-1 w-72 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-1">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    soundManager.playClick();
                    onSelectPreset(p.id);
                    closeDropdowns();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-slate-800 transition-colors"
                >
                  <div className="font-semibold text-slate-100 flex items-center justify-between">
                    <span>{p.name}</span>
                    {p.syllabusRef && (
                      <span className="text-[10px] text-indigo-400 font-mono">{p.syllabusRef}</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">{p.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Cloud Saved Lists */}
        {onOpenCloudModal && (
          <button
            disabled={disabled}
            onClick={() => {
              soundManager.playClick();
              onOpenCloudModal();
            }}
            title="Open Cloud Saved Lists"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-300 bg-slate-950 border border-slate-800 hover:border-indigo-600/60 hover:bg-slate-900 rounded-lg transition-colors disabled:opacity-40"
          >
            <Cloud className="w-3.5 h-3.5 text-indigo-400" />
            <span>Cloud Lists</span>
          </button>
        )}
      </div>

      {/* Right: Chapter 5 Core Operations */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* 1. Traversal Operation (Figure 5.11, p. 68) */}
        <button
          disabled={disabled}
          onClick={() => {
            soundManager.playClick();
            onRunOperation('traverse');
          }}
          title="Traversal Operation: Follow links from head to null (Figure 5.11, p. 68)"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-950 border border-slate-800 hover:bg-slate-800 hover:text-white rounded-lg transition-colors disabled:opacity-40 shadow-sm"
        >
          <Footprints className="w-3.5 h-3.5 text-indigo-400" />
          <span>Traverse (p. 68)</span>
        </button>

        {/* 2. Insertion Dropdown (Figures 5.12-5.14, p. 69) */}
        <div className="relative">
          <button
            disabled={disabled}
            onClick={() => toggleDropdown('insert')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-200 bg-sky-950/60 border border-sky-800/60 hover:bg-sky-900/60 rounded-lg transition-colors disabled:opacity-40"
          >
            <Plus className="w-3.5 h-3.5 text-sky-400" />
            <span>Insertion (p. 69)</span>
            <ChevronDown className="w-3 h-3 text-sky-400" />
          </button>

          {activeDropdown === 'insert' && (
            <div className="absolute top-full right-0 mt-1 w-80 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl p-3.5 z-50 space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-200">Insertion Types (p. 69)</span>
                <span className="text-[11px] text-slate-400">Value to insert:</span>
                <input
                  type="text"
                  value={insertVal}
                  onChange={(e) => setInsertVal(e.target.value)}
                  className="w-16 px-2 py-1 text-xs bg-slate-950 border border-slate-800 rounded text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onRunOperation('insertHead', { val: insertVal });
                    closeDropdowns();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-100 transition-colors"
                >
                  <div className="font-semibold text-sky-300">1. At Beginning (Head)</div>
                  <div className="text-[11px] text-slate-400">New node points to head (O(1))</div>
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    onRunOperation('insertMiddle', { val: insertVal });
                    closeDropdowns();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-100 transition-colors"
                >
                  <div className="font-semibold text-indigo-300">2. In Middle (Between Node A & C)</div>
                  <div className="text-[11px] text-slate-400">Figure 5.12–5.14 step-by-step</div>
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    onRunOperation('insertTail', { val: insertVal });
                    closeDropdowns();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-100 transition-colors"
                >
                  <div className="font-semibold text-emerald-300">3. At End (Tail)</div>
                  <div className="text-[11px] text-slate-400">Last node points to new node</div>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Position #:</span>
                <input
                  type="number"
                  min="1"
                  value={insertIndex}
                  onChange={(e) => setInsertIndex(e.target.value)}
                  className="w-12 px-1.5 py-1 text-xs bg-slate-950 border border-slate-800 rounded text-white font-mono"
                />
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onRunOperation('insertIndex', { val: insertVal, index: Number(insertIndex) || 1 });
                    closeDropdowns();
                  }}
                  className="flex-1 px-2.5 py-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium transition-colors"
                >
                  At Position
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Deletion Dropdown (Figures 5.15-5.17, p. 70) */}
        <div className="relative">
          <button
            disabled={disabled}
            onClick={() => toggleDropdown('delete')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-200 bg-rose-950/60 border border-rose-800/60 hover:bg-rose-900/60 rounded-lg transition-colors disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Deletion (p. 70)</span>
            <ChevronDown className="w-3 h-3 text-rose-400" />
          </button>

          {activeDropdown === 'delete' && (
            <div className="absolute top-full right-0 mt-1 w-72 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl p-3 z-50 space-y-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  onRunOperation('deleteHead');
                  closeDropdowns();
                }}
                className="w-full text-left px-3 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg transition-colors"
              >
                <div className="font-semibold text-rose-300">1. Beginning (Head)</div>
                <div className="text-[11px] text-slate-400">Head directed to second node</div>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onRunOperation('deleteMiddle');
                  closeDropdowns();
                }}
                className="w-full text-left px-3 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg transition-colors"
              >
                <div className="font-semibold text-amber-300">2. Middle (Bypass Node B)</div>
                <div className="text-[11px] text-slate-400">Figures 5.15–5.17: Node A points to C</div>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onRunOperation('deleteTail');
                  closeDropdowns();
                }}
                className="w-full text-left px-3 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg transition-colors"
              >
                <div className="font-semibold text-slate-300">3. End (Tail)</div>
                <div className="text-[11px] text-slate-400">Second-last node points to null</div>
              </button>

              <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Target"
                  value={deleteVal}
                  onChange={(e) => setDeleteVal(e.target.value)}
                  className="w-16 px-2 py-1 text-xs bg-slate-950 border border-slate-800 rounded text-white font-mono"
                />
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onRunOperation('deleteValue', { val: deleteVal });
                    closeDropdowns();
                  }}
                  className="flex-1 px-2.5 py-1 text-xs bg-rose-950/80 border border-rose-700/60 hover:bg-rose-900/80 text-rose-200 rounded transition-colors font-medium"
                >
                  By Value
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. Search Dropdown (Figures 5.18 & 5.19, p. 71) */}
        <div className="relative">
          <button
            disabled={disabled}
            onClick={() => toggleDropdown('search')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-200 bg-emerald-950/60 border border-emerald-800/60 hover:bg-emerald-900/60 rounded-lg transition-colors disabled:opacity-40"
          >
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            <span>Search (p. 71)</span>
            <ChevronDown className="w-3 h-3 text-emerald-400" />
          </button>

          {activeDropdown === 'search' && (
            <div className="absolute top-full right-0 mt-1 w-72 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl p-3 z-50 space-y-3">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-300">Linear Search by Value (Figure 5.18)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search Key"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className="flex-1 px-2 py-1 text-xs bg-slate-950 border border-slate-800 rounded text-white font-mono"
                  />
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onRunOperation('searchValue', { val: searchVal });
                      closeDropdowns();
                    }}
                    className="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium"
                  >
                    Find Key
                  </button>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-800">
                <span className="text-[11px] font-bold text-slate-300">Search by Position (Figure 5.19)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Position #"
                    value={searchPos}
                    onChange={(e) => setSearchPos(e.target.value)}
                    className="w-20 px-2 py-1 text-xs bg-slate-950 border border-slate-800 rounded text-white font-mono"
                  />
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onRunOperation('searchPosition', { index: Number(searchPos) || 1 });
                      closeDropdowns();
                    }}
                    className="flex-1 px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium"
                  >
                    Find at Pos
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. Sort by Swapping Data (Figure 5.20, p. 72) */}
        <button
          disabled={disabled}
          onClick={() => {
            soundManager.playClick();
            onRunOperation('sortDataSwap');
          }}
          title="Figure 5.20: Sorting by swapping data of nodes (pointers remain unchanged)"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-200 bg-amber-950/50 border border-amber-800/60 hover:bg-amber-900/60 rounded-lg transition-colors disabled:opacity-40"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
          <span>Sort (p. 72)</span>
        </button>

        {/* Reversal */}
        <button
          disabled={disabled}
          onClick={() => {
            soundManager.playClick();
            onRunOperation('reverse');
          }}
          title="Reverse Linked List"
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-40"
        >
          <Repeat className="w-3.5 h-3.5" />
        </button>

        {/* Clear List */}
        <button
          disabled={disabled}
          onClick={() => {
            soundManager.playDisconnect();
            onClear();
          }}
          title="Clear all nodes"
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-40"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
