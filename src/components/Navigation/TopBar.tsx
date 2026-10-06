import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Plus,
  RotateCcw,
  Cloud,
  LogIn,
  LogOut,
  Sparkles,
  PanelLeft,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { useAuth } from '../../context/AuthContext';

export type ActiveTab = 'visualizer' | 'scenarios' | 'linearDS' | 'checklist' | 'challenges' | 'comparison';

interface TopBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onAddNode: () => void;
  onResetLayout: () => void;
  onResetToOriginal: () => void;
  onOpenCloudModal: () => void;
  onOpenChat: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

const TAB_TITLES: Record<ActiveTab, string> = {
  visualizer: 'Linked List (5.1) · Visualizer',
  linearDS: 'Stacks & Queues (5.2 & 5.3)',
  scenarios: 'Activities & Scenarios',
  challenges: 'Syllabus Interactive Challenges',
  checklist: 'Chapter 5 Review & Checklist',
  comparison: 'Array vs Linked List Comparison',
};

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onTabChange,
  onAddNode,
  onResetLayout,
  onResetToOriginal,
  onOpenCloudModal,
  onOpenChat,
  isMuted,
  onToggleMute,
  onToggleSidebar,
  isSidebarCollapsed,
  theme = 'dark',
  onToggleTheme,
}) => {
  const { user, signInWithGoogle, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Sidebar Toggle + Brand Title + Breadcrumb */}
      <div className="flex items-center gap-3 overflow-hidden">
        {onToggleSidebar && (
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleSidebar();
            }}
            title={isSidebarCollapsed ? 'Expand navigation menu' : 'Collapse navigation menu'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors shrink-0"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-2 overflow-hidden">
          <a
            href="#visualizer"
            onClick={(e) => {
              e.preventDefault();
              onTabChange('visualizer');
            }}
            className="text-base sm:text-lg font-bold tracking-tight text-white hover:text-indigo-400 transition-colors whitespace-nowrap"
          >
            Algorithm & Data Structure Tutorial
          </a>
          <span className="text-slate-600 hidden sm:inline">/</span>
          <span className="text-xs text-indigo-400 font-medium hidden sm:inline truncate">
            {TAB_TITLES[activeTab]}
          </span>
        </div>
      </div>

      {/* Zone 2: Primary Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleMute}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Gemini AI Chatbot Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenChat();
          }}
          title="Chat with Gemini AI DSA Tutor"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-200 bg-amber-950/60 border border-amber-600/60 hover:bg-amber-900/60 hover:text-white rounded-lg transition-colors whitespace-nowrap shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>AI Tutor</span>
        </button>

        {/* Cloud Saved Lists Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenCloudModal();
          }}
          title="Cloud Saved Lists"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-200 bg-indigo-950/60 border border-indigo-800/60 hover:bg-indigo-900/60 hover:text-white rounded-lg transition-colors whitespace-nowrap shadow-sm"
        >
          <Cloud className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Cloud Lists</span>
        </button>

        {/* Reset to Original Layout Button */}
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
          title="Auto Align Nodes Horizontally from top-left"
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

        {/* Auth status button / user menu */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
              title={user.email || 'User Account'}
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                  {user.displayName?.[0] || user.email?.[0] || 'U'}
                </div>
              )}
              <span className="text-xs text-slate-300 hidden md:inline max-w-[100px] truncate">
                {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
              </span>
            </button>

            {showUserMenu && (
              <div
                className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setShowUserMenu(false)}
              >
                <div className="px-3 py-2 border-b border-slate-800/80">
                  <p className="font-semibold text-slate-200 truncate">{user.displayName || 'Learner'}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenChat();
                  }}
                  className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ask Gemini Tutor</span>
                </button>
                <button
                  onClick={onOpenCloudModal}
                  className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                >
                  <Cloud className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Cloud Saved Lists</span>
                </button>
                <button
                  onClick={async () => {
                    soundManager.playClick();
                    await logout();
                  }}
                  className="w-full text-left px-3 py-2 text-rose-400 hover:bg-slate-800 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={async () => {
              soundManager.playClick();
              try {
                await signInWithGoogle();
              } catch (e) {
                console.error(e);
              }
            }}
            title="Sign in with Google to enable cloud saving"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-white rounded-lg transition-colors whitespace-nowrap"
          >
            <LogIn className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}

        {/* Dark / Light Theme Toggle Button */}
        {onToggleTheme && (
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleTheme();
            }}
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center ml-0.5"
            aria-label="Toggle dark / light theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-300 hover:text-amber-200 transition-transform duration-200 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400 hover:text-indigo-300 transition-transform duration-200 hover:-rotate-12" />
            )}
          </button>
        )}
      </div>
    </header>
  );
};
