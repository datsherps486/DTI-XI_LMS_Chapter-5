/**
 * Chapter 5: Algorithm and Data Structure
 * Digital Technology and Innovation Class XI Syllabus Knowledge Base
 */

export interface SyllabusKeyWord {
  term: string;
  definition: string;
  page: number;
}

export const CHAPTER_5_KEY_WORDS: SyllabusKeyWord[] = [
  {
    term: 'traversal',
    definition: 'Visiting or accessing each element in a data structure one by one.',
    page: 65,
  },
  {
    term: 'contiguous location',
    definition: 'Data is stored next to each other in a continuous block of memory without any gaps in between.',
    page: 65,
  },
  {
    term: 'unidirectional',
    definition: 'Moving or going in only one direction (e.g. singly linked list from head to tail).',
    page: 66,
  },
  {
    term: 'bi-directional',
    definition: 'Moving or going in two directions (e.g. doubly linked list forward and backward).',
    page: 67,
  },
  {
    term: 'time complexity',
    definition: 'How fast or slow a program becomes when we give it more data.',
    page: 68,
  },
  {
    term: 'O(n)',
    definition: "Means the algorithm's running time increases proportionally to the number of nodes. If the list has n nodes, you must follow n pointers to reach the end.",
    page: 68,
  },
  {
    term: 'key',
    definition: 'The value you use to identify or find something in a search operation.',
    page: 71,
  },
  {
    term: 'file systems',
    definition: 'The way a computer organises and manages data on storage devices (uses linked lists for free blocks).',
    page: 72,
  },
  {
    term: 'LIFO (Last In, First Out)',
    definition: 'A stack principle where the most recently added item (the one on top) is the first one removed.',
    page: 73,
  },
  {
    term: 'FIFO (First In, First Out)',
    definition: 'A queue principle where the first element inserted will be the first element accessed and removed.',
    page: 76,
  },
  {
    term: 'Front',
    definition: 'The end of a queue where deletion (dequeue) takes place.',
    page: 76,
  },
  {
    term: 'Rear / Back',
    definition: 'The end of a queue where insertion (enqueue) takes place.',
    page: 76,
  },
];

export interface ScenarioCard {
  id: string;
  activity: string;
  title: string;
  context: string;
  task: string;
  initialList: (string | number)[];
  expectedOutcome: string;
  explanation: string;
}

export const ACTIVITY_5_04_SCENARIOS: ScenarioCard[] = [
  {
    id: 'act504_roll',
    activity: 'Activity 5.04: Insertion Scenario Card 1',
    title: 'Learner Roll Numbers (Sorted)',
    context: 'You are maintaining a sorted linked list of learners roll numbers. A new learner with roll number 12 joins.',
    task: 'Insert roll number 12 into the sorted list: 5 → 8 → 15 → 20.',
    initialList: [5, 8, 15, 20],
    expectedOutcome: '5 → 8 → 12 → 15 → 20',
    explanation: 'Find node 8. Node 12 points to node 15, then node 8 points to node 12. No existing elements need to be shifted!',
  },
  {
    id: 'act504_playlist',
    activity: 'Activity 5.04: Insertion Scenario Card 2',
    title: 'Playlist Beginning Insertion',
    context: 'You are building a playlist linked list. A new favorite song must be added at the very beginning.',
    task: 'Insert "New Track" at the head of the playlist.',
    initialList: ['Song A', 'Song B', 'Song C'],
    expectedOutcome: 'New Track → Song A → Song B → Song C',
    explanation: 'New Track next pointer points to current head (Song A). Head is updated to New Track. Instant O(1) operation!',
  },
  {
    id: 'act504_books',
    activity: 'Activity 5.04: Insertion Scenario Card 3',
    title: 'Library Book IDs (Sorted)',
    context: 'You as librarian maintain a sorted linked list of book IDs. A new book with ID 115 is added.',
    task: 'Insert book 115 into current list: 101 → 105 → 110 → 120 → 130.',
    initialList: [101, 105, 110, 120, 130],
    expectedOutcome: '101 → 105 → 110 → 115 → 120 → 130',
    explanation: 'Traverse until node 110. Connect 115 next to 120. Connect 110 next to 115.',
  },
  {
    id: 'act504_tasks',
    activity: 'Activity 5.04: Insertion Scenario Card 4',
    title: 'Priority Task List (Middle Insertion)',
    context: 'You are tracking tasks in order of priority. A new task "Prepare for Debate" must be added after "Science Project".',
    task: 'Insert "Prepare for Debate" after Science Project in: Math Homework → Science Project → English Essay → History Reading.',
    initialList: ['Math Homework', 'Science Project', 'English Essay', 'History Reading'],
    expectedOutcome: 'Math Homework → Science Project → Prepare for Debate → English Essay → History Reading',
    explanation: 'Set "Prepare for Debate" next to "English Essay". Then update "Science Project" next to "Prepare for Debate".',
  },
];

