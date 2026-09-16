import { jsPDF } from 'jspdf';

/**
 * Generates and downloads a Student Performance Report in PDF format.
 * 
 * @param {Object} params
 * @param {string} params.studentName - The name of the student.
 * @param {Object} params.inputs - Academic input values.
 * @param {Object} params.prediction - Prediction result data.
 * @param {Object} [params.whatIf] - Optional what-if analysis comparison result.
 */
export const generatePDFReport = ({ studentName, inputs, prediction, whatIf }) => {
  const doc = new jsPDF();
  
  // Set monospaced font for clean report alignment matching template specs
  doc.setFont("courier", "normal");
  doc.setFontSize(10);
  
  let y = 20;
  const lineSpacing = 6;
  const borderLine = "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
  
  // Header
  doc.text(borderLine, 20, y); y += lineSpacing;
  doc.text("     STUDENT PERFORMANCE REPORT", 20, y); y += lineSpacing;
  doc.text(borderLine, 20, y); y += lineSpacing * 2;
  
  // Details
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).replace(/ /g, '-'); // e.g. 14-Aug-2026
  
  doc.text(`Student: ${studentName}`, 20, y); y += lineSpacing;
  doc.text(`Date: ${currentDate}`, 20, y); y += lineSpacing * 2;
  
  // Academic Inputs Section
  doc.setFont("courier", "bold");
  doc.text("ACADEMIC INPUTS", 20, y); y += lineSpacing;
  doc.setFont("courier", "normal");
  
  const drawRow = (label, val) => {
    const paddedLabel = label.padEnd(20, ' ');
    doc.text(`${paddedLabel}${val}`, 20, y);
    y += lineSpacing;
  };
  
  drawRow("Attendance", `${inputs.attendance_pct}%`);
  drawRow("Study Hours", `${inputs.study_hours_week} hrs/week`);
  drawRow("Previous Marks", `${inputs.prev_sem_cgpa} CGPA`);
  drawRow("Assignment Marks", `${inputs.assignment_score}%`);
  drawRow("Internal Marks", `${inputs.internal_marks}%`);
  if (inputs.activity_score) {
    drawRow("Activity Score", `${inputs.activity_score}%`);
  }
  y += lineSpacing;
  
  // Prediction Section
  doc.setFont("courier", "bold");
  doc.text("PREDICTION", 20, y); y += lineSpacing;
  doc.setFont("courier", "normal");
  
  drawRow("Predicted Marks", `${Math.round(prediction.predicted_final_marks || prediction.predicted_final_marks === 0 ? prediction.predicted_final_marks : 0)}`);
  drawRow("Risk Level", (prediction.risk_level || 'Moderate').toUpperCase());
  y += lineSpacing;
  
  // Key Factors Section
  doc.setFont("courier", "bold");
  doc.text("KEY FACTORS", 20, y); y += lineSpacing;
  doc.setFont("courier", "normal");
  
  const factors = [];
  if (parseFloat(inputs.attendance_pct) < 75) {
    factors.push("Attendance is below 75% threshold (critical deficit)");
  } else if (parseFloat(inputs.attendance_pct) < 90) {
    factors.push("Attendance needs improvement to reach optimal level");
  }
  
  if (parseFloat(inputs.study_hours_week) < 10) {
    factors.push("Weekly study hours are low and require extension");
  }
  
  if (prediction.contributions && prediction.contributions.length > 0) {
    const mainFeature = prediction.contributions[0];
    const nameMap = {
      attendance_pct: 'Attendance level',
      study_hours_week: 'Weekly study duration',
      assignment_score: 'Assignment grades',
      internal_marks: 'Internal assessment performance',
      prev_sem_cgpa: 'Previous semester CGPA foundation',
      activity_score: 'Classroom engagement score'
    };
    const featName = nameMap[mainFeature.feature] || mainFeature.feature;
    factors.push(`${featName} has strong influence on final marks`);
  }
  
  if (factors.length === 0) {
    factors.push("All monitored performance factors are satisfactory.");
  }
  
  factors.forEach(factor => {
    doc.text(`* ${factor}`, 20, y);
    y += lineSpacing;
  });
  y += lineSpacing;
  
  // Recommendations Section
  doc.setFont("courier", "bold");
  doc.text("RECOMMENDATIONS", 20, y); y += lineSpacing;
  doc.setFont("courier", "normal");
  
  // Try using detailed recommendations list if present, else fall back to flat list
  let recsList = [];
  if (prediction.detailed_recommendations && prediction.detailed_recommendations.actionable_steps) {
    recsList = prediction.detailed_recommendations.actionable_steps.map(
      step => `${step.title}: ${step.action}`
    );
  } else {
    recsList = prediction.recommendations || [];
  }

  if (recsList.length > 0) {
    recsList.slice(0, 3).forEach(rec => {
      const splitRec = doc.splitTextToSize(`* ${rec}`, 170);
      splitRec.forEach(line => {
        doc.text(line, 20, y);
        y += lineSpacing;
      });
    });
  } else {
    doc.text("* Keep up the excellent academic performance.", 20, y);
    y += lineSpacing;
  }
  y += lineSpacing;
  
  // What-If Analysis Section
  if (whatIf) {
    doc.setFont("courier", "bold");
    doc.text("WHAT-IF ANALYSIS", 20, y); y += lineSpacing;
    doc.setFont("courier", "normal");
    
    drawRow("Current Prediction", `${Math.round(whatIf.current_prediction)}`);
    drawRow("What-If Prediction", `${Math.round(whatIf.what_if_prediction)}`);
    const improvement = whatIf.predicted_change;
    drawRow("Potential Improvement", `${improvement >= 0 ? '+' : ''}${Math.round(improvement)} marks`);
    y += lineSpacing;
  }
  
  // Footer
  doc.text(borderLine, 20, y); y += lineSpacing;
  doc.text("Generated by Student Performance", 20, y); y += lineSpacing;
  doc.text("Prediction System", 20, y); y += lineSpacing;
  doc.text(borderLine, 20, y);
  
  doc.save(`${studentName.replace(/[^a-z0-9]/gi, '_')}_Performance_Report.pdf`);
};
