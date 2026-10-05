import React from 'react';
import { Volume2, VolumeX, Plus, RotateCcw } from 'lucide-react';
import { soundManager } from '../../utils/audio';

export type ActiveTab = 'visualizer' | 'scenarios' | 'linearDS' | 'checklist' | 'challenges' | 'comparison';

interface TopBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onAddNode: () => void;
  onResetLayout: () => void;
  onResetToOriginal: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onTabChange,
  onAddNode,
  onResetLayout,
  onResetToOriginal,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Brand Wordmark (Single text element in display face) */}
      <div className="flex items-center gap-2">
        <a
          href="#visualizer"
          onClick={(e) => {
            e.preventDefault();
            onTabChange('visualizer');
          }}
          className="text-lg font-bold tracking-tight text-white hover:text-indigo-400 transition-colors whitespace-nowrap"
        >
          LinkedList Lab · Class XI
        </a>
      </div>

      {/* Zone 2: Navigation Links (single-line, clean text tabs) */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button
          onClick={() => onTabChange('visualizer')}
          className={`hover:text-white transition-colors whitespace-nowrap ${
            activeTab === 'visualizer' ? 'text-indigo-400 font-semibold border-b-2 border-indigo-400 pb-0.5' : ''
          }`}
        >
          Linked List (5.1)
        </button>
        <button
          onClick={() => onTabChange('scenarios')}
          className={`hover:text-white transition-colors whitespace-nowrap ${
            activeTab === 'scenarios' ? 'text-indigo-400 font-semibold border-b-2 border-indigo-400 pb-0.5' : ''
          }`}
        >
          Activities & Scenarios
        </button>
        <button
          onClick={() => onTabChange('linearDS')}
          className={`hover:text-white transition-colors whitespace-nowrap ${
            activeTab === 'linearDS' ? 'text-indigo-400 font-semibold border-b-2 border-indigo-400 pb-0.5' : ''
          }`}
        >
          Stacks & Queues (5.2 & 5.3)
        </button>
        <button
          onClick={() => onTabChange('challenges')}
          className={`hover:text-white transition-colors whitespace-nowrap ${
            activeTab === 'challenges' ? 'text-indigo-400 font-semibold border-b-2 border-indigo-400 pb-0.5' : ''
          }`}
        >
          Syllabus Challenges
        </button>
        <button
          onClick={() => onTabChange('checklist')}
          className={`hover:text-white transition-colors whitespace-nowrap ${
            activeTab === 'checklist' ? 'text-indigo-400 font-semibold border-b-2 border-indigo-400 pb-0.5' : ''
          }`}
        >
          Chapter 5 Review
        </button>
        <button
          onClick={() => onTabChange('comparison')}
          className={`hover:text-white transition-colors whitespace-nowrap ${
            activeTab === 'comparison' ? 'text-indigo-400 font-semibold border-b-2 border-indigo-400 pb-0.5' : ''
          }`}
        >
          Array vs List
        </button>
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={onResetToOriginal}
          title="Reset simulator to original linked list layout"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-200 bg-sky-950/60 border border-sky-800/60 hover:bg-sky-900/60 hover:text-white rounded-lg transition-colors whitespace-nowrap shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
          <span>Reset List</span>
        </button>

        <button
          onClick={onResetLayout}
          title="Auto Align Nodes Horizontally"
          className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-white rounded-lg transition-colors whitespace-nowrap"
        >
          <span>Align</span>
        </button>

        <button
          onClick={onAddNode}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Node</span>
        </button>
      </div>
    </header>
  );
};
