const fs = require('fs');
const path = require('path');
const assetsDir = path.resolve(__dirname, 'report-assets');

// 1. Use Case Diagram
const useCaseSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 700" width="1000" height="700" style="background:#ffffff; font-family: Arial, sans-serif;">
  <rect x="250" y="20" width="500" height="660" rx="16" fill="#f8fafc" stroke="#0284c7" stroke-width="2.5" />
  <text x="500" y="55" font-size="18" font-weight="bold" fill="#0369a1" text-anchor="middle">HRMS Enterprise System Boundaries</text>

  <!-- Left Actors -->
  <!-- Employee -->
  <g transform="translate(70, 140)">
    <circle cx="30" cy="20" r="14" fill="none" stroke="#1e293b" stroke-width="2.5" />
    <line x1="30" y1="34" x2="30" y2="70" stroke="#1e293b" stroke-width="2.5" />
    <line x1="5" y1="48" x2="55" y2="48" stroke="#1e293b" stroke-width="2.5" />
    <line x1="30" y1="70" x2="10" y2="105" stroke="#1e293b" stroke-width="2.5" />
    <line x1="30" y1="70" x2="50" y2="105" stroke="#1e293b" stroke-width="2.5" />
    <text x="30" y="125" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">Employee</text>
    <text x="30" y="140" font-size="11" fill="#64748b" text-anchor="middle">(Staff / ESS)</text>
  </g>

  <!-- Department Manager -->
  <g transform="translate(70, 420)">
    <circle cx="30" cy="20" r="14" fill="none" stroke="#1e293b" stroke-width="2.5" />
    <line x1="30" y1="34" x2="30" y2="70" stroke="#1e293b" stroke-width="2.5" />
    <line x1="5" y1="48" x2="55" y2="48" stroke="#1e293b" stroke-width="2.5" />
    <line x1="30" y1="70" x2="10" y2="105" stroke="#1e293b" stroke-width="2.5" />
    <line x1="30" y1="70" x2="50" y2="105" stroke="#1e293b" stroke-width="2.5" />
    <text x="30" y="125" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">Dept Manager</text>
    <text x="30" y="140" font-size="11" fill="#64748b" text-anchor="middle">(Approver / Lead)</text>
  </g>

  <!-- Right Actors -->
  <!-- HR Manager -->
  <g transform="translate(870, 160)">
    <circle cx="30" cy="20" r="14" fill="none" stroke="#1e293b" stroke-width="2.5" />
    <line x1="30" y1="34" x2="30" y2="70" stroke="#1e293b" stroke-width="2.5" />
    <line x1="5" y1="48" x2="55" y2="48" stroke="#1e293b" stroke-width="2.5" />
    <line x1="30" y1="70" x2="10" y2="105" stroke="#1e293b" stroke-width="2.5" />
    <line x1="30" y1="70" x2="50" y2="105" stroke="#1e293b" stroke-width="2.5" />
    <text x="30" y="125" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">HR Manager</text>
    <text x="30" y="140" font-size="11" fill="#64748b" text-anchor="middle">(Admin Operations)</text>
  </g>

  <!-- Super Admin -->
  <g transform="translate(870, 420)">
    <circle cx="30" cy="20" r="14" fill="none" stroke="#1e293b" stroke-width="2.5" />
    <line x1="30" y1="34" x2="30" y2="70" stroke="#1e293b" stroke-width="2.5" />
    <line x1="5" y1="48" x2="55" y2="48" stroke="#1e293b" stroke-width="2.5" />
    <line x1="30" y1="70" x2="10" y2="105" stroke="#1e293b" stroke-width="2.5" />
    <line x1="30" y1="70" x2="50" y2="105" stroke="#1e293b" stroke-width="2.5" />
    <text x="30" y="125" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">Super Admin</text>
    <text x="30" y="140" font-size="11" fill="#64748b" text-anchor="middle">(System & Compliance)</text>
  </g>

  <!-- Use Cases -->
  <!-- UC1: User Auth -->
  <ellipse cx="500" cy="100" rx="140" ry="24" fill="#ffffff" stroke="#0284c7" stroke-width="1.8" />
  <text x="500" y="105" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">User Authentication &amp; JWT Token</text>

  <!-- UC2: Punch Attendance -->
  <ellipse cx="500" cy="160" rx="140" ry="24" fill="#ffffff" stroke="#0284c7" stroke-width="1.8" />
  <text x="500" y="165" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">Punch In/Out &amp; Geofencing</text>

  <!-- UC3: Apply Leave -->
  <ellipse cx="500" cy="220" rx="140" ry="24" fill="#ffffff" stroke="#0284c7" stroke-width="1.8" />
  <text x="500" y="225" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">Apply Leave &amp; View Quota</text>

  <!-- UC4: Approvals -->
  <ellipse cx="500" cy="280" rx="140" ry="24" fill="#ffffff" stroke="#0284c7" stroke-width="1.8" />
  <text x="500" y="285" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">Approve Leave &amp; Regularization</text>

  <!-- UC5: Payslips -->
  <ellipse cx="500" cy="340" rx="140" ry="24" fill="#ffffff" stroke="#0284c7" stroke-width="1.8" />
  <text x="500" y="345" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">Download Monthly Payslips (ESS)</text>

  <!-- UC6: Onboarding & KYC -->
  <ellipse cx="500" cy="400" rx="140" ry="24" fill="#ffffff" stroke="#0284c7" stroke-width="1.8" />
  <text x="500" y="405" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">Manage Onboarding &amp; KYC Docs</text>

  <!-- UC7: Payroll Engine -->
  <ellipse cx="500" cy="460" rx="140" ry="24" fill="#ffffff" stroke="#0284c7" stroke-width="1.8" />
  <text x="500" y="465" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">Execute Indian Statutory Payroll</text>

  <!-- UC8: Statutory Compliance -->
  <ellipse cx="500" cy="520" rx="140" ry="24" fill="#ffffff" stroke="#0284c7" stroke-width="1.8" />
  <text x="500" y="525" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">Generate PF-ECR, ESI &amp; Form 24Q</text>

  <!-- UC9: Appraisals & PMS -->
  <ellipse cx="500" cy="580" rx="140" ry="24" fill="#ffffff" stroke="#0284c7" stroke-width="1.8" />
  <text x="500" y="585" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">Conduct Performance Appraisals</text>

  <!-- UC10: Statutory Config & Audit -->
  <ellipse cx="500" cy="640" rx="140" ry="24" fill="#ffffff" stroke="#0284c7" stroke-width="1.8" />
  <text x="500" y="645" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">Configure Statutory Rates &amp; Audit Logs</text>

  <!-- Connectors -->
  <!-- Employee connects to UC1, UC2, UC3, UC5 -->
  <line x1="140" y1="180" x2="360" y2="105" stroke="#94a3b8" stroke-dasharray="4,4" />
  <line x1="140" y1="180" x2="360" y2="160" stroke="#0284c7" stroke-width="1.5" />
  <line x1="140" y1="180" x2="360" y2="220" stroke="#0284c7" stroke-width="1.5" />
  <line x1="140" y1="180" x2="360" y2="340" stroke="#0284c7" stroke-width="1.5" />

  <!-- Manager connects to UC1, UC4, UC9 -->
  <line x1="140" y1="460" x2="360" y2="105" stroke="#94a3b8" stroke-dasharray="4,4" />
  <line x1="140" y1="460" x2="360" y2="280" stroke="#059669" stroke-width="1.5" />
  <line x1="140" y1="460" x2="360" y2="580" stroke="#059669" stroke-width="1.5" />

  <!-- HR connects to UC1, UC6, UC7, UC8, UC9 -->
  <line x1="860" y1="200" x2="640" y2="105" stroke="#94a3b8" stroke-dasharray="4,4" />
  <line x1="860" y1="200" x2="640" y2="400" stroke="#7c3aed" stroke-width="1.5" />
  <line x1="860" y1="200" x2="640" y2="460" stroke="#7c3aed" stroke-width="1.5" />
  <line x1="860" y1="200" x2="640" y2="520" stroke="#7c3aed" stroke-width="1.5" />
  <line x1="860" y1="200" x2="640" y2="580" stroke="#7c3aed" stroke-width="1.5" />

  <!-- SuperAdmin connects to UC1, UC10, UC8 -->
  <line x1="860" y1="460" x2="640" y2="105" stroke="#94a3b8" stroke-dasharray="4,4" />
  <line x1="860" y1="460" x2="640" y2="520" stroke="#dc2626" stroke-width="1.5" />
  <line x1="860" y1="460" x2="640" y2="640" stroke="#dc2626" stroke-width="1.5" />
