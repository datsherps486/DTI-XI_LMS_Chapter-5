import React, { useEffect, useRef } from 'react';
import { AlgorithmStep } from '../../types/linkedList';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Clock } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface AlgorithmPlayerProps {
  steps: AlgorithmStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  playbackSpeed: number; // in milliseconds per step (e.g. 1000)
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

  const currentStep = steps[currentStepIndex] || steps[0];
  const totalSteps = steps.length;
  const isFinished = currentStepIndex >= totalSteps - 1;

  useEffect(() => {
    if (isPlaying) {
      if (isFinished) {
        onTogglePlay(); // stop playing if at end
        return;
      }
      timerRef.current = setTimeout(() => {
        onStepChange(currentStepIndex + 1);
        soundManager.playStep();
      }, playbackSpeed);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
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

  const speedOptions = [
    { label: '0.5×', ms: 1800 },
    { label: '1×', ms: 1000 },
    { label: '2×', ms: 500 },
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
          <span className="text-sm font-semibold text-slate-100">{currentStep.title}</span>
        </div>

        {/* Speed & Media Controls */}
        <div className="flex items-center gap-2">
          {/* Speed Selector */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs text-slate-400">
            <Clock className="w-3 h-3 ml-2 mr-1 text-slate-400" />
            {speedOptions.map((opt) => (
              <button
                key={opt.label}
                onClick={() => onSpeedChange(opt.ms)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  playbackSpeed === opt.ms
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'hover:text-slate-200'
                }`}
              >
                {opt.label}
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
              onClick={onTogglePlay}
              title={isPlaying ? 'Pause' : 'Auto Play'}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause' : isFinished ? 'Replay' : 'Play'}</span>
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
              <span>Reset to Original</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
        <div
          className="bg-gradient-to-r from-indigo-500 to-sky-400 h-full transition-all duration-200"
          style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step Explanation Callout */}
      <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="w-2 h-2 rounded-full bg-sky-400 mt-1.5 shrink-0" />
          <p className="text-sm text-slate-300 leading-relaxed">
            {currentStep.description}
          </p>
        </div>
        {currentStep.syllabusReference && (
          <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/70 border border-indigo-700/40 px-2 py-0.5 rounded shrink-0 whitespace-nowrap">
            {currentStep.syllabusReference}
          </span>
        )}
      </div>
    </div>
  );
};
