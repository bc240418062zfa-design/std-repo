import { McqSet } from '../../types';

export const cs301Mid: McqSet = {
  id: 'cs301-midterm',
  courseCode: 'CS301',
  courseTitle: 'Data Structures',
  term: 'midterm',
  termLabel: 'Mid-Term',
  description: 'Linked lists, stacks, queues, priority queues, infix/postfix expressions, recursion, binary search trees, and AVL trees.',
  topics: [],
  questions: [
    {
      id: 'cs301-mid-1',
      num: 1,
      question: 'In C++, how is an array x of 100 integers declared?',
      options: ['int x = [100];', 'int x[100];', 'integer array x = 100;', 'int[100] x;'],
      correctIndex: 1
    },
    {
      id: 'cs301-mid-2',
      num: 2,
      question: 'What determines the practical maximum depth of recursive calls a function can make?',
      options: [
        'It is always exactly one call.',
        'It is always equal to the function argument.',
        'There is no universal fixed number; available stack and system resources limit it.',
        'A function can never call itself.'
      ],
      correctIndex: 2
    },
    {
      id: 'cs301-mid-3',
      num: 3,
      question: 'Which of the following is a non-linear data structure?',
      options: ['Array', 'Linked list', 'Binary search tree', 'Stack'],
      correctIndex: 2
    },
    {
      id: 'cs301-mid-4',
      num: 4,
      question: 'In C++, what does the new operation return when it dynamically allocates an object?',
      options: [
        'The size of the allocated memory only',
        'A pointer to the allocated memory',
        'The value stored in the allocated memory',
        'Both the size and the pointer as one value'
      ],
      correctIndex: 1
    },
    {
      id: 'cs301-mid-5',
      num: 5,
      question: 'What is a linked list called when each node has one pointer to the next node and another to the previous node?',
      options: ['Singly linked list', 'Doubly linked list', 'Circular array', 'Binary search tree'],
      correctIndex: 1
    },
    {
      id: 'cs301-mid-6',
      num: 6,
      question: 'What type of expression is AB+C* when operators follow their operands?',
      options: ['Prefix expression', 'Postfix expression', 'Infix expression', 'A prefix and infix expression'],
      correctIndex: 1
    },
    {
      id: 'cs301-mid-7',
      num: 7,
      question: 'Given the function int X(int& value), which is a valid call when b is an integer variable?',
      options: ['a = X(b);', 'a = X(&b);', 'a = X(*b);', 'a = X(8*b);'],
      correctIndex: 0
    },
    {
      id: 'cs301-mid-8',
      num: 8,
      question: 'In the standard linked representation of a binary search tree, how many child pointers does each node have?',
      options: ['One', 'Two', 'Three', 'Four'],
      correctIndex: 1
    },
    {
      id: 'cs301-mid-9',
      num: 9,
      question: 'What should the next field of the last node in a singly linked list contain?',
      options: ['The address of the first node', 'A random address', 'NULL', 'The list size'],
      correctIndex: 2
    },
    {
      id: 'cs301-mid-10',
      num: 10,
      question: 'What is a queue called when dequeue order is determined by priority rather than FIFO arrival order?',
      options: ['Simple queue', 'Stack', 'Priority queue', 'Circular list'],
      correctIndex: 2
    },
    {
      id: 'cs301-mid-11',
      num: 11,
      question: 'What form of expression is a * (b + c) - d?',
      options: ['Prefix', 'Postfix', 'Infix', 'Reverse Polish only'],
      correctIndex: 2
    },
    {
      id: 'cs301-mid-12',
      num: 12,
      question: 'Which calling method passes a copy of an argument to the called function?',
      options: ['Call by reference', 'Call by value', 'Call by address only', 'Call by alias'],
      correctIndex: 1
    },
    {
      id: 'cs301-mid-13',
      num: 13,
      question: 'Which statement is NOT true about a C++ reference variable?',
      options: [
        'Once initialized, it cannot be made to refer to a different object.',
        'A reference cannot be null in ordinary valid use.',
        'A reference can be declared uninitialized and assigned later.',
        'A reference is another name for an existing object.'
      ],
      correctIndex: 2
    },
    {
      id: 'cs301-mid-14',
      num: 14,
      question: 'What is the asymptotic worst-case search time in an AVL tree with n nodes?',
      options: ['O(1)', 'O(log n)', 'O(n log n)', 'O(n^2)'],
      correctIndex: 1
    },
    {
      id: 'cs301-mid-15',
      num: 15,
      question: 'In post-order traversal of a binary tree, in what order are the nodes processed?',
      options: [
        'Root, left subtree, right subtree',
        'Left subtree, right subtree, root',
        'Left subtree, root, right subtree',
        'Right subtree, root, left subtree'
      ],
      correctIndex: 1
    },
    {
      id: 'cs301-mid-16',
      num: 16,
      question: 'What is a main advantage of using an AVL tree for searching?',
      options: [
        'It keeps search efficient by maintaining balance.',
        'It stores data without using nodes.',
        'It guarantees constant-time search for every input.',
        'It encrypts stored data.'
      ],
      correctIndex: 0
    },
    {
      id: 'cs301-mid-17',
      num: 17,
      question: 'In a postfix expression, a binary operator normally applies to how many preceding operands?',
      options: ['One', 'Two', 'Three', 'Four'],
      correctIndex: 1
    },
    {
      id: 'cs301-mid-18',
      num: 18,
      question: 'Which statement about a built-in fixed-size array is correct?',
      options: [
        'Its size is fixed once it is created.',
        'Its size always grows automatically.',
        'It can store only pointers.',
        'Its size is determined by the number of loops in the program.'
      ],
      correctIndex: 0
    },
    {
      id: 'cs301-mid-19',
      num: 19,
      question: 'Linked-list nodes are commonly described as which kind of structure?',
      options: ['Self-referential', 'Redundant', 'Always bidirectional', 'Non-recursive'],
      correctIndex: 0
    },
    {
      id: 'cs301-mid-20',
      num: 20,
      question: 'What is one basic structural difference between a queue and a stack?',
      options: [
        'A queue uses two ends, while a stack uses one end for its usual operations.',
        'A queue always requires dynamic memory, but a stack never does.',
        'A stack uses two ends, while a queue uses only one.',
        'They must use different types of memory.'
      ],
      correctIndex: 0
    },
    {
      id: 'cs301-mid-21',
      num: 21,
      question: 'Which data structure can be used to implement both a stack and a queue?',
      options: ['Singly linked list', 'Binary search tree only', 'AVL tree only', 'Hash table only'],
      correctIndex: 0
    },
    {
      id: 'cs301-mid-22',
      num: 22,
      question: 'At which end are new items added to a stack?',
      options: ['Bottom', 'Middle', 'Top', 'Any random position'],
      correctIndex: 2
    },
    {
      id: 'cs301-mid-23',
      num: 23,
      question: 'Why does an array-based stack need an isFull check?',
      options: [
        'Because an array has a fixed capacity.',
        'Because arrays cannot store values.',
        'Because a stack must always be empty.',
        'Because linked lists have no nodes.'
      ],
      correctIndex: 0
    },
    {
      id: 'cs301-mid-24',
      num: 24,
      question: 'What is the defining ordering difference between a binary tree and a binary search tree?',
      options: [
        'A BST places keys according to an ordering rule; a general binary tree need not.',
        'A BST has at most two children, but a binary tree has unlimited children.',
        'A binary tree must be sorted, but a BST must not be sorted.',
        'There is no difference.'
      ],
      correctIndex: 0
    },
    {
      id: 'cs301-mid-25',
      num: 25,
      question: 'Which stack operation removes the most recently pushed item?',
      options: ['Push', 'Pop', 'Enqueue', 'Peek only'],
      correctIndex: 1
    },
    {
      id: 'cs301-mid-26',
      num: 26,
      question: 'What is the AVL balance condition at each node?',
      options: [
        'The subtree heights may differ by at most 1.',
        'The left subtree must always be taller by at least 2.',
        'The tree must have exactly two leaves at every node.',
        'The two subtree heights must always be equal.'
      ],
      correctIndex: 0
    },
    {
      id: 'cs301-mid-27',
      num: 27,
      question: 'What is the postfix form of the infix expression a + b * c - d?',
      options: ['ab+c*d-', 'abc*+d-', 'abcd+*-', 'a+b*c-d'],
      correctIndex: 1
    },
    {
      id: 'cs301-mid-28',
      num: 28,
      question: 'In call by value, what is passed to the called function?',
      options: [
        'The original variable itself as an alias',
        'A copy of the argument value',
        "The variable's name only",
        'A reference that must change the original'
      ],
      correctIndex: 1
    },
    {
      id: 'cs301-mid-29',
      num: 29,
      question: 'Which data structure supports the nested calls made during recursion?',
      options: ['Queue', 'Stack', 'Array only', 'Priority queue'],
      correctIndex: 1
    },
    {
      id: 'cs301-mid-30',
      num: 30,
      question: 'In the declaration int& a = b;, what is the relationship between a and b?',
      options: [
        'They are names for the same integer object.',
        'a stores the address of b as an integer.',
        'They are separate integers with equal values.',
        'b becomes a pointer to a.'
      ],
      correctIndex: 0
    },
    {
      id: 'cs301-mid-31',
      num: 31,
      question: 'When are ordinary local variables declared inside a function usually destroyed?',
      options: [
        'When the program is installed',
        'When execution leaves their scope, usually as the function ends',
        'Only when the computer shuts down',
        'They are never destroyed'
      ],
      correctIndex: 1
    },
    {
      id: 'cs301-mid-32',
      num: 32,
      question: 'When does a binary search tree have its worst-case search behavior?',
      options: [
        'When insertion order makes it highly skewed, such as sorted input.',
        'When it is perfectly balanced.',
        'When it contains exactly one node.',
        'When every key is stored twice.'
      ],
      correctIndex: 0
    },
    {
      id: 'cs301-mid-33',
      num: 33,
      question: 'Which data structure is commonly used to evaluate a postfix expression?',
      options: ['Queue', 'Stack', 'Binary search tree', 'Graph'],
      correctIndex: 1
    },
    {
      id: 'cs301-mid-34',
      num: 34,
      question: 'Which data structure can be used to reverse a string?',
      options: ['Queue', 'Stack', 'Binary search tree', 'Priority queue'],
      correctIndex: 1
    },
    {
      id: 'cs301-mid-35',
      num: 35,
      question: "In the course's character-code approach, lexicographic ordering of characters is based on their what?",
      options: ['Memory addresses', 'ASCII values', 'Number of arrays', 'Pointer depth'],
      correctIndex: 1
    },
    {
      id: 'cs301-mid-36',
      num: 36,
      question: 'Using the convention that the root has level 0, how is the height of a binary tree measured?',
      options: [
        'By the number of nodes in the whole tree',
        'By the number of edges on the longest root-to-leaf path',
        'By the number of leaves only',
        'By the number of children of the root'
      ],
      correctIndex: 1
    },
    {
      id: 'cs301-mid-37',
      num: 37,
      question: 'A traffic system lets an ambulance move ahead of ordinary vehicles waiting at a signal. Which queue idea does this illustrate?',
      options: ['A simple FIFO queue', 'A priority queue', 'A stack', 'A circular array only'],
      correctIndex: 1
    },
    {
      id: 'cs301-mid-38',
      num: 38,
      question: 'How do the postfix forms of A + B * C and (A + B) * C compare?',
      options: [
        'They are the same.',
        'They are different.',
        'Both are invalid postfix expressions.',
        'They are prefixes.'
      ],
      correctIndex: 1
    },
    {
      id: 'cs301-mid-39',
      num: 39,
      question: 'Under the level convention used in the papers, what is the level of the root of a binary tree?',
      options: ['-1', '0', '1', 'It has no level'],
      correctIndex: 1
    },
    {
      id: 'cs301-mid-40',
      num: 40,
      question: 'If a node is at level k, what is the level of each of its children?',
      options: ['k - 1', 'k', 'k + 1', '2k'],
      correctIndex: 2
    },
    {
      id: 'cs301-mid-41',
      num: 41,
      question: 'Which data structure is normally used to perform level-order traversal of a binary tree?',
      options: ['Stack', 'Queue', 'Priority queue', 'Hash table'],
      correctIndex: 1
    },
    {
      id: 'cs301-mid-42',
      num: 42,
      question: 'In level-order traversal, which children should be added to the queue after processing a node?',
      options: ['Right child, then left child', 'Left child, then right child', 'Only the root again', 'Neither child'],
      correctIndex: 1
    },
    {
      id: 'cs301-mid-43',
      num: 43,
      question: 'How can a dangling reference problem be avoided when returning from a function?',
      options: [
        'Return a reference to a local variable.',
        'Do not return a reference to a local variable that will be destroyed.',
        'Set every reference to zero.',
        'Use recursion for every function.'
      ],
      correctIndex: 1
    },
    {
      id: 'cs301-mid-44',
      num: 44,
      question: 'What is a dangling reference?',
      options: [
        'A reference to an object that is still alive',
        'A reference to an object whose lifetime has ended',
        'A reference initialized to a global variable',
        'A reference that points to the next list node'
      ],
      correctIndex: 1
    },
    {
      id: 'cs301-mid-45',
      num: 45,
      question: 'What is a reference variable in C++?',
      options: [
        'A new independent copy of an object',
        'Another name, or alias, for an existing object',
        'A queue of variable addresses',
        'A variable that stores only NULL'
      ],
      correctIndex: 1
    },
    {
      id: 'cs301-mid-46',
      num: 46,
      question: 'What does const on a function parameter indicate for that parameter?',
      options: [
        'The parameter cannot be modified through that parameter inside the function.',
        'The parameter is always zero.',
        'The function cannot be called again.',
        'The parameter is automatically global.'
      ],
      correctIndex: 0
    },
    {
      id: 'cs301-mid-47',
      num: 47,
      question: 'How can a BST containing fixed keys be made as tall as possible?',
      options: [
        'Arrange it as a balanced tree.',
        'Make it a single chain where each node has at most one child.',
        'Give every node two children.',
        'Remove the root.'
      ],
      correctIndex: 1
    },
    {
      id: 'cs301-mid-48',
      num: 48,
      question: 'Which statement best describes an AVL tree?',
      options: [
        'A self-balancing binary search tree',
        'A queue implemented with an array',
        'A linked list with no pointers',
        'A binary tree with no ordering rule'
      ],
      correctIndex: 0
    },
    {
      id: 'cs301-mid-49',
      num: 49,
      question: 'If a list is implemented using a fixed-size array, which operation becomes difficult when the list outgrows its capacity?',
      options: [
        'Accessing an element by index',
        "Increasing the list's capacity",
        'Comparing two integers',
        'Reading the first item'
      ],
      correctIndex: 1
    },
    {
      id: 'cs301-mid-50',
      num: 50,
      question: 'What is the main difference between a simple FIFO queue and a priority queue?',
      options: [
        'A simple queue removes by arrival order; a priority queue removes according to priority.',
        'A simple queue is LIFO; a priority queue has no removal operation.',
        'A priority queue can store only one item.',
        'There is no difference.'
      ],
      correctIndex: 0
    }
  ]
};
