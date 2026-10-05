import React from 'react';
import { LLNode, ListTopology } from '../../types/linkedList';
import { HardDrive } from 'lucide-react';

interface MemoryHeapPanelProps {
  nodes: LLNode[];
  topology: ListTopology;
  headId: string | null;
}

export const MemoryHeapPanel: React.FC<MemoryHeapPanelProps> = ({
  nodes,
  topology,
  headId,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <HardDrive className="w-4 h-4 text-indigo-400" />
          <h2 className="text-xl font-bold text-slate-100">Simulated Heap Memory Layout</h2>
        </div>
        <p className="text-sm text-slate-400">
          Unlike arrays (which occupy one contiguous slice of RAM), linked list nodes are allocated dynamically anywhere in heap memory. Pointers are simply 64-bit memory addresses storing where to find the next node.
        </p>
      </div>

      {/* Memory Blocks Visualizer */}
      <div className="border border-slate-800 rounded-xl bg-slate-950 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
          <span>Heap Space (Dispersed Allocation)</span>
          <span className="font-mono text-indigo-400">HEAD Register: {headId ? nodes.find((n) => n.id === headId)?.address : '0x0000 (NULL)'}</span>
        </div>

        {nodes.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm">
            Heap is currently empty. Add nodes on the canvas to see heap allocations.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {nodes.map((node) => {
              const isHead = node.id === headId;
              const isTail = node.id === topology.tailId;
              const targetNode = node.nextId ? nodes.find((n) => n.id === node.nextId) : null;

              return (
                <div
                  key={node.id}
                  className={`p-3 rounded-lg border font-mono text-xs ${
                    isHead
                      ? 'border-indigo-500/80 bg-indigo-950/20'
                      : 'border-slate-800 bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-[11px] font-semibold">{node.address}</span>
                    {isHead && (
                      <span className="px-1.5 py-0.2 text-[9px] bg-indigo-500 text-white rounded">
                        HEAD
                      </span>
                    )}
                    {isTail && !isHead && (
                      <span className="px-1.5 py-0.2 text-[9px] bg-emerald-600 text-white rounded">
                        TAIL
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 bg-slate-950/80 p-2 rounded border border-slate-800/80 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">[+0x00] data:</span>
                      <span className="text-slate-100 font-bold">{String(node.val)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">[+0x08] next:</span>
                      <span className={targetNode ? 'text-sky-400 font-bold' : 'text-slate-400'}>
                        {targetNode ? targetNode.address : '0x0000'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
