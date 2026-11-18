import { McqSet } from '../../types';

export const cs304Mid: McqSet = {
  id: 'cs304-midterm',
  courseCode: 'CS304',
  courseTitle: 'Object Oriented Programming (OOP)',
  term: 'midterm',
  termLabel: 'Mid-Term',
  description: 'Classes, objects, encapsulation, abstraction, inheritance, composition, aggregation, polymorphism, and operator overloading.',
  topics: [],
  questions: [
    {
      id: 'cs304-mid-1',
      num: 1,
      question: 'In the expression c1*c2+c3-c4, which operation is performed first?',
      options: ['c1*c2', 'c2+c3', 'c3-c4', 'c1+c3'],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-2',
      num: 2,
      question: 'Inheritance is a way to',
      options: [
        'organize data only',
        'add features to existing classes without rewriting them',
        'hide every class from users',
        'allocate dynamic memory'
      ],
      correctIndex: 1
    },
    {
      id: 'cs304-mid-3',
      num: 3,
      question: "Which relationship is represented by the phrase 'IS A'?",
      options: ['Aggregation', 'Composition', 'Inheritance', 'Association'],
      correctIndex: 2
    },
    {
      id: 'cs304-mid-4',
      num: 4,
      question: 'A constructor without any parameter is called a',
      options: ['copy constructor', 'default constructor', 'destructor', 'friend function'],
      correctIndex: 1
    },
    {
      id: 'cs304-mid-5',
      num: 5,
      question: 'Which of the following stores the address of a variable?',
      options: ['Reference', 'Pointer', 'Class', 'Constructor'],
      correctIndex: 1
    },
    {
      id: 'cs304-mid-6',
      num: 6,
      question: 'A postfix unary operator is implemented in C++ using a member function with',
      options: ['no argument', 'one dummy int argument', 'two object arguments', 'one string argument'],
      correctIndex: 1
    },
    {
      id: 'cs304-mid-7',
      num: 7,
      question: 'What is the minimum number of classes required to implement multiple inheritance?',
      options: ['1', '2', '3', '4'],
      correctIndex: 2
    },
    {
      id: 'cs304-mid-8',
      num: 8,
      question: 'Which statement best describes a constant member function?',
      options: [
        'It can change all data members',
        'It cannot be called by objects',
        "It promises not to modify the object's data",
        'It must be static'
      ],
      correctIndex: 2
    },
    {
      id: 'cs304-mid-9',
      num: 9,
      question: 'Composition is a strong relationship because',
      options: [
        'parts always have different classes',
        'the composed object cannot exist independently',
        'it uses only static members',
        'it prevents inheritance'
      ],
      correctIndex: 1
    },
    {
      id: 'cs304-mid-10',
      num: 10,
      question: "How many interactions are represented by: 'Imran has a car, he drives the car, and the car has four wheels and doors'?",
      options: ['1', '2', '3', '4'],
      correctIndex: 2
    },
    {
      id: 'cs304-mid-11',
      num: 11,
      question: 'If a model is extended while the rest of the model is not affected, this is called',
      options: ['Flexibility', 'Recursion', 'Overloading', 'Compilation'],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-12',
      num: 12,
      question: 'Which declaration correctly overloads operator*= as a member function for class Complex?',
      options: [
        'Complex operator*=(const Complex& c)',
        'Complex operator*=(Complex, Complex)',
        'void operator*(Complex& c)',
        'Complex operator=(int c)'
      ],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-13',
      num: 13,
      question: 'A class is a blueprint of',
      options: ['objects', 'pointers', 'operators', 'memory addresses'],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-14',
      num: 14,
      question: 'Which is the correct declaration of a pointer to an object of class Student?',
      options: ['Student object;', 'Student *object;', 'pointer Student;', 'Student &object;'],
      correctIndex: 1
    },
    {
      id: 'cs304-mid-15',
      num: 15,
      question: 'In C++, composition is a relationship between',
      options: ['class and function', 'whole and part objects', 'pointer and reference', 'base and compiler'],
      correctIndex: 1
    },
    {
      id: 'cs304-mid-16',
      num: 16,
      question: 'Which statement properly defines a class?',
      options: [
        'A class is a description of a kind of object',
        'A class is only a memory address',
        'A class is a loop',
        'A class is always a pointer'
      ],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-17',
      num: 17,
      question: 'In a class, attributes and behaviors are represented by',
      options: [
        'pointers and arrays',
        'data members and member functions',
        'constructors and destructors only',
        'objects and classes'
      ],
      correctIndex: 1
    },
    {
      id: 'cs304-mid-18',
      num: 18,
      question: 'Which example represents an association between two classes?',
      options: [
        'Employee works for a company',
        'Car has an engine as an inseparable part',
        'Dog is an Animal',
        'A class contains its own integer'
      ],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-19',
      num: 19,
      question: 'Which of the following is a tangible entity?',
      options: ['Car', 'Honesty', 'Speed', 'Ownership'],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-20',
      num: 20,
      question: 'Which OOP feature is used to derive one class from another?',
      options: ['Inheritance', 'Encapsulation', 'Abstraction', 'Exception handling'],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-21',
      num: 21,
      question: 'In C++, which operator is the stream insertion operator?',
      options: ['>>', '<<', '::', '->'],
      correctIndex: 1
    },
    {
      id: 'cs304-mid-22',
      num: 22,
      question: 'Which relationship exists between a part object and a whole object?',
      options: ['Composition', 'Compilation', 'Polymorphism', 'Overloading'],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-23',
      num: 23,
      question: 'When an object hides its information from others, this concept is called',
      options: ['Information hiding', 'Multiple inheritance', 'Operator precedence', 'Dynamic allocation'],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-24',
      num: 24,
      question: 'The concept of derived classes is involved in',
      options: ['Inheritance', 'Aggregation only', 'Input/output', 'Tokenization'],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-25',
      num: 25,
      question: 'Abstraction provides information according to the',
      options: ['compiler perspective', 'user perspective', 'memory perspective', 'file perspective'],
      correctIndex: 1
    },
    {
      id: 'cs304-mid-26',
      num: 26,
      question: 'Which of the following is not an object-oriented relationship?',
      options: ['Inheritance', 'Association', 'Composition', 'Addition'],
      correctIndex: 3
    },
    {
      id: 'cs304-mid-27',
      num: 27,
      question: 'An amphibious vehicle may inherit characteristics from',
      options: ['Land vehicle and water vehicle', 'Only a pointer', 'Only a constructor', 'A loop and an array'],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-28',
      num: 28,
      question: 'Object data includes',
      options: ['only methods', 'only addresses', 'states and attributes', 'only constructors'],
      correctIndex: 2
    },
    {
      id: 'cs304-mid-29',
      num: 29,
      question: 'How many objects of a given class may be constructed in an application?',
      options: ['Exactly one', 'Exactly two', 'As many as the application needs', 'None'],
      correctIndex: 2
    },
    {
      id: 'cs304-mid-30',
      num: 30,
      question: "student *ptr = new student('Ali'); is an example of",
      options: ['static memory allocation', 'dynamic memory allocation', 'compile-time inheritance', 'reference binding'],
      correctIndex: 1
    },
    {
      id: 'cs304-mid-31',
      num: 31,
      question: 'Which is a correct way to declare a constant variable ROLLNO?',
      options: ['const int ROLLNO;', 'constant ROLLNO int;', 'int constless ROLLNO;', 'ROLLNO const variable;'],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-32',
      num: 32,
      question: 'Which operator does not take any argument when overloaded as a unary member operator?',
      options: ['Unary ++', 'Unary --', 'Unary !', 'None of the given choices'],
      correctIndex: 3
    },
    {
      id: 'cs304-mid-33',
      num: 33,
      question: 'Which of the following is part of a class diagram?',
      options: ['Class name', 'Attributes', 'Operations', 'All of the given options'],
      correctIndex: 3
    },
    {
      id: 'cs304-mid-34',
      num: 34,
      question: 'A child inherits characteristics from its',
      options: ['parent', 'sibling', 'neighbor', 'object file'],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-35',
      num: 35,
      question: 'What issue can be caused by misuse of a friend function?',
      options: ['Programming bugs', 'Automatic inheritance', 'Faster compilation always', 'No possible issue'],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-36',
      num: 36,
      question: 'Which is not a main feature of object-oriented programming?',
      options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Exception handling'],
      correctIndex: 3
    },
    {
      id: 'cs304-mid-37',
      num: 37,
      question: 'A static data member is declared',
      options: ['inside the class', 'only inside main', 'inside a loop', 'inside a destructor only'],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-38',
      num: 38,
      question: 'Which keyword tells the compiler to substitute function code at a call site?',
      options: ['inline', 'static', 'friend', 'virtual'],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-39',
      num: 39,
      question: 'Inheritance is a relationship between',
      options: ['functions', 'classes', 'operators', 'variables'],
      correctIndex: 1
    },
    {
      id: 'cs304-mid-40',
      num: 40,
      question: 'How many objects are involved in a binary association?',
      options: ['1', '2', '3', 'More than 3'],
      correctIndex: 1
    },
    {
      id: 'cs304-mid-41',
      num: 41,
      question: 'Aggregation between objects shows a',
      options: ['weak relationship', 'strong ownership relationship', 'compiler error', 'numeric relationship'],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-42',
      num: 42,
      question: 'In polymorphism, a message can be interpreted differently depending on the',
      options: ['receiver class', 'file name', 'compiler version only', 'variable address only'],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-43',
      num: 43,
      question: 'Which is the most suitable advantage of information hiding?',
      options: [
        'It simplifies the model',
        'It exposes all implementation',
        'It removes all classes',
        'It disables interfaces'
      ],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-44',
      num: 44,
      question: 'The process of extracting common characteristics from classes into a generalized superclass is called',
      options: ['Generalization', 'Specialization', 'Aggregation', 'Overloading'],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-45',
      num: 45,
      question: 'Which operator is used to create objects at run time?',
      options: ['malloc only', 'new', 'create', 'runtime'],
      correctIndex: 1
    },
    {
      id: 'cs304-mid-46',
      num: 46,
      question: 'An instance of a user-defined type is called an',
      options: ['object', 'operator', 'attribute', 'interface'],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-47',
      num: 47,
      question: 'Inheritance in a class diagram is commonly shown by a',
      options: ['filled arrow', 'dashed circle', 'rectangle only', 'double slash'],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-48',
      num: 48,
      question: 'Which operator operates on one operand?',
      options: ['Binary +', 'Unary operator', 'Assignment =', 'Conditional ?:'],
      correctIndex: 1
    },
    {
      id: 'cs304-mid-49',
      num: 49,
      question: 'What happens when a constant member function tries to change a data member?',
      options: ['It changes normally', 'A compile-time error occurs', 'It becomes static', 'It creates a new class'],
      correctIndex: 1
    },
    {
      id: 'cs304-mid-50',
      num: 50,
      question: 'How do objects communicate in object-oriented programming?',
      options: ['Through messages', 'Through global variables only', 'Through comments', 'Through file names'],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-51',
      num: 51,
      question: 'How can hidden information within an object be accessed?',
      options: ['Through its interface', 'By editing memory directly', 'Only through a loop', 'It can never be accessed'],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-52',
      num: 52,
      question: 'Object orientation is achieved using objects and their',
      options: ['interactions', 'file extensions', 'comments', 'addresses only'],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-53',
      num: 53,
      question: 'Constructors have which return type?',
      options: ['int', 'void', 'class type', 'No return type'],
      correctIndex: 3
    },
    {
      id: 'cs304-mid-54',
      num: 54,
      question: 'Which is an example of a unary operator?',
      options: ['+', '++', '*', '=='],
      correctIndex: 1
    },
    {
      id: 'cs304-mid-55',
      num: 55,
      question: 'Memory is allocated to non-static members when',
      options: ['the class is declared', 'an object is created', 'the header is included', 'a function is called'],
      correctIndex: 1
    },
    {
      id: 'cs304-mid-56',
      num: 56,
      question: 'If class B inherits from class A, which is the child class?',
      options: ['Class A', 'Class B', 'Both always', 'Neither'],
      correctIndex: 1
    },
    {
      id: 'cs304-mid-57',
      num: 57,
      question: 'Which part tells the compiler what task a function will perform?',
      options: ['Function declaration', 'Function definition', 'Function call', 'Header guard'],
      correctIndex: 1
    },
    {
      id: 'cs304-mid-58',
      num: 58,
      question: "The relationship in 'A room has a chair' is generally",
      options: ['Aggregation', 'Inheritance', 'Generalization', 'Polymorphism'],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-59',
      num: 59,
      question: 'How many objects are involved in an N-ary association?',
      options: ['Exactly 1', 'Exactly 2', 'Exactly 3 only', 'More than 3'],
      correctIndex: 3
    },
    {
      id: 'cs304-mid-60',
      num: 60,
      question: 'A destructor has the same name as its class but starts with',
      options: ['#', '&', '~', '@'],
      correctIndex: 2
    },
    {
      id: 'cs304-mid-61',
      num: 61,
      question: 'A class defined within another class is called a',
      options: ['nested class', 'derived class', 'friend class', 'static class'],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-62',
      num: 62,
      question: 'When an object is initialized, which function is automatically called?',
      options: ['Destructor', 'Constructor', 'Friend function', 'Operator function'],
      correctIndex: 1
    },
    {
      id: 'cs304-mid-63',
      num: 63,
      question: 'The compiler treats a member function defined inside a class as an',
      options: ['inline function', 'external variable', 'abstract class', 'operator'],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-64',
      num: 64,
      question: 'An object has attributes, operations, and',
      options: ['unique identity', 'only a pointer', 'a compiler', 'a loop'],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-65',
      num: 65,
      question: 'Which of the following is not a C++ access specifier?',
      options: ['public', 'private', 'protected', 'hidden'],
      correctIndex: 3
    },
    {
      id: 'cs304-mid-66',
      num: 66,
      question: 'Which part of an object exhibits its state?',
      options: ['Data', 'Operations', 'Any public part', 'Only the constructor'],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-67',
      num: 67,
      question: 'How can classes be identified from a problem statement?',
      options: ['By extracting nouns', 'By extracting only verbs', 'By counting punctuation', 'By removing all names'],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-68',
      num: 68,
      question: 'Generalization is primarily a',
      options: ['bottom-up approach', 'top-down loop', 'memory allocation', 'destructor call'],
      correctIndex: 0
    },
    {
      id: 'cs304-mid-69',
      num: 69,
      question: 'The order of evaluation of operators in an expression is defined by',
      options: ['operator precedence', 'data hiding', 'inheritance', 'object identity'],
      correctIndex: 0
    }
  ]
};
