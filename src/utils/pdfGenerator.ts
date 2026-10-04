import { jsPDF } from 'jspdf';

export interface SimulatorData {
  courseCode: string;
  courseTitle: string;
  schemeName: string;
  quizzes: { total: number; obtained: number; weight: number };
  assignments: { total: number; obtained: number; weight: number };
  gdb: { total: number; obtained: number; weight: number };
  midterm: { total: number; obtained: number; weight: number };
  finalTerm: { total: number; weight: number };
  earnedWeightedPercent: number;
  finalWeightPercent: number;
  gradeTargets: Array<{
    grade: string;
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
  let currentY = 16;

  // Header Bar Styling
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Title in header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('MIHORA TECH ACADEMIC INTELLIGENCE', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('Virtual University of Pakistan (VU) — Exam Passing Marks & Target Simulation Report', 14, 18);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · study.mihora.tech`, 14, 23);

  currentY = 36;

  // Course Information Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, currentY, pageWidth - 28, 22, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`${data.courseCode}: ${data.courseTitle}`, 18, currentY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Grading Scheme: ${data.schemeName}`, 18, currentY + 15);
  doc.text(`Final Term Total Marks: ${data.finalTerm.total} Marks (${data.finalTerm.weight}% Weightage)`, 120, currentY + 15);

  currentY += 28;

  // Sessional Assessment Breakdown
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Sessional & Midterm Assessment Breakdown', 14, currentY);

  currentY += 4;

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(14, currentY, pageWidth - 28, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text('Assessment Component', 18, currentY + 5);
  doc.text('Obtained Marks', 75, currentY + 5);
  doc.text('Total Marks', 105, currentY + 5);
  doc.text('Weightage (%)', 135, currentY + 5);
  doc.text('Weighted Contrib.', 165, currentY + 5);

  currentY += 7;

  // Rows
  const items = [
    {
      name: 'Quizzes (All)',
      ob: data.quizzes.obtained,
      tot: data.quizzes.total,
      weight: data.quizzes.weight,
      contrib: (data.quizzes.obtained / (data.quizzes.total || 1)) * data.quizzes.weight
    },
    {
      name: 'Assignments (All)',
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
  doc.setFontSize(8.5);

  items.forEach((item, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, currentY, pageWidth - 28, 6.5, 'F');
    }
    doc.setTextColor(30, 41, 59);
    doc.text(item.name, 18, currentY + 4.5);
    doc.text(item.ob.toString(), 75, currentY + 4.5);
    doc.text(item.tot.toString(), 105, currentY + 4.5);
    doc.text(`${item.weight}%`, 135, currentY + 4.5);
    doc.text(`${item.contrib.toFixed(2)}%`, 165, currentY + 4.5);
    currentY += 6.5;
  });

  // Summary Row
  doc.setFillColor(224, 231, 255);
  doc.rect(14, currentY, pageWidth - 28, 7.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.text('Total Sessional Weighted Marks Earned To Date:', 18, currentY + 5);
  doc.text(`${data.earnedWeightedPercent.toFixed(2)}% (out of ${(100 - data.finalWeightPercent)}%)`, 160, currentY + 5);

  currentY += 14;

  // Grade Target Matrix Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Required Final Term Exam Marks For Target Grades', 14, currentY);

  currentY += 4;

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(14, currentY, pageWidth - 28, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text('Target Grade', 18, currentY + 5);
  doc.text('Min Aggregate', 50, currentY + 5);
  doc.text('Grade Points', 80, currentY + 5);
  doc.text(`Required Marks (/${data.finalTerm.total})`, 112, currentY + 5);
  doc.text('Required Final %', 148, currentY + 5);
  doc.text('Status / Feasibility', 172, currentY + 5);

  currentY += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  data.gradeTargets.forEach((target, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, currentY, pageWidth - 28, 6.2, 'F');
    }

    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.text(target.grade, 18, currentY + 4.2);

    doc.setFont('helvetica', 'normal');
    doc.text(`${target.minPercent}%`, 50, currentY + 4.2);
    doc.text(target.gpa.toFixed(2), 80, currentY + 4.2);

    if (target.status === 'impossible') {
      doc.setTextColor(185, 28, 28);
      doc.text('Exceeds 100%', 112, currentY + 4.2);
      doc.text('N/A', 148, currentY + 4.2);
      doc.text('Unattainable', 172, currentY + 4.2);
    } else {
      doc.setTextColor(30, 41, 59);
      doc.text(`${target.requiredFinalRawMarks} / ${data.finalTerm.total}`, 112, currentY + 4.2);
      doc.text(`${target.requiredFinalPercent.toFixed(1)}%`, 148, currentY + 4.2);

      if (target.status === 'attainable') {
        doc.setTextColor(16, 122, 60);
        doc.text('Highly Attainable', 172, currentY + 4.2);
      } else if (target.status === 'moderate') {
        doc.setTextColor(29, 78, 216);
        doc.text('Moderate Effort', 172, currentY + 4.2);
      } else {
        doc.setTextColor(180, 83, 9);
        doc.text('Challenging Target', 172, currentY + 4.2);
      }
    }

    currentY += 6.2;
  });

  currentY += 8;

  // VU Official Regulations Notice Box
  doc.setFillColor(254, 252, 232); // amber-50
  doc.setDrawColor(254, 240, 138); // amber-200
  doc.roundedRect(14, currentY, pageWidth - 28, 24, 2, 2, 'FD');

  doc.setTextColor(146, 64, 14); // amber-800
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Official Virtual University (VU) Examination Policy Rules:', 18, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 53, 15);
  doc.text('1. 20% Component Rule: You must secure a minimum of 20% marks in Midterm and 20% in Final Term independently.', 18, currentY + 11);
  doc.text('2. 50% Aggregate Passing Rule: To pass with a minimum "D" grade, overall course aggregate must be 50% or above.', 18, currentY + 16);
  doc.text('3. Relative/Curved Grading: Some high-enrollment courses may apply standard normalization curves as per LMS announcements.', 18, currentY + 21);

  currentY += 28;

  // Footer
  doc.setDrawColor(226, 232, 240);
  doc.line(14, currentY, pageWidth - 14, currentY);

  currentY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('MIHORA STUDY LIBRARY (study.mihora.tech) · Independent Student Welfare Project by MIHORA TECH (www.mihora.tech)', 14, currentY);
  doc.text('Page 1 of 1', pageWidth - 28, currentY);

  // Save the PDF
  const filename = `VU_${data.courseCode}_Exam_Passing_Simulation_Report.pdf`;
  doc.save(filename);
}
