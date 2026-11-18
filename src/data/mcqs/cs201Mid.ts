import { McqSet } from '../../types';

export const cs201Mid: McqSet = {
  id: 'cs201-midterm',
  courseCode: 'CS201',
  courseTitle: 'Introduction to Programming',
  term: 'midterm',
  termLabel: 'Mid-Term',
  description: 'C/C++ programming fundamentals, control structures, loops, functions, arrays, pointers, structures, and unions.',
  topics: [],
  questions: [
    {
      id: 'cs201-mid-1',
      num: 1,
      question: 'A precise sequence of steps used to solve a problem is called:',
      options: ['Program', 'Algorithm', 'Compiler', 'Variable'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-2',
      num: 2,
      question: 'A compiler primarily translates:',
      options: ['Machine code into English', 'High-level source code into machine/object code', 'Data into hardware', 'Comments into variables'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-3',
      num: 3,
      question: 'Compiler and interpreter belong to which category of software?',
      options: ['Application software', 'System software', 'Utility data', 'Firmware only'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-4',
      num: 4,
      question: 'Initialization of a const variable at the time of declaration is:',
      options: ['Optional', 'Must', 'Never allowed', 'Only needed in loops'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-5',
      num: 5,
      question: 'In an if statement, the body executes when the condition is:',
      options: ['False', 'True', 'A string', 'A comment'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-6',
      num: 6,
      question: 'Which functions are declared in stdlib.h?',
      options: ['atof() and atoi()', 'strcpy() only', 'cout() and cin()', 'printf() only'],
      correctIndex: 0
    },
    {
      id: 'cs201-mid-7',
      num: 7,
      question: 'A pointer variable stores a:',
      options: ['Data type only', 'Memory address', 'Loop count only', 'Function name only'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-8',
      num: 8,
      question: 'The preprocessor performs its work before the program is:',
      options: ['Edited', 'Compiled', 'Linked', 'Loaded'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-9',
      num: 9,
      question: 'Which cannot be a valid C/C++ variable name?',
      options: ['area', '_area', '10area', 'area2'],
      correctIndex: 2
    },
    {
      id: 'cs201-mid-10',
      num: 10,
      question: 'Which loop is generally best when the number of iterations is known?',
      options: ['for', 'while', 'do-while', 'switch'],
      correctIndex: 0
    },
    {
      id: 'cs201-mid-11',
      num: 11,
      question: 'Which character marks the end of a C/C++ string?',
      options: ['Newline', 'Tab', 'Null character \\0', 'Carriage return'],
      correctIndex: 2
    },
    {
      id: 'cs201-mid-12',
      num: 12,
      question: 'How many bytes are occupied by char str[] = "programming";?',
      options: ['10', '11', '12', '13'],
      correctIndex: 2
    },
    {
      id: 'cs201-mid-13',
      num: 13,
      question: 'Which header file declares rand()?',
      options: ['iostream.h', 'conio.h', 'stdlib.h', 'stdio.h'],
      correctIndex: 2
    },
    {
      id: 'cs201-mid-14',
      num: 14,
      question: 'Comments in code mainly:',
      options: ['Make the executable larger', 'Make code easier to understand', 'Prevent compilation', 'Replace variables'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-15',
      num: 15,
      question: 'What is wrong with for (int k = 2, k <= 12, k++)?',
      options: ['k must be named i', 'Increment must be ++k', 'Commas should be semicolons', 'A for loop cannot use int'],
      correctIndex: 2
    },
    {
      id: 'cs201-mid-16',
      num: 16,
      question: 'For which type is an extra array element commonly needed for the string terminator?',
      options: ['int', 'double', 'float', 'char'],
      correctIndex: 3
    },
    {
      id: 'cs201-mid-17',
      num: 17,
      question: 'The result of x = 2 + 3 * 4 - 4 / 2 using integer arithmetic is:',
      options: ['8', '10', '12', '14'],
      correctIndex: 2
    },
    {
      id: 'cs201-mid-18',
      num: 18,
      question: 'A float array of 10 elements can be declared as:',
      options: ['float a[10];', 'float a(10);', 'array float a;', 'float[10] a;'],
      correctIndex: 0
    },
    {
      id: 'cs201-mid-19',
      num: 19,
      question: 'In a 3 by 2 two-dimensional array, the total number of elements is:',
      options: ['4', '5', '6', '7'],
      correctIndex: 2
    },
    {
      id: 'cs201-mid-20',
      num: 20,
      question: 'The process symbol in a flowchart is usually a:',
      options: ['Rectangle', 'Arrow', 'Oval', 'Circle'],
      correctIndex: 0
    },
    {
      id: 'cs201-mid-21',
      num: 21,
      question: 'If break is omitted in a switch case, the program may:',
      options: ['Always show a compiler error', 'Fall through to following cases', 'Stop immediately', 'Ignore the switch'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-22',
      num: 22,
      question: 'A string constant in C/C++ is enclosed in:',
      options: ['Curly braces', 'Parentheses', 'Single quotes', 'Double quotes'],
      correctIndex: 3
    },
    {
      id: 'cs201-mid-23',
      num: 23,
      question: 'The common size of int in the given CS201 context is:',
      options: ['1 byte', '2 bytes', '4 bytes', '16 bytes'],
      correctIndex: 2
    },
    {
      id: 'cs201-mid-24',
      num: 24,
      question: 'The correct assignment to second row and third column of a zero-based matrix m is:',
      options: ['m[2][3] = 5;', 'm[3][2] = 5;', 'm[1][2] = 5;', "m[2][3] = '5';"],
      correctIndex: 2
    },
    {
      id: 'cs201-mid-25',
      num: 25,
      question: 'For const int *ptr, ptr is:',
      options: ['A constant pointer', 'A pointer to a const int', 'An int constant', 'A pointer with no type'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-26',
      num: 26,
      question: 'If ptr1 points to arr[1] and ptr2 points to arr[4], ptr2 - ptr1 is:',
      options: ['2', '3', '4', '5'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-27',
      num: 27,
      question: 'For an array named arr, the usual way to assign its starting address to ptr is:',
      options: ['*ptr = arr;', 'ptr = arr;', 'ptr = arr[5];', '*ptr = arr[5];'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-28',
      num: 28,
      question: 'C is primarily a:',
      options: ['Low-level language only', 'Object-oriented language', 'Function-oriented/procedural language', 'Markup language'],
      correctIndex: 2
    },
    {
      id: 'cs201-mid-29',
      num: 29,
      question: 'A variable can be viewed conceptually as an:',
      options: ['Empty box with name, type and size', 'Operator only', 'Executable file', 'Header file'],
      correctIndex: 0
    },
    {
      id: 'cs201-mid-30',
      num: 30,
      question: 'The syntax of a union is most similar to the syntax of a:',
      options: ['Structure', 'Loop', 'Function', 'Header'],
      correctIndex: 0
    },
    {
      id: 'cs201-mid-31',
      num: 31,
      question: 'The value of integer expression 27 / 4 is:',
      options: ['6.75', '6', '7', '0'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-32',
      num: 32,
      question: 'Which is the correct member assignment for Customer cust1?',
      options: ['Customer.salary = 2000;', 'cust1.salary = 2000;', 'cust1->salary = 2000;', 'salary.cust1 = 2000;'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-33',
      num: 33,
      question: 'A compiler is a program that:',
      options: ['Executes only comments', 'Translates source code into object/machine code', 'Stores images', 'Creates flowcharts automatically'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-34',
      num: 34,
      question: 'Which loop checks its condition before the first iteration?',
      options: ['while', 'do-while', 'Both never check', 'switch'],
      correctIndex: 0
    },
    {
      id: 'cs201-mid-35',
      num: 35,
      question: 'Which loop always executes its body at least once?',
      options: ['for', 'while', 'do-while', 'if'],
      correctIndex: 2
    },
    {
      id: 'cs201-mid-36',
      num: 36,
      question: 'The correct do-while syntax is:',
      options: [
        'while(condition); do { statements; }',
        'do { statements; } while(condition);',
        'do while(condition) { statements; }',
        'do(condition) while { statements; }'
      ],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-37',
      num: 37,
      question: 'The ++ and -- operators change a variable by:',
      options: ['3', '2', '1', '4'],
      correctIndex: 2
    },
    {
      id: 'cs201-mid-38',
      num: 38,
      question: 'The logical AND operator is written as:',
      options: ['&', '&&', '||', '!'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-39',
      num: 39,
      question: 'The logical OR operator is written as:',
      options: ['&', '&&', '||', '!'],
      correctIndex: 2
    },
    {
      id: 'cs201-mid-40',
      num: 40,
      question: 'The NOT operator is written as:',
      options: ['!', '~', '!=', 'not='],
      correctIndex: 0
    },
    {
      id: 'cs201-mid-41',
      num: 41,
      question: 'The equality comparison operator is:',
      options: ['=', '==', '===', '<>'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-42',
      num: 42,
      question: 'The modulus operator % returns the:',
      options: ['Quotient', 'Remainder', 'Power', 'Address'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-43',
      num: 43,
      question: 'Array indexing in C/C++ normally starts at:',
      options: ['0', '1', '-1', 'The array size'],
      correctIndex: 0
    },
    {
      id: 'cs201-mid-44',
      num: 44,
      question: 'The last valid index of int a[5] is:',
      options: ['5', '4', '3', '6'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-45',
      num: 45,
      question: 'An array stores elements of:',
      options: ['Different unrelated types only', 'The same declared type', 'Only strings', 'Only pointers'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-46',
      num: 46,
      question: 'The address-of operator in C/C++ is:',
      options: ['*', '&', '@', '#'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-47',
      num: 47,
      question: 'The dereference operator for a pointer is:',
      options: ['&', '*', '%', '-> only'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-48',
      num: 48,
      question: 'When passing a large structure by reference, a benefit is:',
      options: ['It avoids copying the whole structure', 'It deletes the structure', 'It converts it to an array', 'It prevents all changes'],
      correctIndex: 0
    },
    {
      id: 'cs201-mid-49',
      num: 49,
      question: 'A void function returns:',
      options: ['An int', 'A float', 'No value', 'Always a pointer'],
      correctIndex: 2
    },
    {
      id: 'cs201-mid-50',
      num: 50,
      question: "A function prototype tells the compiler the function's:",
      options: ['Color', 'Name, return type and parameters', 'Output screen size', 'Memory address only'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-51',
      num: 51,
      question: 'A structure groups:',
      options: ['Only functions', 'Related variables of possibly different types', 'Only characters', 'Only constants'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-52',
      num: 52,
      question: 'A union differs from a structure because its members:',
      options: ['Always have separate storage', 'Share the same memory area', 'Must all be strings', 'Cannot be accessed'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-53',
      num: 53,
      question: 'The #include directive is handled by the:',
      options: ['Linker', 'Preprocessor', 'Loader', 'Debugger'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-54',
      num: 54,
      question: 'The header commonly used for cout and cin is:',
      options: ['stdio.h', 'stdlib.h', 'iostream', 'string.h'],
      correctIndex: 2
    },
    {
      id: 'cs201-mid-55',
      num: 55,
      question: 'The header commonly used for printf and scanf is:',
      options: ['stdio.h', 'iostream', 'stdlib.h', 'math.h'],
      correctIndex: 0
    },
    {
      id: 'cs201-mid-56',
      num: 56,
      question: 'The statement sum += value is equivalent to:',
      options: ['sum = value;', 'sum = sum + value;', 'sum = sum - value;', 'value = sum + 1;'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-57',
      num: 57,
      question: 'In a nested loop, the inner loop generally:',
      options: ['Runs once for the whole program', 'Completes its iterations for each outer-loop iteration', 'Cannot contain a condition', 'Must be a while loop'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-58',
      num: 58,
      question: 'For int A[5] = {1,2,3,4}; the value of A[4] is:',
      options: ['1', '2', '4', '0'],
      correctIndex: 3
    },
    {
      id: 'cs201-mid-59',
      num: 59,
      question: 'The output of doubling A[5] = {1,2,3,4,0} element by element is:',
      options: ['2 4 6 8 0', '1 2 3 4 5', '2 3 7 4 0', '0 2 4 6 8'],
      correctIndex: 0
    },
    {
      id: 'cs201-mid-60',
      num: 60,
      question: 'For array values 0 through 6, their sum is:',
      options: ['18', '20', '21', '28'],
      correctIndex: 2
    },
    {
      id: 'cs201-mid-61',
      num: 61,
      question: 'In a credit-limit program, the new balance is calculated as:',
      options: ['Beginning balance - charges - credits', 'Beginning balance + charges - credits', 'Charges + credits only', 'Limit - balance'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-62',
      num: 62,
      question: 'A credit-limit warning should be displayed when:',
      options: ['New balance is less than zero', 'New balance exceeds allowed credit limit', 'Charges are zero', 'Account number is even'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-63',
      num: 63,
      question: 'A negative input can be used to terminate an input loop by testing:',
      options: ['if (n < 0)', 'if (n > 0)', 'if (n == 1)', 'if (n != 0)'],
      correctIndex: 0
    },
    {
      id: 'cs201-mid-64',
      num: 64,
      question: 'To calculate separate totals of odd and even inputs, test divisibility using:',
      options: ['n % 2', 'n / 2', 'n * 2', 'n + 2'],
      correctIndex: 0
    },
    {
      id: 'cs201-mid-65',
      num: 65,
      question: 'A switch expression is commonly compared against:',
      options: ['case labels', 'comments', 'header names', 'array sizes'],
      correctIndex: 0
    },
    {
      id: 'cs201-mid-66',
      num: 66,
      question: 'The default label in switch executes when:',
      options: ['Every case matches', 'No case matches', 'The loop ends', 'The compiler starts'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-67',
      num: 67,
      question: 'A syntax error is detected mainly during:',
      options: ['Compilation', 'Program execution only', 'Printing', 'Input entry'],
      correctIndex: 0
    },
    {
      id: 'cs201-mid-68',
      num: 68,
      question: 'A logical error means the program:',
      options: ['Cannot be tokenized', 'Runs but produces incorrect results', 'Always crashes', 'Has no variables'],
      correctIndex: 1
    },
    {
      id: 'cs201-mid-69',
      num: 69,
      question: 'The executable file extension commonly associated with Windows programs is:',
      options: ['.txt', '.h', '.exe', '.cpp'],
      correctIndex: 2
    }
  ]
};
