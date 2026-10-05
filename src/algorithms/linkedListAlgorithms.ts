import { LLNode, AlgorithmStep, SupportedLanguage } from '../types/linkedList';
import { generateMemoryAddress } from '../utils/topology';

export interface CodeTemplatesMap {
  [key: string]: {
    name: string;
    description: string;
    syllabusRef?: string;
    complexity: { time: string; space: string };
    code: Record<SupportedLanguage, string[]>;
  };
}

export const OPERATION_CODE_MAP: CodeTemplatesMap = {
  traverse: {
    name: 'Traversal Operation',
    syllabusRef: 'Section 5.1 & Figure 5.11 (p. 68)',
    description: 'Iteratively moves current pointer from head through each node until null is encountered. Time complexity: O(n).',
    complexity: { time: 'O(n)', space: 'O(1)' },
    code: {
      python: [
        'def traverse(self):',
        '    # 1. Initialise temporary pointer called current to head',
        '    current = self.head',
        '    # 2. Sequentially advance following next links',
        '    while current is not None:',
        '        print(current.data)',
        '        current = current.next',
        '    # 3. Encountering None signals end of list',
      ],
      cpp: [
        'void traverse() {',
        '    // 1. Initialise current pointer to head',
        '    Node* current = head;',
        '    // 2. Sequentially follow next pointer',
        '    while (current != nullptr) {',
        '        cout << current->data << " ";',
        '        current = current->next;',
        '    }',
        '}',
      ],
      ts: [
        'function traverse(): void {',
        '  // 1. Initialise current pointer to head',
        '  let current = this.head;',
        '  // 2. Advance through each node until null',
        '  while (current !== null) {',
        '    console.log(current.val);',
        '    current = current.next;',
        '  }',
        '}',
      ],
    },
  },
  insertHead: {
    name: 'Insert at Beginning (Head)',
    syllabusRef: 'Section 5.1 (p. 69)',
    description: 'The new node is made to point to the current head, and head is updated to the new node in O(1) time.',
    complexity: { time: 'O(1)', space: 'O(1)' },
    code: {
      python: [
        'def insert_at_beginning(self, val):',
        '    new_node = Node(val)',
        '    # New node points to the current head (first)',
        '    new_node.next = self.head',
        '    # Update head to point to new node',
        '    self.head = new_node',
      ],
      cpp: [
        'void insertAtBeginning(int val) {',
        '    Node* newNode = new Node(val);',
        '    newNode->next = head; // Point to head',
        '    head = newNode;       // Update head',
        '}',
      ],
      ts: [
        'function insertAtBeginning(val: number): void {',
        '  const newNode = new LLNode(val);',
        '  newNode.next = this.head;',
        '  this.head = newNode;',
        '}',
      ],
    },
  },
  insertMiddle: {
    name: 'Insert in Middle (Between Nodes)',
    syllabusRef: 'Figures 5.12, 5.13, 5.14 (p. 69)',
    description: 'Insert Node B between Node A and Node C: Node B points to Node C, then Node A points to Node B.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    code: {
      python: [
        'def insert_between(self, prev_node, val):',
        '    # Step 1: Create Node B',
        '    node_b = Node(val)',
        '    # Step 2: Node B points to Node C (prev.next)',
        '    node_b.next = prev_node.next',
        '    # Step 3: Node A points to Node B',
        '    prev_node.next = node_b',
      ],
      cpp: [
        'void insertBetween(Node* prevNode, int val) {',
        '    Node* nodeB = new Node(val);',
        '    nodeB->next = prevNode->next; // B points to C',
        '    prevNode->next = nodeB;       // A points to B',
        '}',
      ],
      ts: [
        'function insertBetween(prevNode: LLNode, val: number): void {',
        '  const nodeB = new LLNode(val);',
        '  nodeB.next = prevNode.next;',
        '  prevNode.next = nodeB;',
        '}',
      ],
    },
  },
  insertTail: {
    name: 'Insert at End (Tail)',
    syllabusRef: 'Section 5.1 (p. 69)',
    description: 'Traverse to the last node. Make the last node point to the new node, and the new node points to null.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    code: {
      python: [
        'def insert_at_end(self, val):',
        '    new_node = Node(val)',
        '    if not self.head: self.head = new_node; return',
        '    curr = self.head',
        '    while curr.next: curr = curr.next',
        '    # Last node points to new node; new node points to null',
        '    curr.next = new_node',
      ],
      cpp: [
        'void insertAtEnd(int val) {',
        '    Node* newNode = new Node(val);',
        '    if (!head) { head = newNode; return; }',
        '    Node* curr = head;',
        '    while (curr->next != nullptr) curr = curr->next;',
        '    curr->next = newNode; // Last node points to new node',
        '}',
      ],
      ts: [
        'function insertAtEnd(val: number): void {',
        '  const newNode = new LLNode(val);',
        '  if (!this.head) { this.head = newNode; return; }',
        '  let curr = this.head;',
        '  while (curr.next !== null) curr = curr.next;',
        '  curr.next = newNode;',
        '}',
      ],
    },
  },
  insertIndex: {
    name: 'Insert at Specific Position',
    syllabusRef: 'Section 5.1 (p. 69)',
    description: 'Traverse to specific position and splice the new node into the chain.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    code: {
      python: [
        'def insert_at_position(self, pos, val):',
        '    if pos == 1: return self.insert_at_beginning(val)',
        '    new_node = Node(val)',
        '    curr = self.head',
        '    for _ in range(pos - 2): curr = curr.next',
        '    new_node.next = curr.next',
        '    curr.next = new_node',
      ],
      cpp: [
        'void insertAtPosition(int pos, int val) {',
        '    if (pos == 1) { insertAtBeginning(val); return; }',
        '    Node* newNode = new Node(val);',
        '    Node* curr = head;',
        '    for (int i = 0; i < pos - 2; i++) curr = curr->next;',
        '    newNode->next = curr->next;',
        '    curr->next = newNode;',
        '}',
      ],
      ts: [
        'function insertAtPosition(pos: number, val: number): void {',
        '  if (pos === 1) return this.insertAtBeginning(val);',
        '  const newNode = new LLNode(val);',
        '  let curr = this.head;',
        '  for (let i = 0; i < pos - 2; i++) curr = curr.next;',
        '  newNode.next = curr.next;',
        '  curr.next = newNode;',
        '}',
      ],
    },
  },
  deleteHead: {
    name: 'Delete from Beginning (Head)',
    syllabusRef: 'Section 5.1 (p. 70)',
    description: 'Simply direct the head pointer to the second node in the list. First node is removed.',
    complexity: { time: 'O(1)', space: 'O(1)' },
    code: {
      python: [
        'def delete_from_beginning(self):',
        '    if not self.head: return',
        '    # Simply direct the head to the second node in the list',
        '    temp = self.head',
        '    self.head = self.head.next',
        '    del temp',
      ],
      cpp: [
        'void deleteFromBeginning() {',
        '    if (!head) return;',
        '    Node* temp = head;',
        '    head = head->next; // Direct head to second node',
        '    delete temp;',
        '}',
      ],
      ts: [
        'function deleteFromBeginning(): void {',
        '  if (!this.head) return;',
        '  this.head = this.head.next;',
        '}',
      ],
    },
  },
  deleteMiddle: {
    name: 'Delete from Middle (Bypassing Removed Node)',
    syllabusRef: 'Figures 5.15, 5.16, 5.17 (p. 70)',
    description: 'Find previous node A pointing to target node B. Link node A directly to node C, bypassing node B.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    code: {
      python: [
        'def delete_middle(self, prev_node, target_node):',
        '    # Link previous node directly to the node after target',
        '    prev_node.next = target_node.next',
        '    del target_node',
      ],
      cpp: [
        'void deleteMiddle(Node* prevNode, Node* targetNode) {',
        '    // Node A points directly to Node C',
        '    prevNode->next = targetNode->next;',
        '    delete targetNode;',
        '}',
      ],
      ts: [
        'function deleteMiddle(prevNode: LLNode, targetNode: LLNode): void {',
        '  prevNode.next = targetNode.next;',
        '}',
      ],
    },
  },
  deleteTail: {
    name: 'Delete from End (Tail)',
    syllabusRef: 'Section 5.1 (p. 70)',
    description: 'The second-last element is directed to point to null.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    code: {
      python: [
        'def delete_from_end(self):',
        '    if not self.head: return',
        '    if not self.head.next: self.head = None; return',
        '    curr = self.head',
        '    while curr.next.next: curr = curr.next',
        '    # Second-last element directed to point to null',
        '    curr.next = None',
      ],
      cpp: [
        'void deleteFromEnd() {',
        '    if (!head) return;',
        '    if (!head->next) { delete head; head = nullptr; return; }',
        '    Node* curr = head;',
        '    while (curr->next->next) curr = curr->next;',
        '    delete curr->next;',
        '    curr->next = nullptr; // Set second-last next to null',
        '}',
      ],
      ts: [
        'function deleteFromEnd(): void {',
        '  if (!this.head) return;',
        '  if (!this.head.next) { this.head = null; return; }',
        '  let curr = this.head;',
        '  while (curr.next && curr.next.next) curr = curr.next;',
        '  curr.next = null;',
        '}',
      ],
    },
  },
  deleteValue: {
    name: 'Delete by Value',
    syllabusRef: 'Section 5.1 (p. 70)',
    description: 'Locates node by value and bypasses it by updating the previous node pointer.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    code: {
      python: [
        'def delete_value(self, target):',
        '    if not self.head: return',
        '    if self.head.data == target: self.head = self.head.next; return',
        '    curr = self.head',
        '    while curr.next and curr.next.data != target: curr = curr.next',
        '    if curr.next: curr.next = curr.next.next',
      ],
      cpp: [
        'void deleteValue(int target) {',
        '    if (!head) return;',
        '    if (head->data == target) { Node* t = head; head = head->next; delete t; return; }',
        '    Node* curr = head;',
        '    while (curr->next && curr->next->data != target) curr = curr->next;',
        '    if (curr->next) { Node* t = curr->next; curr->next = curr->next->next; delete t; }',
        '}',
      ],
      ts: [
        'function deleteValue(target: number): void {',
        '  if (!this.head) return;',
        '  if (this.head.val === target) { this.head = this.head.next; return; }',
        '  let curr = this.head;',
        '  while (curr.next && curr.next.val !== target) curr = curr.next;',
        '  if (curr.next) curr.next = curr.next.next;',
        '}',
      ],
    },
  },
  searchValue: {
    name: 'Linear Search (Search by Value / Key)',
    syllabusRef: 'Section 5.1 & Figure 5.18 (p. 71)',
    description: 'Each node in the list is visited one by one comparing data with target key until match found.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    code: {
      python: [
        'def linear_search(self, key):',
        '    # Start at the head node',
        '    current = self.head',
        '    while current is not None:',
        '        # Compare node data with target key',
        '        if current.data == key:',
        '            return True # Match found!',
        '        current = current.next',
        '    return False # Reached null, not found',
      ],
      cpp: [
        'bool linearSearch(int key) {',
        '    Node* current = head;',
        '    while (current != nullptr) {',
        '        if (current->data == key) return true; // Match found',
        '        current = current->next;',
        '    }',
        '    return false;',
        '}',
      ],
      ts: [
        'function linearSearch(key: number): boolean {',
        '  let current = this.head;',
        '  while (current !== null) {',
        '    if (current.val === key) return true;',
        '    current = current.next;',
        '  }',
        '  return false;',
        '}',
      ],
    },
  },
  searchPosition: {
    name: 'Search by Position',
    syllabusRef: 'Section 5.1 & Figure 5.19 (p. 71)',
    description: 'Counts nodes sequentially starting from the head until the node at desired position is reached.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    code: {
      python: [
        'def search_by_position(self, target_pos):',
        '    current = self.head',
        '    current_pos = 1',
        '    while current and current_pos < target_pos:',
        '        current = current.next',
        '        current_pos += 1',
        '    return current # Node at desired position',
      ],
      cpp: [
        'Node* searchByPosition(int targetPos) {',
        '    Node* current = head;',
        '    int pos = 1;',
        '    while (current != nullptr && pos < targetPos) {',
        '        current = current->next;',
        '        pos++;',
        '    }',
        '    return current;',
        '}',
      ],
      ts: [
        'function searchByPosition(targetPos: number): LLNode | null {',
        '  let current = this.head;',
        '  let pos = 1;',
        '  while (current !== null && pos < targetPos) {',
        '    current = current.next;',
        '    pos++;',
        '  }',
        '  return current;',
        '}',
      ],
    },
  },
  sortDataSwap: {
    name: 'Sorting by Swapping Data of Nodes',
    syllabusRef: 'Section 5.1 & Figure 5.20 (p. 72)',
    description: 'Compares data in adjacent nodes and swaps values if out of order. Node links (pointers) remain unchanged!',
    complexity: { time: 'O(n²)', space: 'O(1)' },
    code: {
      python: [
        'def sort_by_swapping_data(self):',
        '    # Compares data within two nodes and swaps data',
        '    # Only data values are swapped; node links remain unchanged',
        '    for i in range(length):',
        '        curr = self.head',
        '        while curr.next:',
        '            if curr.data > curr.next.data:',
        '                curr.data, curr.next.data = curr.next.data, curr.data',
        '            curr = curr.next',
      ],
      cpp: [
        'void sortBySwappingData() {',
        '    // Node pointers remain unchanged; only data values swapped',
        '    for (Node* i = head; i != nullptr; i = i->next) {',
        '        for (Node* j = i->next; j != nullptr; j = j->next) {',
        '            if (i->data > j->data) {',
        '                swap(i->data, j->data);',
        '            }',
        '        }',
        '    }',
        '}',
      ],
      ts: [
        'function sortBySwappingData(): void {',
        '  // Swapping node data without altering pointer links',
        '  for (let i = this.head; i !== null; i = i.next) {',
        '    for (let j = i.next; j !== null; j = j.next) {',
        '      if (i.val > j.val) {',
        '        const temp = i.val; i.val = j.val; j.val = temp;',
        '      }',
        '    }',
        '  }',
        '}',
      ],
    },
  },
  reverse: {
    name: 'Reverse Linked List (Iterative)',
    syllabusRef: 'Section 5.1 Doubly/Singly Reversal Concept',
    description: 'Inverts direction of all pointers using 3 pointers: prev, current, and next.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    code: {
      python: [
        'def reverse(self):',
        '    prev = None',
        '    curr = self.head',
        '    while curr:',
        '        next_node = curr.next',
        '        curr.next = prev',
        '        prev = curr',
        '        curr = next_node',
        '    self.head = prev',
      ],
      cpp: [
        'void reverse() {',
        '    Node* prev = nullptr;',
        '    Node* curr = head;',
        '    while (curr != nullptr) {',
        '        Node* nextNode = curr->next;',
        '        curr->next = prev;',
        '        prev = curr;',
        '        curr = nextNode;',
        '    }',
        '    head = prev;',
        '}',
      ],
      ts: [
        'function reverse(): void {',
        '  let prev = null;',
        '  let curr = this.head;',
        '  while (curr !== null) {',
        '    const nextNode = curr.next;',
        '    curr.next = prev;',
        '    prev = curr;',
        '    curr = nextNode;',
        '  }',
        '  this.head = prev;',
        '}',
      ],
    },
  },
  detectCycle: {
    name: "Floyd's Tortoise and Hare (Cycle Detection)",
    syllabusRef: 'Section 5.1 Circular Linked List & Cycle Concept (p. 67)',
    description: 'Uses slow pointer (1 step) and fast pointer (2 steps) to detect loops in O(n) time.',
    complexity: { time: 'O(n)', space: 'O(1)' },
    code: {
      python: [
        'def has_cycle(head):',
        '    slow = head',
        '    fast = head',
        '    while fast and fast.next:',
        '        slow = slow.next',
        '        fast = fast.next.next',
        '        if slow == fast: return True # Cycle loop detected',
        '    return False',
      ],
      cpp: [
        'bool hasCycle(Node* head) {',
        '    Node* slow = head;',
        '    Node* fast = head;',
        '    while (fast && fast->next) {',
        '        slow = slow->next;',
        '        fast = fast->next->next;',
        '        if (slow == fast) return true;',
        '    }',
        '    return false;',
        '}',
      ],
      ts: [
        'function hasCycle(head: LLNode | null): boolean {',
        '  let slow = head;',
        '  let fast = head;',
        '  while (fast && fast.next) {',
        '    slow = slow.next;',
        '    fast = fast.next.next;',
        '    if (slow === fast) return true;',
        '  }',
        '  return false;',
        '}',
      ],
    },
  },
};

