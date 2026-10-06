import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LLNode, ListMode } from '../../types/linkedList';
import {
  SavedListDoc,
  fetchUserSavedLists,
  saveLinkedListToFirestore,
  deleteSavedListFromFirestore,
} from '../../services/firestoreService';
import { soundManager } from '../../utils/audio';
import {
  Cloud,
  X,
  Plus,
  Trash2,
  FolderOpen,
  LogIn,
  Check,
  Loader2,
  Calendar,
  Layers,
} from 'lucide-react';

interface SavedListsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNodes: LLNode[];
  currentHeadId: string | null;
  currentMode: ListMode;
  onLoadList: (savedList: SavedListDoc) => void;
}

export const SavedListsModal: React.FC<SavedListsModalProps> = ({
  isOpen,
  onClose,
  currentNodes,
  currentHeadId,
  currentMode,
  onLoadList,
}) => {
  const { user, signInWithGoogle } = useAuth();
  const [lists, setLists] = useState<SavedListDoc[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [newListName, setNewListName] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      loadLists();
    }
  }, [isOpen, user]);

  const loadLists = async () => {
    if (!user) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchUserSavedLists(user.uid);
      setLists(data);
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage('Failed to load saved lists from cloud.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCurrentList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!newListName.trim()) return;

    setIsSaving(true);
    setErrorMessage(null);
    try {
      soundManager.playClick();
      await saveLinkedListToFirestore(user.uid, {
        name: newListName.trim(),
        mode: currentMode,
        nodes: currentNodes,
        headId: currentHeadId,
      });
      setSaveSuccess(true);
      setNewListName('');
      soundManager.playSuccess();
      await loadLists();
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage('Failed to save list to cloud.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (listId: string) => {
    if (!user) return;
    soundManager.playClick();
    try {
      await deleteSavedListFromFirestore(user.uid, listId);
      setLists((prev) => prev.filter((item) => item.id !== listId));
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage('Failed to delete saved list.');
    }
  };

  const handleLoad = (item: SavedListDoc) => {
    soundManager.playConnect();
    onLoadList(item);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Cloud Saved Lists</h3>
              <p className="text-xs text-slate-400">Save and load your custom linked list configurations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {!user ? (
            <div className="p-6 text-center space-y-4 bg-slate-950/60 border border-slate-800/80 rounded-xl">
              <div className="mx-auto w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Cloud className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-slate-200">Sign in to save to the cloud</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Log in with Google to synchronize your custom linked lists, progress, and practice across sessions.
                </p>
              </div>
              <button
                onClick={async () => {
                  soundManager.playClick();
                  try {
                    await signInWithGoogle();
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign in with Google</span>
              </button>
            </div>
          ) : (
            <>
              {/* Save Current State Form */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Save Current Simulator Canvas
                  </h4>
                  <span className="text-[11px] font-mono text-indigo-400">
                    {currentNodes.length} nodes · {currentMode}
                  </span>
                </div>
                <form onSubmit={handleSaveCurrentList} className="flex gap-2">
                  <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="e.g. My Circular Doubly Linked List"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                    maxLength={80}
                  />
                  <button
                    type="submit"
                    disabled={isSaving || !newListName.trim()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:pointer-events-none rounded-lg transition-colors shrink-0"
                  >
                    {isSaving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : saveSuccess ? (
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                    <span>{saveSuccess ? 'Saved!' : 'Save'}</span>
                  </button>
                </form>
              </div>

              {errorMessage && (
                <div className="p-2.5 text-xs text-rose-300 bg-rose-950/40 border border-rose-800/60 rounded-lg">
                  {errorMessage}
                </div>
              )}

              {/* Saved Lists Collection */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Your Cloud Saved Lists ({lists.length})
                </h4>

                {isLoading ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                    <span className="text-xs">Loading lists from Firestore...</span>
                  </div>
                ) : lists.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                    No saved lists yet. Name and save your current linked list above!
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {lists.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-slate-950/40 border border-slate-800/80 hover:border-slate-700 rounded-xl flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-xs text-slate-200 truncate">
                              {item.name}
                            </span>
                            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                              {item.mode}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Layers className="w-3 h-3 text-slate-400" />
                              {item.nodes.length} nodes
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {new Date(item.updatedAt).toLocaleDateString()}
                            </span>
                            <span className="text-slate-600 truncate max-w-[180px]">
                              {item.nodes.map((n) => n.val).join(' → ')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleLoad(item)}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-300 bg-emerald-950/50 border border-emerald-800/50 hover:bg-emerald-900/60 rounded-lg transition-colors"
                          >
                            <FolderOpen className="w-3 h-3" />
                            <span>Load</span>
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                            title="Delete saved list"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
