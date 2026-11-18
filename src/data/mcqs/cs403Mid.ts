import { McqSet } from '../../types';

export const cs403Mid: McqSet = {
  id: 'cs403-midterm',
  courseCode: 'CS403',
  courseTitle: 'Database Management Systems (DBMS)',
  term: 'midterm',
  termLabel: 'Mid-Term',
  description: 'Data models, three-level schema architecture, ER modeling, cardinality, relational algebra, keys, DFDs, and normalization (1NF–BCNF/4NF).',
  topics: [],
  questions: [
    {
      id: 'cs403-mid-1',
      num: 1,
      question: 'A database system is the combination of which two components?',
      options: ['Database and DBMS', 'Database and information', 'Data and attributes', 'Entities and relationships'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-2',
      num: 2,
      question: 'A collection of concepts used to describe the structure of a database is called a:',
      options: ['Data dictionary', 'Database application', 'Data model', 'Cross-reference matrix'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-3',
      num: 3,
      question: 'A relational database system is based on the concepts of:',
      options: ['A tree-like structure of data', 'Tables, rows and columns', 'A network of linked records only', 'Objects only'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-4',
      num: 4,
      question: 'Data about data is called:',
      options: ['An entity instance', 'A relationship', 'A tuple', 'Metadata'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-5',
      num: 5,
      question: 'Which type of data dictionary is created and maintained by the DBMS for its own use?',
      options: ['A free-standing data dictionary', 'An integrated data dictionary', 'A cross-reference matrix', 'A weak entity'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-6',
      num: 6,
      question: 'Which set contains operations performed by a database application, as listed in the corpus?',
      options: [
        'Insertion, extraction and updating of data',
        'Entity identification, cardinality definition and ER drawing',
        'Context DFD creation, process decomposition and diagram labeling',
        'Domain definition, key selection and schema modeling'
      ],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-7',
      num: 7,
      question: 'An attribute is defined by its name and its:',
      options: ['Entity instance', 'Relationship', 'Domain', 'Primary key'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-8',
      num: 8,
      question: 'Identify the incorrect statement about entities and attributes.',
      options: [
        'An employee cannot be considered an entity.',
        'A course in a degree program can be considered an entity.',
        'Student-ID can be considered a single-valued attribute.',
        'A parking area can be considered an entity.'
      ],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-9',
      num: 9,
      question: 'Assume Date_of_birth is stored, age is calculated from it, and a person may have several skills. Which statement is incorrect?',
      options: [
        'A car can be an entity with physical existence.',
        'Age can be a single-valued attribute.',
        'Skill can be a multivalued attribute.',
        'Date_of_birth is the derived attribute in this situation.'
      ],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-10',
      num: 10,
      question: 'An attribute calculated from another attribute is called a:',
      options: ['Composite attribute', 'Derived attribute', 'Multivalued attribute', 'Key attribute'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-11',
      num: 11,
      question: 'An association between entities is called a:',
      options: ['Domain', 'Primary key', 'Relationship', 'Tuple'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-12',
      num: 12,
      question: 'What does maximum cardinality specify in an ER relationship?',
      options: [
        'The greatest number of instances of one entity that may be associated with one instance of another entity',
        'The number of attributes in an entity',
        'The minimum number of rows required in a table',
        'The number of candidate keys in a relation'
      ],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-13',
      num: 13,
      question: 'A student may register for up to five courses in a semester, and each course may have many students. What is the Student–Course relationship?',
      options: ['One-to-one', 'One-to-many', 'Many-to-one', 'Many-to-many'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-14',
      num: 14,
      question: 'In a one-to-many relationship from Teacher to Class, which statement is correct?',
      options: [
        'Each class must have many teachers.',
        'One teacher may have many classes, while each class is associated with one teacher.',
        'Each teacher can have only one class, while a class may have many teachers.',
        'Many teachers may be associated with many classes.'
      ],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-15',
      num: 15,
      question: 'Which of the following is a semantic data model?',
      options: ['Hierarchical data model', 'Network data model', 'Entity–Relationship data model', 'Relational data model'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-16',
      num: 16,
      question: 'The ER data model is primarily used for which stage of database design?',
      options: ['Conceptual database design', 'Physical database design', 'Disk-space monitoring', 'Database backup'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-17',
      num: 17,
      question: 'Which type of data independence provides change transparency between the conceptual and external levels?',
      options: ['Physical data independence', 'Referential integrity', 'Concurrency control', 'Logical data independence'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-18',
      num: 18,
      question: 'In the three-level schema architecture, which level contains user views and presents data to users?',
      options: ['Internal level', 'External level', 'Conceptual level', 'Physical storage level'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-19',
      num: 19,
      question: 'When mapping an ER model to a relational model, a composite attribute is normally mapped to:',
      options: [
        'A separate relation containing only a foreign key',
        'A single multivalued cell',
        'Its set of simple component attributes',
        'A relationship with no attributes'
      ],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-20',
      num: 20,
      question: 'In ER-to-relational mapping, an ordinary entity type is normally mapped to a:',
      options: ['Relation', 'Domain only', 'Selection condition', 'Single attribute value'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-21',
      num: 21,
      question: 'How is a multivalued attribute normally mapped to the relational model?',
      options: [
        'By storing all its values in one comma-separated cell',
        'By removing every value except the first',
        'By making its domain the primary key of the original table',
        'By creating a separate relation with a foreign key referencing the owning entity'
      ],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-22',
      num: 22,
      question: 'Which structure can represent an optional one-to-one unary relationship within a single entity table?',
      options: [
        'An unrestricted text column with no reference constraint',
        "A nullable, unique foreign key referencing the same table's primary key",
        'A foreign key that references only an unrelated entity',
        'A multivalued list stored in the primary-key cell'
      ],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-23',
      num: 23,
      question: 'How is a many-to-many relationship between two entity types normally implemented in the relational model?',
      options: [
        'By storing several foreign-key values in one cell',
        'By deleting the relationship from the model',
        'By creating a separate linking relation containing foreign keys to both entity tables',
        'By adding only a unique foreign key to one entity table'
      ],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-24',
      num: 24,
      question: 'What are the two types of completeness constraints in ER specialization/generalization?',
      options: ['Total and partial', 'Unique and non-unique', 'Simple and composite', 'Internal and external'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-25',
      num: 25,
      question: 'Which concept allows a subtype to automatically acquire properties of its supertype?',
      options: ['Encapsulation', 'Abstraction', 'Functional dependency', 'Inheritance'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-26',
      num: 26,
      question: 'What does a NOT NULL constraint directly prevent?',
      options: [
        'Duplicate values in every column',
        'NULL values in the constrained column',
        'All updates to the table',
        'Foreign-key references between tables'
      ],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-27',
      num: 27,
      question: 'Which constraint enforces entity integrity by making the primary-key values unique and non-null?',
      options: ['FOREIGN KEY', 'CHECK', 'PRIMARY KEY', 'DEFAULT'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-28',
      num: 28,
      question: "Which statement about a relation's primary key is correct?",
      options: [
        'A candidate key can be selected as the primary key.',
        'A primary key must always contain exactly one attribute.',
        'A primary key cannot be selected from candidate keys.',
        'Every non-key attribute must be part of the primary key.'
      ],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-29',
      num: 29,
      question: 'A Student Registration table stores one row per student. If Student-ID is unique and never NULL, which attribute is the most appropriate primary key?',
      options: ['Student-Father-Name', 'Student-Class', 'Student-Name', 'Student-ID'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-30',
      num: 30,
      question: 'The Degree table contains Degree-ID values 01, 02 and 03. Student.Degree-ID is a nullable foreign key referencing it. Which value would violate referential integrity?',
      options: ['NULL', '05', '01', '02'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-31',
      num: 31,
      question: 'Which constraint or value-setting feature is commonly used to improve data-entry efficiency by supplying a value when one is omitted?',
      options: ['PRIMARY KEY', 'FOREIGN KEY', 'DEFAULT', 'NOT NULL'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-32',
      num: 32,
      question: 'Which constraint is used to require column values to satisfy a specified condition?',
      options: ['CHECK', 'PRIMARY KEY', 'FOREIGN KEY', 'DEFAULT'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-33',
      num: 33,
      question: 'A mathematical relation is a set of tuples. What does this imply?',
      options: [
        'Every tuple may have a different set of attributes.',
        'Duplicate tuples must be stored.',
        'Every attribute must be multivalued.',
        'No two tuples can be identical in all their attribute values.'
      ],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-34',
      num: 34,
      question: 'In a relation satisfying first normal form, which part contains one atomic value?',
      options: [
        'The entire table',
        'Each cell at a row–column intersection',
        'The entire row',
        'The entire column'
      ],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-35',
      num: 35,
      question: 'Why is the relational data model considered simple?',
      options: [
        'It does not use attributes.',
        'It requires all data to be stored in a tree.',
        'It represents data uniformly using tables with rows and columns.',
        'It stores every relationship as a multivalued cell.'
      ],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-36',
      num: 36,
      question: 'Using the DFD level names in the corpus, which diagram shows the least detail?',
      options: ['Context DFD', 'Level 0 DFD', 'Level 1 DFD', 'Level 2 DFD'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-37',
      num: 37,
      question: 'In a context-level DFD, the entire system is represented by:',
      options: ['Two processes', 'Three processes', 'One process for each table', 'One process only'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-38',
      num: 38,
      question: 'Which statement about data-flow diagrams is correct?',
      options: [
        'A system must always be represented by only one DFD.',
        'DFDs are created at increasing levels of detail.',
        'Every data flow must be bidirectional.',
        'DFDs are used only to show relationships between external entities.'
      ],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-39',
      num: 39,
      question: 'Set A contains 2 elements and set B contains 3 elements. How many ordered pairs are in A × B?',
      options: ['5', '8', '6', '9'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-40',
      num: 40,
      question: 'Which of the following is not a standard relational-algebra operation?',
      options: ['Arithmetic addition', 'Union', 'Cartesian product', 'Set difference'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-41',
      num: 41,
      question: 'Which relational-algebra operation selects certain rows or tuples and therefore acts horizontally on a table?',
      options: ['Projection', 'Union', 'Cartesian product', 'Selection'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-42',
      num: 42,
      question: 'Which Greek letter denotes the selection operation in relational algebra?',
      options: ['π', 'σ', 'θ', 'ρ'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-43',
      num: 43,
      question: 'Which relational-algebra operation returns specified columns of a relation?',
      options: ['Selection', 'Cartesian product', 'Projection', 'Set difference'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-44',
      num: 44,
      question: 'Which notation correctly represents a theta join of relations R and S using condition θ?',
      options: ['R ⋈θ S', 'R × S', 'R ∪ S', 'R − S'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-45',
      num: 45,
      question: 'An equijoin uses which type of comparison in its join condition?',
      options: ['Less than only', 'Greater than only', 'Not equal only', 'Equality'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-46',
      num: 46,
      question: 'What does the left semijoin Employee ⋉ Dept-Head return?',
      options: [
        'All columns from both relations',
        'Only Employee rows that have a match, retaining only Employee attributes',
        'Only Dept-Head rows, retaining only Dept-Head attributes',
        'Every possible pair of Employee and Dept-Head rows'
      ],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-47',
      num: 47,
      question: "Employee contains (Emp-ID=1, Emp-Name='ABC', City='Lahore'), and Dept-Head contains (Head-ID=1, Dept-Name='HR Dept'). Under Employee.Emp-ID = Dept-Head.Head-ID, what does this match contribute to the left semijoin result?",
      options: [
        "(1, 'ABC', 'Lahore', 1, 'HR Dept')",
        "(1, 'HR Dept')",
        "(1, 'ABC', 'Lahore')",
        'No row, because the column names differ'
      ],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-48',
      num: 48,
      question: "A Student table stores 'Cricket, Movies' together in one Hobby cell as two separate hobby values. Which normal-form requirement is violated?",
      options: [
        'First normal form: each cell must contain one atomic value',
        'Second normal form: every table must have a composite key',
        'Third normal form: every attribute must be a primary key',
        'BCNF: every table must contain only one row'
      ],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-49',
      num: 49,
      question: 'The source Student table lists 2 hobbies for student 1, 2 for student 2, 3 for student 3 and 1 for student 4. If StudentHobby stores one row per student–hobby pair, how many rows are required?',
      options: ['4', '6', '7', '8'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-50',
      num: 50,
      question: 'Which condition correctly defines second normal form?',
      options: [
        'The relation allows several values in each attribute cell.',
        'The relation is in 1NF, and every non-prime attribute is fully functionally dependent on every candidate key.',
        'Every non-prime attribute depends on only part of a candidate key.',
        'Every determinant must be a non-key attribute.'
      ],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-51',
      num: 51,
      question: 'If X → Y and X → Z, which functional dependency follows by the union rule?',
      options: ['Y → X', 'Z → X', 'X → YZ', 'Y → Z'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-52',
      num: 52,
      question: 'The inference D → EF implies D → E and D → F. Which rule is this?',
      options: ['Decomposition, also called projectivity', 'Augmentation', 'Transitivity', 'Union'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-53',
      num: 53,
      question: 'Which of the following is not a benefit of normalization?',
      options: ['Reducing insertion anomalies', 'Reducing deletion anomalies', 'Reducing update anomalies', 'Maximizing redundancy'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-54',
      num: 54,
      question: 'For every non-trivial functional dependency X → Y in a relation satisfying BCNF, X must be a:',
      options: ['Non-prime attribute', 'Superkey', 'Foreign key', 'Proper subset of every candidate key'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-55',
      num: 55,
      question: 'Which normal form specifically addresses non-trivial multivalued dependencies whose determinants are not superkeys?',
      options: ['2NF', '3NF', '4NF', '5NF'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-56',
      num: 56,
      question: "Assuming the stated dependency holds, how is 'Student CGPA is identified through student name' written in functional-dependency notation?",
      options: ['StdName → StdCGPA', 'StdCGPA → StdName', 'StdName ∪ StdCGPA', 'StdName × StdCGPA'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-57',
      num: 57,
      question: 'Consider Course(Course-ID, Course-Title, Instructor-ID, Instructor-Specialization). Assume it is in 1NF, Course-ID is its only candidate key, and Instructor-ID → Instructor-Specialization holds. What is its highest normal form before decomposition?',
      options: ['1NF only', '3NF', 'BCNF', '2NF'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-58',
      num: 58,
      question: "In the source Course table, Instructor-ID 1 has specialization POR in both Course-ID 101 and Course-ID 301. If that instructor's specialization changes, how many existing rows must be updated to keep both records consistent?",
      options: ['One', 'Two', 'Three', 'Five'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-59',
      num: 59,
      question: 'Given Instructor-ID → Instructor-Specialization, which decomposition separates instructor specialization from course data while retaining Instructor-ID as the link?',
      options: [
        'Course(Course-ID, Course-Title, Instructor-Specialization) and Instructor(Instructor-ID)',
        'Course(Course-ID, Instructor-Specialization) and Instructor(Course-Title, Instructor-ID)',
        'Course(Course-ID, Course-Title, Instructor-ID) and Instructor(Instructor-ID, Instructor-Specialization)',
        'Course(Course-ID, Course-Title) and Instructor(Instructor-Specialization)'
      ],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-60',
      num: 60,
      question: "In the source Course table, Instructor-ID 3 and specialization YZX appear only in the row for Course-ID 401. If deleting that course also removes the only stored information about this instructor's specialization, which anomaly occurs?",
      options: ['Deletion anomaly', 'Insertion anomaly', 'Update anomaly', 'A NOT NULL violation'],
      correctIndex: 0
    }
  ]
};
