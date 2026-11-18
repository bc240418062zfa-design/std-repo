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
import { motion, AnimatePresence } from 'motion/react';
import {
  ScrollReveal,
  StaggerGrid,
  StaggerItem,
  SpotlightCard,
  EASE_OUT_EXPO
} from '../components/MotionPrimitives';
import { CelestialOrbitalRings, CelestialStarfield } from '../components/CelestialBackdrop';

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
      <ScrollReveal className="relative overflow-hidden rounded-3xl bg-studio-stage text-white p-6 sm:p-10 border border-slate-800/90 shadow-[0_26px_64px_-16px_rgba(4,8,20,0.68)]">
        <CelestialStarfield density={0.62} />
        <CelestialOrbitalRings compact />
        <div className="absolute inset-0 bg-academic-grid opacity-35 pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none animate-float-slow" />
        <div className="pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-400/65 to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" aria-hidden="true" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-indigo-300 text-xs font-mono font-semibold uppercase tracking-wider">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>6-CREDIT CAPSTONE PROJECT · COMPUTER SCIENCE &amp; IT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            CS619 Final Year Project (FYP) Complete Roadmap &amp; Viva Voce Hub
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Master the 5 deliverable phases, IEEE 830 SRS documentation standards, ERD database design, supervisor review cycles, and top oral defense questions for Virtual University of Pakistan.
          </p>
        </div>
      </ScrollReveal>

      {/* Tab Switcher */}
      <div className="surface-frosted p-1.5 rounded-2xl border border-slate-200/80 inline-flex max-w-full overflow-x-auto scrollbar-none gap-1.5">
        {(
          [
            { id: 'milestones', label: '5 Deliverable Phases', Icon: Layers },
            { id: 'viva', label: 'Top 25 Viva Voce Defense Questions', Icon: Video },
            { id: 'srs', label: 'SRS & Design Architecture Standards', Icon: FileCode2 }
          ] as const
        ).map(({ id, label, Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`relative py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                active ? 'text-white' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="cs619-tab-pill"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl shadow-xs"
                />
              )}
              <Icon className="relative z-10 w-4 h-4" />
              <span className="relative z-10">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'milestones' && (
          <motion.div
            key="milestones"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: EASE_OUT_EXPO }}
            className="space-y-6"
          >
            <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MILESTONES.map((m) => (
                <StaggerItem key={m.num}>
                  <SpotlightCard spotlightColor="rgba(79, 70, 229, 0.12)" className="group h-full card-celestial celestial-top-glint rounded-2xl border p-6 hover:border-indigo-300">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-indigo-600 font-mono transition-transform duration-300 group-hover:scale-110 inline-block">{m.num}</span>
                        <span className="text-[11px] font-semibold text-slate-500 font-mono">
                          {m.timeline}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{m.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
                    </div>
                    <div className="pt-3 mt-4 border-t border-slate-200/70 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Evaluation:</span>
                      <strong className="text-slate-800">{m.weight}</strong>
                    </div>
                  </SpotlightCard>
                </StaggerItem>
              ))}
            </StaggerGrid>

            {/* Supervisor Warning Callout */}
            <div className="celestial-bezel rounded-2xl shadow-sm">
              <div className="card-celestial celestial-top-glint bg-gradient-to-br from-amber-50/95 via-white/95 to-orange-50/75 rounded-[15px] p-6 flex items-start gap-4">
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
          </motion.div>
        )}

        {activeTab === 'viva' && (
          <motion.div
            key="viva"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: EASE_OUT_EXPO }}
            className="card-celestial celestial-top-glint rounded-3xl border p-6 sm:p-10 space-y-6"
          >
            <div>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Video className="w-6 h-6 text-indigo-600" />
                Frequently Asked Viva Voce Oral Defense Questions
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Examiners evaluate your core concepts and hands-on code familiarity rather than memorized slide text.
              </p>
            </div>

            <StaggerGrid className="space-y-4">
              {VIVA_QUESTIONS.map((item, idx) => (
                <StaggerItem key={idx} className="card-celestial celestial-top-glint p-5 rounded-2xl border hover:border-indigo-300 transition-colors space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-start gap-2">
                    <span className="text-indigo-600 font-mono shrink-0">Q{idx + 1}.</span>
                    <span>{item.q}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                    {item.a}
                  </p>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </motion.div>
        )}

        {activeTab === 'srs' && (
          <motion.div
            key="srs"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: EASE_OUT_EXPO }}
            className="card-celestial celestial-top-glint rounded-3xl border p-6 sm:p-10 space-y-6"
          >
            <div>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <FileCode2 className="w-6 h-6 text-indigo-600" />
                IEEE 830 SRS Document Structure
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Standard sections required by Virtual University CS619 project supervisors:
              </p>
            </div>

            <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-600">
              <StaggerItem>
                <SpotlightCard spotlightColor="rgba(79, 70, 229, 0.1)" className="card-celestial celestial-top-glint h-full p-5 rounded-2xl border space-y-3">
                  <h3 className="font-bold text-slate-900 text-base">Section 1: Overall Scope &amp; Purpose</h3>
                  <ul className="space-y-1.5 list-disc pl-4">
                    <li>Project Purpose &amp; Problem Statement</li>
                    <li>Intended Audience and Document Conventions</li>
                    <li>Hardware, Software, and Network Architecture Scope</li>
                  </ul>
                </SpotlightCard>
              </StaggerItem>

              <StaggerItem>
                <SpotlightCard spotlightColor="rgba(79, 70, 229, 0.1)" className="card-celestial celestial-top-glint h-full p-5 rounded-2xl border space-y-3">
                  <h3 className="font-bold text-slate-900 text-base">Section 2: Functional Requirements</h3>
                  <ul className="space-y-1.5 list-disc pl-4">
                    <li>Use Case Diagram with Actor Identifiers</li>
                    <li>Detailed Use Case Specifications (Pre-conditions, Main Flow, Post-conditions)</li>
                    <li>Role-Based Access Control (Admin, User, Manager)</li>
                  </ul>
                </SpotlightCard>
              </StaggerItem>

              <StaggerItem>
                <SpotlightCard spotlightColor="rgba(79, 70, 229, 0.1)" className="card-celestial celestial-top-glint h-full p-5 rounded-2xl border space-y-3">
                  <h3 className="font-bold text-slate-900 text-base">Section 3: Database &amp; Data Models</h3>
                  <ul className="space-y-1.5 list-disc pl-4">
                    <li>Entity Relationship Diagram (ERD) with Cardinalities</li>
                    <li>Data Dictionary with Data Types and Constraints</li>
                    <li>Primary Keys and Foreign Key Relationships</li>
                  </ul>
                </SpotlightCard>
              </StaggerItem>

              <StaggerItem>
                <SpotlightCard spotlightColor="rgba(79, 70, 229, 0.1)" className="card-celestial celestial-top-glint h-full p-5 rounded-2xl border space-y-3">
                  <h3 className="font-bold text-slate-900 text-base">Section 4: Non-Functional Requirements</h3>
                  <ul className="space-y-1.5 list-disc pl-4">
                    <li>System Security &amp; Data Encryption standards</li>
                    <li>Response Time &amp; Concurrent User Scalability</li>
                    <li>Cross-Browser and Responsive Screen Compatibility</li>
                  </ul>
                </SpotlightCard>
              </StaggerItem>
            </StaggerGrid>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
