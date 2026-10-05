export type ListMode = 'singly' | 'doubly' | 'circular' | 'playground';

export type NodeVisualState =
  | 'default'
  | 'active'
  | 'visiting'
  | 'target'
  | 'new'
  | 'cycle'
  | 'deleted'
  | 'slow'
  | 'fast'
  | 'prev'
  | 'swapping';

export interface LLNode {
  id: string;
  val: number | string;
  nextId: string | null;
  prevId?: string | null; // for doubly linked list
  x: number;
  y: number;
  address: string; // e.g. "0x1A4"
  state?: NodeVisualState;
}

export interface PointerMarker {
  id: string;
  name: string; // 'HEAD' | 'TAIL' | 'current' | 'temp' | 'prev' | 'slow' | 'fast'
  nodeId: string | null;
  color: string;
  bgColor: string;
  label: string;
  offsetY?: number;
}

export type OperationType =
  | 'traverse'
  | 'insertHead'
  | 'insertMiddle'
  | 'insertTail'
  | 'insertIndex'
  | 'deleteHead'
  | 'deleteMiddle'
  | 'deleteTail'
  | 'deleteValue'
  | 'searchValue'
  | 'searchPosition'
  | 'sortDataSwap'
  | 'sortLinks'
  | 'reverse'
  | 'detectCycle';

export interface AlgorithmStep {
  stepIndex: number;
  totalSteps: number;
  title: string;
  description: string;
  codeLine: number;
  nodes: LLNode[];
  pointers: Record<string, string | null>; // pointer name -> nodeId
  headId: string | null;
  tailId: string | null;
  actionType: 'allocate' | 'link' | 'traverse' | 'delete' | 'complete' | 'inspect' | 'swap';
  highlightNodes?: string[];
  highlightEdge?: { from: string; to: string | null; color?: string } | null;
  syllabusReference?: string;
  complexity?: {
    time: string;
    space: string;
  };
}

export interface ListTopology {
  headId: string | null;
  tailId: string | null;
  orderedNodes: LLNode[];
  nodeCount: number;
  hasCycle: boolean;
  cycleStartId: string | null;
  cycleNodeIds: Set<string>;
  detachedNodes: LLNode[];
  isDoublyValid: boolean;
}

export type SupportedLanguage = 'python' | 'cpp' | 'ts';

export interface Challenge {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  instruction: string;
  hint: string;
  targetExplanation: string;
  syllabusRef?: string;
  setup: () => {
    nodes: LLNode[];
    headId: string | null;
    mode: ListMode;
  };
  validate: (nodes: LLNode[], headId: string | null, topology: ListTopology) => boolean;
}

