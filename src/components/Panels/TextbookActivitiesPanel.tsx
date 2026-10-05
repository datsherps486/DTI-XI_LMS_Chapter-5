import React, { useState } from 'react';
import {
  ACTIVITY_5_04_SCENARIOS,
  ACTIVITY_5_05_SCENARIOS,
  ACTIVITY_5_08_SCENARIOS,
  ScenarioCard,
} from '../../data/chapter5Data';
import { soundManager } from '../../utils/audio';
import { fireConfetti } from '../../utils/confetti';
import {
  BookOpen,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Users,
  Play,
  Check,
  Sparkles,
} from 'lucide-react';

interface TextbookActivitiesPanelProps {
  onLoadScenarioIntoVisualizer?: (list: (string | number)[], title: string) => void;
}

export const TextbookActivitiesPanel: React.FC<TextbookActivitiesPanelProps> = ({
  onLoadScenarioIntoVisualizer,
}) => {
  const [activeTab, setActiveTab] = useState<'scenarios' | 'classification' | 'humanGame'>('scenarios');

  // Classification Table Activity (Activity 5.08)
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [checkedResults, setCheckedResults] = useState<Record<number, boolean>>({});

  const handleSelectAnswer = (idx: number, val: string) => {
    soundManager.playClick();
    setUserAnswers((prev) => ({ ...prev, [idx]: val }));
  };

  const handleCheckAnswers = () => {
    let allCorrect = true;
    const results: Record<number, boolean> = {};

    ACTIVITY_5_08_SCENARIOS.forEach((item, idx) => {
      const isCorrect = userAnswers[idx] === item.type;
      results[idx] = isCorrect;
      if (!isCorrect) allCorrect = false;
    });

    setCheckedResults(results);

    if (allCorrect && Object.keys(userAnswers).length === ACTIVITY_5_08_SCENARIOS.length) {
      soundManager.playSuccess();
      fireConfetti();
    } else {
      soundManager.playStep();
    }
  };

  // Human Linked List Game Simulation (Unplugged Activity 5.01, p. 73)
  const [humanStep, setHumanStep] = useState<number>(0);
  const humanSteps = [
    {
      title: '1. Class observe a linked list',
      desc: 'Learners act as nodes (data: 10, 20, 30, 40, 50). Each learner holds a ribbon (pointer) connecting to the next learner. First learner holds HEAD, last learner holds NULL.',
      activeLearner: null,
      nodes: ['10', '20', '30', '40', '50'],
    },
    {
      title: '2. CPU Learner Walks: Traverse (p. 73)',
      desc: 'The CPU learner walks node by node following ribbons starting from HEAD. You must follow pointers and cannot jump randomly!',
      activeLearner: 1,
      nodes: ['10', '20', '30', '40', '50'],
    },
    {
      title: '3. Insert New Learner with Data 25',
      desc: 'Add a new learner between 20 and 30. Notice: only ribbons (pointers) change! Node 20 ribbon points to 25, node 25 ribbon points to 30. No students are physically moved or renumbered.',
      activeLearner: 2,
      nodes: ['10', '20', '25 (New)', '30', '40', '50'],
    },
    {
      title: '4. Delete Node 30 by Pointer Redirection',
      desc: 'Node 25 redirects its ribbon to point to node 40. Node 30 steps out holding its ribbon. This shows pointer redirection removes a node!',
      activeLearner: 3,
      nodes: ['10', '20', '25', '40', '50'],
    },
    {
      title: '5. Delete Node 10 (Front / Head Deletion)',
      desc: 'Head card is handed over to node 20. Node 10 steps out. This demonstrates deleting from the front in a linked list.',
      activeLearner: 0,
      nodes: ['20 (New Head)', '25', '40', '50'],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-slate-100">
              Class XI Textbook Activities & Scenarios
            </h2>
          </div>
          <p className="text-sm text-slate-400">
            Direct syllabus scenario cards, classification matrices, and unplugged activities from Chapter 5.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('scenarios');
            }}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'scenarios' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Scenario Cards (Act 5.04 & 5.05)
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('classification');
            }}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'classification' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Think-Pair-Share (Act 5.08)
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('humanGame');
            }}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'humanGame' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Human Linked Lists Game (Act 5.01)
          </button>
        </div>
      </div>

      {/* 1. SCENARIO CARDS (Activity 5.04 & 5.05, p. 69-70) */}
      {activeTab === 'scenarios' && (
        <div className="space-y-6">
          {/* Insertion Cards */}
          <div>
            <h3 className="text-base font-bold text-slate-200 mb-3 flex items-center gap-2">
              <span>Activity 5.04: Insertion Scenario Cards (p. 69)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ACTIVITY_5_04_SCENARIOS.map((card) => (
                <div
                  key={card.id}
                  className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-100 text-sm">{card.title}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/70 border border-sky-600/40 text-sky-300">
                      Insertion
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {card.context}
                  </p>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-xs font-mono">
                    <div className="text-slate-400">Current: {card.initialList.join(' → ')} → NULL</div>
                    <div className="text-emerald-400">Result: {card.expectedOutcome} → NULL</div>
                  </div>

                  <p className="text-xs text-slate-400">
                    <strong>Why pointers:</strong> {card.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Deletion Cards */}
          <div>
            <h3 className="text-base font-bold text-slate-200 mb-3 flex items-center gap-2">
              <span>Activity 5.05: Deletion Scenario Cards (p. 70)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ACTIVITY_5_05_SCENARIOS.map((card) => (
                <div
                  key={card.id}
                  className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-100 text-sm">{card.title}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/70 border border-rose-600/40 text-rose-300">
                      Deletion
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1 text-xs font-mono">
                    <div className="text-slate-400">Before: {card.initialList.join(' → ')} → NULL</div>
                    <div className="text-rose-300">After: {card.expectedOutcome} → NULL</div>
                  </div>

                  <p className="text-xs text-slate-300">
                    <strong>Checklist Explanation:</strong> {card.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. ACTIVITY 5.08: THINK-PAIR-SHARE CLASSIFICATION TABLE (p. 81-82) */}
      {activeTab === 'classification' && (
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Activity 5.08: Think-Pair-Share Principle Classification
            </h3>
            <p className="text-xs text-slate-400">
              Read each scenario from the textbook (p. 81) and classify whether it follows FIFO (Queue), LIFO (Stack), or Priority Queue.
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-300">
                  <th className="py-2.5 px-4">Scenario (p. 81)</th>
                  <th className="py-2.5 px-4">Description</th>
                  <th className="py-2.5 px-4">Select Principle</th>
                  <th className="py-2.5 px-4">Reasoning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {ACTIVITY_5_08_SCENARIOS.map((item, idx) => {
                  const currentChoice = userAnswers[idx];
                  const hasChecked = checkedResults[idx] !== undefined;
                  const isCorrect = checkedResults[idx];

                  return (
                    <tr key={item.scenario} className="hover:bg-slate-900/40">
                      <td className="py-3 px-4 font-semibold text-slate-200 whitespace-nowrap">
                        {item.scenario}
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-xs">
                        {item.description}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <select
                          value={currentChoice || ''}
                          onChange={(e) => handleSelectAnswer(idx, e.target.value)}
                          className={`px-2 py-1 text-xs rounded border font-mono ${
                            hasChecked
                              ? isCorrect
                                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                                : 'bg-rose-950/70 border-rose-500 text-rose-300'
                              : 'bg-slate-900 border-slate-700 text-slate-200'
                          }`}
                        >
                          <option value="">-- Choose --</option>
                          <option value="FIFO">FIFO (Queue)</option>
                          <option value="LIFO">LIFO (Stack)</option>
                          <option value="Priority Queue">Priority Queue</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-400">
                        {hasChecked ? item.explanation : 'Complete to see reasoning'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Completed: {Object.keys(userAnswers).length} of {ACTIVITY_5_08_SCENARIOS.length}
            </span>
            <button
              onClick={handleCheckAnswers}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              Verify Answers
            </button>
          </div>
        </div>
      )}

      {/* 3. UNPLUGGED ACTIVITY 5.01: HUMAN LINKED LISTS GAME (p. 73) */}
      {activeTab === 'humanGame' && (
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                <span>Unplugged Activity 5.01: Human Linked Lists Game (p. 73)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Classroom game where learners act as data cards and ribbons act as pointers.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundManager.playStep();
                  setHumanStep((s) => (s > 0 ? s - 1 : 0));
                }}
                disabled={humanStep === 0}
                className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg text-slate-300"
              >
                Previous Step
              </button>
              <button
                onClick={() => {
                  soundManager.playStep();
                  setHumanStep((s) => (s < humanSteps.length - 1 ? s + 1 : s));
                }}
                disabled={humanStep === humanSteps.length - 1}
                className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold rounded-lg shadow-sm"
              >
                Next Step ({humanStep + 1}/{humanSteps.length})
              </button>
            </div>
          </div>

          {/* Current Step Description */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <h4 className="text-sm font-bold text-indigo-300">
              {humanSteps[humanStep].title}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {humanSteps[humanStep].desc}
            </p>
          </div>

          {/* Visual Human Nodes with Ribbons */}
          <div className="p-8 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center overflow-x-auto min-h-[160px]">
            <div className="flex items-center gap-3">
              <div className="px-2.5 py-1 text-[11px] font-bold bg-indigo-600 text-white rounded">
                HEAD
              </div>
              <ArrowRight className="w-4 h-4 text-sky-400 shrink-0" />

              {humanSteps[humanStep].nodes.map((nodeName, idx) => {
                const isActive = idx === humanSteps[humanStep].activeLearner;

                return (
                  <React.Fragment key={`${nodeName}-${idx}`}>
                    <div
                      className={`px-4 py-3 rounded-xl border text-center font-mono text-xs transition-all duration-300 ${
                        isActive
                          ? 'border-amber-400 bg-amber-950/60 text-amber-200 ring-2 ring-amber-500/20 scale-105'
                          : 'border-slate-700 bg-slate-900 text-slate-200'
                      }`}
                    >
                      <div className="text-[10px] text-slate-400">Learner #{idx + 1}</div>
                      <div className="font-bold">{nodeName}</div>
                      <div className="text-[9px] text-sky-400 mt-1">Ribbon Pointer →</div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-sky-400 shrink-0" />
                  </React.Fragment>
                );
              })}

              <div className="px-2.5 py-1 text-[11px] font-bold bg-slate-800 text-slate-400 rounded">
                NULL
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
