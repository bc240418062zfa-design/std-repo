import { SubjectiveSet } from '../../types';

export const cs403Sub: SubjectiveSet = {
  id: 'cs403-subjective',
  courseCode: 'CS403',
  courseTitle: 'Database Management Systems',
  term: 'midterm',
  termLabel: 'Core & Exam Prep',
  description:
    'Focused DBMS fast-prep deck covering Horizontal/Vertical Partitioning, Clustered vs Non-Clustered Indexes, 1NF–3NF Normalization, SQL DDL/DML/Views, Concurrency & ACID properties.',
  topics: [
    'Partitioning & Storage',
    'Indexes & Hashing',
    'SQL & Views',
    'Normalization (1NF–3NF)',
    'Transactions & Concurrency'
  ],
  questions: [
    {
      id: 'cs403-sub-1',
      num: 1,
      question:
        'Distinguish between Horizontal Partitioning and Vertical Partitioning, and name the three types of Horizontal Partitioning.',
      marks: 3,
      term: 'midterm',
      topic: 'Partitioning & Storage',
      quickHook: 'Horizontal splits ROWS (Range, List, Hash); Vertical splits COLUMNS (often paired with PK).',
      keyPoints: [
        'Horizontal Partitioning splits table rows (tuples) across partitions with identical columns.',
        'Three Horizontal Partitioning methods: Range Partitioning, List Partitioning, and Hash Partitioning.',
        'Vertical Partitioning splits table columns (attributes) into separate tables sharing the Primary Key.'
      ],
      modelAnswer:
        'Horizontal Partitioning divides a table into subsets of rows while preserving every column in each partition; its three primary strategies are Range Partitioning (continuous intervals like dates), List Partitioning (discrete values like provinces Punjab/Sindh), and Hash Partitioning (modulo hash distribution). Vertical Partitioning divides a wide table by columns—keeping frequently accessed attributes in one table and bulky or rare columns in another linked by the same Primary Key.',
      examTip: 'Common exam scenario: Given 3 rows Punjab and 2 rows Sindh -> List partitioning produces 2 groups (one per distinct key value).'
    },
    {
      id: 'cs403-sub-2',
      num: 2,
      question:
        'Differentiate between Clustered Index and Non-Clustered Index with one real example.',
      marks: 3,
      term: 'midterm',
      topic: 'Indexes & Hashing',
      quickHook: 'Clustered = physically sorts the table rows (only 1 per table, like a dictionary); Non-Clustered = separate pointer lookup (many allowed, like a book index).',
      keyPoints: [
        'A Clustered Index determines the physical storage order of actual data rows on disk; therefore, a table can have ONLY ONE clustered index.',
        'A Non-Clustered Index builds a separate index structure containing index keys and row pointers; a table can have multiple non-clustered indexes.',
        'Example of Clustered Index: Primary Key Student_ID sorting records sequentially on disk (analogous to an alphabetical dictionary).'
      ],
      modelAnswer:
        'A Clustered Index physically orders the rows of a table on disk according to the indexed key, so at most one clustered index can exist per table (e.g., an index automatically created on a Student_ID Primary Key). A Non-Clustered Index creates an independent lookup structure storing key values along with pointers (Row IDs) to actual table rows, allowing multiple non-clustered indexes per table—similar to the back-of-book index pointing to page numbers.',
      codeSnippet: `CREATE UNIQUE INDEX idx_emp_cnic ON Employee(CNIC); -- Non-clustered lookup\nDROP INDEX idx_emp_cnic ON Employee;               -- Removing an index`
    },
    {
      id: 'cs403-sub-3',
      num: 3,
      question:
        'Write SQL statements to: (a) create table Accounts with Account_ID INT Primary Key and Account_Type VARCHAR(30) NOT NULL, and (b) create a view ST_LIST showing all columns from Student.',
      marks: 5,
      term: 'midterm',
      topic: 'SQL & Views',
      quickHook: 'DDL creates objects: CREATE TABLE Name (col type constraint) and CREATE VIEW Name AS SELECT ...',
      keyPoints: [
        'Use CREATE TABLE Accounts with PRIMARY KEY on Account_ID and NOT NULL constraint on Account_Type.',
        'Use CREATE VIEW ST_LIST AS SELECT * FROM Student;',
        'Remember ALTER TABLE ... ADD ... for adding columns later and SELECT ... WHERE ... LIKE "A%" for pattern matching.'
      ],
      modelAnswer:
        'SQL Data Definition Language (DDL) defines tables, constraints, and virtual tables (views). Primary Key enforces uniqueness and non-null identity, while NOT NULL rejects missing values. A View stores a saved query definition rather than duplicating table data.',
      codeSnippet: `-- (a) Create table with Primary Key & NOT NULL\nCREATE TABLE Accounts (\n  Account_ID INT PRIMARY KEY,\n  Account_Type VARCHAR(30) NOT NULL\n);\n\n-- (b) Create view over Student table\nCREATE VIEW ST_LIST AS\nSELECT * FROM Student;`,
      examTip: 'Three types of Views in VU CS403: Single-Table View, Join (Multiple-Table) View, and Materialized / Dynamic Views (or Updatable vs Read-Only).'
    },
    {
      id: 'cs403-sub-4',
      num: 4,
      question:
        'Given ORDER(OrderID, CustomerID, CustomerName): identify why it violates Third Normal Form (3NF) and show the normalized decomposition.',
      marks: 3,
      term: 'midterm',
      topic: 'Normalization (1NF–3NF)',
      quickHook: 'OrderID -> CustomerID -> CustomerName is a Transitive Dependency (non-key -> non-key); split Customer out!',
      keyPoints: [
        'OrderID is the Primary Key, so OrderID -> CustomerID and CustomerID -> CustomerName.',
        'CustomerName depends transitively on OrderID via non-key attribute CustomerID, violating 3NF.',
        'Fix: Remove CustomerName into a separate Customer(CustomerID, CustomerName) table, keeping CustomerID as a Foreign Key in ORDER.'
      ],
      modelAnswer:
        'A relation is in 3NF if it is in 2NF and contains no transitive dependency (no non-key attribute functionally determining another non-key attribute). Here, OrderID determines CustomerID, and CustomerID determines CustomerName—causing update, insertion, and deletion anomalies. Decompose into: ORDER(OrderID PK, CustomerID FK) and CUSTOMER(CustomerID PK, CustomerName).',
      examTip: 'Quick checklist: 1NF = atomic values; 2NF = no partial dependency on composite PK; 3NF = no transitive dependency.'
    },
    {
      id: 'cs403-sub-5',
      num: 5,
      question:
        'List the 4 ACID properties of database transactions and name three problems caused by uncontrolled concurrent transaction execution.',
      marks: 5,
      term: 'midterm',
      topic: 'Transactions & Concurrency',
      quickHook: 'ACID = Atomicity, Consistency, Isolation, Durability; Concurrency problems = Lost Update, Uncommitted Update (Dirty Read), Inconsistent Analysis.',
      keyPoints: [
        'Atomicity: all operations succeed (COMMIT) or none take effect (ROLLBACK).',
        'Consistency: transaction moves database from one valid state to another.',
        'Isolation: concurrent transactions execute without interfering with each other (Two-Phase Locking ensures serializability).',
        'Durability: committed changes persist in log/disk even after system crash.',
        'Three concurrency problems: Lost Update Problem, Uncommitted Update (Dirty Read) Problem, and Inconsistent Analysis Problem.'
      ],
      modelAnswer:
        'Database transactions guarantee reliability through ACID properties: Atomicity (all-or-nothing via COMMIT/ROLLBACK), Consistency (preserving integrity constraints), Isolation (preventing interference using protocols such as Two-Phase Locking / 2PL), and Durability (permanent recovery logs). Without concurrency control, three classic anomalies occur: 1) Lost Update (one transaction overwrites another’s update), 2) Uncommitted Update / Dirty Read (reading uncommitted data later rolled back), and 3) Inconsistent Analysis (reading changing values mid-aggregation).'
    }
  ]
};
