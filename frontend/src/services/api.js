const BASE_URL = 'http://localhost:8080/api/v1';

export const getAuthToken = () => localStorage.getItem('hrms_token');
export const setAuthToken = (token) => localStorage.setItem('hrms_token', token);
export const removeAuthToken = () => localStorage.removeItem('hrms_token');

export const getCurrentUser = () => {
  const user = localStorage.getItem('hrms_user');
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user) => {
  localStorage.setItem('hrms_user', JSON.stringify(user));
};

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    // Optionally redirect to login
  }

  if (!response.ok) {
    let errorDetail = 'An error occurred';
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.detail || errorJson.message || errorJson.title || JSON.stringify(errorJson);
    } catch {
      errorDetail = await response.text();
    }
    throw new Error(errorDetail || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return await response.text();
}

export const api = {
  // Auth
  login: (username, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  getMe: () => request('/auth/me'),

  // Employees
  getEmployees: (search) =>
    request(`/employees${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getEmployeeById: (id) => request(`/employees/${id}`),
  createEmployee: (data) =>
    request('/employees', { method: 'POST', body: JSON.stringify(data) }),
  updateEmployee: (id, data) =>
    request(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getHierarchy: () => request('/employees/hierarchy'),
  updateTaxRegime: (id, regime) =>
    request(`/employees/${id}/tax-regime?regime=${regime}`, { method: 'POST' }),

  // Attendance
  punch: (employeeId, data = {}) =>
    request(`/attendance/punch?employeeId=${employeeId}`, { method: 'POST', body: JSON.stringify(data) }),
  getTodayPunch: (employeeId) =>
    request(`/attendance/today?employeeId=${employeeId}`),
  getMonthlyRecords: (employeeId, month) =>
    request(`/attendance/records/${employeeId}?month=${month}`),
  getMonthlySummary: (employeeId, month) =>
    request(`/attendance/${month}?employeeId=${employeeId}`),
  regularise: (employeeId, data) =>
    request(`/attendance/regularise?employeeId=${employeeId}`, { method: 'POST', body: JSON.stringify(data) }),
  getPendingRegularisations: () =>
    request('/attendance/regularisations/pending'),
  approveRegularisation: (id) =>
    request(`/attendance/regularisations/${id}/approve`, { method: 'PUT' }),
  rejectRegularisation: (id) =>
    request(`/attendance/regularisations/${id}/reject`, { method: 'PUT' }),
  getShifts: () => request('/attendance/shifts'),
  getHolidays: (year = 2026) => request(`/attendance/holidays?year=${year}`),

  // Leaves
  getBalances: (employeeId, financialYear = '2026-2027') =>
    request(`/leave/balance?employeeId=${employeeId}&financialYear=${financialYear}`),
  getMyLeaves: (employeeId) =>
    request(`/leave/my-leaves/${employeeId}`),
  getPendingLeaves: (managerId) =>
    request(`/leave/pending${managerId ? `?managerId=${managerId}` : ''}`),
  applyLeave: (employeeId, data) =>
    request(`/leave/apply?employeeId=${employeeId}`, { method: 'POST', body: JSON.stringify(data) }),
  approveLeave: (id, comments = '') =>
    request(`/leave/${id}/approve`, { method: 'PUT', body: JSON.stringify({ managerComments: comments }) }),
  rejectLeave: (id, comments = '') =>
    request(`/leave/${id}/reject`, { method: 'PUT', body: JSON.stringify({ managerComments: comments }) }),
  getEncashment: (employeeId) =>
    request(`/leave/encashment/${employeeId}`),

  // Payroll
  getRuns: () => request('/payroll/runs'),
  initiateRun: (runMonth) =>
    request('/payroll/run', { method: 'POST', body: JSON.stringify({ runMonth }) }),
  approveRun: (id) =>
    request(`/payroll/${id}/approve`, { method: 'POST' }),
  disburseRun: (id) =>
    request(`/payroll/${id}/disburse`, { method: 'POST' }),
  getRecords: (runId) =>
    request(`/payroll/runs/${runId}/records`),
  getPayslip: (month, employeeId) =>
    request(`/payroll/payslip/${month}?employeeId=${employeeId}`),
  getMyPayslips: (employeeId) =>
    request(`/payroll/my-payslips/${employeeId}`),

  // Compliance
  getPfEcrDownloadUrl: (month) => `${BASE_URL}/compliance/pf-ecr/${month}`,
  getEsiChallanDownloadUrl: (month) => `${BASE_URL}/compliance/esi-challan/${month}`,
  getForm24qDownloadUrl: (quarter = 'Q4', year = '2025-2026') =>
    `${BASE_URL}/compliance/form24q?quarter=${quarter}&year=${year}`,
  getForm16: (employeeId, year = '2025-2026') =>
    request(`/compliance/form16/${year}?employeeId=${employeeId}`),
  submitForm12BB: (employeeId, data) =>
    request(`/compliance/form12bb?employeeId=${employeeId}`, { method: 'POST', body: JSON.stringify(data) }),

  // Onboarding
  getCandidates: () => request('/onboarding/candidates'),
  createCandidate: (data) =>
    request('/onboarding/candidates', { method: 'POST', body: JSON.stringify(data) }),
  simulateESign: (id) =>
    request(`/onboarding/candidates/${id}/esign`, { method: 'POST' }),
  verifyDoc: (id, docType, verified) =>
    request(`/onboarding/candidates/${id}/verify-doc?docType=${docType}&verified=${verified}`, { method: 'POST' }),
  updateBgv: (id, status) =>
    request(`/onboarding/candidates/${id}/bgv?status=${status}`, { method: 'POST' }),
  updateAssets: (id, laptop, accessCard, email) =>
    request(`/onboarding/candidates/${id}/assets?laptop=${laptop}&accessCard=${accessCard}&email=${email}`, { method: 'POST' }),
  convertToEmployee: (id) =>
    request(`/onboarding/candidates/${id}/convert`, { method: 'POST' }),

  // Exit Management
  getExits: () => request('/exit/records'),
  getExitByEmployee: (employeeId) =>
    request(`/exit/by-employee/${employeeId}`),
  submitResignation: (employeeId, data) =>
    request(`/exit/resign?employeeId=${employeeId}`, { method: 'POST', body: JSON.stringify(data) }),
  updateClearance: (id, data) =>
    request(`/exit/${id}/clearance`, { method: 'PUT', body: JSON.stringify(data) }),
  computeFnF: (id, data) =>
    request(`/exit/${id}/compute-fnf`, { method: 'POST', body: JSON.stringify(data) }),
  disburseFnF: (id) =>
    request(`/exit/${id}/disburse-fnf`, { method: 'POST' }),

  // Performance
  getAppraisals: (year = '2025-2026') =>
    request(`/performance/appraisals?year=${year}`),
  getEmployeeAppraisal: (employeeId, year = '2025-2026') =>
    request(`/performance/employee/${employeeId}?year=${year}`),
  setGoals: (id, goalsJson) =>
    request(`/performance/${id}/goals`, { method: 'POST', body: JSON.stringify({ goalsJson }) }),
  submitSelfReview: (id, rating, comments) =>
    request(`/performance/${id}/self-review`, { method: 'POST', body: JSON.stringify({ rating, comments }) }),
  submitManagerReview: (id, data) =>
    request(`/performance/${id}/manager-review`, { method: 'POST', body: JSON.stringify(data) }),
  finalizeAppraisal: (id, finalRating, incrementPct) =>
    request(`/performance/${id}/finalize?finalRating=${finalRating}&incrementPct=${incrementPct}`, { method: 'POST' }),
  getBellCurve: (year = '2025-2026') =>
    request(`/performance/bell-curve?year=${year}`),

  // Training
  getTrainings: () => request('/training'),
  getEmployeeTrainings: (employeeId) =>
    request(`/training/employee/${employeeId}`),
  enrollTraining: (employeeId, data) =>
    request(`/training/enroll?employeeId=${employeeId}`, { method: 'POST', body: JSON.stringify(data) }),
  completeTraining: (id, completed, score) =>
    request(`/training/${id}/complete?completed=${completed}${score ? `&score=${score}` : ''}`, { method: 'POST' }),

  // Analytics
  getHeadcount: () => request('/analytics/headcount'),
  getPayrollCost: () => request('/analytics/payroll-cost'),
  getComplianceCalendar: () => request('/analytics/compliance-calendar'),

  // Admin
  getAuditLogs: () => request('/admin/audit-logs'),
  getDepartments: () => request('/admin/departments'),
  createDepartment: (data) =>
    request('/admin/departments', { method: 'POST', body: JSON.stringify(data) }),
  getSalaryStructures: () => request('/admin/salary-structures'),
  getStatutoryConfigs: () => request('/admin/statutory-config'),
  updateStatutoryConfig: (id, data) =>
    request(`/admin/statutory-config/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getCompanyConfig: () => request('/admin/company-config'),
};
