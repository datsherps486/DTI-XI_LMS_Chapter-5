import React, { useState } from 'react';
import { ActiveTab } from './TopBar';
import { soundManager } from '../../utils/audio';
import { PRESETS } from '../../data/presets';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Network,
  Layers,
  BookOpen,
  Trophy,
  CheckSquare,
  GitCompare,
  Sparkles,
  Cloud,
  FileCode,
  RotateCcw,
  Plus,
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSelectPreset?: (presetId: string) => void;
  onOpenChat: () => void;
  onOpenCloudModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
  onSelectPreset,
  onOpenChat,
  onOpenCloudModal,
}) => {
  // Expanded sub-menus state inside sidebar
  const [expandedGroups, setExpandedGroups] = useState<{
    linkedList: boolean;
    linearDS: boolean;
    activities: boolean;
    review: boolean;
  }>({
    linkedList: true,
    linearDS: true,
    activities: false,
    review: false,
  });

  const toggleGroup = (group: keyof typeof expandedGroups) => {
    soundManager.playClick();
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const handleNavClick = (tab: ActiveTab) => {
    soundManager.playClick();
    onTabChange(tab);
  };

  const handlePresetClick = (presetId: string) => {
    soundManager.playClick();
    if (activeTab !== 'visualizer') {
      onTabChange('visualizer');
    }
    if (onSelectPreset) {
      onSelectPreset(presetId);
    }
  };

  return (
    <aside
      className={`bg-slate-950/95 border-r border-slate-800 transition-all duration-300 ease-in-out flex flex-col shrink-0 select-none z-30 ${
        isCollapsed ? 'w-14' : 'w-64'
      }`}
    >
      {/* Sidebar Header */}
      <div className="h-14 border-b border-slate-800/80 px-3 flex items-center justify-between gap-2 shrink-0">
        {!isCollapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              <Network className="w-4 h-4" />
            </div>
            <span className="font-bold text-xs uppercase tracking-wider text-slate-200 truncate">
              Curriculum Menu
            </span>
          </div>
        )}

        {/* Collapse / Expand Toggle Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onToggleCollapse();
          }}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors ${
            isCollapsed ? 'mx-auto' : ''
          }`}
          title={isCollapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar for larger workspace'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Groups (Scrollable) */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-2 text-xs font-sans">
        {/* GROUP 1: Linked List (5.1) */}
        <div>
          <button
            onClick={() => {
              if (isCollapsed) {
                handleNavClick('visualizer');
              } else {
                toggleGroup('linkedList');
              }
            }}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors ${
              activeTab === 'visualizer'
                ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
            title="Linked List (5.1)"
          >
            <Network className="w-4 h-4 shrink-0 text-indigo-400" />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left truncate">Linked List (5.1)</span>
                {expandedGroups.linkedList ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                )}
              </>
            )}
          </button>

          {/* Sub-menu items for Linked List */}
          {!isCollapsed && expandedGroups.linkedList && (
            <div className="mt-1 ml-4 pl-2 border-l border-slate-800 space-y-0.5">
              <button
                onClick={() => handleNavClick('visualizer')}
                className={`w-full text-left px-2 py-1.5 rounded-lg text-[11px] transition-colors ${
                  activeTab === 'visualizer'
                    ? 'text-indigo-300 font-medium bg-slate-900'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                Interactive Canvas
              </button>
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePresetClick(p.id)}
                  className="w-full text-left px-2 py-1 rounded-lg text-[11px] text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 truncate transition-colors flex items-center gap-1.5"
                  title={p.name}
                >
                  <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0" />
                  <span className="truncate">{p.syllabusRef || p.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* GROUP 2: Linear Data Structures (5.2 & 5.3) */}
        <div>
          <button
            onClick={() => handleNavClick('linearDS')}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors ${
              activeTab === 'linearDS'
                ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
            title="Stacks & Queues (5.2 & 5.3)"
          >
            <Layers className="w-4 h-4 shrink-0 text-sky-400" />
            {!isCollapsed && (
              <span className="flex-1 text-left truncate">Stacks & Queues (5.2 & 5.3)</span>
            )}
          </button>
        </div>

        {/* GROUP 3: Class XI Activities & Scenarios */}
        <div>
          <button
            onClick={() => handleNavClick('scenarios')}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors ${
              activeTab === 'scenarios'
                ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
            title="Activities & Scenarios"
          >
            <BookOpen className="w-4 h-4 shrink-0 text-emerald-400" />
            {!isCollapsed && (
              <span className="flex-1 text-left truncate">Activities & Scenarios</span>
            )}
          </button>
        </div>

        {/* GROUP 4: Syllabus Challenges */}
        <div>
          <button
            onClick={() => handleNavClick('challenges')}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors ${
              activeTab === 'challenges'
                ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
            title="Syllabus Challenges (10)"
          >
            <Trophy className="w-4 h-4 shrink-0 text-amber-400" />
            {!isCollapsed && (
              <span className="flex-1 text-left truncate">Syllabus Challenges</span>
            )}
          </button>
        </div>

        {/* GROUP 5: Chapter 5 Review */}
        <div>
          <button
            onClick={() => handleNavClick('checklist')}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors ${
              activeTab === 'checklist'
                ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
            title="Chapter 5 Review & Checklist"
          >
            <CheckSquare className="w-4 h-4 shrink-0 text-purple-400" />
            {!isCollapsed && (
              <span className="flex-1 text-left truncate">Chapter 5 Review</span>
            )}
          </button>
        </div>

        {/* GROUP 6: Array vs List */}
        <div>
          <button
            onClick={() => handleNavClick('comparison')}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors ${
              activeTab === 'comparison'
                ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
            title="Array vs Linked List"
          >
            <GitCompare className="w-4 h-4 shrink-0 text-pink-400" />
            {!isCollapsed && (
              <span className="flex-1 text-left truncate">Array vs List</span>
            )}
          </button>
        </div>
      </div>

      {/* Sidebar Footer Quick Controls */}
      <div className="border-t border-slate-800/80 p-2 space-y-1 bg-slate-950/80 shrink-0">
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenChat();
          }}
          className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-semibold text-amber-300 hover:bg-amber-950/50 hover:text-amber-200 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title="Open Gemini AI DSA Tutor"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
          {!isCollapsed && <span>AI Tutor</span>}
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            onOpenCloudModal();
          }}
          className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-900 hover:text-slate-200 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title="Cloud Saved Lists"
        >
          <Cloud className="w-4 h-4 text-indigo-400 shrink-0" />
          {!isCollapsed && <span>Cloud Lists</span>}
        </button>
      </div>
    </aside>
  );
};
