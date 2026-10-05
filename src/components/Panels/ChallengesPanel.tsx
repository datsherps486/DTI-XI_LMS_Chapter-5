import React from 'react';
import { Challenge } from '../../types/linkedList';
import { CHALLENGES } from '../../data/challenges';
import { soundManager } from '../../utils/audio';
import { CheckCircle2, Circle, Trophy, ArrowRight, Lightbulb } from 'lucide-react';

interface ChallengesPanelProps {
  activeChallengeId: string | null;
  solvedChallengeIds: Set<string>;
  onSelectChallenge: (challenge: Challenge) => void;
  onExitChallenge: () => void;
  onResetChallenge: () => void;
}

export const ChallengesPanel: React.FC<ChallengesPanelProps> = ({
  activeChallengeId,
  solvedChallengeIds,
  onSelectChallenge,
  onExitChallenge,
  onResetChallenge,
}) => {
  const activeChallenge = CHALLENGES.find((c) => c.id === activeChallengeId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-slate-100">Interactive Challenges</h2>
          </div>
          <p className="text-sm text-slate-400">
            Reinforce your understanding by manually rewiring pointers, forging loops, and inserting nodes on the canvas.
          </p>
        </div>

        {activeChallenge && (
          <div className="flex items-center gap-2">
            <button
              onClick={onResetChallenge}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Reset Challenge
            </button>
            <button
              onClick={onExitChallenge}
              className="px-3 py-1.5 text-xs font-medium text-rose-300 bg-rose-950/40 border border-rose-800/40 hover:bg-rose-900/40 rounded-lg transition-colors"
            >
              Exit Challenge
            </button>
          </div>
        )}
      </div>

      {/* Challenge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CHALLENGES.map((challenge, idx) => {
          const isSolved = solvedChallengeIds.has(challenge.id);
          const isActive = challenge.id === activeChallengeId;

          let badgeColor = 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40';
          if (challenge.level === 'Intermediate') {
            badgeColor = 'bg-amber-950/60 text-amber-400 border-amber-800/40';
          } else if (challenge.level === 'Advanced') {
            badgeColor = 'bg-rose-950/60 text-rose-400 border-rose-800/40';
          }

          return (
            <div
              key={challenge.id}
              onClick={() => {
                soundManager.playClick();
                onSelectChallenge(challenge);
              }}
              className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-150 ${
                isActive
                  ? 'border-indigo-500 bg-indigo-950/20 ring-1 ring-indigo-500/40'
                  : 'border-slate-800 bg-slate-950 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {isSolved ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                  <h3 className="font-semibold text-slate-100 text-sm">
                    {challenge.title}
                  </h3>
                </div>

                <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded border ${badgeColor}`}>
                  {challenge.level}
                </span>
              </div>

              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                {challenge.description}
              </p>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                <span className="text-slate-400 font-mono text-[11px]">
                  {isSolved ? 'Completed' : 'Not yet solved'}
                </span>
                <span className="text-indigo-400 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  {isActive ? 'In Progress' : 'Start Task'} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