function cloneNodes(nodes: LLNode[]): LLNode[] {
  return nodes.map((n) => ({ ...n }));
}

function getChain(nodes: LLNode[], headId: string | null): LLNode[] {
  const map = new Map<string, LLNode>();
  nodes.forEach((n) => map.set(n.id, n));
  const chain: LLNode[] = [];
  const visited = new Set<string>();
  let curr = headId;
  while (curr && map.has(curr) && !visited.has(curr)) {
    visited.add(curr);
    const node: LLNode = map.get(curr)!;
    chain.push(node);
    curr = node.nextId;
  }
  return chain;
}

/**
 * Traversal Operation (Figure 5.11, p. 68)
 * Traversal begins by initialising a temporary pointer, often called current,
 * to the first node (head). Step 1 through Step n sequentially advances current.
 */
export function generateTraversalSteps(
  initialNodes: LLNode[],
  headId: string | null
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const nodes = cloneNodes(initialNodes);
  const chain = getChain(nodes, headId);

  if (chain.length === 0) {
    return [
      {
        stepIndex: 1,
        totalSteps: 1,
        title: 'Empty List Traversal',
        description: 'The list is empty (head = NULL). Traversal terminates immediately.',
        codeLine: 1,
        nodes,
        pointers: { HEAD: null, current: null },
        headId: null,
        tailId: null,
        actionType: 'complete',
        syllabusReference: 'Section 5.1 (p. 68)',
      },
    ];
  }

  // Step 1: Initialise current pointer to head
  steps.push({
    stepIndex: 1,
    totalSteps: chain.length + 1,
    title: 'Initialise Current Pointer at Head',
    description: `Traversal begins by initialising a temporary pointer, called current, to the first node (Head: ${chain[0].val}).`,
    codeLine: 3,
    nodes: nodes.map((n) => (n.id === chain[0].id ? { ...n, state: 'visiting' as const } : n)),
    pointers: { HEAD: headId, current: chain[0].id },
    headId,
    tailId: chain[chain.length - 1].id,
    actionType: 'inspect',
    syllabusReference: 'Figure 5.11: Step 1 (p. 68)',
  });

  // Steps 2..n: Sequentially advance current
  for (let i = 0; i < chain.length; i++) {
    const node = chain[i];
    const nextNode = chain[i + 1];

    if (i > 0) {
      steps.push({
        stepIndex: i + 1,
        totalSteps: chain.length + 1,
        title: `Advance Current to Node #${i + 1} (${node.val})`,
        description: `Current pointer advances sequentially by following the next link stored within the current node. Visiting node ${node.val} (${node.address}).`,
        codeLine: 6,
        nodes: nodes.map((n) => (n.id === node.id ? { ...n, state: 'visiting' as const } : n)),
        pointers: { HEAD: headId, current: node.id },
        headId,
        tailId: chain[chain.length - 1].id,
        actionType: 'traverse',
        syllabusReference: `Figure 5.11: Step ${i + 1} (p. 68)`,
      });
    }
  }

  // Final step: Current encounters NULL
  steps.push({
    stepIndex: chain.length + 1,
    totalSteps: chain.length + 1,
    title: 'Current Encounters NULL: Traversal Complete',
    description: `Current pointer reached the final node's next pointer, which contains NULL. This signals the end of the list and terminates traversal. Total elements visited: ${chain.length}.`,
    codeLine: 7,
    nodes: nodes.map((n) => ({ ...n, state: 'default' as const })),
    pointers: { HEAD: headId, current: null },
    headId,
    tailId: chain[chain.length - 1].id,
    actionType: 'complete',
    syllabusReference: 'Figure 5.11: Traversal termination (p. 68)',
  });

  return steps;
}

