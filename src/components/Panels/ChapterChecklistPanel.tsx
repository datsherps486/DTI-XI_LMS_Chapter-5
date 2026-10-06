import React, { useState, useEffect } from 'react';
import {
  CHAPTER_5_KEY_WORDS,
  CHAPTER_5_PRACTICE_QUESTIONS,
  SUMMARY_CHECKLIST_ITEMS,
} from '../../data/chapter5Data';
import { soundManager } from '../../utils/audio';
import { fireConfetti } from '../../utils/confetti';
import { useAuth } from '../../context/AuthContext';
import { fetchUserProgress, saveUserProgress } from '../../services/firestoreService';
import {
  CheckSquare,
  Square,
  HelpCircle,
  BookCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';

export const ChapterChecklistPanel: React.FC = () => {
  const { user } = useAuth();
  const [checkedItems, setCheckedItems] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem('chapter5_checklist_progress');
      return saved ? new Set(JSON.parse(saved)) : new Set([0, 1, 2, 3]);
    } catch {
      return new Set([0, 1, 2, 3]);
    }
  });

  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    let isMounted = true;
    fetchUserProgress(user.uid).then((progress) => {
      if (!isMounted || !progress) return;
      if (progress.completedChecklist && progress.completedChecklist.length > 0) {
        setCheckedItems((prev) => {
          const merged = new Set([...prev, ...progress.completedChecklist]);
          try {
            localStorage.setItem('chapter5_checklist_progress', JSON.stringify(Array.from(merged)));
          } catch {}
          return merged;
        });
      }
    }).catch(console.error);

    return () => {
      isMounted = false;
    };
  }, [user]);

  const toggleCheck = (idx: number) => {
    soundManager.playClick();
    const nextSet = new Set(checkedItems);
    if (nextSet.has(idx)) {
      nextSet.delete(idx);
    } else {
      nextSet.add(idx);
      if (nextSet.size === SUMMARY_CHECKLIST_ITEMS.length) {
        soundManager.playSuccess();
        fireConfetti();
      }
    }
    setCheckedItems(nextSet);
    try {
      localStorage.setItem('chapter5_checklist_progress', JSON.stringify(Array.from(nextSet)));
    } catch {
      // ignore
    }

    if (user) {
      saveUserProgress(user.uid, [], Array.from(nextSet)).catch(console.error);
    }
  };

  const toggleQuestion = (id: number) => {
    soundManager.playClick();
    setExpandedQuestionId((prev) => (prev === id ? null : id));
  };

  const progressPercent = Math.round((checkedItems.size / SUMMARY_CHECKLIST_ITEMS.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BookCheck className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-slate-100">
            Chapter 5: Summary Checklist & Practice Questions
          </h2>
        </div>
        <p className="text-sm text-slate-400">
          Verify your mastery against the official Class XI textbook syllabus checklist (p. 82-83) and test yourself with the 11 end-of-chapter practice questions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Summary Checklist (p. 82-83) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Summary Checklist (p. 82-83)
              </h3>
              <span className="text-xs font-mono font-semibold text-emerald-400">
                {checkedItems.size}/{SUMMARY_CHECKLIST_ITEMS.length} ({progressPercent}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="space-y-2 pt-2">
              {SUMMARY_CHECKLIST_ITEMS.map((item, idx) => {
                const isChecked = checkedItems.has(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors text-xs ${
                      isChecked
                        ? 'bg-emerald-950/30 text-slate-200'
                        : 'hover:bg-slate-800/60 text-slate-400'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    )}
                    <span className={isChecked ? 'line-through text-slate-400' : ''}>
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Words Glossary */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Chapter 5 Key Words (Textbook Glossary)
            </h3>
            <div className="divide-y divide-slate-800/80">
              {CHAPTER_5_KEY_WORDS.map((kw) => (
                <div key={kw.term} className="py-2 text-xs space-y-0.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-sky-300 font-mono">{kw.term}</strong>
                    <span className="text-[10px] text-slate-400 font-mono">p. {kw.page}</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">{kw.definition}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: 11 Practice Questions (p. 82) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Practice Questions (1 - 11, p. 82)
            </h3>
            <span className="text-xs text-slate-400">Click question to reveal syllabus answer</span>
          </div>

          <div className="space-y-2.5">
            {CHAPTER_5_PRACTICE_QUESTIONS.map((q) => {
              const isExpanded = expandedQuestionId === q.id;

              return (
                <div
                  key={q.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden"
                >
                  <button
                    onClick={() => toggleQuestion(q.id)}
                    className="w-full p-3.5 text-left flex items-start justify-between gap-3 hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono font-semibold flex items-center justify-center shrink-0 mt-0.5">
                        {q.id}
                      </span>
                      <span className="text-xs font-semibold text-slate-100 leading-snug">
                        {q.question}
                      </span>
                    </div>

                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-800/80 bg-slate-950/70 space-y-2 text-xs">
                      <div className="flex items-center gap-1.5 text-amber-300 text-[11px]">
                        <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Hint: {q.hint}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 leading-relaxed">
                        <strong className="text-emerald-400 block mb-0.5">Syllabus Solution:</strong>
                        {q.syllabusAnswer}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
