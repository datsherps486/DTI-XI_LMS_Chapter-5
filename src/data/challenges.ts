import { Challenge, LLNode } from '../types/linkedList';
import { generateMemoryAddress } from '../utils/topology';

export const CHALLENGES: Challenge[] = [
  {
    id: 'ch_act504_roll',
    title: '1. Activity 5.04: Insert Roll Number 12 into Sorted List',
    level: 'Beginner',
    syllabusRef: 'Activity 5.04 Scenario Card 1 (p. 69)',
    description: 'A new learner with roll number 12 joins. Insert node 12 into the sorted list: 5 → 8 → 15 → 20 without shifting elements.',
    instruction: '1. Drag node 12 next port to node 15. 2. Drag node 8 next port to node 12. Sequence should be 5 → 8 → 12 → 15 → 20.',
    hint: 'Adding or removing nodes is fast because only pointers need to be updated, not the entire structure (Figure 5.3).',
    targetExplanation: 'Notice how inserting into a linked list only required updating 2 pointer addresses, completely avoiding shifting array blocks!',
    setup: () => {
      const n1: LLNode = { id: 'r5', val: 5, nextId: 'r8', x: 100, y: 220, address: generateMemoryAddress(5) };
      const n2: LLNode = { id: 'r8', val: 8, nextId: 'r15', x: 280, y: 220, address: generateMemoryAddress(8) };
      const n3: LLNode = { id: 'r15', val: 15, nextId: 'r20', x: 620, y: 220, address: generateMemoryAddress(15) };
      const n4: LLNode = { id: 'r20', val: 20, nextId: null, x: 800, y: 220, address: generateMemoryAddress(20) };
      const newNode: LLNode = { id: 'r12', val: 12, nextId: null, x: 450, y: 100, address: generateMemoryAddress(12), state: 'new' };
      return {
        nodes: [n1, n2, n3, n4, newNode],
        headId: 'r5',
        mode: 'singly',
      };
    },
    validate: (nodes, headId) => {
      if (headId !== 'r5') return false;
      const r5 = nodes.find((n) => n.id === 'r5');
      const r8 = nodes.find((n) => n.id === 'r8');
      const r12 = nodes.find((n) => n.id === 'r12');
      const r15 = nodes.find((n) => n.id === 'r15');
      const r20 = nodes.find((n) => n.id === 'r20');
      return r5?.nextId === 'r8' && r8?.nextId === 'r12' && r12?.nextId === 'r15' && r15?.nextId === 'r20' && r20?.nextId === null;
    },
  },
  {
    id: 'ch_fig513_insert_between',
    title: '2. Figures 5.12–5.14: Insert Node B between Node A and Node C',
    level: 'Beginner',
    syllabusRef: 'Figures 5.12, 5.13, 5.14 (p. 69)',
    description: 'Textbook insertion step-by-step: Place Node B between Node A and Node C.',
    instruction: 'Step 2 rule: "Now Node B point to Node C. And Node A point to Node B." Connect B to C, then A to B.',
    hint: 'Figure 5.13: First make new Node B point to Node C, then make Node A point to Node B.',
    targetExplanation: 'Figures 5.12–5.14 show that updating pointers splices Node B between Node A and Node C without moving other nodes.',
    setup: () => {
      const nodeA: LLNode = { id: 'nodeA', val: 'Node A', nextId: 'nodeC', x: 140, y: 220, address: generateMemoryAddress(1) };
      const nodeC: LLNode = { id: 'nodeC', val: 'Node C', nextId: null, x: 580, y: 220, address: generateMemoryAddress(3) };
      const nodeB: LLNode = { id: 'nodeB', val: 'Node B', nextId: null, x: 360, y: 110, address: generateMemoryAddress(2), state: 'new' };
      return {
        nodes: [nodeA, nodeC, nodeB],
        headId: 'nodeA',
        mode: 'singly',
      };
    },
    validate: (nodes, headId) => {
      if (headId !== 'nodeA') return false;
      const a = nodes.find((n) => n.id === 'nodeA');
      const b = nodes.find((n) => n.id === 'nodeB');
      const c = nodes.find((n) => n.id === 'nodeC');
      return a?.nextId === 'nodeB' && b?.nextId === 'nodeC' && c?.nextId === null;
    },
  },
  {
    id: 'ch_fig516_delete_middle',
    title: '3. Figures 5.15–5.17: Delete Node B from Middle',
    level: 'Intermediate',
    syllabusRef: 'Figures 5.15, 5.16, 5.17 (p. 70)',
    description: 'Delete unwanted Node B by updating surrounding pointers: "Now Node A points to Node C".',
    instruction: 'Connect Node A next pointer directly to Node C, bypassing Node B. Then click the trash icon to delete Node B.',
    hint: 'Figure 5.16: Node A is updated to point directly to Node C. Node B is unlinked.',
    targetExplanation: 'In linked list deletion, bypassing a node only requires updating the previous node\'s pointer!',
    setup: () => {
      const nodeA: LLNode = { id: 'delA', val: 'Node A', nextId: 'delB', x: 140, y: 220, address: generateMemoryAddress(10) };
      const nodeB: LLNode = { id: 'delB', val: 'Node B', nextId: 'delC', x: 380, y: 220, address: generateMemoryAddress(11) };
      const nodeC: LLNode = { id: 'delC', val: 'Node C', nextId: null, x: 620, y: 220, address: generateMemoryAddress(12) };
      return {
        nodes: [nodeA, nodeB, nodeC],
        headId: 'delA',
        mode: 'singly',
      };
    },
    validate: (nodes, headId) => {
      if (headId !== 'delA') return false;
      const a = nodes.find((n) => n.id === 'delA');
      const c = nodes.find((n) => n.id === 'delC');
      const b = nodes.find((n) => n.id === 'delB');
      return a?.nextId === 'delC' && c?.nextId === null && (!b || b.nextId === null);
    },
  },
  {
    id: 'ch_fig509_circular',
    title: '4. Figure 5.9: Form a Circular Linked List',
    level: 'Intermediate',
    syllabusRef: 'Figure 5.9 & Section 5.1 (p. 67)',
    description: 'In a circular linked list, the last node points back to the first node, enabling continuous traversal without encountering NULL.',
    instruction: 'Drag the next pointer of the tail node (Task 3) so that it connects back to the HEAD node (Task 1).',
    hint: 'Traffic roundabouts (Figure 5.33) and round-robin schedulers work like a circular linked list.',
    targetExplanation: 'The circular linked list forms an unbroken loop with no NULL terminator.',
    setup: () => {
      const n1: LLNode = { id: 't1', val: 'Task 1', nextId: 't2', x: 140, y: 220, address: generateMemoryAddress(20) };
      const n2: LLNode = { id: 't2', val: 'Task 2', nextId: 't3', x: 380, y: 220, address: generateMemoryAddress(21) };
      const n3: LLNode = { id: 't3', val: 'Task 3', nextId: null, x: 620, y: 220, address: generateMemoryAddress(22) };
      return {
        nodes: [n1, n2, n3],
        headId: 't1',
        mode: 'circular',
      };
    },
    validate: (nodes, headId, topology) => {
      const t3 = nodes.find((n) => n.id === 't3');
      return t3?.nextId === headId && topology.hasCycle;
    },
  },
  {
    id: 'ch_fig507_doubly',
    title: '5. Figure 5.7: Connect a Doubly Linked List',
    level: 'Advanced',
    syllabusRef: 'Figure 5.7 (p. 67)',
    description: 'Each node contains three parts: Previous pointer, Data, and Next pointer. It allows bi-directional traversal.',
    instruction: 'Switch to Doubly mode and ensure both next and prev pointers link correctly between Song A and Song B.',
    hint: 'Song A.next = Song B, and Song B.prev = Song A. First node prev is NULL, last node next is NULL.',
    targetExplanation: 'Doubly linked lists enable bi-directional navigation (like browser Back and Forward buttons).',
    setup: () => {
      const n1: LLNode = { id: 'sa', val: 'Song A', nextId: null, prevId: null, x: 180, y: 220, address: generateMemoryAddress(30) };
      const n2: LLNode = { id: 'sb', val: 'Song B', nextId: null, prevId: null, x: 500, y: 220, address: generateMemoryAddress(31) };
      return {
        nodes: [n1, n2],
        headId: 'sa',
        mode: 'doubly',
      };
    },
    validate: (nodes, headId, topology) => {
      const a = nodes.find((n) => n.id === 'sa');
      const b = nodes.find((n) => n.id === 'sb');
      return a?.nextId === 'sb' && b?.prevId === 'sa' && a?.prevId === null && b?.nextId === null && topology.isDoublyValid;
    },
  },
  {
    id: 'ch_pq6_insert22',
    title: '6. Practice Question 6: Insert 22 into 10 → 15 → 25 → 30',
    level: 'Intermediate',
    syllabusRef: 'Practice Question 6 (p. 82)',
    description: 'Insert 22 into this sorted list: 10 → 15 → 25 → 30.',
    instruction: 'Place node 22 between node 15 and node 25: 15 points to 22, and 22 points to 25.',
    hint: 'Practice Question 6 solution: Node 22 next points to 25, node 15 next points to 22.',
    targetExplanation: 'Correctly inserted 22! Resulting list is 10 → 15 → 22 → 25 → 30 → NULL.',
    setup: () => {
      const n1: LLNode = { id: 'p10', val: 10, nextId: 'p15', x: 100, y: 220, address: generateMemoryAddress(40) };
      const n2: LLNode = { id: 'p15', val: 15, nextId: 'p25', x: 280, y: 220, address: generateMemoryAddress(41) };
      const n3: LLNode = { id: 'p25', val: 25, nextId: 'p30', x: 620, y: 220, address: generateMemoryAddress(42) };
      const n4: LLNode = { id: 'p30', val: 30, nextId: null, x: 800, y: 220, address: generateMemoryAddress(43) };
      const n22: LLNode = { id: 'p22', val: 22, nextId: null, x: 450, y: 100, address: generateMemoryAddress(44), state: 'new' };
      return {
        nodes: [n1, n2, n3, n4, n22],
        headId: 'p10',
        mode: 'singly',
      };
    },
    validate: (nodes, headId) => {
      if (headId !== 'p10') return false;
      const n10 = nodes.find((n) => n.id === 'p10');
      const n15 = nodes.find((n) => n.id === 'p15');
      const n22 = nodes.find((n) => n.id === 'p22');
      const n25 = nodes.find((n) => n.id === 'p25');
      const n30 = nodes.find((n) => n.id === 'p30');
      return n10?.nextId === 'p15' && n15?.nextId === 'p22' && n22?.nextId === 'p25' && n25?.nextId === 'p30' && n30?.nextId === null;
    },
  },
];