/**
 * Insertion in Middle (Figures 5.12, 5.13, 5.14, p. 69)
 * Step-by-step process of inserting Node B between Node A and Node C.
 */
export function generateInsertMiddleSteps(
  initialNodes: LLNode[],
  headId: string | null,
  val: number | string = 'B'
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const nodes = cloneNodes(initialNodes);
  const chain = getChain(nodes, headId);

  if (chain.length < 2) {
    return generateInsertTailSteps(initialNodes, headId, val);
  }

  const nodeA = chain[0];
  const nodeC = chain[1];

  const newNodeId = 'node_' + Math.random().toString(36).substring(2, 9);
  const newNodeAddress = generateMemoryAddress();

  const nodeB: LLNode = {
    id: newNodeId,
    val,
    nextId: null,
    x: (nodeA.x + nodeC.x) / 2,
    y: nodeA.y - 110,
    address: newNodeAddress,
    state: 'new',
  };

  // Figure 5.12: Insertion operation (Step 1)
  const step1Nodes = [...cloneNodes(nodes), { ...nodeB }];
  steps.push({
    stepIndex: 1,
    totalSteps: 3,
    title: 'Figure 5.12: Insertion Operation (Step 1)',
    description: `A new node B (value ${val}) is allocated at address ${newNodeAddress} to be inserted between Node A (${nodeA.val}) and Node C (${nodeC.val}).`,
    codeLine: 3,
    nodes: step1Nodes,
    pointers: { HEAD: headId, 'Node B': newNodeId },
    headId,
    tailId: chain[chain.length - 1].id,
    actionType: 'allocate',
    syllabusReference: 'Figure 5.12 (p. 69)',
  });

  // Figure 5.13: Insertion operation (Step 2)
  // "Now Node B point to Node C. And Node A point to Node B"
  const step2Nodes = step1Nodes.map((n) => {
    if (n.id === newNodeId) return { ...n, nextId: nodeC.id };
    if (n.id === nodeA.id) return { ...n, nextId: newNodeId };
    return n;
  });

  steps.push({
    stepIndex: 2,
    totalSteps: 3,
    title: 'Figure 5.13: Insertion Operation (Step 2)',
    description: `Now Node B points to Node C (Node B.next = Node C). And Node A points to Node B (Node A.next = Node B).`,
    codeLine: 5,
    nodes: step2Nodes,
    pointers: { HEAD: headId, 'Node B': newNodeId },
    headId,
    tailId: chain[chain.length - 1].id,
    actionType: 'link',
    highlightEdge: { from: newNodeId, to: nodeC.id, color: '#38bdf8' },
    syllabusReference: 'Figure 5.13 (p. 69)',
  });

  // Figure 5.14: Insertion operation (Step 3)
  // "New Node B is placed between Node A and Node C"
  const step3Nodes = step2Nodes.map((n) => {
    if (n.id === newNodeId) {
      return { ...n, y: nodeA.y, state: 'default' as const };
    }
    if (n.x > nodeA.x) {
      return { ...n, x: n.x + 160 };
    }
    return n;
  });

  steps.push({
    stepIndex: 3,
    totalSteps: 3,
    title: 'Figure 5.14: Insertion Operation (Step 3)',
    description: `New Node B is smoothly placed between Node A and Node C without shifting elements in memory!`,
    codeLine: 6,
    nodes: step3Nodes,
    pointers: { HEAD: headId },
    headId,
    tailId: chain[chain.length - 1].id,
    actionType: 'complete',
    syllabusReference: 'Figure 5.14 (p. 69)',
  });

  return steps;
}