</svg>
`;

fs.writeFileSync(path.join(assetsDir, 'Fig_4_1_UseCaseDiagram.svg'), useCaseSvg.trim());

// 2. Sequence Diagram
const sequenceSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 650" width="1000" height="650" style="background:#ffffff; font-family: Arial, sans-serif;">
  <!-- Lifelines -->
  <g transform="translate(40, 20)">
    <!-- Actor: User (Client) -->
    <rect x="20" y="20" width="120" height="40" rx="8" fill="#e0f2fe" stroke="#0284c7" stroke-width="2" />
    <text x="80" y="45" font-size="13" font-weight="bold" fill="#0369a1" text-anchor="middle">User / React UI</text>
    <line x1="80" y1="60" x2="80" y2="580" stroke="#94a3b8" stroke-dasharray="5,5" stroke-width="1.5" />

    <!-- Auth Filter / Security -->
    <rect x="250" y="20" width="140" height="40" rx="8" fill="#fef3c7" stroke="#d97706" stroke-width="2" />
    <text x="320" y="45" font-size="13" font-weight="bold" fill="#92400e" text-anchor="middle">Security &amp; JWT Filter</text>
    <line x1="320" y1="60" x2="320" y2="580" stroke="#94a3b8" stroke-dasharray="5,5" stroke-width="1.5" />

    <!-- Spring Controllers / Services -->
    <rect x="490" y="20" width="150" height="40" rx="8" fill="#f3e8ff" stroke="#7c3aed" stroke-width="2" />
    <text x="565" y="45" font-size="13" font-weight="bold" fill="#6b21a8" text-anchor="middle">Spring Boot Services</text>
    <line x1="565" y1="60" x2="565" y2="580" stroke="#94a3b8" stroke-dasharray="5,5" stroke-width="1.5" />

    <!-- Database / PostgreSQL -->
    <rect x="730" y="20" width="150" height="40" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="2" />
    <text x="805" y="45" font-size="13" font-weight="bold" fill="#15803d" text-anchor="middle">PostgreSQL Database</text>
    <line x1="805" y1="60" x2="805" y2="580" stroke="#94a3b8" stroke-dasharray="5,5" stroke-width="1.5" />

    <!-- Step 1: Login Request -->
    <line x1="80" y1="100" x2="320" y2="100" stroke="#0284c7" stroke-width="2" marker-end="url(#arrow)" />
    <text x="200" y="92" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">1: POST /api/v1/auth/login {user, pass}</text>

    <!-- Step 2: Validate BCrypt -->
    <line x1="320" y1="130" x2="565" y2="130" stroke="#7c3aed" stroke-width="2" />
    <text x="442" y="122" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">2: Load UserDetails &amp; Verify BCrypt Hash</text>

    <!-- Step 3: Query DB -->
    <line x1="565" y1="160" x2="805" y2="160" stroke="#16a34a" stroke-width="2" />
    <text x="685" y="152" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">3: SELECT FROM users WHERE username = ?</text>

    <!-- Step 4: Return User Entity -->
    <line x1="805" y1="190" x2="565" y2="190" stroke="#16a34a" stroke-dasharray="4,4" stroke-width="2" />
    <text x="685" y="182" font-size="11" fill="#0f172a" text-anchor="middle">4: Return User entity, Role &amp; employeeId</text>

    <!-- Step 5: Issue JWT -->
    <line x1="565" y1="220" x2="80" y2="220" stroke="#0284c7" stroke-dasharray="4,4" stroke-width="2" />
    <text x="280" y="212" font-size="11" font-weight="bold" fill="#0369a1" text-anchor="middle">5: Return 200 OK + Signed JWT Token (Claims: role, empId)</text>

    <!-- Step 6: Store in localStorage -->
    <rect x="40" y="240" width="80" height="24" rx="4" fill="#e2e8f0" />
    <text x="80" y="256" font-size="10" fill="#334155" text-anchor="middle">Save Token</text>

    <!-- Step 7: Authenticated Request -->
    <line x1="80" y1="300" x2="320" y2="300" stroke="#0284c7" stroke-width="2" />
    <text x="200" y="292" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">6: GET /api/v1/employees (Header: Bearer &lt;JWT&gt;)</text>

    <!-- Step 8: Token validation -->
    <line x1="320" y1="330" x2="320" y2="350" stroke="#d97706" stroke-width="2" />
    <text x="350" y="345" font-size="10" fill="#92400e">Validate Signature &amp; Roles</text>

    <!-- Step 9: Pass to controller -->
    <line x1="320" y1="370" x2="565" y2="370" stroke="#7c3aed" stroke-width="2" />
    <text x="442" y="362" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">7: Dispatch to EmployeeController.getAllEmployees()</text>

    <!-- Step 10: DB Query -->
    <line x1="565" y1="410" x2="805" y2="410" stroke="#16a34a" stroke-width="2" />
    <text x="685" y="402" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">8: Fetch active employees, departments &amp; salary</text>

    <!-- Step 11: DB Result -->
    <line x1="805" y1="440" x2="565" y2="440" stroke="#16a34a" stroke-dasharray="4,4" stroke-width="2" />
    <text x="685" y="432" font-size="11" fill="#0f172a" text-anchor="middle">9: SQL Result Set (4 records)</text>

    <!-- Step 12: Audit Log Event -->
    <line x1="565" y1="480" x2="805" y2="480" stroke="#dc2626" stroke-width="2" />
    <text x="685" y="472" font-size="11" font-weight="bold" fill="#dc2626" text-anchor="middle">10: INSERT INTO hr_audit_logs (actor, action, timestamp)</text>

    <!-- Step 13: UI Render -->
    <line x1="565" y1="520" x2="80" y2="520" stroke="#0284c7" stroke-dasharray="4,4" stroke-width="2" />
    <text x="280" y="512" font-size="11" font-weight="bold" fill="#0284c7" text-anchor="middle">11: Return JSON Array &amp; Render Employee Directory Cards</text>
  </g>
</svg>
`;

