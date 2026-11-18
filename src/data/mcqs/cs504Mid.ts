import { McqSet } from '../../types';

export const cs504Mid: McqSet = {
  id: 'cs504-midterm',
  courseCode: 'CS504',
  courseTitle: 'Software Engineering - I',
  term: 'midterm',
  termLabel: 'Mid-Term',
  description: 'Software requirements, functional & non-functional criteria, UML diagrams, domain modeling, architecture, cohesion & coupling.',
  topics: [],
  questions: [
    {
      id: 'cs504-mid-1',
      num: 1,
      question: 'What is the most crucial non-functional requirement of a system to control radiation dosages that are emitted as treatment for cancer?',
      options: ['Accuracy', 'Security', 'Reliability', 'Usability'],
      correctIndex: 0
    },
    {
      id: 'cs504-mid-2',
      num: 2,
      question: 'Which of the following is NOT an objective for building an analysis model?',
      options: [
        'Define set of software requirements',
        'Describe customer requirements',
        'Develop an abbreviated solution for the problem',
        'Establish basis for software design'
      ],
      correctIndex: 2
    },
    {
      id: 'cs504-mid-3',
      num: 3,
      question: 'CRUD operations do not include _______',
      options: ['Create', 'Read', 'Update', 'Flow'],
      correctIndex: 3
    },
    {
      id: 'cs504-mid-4',
      num: 4,
      question: 'Which of the following is not considered as benefit of prototyping?',
      options: [
        'Provide rapid feedback from the user to the designer',
        'Help validate requirements with fewer errors',
        'Enhance designer and user understanding of what system should accomplish',
        'Prototyping is a technique that can be used to reduce customer satisfaction'
      ],
      correctIndex: 3
    },
    {
      id: 'cs504-mid-5',
      num: 5,
      question: '"isAuthorized", "assess Performance", are examples of',
      options: ['Properties', 'Services', 'Attributes', 'Links'],
      correctIndex: 1
    },
    {
      id: 'cs504-mid-6',
      num: 6,
      question: 'Cohesion is about making sure that each component does _____ thing(s) and does it well.',
      options: ['Three', 'Two', 'Infinite', 'One'],
      correctIndex: 3
    },
    {
      id: 'cs504-mid-7',
      num: 7,
      question: 'Static components of an OOA model are _______________',
      options: ['Focus on control', 'Not reusable', 'Sensitive to timing and event processing', 'Structural in nature'],
      correctIndex: 3
    },
    {
      id: 'cs504-mid-8',
      num: 8,
      question: 'OOA is intended to define ________, their relationships, and their behavior.',
      options: ['Variables', 'Classes', 'Objects', 'Subjects'],
      correctIndex: 2
    },
    {
      id: 'cs504-mid-9',
      num: 9,
      question: 'Which of the following is not part of software architecture?',
      options: ['Algorithm details', 'Databases', 'Data design', 'Program structure'],
      correctIndex: 0
    },
    {
      id: 'cs504-mid-10',
      num: 10,
      question: 'The vision statement should reflect a ________ that will satisfy the need of diverse customers.',
      options: ['Balanced View', 'System view', 'Functional View', 'Non Functional View'],
      correctIndex: 0
    },
    {
      id: 'cs504-mid-11',
      num: 11,
      question: 'Use cases describe the system as a ______________ and hide the internal details from the user.',
      options: ['Black Box', 'White Box', 'Key Box', 'Inbox'],
      correctIndex: 0
    },
    {
      id: 'cs504-mid-12',
      num: 12,
      question: 'Software Engineering is the combination of tools, techniques and ________________.',
      options: ['Testing', 'Processes', 'Maintenance', 'Design'],
      correctIndex: 1
    },
    {
      id: 'cs504-mid-13',
      num: 13,
      question: 'The project manager would need ________ to monitor and track the progress of the project.',
      options: ['Feasibility report', 'Requirement document', 'Design document', 'User manual'],
      correctIndex: 1
    },
    {
      id: 'cs504-mid-14',
      num: 14,
      question: 'A software requirement document describes all the __________ provided by the system along with the constraints under which it must operate.',
      options: ['Conditions', 'Services', 'Tasks', 'Actions'],
      correctIndex: 1
    },
    {
      id: 'cs504-mid-15',
      num: 15,
      question: 'Agreement, assignment, authorization, contract, delivery, deposit, incident etc are examples of __________.',
      options: ['Object', 'Participant', 'Tangible', 'Transaction'],
      correctIndex: 3
    },
    {
      id: 'cs504-mid-16',
      num: 16,
      question: 'In sequence diagram, a message is represented by a/an _______________.',
      options: ['Arrow', 'Straight line', 'Dotted line', 'Box'],
      correctIndex: 0
    },
    {
      id: 'cs504-mid-17',
      num: 17,
      question: '__________ design decisions should be ones that remain constant in software development cycle.',
      options: ['Early', 'Late', 'Heterogeneous', 'Both a and b'],
      correctIndex: 0
    },
    {
      id: 'cs504-mid-18',
      num: 18,
      question: 'The data model consists of three pieces of interrelated information. Which of the following is not a piece of interrelated information?',
      options: ['Attributes', 'Data objects', 'Relationships', 'Controls'],
      correctIndex: 3
    },
    {
      id: 'cs504-mid-19',
      num: 19,
      question: 'The first most important step in developing any system is to identify ________.',
      options: ['Purpose of the system', 'Implementation of the system', 'Design of the system', 'Architecture of the system'],
      correctIndex: 0
    },
    {
      id: 'cs504-mid-20',
      num: 20,
      question: 'When the measure of independence of a module or component is low, changes in one component have a ______ effect on the other component.',
      options: ['No', 'Low', 'High', 'Equal'],
      correctIndex: 2
    },
    {
      id: 'cs504-mid-21',
      num: 21,
      question: 'The state transition diagram ______',
      options: [
        'Depicts relationships between data objects',
        'Depicts functions that transform the data flow',
        'Indicates how data are transformed by the system',
        'Indicates system reactions to external events'
      ],
      correctIndex: 3
    },
    {
      id: 'cs504-mid-22',
      num: 22,
      question: 'Domain model is _________ step in making an efficient system.',
      options: ['Initial', 'Secondary', 'Last', 'Middle'],
      correctIndex: 0
    },
    {
      id: 'cs504-mid-23',
      num: 23,
      question: 'What would be the most suitable architecture to develop a commercial web page to do business transactions over the internet?',
      options: ['Client server model', 'Island model', 'RAD model', 'Repository model'],
      correctIndex: 0
    },
    {
      id: 'cs504-mid-24',
      num: 24,
      question: 'UML (unified modeling language) analysis modeling focuses on the ________________.',
      options: [
        'Behavioral model and environment model.',
        'Behavioral model and implementation model.',
        'User model and environmental model',
        'User model and structural model'
      ],
      correctIndex: 3
    },
    {
      id: 'cs504-mid-25',
      num: 25,
      question: 'The vertical dotted lines in sequence diagram represent ________',
      options: ['Creation of objects', 'Life line of objects', 'Structure of objects', 'Services of objects'],
      correctIndex: 1
    },
    {
      id: 'cs504-mid-26',
      num: 26,
      question: '40-60% of all defects found in software projects can be traced back to poor ________',
      options: ['Requirements', 'Design', 'Coding', 'Testing'],
      correctIndex: 0
    },
    {
      id: 'cs504-mid-27',
      num: 27,
      question: 'A SRS is said to be __________ if and only if, every requirement stated therein has only one interpretation.',
      options: ['Compact', 'Unambiguous', 'Consistent', 'Detailed'],
      correctIndex: 1
    },
    {
      id: 'cs504-mid-28',
      num: 28,
      question: 'Which of the following is NOT among directly related construction activities of software development?',
      options: ['Management', 'Testing', 'Requirements Elicitation', 'Design development'],
      correctIndex: 0
    },
    {
      id: 'cs504-mid-29',
      num: 29,
      question: 'The __________ relationship is kind of a generalization-specialization relationship.',
      options: ['Composition', 'Uses', 'Association', 'Extends'],
      correctIndex: 3
    },
    {
      id: 'cs504-mid-30',
      num: 30,
      question: '____________________ relationship is concerned with classes not with the class instances.',
      options: ['Aggregation', 'Inheritance', 'Composition', 'Association'],
      correctIndex: 1
    },
    {
      id: 'cs504-mid-31',
      num: 31,
      question: '________ activities are directly related to software development.',
      options: ['Construction', 'Management', 'Quality assurance', 'Project planning'],
      correctIndex: 0
    },
    {
      id: 'cs504-mid-32',
      num: 32,
      question: 'Two components of use-case model are actors and ____________.',
      options: ['Functional requirements', 'Processes', 'Use-cases', 'System boundary'],
      correctIndex: 2
    },
    {
      id: 'cs504-mid-33',
      num: 33,
      question: '____________ is not part of the Peter Coad methodology.',
      options: ['Select actors', 'Select participants', 'Select places', 'Select actions'],
      correctIndex: 3
    },
    {
      id: 'cs504-mid-34',
      num: 34,
      question: 'Transactions are the ________ that must be remembered through time.',
      options: ['Events', 'Actions', 'Triggers', 'Methods'],
      correctIndex: 0
    },
    {
      id: 'cs504-mid-35',
      num: 35,
      question: 'The verbs in your problem domain usually indicate some of the ________ required of the associated object.',
      options: ['Services', 'Objects', 'Collaborations', 'Actors'],
      correctIndex: 0
    },
    {
      id: 'cs504-mid-36',
      num: 36,
      question: 'For purpose of behavior modeling, a state is any __________.',
      options: ['Consumer or producer of data', 'Data object hierarchy', 'Observable mode of behavior', 'Well defined process'],
      correctIndex: 2
    },
    {
      id: 'cs504-mid-37',
      num: 37,
      question: 'A complex system evolves from a ____________________.',
      options: ['Smaller system', 'Simpler system', 'Bigger system', 'Medium system'],
      correctIndex: 1
    },
    {
      id: 'cs504-mid-38',
      num: 38,
      question: 'What is the major difference between cohesion and coupling?',
      options: [
        'Both describe inheritance',
        'Cohesion is between modules; coupling is within a module',
        'Cohesion is within a module; coupling is between modules',
        'Cohesion applies only to databases'
      ],
      correctIndex: 2
    },
    {
      id: 'cs504-mid-39',
      num: 39,
      question: 'Loose coupling means that changes in one component have a ______ effect on other components.',
      options: ['Permanent', 'Limited', 'Maximum', 'Unlimited'],
      correctIndex: 1
    },
    {
      id: 'cs504-mid-40',
      num: 40,
      question: 'Which of the following is one of the five main risk impact areas in software development?',
      options: ['Office decoration', 'Employee lunch schedule', 'Printer ink colour', 'New, unproven technologies'],
      correctIndex: 3
    },
    {
      id: 'cs504-mid-41',
      num: 41,
      question: 'Which of the following is NOT a parameter of a collaboration diagram?',
      options: ['Use cases', 'Objects', 'Messages', 'Links'],
      correctIndex: 0
    },
    {
      id: 'cs504-mid-42',
      num: 42,
      question: 'According to the rules of thumb, an actor knows about its ______.',
      options: ['Database schema', 'Participants', 'Source code', 'Compiler'],
      correctIndex: 1
    },
    {
      id: 'cs504-mid-43',
      num: 43,
      question: 'In the statement "Alia has a fruit basket", which of the following is an object?',
      options: ['Alia', 'Person', 'Baskets', 'Fruits'],
      correctIndex: 0
    },
    {
      id: 'cs504-mid-44',
      num: 44,
      question: 'In the same statement, the relationship between Basket and Fruits is best described as ______.',
      options: ['Dependency', 'Generalization', 'Inheritance', 'Association–Container'],
      correctIndex: 3
    },
    {
      id: 'cs504-mid-45',
      num: 45,
      question: 'Which of the following is a typical functional requirement?',
      options: ['Usability', 'Performance', 'Business rules', 'Reliability'],
      correctIndex: 2
    },
    {
      id: 'cs504-mid-46',
      num: 46,
      question: 'A non-functional requirement specifies ______.',
      options: [
        'Criteria to judge the operation of a system rather than specific behaviors',
        'Only the user interface colours',
        'The programming language syntax',
        'Only the database tables'
      ],
      correctIndex: 0
    },
    {
      id: 'cs504-mid-47',
      num: 47,
      question: 'Which diagram is best to see the flow of time?',
      options: ['Sequence diagram', 'Collaboration diagram', 'Class diagram', 'DFD'],
      correctIndex: 0
    },
    {
      id: 'cs504-mid-48',
      num: 48,
      question: 'Which diagram is best for representing static object connections?',
      options: ['Use case diagram', 'State transition diagram', 'Sequence diagram', 'Collaboration diagram'],
      correctIndex: 3
    },
    {
      id: 'cs504-mid-49',
      num: 49,
      question: 'A post-condition describes ______.',
      options: [
        'A condition that must be true after a use case or operation completes',
        'A condition that must be true before it starts',
        'The internal code of the operation',
        "The actor's login password"
      ],
      correctIndex: 0
    },
    {
      id: 'cs504-mid-50',
      num: 50,
      question: 'Which of the following is the first phase in the software development phases listed in the paper?',
      options: ['Planning stage', 'Software testing', 'Design and prototyping', 'Operations and maintenance'],
      correctIndex: 0
    },
    {
      id: 'cs504-mid-51',
      num: 51,
      question: 'Which phase comes immediately after the design and prototyping stage?',
      options: ['Feasibility analysis', 'Software development stage', 'Planning stage', 'Operations and maintenance'],
      correctIndex: 1
    },
    {
      id: 'cs504-mid-52',
      num: 52,
      question: 'Actors in a system are ______.',
      options: [
        'Only database tables',
        'Only use case diagrams',
        'Only software modules',
        'People and organizations that take part in the system under consideration'
      ],
      correctIndex: 3
    },
    {
      id: 'cs504-mid-53',
      num: 53,
      question: "In Abbott's textual analysis, a proper noun maps to a/an ______.",
      options: ['Attribute', 'Operation', 'Instance', 'Class'],
      correctIndex: 2
    },
    {
      id: 'cs504-mid-54',
      num: 54,
      question: "In Abbott's textual analysis, a doing verb maps to a/an ______.",
      options: ['Operation', 'Composition', 'Instance', 'Classification'],
      correctIndex: 0
    },
    {
      id: 'cs504-mid-55',
      num: 55,
      question: "In Abbott's textual analysis, a having verb maps to ______.",
      options: ['Composition', 'Attribute', 'Association', 'Operation'],
      correctIndex: 0
    },
    {
      id: 'cs504-mid-56',
      num: 56,
      question: 'Which of the following is the first phase of the data requirements analysis process?',
      options: [
        'Developing source-to-target mappings',
        'Coding the database',
        'Identifying the business contexts',
        'Conducting stakeholder interviews'
      ],
      correctIndex: 2
    },
    {
      id: 'cs504-mid-57',
      num: 57,
      question: 'Which type of collaboration brings together information from disparate sources?',
      options: ['Creative', 'Transactional', 'Compounding', 'Connective'],
      correctIndex: 3
    },
    {
      id: 'cs504-mid-58',
      num: 58,
      question: 'The output of architectural design is a description of the ______.',
      options: ['Test cases', 'Software architecture', 'User manual', 'Source code'],
      correctIndex: 1
    },
    {
      id: 'cs504-mid-59',
      num: 59,
      question: 'Software development activities are broadly divided into ______.',
      options: ['Construction and management', 'Testing and deployment', 'Planning and maintenance', 'Coding and debugging'],
      correctIndex: 0
    },
    {
      id: 'cs504-mid-60',
      num: 60,
      question: 'Which of the following is an example of conflicting requirements in the balancing act?',
      options: ['Link vs. message', 'Class vs. object', 'Cost vs. efficiency', 'Create vs. read'],
      correctIndex: 2
    },
    {
      id: 'cs504-mid-61',
      num: 61,
      question: 'A special form of association that specifies a whole-part relationship is called ______.',
      options: ['Inheritance', 'Dependency', 'Aggregation', 'Generalization'],
      correctIndex: 2
    },
    {
      id: 'cs504-mid-62',
      num: 62,
      question: 'A form of aggregation with strong ownership and coincident lifetime is called ______.',
      options: ['Association', 'Composition', 'Inheritance', 'Realization'],
      correctIndex: 1
    },
    {
      id: 'cs504-mid-63',
      num: 63,
      question: 'Inheritance represents a ______ relationship.',
      options: ['Has-a', 'Uses-a', 'Is-a', 'Part-of'],
      correctIndex: 2
    },
    {
      id: 'cs504-mid-64',
      num: 64,
      question: 'Which of the following is an attribute of the Booking entity in a cinema ticketing system?',
      options: ['payment_customer_id', 'booking_id', 'payment_date', 'payment_amount'],
      correctIndex: 1
    },
    {
      id: 'cs504-mid-65',
      num: 65,
      question: 'Which of the following is one of the two fundamental reasons why software architecture is important?',
      options: [
        'Defining a solution to meet requirements',
        'Reducing the number of programmers',
        'Eliminating all testing',
        'Increasing code line count'
      ],
      correctIndex: 0
    },
    {
      id: 'cs504-mid-66',
      num: 66,
      question: 'Which of the following is one of the three basic types of software?',
      options: ['Programming languages', 'Data files', 'Algorithms', 'Application programs'],
      correctIndex: 3
    },
    {
      id: 'cs504-mid-67',
      num: 67,
      question: 'Which of the following is a major construction activity?',
      options: ['Configuration management', 'Quality assurance', 'Project management', 'Requirement gathering'],
      correctIndex: 3
    },
    {
      id: 'cs504-mid-68',
      num: 68,
      question: 'Why are radio and cat considered objects?',
      options: [
        'They are both electronic devices',
        'They have state, behavior and properties and belong to classes',
        'They have no attributes',
        'They are both animals'
      ],
      correctIndex: 1
    },
    {
      id: 'cs504-mid-69',
      num: 69,
      question: 'Which of the following is the first stage of the software development loop?',
      options: ['Solution Integration', 'Status Quo', 'Technical Development', 'Problem Definition'],
      correctIndex: 3
    },
    {
      id: 'cs504-mid-70',
      num: 70,
      question: 'When the new system is actually deployed at the user site, the situation is called ______.',
      options: ['Technical Development', 'Problem Definition', 'Solution Integration', 'Status Quo'],
      correctIndex: 3
    },
    {
      id: 'cs504-mid-71',
      num: 71,
      question: 'Which of the following is a parameter used to measure and analyze software design quality?',
      options: ['Printer speed', 'Maintainability', 'Office location', 'Number of programmers'],
      correctIndex: 1
    },
    {
      id: 'cs504-mid-72',
      num: 72,
      question: 'Which element of the software engineering framework provides the technical "how-to\'s" for carrying out tasks?',
      options: ['Tools', 'Methods', 'Processes', 'Quality Focus'],
      correctIndex: 1
    },
    {
      id: 'cs504-mid-73',
      num: 73,
      question: 'Which element of the software engineering framework provides automated or semi-automated support?',
      options: ['Quality Focus', 'Methods', 'Tools', 'Processes'],
      correctIndex: 2
    },
    {
      id: 'cs504-mid-74',
      num: 74,
      question: 'How many major elements does a use case diagram have according to the paper?',
      options: ['Two', 'Ten', 'Four', 'Six'],
      correctIndex: 2
    },
    {
      id: 'cs504-mid-75',
      num: 75,
      question: 'A class diagram is a type of ______ diagram.',
      options: ['Dynamic behavior', 'State transition', 'Data flow', 'Static structure'],
      correctIndex: 3
    }
  ]
};
