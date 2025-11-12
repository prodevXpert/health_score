import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Generate PDF report for health score
 * @param {Object} healthData - Health data object
 * @param {Object} scoreBreakdown - Score breakdown object
 * @param {Object} user - User object
 */
export const generateHealthScorePDF = (healthData, scoreBreakdown, user) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 20;

  // Header with gradient effect (simulated with rectangles)
  doc.setFillColor(0, 112, 192);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Health Score Report', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Comprehensive Health Assessment', pageWidth / 2, 30, { align: 'center' });

  yPos = 50;

  // Patient Information Section
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Patient Information', 14, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const patientInfo = [
    ['Patient Name:', user?.fullName || 'N/A'],
    ['Age / Gender:', `${user?.age || 'N/A'} / ${user?.gender || 'N/A'}`],
    ['Report Date:', new Date(healthData.testDate).toLocaleDateString()],
    ['Test Date:', new Date(healthData.testDate).toLocaleDateString()]
  ];

  doc.autoTable({
    startY: yPos,
    head: [],
    body: patientInfo,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' }
    }
  });

  yPos = doc.lastAutoTable.finalY + 15;

  // Overall Score Section
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(14, yPos, pageWidth - 28, 30, 3, 3, 'F');
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const scoreColor = getScoreColor(healthData.totalScore);
  doc.setTextColor(scoreColor.r, scoreColor.g, scoreColor.b);
  doc.text(`Overall Health Score: ${healthData.totalScore.toFixed(1)}/100`, pageWidth / 2, yPos + 12, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(getInterpretation(healthData.totalScore), pageWidth / 2, yPos + 22, { align: 'center' });

  yPos += 40;

  // Category Scores
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Category Breakdown', 14, yPos);
  yPos += 5;

  const categoryData = [
    ['Clinical & Vitals', `${healthData.clinicalScore.toFixed(1)}/30`, getPercentage(healthData.clinicalScore, 30)],
    ['Laboratory & Biomarkers', `${healthData.laboratoryScore.toFixed(1)}/50`, getPercentage(healthData.laboratoryScore, 50)],
    ['Lifestyle & Preventive', `${healthData.lifestyleScore.toFixed(1)}/20`, getPercentage(healthData.lifestyleScore, 20)]
  ];

  doc.autoTable({
    startY: yPos,
    head: [['Category', 'Score', 'Percentage']],
    body: categoryData,
    theme: 'striped',
    headStyles: { fillColor: [0, 112, 192], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 5 },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 40, halign: 'center' },
      2: { cellWidth: 40, halign: 'center' }
    }
  });

  yPos = doc.lastAutoTable.finalY + 15;

  // Check if we need a new page
  if (yPos > pageHeight - 60) {
    doc.addPage();
    yPos = 20;
  }

  // Subcategory Details - Clinical
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Clinical & Vitals Details', 14, yPos);
  yPos += 5;

  const clinicalData = [
    ['Anthropometry', `${scoreBreakdown?.subcategories?.anthropometry?.toFixed(1) || '0.0'}/10`],
    ['Blood Pressure', `${scoreBreakdown?.subcategories?.bloodPressure?.toFixed(1) || '0.0'}/10`],
    ['Heart & Cardio', `${scoreBreakdown?.subcategories?.heartCardio?.toFixed(1) || '0.0'}/10`]
  ];

  doc.autoTable({
    startY: yPos,
    head: [['Subcategory', 'Score']],
    body: clinicalData,
    theme: 'grid',
    headStyles: { fillColor: [76, 175, 80], textColor: 255 },
    styles: { fontSize: 9, cellPadding: 3 }
  });

  yPos = doc.lastAutoTable.finalY + 10;

  // Check if we need a new page
  if (yPos > pageHeight - 80) {
    doc.addPage();
    yPos = 20;
  }

  // Subcategory Details - Laboratory
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Laboratory & Biomarkers Details', 14, yPos);
  yPos += 5;

  const labData = [
    ['Glycemic Control', `${scoreBreakdown?.subcategories?.glycemic?.toFixed(1) || '0.0'}/8`],
    ['Lipid Profile', `${scoreBreakdown?.subcategories?.lipid?.toFixed(1) || '0.0'}/8`],
    ['Renal Function', `${scoreBreakdown?.subcategories?.renal?.toFixed(1) || '0.0'}/6`],
    ['Liver Function', `${scoreBreakdown?.subcategories?.liver?.toFixed(1) || '0.0'}/4`],
    ['Hematology', `${scoreBreakdown?.subcategories?.hematology?.toFixed(1) || '0.0'}/4`],
    ['Thyroid Function', `${scoreBreakdown?.subcategories?.thyroid?.toFixed(1) || '0.0'}/3`],
    ['Inflammation', `${scoreBreakdown?.subcategories?.inflammation?.toFixed(1) || '0.0'}/3`]
  ];

  doc.autoTable({
    startY: yPos,
    head: [['Subcategory', 'Score']],
    body: labData,
    theme: 'grid',
    headStyles: { fillColor: [33, 150, 243], textColor: 255 },
    styles: { fontSize: 9, cellPadding: 3 }
  });

  yPos = doc.lastAutoTable.finalY + 10;

  // Check if we need a new page
  if (yPos > pageHeight - 60) {
    doc.addPage();
    yPos = 20;
  }

  // Subcategory Details - Lifestyle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Lifestyle & Preventive Details', 14, yPos);
  yPos += 5;

  const lifestyleData = [
    ['Physical Activity', `${scoreBreakdown?.subcategories?.physicalActivity?.toFixed(1) || '0.0'}/8`],
    ['Nutrition', `${scoreBreakdown?.subcategories?.nutrition?.toFixed(1) || '0.0'}/6`],
    ['Substance Use', `${scoreBreakdown?.subcategories?.substanceUse?.toFixed(1) || '0.0'}/6`]
  ];

  doc.autoTable({
    startY: yPos,
    head: [['Subcategory', 'Score']],
    body: lifestyleData,
    theme: 'grid',
    headStyles: { fillColor: [255, 152, 0], textColor: 255 },
    styles: { fontSize: 9, cellPadding: 3 }
  });

  yPos = doc.lastAutoTable.finalY + 15;

  // Footer
  const footerY = pageHeight - 15;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Generated on ${new Date().toLocaleString()}`, 14, footerY);
  doc.text(`Page 1 of ${doc.internal.getNumberOfPages()}`, pageWidth - 14, footerY, { align: 'right' });

  // Save the PDF
  const fileName = `Health_Score_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

/**
 * Get color based on score
 */
const getScoreColor = (score) => {
  if (score >= 85) return { r: 76, g: 175, b: 80 }; // Green - Excellent
  if (score >= 70) return { r: 33, g: 150, b: 243 }; // Blue - Good
  if (score >= 50) return { r: 255, g: 152, b: 0 }; // Orange - Fair
  return { r: 244, g: 67, b: 54 }; // Red - Needs Attention
};

/**
 * Get interpretation text based on score
 */
const getInterpretation = (score) => {
  if (score >= 85) return 'Excellent - Keep up the great work!';
  if (score >= 70) return 'Good - You\'re doing well!';
  if (score >= 50) return 'Fair - Room for improvement';
  return 'Needs Attention - Consult your healthcare provider';
};

/**
 * Calculate percentage
 */
const getPercentage = (score, maxScore) => {
  return `${((score / maxScore) * 100).toFixed(1)}%`;
};
