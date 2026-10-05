import React, { useState } from 'react';
import { soundManager } from '../../utils/audio';
import {
  Layers,
  ArrowRight,
  BookOpen,
  Car,
  AlertTriangle,
  RotateCw,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react';

export const LinearDataStructuresPanel: React.FC = () => {
  const [activeDS, setActiveDS] = useState<'stack' | 'queue' | 'priority' | 'circular'>('stack');

  // --- STACK STATE (Max size = 5 as in Activity 5.07 & Questions, p. 74) ---
  const [stackItems, setStackItems] = useState<string[]>(['Math Book', 'Science Book', 'History Book']);
  const [stackInput, setStackInput] = useState<string>('English Book');
  const [stackMessage, setStackMessage] = useState<{ text: string; type: 'info' | 'error' | 'success' }>({
    text: 'Stack follows LIFO (Last In, First Out). All operations occur at the TOP.',
    type: 'info',
  });

  const handlePush = () => {
    soundManager.playClick();
    if (stackItems.length >= 5) {
      soundManager.playDisconnect();
      setStackMessage({
        text: 'Stack Overflow Error! The stack has a maximum size of 5 and is full (p. 74).',
        type: 'error',
      });
      return;
    }
    const val = stackInput.trim() || `Item ${stackItems.length + 1}`;
    setStackItems([val, ...stackItems]);
    setStackMessage({
      text: `Pushed "${val}" onto the top of the stack. Top pointer updated.`,
      type: 'success',
    });
    soundManager.playConnect();
  };

  const handlePop = () => {
    soundManager.playClick();
    if (stackItems.length === 0) {
      soundManager.playDisconnect();
      setStackMessage({
        text: 'Stack Underflow Error! The stack is empty. Cannot pop (p. 74).',
        type: 'error',
      });
      return;
    }
    const popped = stackItems[0];
    setStackItems(stackItems.slice(1));
    setStackMessage({
      text: `Popped "${popped}" from the top of the stack (LIFO principle).`,
      type: 'info',
    });
    soundManager.playDisconnect();
  };

  // --- QUEUE STATE (FIFO, Front and Rear, p. 76-77) ---
  const [queueItems, setQueueItems] = useState<string[]>(['Customer 1', 'Customer 2', 'Customer 3']);
  const [queueInput, setQueueInput] = useState<string>('Customer 4');
  const [queueMessage, setQueueMessage] = useState<{ text: string; type: 'info' | 'error' | 'success' }>({
    text: 'Queue follows FIFO (First In, First Out). Enqueue at REAR, Dequeue at FRONT.',
    type: 'info',
  });

  const handleEnqueue = () => {
    soundManager.playClick();
    if (queueItems.length >= 6) {
      soundManager.playDisconnect();
      setQueueMessage({
        text: 'Queue Overflow Error! Queue capacity reached (p. 76).',
        type: 'error',
      });
      return;
    }
    const val = queueInput.trim() || `Customer ${queueItems.length + 1}`;
    setQueueItems([...queueItems, val]);
    setQueueMessage({
      text: `Enqueued "${val}" at the REAR of the queue. Rear pointer advanced.`,
      type: 'success',
    });
    soundManager.playConnect();
  };

  const handleDequeue = () => {
    soundManager.playClick();
    if (queueItems.length === 0) {
      soundManager.playDisconnect();
      setQueueMessage({
        text: 'Queue Underflow Error! Queue is empty. Cannot dequeue (p. 76).',
        type: 'error',
      });
      return;
    }
    const dequeued = queueItems[0];
    setQueueItems(queueItems.slice(1));
    setQueueMessage({
      text: `Dequeued "${dequeued}" from the FRONT of the queue (FIFO principle).`,
      type: 'info',
    });
    soundManager.playDisconnect();
  };

  // --- PRIORITY QUEUE STATE (Figure 5.34 & 5.35, p. 78) ---
  const [pqOrder, setPqOrder] = useState<'ascending' | 'descending'>('ascending');
  const [pqItems, setPqItems] = useState<number[]>([5, 7, 12, 19]);
  const [pqInput, setPqInput] = useState<string>('8');

  const handlePqEnqueue = () => {
    soundManager.playClick();
    const num = Number(pqInput);
    if (isNaN(num)) return;

    let updated = [...pqItems, num];
    if (pqOrder === 'ascending') {
      updated.sort((a, b) => a - b);
    } else {
      updated.sort((a, b) => b - a);
    }
    setPqItems(updated);
    soundManager.playConnect();
  };

  const handlePqDequeue = () => {
    soundManager.playClick();
    if (pqItems.length === 0) return;
    setPqItems(pqItems.slice(1));
    soundManager.playDisconnect();
  };

  // --- CIRCULAR QUEUE STATE (Figure 5.32 & 5.33, p. 78) ---
  const circularSlots = [29, 20, 34, 13, 24, 62]; // from textbook Figure 5.32
  const [circularActiveIdx, setCircularActiveIdx] = useState<number>(0);

  const handleAdvanceCircular = () => {
    soundManager.playStep();
    setCircularActiveIdx((prev) => (prev + 1) % circularSlots.length);
  };

  return (
    <div className="space-y-6">
      {/* Header aligned with Chapter 5 Syllabus */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-slate-100">
              Chapter 5: Stacks & Queues (Linear Data Structures)
            </h2>
          </div>
          <p className="text-sm text-slate-400">
            Explore Stacks (LIFO) and Queues (FIFO) as defined in Class XI Textbook Sections 5.2 and 5.3.
          </p>
        </div>

        {/* DS Tabs */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveDS('stack');
            }}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeDS === 'stack' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Stack (LIFO)
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveDS('queue');
            }}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeDS === 'queue' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Queue (FIFO)
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveDS('priority');
            }}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeDS === 'priority' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Priority Queue
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveDS('circular');
            }}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeDS === 'circular' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Circular Queue
          </button>
        </div>
      </div>

      {/* 1. STACK INTERACTIVE EXPLORER (p. 73-75) */}
      {activeDS === 'stack' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls & Textbook Knowledge */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Section 5.2: Stack Operations
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Capacity: {stackItems.length}/5 (Max 5)
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-100">
                  LIFO Principle (Last In, First Out)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Real-life analogy: <strong>Pile of Books</strong> (Figure 5.22). When you add a new book, you always place it on top of the pile (Last In). To remove a book, you must first take the one currently on the top (First Out).
                </p>
              </div>

              {/* Status Alert */}
              <div
                className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                  stackMessage.type === 'error'
                    ? 'bg-rose-950/60 border-rose-600/50 text-rose-200'
                    : stackMessage.type === 'success'
                    ? 'bg-emerald-950/60 border-emerald-600/50 text-emerald-200'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                {stackMessage.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
                <span>{stackMessage.text}</span>
              </div>

              {/* Push & Pop Action Controls */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  value={stackInput}
                  onChange={(e) => setStackInput(e.target.value)}
                  placeholder="Book or Card name"
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-indigo-400"
                />
                <button
                  onClick={handlePush}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Push (Top)</span>
                </button>
                <button
                  onClick={handlePop}
                  disabled={stackItems.length === 0}
                  className="px-3.5 py-1.5 bg-rose-950/70 border border-rose-800/60 hover:bg-rose-900/60 disabled:opacity-40 text-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Minus className="w-3.5 h-3.5" />
                  <span>Pop</span>
                </button>
              </div>
            </div>

            {/* Real Life Uses in Syllabus */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs text-slate-400">
              <h4 className="font-semibold text-slate-200">Real-World Software Applications (p. 75):</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li><strong>Memory Management:</strong> Stack memory stores local variables and automatically deallocates them on function exit.</li>
                <li><strong>Function Call Stack:</strong> Each function invocation is pushed onto call stack.</li>
                <li><strong>Undo/Redo:</strong> Typing/drawing actions pushed to stack; undo pops the last action.</li>
                <li><strong>Browser History:</strong> Each visited URL is pushed; back button pops and returns to previous page.</li>
              </ul>
            </div>
          </div>

          {/* Visual Stack Vessel (Figure 5.24, 5.25) */}
          <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center min-h-[360px]">
            <div className="w-56 border-b-4 border-l-4 border-r-4 border-slate-700 rounded-b-2xl p-3 flex flex-col justify-end min-h-[260px] bg-slate-900/50 shadow-inner space-y-2">
              {stackItems.length === 0 ? (
                <div className="text-center text-slate-400 text-xs py-12">
                  Stack is Empty (Top = NULL)
                </div>
              ) : (
                stackItems.map((item, idx) => {
                  const isTop = idx === 0;
                  return (
                    <div
                      key={`${item}-${idx}`}
                      className={`p-3 rounded-lg border text-xs font-semibold text-center transition-all duration-200 flex items-center justify-between ${
                        isTop
                          ? 'bg-indigo-950/80 border-indigo-400 text-indigo-100 shadow-md ring-2 ring-indigo-500/20 scale-102'
                          : 'bg-slate-950 border-slate-700/80 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{item}</span>
                      </div>
                      {isTop && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500 text-white rounded">
                          TOP
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            <span className="text-[11px] font-mono text-slate-400 mt-3">
              Single Access Point: TOP only (Figure 5.23)
            </span>
          </div>
        </div>
      )}

      {/* 2. QUEUE INTERACTIVE EXPLORER (p. 76-77) */}
      {activeDS === 'queue' && (
        <div className="space-y-6">
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Section 5.3: Queue Operations
              </span>
              <span className="text-xs font-mono text-slate-400">
                Principle: FIFO (First In, First Out)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-100 mb-1">
                  Movie Ticket Counter / Bhutan Gate Analogy
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  (Image 5.27, p. 76). The queue has two distinct ends: <strong>Front</strong> (where deletion/dequeue occurs) and <strong>Rear</strong> (where insertion/enqueue occurs). First person to arrive receives ticket first.
                </p>
              </div>

              {/* Enqueue & Dequeue Controls */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={queueInput}
                    onChange={(e) => setQueueInput(e.target.value)}
                    placeholder="Customer / Job name"
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:outline-none focus:border-indigo-400"
                  />
                  <button
                    onClick={handleEnqueue}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Enqueue (Rear)</span>
                  </button>
                  <button
                    onClick={handleDequeue}
                    disabled={queueItems.length === 0}
                    className="px-3.5 py-1.5 bg-rose-950/70 border border-rose-800/60 hover:bg-rose-900/60 disabled:opacity-40 text-rose-200 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <span>Dequeue (Front)</span>
                  </button>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-950 text-xs text-slate-300">
                  {queueMessage.text}
                </div>
              </div>
            </div>

            {/* Visual Queue Runway (Image 5.26, Figure 5.39, 5.40) */}
            <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto">
              <div className="flex items-center justify-between text-xs font-semibold mb-3 px-2">
                <span className="text-indigo-400 flex items-center gap-1">
                  ← FRONT / HEAD (Removal / Dequeue)
                </span>
                <span className="text-sky-400 flex items-center gap-1">
                  REAR / BACK (Insertion / Enqueue) →
                </span>
              </div>

              <div className="flex items-center gap-3 min-h-[72px] p-3 bg-slate-900/60 border border-slate-800/90 rounded-xl">
                {queueItems.length === 0 ? (
                  <div className="w-full text-center text-slate-400 text-xs py-4">
                    Queue is Empty
                  </div>
                ) : (
                  queueItems.map((item, idx) => {
                    const isFront = idx === 0;
                    const isRear = idx === queueItems.length - 1;

                    return (
                      <div
                        key={`${item}-${idx}`}
                        className={`px-4 py-3 rounded-lg border text-xs font-semibold text-center whitespace-nowrap transition-all duration-200 ${
                          isFront
                            ? 'bg-indigo-950/80 border-indigo-400 text-white ring-2 ring-indigo-500/20'
                            : isRear
                            ? 'bg-sky-950/80 border-sky-400 text-white'
                            : 'bg-slate-950 border-slate-700 text-slate-200'
                        }`}
                      >
                        <div className="text-[10px] font-mono text-slate-400 mb-0.5">
                          {isFront ? 'FRONT' : isRear ? 'REAR' : `Slot #${idx + 1}`}
                        </div>
                        <div>{item}</div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. PRIORITY QUEUE (Figure 5.34 & 5.35, p. 78) */}
      {activeDS === 'priority' && (
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Priority Queue (Hospital Emergency Room Analogy)
              </h3>
              <p className="text-xs text-slate-400">
                Elements are served based on priority value rather than arrival order alone (p. 78).
              </p>
            </div>

            {/* Ascending vs Descending Toggle */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setPqOrder('ascending');
                  setPqItems([5, 7, 8, 12, 19]); // Figure 5.34 textbook example
                }}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  pqOrder === 'ascending' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Ascending (Smallest = Highest Priority)
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setPqOrder('descending');
                  setPqItems([25, 17, 12, 9, 5]); // Figure 5.35 textbook example
                }}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  pqOrder === 'descending' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Descending (Largest = Highest Priority)
              </button>
            </div>
          </div>

          {/* Insertion and Removal */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={pqInput}
              onChange={(e) => setPqInput(e.target.value)}
              placeholder="Priority Value"
              className="w-32 px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
            />
            <button
              onClick={handlePqEnqueue}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm"
            >
              Insert by Priority
            </button>
            <button
              onClick={handlePqDequeue}
              disabled={pqItems.length === 0}
              className="px-3 py-1.5 bg-rose-950/70 border border-rose-800/60 hover:bg-rose-900/60 disabled:opacity-40 text-rose-200 rounded-lg text-xs font-semibold"
            >
              Dequeue Highest Priority
            </button>
          </div>

          {/* Visual Priority Queue Stream */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto">
            <div className="flex items-center gap-2">
              {pqItems.map((val, idx) => (
                <React.Fragment key={`${val}-${idx}`}>
                  <div
                    className={`px-4 py-3 rounded-lg border font-mono text-center ${
                      idx === 0
                        ? 'border-emerald-400 bg-emerald-950/60 text-emerald-200 font-bold ring-2 ring-emerald-500/20'
                        : 'border-slate-800 bg-slate-900 text-slate-300'
                    }`}
                  >
                    <div className="text-[10px] text-slate-400">
                      {idx === 0 ? 'SERVED 1ST' : `Priority #${idx + 1}`}
                    </div>
                    <span className="text-base">{val}</span>
                  </div>
                  {idx < pqItems.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />}
                </React.Fragment>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-3">
              {pqOrder === 'ascending'
                ? 'Figure 5.34: Ascending order priority queue — element 5 has smallest value and will be the first removed.'
                : 'Figure 5.35: Descending order priority queue — element 25 has largest value and will be the first removed.'}
            </p>
          </div>
        </div>
      )}

      {/* 4. CIRCULAR QUEUE (Figure 5.32 & 5.33, p. 78) */}
      {activeDS === 'circular' && (
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Circular Queue / Ring Buffer (Traffic Roundabout Analogy)
              </h3>
              <p className="text-xs text-slate-400">
                (Figure 5.32 & 5.33, p. 78). The last position is connected back to the first position, solving the limitation of linear queues by reusing emptied front slots.
              </p>
            </div>

            <button
              onClick={handleAdvanceCircular}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Step Traffic Roundabout</span>
            </button>
          </div>

          {/* Visual Roundabout Ring */}
          <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center">
            <div className="relative w-64 h-64 rounded-full border-4 border-dashed border-slate-700 flex items-center justify-center">
              <div className="text-center p-3 rounded-full bg-slate-900 border border-slate-800 text-xs">
                <Car className="w-5 h-5 mx-auto text-amber-400 mb-1" />
                <span className="font-semibold text-slate-200">Roundabout</span>
              </div>

              {circularSlots.map((val, idx) => {
                const angle = (idx / circularSlots.length) * 2 * Math.PI - Math.PI / 2;
                const r = 96; // radius
                const x = Math.round(128 + r * Math.cos(angle) - 18);
                const y = Math.round(128 + r * Math.sin(angle) - 18);
                const isActive = idx === circularActiveIdx;

                return (
                  <div
                    key={val}
                    style={{ left: `${x}px`, top: `${y}px` }}
                    className={`absolute w-10 h-10 rounded-full border flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 border-amber-300 ring-4 ring-amber-500/20 scale-110 shadow-lg'
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}
                  >
                    {val}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
