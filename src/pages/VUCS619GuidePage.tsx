import React, { useState } from 'react';
import { 
  FolderGit2, 
  Layers, 
  FileCode2, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  BookOpen, 
  MessageSquare, 
  Terminal, 
  ShieldCheck,
  Video,
  Award
} from 'lucide-react';

interface VUCS619GuidePageProps {
  onNavigateHome: () => void;
  onSelectCourse?: (code: string) => void;
}

export const VUCS619GuidePage: React.FC<VUCS619GuidePageProps> = ({ onNavigateHome, onSelectCourse }) => {
  const [activeTab, setActiveTab] = useState<'milestones' | 'viva' | 'srs'>('milestones');

  const MILESTONES = [
    {
      num: '01',
      title: 'Project Selection & Proposal Submission',
      timeline: 'Semester Start (Week 1–3)',
      desc: 'Choose from the official VU project list or submit an approved own-idea proposal. Write problem statement, scope, and technology stack.',
      weight: 'Pass / Fail'
    },
    {
      num: '02',
      title: 'SRS (Software Requirements Specification)',
      timeline: 'Month 2 (Week 5–8)',
      desc: 'Follow the IEEE 830 documentation template. Define Functional and Non-Functional requirements, Use Case diagrams, and detailed Use Case specifications.',
      weight: 'Crucial Milestone'
    },
    {
      num: '03',
      title: 'Design Document & Architecture',
      timeline: 'Month 3 (Week 9–12)',
      desc: 'Create Entity Relationship Diagrams (ERD), Class Diagrams, Sequence Diagrams, Database Schema with primary/foreign keys, and GUI wireframes.',
      weight: 'Crucial Milestone'
    },
    {
      num: '04',
      title: 'Test Phase 1 & Test Phase 2 Deliverables',
      timeline: 'Month 4–5 (Week 13–18)',
      desc: 'Submit working source code demonstrating core authentication, CRUD operations, and primary functional modules for supervisor verification.',
      weight: 'Code Verification'
    },
    {
      num: '05',
      title: 'Final Deliverable & External Viva Voce',
      timeline: 'Semester End (Week 20–24)',
      desc: 'Complete project code, deployment instructions, comprehensive final report, and formal oral defense via Skype / Google Meet with an external examiner.',
      weight: 'Final 6 Credits Evaluation'
    }
  ];

  const VIVA_QUESTIONS = [
    {
      q: 'Explain the 4 fundamental pillars of Object-Oriented Programming (OOP) in your project.',
      a: 'Encapsulation (bundling data and methods, private access modifiers), Abstraction (hiding implementation complexity using interfaces/abstract classes), Inheritance (reusing base class properties), and Polymorphism (method overriding and overloading for dynamic behavior).'
    },
    {
      q: 'How did you design your Database and ensure Normalization (1NF, 2NF, 3NF)?',
      a: '1NF eliminates repeating groups and ensures atomic values. 2NF ensures all non-key attributes are fully functionally dependent on the primary key. 3NF removes transitive dependencies (no non-key attribute depends on another non-key attribute).'
    },
    {
      q: 'How does your application prevent SQL Injection and Cross-Site Scripting (XSS)?',
      a: 'We use Prepared Statements and Parameterized Queries (PDO in PHP, Entity Framework in .NET, Prisma/ORM in Node.js) to treat user input as parameters rather than executable SQL, plus HTML escaping/sanitization to prevent XSS.'
    },
    {
      q: 'What is MVC architecture and how is data flow handled in your code?',
      a: 'Model manages database state and business logic; View handles the user interface; Controller receives HTTP requests from the View, communicates with the Model, and returns the response back to the View.'
    },
    {
      q: 'What is the difference between Primary Key, Foreign Key, and Composite Key?',
      a: 'Primary Key uniquely identifies a record in a table. Foreign Key establishes a relational constraint referencing the primary key of another table. Composite Key consists of two or more columns that together uniquely identify a record.'
    },
    {
      q: 'Can you modify this specific method/function right now in front of the camera?',
      a: 'Examiners routinely ask you to change a background color, add a validation rule, or print an extra column in real time during the screen share to verify that you wrote the code yourself.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <a href="/" onClick={(e) => { e.preventDefault(); onNavigateHome(); }} className="hover:text-blue-600 transition-colors">
          Home
        </a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-semibold">CS619 Final Year Project (FYP) Hub</span>
      </nav>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-10 border border-slate-800 shadow-xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-medium">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>6-CREDIT CAPSTONE PROJECT • COMPUTER SCIENCE &amp; IT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            CS619 Final Year Project (FYP) Complete Roadmap &amp; Viva Voce Hub
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Master the 5 deliverable phases, IEEE 830 SRS documentation standards, ERD database design, supervisor review cycles, and top oral defense questions for Virtual University of Pakistan.
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('milestones')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'milestones'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          5 Deliverable Phases
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('viva')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'viva'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Video className="w-4 h-4" />
          Top 25 Viva Voce Defense Questions
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('srs')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'srs'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileCode2 className="w-4 h-4" />
          SRS &amp; Design Architecture Standards
        </button>
      </div>

      {/* Tab Content: Milestones */}
      {activeTab === 'milestones' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MILESTONES.map((m) => (
              <div key={m.num} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 hover:border-indigo-300 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-indigo-600 font-mono">{m.num}</span>
                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-mono">
                    {m.timeline}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{m.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Evaluation:</span>
                  <strong className="text-slate-800">{m.weight}</strong>
                </div>
              </div>
            ))}
          </div>

          {/* Supervisor Warning Callout */}
          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
            <div className="space-y-1">
              <h4 className="text-base font-bold text-amber-950">
                Important Rule: Never Skip a Deliverable Deadline
              </h4>
              <p className="text-xs sm:text-sm text-amber-800/90 leading-relaxed">
                In CS619, deliverables are sequential. Failing or missing the SRS phase permanently bars you from submitting the Design Document or Test Phases. Always communicate proactively with your supervisor on the official VULMS CS619 portal if revisions are required.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Viva Voce Defense */}
      {activeTab === 'viva' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Video className="w-6 h-6 text-indigo-600" />
              Frequently Asked Viva Voce Oral Defense Questions
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Examiners evaluate your core concepts and hands-on code familiarity rather than memorized slide text.
            </p>
          </div>

          <div className="space-y-4">
            {VIVA_QUESTIONS.map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-start gap-2">
                  <span className="text-indigo-600 font-mono shrink-0">Q{idx + 1}.</span>
                  <span>{item.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: SRS Documentation Standards */}
      {activeTab === 'srs' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <FileCode2 className="w-6 h-6 text-indigo-600" />
              IEEE 830 SRS Document Structure
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Standard sections required by Virtual University CS619 project supervisors:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-600">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-base">Section 1: Overall Scope &amp; Purpose</h3>
              <ul className="space-y-1.5 list-disc pl-4">
                <li>Project Purpose &amp; Problem Statement</li>
                <li>Intended Audience and Document Conventions</li>
                <li>Hardware, Software, and Network Architecture Scope</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-base">Section 2: Functional Requirements</h3>
              <ul className="space-y-1.5 list-disc pl-4">
                <li>Use Case Diagram with Actor Identifiers</li>
                <li>Detailed Use Case Specifications (Pre-conditions, Main Flow, Post-conditions)</li>
                <li>Role-Based Access Control (Admin, User, Manager)</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-base">Section 3: Database &amp; Data Models</h3>
              <ul className="space-y-1.5 list-disc pl-4">
                <li>Entity Relationship Diagram (ERD) with Cardinalities</li>
                <li>Data Dictionary with Data Types and Constraints</li>
                <li>Primary Keys and Foreign Key Relationships</li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-base">Section 4: Non-Functional Requirements</h3>
              <ul className="space-y-1.5 list-disc pl-4">
                <li>System Security &amp; Data Encryption standards</li>
                <li>Response Time &amp; Concurrent User Scalability</li>
                <li>Cross-Browser and Responsive Screen Compatibility</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
