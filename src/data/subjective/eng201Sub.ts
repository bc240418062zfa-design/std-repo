import { SubjectiveSet } from '../../types';

export const eng201Sub: SubjectiveSet = {
  id: 'eng201-subjective',
  courseCode: 'ENG201',
  courseTitle: 'Business and Technical English Writing',
  term: 'midterm',
  termLabel: 'Core & Exam Prep',
  description:
    'Rapid revision deck for ENG201 covering Report Superstructures, Letter vs Memo Formats, Persuasive Messages (AIDA), Comma Splice Fixes, Biased Language, and Visual Aids.',
  topics: [
    'Reports & Proposals',
    'Memos & Letters',
    'Grammar & Punctuation',
    'Visual Aids',
    'Oral & Persuasive Comm'
  ],
  questions: [
    {
      id: 'eng201-sub-1',
      num: 1,
      question:
        'State the key differences between a Memorandum (Memo) format and a Business Letter format.',
      marks: 3,
      term: 'midterm',
      topic: 'Memos & Letters',
      quickHook: 'Memo = internal (To/From/Date/Subject, no salutation/signature); Letter = external (Inside address, Dear..., Sincerely).',
      keyPoints: [
        'Audience: Memos are used for internal organizational communication; Letters are sent to external recipients (clients, vendors, agencies).',
        'Header: Memos use a standardized heading block (TO, FROM, DATE, SUBJECT); Letters use Sender Return Address + Inside Recipient Address.',
        'Opening & Closing: Memos omit formal salutations ("Dear...") and complimentary closes; Letters require both plus a formal signature block.'
      ],
      modelAnswer:
        'A Memorandum (Memo) serves internal communication within an organization, opening directly with TO, FROM, DATE, and SUBJECT headers and skipping salutations and complimentary closes (using initials if signed). A Business Letter is formal external correspondence featuring a letterhead/return address, date, inside recipient address, formal salutation ("Dear Mr. Khan:"), body, complimentary close ("Sincerely,"), and full handwritten/typed signature.'
    },
    {
      id: 'eng201-sub-2',
      num: 2,
      question:
        'List the conventional superstructure elements of an Instructions manual or General/Empirical Report.',
      marks: 5,
      term: 'midterm',
      topic: 'Reports & Proposals',
      quickHook: 'Instructions = Intro, Theory, Equipment/Materials, Step-by-step Directions, Troubleshooting; General Report = Front Matter + Body + Back Matter.',
      keyPoints: [
        'Conventional Superstructure for Instructions (5 elements): 1) Introduction, 2) Theory of Operation, 3) List of Equipment & Materials, 4) Directions / Step-by-Step Procedure, 5) Troubleshooting.',
        'Prefatory (Front Matter) Parts of Formal Reports: Title Fly, Title Page, Letter of Transmittal, Table of Contents, Executive Summary / Abstract.',
        'Supplementary (Back Matter) Parts: Appendixes, Bibliography / References, Glossary, and Index.'
      ],
      modelAnswer:
        'In technical communication, a Conventional Superstructure for Instructions includes five components: Introduction, Theory of Operation, List of Equipment and Materials, Step-by-Step Directions (with warnings/cautions), and Troubleshooting. Formal reports follow a three-part macro-structure: Prefatory Parts (Title Page, Letter of Transmittal, Table of Contents, Abstract), Body (Introduction, Facts/Findings, Conclusions, Recommendations), and Supplementary Parts (Appendix, Bibliography, Glossary, Index).',
      examTip: 'Often tested as both listing questions and fill-in-the-blank report parts!'
    },
    {
      id: 'eng201-sub-3',
      num: 3,
      question:
        'What is a Comma Splice, and what are three standard grammatical ways to correct it?',
      marks: 3,
      term: 'midterm',
      topic: 'Grammar & Punctuation',
      quickHook: 'Comma Splice = joining 2 independent clauses with only a comma; fix with Period (.), Semicolon (;), or Comma + FANBOYS.',
      keyPoints: [
        'Definition: A comma splice wrongly joins two complete independent clauses using only a comma (e.g., "She opened the window, I looked out.").',
        'Fix 1 (Period): Separate into two sentences ("She opened the window. I looked out.").',
        'Fix 2 (Semicolon): Join closely related independent clauses with a semicolon (";").',
        'Fix 3 (Coordinating Conjunction / Subordination): Add a FANBOYS conjunction (", so I looked out") or subordinate one clause ("When she opened the window, I looked out.").'
      ],
      modelAnswer:
        'A comma splice occurs when two independent clauses are joined solely by a comma without a coordinating conjunction. It can be corrected in three primary ways: 1) Replace the comma with a period to create two distinct sentences, 2) Replace the comma with a semicolon (;), or 3) Keep the comma and insert a coordinating conjunction (for, and, nor, but, or, yet, so) or subordinate one of the clauses.'
    },
    {
      id: 'eng201-sub-4',
      num: 4,
      question:
        'Differentiate between an Action Verb and a Linking Verb with clear examples.',
      marks: 2,
      term: 'midterm',
      topic: 'Grammar & Punctuation',
      quickHook: 'Action verb = shows physical/mental doing (runs, writes); Linking verb = equals sign connecting subject to state (is, seems, became).',
      keyPoints: [
        'Action Verb expresses physical or mental activity performed by the subject (e.g., "The engineer tested the server.").',
        'Linking Verb connects the subject to a predicate noun or adjective describing its state or identity without action (e.g., is, am, are, seem, appear, become).',
        'Quick test: If you can replace the verb with "=" or "is" and the sentence keeps meaning, it is a linking verb.'
      ],
      modelAnswer:
        'An Action Verb expresses what the subject physically or mentally does (e.g., "writes," "analyzes," "builds"). A Linking Verb does not express action; instead, it joins the subject to a subject complement (noun or adjective) that renames or describes it—such as forms of "to be" (is, was, were) or sensory/state verbs ("The report seems accurate," "She became manager").'
    },
    {
      id: 'eng201-sub-5',
      num: 5,
      question:
        'State the four steps of the AIDA plan for Persuasive Messages and explain what Biased (Sexist/Exclusive) Language is.',
      marks: 5,
      term: 'midterm',
      topic: 'Oral & Persuasive Comm',
      quickHook: 'AIDA = Attention, Interest, Desire, Action; Biased language stereotypes gender/age/disability — replace with neutral plurals.',
      keyPoints: [
        'AIDA stands for: 1) Attention (hook the reader), 2) Interest (explain relevance & benefits), 3) Desire (reduce resistance with proof), 4) Action (clear specific request).',
        'Biased Language refers to words or phrases that unfairly exclude or stereotype individuals based on gender, race, age, or disability.',
        'Non-sexist fixes: replace "manpower" -> "workforce", "chairman" -> "chairperson", "he" -> plural "they/employees".'
      ],
      modelAnswer:
        'Persuasive business messages follow the indirect AIDA model: Attention (opening with an engaging benefit or problem), Interest (building rationale and features), Desire (providing evidence and addressing objections), and Action (stating an easy, concrete next step). Separately, Biased Language reflects unwarranted assumptions about gender, age, ethnicity, or disability (such as using "man-hours" or assuming all executives are male); professional technical writing eliminates bias using neutral nouns and plural phrasing.'
    },
    {
      id: 'eng201-sub-6',
      num: 6,
      question:
        'Give three practical uses of a Pictograph and explain how visual aids should be chosen for reports.',
      marks: 3,
      term: 'midterm',
      topic: 'Visual Aids',
      quickHook: 'Pictograph = bars built from topic icons; Pie = % parts of whole; Line = trend over time; Bar = comparing discrete quantities.',
      keyPoints: [
        'Pictographs use small representative icons/symbols instead of plain bars to visualize data immediately for general audiences.',
        'Three uses: 1) Comparing unit quantities visually (e.g., vehicles sold, population symbols), 2) Engaging non-technical readers in reports/presentations, 3) Simplifying proportional differences using fractional icons.',
        'Chart choice rule: Line graph = trends over time; Pie chart = shares totaling 100%; Bar chart = comparing distinct categories.'
      ],
      modelAnswer:
        'A pictograph is a specialized bar chart that represents numerical quantities with repeated pictorial symbols rather than solid rectangles. Three common uses include comparing statistical magnitudes for non-technical audiences, illustrating demographic or production counts (such as houses built or staff hired), and reinforcing topic memory visually. For clear reporting, align chart type to message: line graphs track trends over time, pie charts show proportions of a whole, and bar graphs compare discrete categories.'
    }
  ]
};
