import { McqSet } from '../../types';

export const cs201Final: McqSet = {
  id: 'cs201-finalterm',
  courseCode: 'CS201',
  courseTitle: 'Introduction to Programming',
  term: 'finalterm',
  termLabel: 'Final-Term',
  description: 'Dynamic memory, streams & manipulators, operator overloading, templates, classes, constructors/destructors, and friend functions.',
  topics: [
    'Control statements',
    'Operators',
    'Pointers',
    'Memory management',
    'Program translation',
    'Functions',
    'Dynamic memory',
    'Streams',
    'Operator overloading',
    'Templates',
    'Arrays and matrices',
    'Classes and objects',
    'Constructors',
    'Input streams',
    'Destructors',
    'Compilation and linking',
    'Preprocessor',
    'Classes',
    'Friend functions',
    'Boolean logic',
    'Programming approaches',
    'References',
    'Problem solving',
    'Programming standards',
    'Arrays and pointers',
    'Classes and functions',
    'Standard library'
  ],
  questions: [
    {
      id: 'cs201-final-1',
      num: 1,
      topic: 'Control statements',
      question: 'A statement that repeats an action while a condition remains true is called a:',
      options: ['Repetition statement', 'Control statement', 'Conditional statement', 'Assignment statement'],
      correctIndex: 0
    },
    {
      id: 'cs201-final-2',
      num: 2,
      topic: 'Operators',
      question: 'The operators ++ and -- change a variable by:',
      options: ['3', '2', '1', '4'],
      correctIndex: 2
    },
    {
      id: 'cs201-final-3',
      num: 3,
      topic: 'Pointers',
      question: 'Variables that hold memory addresses are called:',
      options: ['Pointer variables', 'Local variables', 'Local objects', 'Function variables'],
      correctIndex: 0
    },
    {
      id: 'cs201-final-4',
      num: 4,
      topic: 'Control statements',
      question: 'The condition in a loop should normally be a(n):',
      options: ['Arithmetic expression', 'Constant expression', 'Boolean expression', 'Primary expression'],
      correctIndex: 2
    },
    {
      id: 'cs201-final-5',
      num: 5,
      topic: 'Control statements',
      question: 'When a break statement is encountered inside a loop, it:',
      options: [
        'Transfers control outside the current loop',
        'Transfers control outside the program',
        'Forces the next iteration',
        'Produces a compile-time error'
      ],
      correctIndex: 0
    },
    {
      id: 'cs201-final-6',
      num: 6,
      topic: 'Memory management',
      question: 'Dynamic memory allocation uses memory from the:',
      options: ['Stack', 'Heap', 'System cache', 'Secondary storage'],
      correctIndex: 1
    },
    {
      id: 'cs201-final-7',
      num: 7,
      topic: 'Program translation',
      question: 'An interpreter generally:',
      options: [
        'Executes lines before an error and stops at the erroneous line',
        'Translates the complete program first',
        'Only performs linking',
        'Only performs debugging'
      ],
      correctIndex: 0
    },
    {
      id: 'cs201-final-8',
      num: 8,
      topic: 'Functions',
      question: 'The return type of a function that returns no value is:',
      options: ['float', 'int', 'void', 'double'],
      correctIndex: 2
    },
    {
      id: 'cs201-final-9',
      num: 9,
      topic: 'Dynamic memory',
      question: 'The correct C++ syntax for dynamically allocating an array of 10 integers is:',
      options: ['new int(10)', 'new int[10]', 'int new(10)', 'int new[10]'],
      correctIndex: 1
    },
    {
      id: 'cs201-final-10',
      num: 10,
      topic: 'Streams',
      question: 'The ws manipulator is used with:',
      options: ['Output streams', 'Input streams', 'Input/output streams only', 'Buffered streams'],
      correctIndex: 0
    },
    {
      id: 'cs201-final-11',
      num: 11,
      topic: 'Streams',
      question: 'The base field values supported by setiosflags include oct, dec and:',
      options: ['bin', 'hex', 'correct', 'base'],
      correctIndex: 1
    },
    {
      id: 'cs201-final-12',
      num: 12,
      topic: 'Operator overloading',
      question: 'An overloaded operator function for the assignment operator must be a:',
      options: ['Friend function', 'Non-member friend function', 'Non-member class function', 'Member function of the class'],
      correctIndex: 3
    },
    {
      id: 'cs201-final-13',
      num: 13,
      topic: 'Templates',
      question: 'With a template function, the compiler detects the parameters and generates a:',
      options: [
        'Passed data; new copy of the function',
        'Passed data; old copy of the function',
        'Old copy; parameters',
        'Parameters; new copy of the function'
      ],
      correctIndex: 3
    },
    {
      id: 'cs201-final-14',
      num: 14,
      topic: 'Templates',
      question: 'Templates provide a way of abstracting:',
      options: ['Data', 'Methods', 'Access', 'Only constants'],
      correctIndex: 0
    },
    {
      id: 'cs201-final-15',
      num: 15,
      topic: 'Arrays and matrices',
      question: 'The suitable data type for storing matrix row and column counts is:',
      options: ['float', 'string', 'int', 'char'],
      correctIndex: 2
    },
    {
      id: 'cs201-final-16',
      num: 16,
      topic: 'Operator overloading',
      question: 'If obj1 and obj2 are passed to an overloaded binary operator as obj1 - obj2, the operator can be implemented as:',
      options: ['Friend function only', 'Member function only', 'Non-member function only', 'Either a non-member or friend function'],
      correctIndex: 3
    },
    {
      id: 'cs201-final-17',
      num: 17,
      topic: 'Classes and objects',
      question: 'By using objects as class members, a program achieves:',
      options: ['Accessibility', 'Reliability', 'Reusability', 'Usability'],
      correctIndex: 2
    },
    {
      id: 'cs201-final-18',
      num: 18,
      topic: 'Constructors',
      question: 'Data members in a member-initializer list are initialized:',
      options: ['From left to right', 'From right to left', 'In the order declared in the class', 'In no fixed order'],
      correctIndex: 2
    },
    {
      id: 'cs201-final-19',
      num: 19,
      topic: 'Input streams',
      question: 'The cin.get() statement is used to:',
      options: ['Read a string from the keyboard', 'Read a character from the keyboard', 'Read a string from a file', 'Read a character from a file'],
      correctIndex: 1
    },
    {
      id: 'cs201-final-20',
      num: 20,
      topic: 'Constructors',
      question: 'When an object of a class is defined inside another class, which constructor is called first?',
      options: ['The enclosing-class constructor', "The inner object's constructor", 'Both simultaneously', 'Only the destructor'],
      correctIndex: 1
    },
    {
      id: 'cs201-final-21',
      num: 21,
      topic: 'Destructors',
      question: 'The destruction order of objects is generally:',
      options: ['The same as construction order', 'Reverse of construction order', 'Independent of construction order', 'The declaration order only'],
      correctIndex: 1
    },
    {
      id: 'cs201-final-22',
      num: 22,
      topic: 'Constructors',
      question: 'When an array of objects is defined, the constructor is called:',
      options: ['Once for the whole array', 'For each object in the array', 'Never', 'Only depending on array size'],
      correctIndex: 1
    },
    {
      id: 'cs201-final-23',
      num: 23,
      topic: 'Compilation and linking',
      question: 'At linking time, library functions are available in:',
      options: ['Compiled form', 'Text form', 'Runnable form only', 'Source code only'],
      correctIndex: 0
    },
    {
      id: 'cs201-final-24',
      num: 24,
      topic: 'Preprocessor',
      question: 'A #define identifier’s replacement value normally:',
      options: ['Cannot be replaced', 'Can be changed by a function', 'Remains constant during preprocessing', 'Can be changed by an operation'],
      correctIndex: 2
    },
    {
      id: 'cs201-final-25',
      num: 25,
      topic: 'Memory management',
      question: 'Functions used for dynamic memory allocation return a pointer of type:',
      options: ['int', 'float', 'double', 'void'],
      correctIndex: 3
    },
    {
      id: 'cs201-final-26',
      num: 26,
      topic: 'Classes',
      question: 'Which is a valid C++ class declaration?',
      options: ['class B { };', 'public class A { };', 'object A { int x; };', 'class A (int x; };'],
      correctIndex: 0
    },
    {
      id: 'cs201-final-27',
      num: 27,
      topic: 'Constructors',
      question: 'If a constructor contains a return statement in its body, the compiler gives:',
      options: ['No error', 'Syntax error', 'Logical error', 'Run-time error'],
      correctIndex: 0
    },
    {
      id: 'cs201-final-28',
      num: 28,
      topic: 'Operator overloading',
      question: 'The correct general prototype form for an overloaded operator is:',
      options: [
        'return-type operator-symbol (parameter-list) operator;',
        'operator return-type operator-symbol (parameter-list);',
        'return-type operator operator-symbol (parameter-list);',
        'return-type operator-symbol operator (parameter-list);'
      ],
      correctIndex: 2
    },
    {
      id: 'cs201-final-29',
      num: 29,
      topic: 'Operator overloading',
      question: 'operator++(int) represents:',
      options: ['Member pre-increment', 'Member post-increment', 'Non-member post-increment', 'Non-member pre-increment'],
      correctIndex: 1
    },
    {
      id: 'cs201-final-30',
      num: 30,
      topic: 'Friend functions',
      question: 'The declaration friend int operator!(const M&) makes the operator function a:',
      options: ['Member function', 'Non-member function', 'Binary operator function', 'Friend function'],
      correctIndex: 3
    },
    {
      id: 'cs201-final-31',
      num: 31,
      topic: 'Boolean logic',
      question: 'For logical AND (&&), the result is true only when:',
      options: ['Both expressions are true', 'Both are false', 'First is true and second false', 'First is false and second true'],
      correctIndex: 0
    },
    {
      id: 'cs201-final-32',
      num: 32,
      topic: 'Programming approaches',
      question: 'Top-down programming breaks a problem into modules, each corresponding to a:',
      options: ['Object', 'Function', 'Assembly unit', 'High-level statement'],
      correctIndex: 1
    },
    {
      id: 'cs201-final-33',
      num: 33,
      topic: 'Dynamic memory',
      question: 'What does the new operator return?',
      options: ['A value of the object', 'A pointer to allocated memory', 'A reference only', 'A Boolean value'],
      correctIndex: 1
    },
    {
      id: 'cs201-final-34',
      num: 34,
      topic: 'Pointers',
      question: 'The statement const int *ptr = &x means:',
      options: [
        'The pointer cannot change, but the int can',
        'The pointed-to int cannot be changed through ptr',
        'Both pointer and int are constant',
        'ptr is an integer variable'
      ],
      correctIndex: 1
    },
    {
      id: 'cs201-final-35',
      num: 35,
      topic: 'Operators',
      question: 'The three main operator categories based on number of operands are:',
      options: ['Unary, binary and ternary', 'Arithmetic, logical and relational', 'Prefix, postfix and infix', 'Local, global and member'],
      correctIndex: 0
    },
    {
      id: 'cs201-final-36',
      num: 36,
      topic: 'References',
      question: 'In a statement such as int& x = y, x is:',
      options: ["A new variable containing y's value", "A pointer to y's address", 'Another name (alias) for y', 'A new variable named y'],
      correctIndex: 2
    },
    {
      id: 'cs201-final-37',
      num: 37,
      topic: 'Functions',
      question: 'In pass-by-reference:',
      options: [
        'Only a copy of the value is passed',
        "The variable's memory location is passed",
        'A temporary variable is always created',
        'The function cannot modify the original'
      ],
      correctIndex: 1
    },
    {
      id: 'cs201-final-38',
      num: 38,
      topic: 'Operators',
      question: 'The C++ casting operator is a standard:',
      options: ['Binary operator', 'Base operator', 'Cost operator', 'Const operator'],
      correctIndex: 0
    },
    {
      id: 'cs201-final-39',
      num: 39,
      topic: 'Streams',
      question: 'Both endl and flush are:',
      options: ['Functions', 'Operators', 'Manipulators', 'Objects'],
      correctIndex: 2
    },
    {
      id: 'cs201-final-40',
      num: 40,
      topic: 'Streams',
      question: 'The first parameter of a typical overloaded stream insertion operator is:',
      options: ['Input stream; class object', 'Class object; output stream', 'Output stream; class object', 'Class object; input stream'],
      correctIndex: 2
    },
    {
      id: 'cs201-final-41',
      num: 41,
      topic: 'Streams',
      question: 'The first parameter of an overloaded operator<< function should generally be passed by:',
      options: ['Value', 'Reference', 'Either value or reference only', 'It must be a class object'],
      correctIndex: 1
    },
    {
      id: 'cs201-final-42',
      num: 42,
      topic: 'Arrays and matrices',
      question: 'A matrix is best described as a:',
      options: ['Single-dimensional array', 'Multi-dimensional array', 'Vector product', 'Scalar product'],
      correctIndex: 1
    },
    {
      id: 'cs201-final-43',
      num: 43,
      topic: 'Memory management',
      question: 'Static memory allocation is associated mainly with the:',
      options: ['Heap', 'System cache', 'Free store', 'Stack'],
      correctIndex: 3
    },
    {
      id: 'cs201-final-44',
      num: 44,
      topic: 'Problem solving',
      question: 'The first step in developing a program is:',
      options: ['Linking', 'Debugging', 'Analysis', 'Loading'],
      correctIndex: 2
    },
    {
      id: 'cs201-final-45',
      num: 45,
      topic: 'Functions',
      question: 'The standard command-line parameters of main are:',
      options: ['float argc, char** argv', 'int argc, char** argv', 'int* argc, char* argv', 'int argc, float** argv'],
      correctIndex: 1
    },
    {
      id: 'cs201-final-46',
      num: 46,
      topic: 'Compilation and linking',
      question: 'A function declared but not defined before its call commonly causes a:',
      options: ['Logical error', 'Syntax error', 'Run-time error', 'Linker/program-time error'],
      correctIndex: 3
    },
    {
      id: 'cs201-final-47',
      num: 47,
      topic: 'Preprocessor',
      question: 'Whenever a library function or predefined macro is used, we generally include its:',
      options: ['Source file', 'Object file', 'Header file', 'Executable file'],
      correctIndex: 2
    },
    {
      id: 'cs201-final-48',
      num: 48,
      topic: 'Programming standards',
      question: 'ANSI stands for:',
      options: [
        'American Neutral Standards Institute',
        'Australian National Standards Institute',
        'Asian National Standards Institute',
        'American National Standards Institute'
      ],
      correctIndex: 3
    },
    {
      id: 'cs201-final-49',
      num: 49,
      topic: 'Constructors',
      question: 'The initializer list is used to initialize contained objects at:',
      options: ['Run time only', 'Debugging time', 'Construction time', 'Compile time'],
      correctIndex: 2
    },
    {
      id: 'cs201-final-50',
      num: 50,
      topic: 'Streams',
      question: 'Which is not an input-stream method?',
      options: ['getline()', 'peek()', 'unget()', 'write()'],
      correctIndex: 3
    },
    {
      id: 'cs201-final-51',
      num: 51,
      topic: 'Streams',
      question: 'The stream insertion and extraction operators are overloaded for:',
      options: ['User-defined types only', 'Built-in types only', 'User-defined and built-in types', 'Constants only'],
      correctIndex: 2
    },
    {
      id: 'cs201-final-52',
      num: 52,
      topic: 'Streams',
      question: 'Every stream has:',
      options: ['A source only', 'A destination only', 'A source and a destination', 'No source'],
      correctIndex: 2
    },
    {
      id: 'cs201-final-53',
      num: 53,
      topic: 'Memory management',
      question: "The delete operator's void pointer points to:",
      options: ['The block of memory to deallocate', 'All objects of a class', 'Nothing', 'Only a type descriptor'],
      correctIndex: 0
    },
    {
      id: 'cs201-final-54',
      num: 54,
      topic: 'Preprocessor',
      question: 'A special name replaced in source code by its definition is a:',
      options: ['include directive', 'Directive', 'Macro', 'define keyword'],
      correctIndex: 2
    },
    {
      id: 'cs201-final-55',
      num: 55,
      topic: 'Preprocessor',
      question: 'A header file may be included:',
      options: ['Only at the beginning', 'Only at the end', 'At any suitable point before use', 'Only in the middle'],
      correctIndex: 2
    },
    {
      id: 'cs201-final-56',
      num: 56,
      topic: 'Memory management',
      question: 'Which is not a common memory-allocation error?',
      options: ['Memory leak', 'Unreferenced memory', 'Void pointers', 'Dangling pointers'],
      correctIndex: 2
    },
    {
      id: 'cs201-final-57',
      num: 57,
      topic: 'Friend functions',
      question: 'A friend function of a class is a:',
      options: ['Private member function', 'Non-member function', 'Public member function', 'Member function'],
      correctIndex: 1
    },
    {
      id: 'cs201-final-58',
      num: 58,
      topic: 'Operator overloading',
      question: 'The correct syntax for overloading delete is:',
      options: [
        'void* operator delete(void* ptr);',
        'void* delete operator(void ptr);',
        'void* delete operator(void* ptr);',
        'delete(void* ptr);'
      ],
      correctIndex: 0
    },
    {
      id: 'cs201-final-59',
      num: 59,
      topic: 'Arrays and pointers',
      question: 'The base address of an array is the address of its:',
      options: ['First element', 'Second element', 'Third element', 'Fourth element'],
      correctIndex: 0
    },
    {
      id: 'cs201-final-60',
      num: 60,
      topic: 'Operator overloading',
      question: 'Self-assignment with user-defined objects can produce a:',
      options: ['Syntax error', 'Logical error', 'Link error', 'Run-time error'],
      correctIndex: 1
    },
    {
      id: 'cs201-final-61',
      num: 61,
      topic: 'Classes and functions',
      question: 'A function declared inside a class is normally defined with:',
      options: ['No prototype', 'The class scope/name qualification when defined outside', 'Only a return type', 'A macro'],
      correctIndex: 1
    },
    {
      id: 'cs201-final-62',
      num: 62,
      topic: 'Streams',
      question: 'A user-defined stream manipulator typically receives an object of type:',
      options: ['ofstream', 'istream', 'ostream', 'ifstream'],
      correctIndex: 2
    },
    {
      id: 'cs201-final-63',
      num: 63,
      topic: 'Standard library',
      question: 'The range commonly associated with rand() in the supplied paper is:',
      options: ['0–32768', '1–32768', '0–32767', '1–32767'],
      correctIndex: 2
    }
  ]
};
