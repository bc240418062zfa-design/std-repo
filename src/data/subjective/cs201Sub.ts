import { SubjectiveSet } from '../../types';

export const cs201Sub: SubjectiveSet = {
  id: 'cs201-subjective',
  courseCode: 'CS201',
  courseTitle: 'Introduction to Programming',
  term: 'midterm',
  termLabel: 'Core & Exam Prep',
  description:
    'High-yield C++ subjective fast-prep covering pointers, dynamic memory allocation, file pointers (seekg/tellg), constructors, destructors, operator overloading, and templates.',
  topics: [
    'Pointers & Memory',
    'File Handling',
    'Classes & Constructors',
    'Operator Overloading',
    'Templates & Streams'
  ],
  questions: [
    {
      id: 'cs201-sub-1',
      num: 1,
      question:
        'Differentiate between Call by Value, Call by Pointer, and Call by Reference in C++ with how each affects original variables.',
      marks: 3,
      term: 'midterm',
      topic: 'Pointers & Memory',
      quickHook: 'Value = copy (safe); Pointer = memory address (* & ->); Reference = alias (direct rename).',
      keyPoints: [
        'Call by Value passes a copy; changes inside the function do NOT affect the caller variable.',
        'Call by Pointer passes the address (&x) into a pointer parameter (*p); dereferencing *p modifies the original variable.',
        'Call by Reference passes an alias (int &r); inside the function, modifying r directly mutates the caller variable with clean syntax.'
      ],
      modelAnswer:
        'In Call by Value, the function receives an independent copy of the argument, leaving the original variable unchanged. In Call by Pointer, the caller passes the variable address (&x) to a pointer parameter (int *p), allowing direct memory modification via dereferencing (*p). In Call by Reference (int &r), the parameter acts as another name (alias) for the caller variable, modifying the original data without explicit dereferencing operators.',
      codeSnippet: `void byValue(int a) { a = 10; }      // caller unchanged\nvoid byPtr(int *p)  { *p = 10; }     // caller changed via *p\nvoid byRef(int &r)  { r = 10; }      // caller changed directly`,
      examTip: 'In CS201 exams, inspect the function signature first: & indicates reference, * indicates pointer, neither indicates value.'
    },
    {
      id: 'cs201-sub-2',
      num: 2,
      question:
        'What is the difference between malloc() and calloc() in C/C++, and what problem occurs if dynamically allocated memory is not deallocated?',
      marks: 3,
      term: 'midterm',
      topic: 'Pointers & Memory',
      quickHook: 'malloc = 1 arg, garbage values; calloc = 2 args, zero-initialized; forgetting free/delete = Memory Leak.',
      keyPoints: [
        'malloc(size) takes total bytes as a single argument and leaves memory uninitialized (garbage values).',
        'calloc(count, size) takes two arguments (number of blocks, size per block) and initializes all bits to 0.',
        'Failing to deallocate via free() or delete causes a Memory Leak, exhausting available heap RAM until program slowdown or crash.'
      ],
      modelAnswer:
        'malloc(size_t bytes) allocates a single contiguous block of uninitialized heap memory containing garbage values. calloc(size_t n, size_t size) allocates space for n elements of a given size and initializes every byte to zero. Both return a void* pointer (or NULL on failure). If allocated heap memory is not released using free() (or delete for new), the program loses reference to unusable RAM blocks—a defect known as a Memory Leak.',
      codeSnippet: `int *a = (int*) malloc(5 * sizeof(int));   // garbage values\nint *b = (int*) calloc(5, sizeof(int));    // all 5 elements set to 0\nfree(a); free(b);`,
      examTip: 'Always pair malloc/calloc with free(), and new/new[] with delete/delete[].'
    },
    {
      id: 'cs201-sub-3',
      num: 3,
      question:
        'Why is seekg(0, ios::end) called before tellg() when determining the length of a file in C++?',
      marks: 2,
      term: 'midterm',
      topic: 'File Handling',
      quickHook: 'tellg() only tells WHERE the get pointer is right now — seekg(0, ios::end) moves it to the end so position == total bytes.',
      keyPoints: [
        'tellg() returns the current byte offset of the input (get) pointer from the start of the file.',
        'When a file first opens, the pointer is at byte 0, so tellg() alone would return 0.',
        'seekg(0, ios::end) repositions the get pointer to the exact end of the file, making tellg() return the total file size in bytes.'
      ],
      modelAnswer:
        'The tellg() function returns the current position of the read (get) pointer in bytes relative to the beginning of the stream. Because a newly opened file places the get pointer at byte 0, calling seekg(0, ios::end) first shifts the pointer to the end-of-file marker. Calling tellg() immediately afterward returns the byte offset from index 0 to EOF, which equals the exact length of the file in bytes.',
      codeSnippet: `ifstream file("data.txt", ios::binary);\nfile.seekg(0, ios::end);\nlong size = file.tellg();`,
      examTip: 'Remember: g = get (reading/ifstream), p = put (writing/ofstream).'
    },
    {
      id: 'cs201-sub-4',
      num: 4,
      question:
        'Write a C++ program that opens a file data.txt in read/write mode (or writes A–Z characters to a file using a loop) and displays its contents safely.',
      marks: 5,
      term: 'midterm',
      topic: 'File Handling',
      quickHook: 'Use fstream with ios::in | ios::out (or ofstream/ifstream), always check !file before reading/writing, then file.close().',
      keyPoints: [
        'Include <iostream> and <fstream> headers.',
        'Open file with fstream using ios::in | ios::out | ios::trunc (or separate ofstream/ifstream).',
        'Verify file stream opened cleanly, loop characters, reset pointer with seekg(0) before reading, and call close().'
      ],
      modelAnswer:
        'To write and read sequentially using a single fstream object, open the file with ios::in | ios::out | ios::trunc so the file is created if missing. Write characters using a loop, rewind the get pointer to byte 0 via seekg(0, ios::beg), read until EOF, and close the stream.',
      codeSnippet: `#include <iostream>\n#include <fstream>\nusing namespace std;\n\nint main() {\n    fstream file("data.txt", ios::in | ios::out | ios::trunc);\n    if (!file) return 1;\n\n    for (char ch = 'A'; ch <= 'Z'; ch++) {\n        file << ch << ' ';\n    }\n    file.seekg(0, ios::beg); // rewind to start before reading\n    char c;\n    while (file >> c) {\n        cout << c << ' ';\n    }\n    file.close();\n    return 0;\n}`
    },
    {
      id: 'cs201-sub-5',
      num: 5,
      question:
        'Explain the roles of Default Constructor, Copy Constructor, and Destructor in a C++ class, and state what happens when a constructor is omitted.',
      marks: 3,
      term: 'midterm',
      topic: 'Classes & Constructors',
      quickHook: 'Default sets initial values; Copy clones existing object (Class &obj); Destructor (~Class) cleans up memory on scope exit.',
      keyPoints: [
        'Default Constructor has no parameters and initializes member variables when an object is declared.',
        'Copy Constructor takes a const reference (const ClassName &obj) to perform member-by-member or deep copy during initialization.',
        'Destructor (~ClassName) takes no parameters/return type and executes automatically when an object goes out of scope or is deleted.',
        'If no constructor is written, the compiler supplies an implicit trivial default constructor—except when any parameterized constructor is explicitly defined.'
      ],
      modelAnswer:
        'A Default Constructor initializes a newly created object with baseline values and takes no arguments. A Copy Constructor creates a new object as a copy of an existing object (ClassName(const ClassName &other)), crucial when classes manage dynamic pointers to avoid shallow-copy bugs. A Destructor (~ClassName()) releases acquired resources such as heap memory or open files automatically upon object destruction. If the programmer defines zero constructors, C++ synthesizes a default constructor automatically; however, defining any custom constructor disables that automatic default constructor.',
      codeSnippet: `class Box {\n  int *size;\npublic:\n  Box() { size = new int(0); }                 // Default\n  Box(const Box &b) { size = new int(*b.size); } // Copy\n  ~Box() { delete size; }                      // Destructor\n};`
    },
    {
      id: 'cs201-sub-6',
      num: 6,
      question:
        'Why can an expression like obj2 = 10 + obj1 NOT be implemented solely as a member operator function of obj1, and how do we solve it?',
      marks: 3,
      term: 'midterm',
      topic: 'Operator Overloading',
      quickHook: 'Left operand drives member calls (10.operator+(obj1) is invalid); use a friend non-member operator+(int, Class).',
      keyPoints: [
        'For a binary member operator+, the left-hand operand must be an object of the class (obj1.operator+(10)).',
        'In 10 + obj1, the left-hand operand is a built-in int (10), which cannot invoke a class member function.',
        'Declaring operator+(int lhs, const MyClass &rhs) as a friend function allows left-hand primitive operands while accessing private members.'
      ],
      modelAnswer:
        'Member operator overloading requires the left operand of a binary operator to be an instance of the class, because a + b translates to a.operator+(b). In 10 + obj1, 10 is an integer literal rather than a class object, so 10.operator+(obj1) fails to compile. The solution is to overload operator+ as a non-member friend function taking two parameters: friend MyClass operator+(int val, const MyClass &obj).',
      codeSnippet: `class Counter {\n  int count;\npublic:\n  Counter(int c = 0) : count(c) {}\n  friend Counter operator+(int lhs, const Counter &rhs) {\n    return Counter(lhs + rhs.count);\n  }\n};`,
      examTip: 'Same rule applies to stream insertion (cout << obj) and extraction (cin >> obj): left operand is ostream/istream, so always use friend!'
    },
    {
      id: 'cs201-sub-7',
      num: 7,
      question:
        'Write a C++ Function Template sumDisplay(T x, T y) that accepts values of any numeric type and prints their sum, plus trace sample calls for int and double.',
      marks: 5,
      term: 'midterm',
      topic: 'Templates & Streams',
      quickHook: 'template <class T> turns one function blueprint into type-safe int/double versions at compile time.',
      keyPoints: [
        'Prefix the function with template <class T> (or template <typename T>).',
        'Use placeholder type T for parameters x and y so both share a generic type.',
        'Trace: sumDisplay(22, 23) instantiates T = int and prints 45; sumDisplay(2.5, 2.6) instantiates T = double and prints 5.1.'
      ],
      modelAnswer:
        'Function templates allow writing generic logic once while letting the compiler generate type-specific code at compile time. Using template <class T>, sumDisplay takes two parameters of type T and prints x + y.',
      codeSnippet: `#include <iostream>\nusing namespace std;\n\ntemplate <class T>\nvoid sumDisplay(T x, T y) {\n    cout << (x + y) << endl;\n}\n\nint main() {\n    sumDisplay(22, 23);     // Output: 45\n    sumDisplay(2.5, 2.6);   // Output: 5.1\n    return 0;\n}`
    },
    {
      id: 'cs201-sub-8',
      num: 8,
      question:
        'What are stream manipulators (e.g., setw, setprecision, fixed) in C++ and when are they useful in formatted output?',
      marks: 2,
      term: 'midterm',
      topic: 'Templates & Streams',
      quickHook: 'Manipulators (<iomanip>) format stream width and decimal precision cleanly without altering stored numbers.',
      keyPoints: [
        'Header <iomanip> provides parameterized manipulators like setw(n) and setprecision(n).',
        'setw(n) reserves n character columns for the next output item (non-sticky, applies once).',
        'fixed << setprecision(2) forces exactly 2 digits after the decimal point for floating-point values (currency, GPA, reports).'
      ],
      modelAnswer:
        'Stream manipulators are special formatting instructions inserted directly into input/output streams via << or >>. Standard manipulators from <iostream> include endl and flush, while <iomanip> provides setw(n) for column alignment and fixed with setprecision(n) for controlling decimal places in float/double outputs such as financial figures or averages.',
      codeSnippet: `#include <iomanip>\ncout << fixed << setprecision(2) << 3.14159; // prints 3.14`
    }
  ]
};
