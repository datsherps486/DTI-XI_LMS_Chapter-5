import React, { useState } from 'react';
import { SupportedLanguage } from '../../types/linkedList';
import { OPERATION_CODE_MAP } from '../../algorithms/linkedListAlgorithms';
import { Copy, Check, Code2 } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface CodeExplanationPanelProps {
  operation: string;
  activeLine: number;
}

export const CodeExplanationPanel: React.FC<CodeExplanationPanelProps> = ({
  operation,
  activeLine,
}) => {
  const [lang, setLang] = useState<SupportedLanguage>('python');
  const [copied, setCopied] = useState(false);

  const opData = OPERATION_CODE_MAP[operation] || OPERATION_CODE_MAP.insertHead;
  const codeLines = opData.code[lang] || [];

  const handleCopy = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(codeLines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full">
      {/* Panel Header */}
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-semibold text-slate-200">{opData.name}</span>
        </div>

        {/* Language Tabs & Copy Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            {(['python', 'cpp', 'ts'] as SupportedLanguage[]).map((l) => (
              <button
                key={l}
                onClick={() => {
                  soundManager.playClick();
                  setLang(l);
                }}
                className={`px-2.5 py-1 rounded font-medium capitalize transition-colors ${
                  lang === l ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {l === 'ts' ? 'TypeScript' : l === 'cpp' ? 'C++' : 'Python'}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            title="Copy code"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Complexity Info Bar */}
      <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span>Time: <strong className="font-mono text-emerald-400 font-semibold">{opData.complexity.time}</strong></span>
          <span className="text-slate-600">·</span>
          <span>Space: <strong className="font-mono text-sky-400 font-semibold">{opData.complexity.space}</strong></span>
        </div>
        {opData.syllabusRef && (
          <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/60 border border-indigo-700/40 px-2 py-0.5 rounded">
            {opData.syllabusRef}
          </span>
        )}
      </div>

      {/* Code Display with active line highlight */}
      <div className="p-3 bg-slate-950 font-mono text-xs overflow-auto flex-1 select-text">
        <div className="table w-full">
          {codeLines.map((line, idx) => {
            const lineNum = idx + 1;
            const isCurrent = lineNum === activeLine;

            return (
              <div
                key={idx}
                className={`table-row transition-colors ${
                  isCurrent
                    ? 'bg-indigo-950/50 text-indigo-200 font-semibold border-l-2 border-indigo-400'
                    : 'text-slate-400 hover:bg-slate-900/60'
                }`}
              >
                <span className="table-cell pr-4 pl-2 py-0.5 text-right select-none text-slate-400 font-mono text-[11px] w-8">
                  {lineNum}
                </span>
                <span className="table-cell py-0.5 pr-2 whitespace-pre">
                  {line}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
