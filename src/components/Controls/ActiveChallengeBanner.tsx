import React, { useState } from 'react';
import { Challenge } from '../../types/linkedList';
import { Trophy, CheckCircle2, HelpCircle, RotateCcw, X, ArrowRight } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface ActiveChallengeBannerProps {
  challenge: Challenge;
  isSolved: boolean;
  onReset: () => void;
  onExit: () => void;
  onNextChallenge?: () => void;
}

export const ActiveChallengeBanner: React.FC<ActiveChallengeBannerProps> = ({
  challenge,
  isSolved,
  onReset,
  onExit,
  onNextChallenge,
}) => {
  const [showHint, setShowHint] = useState(false);

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-300 ${
        isSolved
          ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
          : 'bg-indigo-950/30 border-indigo-500/50 shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {isSolved ? (
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3.5 h-3.5" /> Solved!
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 border border-indigo-500/40 px-2 py-0.5 rounded">
                <Trophy className="w-3.5 h-3.5" /> Active Challenge
              </span>
            )}
            <h3 className="font-bold text-slate-100 text-sm sm:text-base">
              {challenge.title}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            {challenge.instruction}
          </p>

          {isSolved && (
            <p className="text-xs text-emerald-300/90 pt-1 font-sans">
              <strong>Key Insight:</strong> {challenge.targetExplanation}
            </p>
          )}

          {showHint && !isSolved && (
            <div className="mt-2 text-xs text-amber-300 bg-amber-950/50 border border-amber-600/30 p-2.5 rounded-lg flex items-start gap-2">
              <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <span>{challenge.hint}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {!isSolved && (
            <button
              onClick={() => {
                soundManager.playClick();
                setShowHint(!showHint);
              }}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>{showHint ? 'Hide Hint' : 'Hint'}</span>
            </button>
          )}

          <button
            onClick={onReset}
            title="Reset challenge to initial state"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {isSolved && onNextChallenge && (
            <button
              onClick={onNextChallenge}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Next Challenge</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onExit}
            title="Exit challenge"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
