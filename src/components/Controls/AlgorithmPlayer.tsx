import React, { useEffect, useRef, useState } from 'react';
import { AlgorithmStep } from '../../types/linkedList';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Clock, Sparkles } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface AlgorithmPlayerProps {
  steps: AlgorithmStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  playbackSpeed: number; // in milliseconds per step (e.g. 2200)
  onStepChange: (index: number) => void;
  onTogglePlay: () => void;
  onSpeedChange: (speed: number) => void;
  onReset: () => void;
  onResetToOriginal?: () => void;
}

export const AlgorithmPlayer: React.FC<AlgorithmPlayerProps> = ({
  steps,
  currentStepIndex,
  isPlaying,
  playbackSpeed,
  onStepChange,
  onTogglePlay,
  onSpeedChange,
  onReset,
  onResetToOriginal,
}) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [stepProgress, setStepProgress] = useState<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const currentStep = steps[currentStepIndex] || steps[0];
  const totalSteps = steps.length;
  const isFinished = currentStepIndex >= totalSteps - 1;

  // Auto-play logic with smooth progress animation
  useEffect(() => {
    if (isPlaying) {
      if (isFinished) {
        onTogglePlay(); // pause at end
        setStepProgress(0);
        return;
      }

      startTimeRef.current = performance.now();

      const updateProgress = () => {
        const elapsed = performance.now() - startTimeRef.current;
        const ratio = Math.min(elapsed / playbackSpeed, 1);
        setStepProgress(ratio);

        if (ratio < 1 && isPlaying) {
          animFrameRef.current = requestAnimationFrame(updateProgress);
        }
      };

      animFrameRef.current = requestAnimationFrame(updateProgress);

      timerRef.current = setTimeout(() => {
        setStepProgress(0);
        onStepChange(currentStepIndex + 1);
        soundManager.playStep();
      }, playbackSpeed);
    } else {
      setStepProgress(0);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, currentStepIndex, isFinished, playbackSpeed, onStepChange, onTogglePlay]);

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      soundManager.playStep();
      onStepChange(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      soundManager.playStep();
      onStepChange(currentStepIndex - 1);
    }
  };

  const handlePlayButtonClick = () => {
    if (isFinished) {
      // Replay from beginning
      onStepChange(0);
      soundManager.playClick();
      if (!isPlaying) {
        onTogglePlay();
      }
    } else {
      soundManager.playClick();
      onTogglePlay();
    }
  };

  // Expanded speed presets with ultra-clear student-focused slow tiers
  const speedOptions = [
    { label: '0.25× Ultra Slow (3.5s)', short: '0.25×', ms: 3500 },
    { label: '0.5× Slow (2.2s)', short: '0.5×', ms: 2200 },
    { label: '0.75× Moderate (1.5s)', short: '0.75×', ms: 1500 },
    { label: '1× Normal (1.0s)', short: '1×', ms: 1000 },
    { label: '1.5× Fast (0.6s)', short: '1.5×', ms: 600 },
  ];

  if (!currentStep) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col gap-3">
      {/* Top Header: Step Counter & Playback Controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Step {currentStep.stepIndex} of {totalSteps}
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <span>{currentStep.title}</span>
            {isPlaying && (
              <span className="flex items-center gap-1 text-[11px] font-normal text-amber-300 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-full animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Live Demo ({Math.round(playbackSpeed / 100) / 10}s per step)
              </span>
            )}
          </span>
        </div>

        {/* Speed & Media Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Speed Selector */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs text-slate-400">
            <span className="flex items-center gap-1 pl-2 pr-1.5 text-[11px] text-slate-400 font-medium">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Speed:</span>
            </span>
            {speedOptions.map((opt) => (
              <button
                key={opt.ms}
                onClick={() => onSpeedChange(opt.ms)}
                title={opt.label}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  playbackSpeed === opt.ms
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'hover:text-slate-200'
                }`}
              >
                {opt.short}
              </button>
            ))}
          </div>

          {/* Stepper Buttons */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={onReset}
              title="Reset to beginning"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              title="Previous Step"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent rounded transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={handlePlayButtonClick}
              title={isPlaying ? 'Pause Demo' : isFinished ? 'Replay Demo from Step 1' : 'Play Step-by-Step Demo'}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause' : isFinished ? 'Replay' : 'Play Slow Demo'}</span>
            </button>
            <button
              onClick={handleNext}
              disabled={isFinished}
              title="Next Step"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent rounded transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {onResetToOriginal && (
            <button
              onClick={onResetToOriginal}
              title="Exit operation and restore original linked list"
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-sky-400 hover:text-sky-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset List</span>
            </button>
          )}
        </div>
      </div>

      {/* Two-Tier Progress Bar: Overall Step Progress + Current Step Time Buffer */}
      <div className="space-y-1">
        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-indigo-500 to-sky-400 h-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
          />
        </div>
        {isPlaying && (
          <div className="w-full bg-slate-950 h-0.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-400 h-full transition-all duration-75"
              style={{ width: `${stepProgress * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Step Explanation Callout */}
      <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 mt-1 shrink-0 animate-ping" />
          <p className="text-sm text-slate-200 leading-relaxed font-normal">
            {currentStep.description}
          </p>
        </div>
        {currentStep.syllabusReference && (
          <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/80 border border-indigo-700/50 px-2 py-0.5 rounded shrink-0 whitespace-nowrap">
            {currentStep.syllabusReference}
          </span>
        )}
      </div>
    </div>
  );
};
