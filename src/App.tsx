/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { LLNode, ListMode, OperationType, AlgorithmStep, Challenge } from './types/linkedList';
import { computeListTopology, generateMemoryAddress, layoutNodesHorizontally } from './utils/topology';
import { PRESETS } from './data/presets';
import { CHALLENGES } from './data/challenges';
import { soundManager } from './utils/audio';
import { fireConfetti } from './utils/confetti';
import {
  generateTraversalSteps,
  generateInsertHeadSteps,
  generateInsertMiddleSteps,
  generateInsertTailSteps,
  generateDeleteHeadSteps,
  generateDeleteMiddleSteps,
  generateSearchSteps,
  generateSearchByPositionSteps,
  generateSortDataSwapSteps,
  generateReverseSteps,
  generateCycleDetectionSteps,
} from './algorithms/linkedListAlgorithms';

import { TopBar, ActiveTab } from './components/Navigation/TopBar';
import { Sidebar } from './components/Navigation/Sidebar';
import { InteractiveCanvas } from './components/Canvas/InteractiveCanvas';
import { OperationToolbar } from './components/Controls/OperationToolbar';
import { AlgorithmPlayer } from './components/Controls/AlgorithmPlayer';
import { ActiveChallengeBanner } from './components/Controls/ActiveChallengeBanner';
import { ComparisonPanel } from './components/Panels/ComparisonPanel';
import { ChallengesPanel } from './components/Panels/ChallengesPanel';
import { LinearDataStructuresPanel } from './components/Panels/LinearDataStructuresPanel';
import { TextbookActivitiesPanel } from './components/Panels/TextbookActivitiesPanel';
import { ChapterChecklistPanel } from './components/Panels/ChapterChecklistPanel';
import { SavedListsModal } from './components/Modals/SavedListsModal';
import { GeminiChatbot } from './components/Chat/GeminiChatbot';
import { Sparkles } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import {
  SavedListDoc,
  fetchUserProgress,
  saveUserProgress,
} from './services/firestoreService';

