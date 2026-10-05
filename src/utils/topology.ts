import { LLNode, ListTopology, ListMode } from '../types/linkedList';

/**
 * Generates an authentic-looking hex memory address (e.g., 0x2A4)
 */
export function generateMemoryAddress(seed?: number): string {
  const base = seed !== undefined ? (0x1000 + (seed * 0x38) % 0xEFFF) : Math.floor(0x1000 + Math.random() * 0xE000);
  return '0x' + base.toString(16).toUpperCase();
}

/**
 * Computes full topology of the list starting from headId:
 * - Traverses pointers
 * - Detects cycles using Floyd's Tortoise & Hare algorithm
 * - Flags cycle nodes and cycle entry point
 * - Flags disconnected/orphan nodes
 * - Verifies doubly linked list pointer consistency (node.next.prev == node)
 */
export function computeListTopology(
  nodes: LLNode[],
  headId: string | null,
  mode: ListMode = 'singly'
): ListTopology {
  const nodeMap = new Map<string, LLNode>();
  for (const n of nodes) {
    nodeMap.set(n.id, n);
  }

  if (!headId || !nodeMap.has(headId)) {
    return {
      headId: null,
      tailId: null,
      orderedNodes: [],
      nodeCount: 0,
      hasCycle: false,
      cycleStartId: null,
      cycleNodeIds: new Set(),
      detachedNodes: [...nodes],
      isDoublyValid: true,
    };
  }

  // Floyd's Cycle Detection Algorithm
  let slowId: string | null = headId;
  let fastId: string | null = headId;
  let hasCycle = false;
  let cycleStartId: string | null = null;
  const cycleNodeIds = new Set<string>();

  // Advance slow by 1, fast by 2
  while (fastId && nodeMap.has(fastId)) {
    const fastNode: LLNode = nodeMap.get(fastId)!;
    const fastNextId: string | null | undefined = fastNode.nextId;
    if (!fastNextId || !nodeMap.has(fastNextId)) {
      break;
    }
    const fastNextNode: LLNode = nodeMap.get(fastNextId)!;
    fastId = fastNextNode.nextId ?? null;

    const slowNode: LLNode = nodeMap.get(slowId!)!;
    slowId = slowNode.nextId ?? null;

    if (slowId && fastId && slowId === fastId) {
      hasCycle = true;
      break;
    }
  }

  // Find cycle start if cycle detected
  if (hasCycle) {
    let ptr1: string | null = headId;
    let ptr2: string | null = slowId;

    while (ptr1 !== ptr2) {
      ptr1 = nodeMap.get(ptr1!)?.nextId || null;
      ptr2 = nodeMap.get(ptr2!)?.nextId || null;
    }
    cycleStartId = ptr1;

    // Collect all nodes in the cycle loop
    if (cycleStartId) {
      let currId: string | null = cycleStartId;
      let count = 0;
      while (currId && count < nodes.length + 2) {
        cycleNodeIds.add(currId);
        currId = nodeMap.get(currId)?.nextId || null;
        if (currId === cycleStartId) break;
        count++;
      }
    }
  }

  // Traverse from head to build ordered chain
  const orderedNodes: LLNode[] = [];
  const visited = new Set<string>();
  let currId: string | null = headId;
  let tailId: string | null = null;

  while (currId && nodeMap.has(currId)) {
    if (visited.has(currId)) {
      // Loop encountered
      break;
    }
    visited.add(currId);
    const node: LLNode = nodeMap.get(currId)!;
    orderedNodes.push(node);
    tailId = currId;
    currId = node.nextId;
  }

  // Detached/orphan nodes are those not reached from head
  const detachedNodes = nodes.filter((n) => !visited.has(n.id));

  // Check doubly linked list validity if in doubly mode
  let isDoublyValid = true;
  if (mode === 'doubly') {
    for (let i = 0; i < orderedNodes.length; i++) {
      const curr = orderedNodes[i];
      if (i > 0) {
        const prev = orderedNodes[i - 1];
        if (curr.prevId !== prev.id || prev.nextId !== curr.id) {
          isDoublyValid = false;
        }
      } else {
        if (curr.prevId !== null) {
          isDoublyValid = false;
        }
      }
    }
  }

  return {
    headId,
    tailId,
    orderedNodes,
    nodeCount: orderedNodes.length,
    hasCycle,
    cycleStartId,
    cycleNodeIds,
    detachedNodes,
    isDoublyValid,
  };
}

/**
 * Computes neat horizontal aligned positions for an array of nodes
 */
export function layoutNodesHorizontally(
  orderedNodes: LLNode[],
  detachedNodes: LLNode[] = [],
  startX: number = 80,
  startY: number = 200,
  gapX: number = 220
): LLNode[] {
  const result: LLNode[] = [];

  orderedNodes.forEach((node, idx) => {
    result.push({
      ...node,
      x: startX + idx * gapX,
      y: startY,
    });
  });

  detachedNodes.forEach((node, idx) => {
    result.push({
      ...node,
      x: startX + idx * gapX,
      y: startY + 220,
    });
  });

  return result;
}
