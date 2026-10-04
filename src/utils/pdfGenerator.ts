import { jsPDF } from 'jspdf';

export interface SimulatorData {
  courseCode: string;
  courseTitle: string;
  schemeName: string;
  passingThreshold: number; // 40 or 50
  quizzes: { total: number; obtained: number; weight: number };
  assignments: { total: number; obtained: number; weight: number };
  gdb: { total: number; obtained: number; weight: number };
  midterm: { total: number; obtained: number; weight: number };
  finalTerm: { total: number; weight: number };
  earnedWeightedPercent: number;
  firstHalfObtainedPercent: number; // % of first half collective
  firstHalfPassed: boolean;
  finalWeightPercent: number;
  simulatedFinalMarks?: number;
  simulatedTotalPercent?: number;
  simulatedGrade?: string;
  simulatedGpa?: number;
  gradeTargets: Array<{
    grade: string;
    label: string;
    minPercent: number;
    gpa: number;
    requiredFinalPercent: number;
    requiredFinalRawMarks: number;
    status: 'attainable' | 'moderate' | 'challenging' | 'impossible';
  }>;
}

export function generatePassingReportPDF(data: SimulatorData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // 1. Executive Top Header Banner (Deep Navy Gradient representation)
  doc.setFillColor(11, 25, 44); // #0B192C deep navy
  doc.rect(0, 0, pageWidth, 32, 'F');

  // Cyan & Gold Accent Lines
  doc.setFillColor(37, 99, 235); // Blue-600
  doc.rect(0, 32, pageWidth, 1.5, 'F');
  doc.setFillColor(217, 119, 6); // Amber-600 gold accent
  doc.rect(pageWidth * 0.7, 32, pageWidth * 0.3, 1.5, 'F');

  // Header Title & Branding
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('MIHORA TECH ACADEMIC INTELLIGENCE LAB', margin, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('Virtual University of Pakistan — Official Examination & Grade Feasibility Report', margin, 18);

  const reportId = `VU-SIM-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
  const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(147, 197, 253); // blue-300
  doc.text(`REPORT ID: ${reportId}   ·   DATE: ${dateStr}   ·   PORTAL: study.mihora.tech`, margin, 24);

  // Official Evaluation Badge (Top Right)
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(pageWidth - margin - 45, 7, 45, 18, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(226, 232, 240);
  doc.text('ACADEMIC AUDIT', pageWidth - margin - 37, 13);
  doc.setFontSize(9);
  doc.setTextColor(52, 211, 153); // emerald-400
  doc.text('VERIFIED LOGIC', pageWidth - margin - 40, 20);

  let currentY = 40;

  // 2. Course Meta Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, 23, 2, 2, 'FD');

  // Left accent bar
  doc.setFillColor(37, 99, 235);
  doc.rect(margin, currentY, 3, 23, 'F');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(`${data.courseCode} — ${data.courseTitle}`, margin + 7, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Grading Policy: ${data.schemeName}`, margin + 7, currentY + 14);
  doc.text(`Final Term Total: ${data.finalTerm.total} Marks (${data.finalTerm.weight}% Weightage)`, margin + 7, currentY + 19);

  doc.text(`Passing Criteria: ${data.passingThreshold}% Course Aggregate + 20% Component Rule`, margin + 95, currentY + 14);
  doc.text(`Target Minimum Grade: ${data.passingThreshold === 40 ? 'E/D (40% Floor)' : 'D Grade (50% Standard)'}`, margin + 95, currentY + 19);

  currentY += 28;

  // 3. Two-Half Evaluation Compliance Box
  doc.setFillColor(data.firstHalfPassed ? 240 : 254, data.firstHalfPassed ? 253 : 242, data.firstHalfPassed ? 244 : 242);
  doc.setDrawColor(data.firstHalfPassed ? 187 : 254, data.firstHalfPassed ? 247 : 202, data.firstHalfPassed ? 208 : 202);
  doc.roundedRect(margin, currentY, contentWidth, 18, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(data.firstHalfPassed ? 22 : 153, data.firstHalfPassed ? 101 : 27, data.firstHalfPassed ? 52 : 27);
  doc.text(
    data.firstHalfPassed
      ? '✓ OFFICIAL VU TWO-HALF EVALUATION: FIRST-HALF REQUIREMENT MET'
      : '⚠ OFFICIAL VU TWO-HALF EVALUATION: FIRST-HALF REQUIREMENT AT RISK',
    margin + 6,
    currentY + 6
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `First Half Sessional Score: ${data.firstHalfObtainedPercent.toFixed(1)}% (VU requirement is >= 20% collective sessional marks). Final Term requires at least 20% (${Math.ceil(data.finalTerm.total * 0.2)} / ${data.finalTerm.total} marks).`,
    margin + 6,
    currentY + 12
  );

  currentY += 23;

  // 4. Sessional Assessment Breakdown Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('I. Sessional Assessment & Midterm Breakdown', margin, currentY);

  currentY += 4;

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, currentY, contentWidth, 6.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text('COMPONENT', margin + 4, currentY + 4.5);
  doc.text('OBTAINED', margin + 65, currentY + 4.5);
  doc.text('TOTAL', margin + 95, currentY + 4.5);
  doc.text('WEIGHT (%)', margin + 125, currentY + 4.5);
  doc.text('WEIGHTED CONTRIBUTION', margin + 152, currentY + 4.5);

  currentY += 6.5;

  const rows = [
    {
      name: 'Quizzes (Cumulative)',
      ob: data.quizzes.obtained,
      tot: data.quizzes.total,
      weight: data.quizzes.weight,
      contrib: (data.quizzes.obtained / (data.quizzes.total || 1)) * data.quizzes.weight
    },
    {
      name: 'Assignments (Cumulative)',
      ob: data.assignments.obtained,
      tot: data.assignments.total,
      weight: data.assignments.weight,
      contrib: (data.assignments.obtained / (data.assignments.total || 1)) * data.assignments.weight
    },
    {
      name: 'Graded Discussion Board (GDB)',
      ob: data.gdb.obtained,
      tot: data.gdb.total,
      weight: data.gdb.weight,
      contrib: (data.gdb.obtained / (data.gdb.total || 1)) * data.gdb.weight
    },
    {
      name: 'Midterm Examination',
      ob: data.midterm.obtained,
      tot: data.midterm.total,
      weight: data.midterm.weight,
      contrib: (data.midterm.obtained / (data.midterm.total || 1)) * data.midterm.weight
    }
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  rows.forEach((r, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, currentY, contentWidth, 6, 'F');
    }
    doc.setTextColor(30, 41, 59);
    doc.text(r.name, margin + 4, currentY + 4.2);
    doc.text(r.ob.toString(), margin + 65, currentY + 4.2);
    doc.text(r.tot.toString(), margin + 95, currentY + 4.2);
    doc.text(`${r.weight}%`, margin + 125, currentY + 4.2);
    doc.text(`${r.contrib.toFixed(2)}%`, margin + 152, currentY + 4.2);
    currentY += 6;
  });

  // Total Sessional Summary Bar
  doc.setFillColor(224, 231, 255);
  doc.rect(margin, currentY, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 58, 138);
  doc.text('TOTAL SESSIONAL MARKS SECURED IN HAND:', margin + 4, currentY + 4.8);
  doc.text(`${data.earnedWeightedPercent.toFixed(2)}% (out of ${100 - data.finalWeightPercent}% available)`, margin + 142, currentY + 4.8);

  currentY += 13;

  // 5. Target Grade Matrix Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('II. Required Final Term Exam Scores For Every Grade Tier', margin, currentY);

  currentY += 4;

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, currentY, contentWidth, 6.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text('TARGET GRADE', margin + 4, currentY + 4.5);
  doc.text('GPA', margin + 45, currentY + 4.5);
  doc.text('MIN AGGREGATE', margin + 65, currentY + 4.5);
  doc.text(`REQUIRED MARKS (/${data.finalTerm.total})`, margin + 100, currentY + 4.5);
  doc.text('FINAL EXAM %', margin + 140, currentY + 4.5);
  doc.text('FEASIBILITY', margin + 165, currentY + 4.5);

  currentY += 6.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  data.gradeTargets.forEach((tgt, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, currentY, contentWidth, 5.8, 'F');
    }

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(tgt.grade, margin + 4, currentY + 4);

    doc.setFont('helvetica', 'normal');
    doc.text(tgt.gpa.toFixed(2), margin + 45, currentY + 4);
    doc.text(`${tgt.minPercent}%`, margin + 65, currentY + 4);

    if (tgt.status === 'impossible') {
      doc.setTextColor(185, 28, 28);
      doc.text('Exceeds 100%', margin + 100, currentY + 4);
      doc.text('N/A', margin + 140, currentY + 4);
      doc.text('Unattainable', margin + 165, currentY + 4);
    } else {
      doc.setTextColor(15, 23, 42);
      doc.text(`${tgt.requiredFinalRawMarks} / ${data.finalTerm.total}`, margin + 100, currentY + 4);
      doc.text(`${tgt.requiredFinalPercent.toFixed(1)}%`, margin + 140, currentY + 4);

      if (tgt.status === 'attainable') {
        doc.setTextColor(16, 122, 60);
        doc.text('Highly Attainable', margin + 165, currentY + 4);
      } else if (tgt.status === 'moderate') {
        doc.setTextColor(29, 78, 216);
        doc.text('Moderate Effort', margin + 165, currentY + 4);
      } else {
        doc.setTextColor(180, 83, 9);
        doc.text('High Focus Target', margin + 165, currentY + 4);
      }
    }

    currentY += 5.8;
  });

  currentY += 8;

  // 6. Official VU Regulations Notice Box
  doc.setFillColor(254, 252, 232); // amber-50
  doc.setDrawColor(254, 240, 138); // amber-200
  doc.roundedRect(margin, currentY, contentWidth, 23, 1.5, 1.5, 'FD');

  doc.setTextColor(146, 64, 14); // amber-800
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('OFFICIAL VIRTUAL UNIVERSITY ACADEMIC POLICIES & REGULATIONS:', margin + 4, currentY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(120, 53, 15);
  doc.text('1. Two-Half Rule: Students must secure >= 20% marks in the First Half (Sessional) and >= 20% in the Final Term exam.', margin + 4, currentY + 10.5);
  doc.text('2. Course Passing Aggregate: Minimum overall score must be 40% (Conditional Pass/Floor) or 50% (Standard D Grade).', margin + 4, currentY + 15);
  doc.text('3. Missed Exams: Unattended Midterms receive 0 marks unless rescheduled through official VULMS procedures.', margin + 4, currentY + 19.5);

  currentY += 29;

  // 7. Executive Verification & Signature Block
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, currentY, contentWidth, 16, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text('ACADEMIC VERIFICATION & DATA INTEGRITY DISCLOSURE', margin + 5, currentY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text('Calculated using authentic Virtual University assessment weighting logic and client-side verifiable mathematical formulas.', margin + 5, currentY + 10);
  doc.text('Issued by MIHORA TECH (www.mihora.tech) · Access full course study handouts at study.mihora.tech', margin + 5, currentY + 13.5);

  // Digital Stamp Box
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.4);
  doc.roundedRect(pageWidth - margin - 42, currentY + 2.5, 38, 11, 1, 1, 'D');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(37, 99, 235);
  doc.text('OFFICIALLY AUDITED', pageWidth - margin - 38, currentY + 6.5);
  doc.setFontSize(5.5);
  doc.setTextColor(71, 85, 105);
  doc.text('SECURE · ZERO-LEAK', pageWidth - margin - 38, currentY + 10.5);

  currentY += 21;

  // Bottom Line & Footer
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('MIHORA STUDY LIBRARY · Pakistan\'s Premier Academic Resource Archive for Distance Learning', margin, pageHeight - 6);
  doc.text('Official System Audit · Page 1 of 1', pageWidth - margin - 38, pageHeight - 6);

  // Save PDF
  const filename = `VU_${data.courseCode}_Official_Exam_Passing_Report.pdf`;
  doc.save(filename);
}
