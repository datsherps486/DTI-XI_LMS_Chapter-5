import { LLNode, ListMode } from '../types/linkedList';
import { generateMemoryAddress } from '../utils/topology';

export interface Preset {
  id: string;
  name: string;
  description: string;
  syllabusRef?: string;
  mode: ListMode;
  getNodes: () => { nodes: LLNode[]; headId: string | null };
}

export const PRESETS: Preset[] = [
  {
    id: 'fig51-standard',
    name: 'Figure 5.1: Standard Linked List (10 → 20 → 30 → 40)',
    description: 'Singly linked list with Head pointer and final Null terminator (p. 65).',
    syllabusRef: 'Figure 5.1 (p. 65)',
    mode: 'singly',
    getNodes: () => {
      const n1: LLNode = { id: 'n1', val: 10, nextId: 'n2', x: 40, y: 40, address: generateMemoryAddress(1) };
      const n2: LLNode = { id: 'n2', val: 20, nextId: 'n3', x: 260, y: 40, address: generateMemoryAddress(2) };
      const n3: LLNode = { id: 'n3', val: 30, nextId: 'n4', x: 480, y: 40, address: generateMemoryAddress(3) };
      const n4: LLNode = { id: 'n4', val: 40, nextId: null, x: 700, y: 40, address: generateMemoryAddress(4) };
      return { nodes: [n1, n2, n3, n4], headId: 'n1' };
    },
  },
  {
    id: 'fig56-tasklist',
    name: 'Figure 5.6: Simple Task List (Task 1 → Task 2 → Task 3)',
    description: 'Simple task management sequence ending in Null (p. 66).',
    syllabusRef: 'Figure 5.6 (p. 66)',
    mode: 'singly',
    getNodes: () => {
      const n1: LLNode = { id: 't1', val: 'Task 1', nextId: 't2', x: 40, y: 40, address: generateMemoryAddress(10) };
      const n2: LLNode = { id: 't2', val: 'Task 2', nextId: 't3', x: 270, y: 40, address: generateMemoryAddress(11) };
      const n3: LLNode = { id: 't3', val: 'Task 3', nextId: null, x: 500, y: 40, address: generateMemoryAddress(12) };
      return { nodes: [n1, n2, n3], headId: 't1' };
    },
  },
  {
    id: 'fig57-doubly',
    name: 'Figure 5.7: Doubly Linked List (A ⇄ B ⇄ C)',
    description: 'Bi-directional list with previous and next pointers (p. 67).',
    syllabusRef: 'Figure 5.7 (p. 67)',
    mode: 'doubly',
    getNodes: () => {
      const n1: LLNode = { id: 'd1', val: 'Node A', nextId: 'd2', prevId: null, x: 40, y: 40, address: generateMemoryAddress(20) };
      const n2: LLNode = { id: 'd2', val: 'Node B', nextId: 'd3', prevId: 'd1', x: 270, y: 40, address: generateMemoryAddress(21) };
      const n3: LLNode = { id: 'd3', val: 'Node C', nextId: null, prevId: 'd2', x: 500, y: 40, address: generateMemoryAddress(22) };
      return { nodes: [n1, n2, n3], headId: 'd1' };
    },
  },
  {
    id: 'fig59-circular',
    name: 'Figure 5.9: Circular Linked List (1 → 2 → 3 ↺ 1)',
    description: 'Continuous traversal: last node connects back to first node (p. 67).',
    syllabusRef: 'Figure 5.9 (p. 67)',
    mode: 'circular',
    getNodes: () => {
      const n1: LLNode = { id: 'c1', val: 'Node 1', nextId: 'c2', x: 40, y: 40, address: generateMemoryAddress(30) };
      const n2: LLNode = { id: 'c2', val: 'Node 2', nextId: 'c3', x: 270, y: 40, address: generateMemoryAddress(31) };
      const n3: LLNode = { id: 'c3', val: 'Node 3', nextId: 'c1', x: 500, y: 40, address: generateMemoryAddress(32) };
      return { nodes: [n1, n2, n3], headId: 'c1' };
    },
  },
  {
    id: 'act506-search5',
    name: 'Activity 5.06: Search List (10 → 20 → 30 → 40 → 50)',
    description: 'Syllabus search list for testing linear search and search by position (p. 71).',
    syllabusRef: 'Activity 5.06 (p. 71)',
    mode: 'singly',
    getNodes: () => {
      const n1: LLNode = { id: 's1', val: 10, nextId: 's2', x: 40, y: 40, address: generateMemoryAddress(40) };
      const n2: LLNode = { id: 's2', val: 20, nextId: 's3', x: 250, y: 40, address: generateMemoryAddress(41) };
      const n3: LLNode = { id: 's3', val: 30, nextId: 's4', x: 460, y: 40, address: generateMemoryAddress(42) };
      const n4: LLNode = { id: 's4', val: 40, nextId: 's5', x: 670, y: 40, address: generateMemoryAddress(43) };
      const n5: LLNode = { id: 's5', val: 50, nextId: null, x: 880, y: 40, address: generateMemoryAddress(44) };
      return { nodes: [n1, n2, n3, n4, n5], headId: 's1' };
    },
  },
  {
    id: 'fig520-sorting',
    name: 'Figure 5.20: Unsorted List (45 → 30 → 25 → 15)',
    description: 'Textbook list for sorting by swapping data of nodes (p. 72).',
    syllabusRef: 'Figure 5.20 (p. 72)',
    mode: 'singly',
    getNodes: () => {
      const n1: LLNode = { id: 'sort1', val: 45, nextId: 'sort2', x: 40, y: 40, address: generateMemoryAddress(50) };
      const n2: LLNode = { id: 'sort2', val: 30, nextId: 'sort3', x: 260, y: 40, address: generateMemoryAddress(51) };
      const n3: LLNode = { id: 'sort3', val: 25, nextId: 'sort4', x: 480, y: 40, address: generateMemoryAddress(52) };
      const n4: LLNode = { id: 'sort4', val: 15, nextId: null, x: 700, y: 40, address: generateMemoryAddress(53) };
      return { nodes: [n1, n2, n3, n4], headId: 'sort1' };
    },
  },
];