export const ACTIVITY_5_05_SCENARIOS: ScenarioCard[] = [
  {
    id: 'act505_head',
    activity: 'Activity 5.05: Deletion Scenario 1',
    title: 'Beginning (Head) Deletion',
    context: 'Current list: A → B → C → D',
    task: 'Delete node A from the beginning.',
    initialList: ['A', 'B', 'C', 'D'],
    expectedOutcome: 'B → C → D',
    explanation: 'Simply direct the head pointer to the second node (Node B). Memory for node A is deallocated.',
  },
  {
    id: 'act505_end',
    activity: 'Activity 5.05: Deletion Scenario 2',
    title: 'End (Tail) Deletion',
    context: 'Current list: X → Y → Z',
    task: 'Delete the last node Z.',
    initialList: ['X', 'Y', 'Z'],
    expectedOutcome: 'X → Y',
    explanation: 'Traverse to the second-last node Y. Set Y.next = NULL. Node Z is decoupled.',
  },
  {
    id: 'act505_middle',
    activity: 'Activity 5.05: Deletion Scenario 3',
    title: 'Middle Deletion (Bypassing Removed Node)',
    context: 'Current list: 1 → 2 → 3 → 4 → 5',
    task: 'Delete node 3 from the middle.',
    initialList: [1, 2, 3, 4, 5],
    expectedOutcome: '1 → 2 → 4 → 5',
    explanation: 'Locate previous node (2). Set node 2 next pointer directly to node 4, completely bypassing node 3.',
  },
];

export const ACTIVITY_5_08_SCENARIOS = [
  {
    scenario: 'Print spooling',
    description: 'Print jobs are handled one by one in the order they arrive.',
    type: 'FIFO',
    explanation: 'Jobs wait in a queue; the first sent to printer is printed first.',
  },
  {
    scenario: 'Bank counters',
    description: 'Customers are served in the order they arrive.',
    type: 'FIFO',
    explanation: 'Fair arrival sequence where the first customer in line is served first.',
  },
  {
    scenario: 'Undo operation in a text editor',
    description: 'The most recent action is undone first.',
    type: 'LIFO',
    explanation: 'Typing or deleting actions are pushed onto a stack; undo pops the last action.',
  },
  {
    scenario: 'Emergency room in a hospital',
    description: 'Patients are treated based on severity, not arrival time.',
    type: 'Priority Queue',
    explanation: 'Critical conditions receive highest priority over minor ailments.',
  },
  {
    scenario: 'Web browser back button',
    description: 'Pages are revisited in reverse order of access.',
    type: 'LIFO',
    explanation: 'Visited URLs are pushed to history stack; back button pops the previous page.',
  },
  {
    scenario: 'Traffic lights at intersections',
    description: 'Vehicles move in the order they arrive.',
    type: 'FIFO',
    explanation: 'Vehicles waiting in lane are released in chronological arrival order.',
  },
  {
    scenario: 'Airport security check (VIP priority)',
    description: 'Passengers pass in arrival order, but VIPs get priority.',
    type: 'Priority Queue',
    explanation: 'High-priority status allows jumping ahead of general arrival queue.',
  },
  {
    scenario: 'CPU interrupt handling',
    description: 'Higher-priority interrupts are handled before lower-priority ones.',
    type: 'Priority Queue',
    explanation: 'Critical hardware interrupts suspend lower-priority routine background tasks.',
  },
];

export interface PracticeQuestion {
  id: number;
  question: string;
  hint: string;
  syllabusAnswer: string;
}