/**
 * Deletion in Middle (Figures 5.15, 5.16, 5.17, p. 70)
 * Delete Node B from the list. Node A points directly to Node C.
 */
export function generateDeleteMiddleSteps(
  initialNodes: LLNode[],
  headId: string | null
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const nodes = cloneNodes(initialNodes);
  const chain = getChain(nodes, headId);

  if (chain.length < 3) {
    return generateDeleteHeadSteps(initialNodes, headId);
  }

  const nodeA = chain[0];
  const nodeB = chain[1];
  const nodeC = chain[2];

  // Figure 5.15: Deletion operation (Step 1)
  // "Locate node to remove (Node B) and previous node (Node A)"
  steps.push({
    stepIndex: 1,
    totalSteps: 3,
    title: 'Figure 5.15: Deletion Operation (Step 1)',
    description: `Locate the node that you want to remove (Node B: ${nodeB.val}) and find the previous node (Node A: ${nodeA.val}) that points to this target node.`,
    codeLine: 1,
    nodes: nodes.map((n) => (n.id === nodeB.id ? { ...n, state: 'target' as const } : n)),
    pointers: { HEAD: headId, 'Node A': nodeA.id, 'Node B': nodeB.id },
    headId,
    tailId: chain[chain.length - 1].id,
    actionType: 'inspect',
    syllabusReference: 'Figure 5.15 (p. 70)',
  });

  // Figure 5.16: Deletion operation (Step 2)
  // "Now Node A points to Node C"
  const step2Nodes = nodes.map((n) => {
    if (n.id === nodeA.id) return { ...n, nextId: nodeC.id };
    if (n.id === nodeB.id) return { ...n, state: 'deleted' as const, y: n.y + 70 };
    return n;
  });

  steps.push({
    stepIndex: 2,
    totalSteps: 3,
    title: 'Figure 5.16: Deletion Operation (Step 2)',
    description: `Now Node A points to Node C (Node A.next = Node C). The unwanted Node B is bypassed.`,
    codeLine: 3,
    nodes: step2Nodes,
    pointers: { HEAD: headId, 'Node A': nodeA.id },
    headId,
    tailId: chain[chain.length - 1].id,
    actionType: 'link',
    highlightEdge: { from: nodeA.id, to: nodeC.id, color: '#f59e0b' },
    syllabusReference: 'Figure 5.16 (p. 70)',
  });

  // Figure 5.17: Deletion operation (Step 3)
  // "Removed Node B"
  const finalNodes = step2Nodes
    .filter((n) => n.id !== nodeB.id)
    .map((n, idx) => ({ ...n, x: 120 + idx * 220, state: 'default' as const }));

  steps.push({
    stepIndex: 3,
    totalSteps: 3,
    title: 'Figure 5.17: Deletion Operation (Step 3)',
    description: `Removed Node B. Memory is freed, keeping the list dynamic and memory efficient.`,
    codeLine: 4,
    nodes: finalNodes,
    pointers: { HEAD: headId },
    headId,
    tailId: finalNodes[finalNodes.length - 1].id,
    actionType: 'complete',
    syllabusReference: 'Figure 5.17 (p. 70)',
  });

  return steps;
}

