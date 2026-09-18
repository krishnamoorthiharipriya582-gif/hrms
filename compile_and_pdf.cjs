const fs = require('fs');
const path = require('path');
const puppeteer = require('./frontend/node_modules/puppeteer-core');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const assetsDir = path.resolve(__dirname, 'report-assets');
const genDir = path.resolve(__dirname, 'report_generator');
const outputHtml = path.resolve(__dirname, 'HRMS_Project_Report_HARIPRIYA_K.html');
const outputPdf = path.resolve(__dirname, 'HRMS_Project_Report_HARIPRIYA_K.pdf');

function getBase64Image(filename) {
  const filePath = path.join(assetsDir, filename);
  if (fs.existsSync(filePath)) {
    const ext = path.extname(filename).toLowerCase().replace('.', '');
    const mime = ext === 'svg' ? 'image/svg+xml' : (ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png');
    const b64 = fs.readFileSync(filePath).toString('base64');
    return `data:${mime};base64,${b64}`;
  }
  console.warn('Image not found:', filePath);
  return '';
}

console.log('Encoding asset images to Base64...');
const imgMap = {
  useCase: getBase64Image('Fig_4_1_UseCaseDiagram.svg'),
  sequence: getBase64Image('Fig_4_2_SequenceDiagram.svg'),
  dfd: getBase64Image('Fig_4_3_DataFlowDiagram.svg'),
  login: getBase64Image('A_2_1_LoginPage.png'),
  dashboard: getBase64Image('A_2_2_Dashboard.png'),
  onboarding: getBase64Image('A_2_3_Onboarding.png'),
  directory: getBase64Image('A_2_4_EmployeeDirectory.png'),
  attendance: getBase64Image('A_2_5_Attendance.png'),
  leave: getBase64Image('A_2_6_LeaveManagement.png'),
  approvals: getBase64Image('A_2_7_ManagerApprovals.png'),
  payroll: getBase64Image('A_2_8_PayrollProcessing.png'),
  compliance: getBase64Image('A_2_9_Compliance.png'),
  performance: getBase64Image('A_2_10_PerformanceAppraisals.png'),
  exit: getBase64Image('A_2_11_ExitClearanceFnF.png'),
  analytics: getBase64Image('A_2_12_HRAnalytics.png'),
  admin: getBase64Image('A_2_13_AdminStatutoryConfig.png'),
  payslips: getBase64Image('A_2_14_PayslipsESS.png'),
  tax12bb: getBase64Image('A_2_15_Tax12BBDeclaration.png')
};

// Diagram sections
const diagramsHtml = `
  <!-- ==================== DIAGRAMS PAGES ==================== -->
  <div class="page-container page-break">
    <h3 class="subheading" style="text-align: center;">4.2 USE CASE DIAGRAM</h3>
    <p>
      The Use Case Diagram illustrates the interactions between different human actors (Employee, Department Manager, HR Manager, Super Admin) and the functional modules of the HRMS platform.
    </p>
    <div class="figure-box">
      <img src="${imgMap.useCase}" alt="Use Case Diagram" style="max-height: 580px; width: 95%;">
      <div class="figure-caption">Fig. 4.1. Use Case Diagram for Multi-Role HRMS Enterprise System</div>
    </div>
  </div>

  <div class="page-container page-break">
    <h3 class="subheading" style="text-align: center;">4.3 SEQUENCE DIAGRAM</h3>
    <p>
      The Sequence Diagram depicts the chronological sequence of method calls, token verifications, and database interactions during user login and subsequent authenticated data hydration.
    </p>
    <div class="figure-box">
      <img src="${imgMap.sequence}" alt="Sequence Diagram" style="max-height: 580px; width: 95%;">
      <div class="figure-caption">Fig. 4.2. Sequence Diagram for User Authentication &amp; Record Hydration</div>
    </div>
  </div>

  <div class="page-container page-break">
    <h3 class="subheading" style="text-align: center;">4.4 DATA FLOW DIAGRAM (DFD LEVEL 1)</h3>
    <p>
      The Level 1 Data Flow Diagram traces the journey of data from external user inputs through authentication, business calculation engines, and relational storage in PostgreSQL.
    </p>
    <div class="figure-box">
      <img src="${imgMap.dfd}" alt="Data Flow Diagram" style="max-height: 580px; width: 95%;">
      <div class="figure-caption">Fig. 4.3. Level 1 Data Flow Diagram (DFD) of HRMS Operations</div>
    </div>
  </div>
`;

// Test Cases Visuals
const testCasesVisualsHtml = `
  <!-- ==================== TEST CASES ==================== -->
  <div class="page-container page-break">
    <h3 class="subheading">5.4 TEST CASES</h3>

    <h4 class="tertiary-heading">5.4.1 TEST CASE I: User Authentication &amp; Credential Validation</h4>
    <div class="figure-box">
      <img src="${imgMap.login}" alt="Test Case I" style="max-height: 420px;">
      <div class="figure-caption">Fig. 5.3. Test Case I — Credential Verification &amp; Access Control</div>
    </div>
    <p class="no-indent">
      <b>EXPECTED OUTPUT:</b> When a user supplies valid credentials (e.g., <code>admin@hrms.com</code> / <code>admin123</code>), the system authenticates the user, generates a signed 512-bit JWT, and redirects to the role-specific dashboard.<br>
      <b>ACTUAL OUTPUT:</b> Authentication succeeds with HTTP 200 OK. The user is redirected to the Executive HR Operations Dashboard with role claims successfully hydrated.
    </p>

    <h4 class="tertiary-heading" style="margin-top: 30px;">5.4.2 TEST CASE II: Biometric Check-In with 09:15 AM Grace Cutoff</h4>
    <div class="figure-box">
      <img src="${imgMap.attendance}" alt="Test Case II" style="max-height: 420px;">
      <div class="figure-caption">Fig. 5.4. Test Case II — Biometric Attendance Punch &amp; Grace Evaluation</div>
    </div>
    <p class="no-indent">
      <b>EXPECTED OUTPUT:</b> Punch recorded after 09:15 AM must be marked as <code>LATE</code> automatically by the shift evaluation algorithm.<br>
      <b>ACTUAL OUTPUT:</b> An employee punch submitted at 12:17 PM was accurately evaluated and marked as <code>LATE</code> with HTTP 200 OK, verifying the attendance grace rule.
    </p>
  </div>
`;

// Appendix II Screenshots
const appendixScreenshotsHtml = `
  <!-- ==================== APPENDIX II: SCREENSHOTS ==================== -->
  <div class="page-container page-break">
    <h3 class="subheading" style="text-align: center;">APPENDIX II: SCREENSHOTS</h3>

    <div class="figure-box">
      <img src="${imgMap.login}" alt="Landing &amp; Login Page">
      <div class="figure-caption">Fig. A.2.1. Landing &amp; User Authentication Portal with Persona Quick-Access</div>
    </div>

    <div class="figure-box" style="margin-top: 35px;">
      <img src="${imgMap.dashboard}" alt="Executive Dashboard">
      <div class="figure-caption">Fig. A.2.2. Primary HR Executive Operations Dashboard</div>
    </div>
  </div>

  <div class="page-container page-break">
    <div class="figure-box">
      <img src="${imgMap.onboarding}" alt="Candidate Onboarding">
      <div class="figure-caption">Fig. A.2.3. Candidate Onboarding &amp; KYC Verification Console</div>
    </div>

    <div class="figure-box" style="margin-top: 35px;">
      <img src="${imgMap.directory}" alt="Employee Directory">
      <div class="figure-caption">Fig. A.2.4. Employee Directory &amp; Master Records Management</div>
    </div>
  </div>

  <div class="page-container page-break">
    <div class="figure-box">
      <img src="${imgMap.attendance}" alt="Attendance Tracking">
      <div class="figure-caption">Fig. A.2.5. Attendance Tracking &amp; Geofencing Punch Engine</div>
    </div>

    <div class="figure-box" style="margin-top: 35px;">
      <img src="${imgMap.leave}" alt="Leave Management">
      <div class="figure-caption">Fig. A.2.6. Leave Management, Quota Accruals &amp; Status Logs</div>
    </div>
  </div>

  <div class="page-container page-break">
    <div class="figure-box">
      <img src="${imgMap.approvals}" alt="Manager Approvals">
      <div class="figure-caption">Fig. A.2.7. Department Manager Approvals &amp; Regularisation Console</div>
    </div>

    <div class="figure-box" style="margin-top: 35px;">
      <img src="${imgMap.payroll}" alt="Payroll Processing">
      <div class="figure-caption">Fig. A.2.8. Indian Statutory Payroll Run &amp; Disbursal Processing</div>
    </div>
  </div>

  <div class="page-container page-break">
    <div class="figure-box">
      <img src="${imgMap.compliance}" alt="Statutory Compliance">
      <div class="figure-caption">Fig. A.2.9. Statutory Compliance Center (PF-ECR, ESIC Challan, Form 24Q)</div>
    </div>

    <div class="figure-box" style="margin-top: 35px;">
      <img src="${imgMap.performance}" alt="Performance Appraisals">
      <div class="figure-caption">Fig. A.2.10. Annual Performance Management (PMS) &amp; Appraisals</div>
    </div>
  </div>

  <div class="page-container page-break">
    <div class="figure-box">
      <img src="${imgMap.exit}" alt="Exit Clearance &amp; FnF">
      <div class="figure-caption">Fig. A.2.11. Separation, Multi-Department Clearance &amp; FnF Settlement</div>
    </div>

    <div class="figure-box" style="margin-top: 35px;">
      <img src="${imgMap.analytics}" alt="Workforce Analytics">
      <div class="figure-caption">Fig. A.2.12. Workforce Analytics, Headcount &amp; Attrition Metrics</div>
    </div>
  </div>

  <div class="page-container page-break">
    <div class="figure-box">
      <img src="${imgMap.admin}" alt="Statutory Configuration">
      <div class="figure-caption">Fig. A.2.13. Statutory Configuration &amp; Compliance Rate Maintenance (FR12)</div>
    </div>

    <div class="figure-box" style="margin-top: 35px;">
      <img src="${imgMap.payslips}" alt="Employee Self-Service Payslips">
      <div class="figure-caption">Fig. A.2.14. Employee Self-Service (ESS) Monthly Payslip Portal</div>
    </div>
  </div>
`;

// Read HTML sections
const part1 = fs.readFileSync(path.join(genDir, 'part1_preliminary.html'), 'utf8');
const part2 = fs.readFileSync(path.join(genDir, 'part2_certificate_abstract.html'), 'utf8');
const part3 = fs.readFileSync(path.join(genDir, 'part3_toc_tables_figures.html'), 'utf8');
const part4 = fs.readFileSync(path.join(genDir, 'part4_chapters1_2.html'), 'utf8');
const part5 = fs.readFileSync(path.join(genDir, 'part5_chapter3.html'), 'utf8');
const part6 = fs.readFileSync(path.join(genDir, 'part6_chapter4_design.html'), 'utf8');
const part7 = fs.readFileSync(path.join(genDir, 'part7_chapter5_6_testing_conclusion.html'), 'utf8');
const part8 = fs.readFileSync(path.join(genDir, 'part8_appendix1_code.html'), 'utf8');

const headCss = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>EMPLOYEE ONBOARDING AND HR MANAGEMENT SYSTEM - HARIPRIYA K</title>
  <style>
    @page {
      size: A4;
      margin: 20mm 18mm 20mm 20mm;
      @bottom-center {
        content: counter(page);
        font-family: 'Times New Roman', Times, serif;
        font-size: 11pt;
      }
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.5;
      color: #111827;
      margin: 0;
      padding: 0;
      background: #ffffff;
    }
    .page-break {
      page-break-after: always;
      break-after: page;
    }
    .page-container {
      min-height: 900px;
      position: relative;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .text-justify { text-align: justify; }
    .font-bold { font-weight: bold; }
    
    .skcet-header {
      text-align: center;
      border-bottom: 2px solid #881337;
      padding-bottom: 12px;
      margin-bottom: 24px;
    }
    .skcet-title {
      font-size: 15pt;
      font-weight: bold;
      color: #881337;
      letter-spacing: 0.02em;
      margin: 0;
      line-height: 1.2;
    }
    .skcet-sub {
      font-size: 8pt;
      color: #374151;
      margin-top: 3px;
      line-height: 1.35;
    }

    h1.report-title {
      font-size: 18pt;
      font-weight: bold;
      color: #0f172a;
      text-align: center;
      margin-top: 35px;
      line-height: 1.35;
      letter-spacing: 0.03em;
    }
    h2.report-subtitle {
      font-size: 14pt;
      font-weight: bold;
      text-align: center;
      margin-top: 15px;
      letter-spacing: 0.05em;
    }
    .student-block {
      margin-top: 40px;
      text-align: center;
      font-size: 13pt;
    }
    .student-name {
      font-weight: bold;
      font-size: 14pt;
      color: #0f172a;
    }
    .degree-block {
      margin-top: 40px;
      text-align: center;
      font-size: 12pt;
      line-height: 1.6;
    }
    .date-footer {
      margin-top: 60px;
      text-align: center;
      font-weight: bold;
      font-size: 12pt;
      letter-spacing: 0.08em;
    }

    h2.section-header {
      font-size: 14pt;
      font-weight: bold;
      text-align: center;
      margin-top: 20px;
      margin-bottom: 25px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .signature-grid {
      display: flex;
      justify-content: space-between;
      margin-top: 80px;
    }
    .signature-box {
      width: 45%;
      text-align: center;
      font-size: 11pt;
      line-height: 1.35;
    }
    .viva-box {
      margin-top: 60px;
      font-size: 11pt;
    }

    .chapter-heading {
      text-align: center;
      font-size: 14pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-top: 20px;
      margin-bottom: 5px;
      letter-spacing: 0.05em;
    }
    .chapter-title {
      text-align: center;
      font-size: 16pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 30px;
      color: #0f172a;
    }
    h3.subheading {
      font-size: 13pt;
      font-weight: bold;
      margin-top: 22px;
      margin-bottom: 10px;
      color: #0f172a;
    }
    h4.tertiary-heading {
      font-size: 11.5pt;
      font-weight: bold;
      margin-top: 14px;
      margin-bottom: 6px;
      color: #1e293b;
    }

    p {
      text-align: justify;
      margin-top: 0;
      margin-bottom: 12px;
      text-indent: 28px;
    }
    p.no-indent {
      text-indent: 0;
    }
    ul, ol {
      margin-top: 4px;
      margin-bottom: 12px;
      padding-left: 28px;
      text-align: justify;
    }
    li {
      margin-bottom: 6px;
    }

    table.academic-table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0 24px 0;
      font-size: 10pt;
    }
    table.academic-table th, table.academic-table td {
      border: 1px solid #475569;
      padding: 7px 10px;
      text-align: left;
      vertical-align: top;
    }
    table.academic-table th {
      background-color: #f1f5f9;
      font-weight: bold;
      color: #0f172a;
    }
    .table-caption {
      text-align: center;
      font-size: 10pt;
      font-weight: bold;
      margin-bottom: 6px;
      color: #1e293b;
    }
    .figure-box {
      text-align: center;
      margin: 20px 0;
      page-break-inside: avoid;
    }
    .figure-box img {
      max-width: 92%;
      max-height: 480px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
    }
    .figure-caption {
      text-align: center;
      font-size: 10pt;
      font-weight: bold;
      margin-top: 8px;
      color: #1e293b;
    }

    .code-window {
      background: #0f172a;
      color: #f8fafc;
      border-radius: 6px;
      padding: 14px 16px;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 9.5pt;
      line-height: 1.45;
      text-align: left;
      overflow: hidden;
      margin: 16px 0;
      border: 1px solid #334155;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
      page-break-inside: avoid;
    }
    .code-title {
      font-size: 9pt;
      color: #94a3b8;
      border-bottom: 1px solid #334155;
      padding-bottom: 6px;
      margin-bottom: 8px;
      font-family: sans-serif;
      display: flex;
      justify-content: space-between;
    }
    .keyword { color: #f472b6; font-weight: bold; }
    .func { color: #60a5fa; }
    .string { color: #34d399; }
    .comment { color: #94a3b8; font-style: italic; }
  </style>
</head>
<body>
`;

const fullHtml = headCss + 
  part1 + 
  part2 + 
  part3 + 
  part4 + 
  part5 + 
  part6 + 
  diagramsHtml + 
  part7.split('<!-- ==================== CHAPTER 6: CONCLUSION ==================== -->')[0] + 
  testCasesVisualsHtml + 
  '<!-- ==================== CHAPTER 6: CONCLUSION ==================== -->' + 
  part7.split('<!-- ==================== CHAPTER 6: CONCLUSION ==================== -->')[1] + 
  part8 + 
  appendixScreenshotsHtml + 
  '</body></html>';

fs.writeFileSync(outputHtml, fullHtml, 'utf8');
console.log('Full HTML Report assembled at:', outputHtml);

async function runPdf() {
  console.log('Launching browser to render PDF...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  await page.setContent(fullHtml, { waitUntil: 'load', timeout: 60000 });
  await page.evaluateHandle('document.fonts.ready');
  
  console.log('Printing to PDF...');
  await page.pdf({
    path: outputPdf,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '18mm',
      bottom: '18mm',
      left: '18mm',
      right: '18mm'
    }
  });

  await browser.close();
  console.log('SUCCESS! PDF Report compiled at:', outputPdf);
  const sizeMb = (fs.statSync(outputPdf).size / 1024 / 1024).toFixed(2);
  console.log(`PDF Size: ${sizeMb} MB`);
}

runPdf().catch(err => {
  console.error('PDF Generation Error:', err);
  process.exit(1);
});