export const CHAPTER_5_PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 1,
    question: 'Explain how algorithms process the data stored in a data structure.',
    hint: 'Think about traversal, search, insertion, and deletion.',
    syllabusAnswer: 'Algorithms process data structure elements sequentially or via pointer references to perform operations like traversal, searching, insertion, and deletion efficiently without changing overall memory layout unnecessarily.',
  },
  {
    id: 2,
    question: 'Explain why a linked list is not stored in contiguous memory like arrays.',
    hint: 'Review Section 5.1 and Figure 5.3.',
    syllabusAnswer: 'Unlike arrays (which require a single continuous memory block without gaps), linked list nodes are allocated dynamically at different memory locations on the heap and linked together using pointers (addresses).',
  },
  {
    id: 3,
    question: 'Explain how backward traversal works in a doubly linked list.',
    hint: 'Look at Figure 5.7 and previous pointer.',
    syllabusAnswer: 'A doubly linked list node contains a "previous" (prev) pointer storing the address of the preceding node. Traversal starts from the tail and moves backward by following the prev links until encountering NULL at the head.',
  },
  {
    id: 4,
    question: 'Explain why a circular linked list never ends during traversal.',
    hint: 'Look at Figure 5.9 and Figure 5.10.',
    syllabusAnswer: 'In a circular linked list, the last node does not point to NULL; instead, its next pointer connects back to the first node (head), forming an unbroken continuous loop.',
  },
  {
    id: 5,
    question: 'If a list has six nodes, how many steps (maximum) are needed to search the last element?',
    hint: 'Recall linear search time complexity O(n).',
    syllabusAnswer: 'In the worst case (the target is at the very end or not found), it requires 6 steps, because each node from head to tail must be visited one by one (O(n) time complexity).',
  },
  {
    id: 6,
    question: 'Insert 22 into this sorted list: 10 → 15 → 25 → 30. Show before and after.',
    hint: 'Locate 15 and 25.',
    syllabusAnswer: 'Before: 10 → 15 → 25 → 30. Step: Allocate node 22, point 22.next to 25, and update 15.next to 22. After: 10 → 15 → 22 → 25 → 30.',
  },
  {
    id: 7,
    question: 'Differentiate between linear search and search by position.',
    hint: 'Look at Figures 5.18 and 5.19.',
    syllabusAnswer: 'Linear search (search by value) compares each node\'s data against a target key until a match is found. Search by position counts nodes sequentially from the head (1st, 2nd, 3rd...) until reaching the designated position index.',
  },
  {
    id: 8,
    question: 'Search for value 40 in 10, 20, 30, 40, 50. Show the order of traversal.',
    hint: 'Start at Head.',
    syllabusAnswer: 'Traversal order: Head → Node 10 (compare 10 ≠ 40) → Node 20 (compare 20 ≠ 40) → Node 30 (compare 30 ≠ 40) → Node 40 (match found! Stop traversal). Total steps = 4.',
  },
  {
    id: 9,
    question: 'Define LIFO with real-life examples.',
    hint: 'Section 5.2 on Stacks.',
    syllabusAnswer: 'LIFO stands for Last In, First Out: the most recently added element is the first one removed. Real-life examples: a pile of books, undo button in text editors, and clean plates stacked in a cafeteria.',
  },
  {
    id: 10,
    question: 'A stack has: Top [70, 55, 20]. Push 100, then pop once. What is the stack now?',
    hint: 'Push adds to top; pop removes from top.',
    syllabusAnswer: 'Initial: Top [70, 55, 20]. After Push(100): Top [100, 70, 55, 20]. After Pop(): 100 is removed. Final Stack: Top [70, 55, 20].',
  },
  {
    id: 11,
    question: 'Practice Question 11: Step-by-step multi data structure trace (List, Queue, Stack).',
    hint: 'Follow operations a-f in order.',
    syllabusAnswer: 'Linked List final: 10 → 30 (20 deleted). Queue final: [50, 60] (40 dequeued from front). Stack final: Top [70] (80 popped from top).',
  },
];

export const SUMMARY_CHECKLIST_ITEMS = [
  'I can explain the difference between algorithms and data structure.',
  'I can explain what a data structure is and why it is needed.',
  'I can explain a node (data field and next pointer).',
  'I can describe a singly linked list (unidirectional, head to null).',
  'I can describe a doubly linked list and its extra previous pointer (bi-directional).',
  'I know how insertion works (beginning/head, middle, and end/tail).',
  'I know how deletion works and why pointer updates are important.',
  'I understand the Last In, First Out (LIFO) principle in stacks.',
  'I understand the First In, First Out (FIFO) principle in queues.',
  'I can explain enqueue (rear) and dequeue (front) operations.',
  'I can identify the front and rear of a queue.',
  'I can explain the concept of priority queue (highest priority first).',
  'I can draw a singly, doubly, and circular linked list.',
  'I can draw a stack and mark the top.',
  'I can perform push or pop using stack, and enqueue or dequeue using queue.',
];