/**
 * Search by Position (Figure 5.19, p. 71)
 * The search involves counting nodes sequentially, starting from the head,
 * until the node at the desired position is reached.
 */
export function generateSearchByPositionSteps(
  initialNodes: LLNode[],
  headId: string | null,
  targetPos: number = 3
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const nodes = cloneNodes(initialNodes);
  const chain = getChain(nodes, headId);

  if (chain.length === 0) {
    return [
      {
        stepIndex: 1,
        totalSteps: 1,
        title: 'Empty List',
        description: 'Cannot search by position in an empty list.',
        codeLine: 1,
        nodes,
        pointers: {},
        headId: null,
        tailId: null,
        actionType: 'complete',
        syllabusReference: 'Figure 5.19 (p. 71)',
      },
    ];
  }

  const effectivePos = Math.max(1, Math.min(chain.length, targetPos));

  for (let i = 0; i < effectivePos; i++) {
    const node = chain[i];
    const isTarget = i === effectivePos - 1;

    steps.push({
      stepIndex: i + 1,
      totalSteps: effectivePos,
      title: isTarget ? `Reached Position #${i + 1}` : `Counting Position #${i + 1}`,
      description: isTarget
        ? `Found element at position ${i + 1}: value is "${node.val}" (${node.address}). Search by position complete!`
        : `At position ${i + 1} (value: ${node.val}). Target position is ${effectivePos}. Advancing to next node.`,
      codeLine: isTarget ? 6 : 4,
      nodes: nodes.map((n) => ({
        ...n,
        state: n.id === node.id ? (isTarget ? ('target' as const) : ('visiting' as const)) : ('default' as const),
      })),
      pointers: { HEAD: headId, current: node.id },
      headId,
      tailId: chain[chain.length - 1].id,
      actionType: isTarget ? 'complete' : 'traverse',
      syllabusReference: `Figure 5.19: Search at Position ${effectivePos} (p. 71)`,
    });
  }

  return steps;
}

/**
 * Sorting by Swapping Data of Nodes (Figure 5.20, p. 72)
 * Compares data within two nodes and swaps the data if not in desired order.
 * Only data values are swapped, leaving node links (pointers) unchanged.
 */
export function generateSortDataSwapSteps(
  initialNodes: LLNode[],
  headId: string | null
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let currentNodes = cloneNodes(initialNodes);
  const chain = getChain(currentNodes, headId);

  if (chain.length <= 1) {
    return [
      {
        stepIndex: 1,
        totalSteps: 1,
        title: 'Already Sorted',
        description: 'List has 1 or fewer elements. No sorting required.',
        codeLine: 1,
        nodes: currentNodes,
        pointers: { HEAD: headId },
        headId,
        tailId: headId,
        actionType: 'complete',
        syllabusReference: 'Figure 5.20 (p. 72)',
      },
    ];
  }

  // Initial step: Before Sorting
  steps.push({
    stepIndex: 1,
    totalSteps: 10,
    title: 'Figure 5.20: Before Sorting',
    description: 'Starting sort by swapping data of nodes. Note that node links (pointers) will remain unchanged; only data values are swapped.',
    codeLine: 2,
    nodes: cloneNodes(currentNodes),
    pointers: { HEAD: headId },
    headId,
    tailId: chain[chain.length - 1].id,
    actionType: 'inspect',
    syllabusReference: 'Figure 5.20: Before Sorting (p. 72)',
  });

  const ids = chain.map((n) => n.id);
  let stepIndex = 2;

  for (let i = 0; i < ids.length; i++) {
    for (let j = 0; j < ids.length - 1 - i; j++) {
      const idA = ids[j];
      const idB = ids[j + 1];
      const nodeA = currentNodes.find((n) => n.id === idA)!;
      const nodeB = currentNodes.find((n) => n.id === idB)!;

      const numA = Number(nodeA.val) || 0;
      const numB = Number(nodeB.val) || 0;

      if (numA > numB) {
        // Step comparing
        steps.push({
          stepIndex: stepIndex++,
          totalSteps: 10,
          title: `Compare: ${nodeA.val} & ${nodeB.val} → Swap Needed`,
          description: `${nodeA.val} > ${nodeB.val}. Swapping data values (${nodeA.val} ↔ ${nodeB.val}). Pointer links remain unchanged!`,
          codeLine: 7,
          nodes: cloneNodes(currentNodes).map((n) => ({
            ...n,
            state: n.id === idA || n.id === idB ? ('swapping' as const) : ('default' as const),
          })),
          pointers: { HEAD: headId, 'node A': idA, 'node B': idB },
          headId,
          tailId: chain[chain.length - 1].id,
          actionType: 'swap',
          syllabusReference: 'Figure 5.20: Sorting passes (p. 72)',
        });

        // Perform value swap
        currentNodes = currentNodes.map((n) => {
          if (n.id === idA) return { ...n, val: nodeB.val };
          if (n.id === idB) return { ...n, val: nodeA.val };
          return n;
        });
      }
    }
  }

  // Final step: Final Sorting
  steps.push({
    stepIndex: stepIndex,
    totalSteps: stepIndex,
    title: 'Figure 5.20: Final Sorting Complete',
    description: 'All elements sorted in ascending order. Every pointer link remained exactly in place!',
    codeLine: 8,
    nodes: currentNodes.map((n) => ({ ...n, state: 'default' as const })),
    pointers: { HEAD: headId },
    headId,
    tailId: chain[chain.length - 1].id,
    actionType: 'complete',
    syllabusReference: 'Figure 5.20: Final Sorting (p. 72)',
  });

  const total = steps.length;
  steps.forEach((s) => (s.totalSteps = total));
  return steps;
}

