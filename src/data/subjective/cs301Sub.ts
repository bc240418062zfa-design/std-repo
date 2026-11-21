import { SubjectiveSet } from '../../types';

export const cs301Sub: SubjectiveSet = {
  id: 'cs301-subjective',
  courseCode: 'CS301',
  courseTitle: 'Data Structures',
  term: 'midterm',
  termLabel: 'Core & Exam Prep',
  description:
    'Rapid exam-prep deck for CS301 covering Binary Tree node/link formulas, AVL tree rotations, Min/Max Heap array rules, Hashing linear probing, Dynamic Equivalence, and Huffman decoding.',
  topics: [
    'Trees & Formulas',
    'AVL Rotations',
    'Heaps',
    'Hashing & Sorting',
    'Huffman & Equivalence'
  ],
  questions: [
    {
      id: 'cs301-sub-1',
      num: 1,
      question:
        'For an extended binary tree with N internal nodes, state the exact formulas for: (a) Total Links, (b) Internal Links, (c) External Links, and (d) External Nodes.',
      marks: 5,
      term: 'midterm',
      topic: 'Trees & Formulas',
      quickHook: 'N internal nodes -> Internal links = N-1, External nodes = N+1, External links = N+1, Total links = 2N.',
      keyPoints: [
        'Internal Links = N - 1 (every non-root internal node has 1 incoming link from a parent).',
        'External Nodes (null leaves) = N + 1 (if N = 45 internal nodes, external nodes = 46).',
        'External Links = N + 1 (one link pointing to each external node).',
        'Total Links = Internal Links + External Links = (N - 1) + (N + 1) = 2N.'
      ],
      modelAnswer:
        'In a strictly/extended binary tree having N internal nodes: each node has 2 outgoing pointer slots, giving 2N total links. Among the N internal nodes, every node except the root has exactly one parent link, yielding (N - 1) internal links. The remaining 2N - (N - 1) = N + 1 pointers lead to external (leaf/NULL) nodes, meaning there are (N + 1) external links and (N + 1) external nodes.',
      examTip: 'Paper favorite: If 45 internal nodes are given -> external nodes = 45 + 1 = 46. Memorize the 4-formula block!'
    },
    {
      id: 'cs301-sub-2',
      num: 2,
      question:
        'List the four AVL Tree imbalance cases and state the exact rotation required to rebalance each case.',
      marks: 3,
      term: 'midterm',
      topic: 'AVL Rotations',
      quickHook: 'Outside cases (LL, RR) = 1 Single Rotation; Inside zig-zag cases (LR, RL) = 2 Double Rotations.',
      keyPoints: [
        'LL (Left-Left, outside): Single Right Rotation.',
        'RR (Right-Right, outside): Single Left Rotation.',
        'LR (Left-Right, inside): Double Rotation — Left Rotation on left child, then Right Rotation on imbalanced node.',
        'RL (Right-Left, inside): Double Rotation — Right Rotation on right child, then Left Rotation on imbalanced node.'
      ],
      modelAnswer:
        'An AVL node becomes imbalanced when |height(left) - height(right)| > 1. Outside insertions (LL into left child’s left subtree, or RR into right child’s right subtree) are fixed with a Single Right or Single Left rotation respectively. Inside insertions (LR or RL) form a zig-zag and require a Double Rotation: first rotate the child in the opposite direction to straighten the path, then rotate the imbalanced ancestor.',
      examTip: 'Remember: Balance Factor = Height(Left) - Height(Right), valid values are -1, 0, +1.'
    },
    {
      id: 'cs301-sub-3',
      num: 3,
      question:
        'In a 1-indexed array representation of a Min-Heap or Max-Heap, where are the root, parent, left child, and right child of node at index i stored?',
      marks: 3,
      term: 'midterm',
      topic: 'Heaps',
      quickHook: 'Root at index 1 (largest in Max-Heap, smallest in Min-Heap); parent = floor(i/2), left = 2i, right = 2i+1.',
      keyPoints: [
        'Root at index 1 holds the extreme value: minimum element in a Min-Heap, maximum element in a Max-Heap.',
        'Parent of node at index i is stored at floor(i / 2).',
        'Left child of node at index i is at 2 * i; Right child is at (2 * i) + 1.'
      ],
      modelAnswer:
        'Heaps are complete binary trees efficiently stored in a 1-based array (index 0 unused). In a Min-Heap, index 1 always contains the smallest key; in a Max-Heap, index 1 always contains the largest key. For any node at position i: its parent lies at floor(i / 2), its left child at 2i, and its right child at 2i + 1.',
      codeSnippet: `Parent(i)     = i / 2\nLeftChild(i)  = 2 * i\nRightChild(i) = 2 * i + 1`
    },
    {
      id: 'cs301-sub-4',
      num: 4,
      question:
        'Insert keys 1, 5, 4, 7 into a hash table of size 4 using hash function h(x) = (x + 3) % 4 with Linear Probing. Show final array indices.',
      marks: 5,
      term: 'midterm',
      topic: 'Hashing & Sorting',
      quickHook: 'Compute (x+3)%4; on collision step +1 mod 4 until empty slot.',
      keyPoints: [
        'h(1) = (1 + 3) % 4 = 0 -> index 0 stores 1.',
        'h(5) = (5 + 3) % 4 = 0 -> collision at 0 -> probe (0+1)%4 = 1 -> index 1 stores 5.',
        'h(4) = (4 + 3) % 4 = 3 -> index 3 stores 4.',
        'h(7) = (7 + 3) % 4 = 2 -> index 2 stores 7. Final array [0..3]: [1, 5, 7, 4].'
      ],
      modelAnswer:
        'Start with an empty table of size 4 (indices 0 to 3). 1) h(1) = 4 % 4 = 0 (empty -> place 1 at index 0). 2) h(5) = 8 % 4 = 0 (occupied -> linear probe (0+1)%4 = 1 -> place 5 at index 1). 3) h(4) = 7 % 4 = 3 (empty -> place 4 at index 3). 4) h(7) = 10 % 4 = 2 (empty -> place 7 at index 2). Final table: Index 0: 1, Index 1: 5, Index 2: 7, Index 3: 4.'
    },
    {
      id: 'cs301-sub-5',
      num: 5,
      question:
        'In the Dynamic Equivalence Problem, state the three mathematical properties of an equivalence relation and describe Union(Si, Sj) = Sk.',
      marks: 3,
      term: 'midterm',
      topic: 'Huffman & Equivalence',
      quickHook: 'Reflexive (a~a), Symmetric (a~b => b~a), Transitive (a~b & b~c => a~c); Union merges two disjoint sets into one.',
      keyPoints: [
        'Reflexive: every element a is related to itself (a R a).',
        'Symmetric: if a R b, then b R a.',
        'Transitive: if a R b and b R c, then a R c.',
        'Union(Si, Sj) merges disjoint sets Si and Sj into a combined equivalence class Sk (removing old sets so sets remain disjoint).'
      ],
      modelAnswer:
        'An equivalence relation ~ over a set S satisfies three properties: Reflexivity (a ~ a), Symmetry (if a ~ b then b ~ a), and Transitivity (if a ~ b and b ~ c then a ~ c). In Disjoint-Set Union-Find, the operation Si U Sj = Sk performs a Union that destroys the two separate sets Si and Sj and replaces them with one merged equivalence set Sk containing all elements from both.',
      examTip: 'Union by Weight/Size attaches the smaller tree under the root of the larger tree to keep Find() depth O(log N).'
    },
    {
      id: 'cs301-sub-6',
      num: 6,
      question:
        'Name three elementary O(n^2) sorting algorithms that do NOT use Divide and Conquer, and briefly explain what Skip List find() returns if the key is not found.',
      marks: 3,
      term: 'midterm',
      topic: 'Hashing & Sorting',
      quickHook: 'Non-D&C sorts: Bubble, Selection, Insertion; Skip List search falls to level 0 and returns NULL / next greater node.',
      keyPoints: [
        'Three elementary sorting algorithms (not Divide & Conquer): Bubble Sort, Selection Sort, and Insertion Sort (all O(n^2) worst case).',
        'Merge Sort and Quick Sort ARE Divide and Conquer algorithms.',
        'In a Skip List, if the search key is absent, the pointer stops at the rightmost key smaller than target on level 0 and returns NULL / failure.'
      ],
      modelAnswer:
        'Bubble Sort, Selection Sort, and Insertion Sort are iterative comparison sorts with O(n^2) worst-case complexity that do not follow the Divide-and-Conquer paradigm (unlike Merge Sort and Quick Sort). In a Skip List, search drops down express levels whenever the next key exceeds the target; if the key does not exist at level 0, find() identifies it is absent and returns NULL (or element not found).'
    }
  ]
};
