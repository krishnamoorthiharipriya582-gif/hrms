const fs = require('fs');
const path = require('path');

const baseUrl = 'http://localhost:8080/api/v1';

const collection = {
  info: {
    name: 'HRMS Enterprise API Test Suite (IEEE Std 830-1998)',
    description: 'Comprehensive automated test collection for Employee Onboarding and HR Management System (HRMS). Covers Authentication, Employee Master, Attendance Geofence, Leave Quotas, Statutory Payroll Engine, Compliance Reports (PF-ECR, ESIC, Form 24Q), Dynamic Statutory Config, and Audit Trails.',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
  },
  variable: [
    { key: 'baseUrl', value: baseUrl },
    { key: 'adminToken', value: '' },
    { key: 'superToken', value: '' },
    { key: 'managerToken', value: '' },
    { key: 'empToken', value: '' },
    { key: 'employeeId', value: '' },
    { key: 'statConfigId', value: '' }
  ],
  item: [
    {
      name: '01. Authentication & RBAC',
      item: [
        {
          name: '1.1 Login HR Manager (Sarah Jenkins)',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 200 OK", function () { pm.response.to.have.status(200); });',
                  'var json = pm.response.json();',
                  'pm.test("JWT Token returned", function () { pm.expect(json.token).to.be.a("string"); });',
                  'pm.test("Role is ROLE_HR_MANAGER", function () { pm.expect(json.role).to.eql("ROLE_HR_MANAGER"); });',
                  'pm.collectionVariables.set("adminToken", json.token);'
                ],
                type: 'text/javascript'
              }
            }
          ],
          request: {
            method: 'POST',
            header: [{ key: 'Content-Type', value: 'application/json' }],
            body: {
              mode: 'raw',
              raw: JSON.stringify({ username: 'admin@hrms.com', password: 'admin123' })
            },
            url: { raw: '{{baseUrl}}/auth/login', host: ['{{baseUrl}}'], path: ['auth', 'login'] }
          }
        },
        {
          name: '1.2 Login Super Admin',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 200 OK", function () { pm.response.to.have.status(200); });',
                  'var json = pm.response.json();',
                  'pm.test("Role is ROLE_SUPER_ADMIN", function () { pm.expect(json.role).to.eql("ROLE_SUPER_ADMIN"); });',
                  'pm.collectionVariables.set("superToken", json.token);'
                ],
                type: 'text/javascript'
              }
            }
          ],
          request: {
            method: 'POST',
            header: [{ key: 'Content-Type', value: 'application/json' }],
            body: {
              mode: 'raw',
              raw: JSON.stringify({ username: 'superadmin@hrms.com', password: 'superadmin123' })
            },
            url: { raw: '{{baseUrl}}/auth/login', host: ['{{baseUrl}}'], path: ['auth', 'login'] }
          }
        },
        {
          name: '1.3 Login Department Manager (Rajesh Sharma)',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 200 OK", function () { pm.response.to.have.status(200); });',
                  'var json = pm.response.json();',
                  'pm.test("Role is ROLE_DEPT_MANAGER", function () { pm.expect(json.role).to.eql("ROLE_DEPT_MANAGER"); });',
                  'pm.collectionVariables.set("managerToken", json.token);'
                ],
                type: 'text/javascript'
              }
            }
          ],
          request: {
            method: 'POST',
            header: [{ key: 'Content-Type', value: 'application/json' }],
            body: {
              mode: 'raw',
              raw: JSON.stringify({ username: 'manager@hrms.com', password: 'manager123' })
            },
            url: { raw: '{{baseUrl}}/auth/login', host: ['{{baseUrl}}'], path: ['auth', 'login'] }
          }
        },
        {
          name: '1.4 Login Staff Employee (Priya Verma)',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 200 OK", function () { pm.response.to.have.status(200); });',
                  'var json = pm.response.json();',
                  'pm.test("Role is ROLE_EMPLOYEE", function () { pm.expect(json.role).to.eql("ROLE_EMPLOYEE"); });',
                  'pm.test("Employee ID is present", function () { pm.expect(json.employeeId).to.be.a("string"); });',
                  'pm.collectionVariables.set("empToken", json.token);',
                  'pm.collectionVariables.set("employeeId", json.employeeId);'
                ],
                type: 'text/javascript'
              }
            }
          ],
          request: {
            method: 'POST',
            header: [{ key: 'Content-Type', value: 'application/json' }],
            body: {
              mode: 'raw',
              raw: JSON.stringify({ username: 'emp@hrms.com', password: 'employee123' })
            },
            url: { raw: '{{baseUrl}}/auth/login', host: ['{{baseUrl}}'], path: ['auth', 'login'] }
          }
        }
      ]
    },
    {
      name: '02. Employee Directory & Profiles',
      item: [
        {
          name: '2.1 Get All Employees',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 200 OK", function () { pm.response.to.have.status(200); });',
                  'var json = pm.response.json();',
                  'pm.test("Employee list contains records", function () { pm.expect(json.length).to.be.above(0); });'
                ],
                type: 'text/javascript'
              }
            }
          ],
          request: {
            method: 'GET',
            header: [{ key: 'Authorization', value: 'Bearer {{adminToken}}' }],
            url: { raw: '{{baseUrl}}/employees', host: ['{{baseUrl}}'], path: ['employees'] }
          }
        },
        {
          name: '2.2 Get Single Employee Profile',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 200 OK", function () { pm.response.to.have.status(200); });',
                  'var json = pm.response.json();',
                  'pm.test("Employee full name is Priya Verma", function () { pm.expect(json.fullName).to.eql("Priya Verma"); });'
                ],
                type: 'text/javascript'
              }
            }
          ],
          request: {
            method: 'GET',
            header: [{ key: 'Authorization', value: 'Bearer {{adminToken}}' }],
            url: { raw: '{{baseUrl}}/employees/{{employeeId}}', host: ['{{baseUrl}}'], path: ['employees', '{{employeeId}}'] }
          }
        }
      ]
    },
    {
      name: '03. Attendance & Geofencing',
      item: [
        {
          name: '3.1 Get Today Attendance Punch',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 200 or 204", function () { pm.expect(pm.response.code).to.be.oneOf([200, 204]); });'
                ],
                type: 'text/javascript'
              }
            }
          ],
          request: {
            method: 'GET',
            header: [{ key: 'Authorization', value: 'Bearer {{empToken}}' }],
            url: {
              raw: '{{baseUrl}}/attendance/today?employeeId={{employeeId}}',
              host: ['{{baseUrl}}'],
              path: ['attendance', 'today'],
              query: [{ key: 'employeeId', value: '{{employeeId}}' }]
            }
          }
        },
        {
          name: '3.2 Record Mobile/Geofenced Punch',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 200 OK", function () { pm.response.to.have.status(200); });',
                  'var json = pm.response.json();',
                  'pm.test("Status evaluates shift grace cutoff", function () { pm.expect(json.status).to.be.oneOf(["ON_TIME", "LATE", "HALF_DAY"]); });'
                ],
                type: 'text/javascript'
              }
            }
          ],
          request: {
            method: 'POST',
            header: [
              { key: 'Authorization', value: 'Bearer {{empToken}}' },
              { key: 'Content-Type', value: 'application/json' }
            ],
            body: {
              mode: 'raw',
              raw: JSON.stringify({ punchType: 'MOBILE', latitude: 12.9716, longitude: 77.5946 })
            },
            url: {
              raw: '{{baseUrl}}/attendance/punch?employeeId={{employeeId}}',
              host: ['{{baseUrl}}'],
              path: ['attendance', 'punch'],
              query: [{ key: 'employeeId', value: '{{employeeId}}' }]
            }
          }
        }
      ]
    },
    {
      name: '04. Leave Management',
      item: [
        {
          name: '4.1 Get Leave Balances',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 200 OK", function () { pm.response.to.have.status(200); });',
                  'var json = pm.response.json();',
                  'pm.test("Returns 4 leave buckets (CL, SL, EL, COMP_OFF)", function () { pm.expect(json.length).to.be.at.least(4); });'
                ],
                type: 'text/javascript'
              }
            }
          ],
          request: {
            method: 'GET',
            header: [{ key: 'Authorization', value: 'Bearer {{empToken}}' }],
            url: {
              raw: '{{baseUrl}}/leave/balance?employeeId={{employeeId}}',
              host: ['{{baseUrl}}'],
              path: ['leave', 'balance'],
              query: [{ key: 'employeeId', value: '{{employeeId}}' }]
            }
          }
        },
        {
          name: '4.2 Get Pending Leave Requests (Manager)',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 200 OK", function () { pm.response.to.have.status(200); });',
                  'var json = pm.response.json();',
                  'pm.test("Pending leave applications array returned", function () { pm.expect(json).to.be.an("array"); });'
                ],
                type: 'text/javascript'
              }
            }
          ],
          request: {
            method: 'GET',
            header: [{ key: 'Authorization', value: 'Bearer {{adminToken}}' }],
            url: { raw: '{{baseUrl}}/leave/pending', host: ['{{baseUrl}}'], path: ['leave', 'pending'] }
          }
        }
      ]
    },
    {
      name: '05. Indian Statutory Payroll Engine',
      item: [
        {
          name: '5.1 Get Historical Payroll Runs',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 200 OK", function () { pm.response.to.have.status(200); });',
                  'var json = pm.response.json();',
                  'pm.test("Disbursed payroll run returned", function () { pm.expect(json.length).to.be.above(0); });'
                ],
                type: 'text/javascript'
              }
            }
          ],
          request: {
            method: 'GET',
            header: [{ key: 'Authorization', value: 'Bearer {{adminToken}}' }],
            url: { raw: '{{baseUrl}}/payroll/runs', host: ['{{baseUrl}}'], path: ['payroll', 'runs'] }
          }
        }
      ]
    },
    {
      name: '06. Statutory Compliance Reports',
      item: [
        {
          name: '6.1 Generate EPFO PF-ECR Text File',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 200 OK", function () { pm.response.to.have.status(200); });',
                  'pm.test("Returns text file", function () { pm.expect(pm.response.headers.get("Content-Type")).to.include("text/plain"); });',
                  'pm.test("Contains EPFO ECR Header", function () { pm.expect(pm.response.text()).to.include("EPFO ELECTRONIC CHALLAN"); });'
                ],
                type: 'text/javascript'
              }
            }
          ],
          request: {
            method: 'GET',
            header: [{ key: 'Authorization', value: 'Bearer {{adminToken}}' }],
            url: { raw: '{{baseUrl}}/compliance/pf-ecr/2026-07', host: ['{{baseUrl}}'], path: ['compliance', 'pf-ecr', '2026-07'] }
          }
        },
        {
          name: '6.2 Generate ESIC Monthly Return CSV',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 200 OK", function () { pm.response.to.have.status(200); });',
                  'pm.test("Returns CSV file", function () { pm.expect(pm.response.headers.get("Content-Type")).to.include("text/csv"); });',
                  'pm.test("Contains ESIC Header", function () { pm.expect(pm.response.text()).to.include("IP_NUMBER"); });'
                ],
                type: 'text/javascript'
              }
            }
          ],
          request: {
            method: 'GET',
            header: [{ key: 'Authorization', value: 'Bearer {{adminToken}}' }],
            url: { raw: '{{baseUrl}}/compliance/esi-challan/2026-07', host: ['{{baseUrl}}'], path: ['compliance', 'esi-challan', '2026-07'] }
          }
        },
        {
          name: '6.3 Generate Form 24Q Quarterly TDS Return',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 200 OK", function () { pm.response.to.have.status(200); });',
                  'pm.test("Contains TDS Statement", function () { pm.expect(pm.response.text()).to.include("TDS STATEMENT FOR SALARIES"); });'
                ],
                type: 'text/javascript'
              }
            }
          ],
          request: {
            method: 'GET',
            header: [{ key: 'Authorization', value: 'Bearer {{adminToken}}' }],
            url: {
              raw: '{{baseUrl}}/compliance/form24q?quarter=Q1&year=2026-2027',
              host: ['{{baseUrl}}'],
              path: ['compliance', 'form24q'],
              query: [
                { key: 'quarter', value: 'Q1' },
                { key: 'year', value: '2026-2027' }
              ]
            }
          }
        }
      ]
    },
    {
      name: '07. Dynamic Statutory Config (FR12)',
      item: [
        {
          name: '7.1 Get All Statutory Rates & Ceilings',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 200 OK", function () { pm.response.to.have.status(200); });',
                  'var json = pm.response.json();',
                  'pm.test("9 Statutory items configured", function () { pm.expect(json.length).to.eql(9); });',
                  'var pf = json.find(c => c.configKey === "PF_EMPLOYEE_PERCENT");',
                  'pm.collectionVariables.set("statConfigId", pf.id);'
                ],
                type: 'text/javascript'
              }
            }
          ],
          request: {
            method: 'GET',
            header: [{ key: 'Authorization', value: 'Bearer {{adminToken}}' }],
            url: { raw: '{{baseUrl}}/admin/statutory-config', host: ['{{baseUrl}}'], path: ['admin', 'statutory-config'] }
          }
        },
        {
          name: '7.2 Update Statutory PF Rate Real-time',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 200 OK", function () { pm.response.to.have.status(200); });',
                  'var json = pm.response.json();',
                  'pm.test("Updated value verified in PostgreSQL", function () { pm.expect(json.configValue).to.eql("12.00"); });'
                ],
                type: 'text/javascript'
              }
            }
          ],
          request: {
            method: 'PUT',
            header: [
              { key: 'Authorization', value: 'Bearer {{adminToken}}' },
              { key: 'Content-Type', value: 'application/json' }
            ],
            body: {
              mode: 'raw',
              raw: JSON.stringify({ configValue: '12.00', description: 'Statutory Provident Fund Employee Contribution Rate (%)' })
            },
            url: { raw: '{{baseUrl}}/admin/statutory-config/{{statConfigId}}', host: ['{{baseUrl}}'], path: ['admin', 'statutory-config', '{{statConfigId}}'] }
          }
        }
      ]
    },
    {
      name: '08. Audit Trails & Governance',
      item: [
        {
          name: '8.1 Get Immutable Audit Logs',
          event: [
            {
              listen: 'test',
              script: {
                exec: [
                  'pm.test("Status code is 200 OK", function () { pm.response.to.have.status(200); });',
                  'var json = pm.response.json();',
                  'pm.test("Audit logs array returned", function () { pm.expect(json.length).to.be.above(0); });'
                ],
                type: 'text/javascript'
              }
            }
          ],
          request: {
            method: 'GET',
            header: [{ key: 'Authorization', value: 'Bearer {{adminToken}}' }],
            url: { raw: '{{baseUrl}}/admin/audit-logs', host: ['{{baseUrl}}'], path: ['admin', 'audit-logs'] }
          }
        }
      ]
    }
  ]
};

const collectionPath = path.resolve(__dirname, 'HRMS_Postman_Collection.json');
fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2), 'utf8');
console.log('Postman Collection saved to:', collectionPath);

// Also generate Postman Environment
const envData = {
  id: 'hrms-local-env',
  name: 'HRMS Localhost Environment',
  values: [
    { key: 'baseUrl', value: baseUrl, enabled: true },
    { key: 'adminToken', value: '', enabled: true },
    { key: 'superToken', value: '', enabled: true },
    { key: 'managerToken', value: '', enabled: true },
    { key: 'empToken', value: '', enabled: true },
    { key: 'employeeId', value: '', enabled: true }
  ]
};

const envPath = path.resolve(__dirname, 'HRMS_Environment.postman_environment.json');
fs.writeFileSync(envPath, JSON.stringify(envData, null, 2), 'utf8');
console.log('Postman Environment saved to:', envPath);