/**
 * Insert at Head (Beginning)
 */
export function generateInsertHeadSteps(
  initialNodes: LLNode[],
  headId: string | null,
  val: number | string
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const nodes = cloneNodes(initialNodes);
  const chain = getChain(nodes, headId);

  const firstNode = chain[0];
  const newX = firstNode ? firstNode.x - 140 : 120;
  const newY = firstNode ? firstNode.y - 120 : 200;

  const newNodeId = 'node_' + Math.random().toString(36).substring(2, 9);
  const newAddress = generateMemoryAddress();

  const newNode: LLNode = {
    id: newNodeId,
    val,
    nextId: null,
    x: newX,
    y: newY,
    address: newAddress,
    state: 'new',
  };

  const step1Nodes = [...cloneNodes(nodes), { ...newNode }];
  steps.push({
    stepIndex: 1,
    totalSteps: 3,
    title: '1. Allocate New Node',
    description: `Allocated new node in heap memory at address ${newAddress} with value ${val}. Next pointer is NULL.`,
    codeLine: 2,
    nodes: step1Nodes,
    pointers: { HEAD: headId, new_node: newNodeId },
    headId,
    tailId: chain[chain.length - 1]?.id || null,
    actionType: 'allocate',
    syllabusReference: 'Section 5.1: Insertion at Beginning (p. 69)',
  });

  const step2Nodes = step1Nodes.map((n) => (n.id === newNodeId ? { ...n, nextId: headId } : n));
  steps.push({
    stepIndex: 2,
    totalSteps: 3,
    title: '2. Connect Pointer to Current Head',
    description: `To insert a node at the beginning of the list, the new node should point to the head (first).`,
    codeLine: 4,
    nodes: step2Nodes,
    pointers: { HEAD: headId, new_node: newNodeId },
    headId,
    tailId: chain[chain.length - 1]?.id || null,
    actionType: 'link',
    highlightEdge: { from: newNodeId, to: headId, color: '#38bdf8' },
    syllabusReference: 'Section 5.1: Insertion at Beginning (p. 69)',
  });

  const step3Nodes = step2Nodes.map((n) => {
    if (n.id === newNodeId) {
      return {
        ...n,
        state: 'default' as const,
        x: firstNode ? firstNode.x : 100,
        y: firstNode ? firstNode.y : 200,
      };
    }
    return { ...n, x: n.x + 200 };
  });

  steps.push({
    stepIndex: 3,
    totalSteps: 3,
    title: '3. Update HEAD Pointer',
    description: `Reassigned HEAD pointer to the new node. Insertion at beginning complete in O(1) time without shifting elements!`,
    codeLine: 6,
    nodes: step3Nodes,
    pointers: { HEAD: newNodeId },
    headId: newNodeId,
    tailId: chain[chain.length - 1]?.id || newNodeId,
    actionType: 'complete',
    syllabusReference: 'Section 5.1: Insertion at Beginning (p. 69)',
  });

  return steps;
}

/**
 * Insert at Tail (End)
 */
export function generateInsertTailSteps(
  initialNodes: LLNode[],
  headId: string | null,
  val: number | string
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const nodes = cloneNodes(initialNodes);
  const chain = getChain(nodes, headId);

  if (chain.length === 0) {
    return generateInsertHeadSteps(initialNodes, headId, val);
  }

  const lastNode = chain[chain.length - 1];
  const newNodeId = 'node_' + Math.random().toString(36).substring(2, 9);
  const newAddress = generateMemoryAddress();

  const newNode: LLNode = {
    id: newNodeId,
    val,
    nextId: null,
    x: lastNode.x + 220,
    y: lastNode.y - 100,
    address: newAddress,
    state: 'new',
  };

  const step1Nodes = [...cloneNodes(nodes), { ...newNode }];
  steps.push({
    stepIndex: 1,
    totalSteps: 3 + chain.length,
    title: '1. Allocate New Node',
    description: `Created new node with value ${val} at address ${newAddress}.`,
    codeLine: 1,
    nodes: step1Nodes,
    pointers: { HEAD: headId, new_node: newNodeId },
    headId,
    tailId: lastNode.id,
    actionType: 'allocate',
    syllabusReference: 'Section 5.1: Insertion at End (p. 69)',
  });

  for (let i = 0; i < chain.length; i++) {
    const curr = chain[i];
    const isTail = i === chain.length - 1;
    steps.push({
      stepIndex: 2 + i,
      totalSteps: 3 + chain.length,
      title: `Traverse to End (current = ${curr.val})`,
      description: isTail
        ? `Reached the last node (${curr.val}). Its next pointer contains NULL.`
        : `Advancing pointer toward the end of the list.`,
      codeLine: isTail ? 7 : 6,
      nodes: step1Nodes.map((n) => ({
        ...n,
        state: n.id === curr.id ? ('visiting' as const) : n.id === newNodeId ? ('new' as const) : ('default' as const),
      })),
      pointers: { HEAD: headId, current: curr.id, new_node: newNodeId },
      headId,
      tailId: lastNode.id,
      actionType: 'traverse',
      syllabusReference: 'Section 5.1: Insertion at End (p. 69)',
    });
  }

  const stepLinkNodes = step1Nodes.map((n) => {
    if (n.id === lastNode.id) return { ...n, nextId: newNodeId };
    return n;
  });

  steps.push({
    stepIndex: 2 + chain.length,
    totalSteps: 3 + chain.length,
    title: 'Connect Last Node to New Node',
    description: `The last node is made to point to the new node, and the new node points to NULL.`,
    codeLine: 8,
    nodes: stepLinkNodes,
    pointers: { HEAD: headId, current: lastNode.id, new_node: newNodeId },
    headId,
    tailId: newNodeId,
    actionType: 'link',
    highlightEdge: { from: lastNode.id, to: newNodeId, color: '#38bdf8' },
    syllabusReference: 'Section 5.1: Insertion at End (p. 69)',
  });

  const finalNodes = stepLinkNodes.map((n) => {
    if (n.id === newNodeId) return { ...n, y: lastNode.y, state: 'default' as const };
    return { ...n, state: 'default' as const };
  });

  steps.push({
    stepIndex: 3 + chain.length,
    totalSteps: 3 + chain.length,
    title: 'Insertion at End Complete',
    description: `Successfully appended node ${val} to the end of the list.`,
    codeLine: 8,
    nodes: finalNodes,
    pointers: { HEAD: headId, TAIL: newNodeId },
    headId,
    tailId: newNodeId,
    actionType: 'complete',
    syllabusReference: 'Section 5.1: Insertion at End (p. 69)',
  });

  return steps;
}