fs.writeFileSync(path.join(assetsDir, 'Fig_4_2_SequenceDiagram.svg'), sequenceSvg.trim());

// 3. Data Flow Diagram (DFD Level 0 & 1)
const dfdSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 680" width="1000" height="680" style="background:#ffffff; font-family: Arial, sans-serif;">
  <text x="500" y="40" font-size="20" font-weight="bold" fill="#0f172a" text-anchor="middle">Level 1 Data Flow Diagram (DFD) — HRMS Enterprise System</text>

  <!-- External Entities -->
  <!-- Employee -->
  <rect x="40" y="100" width="140" height="70" rx="8" fill="#e0f2fe" stroke="#0284c7" stroke-width="2" />
  <text x="110" y="132" font-size="14" font-weight="bold" fill="#0369a1" text-anchor="middle">Employee</text>
  <text x="110" y="152" font-size="11" fill="#475569" text-anchor="middle">(Staff Member)</text>

  <!-- Dept Manager -->
  <rect x="40" y="320" width="140" height="70" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="2" />
  <text x="110" y="352" font-size="14" font-weight="bold" fill="#15803d" text-anchor="middle">Dept Manager</text>
  <text x="110" y="372" font-size="11" fill="#475569" text-anchor="middle">(Supervisor)</text>

  <!-- HR Admin -->
  <rect x="820" y="100" width="140" height="70" rx="8" fill="#f3e8ff" stroke="#7c3aed" stroke-width="2" />
  <text x="890" y="132" font-size="14" font-weight="bold" fill="#6b21a8" text-anchor="middle">HR Manager</text>
  <text x="890" y="152" font-size="11" fill="#475569" text-anchor="middle">(HR Operations)</text>

  <!-- External Agency: EPFO / ESIC / Income Tax -->
  <rect x="820" y="320" width="140" height="70" rx="8" fill="#fef3c7" stroke="#d97706" stroke-width="2" />
  <text x="890" y="345" font-size="13" font-weight="bold" fill="#92400e" text-anchor="middle">Statutory Portals</text>
  <text x="890" y="365" font-size="11" fill="#92400e" text-anchor="middle">EPFO / ESIC / NSDL</text>

  <!-- Process Bubbles -->
  <!-- Process 1.0: Auth & Identity -->
  <circle cx="340" cy="135" r="55" fill="#f8fafc" stroke="#0284c7" stroke-width="2.5" />
  <text x="340" y="125" font-size="12" font-weight="bold" fill="#0369a1" text-anchor="middle">1.0</text>
  <text x="340" y="142" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Authentication &amp;</text>
  <text x="340" y="157" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">RBAC (JWT)</text>

  <!-- Process 2.0: Attendance & Leave -->
  <circle cx="340" cy="355" r="55" fill="#f8fafc" stroke="#0284c7" stroke-width="2.5" />
  <text x="340" y="345" font-size="12" font-weight="bold" fill="#0369a1" text-anchor="middle">2.0</text>
  <text x="340" y="362" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Attendance &amp;</text>
  <text x="340" y="377" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Leave Quotas</text>

  <!-- Process 3.0: Statutory Payroll Engine -->
  <circle cx="660" cy="135" r="55" fill="#f8fafc" stroke="#7c3aed" stroke-width="2.5" />
  <text x="660" y="125" font-size="12" font-weight="bold" fill="#6b21a8" text-anchor="middle">3.0</text>
  <text x="660" y="142" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Statutory Payroll</text>
  <text x="660" y="157" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Gross-to-Net</text>

  <!-- Process 4.0: Compliance Reporting -->
  <circle cx="660" cy="355" r="55" fill="#f8fafc" stroke="#d97706" stroke-width="2.5" />
  <text x="660" y="345" font-size="12" font-weight="bold" fill="#92400e" text-anchor="middle">4.0</text>
  <text x="660" y="362" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Statutory ECR</text>
  <text x="660" y="377" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">&amp; TDS Reports</text>

  <!-- Process 5.0: Audit Trail & Governance -->
  <circle cx="500" cy="530" r="55" fill="#f8fafc" stroke="#dc2626" stroke-width="2.5" />
  <text x="500" y="520" font-size="12" font-weight="bold" fill="#dc2626" text-anchor="middle">5.0</text>
  <text x="500" y="537" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Audit Trails &amp;</text>
  <text x="500" y="552" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Governance</text>

  <!-- Data Stores (D1, D2, D3) -->
  <!-- D1: Employee Master DB -->
  <g transform="translate(430, 210)">
    <line x1="0" y1="0" x2="140" y2="0" stroke="#0f172a" stroke-width="2" />
    <line x1="0" y1="36" x2="140" y2="36" stroke="#0f172a" stroke-width="2" />
    <text x="70" y="24" font-size="12" font-weight="bold" fill="#0f172a" text-anchor="middle">D1: Employee Master</text>
  </g>

  <!-- D2: Attendance & Leave DB -->
  <g transform="translate(430, 270)">
    <line x1="0" y1="0" x2="140" y2="0" stroke="#0f172a" stroke-width="2" />
    <line x1="0" y1="36" x2="140" y2="36" stroke="#0f172a" stroke-width="2" />
    <text x="70" y="24" font-size="12" font-weight="bold" fill="#0f172a" text-anchor="middle">D2: Attendance &amp; Leaves</text>
  </g>

  <!-- D3: Payroll & Statutory DB -->
  <g transform="translate(430, 420)">
    <line x1="0" y1="0" x2="140" y2="0" stroke="#0f172a" stroke-width="2" />
    <line x1="0" y1="36" x2="140" y2="36" stroke="#0f172a" stroke-width="2" />
    <text x="70" y="24" font-size="12" font-weight="bold" fill="#0f172a" text-anchor="middle">D3: Payroll &amp; Compliance</text>
  </g>

  <!-- Data Flow Arrows -->
  <!-- Employee to 1.0 -->
  <line x1="180" y1="135" x2="285" y2="135" stroke="#0284c7" stroke-width="1.8" />
  <text x="232" y="127" font-size="10" fill="#0369a1" text-anchor="middle">Credentials</text>

  <!-- Employee to 2.0 -->
  <line x1="180" y1="150" x2="295" y2="320" stroke="#0284c7" stroke-width="1.8" />
  <text x="210" y="240" font-size="10" fill="#0369a1" text-anchor="middle">Punch / Leaves</text>

  <!-- 2.0 to Manager -->
  <line x1="285" y1="365" x2="180" y2="365" stroke="#16a34a" stroke-width="1.8" />
  <text x="232" y="380" font-size="10" fill="#15803d" text-anchor="middle">Approvals</text>

  <!-- HR to 3.0 -->
  <line x1="820" y1="135" x2="715" y2="135" stroke="#7c3aed" stroke-width="1.8" />
  <text x="768" y="127" font-size="10" fill="#6b21a8" text-anchor="middle">Run Payroll</text>

  <!-- 3.0 to 4.0 -->
  <line x1="660" y1="190" x2="660" y2="300" stroke="#7c3aed" stroke-width="1.8" />
  <text x="670" y="250" font-size="10" fill="#6b21a8">Wages &amp; Deductions</text>

  <!-- 4.0 to Portals -->
  <line x1="715" y1="355" x2="820" y2="355" stroke="#d97706" stroke-width="1.8" />
  <text x="768" y="347" font-size="10" fill="#92400e" text-anchor="middle">ECR / Challans</text>

  <!-- Flow to Data Stores -->
  <line x1="395" y1="150" x2="430" y2="215" stroke="#475569" stroke-width="1.5" />
  <line x1="395" y1="340" x2="430" y2="290" stroke="#475569" stroke-width="1.5" />
  <line x1="605" y1="150" x2="570" y2="215" stroke="#475569" stroke-width="1.5" />
  <line x1="660" y1="410" x2="570" y2="430" stroke="#475569" stroke-width="1.5" />

  <!-- Flow to 5.0 Audit -->
  <line x1="340" y1="410" x2="450" y2="510" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="3,3" />
  <line x1="660" y1="410" x2="550" y2="510" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="3,3" />
</svg>
`;

fs.writeFileSync(path.join(assetsDir, 'Fig_4_3_DataFlowDiagram.svg'), dfdSvg.trim());

console.log('All SVG diagrams generated successfully!');
