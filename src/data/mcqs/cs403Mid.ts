import { McqSet } from '../../types';

export const cs403Mid: McqSet = {
  id: 'cs403-midterm',
  courseCode: 'CS403',
  courseTitle: 'Database Management Systems (DBMS)',
  term: 'midterm',
  termLabel: 'Mid-Term',
  description: 'Data models, three-level schema architecture, DFDs, ER modeling, cardinality, relational algebra, keys, integrity constraints, and normalization (1NF–5NF).',
  topics: [
    'Database Fundamentals & Architecture',
    'DFD & Database Development',
    'ER Modeling & Relationships',
    'Relational Model & Integrity Constraints',
    'Relational Algebra',
    'Functional Dependencies & Normalization'
  ],
  questions: [
    {
      id: 'cs403-mid-1',
      num: 1,
      topic: 'Database Fundamentals & Architecture',
      question: 'A database system is the combination of which two components?',
      options: ['Database and DBMS', 'Database and information', 'Data and attributes', 'Entities and relationships'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-2',
      num: 2,
      topic: 'Database Fundamentals & Architecture',
      question: 'A collection of concepts used to describe the structure of a database is called a:',
      options: ['Data dictionary', 'Database application', 'Data model', 'Cross-reference matrix'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-3',
      num: 3,
      topic: 'Relational Model & Integrity Constraints',
      question: 'A relational database system is based on the concepts of:',
      options: ['A tree-like structure of data', 'Tables, rows and columns', 'A network of linked records only', 'Objects only'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-4',
      num: 4,
      topic: 'Database Fundamentals & Architecture',
      question: 'Data about data is called:',
      options: ['An entity instance', 'A relationship', 'A tuple', 'Metadata'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-5',
      num: 5,
      topic: 'DFD & Database Development',
      question: 'Which type of data dictionary is created and maintained by the DBMS for its own use?',
      options: ['A free-standing data dictionary', 'An integrated data dictionary', 'A cross-reference matrix', 'A weak entity'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-6',
      num: 6,
      topic: 'Database Fundamentals & Architecture',
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
      topic: 'ER Modeling & Relationships',
      question: 'An attribute is defined by its name and its:',
      options: ['Entity instance', 'Relationship', 'Domain', 'Primary key'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-8',
      num: 8,
      topic: 'ER Modeling & Relationships',
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
      topic: 'ER Modeling & Relationships',
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
      topic: 'ER Modeling & Relationships',
      question: 'An attribute calculated from another attribute is called a:',
      options: ['Composite attribute', 'Derived attribute', 'Multivalued attribute', 'Key attribute'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-11',
      num: 11,
      topic: 'ER Modeling & Relationships',
      question: 'An association between entities is called a:',
      options: ['Domain', 'Primary key', 'Relationship', 'Tuple'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-12',
      num: 12,
      topic: 'ER Modeling & Relationships',
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
      topic: 'ER Modeling & Relationships',
      question: 'A student may register for up to five courses in a semester, and each course may have many students. What is the Student–Course relationship?',
      options: ['One-to-one', 'One-to-many', 'Many-to-one', 'Many-to-many'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-14',
      num: 14,
      topic: 'ER Modeling & Relationships',
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
      topic: 'Database Fundamentals & Architecture',
      question: 'Which of the following is a semantic data model?',
      options: ['Hierarchical data model', 'Network data model', 'Entity–Relationship data model', 'Relational data model'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-16',
      num: 16,
      topic: 'DFD & Database Development',
      question: 'The ER data model is primarily used for which stage of database design?',
      options: ['Conceptual database design', 'Physical database design', 'Disk-space monitoring', 'Database backup'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-17',
      num: 17,
      topic: 'Database Fundamentals & Architecture',
      question: 'Which type of data independence provides change transparency between the conceptual and external levels?',
      options: ['Physical data independence', 'Referential integrity', 'Concurrency control', 'Logical data independence'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-18',
      num: 18,
      topic: 'Database Fundamentals & Architecture',
      question: 'In the three-level schema architecture, which level contains user views and presents data to users?',
      options: ['Internal level', 'External level', 'Conceptual level', 'Physical storage level'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-19',
      num: 19,
      topic: 'ER Modeling & Relationships',
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
      topic: 'ER Modeling & Relationships',
      question: 'In ER-to-relational mapping, an ordinary entity type is normally mapped to a:',
      options: ['Relation', 'Domain only', 'Selection condition', 'Single attribute value'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-21',
      num: 21,
      topic: 'ER Modeling & Relationships',
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
      topic: 'ER Modeling & Relationships',
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
      topic: 'ER Modeling & Relationships',
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
      topic: 'ER Modeling & Relationships',
      question: 'What are the two types of completeness constraints in ER specialization/generalization?',
      options: ['Total and partial', 'Unique and non-unique', 'Simple and composite', 'Internal and external'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-25',
      num: 25,
      topic: 'ER Modeling & Relationships',
      question: 'Which concept allows a subtype to automatically acquire properties of its supertype?',
      options: ['Encapsulation', 'Abstraction', 'Functional dependency', 'Inheritance'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-26',
      num: 26,
      topic: 'Relational Model & Integrity Constraints',
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
      topic: 'Relational Model & Integrity Constraints',
      question: 'Which constraint enforces entity integrity by making the primary-key values unique and non-null?',
      options: ['FOREIGN KEY', 'CHECK', 'PRIMARY KEY', 'DEFAULT'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-28',
      num: 28,
      topic: 'Relational Model & Integrity Constraints',
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
      topic: 'Relational Model & Integrity Constraints',
      question: 'A Student Registration table stores one row per student. If Student-ID is unique and never NULL, which attribute is the most appropriate primary key?',
      options: ['Student-Father-Name', 'Student-Class', 'Student-Name', 'Student-ID'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-30',
      num: 30,
      topic: 'Relational Model & Integrity Constraints',
      question: 'The Degree table contains Degree-ID values 01, 02 and 03. Student.Degree-ID is a nullable foreign key referencing it. Which value would violate referential integrity?',
      options: ['NULL', '05', '01', '02'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-31',
      num: 31,
      topic: 'Relational Model & Integrity Constraints',
      question: 'Which constraint or value-setting feature is commonly used to improve data-entry efficiency by supplying a value when one is omitted?',
      options: ['PRIMARY KEY', 'FOREIGN KEY', 'DEFAULT', 'NOT NULL'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-32',
      num: 32,
      topic: 'Relational Model & Integrity Constraints',
      question: 'Which constraint is used to require column values to satisfy a specified condition?',
      options: ['CHECK', 'PRIMARY KEY', 'FOREIGN KEY', 'DEFAULT'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-33',
      num: 33,
      topic: 'Relational Model & Integrity Constraints',
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
      topic: 'Functional Dependencies & Normalization',
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
      topic: 'Relational Model & Integrity Constraints',
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
      topic: 'DFD & Database Development',
      question: 'Using the DFD level names in the corpus, which diagram shows the least detail?',
      options: ['Context DFD', 'Level 0 DFD', 'Level 1 DFD', 'Level 2 DFD'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-37',
      num: 37,
      topic: 'DFD & Database Development',
      question: 'In a context-level DFD, the entire system is represented by:',
      options: ['Two processes', 'Three processes', 'One process for each table', 'One process only'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-38',
      num: 38,
      topic: 'DFD & Database Development',
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
      topic: 'Relational Algebra',
      question: 'Set A contains 2 elements and set B contains 3 elements. How many ordered pairs are in A × B?',
      options: ['5', '8', '6', '9'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-40',
      num: 40,
      topic: 'Relational Algebra',
      question: 'Which of the following is not a standard relational-algebra operation?',
      options: ['Arithmetic addition', 'Union', 'Cartesian product', 'Set difference'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-41',
      num: 41,
      topic: 'Relational Algebra',
      question: 'Which relational-algebra operation selects certain rows or tuples and therefore acts horizontally on a table?',
      options: ['Projection', 'Union', 'Cartesian product', 'Selection'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-42',
      num: 42,
      topic: 'Relational Algebra',
      question: 'Which Greek letter denotes the selection operation in relational algebra?',
      options: ['π', 'σ', 'θ', 'ρ'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-43',
      num: 43,
      topic: 'Relational Algebra',
      question: 'Which relational-algebra operation returns specified columns of a relation?',
      options: ['Selection', 'Cartesian product', 'Projection', 'Set difference'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-44',
      num: 44,
      topic: 'Relational Algebra',
      question: 'Which notation correctly represents a theta join of relations R and S using condition θ?',
      options: ['R ⋈θ S', 'R × S', 'R ∪ S', 'R − S'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-45',
      num: 45,
      topic: 'Relational Algebra',
      question: 'An equijoin uses which type of comparison in its join condition?',
      options: ['Less than only', 'Greater than only', 'Not equal only', 'Equality'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-46',
      num: 46,
      topic: 'Relational Algebra',
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
      topic: 'Relational Algebra',
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
      topic: 'Functional Dependencies & Normalization',
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
      topic: 'Functional Dependencies & Normalization',
      question: 'The source Student table lists 2 hobbies for student 1, 2 for student 2, 3 for student 3 and 1 for student 4. If StudentHobby stores one row per student–hobby pair, how many rows are required?',
      options: ['4', '6', '7', '8'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-50',
      num: 50,
      topic: 'Functional Dependencies & Normalization',
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
      topic: 'Functional Dependencies & Normalization',
      question: 'If X → Y and X → Z, which functional dependency follows by the union rule?',
      options: ['Y → X', 'Z → X', 'X → YZ', 'Y → Z'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-52',
      num: 52,
      topic: 'Functional Dependencies & Normalization',
      question: 'The inference D → EF implies D → E and D → F. Which rule is this?',
      options: ['Decomposition, also called projectivity', 'Augmentation', 'Transitivity', 'Union'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-53',
      num: 53,
      topic: 'Functional Dependencies & Normalization',
      question: 'Which of the following is not a benefit of normalization?',
      options: ['Reducing insertion anomalies', 'Reducing deletion anomalies', 'Reducing update anomalies', 'Maximizing redundancy'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-54',
      num: 54,
      topic: 'Functional Dependencies & Normalization',
      question: 'For every non-trivial functional dependency X → Y in a relation satisfying BCNF, X must be a:',
      options: ['Non-prime attribute', 'Superkey', 'Foreign key', 'Proper subset of every candidate key'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-55',
      num: 55,
      topic: 'Functional Dependencies & Normalization',
      question: 'Which normal form specifically addresses non-trivial multivalued dependencies whose determinants are not superkeys?',
      options: ['2NF', '3NF', '4NF', '5NF'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-56',
      num: 56,
      topic: 'Functional Dependencies & Normalization',
      question: "Assuming the stated dependency holds, how is 'Student CGPA is identified through student name' written in functional-dependency notation?",
      options: ['StdName → StdCGPA', 'StdCGPA → StdName', 'StdName ∪ StdCGPA', 'StdName × StdCGPA'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-57',
      num: 57,
      topic: 'Functional Dependencies & Normalization',
      question: 'Consider Course(Course-ID, Course-Title, Instructor-ID, Instructor-Specialization). Assume it is in 1NF, Course-ID is its only candidate key, and Instructor-ID → Instructor-Specialization holds. What is its highest normal form before decomposition?',
      options: ['1NF only', '3NF', 'BCNF', '2NF'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-58',
      num: 58,
      topic: 'Functional Dependencies & Normalization',
      question: "In the source Course table, Instructor-ID 1 has specialization POR in both Course-ID 101 and Course-ID 301. If that instructor's specialization changes, how many existing rows must be updated to keep both records consistent?",
      options: ['One', 'Two', 'Three', 'Five'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-59',
      num: 59,
      topic: 'Functional Dependencies & Normalization',
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
      topic: 'Functional Dependencies & Normalization',
      question: "In the source Course table, Instructor-ID 3 and specialization YZX appear only in the row for Course-ID 401. If deleting that course also removes the only stored information about this instructor's specialization, which anomaly occurs?",
      options: ['Deletion anomaly', 'Insertion anomaly', 'Update anomaly', 'A NOT NULL violation'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-61',
      num: 61,
      topic: 'Database Fundamentals & Architecture',
      question: 'Which is NOT a function of a Database Management System (DBMS)?',
      options: [
        'A user-accessible catalog',
        'Concurrency control services',
        'Failure response service',
        'Support for data communication'
      ],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-62',
      num: 62,
      topic: 'Database Fundamentals & Architecture',
      question: 'Which is the first computer-based approach for handling commercial or business applications?',
      options: ['Scientific systems', 'Database system', 'Record-based system', 'File processing system'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-63',
      num: 63,
      topic: 'Database Fundamentals & Architecture',
      question: 'Which of the following is called a replacement of the manual file system?',
      options: ['Record-based system', 'File processing system', 'Commercial applications', 'Computer network system'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-64',
      num: 64,
      topic: 'Database Fundamentals & Architecture',
      question: 'Which of the following is an advantage of using the Traditional File Organization?',
      options: ['Time consuming', 'Data security', 'Simplicity', 'Efficiency'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-65',
      num: 65,
      topic: 'Database Fundamentals & Architecture',
      question: 'Which of the following is INCORRECT with respect to file systems?',
      options: [
        'At the physical level, pointer or hashed address schemes may be employed to provide a certain degree of data independence at the user level.',
        'A logical record is concerned with efficient storage of information in secondary storage devices.',
        'Some physical organizations use pointers to record blocks to locate records on disk.',
        'The efficiency of a file system depends on how efficiently operations such as retrieve, insert, update, and delete can be performed.'
      ],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-66',
      num: 66,
      topic: 'Database Fundamentals & Architecture',
      question: 'Data redundancy means:',
      options: ['Security of data', 'Duplication of data', 'Management of data', 'Recovery of data'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-67',
      num: 67,
      topic: 'Database Fundamentals & Architecture',
      question: 'Duplication of data in controlled redundancy is controlled and:',
      options: ['Deliberate', 'Necessary', 'Precise', 'Unintentional'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-68',
      num: 68,
      topic: 'Database Fundamentals & Architecture',
      question: 'Controlling redundancy in a database management system DOES NOT help to:',
      options: [
        'Avoid duplication',
        'Avoid unnecessary wastage of storage space',
        'Avoid unauthorized access to data',
        'Avoid inconsistency among data'
      ],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-69',
      num: 69,
      topic: 'Database Fundamentals & Architecture',
      question: 'Data inconsistency leads to a number of problems such as:',
      options: [
        'Data isolation',
        'Less secure data',
        'Slow database development',
        'Loss of information and incorrect results'
      ],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-70',
      num: 70,
      topic: 'Database Fundamentals & Architecture',
      question: 'Major benefit of data sharing is:',
      options: [
        'Data of the same applications placed at the same place',
        'Data of the same applications placed at different places',
        'Data of different applications placed at the same place',
        'Data of different applications stored at separate places'
      ],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-71',
      num: 71,
      topic: 'Database Fundamentals & Architecture',
      question: 'A database system saves lots of effort and finances; this advantage provides:',
      options: [
        'Economy of scale',
        'Time-saving structure',
        'Better concurrency control',
        'Faster application development'
      ],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-72',
      num: 72,
      topic: 'Database Fundamentals & Architecture',
      question: 'Which one of the following is NOT an advantage of a DBMS?',
      options: [
        'Data consistency',
        'Recovery procedure is difficult',
        'Faster development of new applications',
        'Better backup and recovery procedures'
      ],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-73',
      num: 73,
      topic: 'Database Fundamentals & Architecture',
      question: 'A database system allows all of the following EXCEPT:',
      options: [
        'Management and control of data towards efficient working of an organization',
        'Computerizing critical functions and keeping large volumes of data up to date',
        'Any user to access all its data',
        'Integration of data across multiple applications into a single application'
      ],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-74',
      num: 74,
      topic: 'Database Fundamentals & Architecture',
      question: 'A database system is designed to meet the information needs of __________ in an organization.',
      options: ['Single user', 'Multiple users', 'Application user', 'Database administrator'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-75',
      num: 75,
      topic: 'Database Fundamentals & Architecture',
      question: 'Database is a computerized representation of any organization’s flow of _______ and storage of _______.',
      options: ['Data, information', 'Details, data', 'Data, details', 'Information, data'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-76',
      num: 76,
      topic: 'Database Fundamentals & Architecture',
      question: 'Collection of raw facts is called:',
      options: ['Information', 'Object', 'Output', 'Data'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-77',
      num: 77,
      topic: 'Database Fundamentals & Architecture',
      question: 'A software package designed to store and manage databases is called a:',
      options: ['Database', 'DBMS', 'Data model', 'Data'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-78',
      num: 78,
      topic: 'Database Fundamentals & Architecture',
      question: 'The database system deals with a large amount of data. This property is called:',
      options: ['Scalability', 'Robustness', 'Database design', 'Concurrency'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-79',
      num: 79,
      topic: 'Database Fundamentals & Architecture',
      question: 'Each component of a DBMS performs _______ functions.',
      options: ['Similar', 'Different', 'Identical', 'Computational'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-80',
      num: 80,
      topic: 'Database Fundamentals & Architecture',
      question: 'The database management system (DBMS) is used to:',
      options: ['Store the data', 'Access the data', 'Manage its users', 'All of the above'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-81',
      num: 81,
      topic: 'Database Fundamentals & Architecture',
      question: 'Which feature of a database provides conversion from an inconsistent state of DB to a consistent state ensuring minimum data loss?',
      options: ['User-accessible catalog', 'Data processing', 'Recovery service', 'Authorization service'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-82',
      num: 82,
      topic: 'Database Fundamentals & Architecture',
      question: 'User rights information is stored in the:',
      options: ['Physical database', 'Catalog', 'Logical database', 'Buffer'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-83',
      num: 83,
      topic: 'Database Fundamentals & Architecture',
      question: 'How can data security be assured in a database?',
      options: [
        'By hiding data from all',
        'Through concurrent access of users',
        'By asking users not to share things',
        'Implementing encryption algorithms'
      ],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-84',
      num: 84,
      topic: 'Database Fundamentals & Architecture',
      question: 'Which of the following is the best description of data security in a DBMS?',
      options: [
        'Efficient check on all users’ access',
        'Multiple users accessing the data at the same time',
        'User can access previously stored data even if a website is hacked',
        'Changes made to one location are automatically updated to another location'
      ],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-85',
      num: 85,
      topic: 'Database Fundamentals & Architecture',
      question: 'Database management systems, operating systems, applications and utilities are all examples of:',
      options: ['Hardware', 'Software', 'Computer infrastructure', 'Input and output'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-86',
      num: 86,
      topic: 'Database Fundamentals & Architecture',
      question: 'Who is responsible for authorizing access to the database, and for coordinating and monitoring its use?',
      options: ['Database Designer', 'Database Administrator', 'End User', 'Application Programmer'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-87',
      num: 87,
      topic: 'Database Fundamentals & Architecture',
      question: 'From the following, who is responsible for the proper working of the database and DBMS?',
      options: ['Sophisticated user', 'Database designer', 'Admin of the application', 'Database administrator'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-88',
      num: 88,
      topic: 'Database Fundamentals & Architecture',
      question: 'Which of the following describes the job of a database administrator?',
      options: [
        'Development, implementation and operation of the physical database',
        'Creation of the system catalog',
        'Monitoring and controlling database security and authorization; setting up controls to ensure the quality and integrity of data',
        'All of the above'
      ],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-89',
      num: 89,
      topic: 'Database Fundamentals & Architecture',
      question: 'Which of the following functions are NOT performed by a database administrator?',
      options: [
        'Planning, designing and implementing database systems',
        'Establishing standards and procedures for database systems',
        'Communicating with database users',
        'Allocation of storage locations and data structures'
      ],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-90',
      num: 90,
      topic: 'Database Fundamentals & Architecture',
      question: 'The __________ can see the entire information structure of the database.',
      options: ['Database Administrator (DBA)', 'Database Task Group (DBTG)', 'Database user', 'External viewer'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-91',
      num: 91,
      topic: 'Database Fundamentals & Architecture',
      question: 'Among the following database users, who have a clear idea of the structure of the database and know all the needs of an organization?',
      options: ['End users', 'Naive users', 'Application programmers', 'Sophisticated users'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-92',
      num: 92,
      topic: 'Database Fundamentals & Architecture',
      question: 'A ________ is used to maintain a connection between the users of the database system.',
      options: ['Virtual server', 'File server', 'Client server', 'FTP server'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-93',
      num: 93,
      topic: 'Database Fundamentals & Architecture',
      question: 'Teleprocessing is a sub-type of:',
      options: ['Single-user database', 'Multi-user database', 'File server', 'Client server'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-94',
      num: 94,
      topic: 'Database Fundamentals & Architecture',
      question: 'Which of the following database environments causes a network overhead?',
      options: ['Single user', 'File server', 'Client server', 'Teleprocessing'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-95',
      num: 95,
      topic: 'Database Fundamentals & Architecture',
      question: 'Which one of the following is NOT a part of the three-level ANSI/SPARC architecture?',
      options: ['External level', 'Conceptual level', 'Internal level', 'Physical level'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-96',
      num: 96,
      topic: 'Database Fundamentals & Architecture',
      question: 'Core of the Database Architecture is the:',
      options: ['Internal level', 'External level', 'Conceptual level', 'ANSI/SPARC'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-97',
      num: 97,
      topic: 'Database Fundamentals & Architecture',
      question: 'Select the correct statement about the ANSI/SPARC architecture.',
      options: [
        'The conceptual level is a level of indirection between the internal level and the external level.',
        'The internal level in a database system will definitely be relational.',
        'Any given database has many conceptual schemas and one physical schema, but only one external schema.',
        'The external level is not concerned with individual user perceptions, while the conceptual level is concerned with a community user perception.'
      ],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-98',
      num: 98,
      topic: 'Database Fundamentals & Architecture',
      question: 'In the three-level architecture of the database, which view is called the community view of the database?',
      options: ['Design view', 'Internal view', 'External view', 'Conceptual view'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-99',
      num: 99,
      topic: 'Database Fundamentals & Architecture',
      question: 'In the three-level architecture of the database, which level is helpful to display data that is not actually stored in the database?',
      options: ['Internal level', 'Conceptual level', 'Physical level', 'External level'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-100',
      num: 100,
      topic: 'Database Fundamentals & Architecture',
      question: 'Internal schema/view defines the ______ of the data.',
      options: ['Source', 'Structure', 'Transaction', 'Functionality'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-101',
      num: 101,
      topic: 'Database Fundamentals & Architecture',
      question: 'The three-level architecture is useful for:',
      options: [
        'Arranging the data in an organized manner',
        'Hiding the details of internal systems',
        'Breaking data access restrictions',
        'Storing definitions of structures'
      ],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-102',
      num: 102,
      topic: 'Database Fundamentals & Architecture',
      question: 'Which of the following provides data independence?',
      options: [
        '3-Level Architecture',
        'Inter-Schema Mapping',
        'Cross-Reference Matrix',
        'Traditional File Organization'
      ],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-103',
      num: 103,
      topic: 'Database Fundamentals & Architecture',
      question: 'External schema evolves as user needs are _______ over time.',
      options: ['Ended', 'Modified', 'Switched', 'Stabilized'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-104',
      num: 104,
      topic: 'Database Fundamentals & Architecture',
      question: 'Which model operates at the lowest level of abstraction?',
      options: ['External', 'Internal', 'Physical', 'Conceptual'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-105',
      num: 105,
      topic: 'Database Fundamentals & Architecture',
      question: 'A description of a particular collection of data using a given data model is a:',
      options: ['Database', 'Relation', 'Schema', 'Tuple'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-106',
      num: 106,
      topic: 'Database Fundamentals & Architecture',
      question: 'The population of the data of the organization for which the database is created is called the ________ of the database.',
      options: ['Extension', 'Intension', 'Model', 'Schema'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-107',
      num: 107,
      topic: 'Database Fundamentals & Architecture',
      question: 'The ____________ of the database is most difficult to change once a database is created.',
      options: ['Intension', 'Expansion', 'Extension', 'Indentation'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-108',
      num: 108,
      topic: 'Database Fundamentals & Architecture',
      question: 'Which one of the following is NOT a characteristic of metadata?',
      options: ['Data about data', 'Describes a data dictionary', 'Self-describing', 'Includes user data'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-109',
      num: 109,
      topic: 'Database Fundamentals & Architecture',
      question: 'Which of the following is an example of metadata (a table/entity definition rather than a value)?',
      options: ['Ali', 'Lahore', '1042', 'Student'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-110',
      num: 110,
      topic: 'Database Fundamentals & Architecture',
      question: 'The level of data at which entities or objects exist in reality is called:',
      options: ['Real-world data', 'Schema for real-world data', 'Metadata', 'Data about data'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-111',
      num: 111,
      topic: 'Database Fundamentals & Architecture',
      question: 'Which of the following is CORRECT about database management system languages?',
      options: [
        'Data definition languages are used to specify the conceptual schema only.',
        'Data manipulation languages are used to create databases.',
        'Data manipulation languages are used for retrieval, insertion, deletion and modification of data.',
        'Data definition languages are only used to update data in the DBMS.'
      ],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-112',
      num: 112,
      topic: 'Database Fundamentals & Architecture',
      question: 'With the help of the _________ technique, data values with smaller-sized codes can further reduce the space needed for storage in the database.',
      options: ['Compression', 'Expansion', 'Negation', 'Extension'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-113',
      num: 113,
      topic: 'Database Fundamentals & Architecture',
      question: '_____________ are used by the database administrator in situations where we have a large number of records and wastage of a small amount of space in each record can lead to loss of huge storage space.',
      options: ['Codes', 'Symbols', 'Variables', 'Special characters'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-114',
      num: 114,
      topic: 'Database Fundamentals & Architecture',
      question: 'When data is stored onto magnetic media, it is stored in:',
      options: ['Text format', 'Numeric form', 'Binary format', 'Encrypted form'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-115',
      num: 115,
      topic: 'Database Fundamentals & Architecture',
      question: 'The DBMS selects a specific file organization for the storage of data on disk; to implement that specific file system the DBMS needs to create specific:',
      options: ['Keys', 'Indexes', 'Catalogs', 'Attributes'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-116',
      num: 116,
      topic: 'DFD & Database Development',
      question: 'In the database development process, proper study of the system is called:',
      options: ['System analysis', 'Preliminary Study', 'Requirement analysis', 'Real-world scenario study'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-117',
      num: 117,
      topic: 'DFD & Database Development',
      question: 'Which is the second stage in the database development process?',
      options: ['Database design', 'Preliminary Study', 'Physical Design', 'Requirement Analysis'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-118',
      num: 118,
      topic: 'DFD & Database Development',
      question: 'In the database development process, which of the following is related to the requirement gathering phase?',
      options: [
        'Proper study of system',
        'Detailed study of system',
        'Detailed study of database',
        'Detailed study of application'
      ],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-119',
      num: 119,
      topic: 'DFD & Database Development',
      question: 'Which of the following is the input to the Analysis Phase?',
      options: ['DFD', 'Logical database design', 'Physical database design', 'Data model'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-120',
      num: 120,
      topic: 'DFD & Database Development',
      question: 'The outcome of the ____________ phase is the conceptual database design, which is drawn through the E-R model.',
      options: ['Logical', 'Physical', 'Analysis', 'Conclusion'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-121',
      num: 121,
      topic: 'DFD & Database Development',
      question: '________ is the first comprehensive, complete database design.',
      options: [
        'Logical database design',
        'Relational database design',
        'Conceptual database design',
        'Hierarchical database design'
      ],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-122',
      num: 122,
      topic: 'DFD & Database Development',
      question: 'Which of the following tools is used to design conceptual database design?',
      options: ['SQL', 'MS Access', 'Oracle', 'This model is independent of any tool'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-123',
      num: 123,
      topic: 'DFD & Database Development',
      question: 'The ________ model is independent of any tool or data model.',
      options: ['Network', 'Relational', 'Hierarchical', 'Entity Relationship'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-124',
      num: 124,
      topic: 'DFD & Database Development',
      question: 'Conceptual database design is implemented using a:',
      options: ['Hierarchical data model', 'Semantic data model', 'Relational data model', 'Network data model'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-125',
      num: 125,
      topic: 'DFD & Database Development',
      question: 'The conceptual database design can be transformed into any:',
      options: ['Data model', 'Database design', 'E-R model', 'Entity set'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-126',
      num: 126,
      topic: 'DFD & Database Development',
      question: 'Conceptual database design, expressed in the E-R data model, can be implemented using any:',
      options: ['Software', 'Data model', 'Operating system', 'Database Management System (DBMS)'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-127',
      num: 127,
      topic: 'DFD & Database Development',
      question: 'Which is the next stage after conceptual database design?',
      options: ['Testing', 'Coding', 'Deployment', 'Logical database design'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-128',
      num: 128,
      topic: 'DFD & Database Development',
      question: 'In which phase of the database development process is the logical design of the database created?',
      options: ['Design phase', 'Implementation', 'Physical design', 'Requirement analysis'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-129',
      num: 129,
      topic: 'DFD & Database Development',
      question: 'In ____________, an appropriate data model is chosen.',
      options: ['ERD', 'Conceptual Database Design', 'Logical Database Design', 'DFD'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-130',
      num: 130,
      topic: 'DFD & Database Development',
      question: 'In ___________ database design, an appropriate data model is chosen, and it becomes tool ________.',
      options: ['Logical, independent', 'Logical, dependent', 'Conceptual, dependent', 'Conceptual, independent'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-131',
      num: 131,
      topic: 'DFD & Database Development',
      question: 'Which of the following data models is used to create the logical database design?',
      options: ['Relational', 'Hierarchical', 'Object-oriented', 'Any model can be used'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-132',
      num: 132,
      topic: 'DFD & Database Development',
      question: 'The Relational Data model is created in the __________ phase.',
      options: ['Logical design', 'Physical design', 'Analysis', 'Preliminary Study'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-133',
      num: 133,
      topic: 'DFD & Database Development',
      question: 'Logical database design, like conceptual database design, is part of our:',
      options: ['Data model', 'Weak entity set', 'Strong entity set', 'Database design'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-134',
      num: 134,
      topic: 'DFD & Database Development',
      question: 'In which phase of the database development process is a specific Database Management System (DBMS) chosen?',
      options: ['Logical design', 'Physical Design', 'Conceptual Design', 'Development Phase'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-135',
      num: 135,
      topic: 'DFD & Database Development',
      question: 'Which of the following is an INCORRECT statement concerning the database design process?',
      options: [
        'During the requirements collection and analysis phase, one gathers the data requirements of database users.',
        'By referring to a high-level data model, it is possible to understand users’ data requirements, entity types, relationships, and constraints.',
        'Transformation of the high-level data model into the implementation data model is called logical design or data model mapping.',
        'During the logical design phase, internal storage structures, access paths, and file organization for database files are specified.'
      ],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-136',
      num: 136,
      topic: 'DFD & Database Development',
      question: '_________ are the structures defined for placing data in the attributes while designing the physical design of a database.',
      options: ['Objects', 'Variables', 'Attributes', 'Data types'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-137',
      num: 137,
      topic: 'DFD & Database Development',
      question: 'Which of the following is NOT a part of the Database Application Development Process?',
      options: ['Validation', 'Implementation', 'Database Design', 'Application Programs'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-138',
      num: 138,
      topic: 'DFD & Database Development',
      question: 'In the database development process, which phase involves designing any new application for the enhancement of the system?',
      options: ['Testing phase', 'Analysis phase', 'Maintenance phase', 'Implementation phase'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-139',
      num: 139,
      topic: 'DFD & Database Development',
      question: 'Which of the following is a drawback of standardization?',
      options: ['Difficult to understand', 'Uniformity', 'Lack of uniqueness', 'Easy to develop applications'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-140',
      num: 140,
      topic: 'DFD & Database Development',
      question: 'Which of the following tools is used to graphically represent the components and design of the system?',
      options: ['CRF', 'EDF', 'CRM', 'DFD'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-141',
      num: 141,
      topic: 'DFD & Database Development',
      question: 'In a data flow diagram (DFD), which symbol is used to represent data flows?',
      options: ['Arrow', 'Circle', 'Square', 'Diamond'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-142',
      num: 142,
      topic: 'DFD & Database Development',
      question: 'In a data flow diagram (DFD), ________ is a repository for the storage of data.',
      options: ['Process', 'Schema', 'Data store', 'Data dictionary'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-143',
      num: 143,
      topic: 'DFD & Database Development',
      question: 'Which of the following is NOT a component of a DFD?',
      options: ['Dataflow', 'Datastore', 'External entities', 'Relationship between external entities'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-144',
      num: 144,
      topic: 'DFD & Database Development',
      question: 'DFDs do not provide us a way to represent:',
      options: ['Entities', 'Decisions', 'Data stores', 'Processes'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-145',
      num: 145,
      topic: 'DFD & Database Development',
      question: 'Which statement is NOT correct according to Data Flow Diagrams?',
      options: [
        'DFDs are simple and hide complexities.',
        'DFDs provide us a way of expressing decision points.',
        'DFDs show the flow of data between different processes of a specific system.',
        'DFDs are descriptive and create links between processes that describe the information flow.'
      ],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-146',
      num: 146,
      topic: 'DFD & Database Development',
      question: 'Which of the following is NOT a feature of a Context DFD?',
      options: [
        'One process (representing the entire system)',
        'All sources/sinks (external entities)',
        'Data flows linking the process to sources and sinks (external entities)',
        'Sub-processes (which explain and decompose the major process into small processes)'
      ],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-147',
      num: 147,
      topic: 'DFD & Database Development',
      question: 'Which DFD levels are mostly used for detailed DFDs?',
      options: ['Level-0, Level-1', 'Level-1, Level-2', 'Level-2, Level-3', 'Level-3, Level-4'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-148',
      num: 148,
      topic: 'DFD & Database Development',
      question: 'Which type of Data Flow Diagram (DFD) explains the functionality of the processes?',
      options: ['Level 0 diagram', 'Detailed diagram', 'Level "Not" diagram', 'Context-level diagram'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-149',
      num: 149,
      topic: 'DFD & Database Development',
      question: 'In a data flow diagram, which operator is used when data flows from a source process to exactly one of the mentioned sinks?',
      options: ['Ring Sum Operator (⊕)', 'Parallel Operator (*)', 'Or Operator (+)', 'Assignment Operator (=)'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-150',
      num: 150,
      topic: 'DFD & Database Development',
      question: 'Which of the following is a part of a DFD but not included in the ERD?',
      options: [
        'The attribute having a single instance',
        'The external entity having a single instance',
        'The relationship having a single instance',
        'The role having a single instance'
      ],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-151',
      num: 151,
      topic: 'DFD & Database Development',
      question: 'An external entity having only a single instance will be a part of _______, but will not be a part of _______.',
      options: ['RDM, DFD', 'ERD, RDM', 'DFD, ERD', 'ERD, DFD'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-152',
      num: 152,
      topic: 'DFD & Database Development',
      question: 'A free-standing data dictionary is created by using:',
      options: ['DFD', 'Database', 'CASE tools', 'Cross-reference matrix'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-153',
      num: 153,
      topic: 'DFD & Database Development',
      question: 'The DBMS uses the _____________ to access the database at each layer or model.',
      options: ['Mapping rules', 'Data about data', 'ER diagram', 'Data dictionary'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-154',
      num: 154,
      topic: 'DFD & Database Development',
      question: 'Cross-reference matrix is developed at the ______ stage of the database.',
      options: ['Analysis', 'Designing', 'Implementation', 'Application'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-155',
      num: 155,
      topic: 'DFD & Database Development',
      question: '___________ is used to find out what values or attributes will appear in which reports; major item names are written row-wise and generated reports are written column-wise.',
      options: ['Context Diagram', 'Data Flow Diagram', 'Cross-Reference Matrix', 'Entity Relationship Diagram'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-156',
      num: 156,
      topic: 'DFD & Database Development',
      question: 'In a cross-reference matrix, attributes are mentioned on the _______ and reports are mentioned on the _______.',
      options: ['Y axis, X axis', 'Y axis, Z axis', 'X axis, Y axis', 'X axis, Z axis'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-157',
      num: 157,
      topic: 'DFD & Database Development',
      question: 'In a cross-reference matrix, attributes are specified on the:',
      options: ['X axis', 'Y axis', 'Z axis', 'None of the above'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-158',
      num: 158,
      topic: 'ER Modeling & Relationships',
      question: 'Which of the following is the correct abbreviation of ERD?',
      options: ['Entity relationship diagram', 'Entity relation diagram', 'Entity reality diagram', 'Entity real distance'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-159',
      num: 159,
      topic: 'ER Modeling & Relationships',
      question: 'The Entity Relationship Model models:',
      options: ['Entities, Relationships and Processes', 'Entities and Relationships', 'Relationships', 'Entities'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-160',
      num: 160,
      topic: 'ER Modeling & Relationships',
      question: 'In an ERD, the focus is on the ______ and the relationships between them.',
      options: ['Attributes', 'Entities', 'Keys', 'Indexes'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-161',
      num: 161,
      topic: 'ER Modeling & Relationships',
      question: 'The basic purpose of a diamond in an ER diagram is to show:',
      options: ['Attributes', 'Relationships', 'Composite attributes', 'Entity set'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-162',
      num: 162,
      topic: 'ER Modeling & Relationships',
      question: 'An entity type is:',
      options: [
        'Defined when the database is actually constructed',
        'A specific type such as an integer, text, date, logical, etc.',
        'A coherent set of similar objects that we want to store data on (e.g., STUDENTS, COURSE, CAR)',
        'Defined by the database designer'
      ],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-163',
      num: 163,
      topic: 'ER Modeling & Relationships',
      question: 'In an entity-relationship diagram, an instance is:',
      options: [
        'Any particular entity',
        'An attribute of an entity',
        'A special type of relation',
        'A specific schema constraint'
      ],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-164',
      num: 164,
      topic: 'ER Modeling & Relationships',
      question: 'Which of the following is NOT a classification of entity type in the course syllabus?',
      options: ['Weak entity type', 'Strong entity type', 'Derived entity type', 'Dependent entity type'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-165',
      num: 165,
      topic: 'ER Modeling & Relationships',
      question: 'The entity that is NOT dependent on any other entity for its existence is known as a ________ entity.',
      options: ['Weak', 'Strong', 'Derived', 'Dependent'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-166',
      num: 166,
      topic: 'ER Modeling & Relationships',
      question: 'A ________ entity has a primary key that is partially or totally derived from the parent entity in the relationship.',
      options: ['Strong', 'Weak', 'Business', 'Relationship'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-167',
      num: 167,
      topic: 'ER Modeling & Relationships',
      question: 'A weak entity type:',
      options: [
        'Must have total participation in an identifying relationship',
        'Does not have a key attribute of its own',
        'Both (a) and (b)',
        'None of the above'
      ],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-168',
      num: 168,
      topic: 'ER Modeling & Relationships',
      question: 'A relationship is an association between two entities, or between an entity and itself. The diamond symbol for a relationship is _________ if one of the participants is dependent on the other.',
      options: ['Single', 'Dotted', 'Double', 'None of these'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-169',
      num: 169,
      topic: 'ER Modeling & Relationships',
      question: 'When one entity instance depends on another entity for its existence, it is called:',
      options: ['Existence dependency', 'Identifier dependency', 'Referential dependency', 'Acceptance dependency'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-170',
      num: 170,
      topic: 'ER Modeling & Relationships',
      question: 'Suppose we have two entities: Department and University. Which type of dependency exists between these two entities?',
      options: ['Integral', 'Identifier', 'Existence', 'Referential'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-171',
      num: 171,
      topic: 'ER Modeling & Relationships',
      question: 'Which of the following is INCORRECT about naming entities?',
      options: [
        'Singular nouns are used',
        'Write in capitals',
        'Organization-specific names can be used',
        'Always use abbreviations as they are convenient'
      ],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-172',
      num: 172,
      topic: 'ER Modeling & Relationships',
      question: 'Select the correct statement among the following on proper naming of schema constructs:',
      options: [
        'Entity type name applies to all entities belonging to that entity type and therefore a plural name is selected for an entity type.',
        'In the narrative description of database requirements, verbs tend to indicate the names of relationship types.',
        'All nouns arising from a database requirement description are only names of attributes.',
        'Additional nouns appearing in the narrative description always represent weak entity type names.'
      ],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-173',
      num: 173,
      topic: 'ER Modeling & Relationships',
      question: 'Which of the following is INCORRECT about attributes?',
      options: [
        'Name and domain are part of an attribute.',
        'One entity type may have two attributes with the same name.',
        'One entity type cannot have two attributes with the same name.',
        'Different entity types may have attributes with the same name.'
      ],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-174',
      num: 174,
      topic: 'ER Modeling & Relationships',
      question: 'An attribute that is a collection of some other attribute(s) is known as a ________ attribute.',
      options: ['Multi-valued', 'Single-valued', 'No-valued', 'Composite'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-175',
      num: 175,
      topic: 'ER Modeling & Relationships',
      question: '________ are those attributes that are a combination of two or more attributes.',
      options: ['Default values', 'Null values', 'Primary keys', 'Composite attributes'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-176',
      num: 176,
      topic: 'ER Modeling & Relationships',
      question: 'The attribute HOBBY can have more than one value in an ERD. HOBBY is a ________ attribute.',
      options: ['Derived', 'Composite', 'Multi-valued', 'Single-valued'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-177',
      num: 177,
      topic: 'ER Modeling & Relationships',
      question: 'In a Student entity, which of the following is the best example of a multivalued attribute?',
      options: ['Student ID', 'CNIC number', 'Email address', 'Registration number'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-178',
      num: 178,
      topic: 'ER Modeling & Relationships',
      question: 'Which of the following might be represented with a single-valued attribute?',
      options: [
        "Person's hobby",
        "Person's phone number",
        "Computer's processor speed",
        "Employee's educational background"
      ],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-179',
      num: 179,
      topic: 'ER Modeling & Relationships',
      question: '_________ are called participants when enrolled in a relationship.',
      options: ['Attributes', 'Relations', 'Entities', 'Keys'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-180',
      num: 180,
      topic: 'ER Modeling & Relationships',
      question: 'The function that an entity plays in a relationship is called that entity’s:',
      options: ['Role', 'Position', 'Instance', 'Participation'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-181',
      num: 181,
      topic: 'ER Modeling & Relationships',
      question: 'Which of the following clarify the semantics of a relationship?',
      options: ['Entity', 'Roles', 'Relationship set', 'Participants'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-182',
      num: 182,
      topic: 'ER Modeling & Relationships',
      question: 'Select the correct statement regarding ER relationship types:',
      options: [
        'Role names are not technically necessary in relationship types when all the participating entity types are distinct.',
        'When different entity types participate only once in a single relationship type it is called a recursive relationship.',
        'Cardinality ratios for a binary relationship are displayed on ER diagrams by using a diamond shape notation.',
        'Partial participation, which is also called existence dependency, is displayed as a double line connecting the entity to the relationship.'
      ],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-183',
      num: 183,
      topic: 'ER Modeling & Relationships',
      question: 'If there is more than one relationship between two entities and roles are mentioned on the relationship links, then it is called:',
      options: ['Unary relationship', 'Binary relationship', 'Ternary relationship', 'Multiple relationships'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-184',
      num: 184,
      topic: 'ER Modeling & Relationships',
      question: 'A ________ relationship exists when an association is maintained within a single entity.',
      options: ['Unary', 'Ternary', 'Binary', 'Weak'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-185',
      num: 185,
      topic: 'ER Modeling & Relationships',
      question: 'Recursive relationship is also called:',
      options: ['Unary', 'Ternary', 'Primary', 'Secondary'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-186',
      num: 186,
      topic: 'ER Modeling & Relationships',
      question: 'Binary relationships are those which are established between:',
      options: ['One entity type', 'Two entity types', 'Three entity types', 'Unlimited entities'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-187',
      num: 187,
      topic: 'ER Modeling & Relationships',
      question: 'Consider a relationship between entities Teacher and Student ("The teacher teaches the student"). It is an example of a ________ relationship.',
      options: ['Unary', 'N-ary', 'Binary', 'Ternary'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-188',
      num: 188,
      topic: 'ER Modeling & Relationships',
      question: 'A relationship that involves three entities is called a:',
      options: ['N-ary relationship', 'Unary relationship', 'Binary relationship', 'Ternary relationship'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-189',
      num: 189,
      topic: 'ER Modeling & Relationships',
      question: 'Which of the following most certainly implies the need for an entire table to implement?',
      options: [
        'A ternary relationship',
        'A recursive relationship',
        'An identifying relationship',
        'A binary relationship'
      ],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-190',
      num: 190,
      topic: 'ER Modeling & Relationships',
      question: 'How many types of cardinality ratios are commonly specified for binary relationships?',
      options: ['Two', 'One', 'Three', 'Four'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-191',
      num: 191,
      topic: 'ER Modeling & Relationships',
      question: 'In “one-to-many” cardinality, one instance of a relation is mapped with:',
      options: [
        'Many instances of the second entity type',
        'One instance of the second entity type',
        'Primary key of the second relation',
        'Foreign key of the second relation'
      ],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-192',
      num: 192,
      topic: 'ER Modeling & Relationships',
      question: 'The ________ determines whether the link between two entities is optional or mandatory.',
      options: ['Maximum cardinality', 'Minimum cardinality', 'Maximum degree', 'Minimum degree'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-193',
      num: 193,
      topic: 'ER Modeling & Relationships',
      question: 'If an instance of an entity can exist without being linked with an instance of another entity, then the minimum cardinality has to be:',
      options: ['Zero', 'One', 'Two', 'Compulsory'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-194',
      num: 194,
      topic: 'ER Modeling & Relationships',
      question: 'The total participation by entities is represented in an E-R diagram as:',
      options: ['Circle', 'Double lines', 'Dashed line', 'Double rectangle'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-195',
      num: 195,
      topic: 'ER Modeling & Relationships',
      question: 'Structural constraints of a relationship type refer to:',
      options: [
        'Identifying the owner entity type relevant to a given entity type',
        'Cardinality ratios and whether the existence of an entity depends on being related to another entity via the relationship type',
        'The role that a participating entity plays in each relationship instance',
        'The constraints applicable in granting access to tables, columns and views in a database schema'
      ],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-196',
      num: 196,
      topic: 'ER Modeling & Relationships',
      question: 'If an entity “motorcycle” is associated with at most one “driver”, then the relationship between these two entities is:',
      options: ['One to one', 'One to many', 'Many to many', 'Many to one'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-197',
      num: 197,
      topic: 'ER Modeling & Relationships',
      question: 'If a single instance of “student” is associated with many instances of the “subjects” entity, then the relationship between them is:',
      options: ['One to one', 'One to many', 'Many to many', 'Many to one'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-198',
      num: 198,
      topic: 'ER Modeling & Relationships',
      question: 'The relationship from department to employee is:',
      options: ['One to many', 'One to one', 'Many to one', 'Many to many'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-199',
      num: 199,
      topic: 'ER Modeling & Relationships',
      question: 'In a conceptual model for a university, what type of relationship exists from Student to Grade?',
      options: ['1:1', '1:M', 'M:M', 'Ternary'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-200',
      num: 200,
      topic: 'ER Modeling & Relationships',
      question: 'If many instances of the “Book” entity are associated with many instances of the “Student” entity, then the relationship between them is:',
      options: ['One to one', 'One to many', 'Many to many', 'Many to one'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-201',
      num: 201,
      topic: 'ER Modeling & Relationships',
      question: 'Consider an employee allotted an organization vehicle driven solely by that employee. What kind of relationship exists between Employee and Company?',
      options: ['One to many', 'Many to many', 'One to one', 'Many to one'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-202',
      num: 202,
      topic: 'ER Modeling & Relationships',
      question: 'Suppose we have two entities “shape” and “triangle”. Which of the following is a correct statement?',
      options: [
        'Shape is a supertype entity and triangle is a subtype entity',
        'Shape is a subtype entity and triangle is a supertype entity',
        'Shape and triangle both are supertype entities',
        'Shape and triangle both are subtype entities'
      ],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-203',
      num: 203,
      topic: 'ER Modeling & Relationships',
      question: 'The process of defining one or more subtypes of a supertype and forming relationships is known as:',
      options: ['Aggregation', 'Generalization', 'Specialization', 'Selecting classes'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-204',
      num: 204,
      topic: 'ER Modeling & Relationships',
      question: 'The ______ constraint specifies whether each entity supertype occurrence must also be a member of at least one subtype.',
      options: ['Specialization', 'Uniqueness', 'Inheritance', 'Completeness'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-205',
      num: 205,
      topic: 'ER Modeling & Relationships',
      question: 'Which of the following is a completeness constraint?',
      options: [
        'Total generalization constraint',
        'Hybrid completeness constraint',
        'Partial completeness constraint',
        'Partial generalization constraint'
      ],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-206',
      num: 206,
      topic: 'ER Modeling & Relationships',
      question: 'A vehicle can be a Car or a Bus, but does not have to be either. It is an example of a __________ constraint.',
      options: ['Referential integrity', 'Disjointness rule', 'Total completeness', 'Partial completeness'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-207',
      num: 207,
      topic: 'ER Modeling & Relationships',
      question: 'A patient in a hospital must be either an outdoor or an indoor patient. What type of completeness constraint applies on Patient?',
      options: ['Total completeness', 'Partial completeness', 'Total overlap', 'Partial overlap'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-208',
      num: 208,
      topic: 'ER Modeling & Relationships',
      question: 'The ________ rule specifies that an entity can be a member of only one subtype at a time.',
      options: ['Disjoint', 'Inclusion', 'Exclusion', 'Removal'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-209',
      num: 209,
      topic: 'ER Modeling & Relationships',
      question: 'In ABC textile factory, employees are either fixed-salary employees or hourly-paid employees, and cannot belong to both categories in parallel. This is an example of the:',
      options: ['Disjointness rule', 'Total completeness', 'Referential integrity', 'Partial completeness'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-210',
      num: 210,
      topic: 'ER Modeling & Relationships',
      question: 'While mapping a ___________ relationship, the primary key of the entity type on the one side of the relationship is included in the entity type on the many side as a foreign key.',
      options: ['One to many', 'Many to many', 'One to one', 'Many to one'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-211',
      num: 211,
      topic: 'ER Modeling & Relationships',
      question: 'Which of the following is a correct way to implement a one-to-many relationship while designing tables?',
      options: [
        'By splitting the data into two tables with primary key and foreign key relationships',
        'Using a junction table with keys from both tables forming a composite primary key',
        'By splitting each table into three',
        'As a single table and rarely as two tables with primary and foreign keys'
      ],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-212',
      num: 212,
      topic: 'ER Modeling & Relationships',
      question: 'Identify the correct way to implement a one-to-one relationship in tables:',
      options: [
        'Always by splitting the data into three tables',
        'As a single table, and rarely as two tables with primary key and foreign key relationships',
        'Using a junction table with keys from both tables forming a composite primary key',
        'By removing the foreign key from both tables'
      ],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-213',
      num: 213,
      topic: 'ER Modeling & Relationships',
      question: 'While mapping a many-to-many relationship between two entities, ______ table(s) are created in total.',
      options: ['One', 'Two', 'Three', 'Five'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-214',
      num: 214,
      topic: 'ER Modeling & Relationships',
      question: 'In a many-to-many relationship, a third table is created for the relationship, which is also called an:',
      options: ['Binary relation', 'Associative entity type', 'Unary relationship', 'Composite attribute'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-215',
      num: 215,
      topic: 'Relational Model & Integrity Constraints',
      question: 'The RDM (Relational Data Model) is popular due to its two major strengths, which are:',
      options: [
        'Simplicity / Weak mathematical foundation',
        'Complexity / Easy mathematical foundation',
        'Simplicity / Strong mathematical foundation',
        'Complexity / Weak mathematical foundation'
      ],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-216',
      num: 216,
      topic: 'Relational Model & Integrity Constraints',
      question: 'The relational data model is widely accepted due to its mathematically proven foundation and its:',
      options: ['Complexity', 'Simplicity', 'Hierarchical structure', 'Traditional structure'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-217',
      num: 217,
      topic: 'Relational Model & Integrity Constraints',
      question: 'Which of the following data models is NOT record-based?',
      options: ['Hierarchical Data Model', 'Network Data Model', 'Semantic Data Model', 'Relational Data Model'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-218',
      num: 218,
      topic: 'Relational Model & Integrity Constraints',
      question: 'RDM is simple; there is just one structure and that is:',
      options: ['A relation or a table', 'E-R model', 'Attributes', 'Data model'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-219',
      num: 219,
      topic: 'Relational Model & Integrity Constraints',
      question: 'Which data model has the components Construct (Tables), Manipulation language (SQL), and Integrity constraints?',
      options: ['Semantic', 'Relational', 'Conceptual', 'Entity Relationship'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-220',
      num: 220,
      topic: 'Relational Model & Integrity Constraints',
      question: 'Which of the following is NOT listed as a core structural/integrity component of the Relational Data Model in the VU quiz bank?',
      options: ['Integrity Constraint', 'Manipulation Language', 'Relation / Table', 'Domain Constraint'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-221',
      num: 221,
      topic: 'Relational Model & Integrity Constraints',
      question: 'A database relation is also represented in a two-dimensional structure called a:',
      options: ['Row', 'Table', 'Entity', 'Column'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-222',
      num: 222,
      topic: 'Relational Model & Integrity Constraints',
      question: 'In the Relational Data model, a record or an entity instance is represented as a _____ in a relation.',
      options: ['Row', 'Value', 'Column', 'Attribute'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-223',
      num: 223,
      topic: 'Relational Model & Integrity Constraints',
      question: 'In the Relational Data model, an attribute is a __________ in a relation.',
      options: ['Row', 'Value', 'Tuple', 'Column'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-224',
      num: 224,
      topic: 'Relational Model & Integrity Constraints',
      question: 'There are __________ basic properties of database relations.',
      options: ['Four', 'Three', 'Six', 'Two'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-225',
      num: 225,
      topic: 'Relational Model & Integrity Constraints',
      question: 'Which of the following is NOT true about relational tables?',
      options: [
        'Column values are of the same kind.',
        'Each row is unique.',
        'Each column must have a unique name.',
        'The sequence of rows is significant.'
      ],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-226',
      num: 226,
      topic: 'Relational Model & Integrity Constraints',
      question: 'Which statement is true regarding a relation?',
      options: [
        'Every attribute value is non-atomic.',
        'Attributes in a table may not have unique names.',
        'The order of the columns is relevant.',
        'The order of the rows is irrelevant.'
      ],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-227',
      num: 227,
      topic: 'Relational Model & Integrity Constraints',
      question: 'Which of the following is true for the relational model?',
      options: [
        'Degree of a relation is the number of rows in a relation.',
        'Null value is a blank or zero value given when an attribute value is inapplicable or unknown.',
        'A complex key is a key consisting of more than one attribute.',
        'A constraint is a rule that restricts the values in a database.'
      ],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-228',
      num: 228,
      topic: 'Relational Model & Integrity Constraints',
      question: 'In the Relational Data Model, the ________ of a relation is the number of rows in that relation.',
      options: ['Domain', 'Degree', 'Cardinality', 'Constraint'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-229',
      num: 229,
      topic: 'Relational Model & Integrity Constraints',
      question: 'In the Relational Data Model, the ________ of a relation is the number of columns in that relation.',
      options: ['Domain', 'Degree', 'Cardinality', 'Constraint'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-230',
      num: 230,
      topic: 'Relational Model & Integrity Constraints',
      question: 'In the relational model, the number of attributes and number of tuples in a relation are termed as __________ and __________ respectively.',
      options: ['Domain, degree', 'Cardinality, domain', 'Cardinality, degree', 'Degree, cardinality'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-231',
      num: 231,
      topic: 'Relational Model & Integrity Constraints',
      question: 'Suppose a relation has five columns and ten rows; what is the cardinality of the relation?',
      options: ['Five', 'Ten', 'Fifteen', 'Twenty'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-232',
      num: 232,
      topic: 'Relational Model & Integrity Constraints',
      question: 'Which of the following is NOT a type of key?',
      options: ['Super key', 'Alternate key', 'Integrity constraint key', 'Primary key'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-233',
      num: 233,
      topic: 'Relational Model & Integrity Constraints',
      question: 'Which of the following is NOT a type of key in the ER/relational model?',
      options: ['Super key', 'Primary key', 'Derived key', 'Candidate key'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-234',
      num: 234,
      topic: 'Relational Model & Integrity Constraints',
      question: 'Any combination of attributes with a super key is a:',
      options: ['Primary key', 'Foreign key', 'Super key', 'Candidate key'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-235',
      num: 235,
      topic: 'Relational Model & Integrity Constraints',
      question: 'A superkey that does not contain a subset of attributes that is itself a superkey is called a:',
      options: ['Candidate key', 'Primary key', 'Superkey', 'Secondary key'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-236',
      num: 236,
      topic: 'Relational Model & Integrity Constraints',
      question: 'Consider the key {CNIC, Name} where CNIC uniquely identifies a person. Which option describes {CNIC, Name} most accurately?',
      options: [
        'The given key is a super key and an alternate key.',
        'The given key is not a super key, but a candidate key.',
        'The given key is a super key and a candidate key as well.',
        'The given key is a super key, but not a candidate key.'
      ],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-237',
      num: 237,
      topic: 'Relational Model & Integrity Constraints',
      question: 'Every primary key (PK) is a candidate key and every candidate key is a:',
      options: ['Super key', 'Foreign key', 'Primary key', 'Alternate key'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-238',
      num: 238,
      topic: 'Relational Model & Integrity Constraints',
      question: 'A candidate key that does not have a null value and is selected to uniquely identify all other attribute values in any given row is called a:',
      options: ['Superkey', 'Candidate key', 'Primary key', 'Secondary key'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-239',
      num: 239,
      topic: 'Relational Model & Integrity Constraints',
      question: 'Each table must have a _______ key.',
      options: ['Primary', 'Secondary', 'Logical', 'Foreign'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-240',
      num: 240,
      topic: 'Relational Model & Integrity Constraints',
      question: 'Within a table, each primary key value:',
      options: [
        'Is a minimal super key',
        'Is always the first field in each table',
        'Must be numeric',
        'Must be unique'
      ],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-241',
      num: 241,
      topic: 'Relational Model & Integrity Constraints',
      question: 'Which of the following is a feature of the PRIMARY KEY constraint?',
      options: [
        'Unique identifier for a row within a database table',
        'Allows any actions that would destroy links between tables',
        'Limits the values that can be placed in a column',
        'Enforces that the column will only accept null values'
      ],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-242',
      num: 242,
      topic: 'Relational Model & Integrity Constraints',
      question: 'As part of database naming conventions, attribute names should use suffixes such as ID, NUMBER or CODE for the:',
      options: ['Primary key', 'Foreign key', 'Index', 'Determinant'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-243',
      num: 243,
      topic: 'Relational Model & Integrity Constraints',
      question: 'A key which consists of two or more attributes is called a:',
      options: ['Primary key', 'Candidate key', 'Secondary key', 'Composite key'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-244',
      num: 244,
      topic: 'Relational Model & Integrity Constraints',
      question: 'Candidate keys which are not selected as the primary key are called:',
      options: ['Secondary keys', 'Foreign keys', 'Alternate keys', 'Composite keys'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-245',
      num: 245,
      topic: 'Relational Model & Integrity Constraints',
      question: 'Consider the two attributes CNIC_NO and Registration_NO, both usable for unique identification. If CNIC_NO is selected as primary key, then Registration_NO is an ________ key.',
      options: ['Foreign', 'Secondary', 'Primary', 'Alternate'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-246',
      num: 246,
      topic: 'Relational Model & Integrity Constraints',
      question: 'In the entity type Employee(Reg# [Primary key], Name, CNIC, designation, address, phone), which attribute can work as an alternate key?',
      options: ['CNIC', 'Phone', 'Address', 'Designation'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-247',
      num: 247,
      topic: 'Relational Model & Integrity Constraints',
      question: 'Suppose “Program” is an entity representing different degree programs offered by an institute (like MCS, BCS). Which attribute can best be used as its primary key?',
      options: ['Max-Duration', 'Program-Code', 'Program-level', 'No-of-Semesters'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-248',
      num: 248,
      topic: 'Relational Model & Integrity Constraints',
      question: 'In an Employee entity, which of the following attributes will work best as a primary key?',
      options: ['Salary', 'Zipcode', 'Address', 'Employee ID'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-249',
      num: 249,
      topic: 'Relational Model & Integrity Constraints',
      question: 'In a conceptual database model, which of the following most likely represents a valid identifier for class grades?',
      options: ['StudentID', 'StudentID, CourseID', 'StudentID, CourseID, InstructorID', 'StudentID, CourseSectionID'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-250',
      num: 250,
      topic: 'Relational Model & Integrity Constraints',
      question: 'A table can be logically connected to another table by defining a:',
      options: ['Hyperlink', 'Common attribute', 'Unique index', 'Super key'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-251',
      num: 251,
      topic: 'Relational Model & Integrity Constraints',
      question: 'An attribute in a relation is a foreign key if the _______ key from another relation is used as an attribute in that relation.',
      options: ['Sub', 'Super', 'Primary', 'Candidate'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-252',
      num: 252,
      topic: 'Relational Model & Integrity Constraints',
      question: 'If K is a foreign key in relation R1, then:',
      options: [
        'Every tuple of R1 has a distinct value for K.',
        'K cannot have a null value for tuples in R1.',
        'K is a key for some other relation.',
        'K is a primary key for R1.'
      ],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-253',
      num: 253,
      topic: 'Relational Model & Integrity Constraints',
      question: 'The relation in which a foreign key attribute is present as a primary key is called the _____________ of the foreign key attribute.',
      options: ['Binary relation', 'Composite relation', 'Home relation', 'Recursive relation'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-254',
      num: 254,
      topic: 'Relational Model & Integrity Constraints',
      question: 'Consider the two tables: EMP(empId, empName, qual, depId) and DEPT(depId, depName, numEmp). The primary key of EMP is ______ whereas the foreign key of EMP is _______.',
      options: ['empId, depId', 'depId, empId', 'depId, empName', 'empName, depId'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-255',
      num: 255,
      topic: 'Relational Model & Integrity Constraints',
      question: 'Which of the following is true about the NOT NULL constraint?',
      options: [
        'Enforces domain integrity',
        'Limits values to a range expression',
        'Prevents actions that would destroy links between tables with corresponding data values',
        'Enforces the uniqueness of values in a set of columns'
      ],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-256',
      num: 256,
      topic: 'Relational Model & Integrity Constraints',
      question: 'Which of the following constraints is included directly in the column definition of a table?',
      options: ['Default value', 'Foreign key', 'Null', 'Domain'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-257',
      num: 257,
      topic: 'Relational Model & Integrity Constraints',
      question: 'By default, a non-key attribute in a relation can have a ________ value.',
      options: ['Binary', 'Null', 'Character', 'Integer'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-258',
      num: 258,
      topic: 'Relational Model & Integrity Constraints',
      question: 'Identify the correct statement about entity integrity constraints:',
      options: [
        'Entity integrity constraints specify that primary key values can be composite.',
        'Entity integrity constraints are specified on individual relations.',
        'Entity integrity constraints are specified between weak entities.',
        'When entity integrity rules are enforced, a tuple in one relation that refers to another relation must refer to an existing tuple.'
      ],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-259',
      num: 259,
      topic: 'Relational Model & Integrity Constraints',
      question: 'Which constraint enforces referential integrity?',
      options: ['FOREIGN KEY', 'CHECK', 'PRIMARY KEY', 'UNIQUE'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-260',
      num: 260,
      topic: 'Relational Model & Integrity Constraints',
      question: 'Which constraint states that if a foreign key exists in a relation, either the foreign key value must match the primary key value of some tuple in its home relation or the foreign key value must be completely null?',
      options: ['Default', 'Domain', 'Entity Integrity', 'Referential integrity'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-261',
      num: 261,
      topic: 'Relational Model & Integrity Constraints',
      question: 'Identify the correct statement regarding referential integrity:',
      options: [
        'Referential integrity constraints check whether primary key values are unique.',
        'Referential integrity constraints check whether an attribute value lies in a given range.',
        'Referential integrity constraints are specified between entities having recursive relationships.',
        'When referential integrity rules are enforced, a tuple in one relation that refers to another relation must refer to an existing tuple.'
      ],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-262',
      num: 262,
      topic: 'Relational Model & Integrity Constraints',
      question: 'Consider statements: (A) An entity integrity constraint states that no primary key value can be null. (B) A referential integrity constraint is specified between two distinct relations. (C) A foreign key cannot refer to its own relation. Which is/are strictly correct?',
      options: ['Only A', 'Only B', 'B and C', 'A and B'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-263',
      num: 263,
      topic: 'Relational Model & Integrity Constraints',
      question: 'Which of the following changes can cause problems across database levels?',
      options: [
        'Adding a new field in a file',
        'Adding a file to the database',
        'Changing the type of a specific field',
        'Deleting an attribute from the database structure'
      ],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-264',
      num: 264,
      topic: 'Relational Model & Integrity Constraints',
      question: 'The maximum PL/SQL size of data type VARCHAR2 in DBMS is __________ bytes.',
      options: ['42767', '52767', '32767', '28767'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-265',
      num: 265,
      topic: 'Relational Model & Integrity Constraints',
      question: 'Data type “BLOB” in database management systems stands for:',
      options: ['Binary Large Object', 'Basic Logical Object', 'Binary Linked Object', 'Block Large Object'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-266',
      num: 266,
      topic: 'Relational Model & Integrity Constraints',
      question: 'The maximum PL/SQL size of data type BLOB in DBMS is:',
      options: ['4 gigabytes', '8 gigabytes', '10 gigabytes', '12 gigabytes'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-267',
      num: 267,
      topic: 'Relational Algebra',
      question: '_____________ are those languages in which both what to do and how to do it on the database are required.',
      options: ['SQL', 'Procedural', 'Non-procedural', 'Relational calculus'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-268',
      num: 268,
      topic: 'Relational Algebra',
      question: 'Unary operations involve:',
      options: ['Only one relation', 'Only two relations', 'More than two relations', 'Not more than five relations'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-269',
      num: 269,
      topic: 'Relational Algebra',
      question: '“Select” and “Project” are examples of:',
      options: ['Unary operation', 'Binary operation', 'Ternary operation', 'N-ary operation'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-270',
      num: 270,
      topic: 'Relational Algebra',
      question: 'In relational algebra, which Greek letter is used to represent the project operator?',
      options: ['π (Pi)', 'σ (Sigma)', 'θ (Theta)', 'ρ (Rho)'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-271',
      num: 271,
      topic: 'Relational Algebra',
      question: 'The select operation works horizontally on a table; on the other hand, the ___________ operates on a single table vertically.',
      options: ['Binary operator', 'Project operator', 'Join operator', 'Select operator'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-272',
      num: 272,
      topic: 'Relational Algebra',
      question: 'Identify the operation which is NOT one of the five basic operations in relational algebra.',
      options: ['Join', 'Union', 'Cartesian Product', 'Set Difference'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-273',
      num: 273,
      topic: 'Relational Algebra',
      question: 'In relational algebra, which operator is used to find tuples that are present in one relation but are not in another?',
      options: ['Intersection', 'Set-difference', 'Cartesian Product', 'Union'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-274',
      num: 274,
      topic: 'Relational Algebra',
      question: 'Consider two sets A and B where A contains 3 elements and B contains 4 elements. How many elements does their Cartesian product contain?',
      options: ['12', '9', '16', '7'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-275',
      num: 275,
      topic: 'Relational Algebra',
      question: 'For which binary operation are relations NOT required to be union-compatible?',
      options: ['Intersection', 'Union', 'Difference', 'Cartesian product'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-276',
      num: 276,
      topic: 'Relational Algebra',
      question: 'Given Student = {(Saman, Perera), (Romesh, Dias), (Jeeva, Silva), (Nadee, Alwis), (Kumari, Costa), (Geetha, Zoysa), (Prasad, Fernando)} and Instructor = {(Ajith, Gamage), (Sujith, Hewage), (Saman, Perera), (Kasun, Peiris), (Romesh, Dias)}, which operation produces {(Ajith, Gamage), (Sujith, Hewage), (Kasun, Peiris)}?',
      options: ['Instructor − Student', 'Student ∩ Instructor', 'Instructor ÷ Student', 'Student − Instructor'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-277',
      num: 277,
      topic: 'Relational Algebra',
      question: 'A ________________ is used to combine rows from two or more tables based on a related column between them.',
      options: ['Select operator', 'Project operator', 'Join operation', 'Delete operator'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-278',
      num: 278,
      topic: 'Relational Algebra',
      question: 'In a _______ join, only selected rows of a relation are used in the cross product with the second relation.',
      options: ['Normal', 'Theta', 'Outer', 'Semi'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-279',
      num: 279,
      topic: 'Relational Algebra',
      question: 'In an _______ join, common attributes appear twice in the output with selected rows.',
      options: ['Normal join', 'Semi join', 'Natural join', 'Equi join'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-280',
      num: 280,
      topic: 'Relational Algebra',
      question: '_________ is the same as equijoin with a slight difference (duplicate common columns are removed).',
      options: ['Natural join', 'Semi join', 'Outer join', 'Theta join'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-281',
      num: 281,
      topic: 'Relational Algebra',
      question: 'In a natural join, the common attribute appears ____ in the output table.',
      options: ['Twice', 'Three times', 'Four times', 'Once'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-282',
      num: 282,
      topic: 'Functional Dependencies & Normalization',
      question: 'How many types of dependencies are commonly discussed in the CS403 course?',
      options: ['One', 'Two', 'Three', 'Four'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-283',
      num: 283,
      topic: 'Functional Dependencies & Normalization',
      question: 'Which of the following is a type of dependency?',
      options: ['DBMS', 'ERD', 'DFD', 'Referential'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-284',
      num: 284,
      topic: 'Functional Dependencies & Normalization',
      question: 'Functional dependency between two attributes or sets of attributes Q and P ("Q determines P") is represented as:',
      options: ['Q → P', 'Q P', 'Q * P', 'Q + P'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-285',
      num: 285,
      topic: 'Functional Dependencies & Normalization',
      question: 'Consider R(EmpNo, DeptNo, ProjNo) with tuples {(1001, 01, 12), (1001, 01, 13), (1002, 01, 12), (1003, 01, 14)}. Which statement is NOT correct?',
      options: [
        'The functional dependency (EmpNo, DeptNo) → ProjNo holds over R.',
        'The functional dependency EmpNo → DeptNo holds over R.',
        'The functional dependency ProjNo → DeptNo holds over R.',
        'The functional dependency (EmpNo, ProjNo) → DeptNo holds over R.'
      ],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-286',
      num: 286,
      topic: 'Functional Dependencies & Normalization',
      question: 'If B is a subset of A, then A → B. This also implies that A → A always holds. Which inference rule applies?',
      options: ['Additivity', 'Projectivity', 'Decomposition', 'Reflexivity'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-287',
      num: 287,
      topic: 'Functional Dependencies & Normalization',
      question: 'Functional dependencies under the inference rule of reflexivity are called ________ dependencies.',
      options: ['Augmentation', 'Transitivity', 'Projectivity', 'Trivial'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-288',
      num: 288,
      topic: 'Functional Dependencies & Normalization',
      question: 'If we have A → B, then AC → BC. Which inference rule applies?',
      options: ['Union', 'Decomposition', 'Augmentation', 'Reflexivity'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-289',
      num: 289,
      topic: 'Functional Dependencies & Normalization',
      question: 'If stId → prName and prName → credits, then stId → credits. This is an example of the _______ inference rule.',
      options: ['Augmentation', 'Transitivity', 'Projectivity', 'Additivity'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-290',
      num: 290,
      topic: 'Functional Dependencies & Normalization',
      question: 'Given Emp_No → {Ename, Bdate, Address, Dept_No} and Dept_No → {Dname, Mgr_No}, which additional FD can be inferred?',
      options: [
        'Emp_No → {Dname, Mgr_No}',
        'Emp_Name → Dept_No',
        'Emp_Name → Dept_Name',
        'Emp_Name, Dept_No → Mgr_No'
      ],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-291',
      num: 291,
      topic: 'Functional Dependencies & Normalization',
      question: 'If A → B and CB → D, then AC → D. This follows the _____________ inference rule.',
      options: ['Additivity', 'Projectivity', 'Decomposition', 'Pseudo-transitivity'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-292',
      num: 292,
      topic: 'Functional Dependencies & Normalization',
      question: 'Normalization is a process of restructuring a relation to:',
      options: [
        'Minimize duplication of data in a database',
        'Maximize duplication of data to ensure reliability',
        'Make it of uniform size',
        'Allow unrestricted addition of duplicate data'
      ],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-293',
      num: 293,
      topic: 'Functional Dependencies & Normalization',
      question: 'Identify the correct statement with respect to normalization.',
      options: [
        'Normalization is a formal technique that can be used only at the starting phase of database design.',
        'Normalization can be used as a top-down standalone database design technique.',
        'Normalization through decomposition must achieve the lossless-join property at any cost, whereas dependency preservation is sometimes sacrificed.',
        'Normalization through decomposition must achieve dependency preservation at any cost, whereas the lossless-join property is sometimes sacrificed.'
      ],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-294',
      num: 294,
      topic: 'Functional Dependencies & Normalization',
      question: '___________ is a state of database where a “course” cannot be inserted in the table because this course has not been registered to any “student”.',
      options: ['Insertion anomaly', 'Deletion anomaly', 'Updation anomaly', 'Redundancy'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-295',
      num: 295,
      topic: 'Functional Dependencies & Normalization',
      question: 'A database state where deletion of information about a student record deletes the course information as well is called a:',
      options: ['Insertion anomaly', 'Updation anomaly', 'Redundancy', 'Deletion anomaly'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-296',
      num: 296,
      topic: 'Functional Dependencies & Normalization',
      question: 'Atomicity is a feature of:',
      options: ['1NF', '2NF', '3NF', 'BCNF'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-297',
      num: 297,
      topic: 'Functional Dependencies & Normalization',
      question: 'Creating relationships between new tables and their predecessors through the use of foreign keys is a general requirement of:',
      options: ['First normal form', 'Second normal form', 'Third normal form', 'Fourth normal form'],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-298',
      num: 298,
      topic: 'Functional Dependencies & Normalization',
      question: 'After moving the determined columns from the original table to a new table while converting to 2NF, the determinant becomes the _______ of the new table.',
      options: ['Primary key', 'Foreign key', 'Secondary key', 'Composite key'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-299',
      num: 299,
      topic: 'Functional Dependencies & Normalization',
      question: 'Which of the following concepts is applicable with respect to 3NF?',
      options: ['Full functional dependency', 'Any kind of dependency', 'Transitive dependency', 'Partial functional dependency'],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-300',
      num: 300,
      topic: 'Functional Dependencies & Normalization',
      question: 'Identify the condition which enforces a relation in 3NF:',
      options: [
        'Every non-key attribute is fully functionally dependent on the primary key only.',
        'Every non-key attribute is partially dependent on a super key.',
        'The domain of each attribute includes only atomic values.',
        'Every non-key attribute is non-transitively dependent on every candidate/primary key.'
      ],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-301',
      num: 301,
      topic: 'Functional Dependencies & Normalization',
      question: 'For third normal form we concentrate on relations with one ________ key, and we eliminate transitive dependencies.',
      options: ['Candidate', 'Composite', 'Super key', 'Foreign key'],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-302',
      num: 302,
      topic: 'Functional Dependencies & Normalization',
      question: 'Consider Interview(CandidateNo, InterviewDate, InterviewTime, StaffNo, RoomNo) with FDs: (1) CandidateNo, InterviewDate → InterviewTime, StaffNo, RoomNo; (2) RoomNo, InterviewDate, InterviewTime → StaffNo, CandidateNo; (3) StaffNo, InterviewDate → RoomNo. Which statement is correct?',
      options: [
        'The relation Interview is in 3NF.',
        'The relation Interview is in BCNF.',
        'FD3 violates 3NF.',
        'FD2 violates 2NF.'
      ],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-303',
      num: 303,
      topic: 'Functional Dependencies & Normalization',
      question: 'A relation is said to be in BCNF when:',
      options: [
        'It has overlapping composite keys',
        'It has no composite keys',
        'It has no multivalued dependencies',
        'It has no overlapping composite candidate keys with determinants of non-trivial FDs that are not superkeys'
      ],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-304',
      num: 304,
      topic: 'Functional Dependencies & Normalization',
      question: 'A 3NF relation is converted to BCNF by:',
      options: [
        'Removing composite keys',
        'Removing multivalued dependencies',
        'Placing dependent attributes of overlapping composite keys in a separate relation',
        'Placing dependent non-key attributes in a separate table'
      ],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-305',
      num: 305,
      topic: 'Functional Dependencies & Normalization',
      question: 'Which normal form deals with possible lossless join-dependency decompositions?',
      options: ['2NF', '3NF', '4NF', '5NF'],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-306',
      num: 306,
      topic: 'Database Fundamentals & Architecture',
      question: "According to E.F. Codd's classification of DBMS services, which of the following is NOT considered a standard DBMS function?",
      options: ["User-accessible data catalog or data dictionary","Concurrency control services","Failure response service","Support for data communication"],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-307',
      num: 307,
      topic: 'Relational Model & Integrity Constraints',
      question: "When mapping a Many-to-Many (M:M) relationship between two entity types into relational schemas, how many total tables are created?",
      options: ["Three tables (two entity tables plus one associative junction table)","Two tables with cross-referencing foreign keys","One consolidated master table","Four tables including surrogate index tables"],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-308',
      num: 308,
      topic: 'Relational Algebra',
      question: "Which relational algebra join operation is equivalent to an equi-join, with the only difference being that duplicate join columns are eliminated from the resulting table?",
      options: ["Semi-join","Outer join","Theta join","Natural join"],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-309',
      num: 309,
      topic: 'Database Fundamentals & Architecture',
      question: "With the help of _________ techniques, data values represented with smaller-sized codes can further reduce the secondary storage space needed by a database.",
      options: ["Data expansion","Data compression","Data negation","Data denormalization"],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-310',
      num: 310,
      topic: 'DFD & Database Development',
      question: "In a Data Flow Diagram (DFD), which symbol or operator is used when data flows from a single source process exclusively to one of several alternative sinks?",
      options: ["Ring Sum Operator (⊕)","Plus operator (+)","Asterisk operator (*)","Arrowhead operator"],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-311',
      num: 311,
      topic: 'Database Fundamentals & Architecture',
      question: "A major benefit of data sharing across multiple application programs in a centralized database system is that:",
      options: ["All users can alter table schemas without administrator privileges","Physical storage indexing is no longer needed","Different applications need not store duplicated copies of the same data repeatedly","Network communication overhead is completely eliminated"],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-312',
      num: 312,
      topic: 'Database Fundamentals & Architecture',
      question: "In the ANSI/SPARC three-level database architecture, changes made at ________ levels of the architecture require ________ levels of user attention.",
      options: ["Identical, identical","Different, different","Internal, maximum","Higher, zero"],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-313',
      num: 313,
      topic: 'Database Fundamentals & Architecture',
      question: "Which of the following best defines Database Modeling in database development?",
      options: ["The physical formatting and partitioning of storage disks","The installation and patch management of database server software","Writing ad-hoc procedural scripts for client workstations","The process of creating the logical structure and abstract relationships of the data to be stored"],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-314',
      num: 314,
      topic: 'Database Fundamentals & Architecture',
      question: "Once data has been transported and mapped down to the physical storage level in a database system, it is then managed directly by the:",
      options: ["Operating system and underlying file management subsystem","Conceptual schema analyst","Application frontend interface","Data flow diagram processor"],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-315',
      num: 315,
      topic: 'Database Fundamentals & Architecture',
      question: "Which of the following is INCORRECT with respect to traditional file systems versus database systems?",
      options: ["Some physical file organizations use pointers to record blocks to locate records on disk.","A logical record is concerned with the efficient physical storage of information on secondary storage devices.","At the physical level, pointer or hashed address schemes can provide a degree of data independence.","File system efficiency depends on how fast retrieve, insert, update, and delete operations execute."],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-316',
      num: 316,
      topic: 'Database Fundamentals & Architecture',
      question: "Which of the following responsibilities is typically NOT performed by the Database Administrator (DBA)?",
      options: ["Planning, designing, and implementing the physical database structures","Establishing standards and security authorization procedures for the database","Communicating directly with business end-users to gather operational requirements during business process analysis","Allocation of secondary storage locations and internal access paths"],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-317',
      num: 317,
      topic: 'Database Fundamentals & Architecture',
      question: "Select the correct statement regarding the conceptual level in the ANSI/SPARC architecture:",
      options: ["The conceptual level acts as a level of indirection between the internal physical level and the external user views.","The internal level in every database implementation must be strictly relational.","A database has many conceptual schemas and only one external schema.","The external level is completely unconcerned with individual user perceptions."],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-318',
      num: 318,
      topic: 'Functional Dependencies & Normalization',
      question: "Consider a relation with functional dependencies: Emp_No → {Ename, Bdate, Address, Dept_No} and Dept_No → {Dname, Mgr_No}. Which additional functional dependency can be derived using the Transitivity inference rule?",
      options: ["Emp_Name → Dept_No","Emp_Name → Dept_Name","Emp_Name, Dept_No → Mgr_No","Emp_No → {Dname, Mgr_No}"],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-319',
      num: 319,
      topic: 'Functional Dependencies & Normalization',
      question: "If W, X, Y, and Z are attribute sets in a relation, which of the following Armstrong inference rules for functional dependencies is formally correct?",
      options: ["If (X, Z) → Y, then X → Y and Z → Y","If X → Y and X → Z, then X → YZ (Union rule)","If XY → Z, then Y → X","If X → Y, then (X, Z) → (Y, W)"],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-320',
      num: 320,
      topic: 'Relational Algebra',
      question: "Given relations Student(Fname, Lname) and Instructor(Fname, Lname), which relational algebra operation correctly determines the individuals who are simultaneously students and instructors?",
      options: ["Instructor − Student (Difference)","Student ÷ Instructor (Division)","Student ∩ Instructor (Intersection)","Student ∪ Instructor (Union)"],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-321',
      num: 321,
      topic: 'Database Fundamentals & Architecture',
      question: "Consider the following statements regarding the ANSI/SPARC three-level database architecture:\n(A) Conceptual schema is a logical description of all data elements and relationships.\n(B) Internal schema describes the physical storage structures and access paths.\n(C) External schema provides the user-specific view.\nWhich of the statements are correct?",
      options: ["Statements A, B, and C are all correct","Only statement A is correct","Only statement B is correct","Only statements B and C are correct"],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-322',
      num: 322,
      topic: 'Relational Model & Integrity Constraints',
      question: "Which of the following is the standard method for implementing a Many-to-Many (M:M) relationship in relational table design?",
      options: ["Adding foreign keys to both entity tables directly referencing each other's primary keys","Merging both entities into a single flat unnormalized table","Creating three separate tables with no foreign key references","Creating a junction table whose composite primary key comprises foreign keys referencing both participating entities"],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-323',
      num: 323,
      topic: 'Relational Model & Integrity Constraints',
      question: "Which of the following is a true property of a mathematical relation in the Relational Data Model?",
      options: ["Duplicate tuples are permissible in a base relation.","The sequence (order) of rows is irrelevant and insignificant.","Attributes in a single table can share identical names.","The column order determines which records can be updated."],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-324',
      num: 324,
      topic: 'ER Modeling & Relationships',
      question: "In a conceptual database model for an educational institute, what is the cardinality ratio between Student and Grade entities?",
      options: ["1:M (One student can receive multiple course grades)","1:1 (One student receives only a single grade in total)","M:M (Multiple students share identical grade records)","Ternary relationship among student, grade, and course code"],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-325',
      num: 325,
      topic: 'Relational Model & Integrity Constraints',
      question: "Which statement correctly distinguishes entity integrity from referential integrity?",
      options: ["Entity integrity is specified across multiple relations, while referential integrity applies only within one relation.","Entity integrity prevents composite keys from being defined.","Entity integrity applies to primary keys within an individual relation, while referential integrity applies across relations.","Referential integrity requires that all candidate key attributes be non-null."],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-326',
      num: 326,
      topic: 'Functional Dependencies & Normalization',
      question: "Which normal form is specifically designed to eliminate multivalued dependencies (MVDs) from a relational schema?",
      options: ["3NF (Third Normal Form)","BCNF (Boyce-Codd Normal Form)","2NF (Second Normal Form)","4NF (Fourth Normal Form)"],
      correctIndex: 3
    },
    {
      id: 'cs403-mid-327',
      num: 327,
      topic: 'Relational Model & Integrity Constraints',
      question: "Which of the following is the standard way to implement a 1:1 (One-to-One) relationship in relational database design?",
      options: ["By always requiring a separate associative junction table","As a single combined table, or as two tables linked by primary and foreign keys with a UNIQUE constraint","By creating three separate tables connected by composite surrogate keys","By denormalizing the tables into nested multidimensional arrays"],
      correctIndex: 1
    },
    {
      id: 'cs403-mid-328',
      num: 328,
      topic: 'ER Modeling & Relationships',
      question: "In database schema naming conventions, what linguistic pattern is standard for entity types and relationship types?",
      options: ["Singular nouns are used for entity types, while verbs or verb phrases indicate relationship types.","Plural nouns are used for entity types, while adjectives indicate relationship types.","Verbs are used for entity types, while nouns represent relationship types.","Arbitrary abbreviations should always replace full entity names."],
      correctIndex: 0
    },
    {
      id: 'cs403-mid-329',
      num: 329,
      topic: 'Database Fundamentals & Architecture',
      question: "A Database Management System (DBMS) provides all of the following advantages EXCEPT:",
      options: ["Enforcing data integrity constraints and standardized security protocols","Minimizing data redundancy and inconsistency across multiple applications","Allowing unrestricted access to all company records by any user without authorization","Providing backup and recovery services to restore consistent database states"],
      correctIndex: 2
    },
    {
      id: 'cs403-mid-330',
      num: 330,
      topic: 'Functional Dependencies & Normalization',
      question: "Consider relation R(EmpNo, DeptNo, ProjNo) with tuples: (1001, 01, 12), (1001, 01, 13), (1002, 01, 12), (1003, 01, 14). Which of the following functional dependencies does NOT hold over R?",
      options: ["EmpNo → DeptNo","DeptNo → ProjNo","ProjNo → DeptNo","(EmpNo, ProjNo) → DeptNo"],
      correctIndex: 1
    }
  ]
};