/**
 * Delete Head (Beginning)
 */
export function generateDeleteHeadSteps(
  initialNodes: LLNode[],
  headId: string | null
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const nodes = cloneNodes(initialNodes);
  const chain = getChain(nodes, headId);

  if (!headId || chain.length === 0) {
    return [
      {
        stepIndex: 1,
        totalSteps: 1,
        title: 'Empty List',
        description: 'List is already empty. Nothing to delete.',
        codeLine: 1,
        nodes,
        pointers: {},
        headId: null,
        tailId: null,
        actionType: 'complete',
        syllabusReference: 'Section 5.1: Deletion at Beginning (p. 70)',
      },
    ];
  }

  const oldHead = chain[0];
  const nextHeadId = oldHead.nextId;

  steps.push({
    stepIndex: 1,
    totalSteps: 3,
    title: '1. Store Reference to First Node',
    description: `To delete a node from the beginning, first reference node ${oldHead.val}.`,
    codeLine: 2,
    nodes: nodes.map((n) => (n.id === oldHead.id ? { ...n, state: 'target' as const } : n)),
    pointers: { HEAD: headId, temp: oldHead.id },
    headId,
    tailId: chain[chain.length - 1].id,
    actionType: 'inspect',
    syllabusReference: 'Section 5.1: Deletion at Beginning (p. 70)',
  });

  steps.push({
    stepIndex: 2,
    totalSteps: 3,
    title: '2. Direct Head to Second Node',
    description: `Simply direct the head to the second node in the list.`,
    codeLine: 3,
    nodes: nodes.map((n) => (n.id === oldHead.id ? { ...n, state: 'deleted' as const } : n)),
    pointers: { HEAD: nextHeadId, temp: oldHead.id },
    headId: nextHeadId,
    tailId: chain[chain.length - 1].id,
    actionType: 'link',
    syllabusReference: 'Section 5.1: Deletion at Beginning (p. 70)',
  });

  const finalNodes = nodes.filter((n) => n.id !== oldHead.id);
  const shiftedNodes = finalNodes.map((n) => ({
    ...n,
    x: Math.max(80, n.x - 180),
    state: 'default' as const,
  }));

  steps.push({
    stepIndex: 3,
    totalSteps: 3,
    title: '3. Memory Deallocated',
    description: `Freed memory for node at ${oldHead.address}. First element removed in O(1) time!`,
    codeLine: 4,
    nodes: shiftedNodes,
    pointers: { HEAD: nextHeadId },
    headId: nextHeadId,
    tailId: shiftedNodes.length > 0 ? shiftedNodes[shiftedNodes.length - 1].id : null,
    actionType: 'complete',
    syllabusReference: 'Section 5.1: Deletion at Beginning (p. 70)',
  });

  return steps;
}

/**
 * Linear Search by Value / Key (Figure 5.18, p. 71)
 */
export function generateSearchSteps(
  initialNodes: LLNode[],
  headId: string | null,
  targetVal: number | string
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const nodes = cloneNodes(initialNodes);
  const chain = getChain(nodes, headId);

  if (chain.length === 0) {
    return [
      {
        stepIndex: 1,
        totalSteps: 1,
        title: 'Empty List',
        description: 'Cannot search an empty list.',
        codeLine: 1,
        nodes,
        pointers: {},
        headId: null,
        tailId: null,
        actionType: 'complete',
        syllabusReference: 'Figure 5.18 (p. 71)',
      },
    ];
  }

  let found = false;
  const total = chain.length + 1;

  for (let i = 0; i < chain.length; i++) {
    const curr = chain[i];
    const isMatch = String(curr.val).trim() === String(targetVal).trim();

    steps.push({
      stepIndex: i + 1,
      totalSteps: total,
      title: isMatch ? `Match Found at Node #${i + 1}!` : `Compare with Key ${targetVal}`,
      description: isMatch
        ? `Start at the head node and compare... Match found at node with value ${curr.val}! Search terminates.`
        : `Start at head node and compare with ${curr.val} — no match found. Move to the next node.`,
      codeLine: isMatch ? 5 : 6,
      nodes: nodes.map((n) => ({
        ...n,
        state: n.id === curr.id ? (isMatch ? ('target' as const) : ('visiting' as const)) : ('default' as const),
      })),
      pointers: { HEAD: headId, current: curr.id },
      headId,
      tailId: chain[chain.length - 1].id,
      actionType: isMatch ? 'complete' : 'traverse',
      highlightNodes: [curr.id],
      syllabusReference: 'Figure 5.18: Linear Search (p. 71)',
    });

    if (isMatch) {
      found = true;
      break;
    }
  }

  if (!found) {
    steps.push({
      stepIndex: chain.length + 1,
      totalSteps: chain.length + 1,
      title: 'Key Not Found in List',
      description: `Reached NULL pointer. Value ${targetVal} is not present in the linked list.`,
      codeLine: 8,
      nodes: nodes.map((n) => ({ ...n, state: 'default' as const })),
      pointers: { HEAD: headId, current: null },
      headId,
      tailId: chain[chain.length - 1].id,
      actionType: 'complete',
      syllabusReference: 'Figure 5.18: Search non-existing value (p. 71)',
    });
  }

  return steps;
}

/**
 * Reverse Linked List
 */
