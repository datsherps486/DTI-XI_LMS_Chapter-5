import React, { useState } from 'react';
import { soundManager } from '../../utils/audio';
import { ArrowRight, Layers, Cpu, CheckCircle2, XCircle } from 'lucide-react';

export const ComparisonPanel: React.FC = () => {
  const [arrayElements, setArrayElements] = useState([10, 20, 30, 40]);
  const [isInsertingArray, setIsInsertingArray] = useState(false);
  const [listInserted, setListInserted] = useState(false);

  const handleSimulateArrayInsert = () => {
    soundManager.playClick();
    setIsInsertingArray(true);
    setTimeout(() => {
      setArrayElements([99, 10, 20, 30, 40]);
      setIsInsertingArray(false);
      soundManager.playSuccess();
    }, 900);
  };

  const handleResetArray = () => {
    soundManager.playClick();
    setArrayElements([10, 20, 30, 40]);
  };

  const handleSimulateListInsert = () => {
    soundManager.playClick();
    setListInserted(!listInserted);
    soundManager.playConnect();
  };

  return (
    <div className="space-y-6">
      {/* Intro Editorial Description */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 mb-1">
          Array vs. Linked List
        </h2>
        <p className="text-sm text-slate-400">
          Why do linked lists exist? Compare how contiguous memory contrasts with dynamic pointer allocation.
        </p>
      </div>

      {/* Interactive Simulation Sandbox */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dynamic Array Prepend Simulation */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-slate-200">Array (Contiguous Memory)</h3>
            </div>
            <span className="text-xs font-mono font-semibold text-rose-400">Insert Head: O(n)</span>
          </div>

          <p className="text-xs text-slate-400">
            Inserting at the front requires shifting every subsequent element rightward to make space.
          </p>

          {/* Visual Array Cells */}
          <div className="flex items-center gap-1.5 p-3 bg-slate-900/80 rounded-lg border border-slate-800 overflow-x-auto min-h-[64px]">
            {arrayElements.map((val, idx) => (
              <div
                key={`${val}-${idx}`}
                className={`w-12 h-12 rounded border flex flex-col items-center justify-center font-mono transition-all duration-300 ${
                  isInsertingArray
                    ? 'translate-x-3 bg-amber-950/60 border-amber-500/50'
                    : val === 99
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 scale-105'
                    : 'bg-slate-950 border-slate-700 text-slate-200'
                }`}
              >
                <span className="text-[10px] text-slate-400">[{idx}]</span>
                <span className="text-sm font-bold">{val}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateArrayInsert}
              disabled={arrayElements.length > 5 || isInsertingArray}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white rounded text-xs font-medium transition-colors"
            >
              {isInsertingArray ? 'Shifting Elements Right...' : 'Simulate Prepend(99)'}
            </button>
            {arrayElements.length > 4 && (
              <button
                onClick={handleResetArray}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Linked List Prepend Simulation */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-semibold text-slate-200">Linked List (Pointer References)</h3>
            </div>
            <span className="text-xs font-mono font-semibold text-emerald-400">Insert Head: O(1)</span>
          </div>

          <p className="text-xs text-slate-400">
            Inserting at the front only requires allocating one node and reassigning the HEAD pointer!
          </p>

          {/* Visual Linked List Nodes */}
          <div className="flex items-center gap-2 p-3 bg-slate-900/80 rounded-lg border border-slate-800 overflow-x-auto min-h-[64px]">
            {listInserted && (
              <>
                <div className="px-2.5 py-1.5 rounded border border-emerald-400 bg-emerald-950/60 flex items-center gap-1 font-mono text-xs">
                  <span className="text-[10px] text-emerald-400">new</span>
                  <strong className="text-white">99</strong>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              </>
            )}
            <div className="px-2.5 py-1.5 rounded border border-slate-700 bg-slate-950 flex items-center gap-1 font-mono text-xs">
              <strong className="text-slate-200">10</strong>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <div className="px-2.5 py-1.5 rounded border border-slate-700 bg-slate-950 flex items-center gap-1 font-mono text-xs">
              <strong className="text-slate-200">20</strong>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="font-mono text-[11px] text-slate-400">...</span>
          </div>

          <div>
            <button
              onClick={handleSimulateListInsert}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-medium transition-colors"
            >
              {listInserted ? 'Remove Prepended Node' : 'Simulate Prepend(99) in O(1)'}
            </button>
          </div>
        </div>
      </div>

      {/* Big-O Complexity Comparison Table */}
      <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-300 font-semibold">
              <th className="py-2.5 px-4">Operation</th>
              <th className="py-2.5 px-4">Array / Vector</th>
              <th className="py-2.5 px-4">Singly Linked List</th>
              <th className="py-2.5 px-4">Doubly Linked List</th>
              <th className="py-2.5 px-4">Key Takeaway</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono text-slate-300">
            <tr>
              <td className="py-2.5 px-4 font-sans font-medium text-slate-200">Index Access (arr[i])</td>
              <td className="py-2.5 px-4 text-emerald-400 font-bold">O(1)</td>
              <td className="py-2.5 px-4 text-rose-400">O(n)</td>
              <td className="py-2.5 px-4 text-rose-400">O(n)</td>
              <td className="py-2.5 px-4 font-sans text-slate-400">Arrays have direct pointer offset math</td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 font-sans font-medium text-slate-200">Insert / Delete at Head</td>
              <td className="py-2.5 px-4 text-rose-400">O(n)</td>
              <td className="py-2.5 px-4 text-emerald-400 font-bold">O(1)</td>
              <td className="py-2.5 px-4 text-emerald-400 font-bold">O(1)</td>
              <td className="py-2.5 px-4 font-sans text-slate-400">No element shifting required</td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 font-sans font-medium text-slate-200">Insert at Tail</td>
              <td className="py-2.5 px-4 text-emerald-400">O(1) amortized</td>
              <td className="py-2.5 px-4 text-emerald-400">O(1)* with tail ptr</td>
              <td className="py-2.5 px-4 text-emerald-400 font-bold">O(1)</td>
              <td className="py-2.5 px-4 font-sans text-slate-400">Linked list tail pointer enables instant append</td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 font-sans font-medium text-slate-200">Delete at Tail</td>
              <td className="py-2.5 px-4 text-emerald-400 font-bold">O(1)</td>
              <td className="py-2.5 px-4 text-rose-400">O(n)</td>
              <td className="py-2.5 px-4 text-emerald-400 font-bold">O(1)</td>
              <td className="py-2.5 px-4 font-sans text-slate-400">Singly list needs pointer to second-to-last node</td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 font-sans font-medium text-slate-200">Cache Locality & Overhead</td>
              <td className="py-2.5 px-4 text-emerald-400">Excellent (continuous)</td>
              <td className="py-2.5 px-4 text-amber-400">Poor + 8 bytes/ptr</td>
              <td className="py-2.5 px-4 text-amber-400">Poor + 16 bytes/ptr</td>
              <td className="py-2.5 px-4 font-sans text-slate-400">Pointers jump across heap RAM addresses</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
