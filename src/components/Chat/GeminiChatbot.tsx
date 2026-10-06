import React, { useState, useRef, useEffect } from 'react';
import { soundManager } from '../../utils/audio';
import { saveChatSessionToFirestore } from '../../services/firestoreService';
import {
  Bot,
  Send,
  User,
  Sparkles,
  Zap,
  Brain,
  GraduationCap,
  RotateCcw,
  X,
  MessageSquare,
  ChevronDown,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export type BotRole = 'tutor' | 'examiner' | 'hints';

const BOT_ROLES: Record<
  BotRole,
  { name: string; description: string; systemInstruction: string; defaultModel: string; badge: string }
> = {
  tutor: {
    name: 'Class XI DSA Tutor',
    description: 'Patient teacher explaining Chapter 5 concepts with textbook analogies and diagrams',
    defaultModel: 'gemini-3.5-flash',
    badge: 'General Tasks',
    systemInstruction:
      'You are an expert, encouraging teacher specializing in Chapter 5: Algorithm and Data Structure from the Class XI Digital Technology and Innovation curriculum. You teach Linked Lists (Singly, Doubly, Circular), Stacks (LIFO), and Queues (FIFO). Use textbook analogies like music playlists, pile of books, and ticket counters. Explain operations step-by-step with clear pointer manipulation (e.g. node->next = temp). When helpful, provide clean ASCII or text diagrams.',
  },
  examiner: {
    name: 'Algorithm Examiner',
    description: 'Senior DSA examiner analyzing Big-O complexity, proofs, and edge cases',
    defaultModel: 'gemini-3.1-pro-preview',
    badge: 'Complex Reasoning',
    systemInstruction:
      'You are a rigorous Computer Science examiner and algorithm analyst. You evaluate algorithmic efficiency, analyze Big-O time and space complexity O(1) vs O(n), verify tricky edge cases (empty list, single-node lists, cycle detection via Floyd Tortoise & Hare), and provide mathematical justifications for data structure trade-offs.',
  },
  hints: {
    name: 'Quick Hint Assistant',
    description: 'Fast, concise clues to help you solve problems on your own',
    defaultModel: 'gemini-3.1-flash-lite',
    badge: 'Fast Hints',
    systemInstruction:
      'You are a lightning-fast assistant providing brief, targeted clues (1-3 sentences) for linked list operations and challenges without spoiling the final answer. Prioritize immediate, quick responses.',
  },
};

interface GeminiChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string | null;
  savedHistory?: ChatMessage[];
}

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({
  isOpen,
  onClose,
  userId,
  savedHistory,
}) => {
  const [role, setRole] = useState<BotRole>('tutor');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.5-flash');
  const [chatId] = useState<string>(() => 'chat_' + Math.random().toString(36).substring(2, 10));
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return (
      savedHistory || [
        {
          id: 'welcome',
          role: 'model',
          content:
            "Hello! I'm your Gemini AI DSA Tutor for Class XI Chapter 5. Ask me anything about Linked Lists (singly, doubly, circular), pointer rewiring, Big-O complexity, Stacks (LIFO), or Queues (FIFO). What would you like to explore today?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]
    );
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages, isOpen]);

  // Sync model with role default unless manually changed
  const handleRoleChange = (newRole: BotRole) => {
    soundManager.playClick();
    setRole(newRole);
    setSelectedModel(BOT_ROLES[newRole].defaultModel);
    setShowRoleSelect(false);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    soundManager.playClick();
    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Call server-side API proxy /api/chat
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          systemInstruction: BOT_ROLES[role].systemInstruction,
          model: selectedModel,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: 'bot_' + Date.now(),
        role: 'model',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const updated = [...newMessages, botMsg];
      setMessages(updated);
      soundManager.playStep();

      // Persist to Firestore if user is authenticated
      if (userId) {
        saveChatSessionToFirestore(userId, {
          id: chatId,
          title: text.substring(0, 40),
          role,
          model: selectedModel,
          messages: updated,
        }).catch((e) => console.error('Failed to sync chat to Firestore:', e));
      }
    } catch (err: unknown) {
      console.error('Chat error:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      const errorMsg: ChatMessage = {
        id: 'err_' + Date.now(),
        role: 'model',
        content: `Error connecting to Gemini: ${errMsg}. Please check server connection.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
      soundManager.playDisconnect();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    soundManager.playDisconnect();
    setMessages([
      {
        id: 'welcome_' + Date.now(),
        role: 'model',
        content: "Chat history cleared. What topic in Chapter 5 would you like to explore?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const starterQuestions = [
    'Explain why linked lists are not stored in contiguous memory',
    'Walk through inserting Node B between Node A and Node C (Figure 5.12)',
    'What is the difference between linear search and search by position?',
    'How does Floyd’s Tortoise and Hare algorithm detect a cycle?',
    'Solve Practice Question 10: Stack [70, 55, 20] Push 100 then Pop',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl h-[85vh] max-h-[740px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-sm sm:text-base">
                  Gemini DSA Tutor
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-indigo-950/80 border border-indigo-700/40 text-indigo-300 rounded font-semibold">
                  Chapter 5
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Multi-turn AI mentor powered by official Gemini models
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleClearHistory}
              title="Reset conversation"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Role & Model Selector Subheader */}
        <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-xs">
          {/* Role Chooser */}
          <div className="relative">
            <button
              onClick={() => setShowRoleSelect(!showRoleSelect)}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg font-medium text-slate-200 transition-colors"
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              <span>Role: <strong>{BOT_ROLES[role].name}</strong></span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleSelect && (
              <div className="absolute top-full left-0 mt-1 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 space-y-1">
                {(Object.keys(BOT_ROLES) as BotRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                      role === r ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="font-semibold flex items-center justify-between">
                      <span>{BOT_ROLES[r].name}</span>
                      <span className="text-[10px] font-mono opacity-80">{BOT_ROLES[r].badge}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 opacity-90 truncate mt-0.5">
                      {BOT_ROLES[r].description}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Model Selector based on task requirements */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px]">Model:</span>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 font-mono text-[11px]">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setSelectedModel('gemini-3.5-flash');
                }}
                className={`px-2 py-0.5 rounded transition-colors ${
                  selectedModel === 'gemini-3.5-flash'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="General DSA tasks (default)"
              >
                3.5-flash
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setSelectedModel('gemini-3.1-flash-lite');
                }}
                className={`px-2 py-0.5 rounded transition-colors ${
                  selectedModel === 'gemini-3.1-flash-lite'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Fast tasks & quick hints"
              >
                3.1-flash-lite
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setSelectedModel('gemini-3.1-pro-preview');
                }}
                className={`px-2 py-0.5 rounded transition-colors ${
                  selectedModel === 'gemini-3.1-pro-preview'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Complex tasks & deep proofs"
              >
                3.1-pro
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Message Thread */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 font-sans select-text">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 items-start ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                    isUser
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 border border-slate-700 text-indigo-400'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-md'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans leading-relaxed">
                    {m.content}
                  </div>
                  <div
                    className={`flex items-center justify-between gap-3 text-[10px] mt-2 pt-1 border-t ${
                      isUser
                        ? 'border-indigo-500/40 text-indigo-200'
                        : 'border-slate-800/80 text-slate-500'
                    }`}
                  >
                    <span>{m.timestamp}</span>
                    <button
                      onClick={() => copyToClipboard(m.content, m.id)}
                      className="opacity-70 hover:opacity-100 transition-opacity p-0.5 rounded"
                      title="Copy message"
                    >
                      {copiedId === m.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-slate-400">
              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <span className="italic">Gemini is thinking with {selectedModel}...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Prompts if thread is short */}
        {messages.length <= 3 && (
          <div className="px-5 py-2 border-t border-slate-800/80 bg-slate-950/40 overflow-x-auto flex items-center gap-2">
            <span className="text-[11px] text-slate-400 shrink-0">Try asking:</span>
            {starterQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 text-[11px] rounded-full bg-slate-900 border border-slate-800 hover:border-indigo-500/60 text-slate-300 hover:text-white whitespace-nowrap transition-colors shrink-0"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder={`Ask a question as ${BOT_ROLES[role].name}...`}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-900 border border-slate-800 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 transition-colors"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