export function generateReverseSteps(
  initialNodes: LLNode[],
  headId: string | null
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  let currentNodes = cloneNodes(initialNodes);
  const chain = getChain(currentNodes, headId);

  if (chain.length <= 1) {
    return [
      {
        stepIndex: 1,
        totalSteps: 1,
        title: 'Already Reversed',
        description: 'List has 1 or fewer elements; reverse is a no-op.',
        codeLine: 1,
        nodes: currentNodes,
        pointers: { HEAD: headId },
        headId,
        tailId: headId,
        actionType: 'complete',
      },
    ];
  }

  let prevId: string | null = null;
  let currId: string | null = headId;
  let stepCount = 1;
  const total = chain.length * 3 + 2;

  steps.push({
    stepIndex: stepCount++,
    totalSteps: total,
    title: 'Initialize 3 Pointers',
    description: 'Set prev = NULL and current = head. We will invert pointers node-by-node without extra space.',
    codeLine: 1,
    nodes: cloneNodes(currentNodes),
    pointers: { HEAD: headId, current: currId, prev: null },
    headId,
    tailId: chain[chain.length - 1].id,
    actionType: 'inspect',
  });

  while (currId) {
    const currNode = currentNodes.find((n) => n.id === currId)!;
    const nextId: string | null = currNode.nextId;

    steps.push({
      stepIndex: stepCount++,
      totalSteps: total,
      title: `Save Next Pointer`,
      description: `Save next node pointer before inverting current link.`,
      codeLine: 4,
      nodes: cloneNodes(currentNodes).map((n) => ({
        ...n,
        state: n.id === currId ? ('active' as const) : n.id === prevId ? ('prev' as const) : ('default' as const),
      })),
      pointers: { HEAD: headId, current: currId, prev: prevId, next_node: nextId },
      headId,
      tailId: chain[chain.length - 1].id,
      actionType: 'inspect',
    });

    currentNodes = currentNodes.map((n) => (n.id === currId ? { ...n, nextId: prevId } : n));

    steps.push({
      stepIndex: stepCount++,
      totalSteps: total,
      title: `Reverse Pointer: current.next = prev`,
      description: `Node ${currNode.val} now points backwards to ${prevId ? `node ${currentNodes.find((n) => n.id === prevId)?.val}` : 'NULL'}.`,
      codeLine: 5,
      nodes: cloneNodes(currentNodes),
      pointers: { HEAD: headId, current: currId, prev: prevId, next_node: nextId },
      headId,
      tailId: chain[chain.length - 1].id,
      actionType: 'link',
      highlightEdge: { from: currId, to: prevId, color: '#f59e0b' },
    });

    prevId = currId;
    currId = nextId;

    steps.push({
      stepIndex: stepCount++,
      totalSteps: total,
      title: `Advance Pointers`,
      description: `Moved prev and current one step forward along the chain.`,
      codeLine: 6,
      nodes: cloneNodes(currentNodes),
      pointers: { HEAD: headId, current: currId, prev: prevId },
      headId,
      tailId: chain[chain.length - 1].id,
      actionType: 'traverse',
    });
  }

  const newHeadId = prevId;
  steps.push({
    stepIndex: stepCount,
    totalSteps: total,
    title: 'Update HEAD = prev',
    description: `All pointers successfully reversed! HEAD now points to ${currentNodes.find((n) => n.id === newHeadId)?.val}. Time complexity: O(n).`,
    codeLine: 8,
    nodes: currentNodes.map((n) => ({ ...n, state: 'default' as const })),
    pointers: { HEAD: newHeadId },
    headId: newHeadId,
    tailId: headId,
    actionType: 'complete',
  });

  return steps;
}

/**
 * Floyd's Cycle Detection (Tortoise and Hare)
 */
export function generateCycleDetectionSteps(
  initialNodes: LLNode[],
  headId: string | null
): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const nodes = cloneNodes(initialNodes);
  const nodeMap = new Map<string, LLNode>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  if (!headId) {
    return [
      {
        stepIndex: 1,
        totalSteps: 1,
        title: 'Empty List',
        description: 'An empty list has no cycles.',
        codeLine: 1,
        nodes,
        pointers: {},
        headId: null,
        tailId: null,
        actionType: 'complete',
      },
    ];
  }

  let slow: string | null = headId;
  let fast: string | null = headId;
  let stepIndex = 1;
  const maxIterations = nodes.length * 3;
  let cycleDetected = false;

  steps.push({
    stepIndex: stepIndex++,
    totalSteps: 12,
    title: 'Initialize Slow & Fast Pointers at HEAD',
    description: "Slow pointer moves 1 node per iteration, fast pointer moves 2 nodes. If a cycle exists, they must collide.",
    codeLine: 2,
    nodes: nodes.map((n) => (n.id === headId ? { ...n, state: 'active' as const } : n)),
    pointers: { HEAD: headId, slow: headId, fast: headId },
    headId,
    tailId: null,
    actionType: 'inspect',
  });

  let iter = 0;
  while (fast && nodeMap.has(fast) && iter < maxIterations) {
    iter++;
    const fastNode: LLNode = nodeMap.get(fast)!;
    const fastNext: string | null | undefined = fastNode.nextId;
    if (!fastNext || !nodeMap.has(fastNext)) {
      break;
    }
    const fastNextNode: LLNode = nodeMap.get(fastNext)!;
    const fastNextNext: string | null = fastNextNode.nextId ?? null;

    const slowNode: LLNode = nodeMap.get(slow!)!;
    slow = slowNode.nextId ?? null;
    fast = fastNextNext;

    const collision = slow !== null && fast !== null && slow === fast;

    steps.push({
      stepIndex: stepIndex++,
      totalSteps: 12,
      title: collision ? 'Collision Detected! Cycle Exists' : `Iteration ${iter}: Advance Pointers`,
      description: collision
        ? `Slow pointer and Fast pointer collided at node ${nodeMap.get(slow!)?.val}! A cycle is guaranteed.`
        : `Slow moved 1 step to ${nodeMap.get(slow!)?.val || 'NULL'}. Fast moved 2 steps to ${nodeMap.get(fast!)?.val || 'NULL'}.`,
      codeLine: collision ? 6 : 4,
      nodes: nodes.map((n) => {
        if (collision && n.id === slow) return { ...n, state: 'cycle' as const };
        if (n.id === slow) return { ...n, state: 'slow' as const };
        if (n.id === fast) return { ...n, state: 'fast' as const };
        return { ...n, state: 'default' as const };
      }),
      pointers: { HEAD: headId, slow, fast },
      headId,
      tailId: null,
      actionType: collision ? 'complete' : 'traverse',
      highlightNodes: collision ? [slow!] : [],
    });

    if (collision) {
      cycleDetected = true;
      break;
    }
  }

  if (!cycleDetected) {
    steps.push({
      stepIndex: stepIndex,
      totalSteps: stepIndex,
      title: 'Fast Reached NULL: No Cycle',
      description: 'The fast pointer reached NULL. No cycle exists in this list.',
      codeLine: 8,
      nodes: nodes.map((n) => ({ ...n, state: 'default' as const })),
      pointers: { HEAD: headId, slow, fast },
      headId,
      tailId: null,
      actionType: 'complete',
    });
  }

  const total = steps.length;
  steps.forEach((s) => (s.totalSteps = total));

  return steps;
}