function LinkedListApp() {
  const { user } = useAuth();

  // Navigation & View Mode
  const [activeTab, setActiveTab] = useState<ActiveTab>('visualizer');
  const [isMuted, setIsMuted] = useState<boolean>(() => soundManager.getMuted());
  const [isCloudModalOpen, setIsCloudModalOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('app_theme');
      return saved === 'light' || saved === 'dark' ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    try {
      localStorage.setItem('app_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const handleToggleTheme = () => {
    soundManager.playClick();
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Linked List State
  const defaultPreset = PRESETS[0];
  const initialData = defaultPreset.getNodes();
  const [nodes, setNodes] = useState<LLNode[]>(initialData.nodes);
  const [headId, setHeadId] = useState<string | null>(initialData.headId);
  const [mode, setMode] = useState<ListMode>(defaultPreset.mode);

  // Challenges State
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [solvedChallengeIds, setSolvedChallengeIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('linkedlist_solved_challenges');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Algorithm Execution & Stepping State
  const [activeOperation, setActiveOperation] = useState<string | null>(null);
  const [algorithmSteps, setAlgorithmSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(2200);
  // Backup state before algorithm starts so reset is seamless
  const [preAlgorithmState, setPreAlgorithmState] = useState<{ nodes: LLNode[]; headId: string | null } | null>(null);

  // Sync user progress from Firestore when user logs in
  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    fetchUserProgress(user.uid)
      .then((progress) => {
        if (!isMounted || !progress) return;
        if (progress.solvedChallenges && progress.solvedChallenges.length > 0) {
          setSolvedChallengeIds((prev) => {
            const merged = new Set([...prev, ...progress.solvedChallenges]);
            try {
              localStorage.setItem('linkedlist_solved_challenges', JSON.stringify(Array.from(merged)));
            } catch {
              // ignore
            }
            return merged;
          });
        }
      })
      .catch((err) => console.error('Failed to fetch user progress:', err));

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Compute live list topology
  const topology = useMemo(() => {
    return computeListTopology(nodes, headId, mode);
  }, [nodes, headId, mode]);

  // Current active step if running algorithm
  const currentStep = algorithmSteps[currentStepIndex] || null;

  // Real-time verification of active challenge
  const activeChallenge = useMemo(
    () => CHALLENGES.find((c) => c.id === activeChallengeId) || null,
    [activeChallengeId]
  );

  const isCurrentChallengeSolved = useMemo(() => {
    if (!activeChallenge) return false;
    return activeChallenge.validate(nodes, headId, topology);
  }, [activeChallenge, nodes, headId, topology]);

  useEffect(() => {
    if (activeChallenge && isCurrentChallengeSolved && !solvedChallengeIds.has(activeChallenge.id)) {
      const nextSet = new Set(solvedChallengeIds);
      nextSet.add(activeChallenge.id);
      setSolvedChallengeIds(nextSet);
      try {
        localStorage.setItem('linkedlist_solved_challenges', JSON.stringify(Array.from(nextSet)));
      } catch {
        // ignore
      }
      if (user) {
        saveUserProgress(user.uid, Array.from(nextSet), []).catch((err) =>
          console.error('Failed to sync progress to cloud:', err)
        );
      }
      soundManager.playSuccess();
      fireConfetti();
    }
  }, [activeChallenge, isCurrentChallengeSolved, solvedChallengeIds, user]);

  // Audio mute toggle
  const handleToggleMute = () => {
    const nextMuted = soundManager.toggleMute();
    setIsMuted(nextMuted);
  };

  // Add new node dynamically
  const handleAddNode = (customVal?: string | number) => {
    soundManager.playClick();
    const val = customVal !== undefined ? customVal : (nodes.length + 1) * 10;
    const newId = 'node_' + Math.random().toString(36).substring(2, 9);
    const newAddress = generateMemoryAddress();

    // Determine smart placement coordinates aligned from top-left
    const lastNode = nodes[nodes.length - 1];
    const newX = lastNode ? lastNode.x + 210 : 40;
    const newY = lastNode ? lastNode.y : 40;

    const newNode: LLNode = {
      id: newId,
      val,
      nextId: null,
      prevId: mode === 'doubly' && lastNode ? lastNode.id : null,
      x: newX,
      y: newY,
      address: newAddress,
    };

    const updatedExistingNodes = nodes.map((n, idx) => {
      if (idx === nodes.length - 1 && mode === 'doubly' && n.nextId === null) {
        return { ...n, nextId: newId };
      }
      return n;
    });

    const nextNodes = [...updatedExistingNodes, newNode];
    if (nodes.length === 0) {
      setHeadId(newId);
    }
    setNodes(nextNodes);
  };

  // Update node value
  const handleUpdateNodeValue = (nodeId: string, val: string | number) => {
    setNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, val } : n)));
  };

  // Set node as HEAD
  const handleSetHead = (nodeId: string) => {
    setHeadId(nodeId);
    soundManager.playClick();
  };

  // Delete node
  const handleDeleteNode = (nodeId: string) => {
    setNodes((prev) => {
      const updated = prev
        .filter((n) => n.id !== nodeId)
        .map((n) => ({
          ...n,
          nextId: n.nextId === nodeId ? null : n.nextId,
          prevId: n.prevId === nodeId ? null : n.prevId,
        }));
      return updated;
    });

    if (headId === nodeId) {
      const deletedNode = nodes.find((n) => n.id === nodeId);
      setHeadId(deletedNode?.nextId || null);
    }
  };

  // Connect/wire pointers
  const handleConnectPointers = (fromId: string, toId: string | null, port: 'next' | 'prev') => {
    setNodes((prev) => {
      return prev.map((n) => {
        if (n.id === fromId) {
          if (port === 'next') {
            return { ...n, nextId: toId };
          } else {
            return { ...n, prevId: toId };
          }
        }
        return n;
      });
    });
  };

  // Auto-align nodes horizontally in order
  const handleResetLayout = () => {
    soundManager.playClick();
    const aligned = layoutNodesHorizontally(topology.orderedNodes, topology.detachedNodes);
    setNodes(aligned);
  };

  // Full reset back to original default linked list layout
  const handleResetToOriginal = useCallback(() => {
    soundManager.playConnect();
    const defaultData = PRESETS[0].getNodes();
    setNodes(defaultData.nodes);
    setHeadId(defaultData.headId);
    setMode('singly');
    setActiveOperation(null);
    setAlgorithmSteps([]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setPreAlgorithmState(null);
    setActiveChallengeId(null);
  }, []);

  // Load preset
  const handleSelectPreset = (presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    const data = preset.getNodes();
    setNodes(data.nodes);
    setHeadId(data.headId);
    setMode(preset.mode);
    setActiveOperation(null);
    setAlgorithmSteps([]);
    setIsPlaying(false);
  };

  // Load Cloud Saved List into simulator
  const handleLoadSavedList = (saved: SavedListDoc) => {
    setNodes(saved.nodes);
    setHeadId(saved.headId);
    setMode(saved.mode);
    setActiveOperation(null);
    setAlgorithmSteps([]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setActiveChallengeId(null);
  };

  // Start Challenge
  const handleSelectChallenge = (challenge: Challenge) => {
    const setup = challenge.setup();
    setNodes(setup.nodes);
    setHeadId(setup.headId);
    setMode(setup.mode);
    setActiveChallengeId(challenge.id);
    setActiveTab('visualizer');
    setActiveOperation(null);
    setAlgorithmSteps([]);
    setIsPlaying(false);
  };

  const handleResetChallenge = () => {
    if (!activeChallenge) return;
    soundManager.playClick();
    const setup = activeChallenge.setup();
    setNodes(setup.nodes);
    setHeadId(setup.headId);
    setMode(setup.mode);
  };

  const handleExitChallenge = () => {
    soundManager.playClick();
    setActiveChallengeId(null);
  };

  const handleNextChallenge = () => {
    const currentIndex = CHALLENGES.findIndex((c) => c.id === activeChallengeId);
    if (currentIndex !== -1 && currentIndex < CHALLENGES.length - 1) {
      handleSelectChallenge(CHALLENGES[currentIndex + 1]);
    } else {
      setActiveChallengeId(null);
    }
  };

  // Run Algorithmic Operations
  const handleRunOperation = (
    op: OperationType,
    args?: { val?: number | string; index?: number }
  ) => {
    setPreAlgorithmState({ nodes: [...nodes], headId });

    let steps: AlgorithmStep[] = [];
    const val = args?.val ?? 99;

    if (op === 'traverse') {
      steps = generateTraversalSteps(nodes, headId);
    } else if (op === 'insertHead') {
      steps = generateInsertHeadSteps(nodes, headId, val);
    } else if (op === 'insertMiddle') {
      steps = generateInsertMiddleSteps(nodes, headId, val);
    } else if (op === 'insertTail') {
      steps = generateInsertTailSteps(nodes, headId, val);
    } else if (op === 'insertIndex') {
      steps = generateInsertMiddleSteps(nodes, headId, val);
    } else if (op === 'deleteHead') {
      steps = generateDeleteHeadSteps(nodes, headId);
    } else if (op === 'deleteMiddle') {
      steps = generateDeleteMiddleSteps(nodes, headId);
    } else if (op === 'deleteTail') {
      steps = generateDeleteHeadSteps(nodes, headId);
    } else if (op === 'deleteValue') {
      steps = generateDeleteMiddleSteps(nodes, headId);
    } else if (op === 'searchValue') {
      steps = generateSearchSteps(nodes, headId, val);
    } else if (op === 'searchPosition') {
      steps = generateSearchByPositionSteps(nodes, headId, args?.index || 3);
    } else if (op === 'sortDataSwap') {
      steps = generateSortDataSwapSteps(nodes, headId);
    } else if (op === 'reverse') {
      steps = generateReverseSteps(nodes, headId);
    } else if (op === 'detectCycle') {
      steps = generateCycleDetectionSteps(nodes, headId);
    } else {
      steps = generateTraversalSteps(nodes, headId);
    }

    if (steps.length > 0) {
      setActiveOperation(op);
      setAlgorithmSteps(steps);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      // Synchronize canvas to step 0
      setNodes(steps[0].nodes);
      setHeadId(steps[0].headId);
    }
  };

  // Stepping through algorithm
  const handleStepChange = (index: number) => {
    if (index >= 0 && index < algorithmSteps.length) {
      setCurrentStepIndex(index);
      const step = algorithmSteps[index];
      setNodes(step.nodes);
      setHeadId(step.headId);
    }
  };

  // Randomize values
  const handleRandomize = () => {
    setNodes((prev) =>
      prev.map((n) => ({
        ...n,
        val: Math.floor(Math.random() * 90) + 10,
      }))
    );
  };

  // Clear list
  const handleClear = () => {
    setNodes([]);
    setHeadId(null);
    setActiveOperation(null);
    setAlgorithmSteps([]);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 overflow-hidden">
      {/* Top Bar */}
      <TopBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddNode={() => handleAddNode()}
        onResetLayout={handleResetLayout}
        onResetToOriginal={handleResetToOriginal}
        onOpenCloudModal={() => setIsCloudModalOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isSidebarCollapsed={isSidebarCollapsed}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Body: Collapsible Left Sidebar + Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Left Margin Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onSelectPreset={handleSelectPreset}
          onOpenChat={() => setIsChatOpen(true)}
          onOpenCloudModal={() => setIsCloudModalOpen(true)}
        />

        {/* Workspace: Maximized Canvas and Content Panels */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4">
          {/* Visualizer View */}
          {activeTab === 'visualizer' && (
            <div className="space-y-4">
              {/* Active Challenge Alert Banner */}
              {activeChallenge && (
                <ActiveChallengeBanner
                  challenge={activeChallenge}
                  isSolved={isCurrentChallengeSolved}
                  onReset={handleResetChallenge}
                  onExit={handleExitChallenge}
                  onNextChallenge={handleNextChallenge}
                />
              )}

              {/* Top Toolbar */}
              <OperationToolbar
                mode={mode}
                onModeChange={setMode}
                onSelectPreset={handleSelectPreset}
                onRunOperation={handleRunOperation}
                onRandomize={handleRandomize}
                onClear={handleClear}
                onResetToOriginal={handleResetToOriginal}
                onOpenCloudModal={() => setIsCloudModalOpen(true)}
                disabled={isPlaying}
              />

              {/* Algorithm Stepper Deck when an algorithm is executing */}
              {algorithmSteps.length > 0 && (
                <AlgorithmPlayer
                  steps={algorithmSteps}
                  currentStepIndex={currentStepIndex}
                  isPlaying={isPlaying}
                  playbackSpeed={playbackSpeed}
                  onStepChange={handleStepChange}
                  onTogglePlay={() => setIsPlaying(!isPlaying)}
                  onSpeedChange={setPlaybackSpeed}
                  onReset={() => handleStepChange(0)}
                  onResetToOriginal={handleResetToOriginal}
                />
              )}

              {/* Maximized Full-Width Interactive Canvas */}
              <div className="w-full h-[620px] relative">
                <InteractiveCanvas
                  nodes={nodes}
                  headId={headId}
                  mode={mode}
                  topology={topology}
                  activePointers={currentStep ? currentStep.pointers : { HEAD: headId, TAIL: topology.tailId }}
                  highlightEdge={currentStep ? currentStep.highlightEdge : null}
                  onUpdateNodes={setNodes}
                  onUpdateNodeValue={handleUpdateNodeValue}
                  onSetHead={handleSetHead}
                  onDeleteNode={handleDeleteNode}
                  onConnectPointers={handleConnectPointers}
                />
              </div>

              {/* List Topology Status Bar */}
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    Length: <strong className="text-slate-200 tabular-nums">{topology.nodeCount}</strong>
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="flex items-center gap-1.5 font-medium">
                    Status: {topology.hasCycle ? (
                      <strong className="text-amber-400">Cycle Detected</strong>
                    ) : (
                      <strong className="text-emerald-400">Acyclic (Linear)</strong>
                    )}
                  </span>
                  {topology.detachedNodes.length > 0 && (
                    <>
                      <span className="text-slate-600">·</span>
                      <span className="text-amber-400 font-medium">
                        {topology.detachedNodes.length} orphan {topology.detachedNodes.length === 1 ? 'node' : 'nodes'}
                      </span>
                    </>
                  )}
                </div>

                <div className="font-mono text-[11px] text-slate-400">
                  Mode: <span className="text-indigo-300 uppercase">{mode}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Class XI Activities & Scenario Cards (Act 5.04, 5.05, 5.08, Unplugged 5.01) */}
          {activeTab === 'scenarios' && <TextbookActivitiesPanel />}

          {/* Tab 3: Stacks & Queues (Sections 5.2 & 5.3) */}
          {activeTab === 'linearDS' && <LinearDataStructuresPanel />}

          {/* Tab 4: Chapter 5 Review & Checklist (p. 82-83) */}
          {activeTab === 'checklist' && <ChapterChecklistPanel />}

          {/* Tab 5: Syllabus Interactive Challenges */}
          {activeTab === 'challenges' && (
            <ChallengesPanel
              activeChallengeId={activeChallengeId}
              solvedChallengeIds={solvedChallengeIds}
              onSelectChallenge={handleSelectChallenge}
              onExitChallenge={handleExitChallenge}
              onResetChallenge={handleResetChallenge}
            />
          )}

          {/* Tab 6: Array vs List Contiguous Memory Comparison */}
          {activeTab === 'comparison' && <ComparisonPanel />}
        </main>
      </div>

      {/* Cloud Saved Lists Modal */}
      <SavedListsModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
        currentNodes={nodes}
        currentHeadId={headId}
        currentMode={mode}
        onLoadList={handleLoadSavedList}
      />

      {/* Floating Gemini AI Chatbot Launcher Button */}
      <button
        onClick={() => {
          soundManager.playClick();
          setIsChatOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white rounded-full shadow-2xl hover:shadow-indigo-500/30 transition-all transform hover:scale-105 group font-semibold text-xs sm:text-sm border border-indigo-400/30"
        title="Open Gemini AI DSA Tutor"
      >
        <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
        <span>Gemini AI Tutor</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/40" />
      </button>

      {/* Gemini AI Multi-Turn Chatbot Dialog */}
      <GeminiChatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        userId={user?.uid}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LinkedListApp />
    </AuthProvider>
  );
}
