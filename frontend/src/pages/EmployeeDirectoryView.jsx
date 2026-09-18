import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  User, 
  Briefcase, 
  Building, 
  CreditCard, 
  ShieldCheck, 
  Mail, 
  Phone
} from 'lucide-react';
import { api } from '../services/api';

export default function EmployeeDirectoryView() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state for new employee
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('');
  const [grade, setGrade] = useState('L2');
  const [ctc, setCtc] = useState(1000000);
  const [pan, setPan] = useState('ABCDE1234F');
  const [aadhaar, setAadhaar] = useState('XXXX-XXXX-1234');
  const [bankAccount, setBankAccount] = useState('1234567890');
  const [ifsc, setIfsc] = useState('HDFC0001234');

  useEffect(() => {
    loadEmployees();
  }, [search]);

  async function loadEmployees() {
    try {
      setLoading(true);
      const list = await api.getEmployees(search);
      setEmployees(list || []);
    } catch (err) {
      console.error('Failed to load employees', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddEmployee(e) {
    e.preventDefault();
    try {
      await api.createEmployee({
        firstName,
        lastName,
        email,
        phone,
        designation,
        grade,
        ctc: parseFloat(ctc),
        pan,
        aadhaarMasked: aadhaar,
        bankAccount,
        ifsc,
        bankName: 'HDFC Bank',
        employmentType: 'PERMANENT',
        status: 'ACTIVE'
      });
      setShowAddModal(false);
      loadEmployees();
    } catch (err) {
      alert('Failed to create employee: ' + err.message);
    }
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Employee Master Directory (FR2)</h1>
          <p className="page-subtitle">Organizational profiles, statutory IDs, bank details, and employment contract master</p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '14px' }} />
        <input 
          type="text" 
          className="form-input" 
          placeholder="Search employees by name, employee code, designation, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingLeft: '44px', height: '46px', fontSize: '0.92rem' }}
        />
      </div>

      {/* Directory Table */}
      <div className="card">
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Emp Code</th>
                <th>Employee Name</th>
                <th>Designation & Dept</th>
                <th>Grade</th>
                <th>Employment Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No employees matching search criteria.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id}>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{emp.empCode}</td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{emp.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.email}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{emp.designation}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {emp.department?.name || 'Unassigned'}
                      </div>
                    </td>
                    <td><span className="badge badge-neutral">{emp.grade || 'L2'}</span></td>
                    <td><span className="badge badge-info">{emp.employmentType}</span></td>
                    <td>
                      <span className={`badge ${
                        emp.status === 'ACTIVE' ? 'badge-success' :
                        emp.status === 'NOTICE_PERIOD' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => setSelectedEmp(emp)}
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Detail Drawer Modal */}
      {selectedEmp && (
        <div className="modal-overlay" onClick={() => setSelectedEmp(null)}>
          <div className="modal-dialog" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5, #818cf8)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                  {selectedEmp.firstName?.charAt(0)}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontWeight: 800 }}>{selectedEmp.fullName}</h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{selectedEmp.empCode} · {selectedEmp.designation}</div>
                </div>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setSelectedEmp(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#f8fafc', padding: '18px', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>OFFICIAL CONTACT</div>
                  <div style={{ marginTop: '4px', fontSize: '0.88rem' }}>{selectedEmp.email}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{selectedEmp.phone || '+91 98765 43210'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>DEPARTMENT & REPORTING</div>
                  <div style={{ marginTop: '4px', fontSize: '0.88rem' }}>{selectedEmp.department?.name || 'General'}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Manager: {selectedEmp.manager?.fullName || 'Senior Leadership'}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '18px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>STATUTORY IDS (ENCRYPTED REST)</div>
                  <div style={{ marginTop: '4px', fontSize: '0.85rem' }}>PAN: <strong>{selectedEmp.pan || 'ABCDE1234F'}</strong></div>
                  <div style={{ fontSize: '0.85rem' }}>Aadhaar: <strong>{selectedEmp.aadhaarMasked || 'XXXX-XXXX-1234'}</strong></div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>PAYROLL & BANK DETAILS</div>
                  <div style={{ marginTop: '4px', fontSize: '0.85rem' }}>Bank: <strong>{selectedEmp.bankName || 'HDFC Bank'}</strong></div>
                  <div style={{ fontSize: '0.85rem' }}>Account: <strong>{selectedEmp.bankAccount || '•••• 5012'}</strong> (IFSC: {selectedEmp.ifsc || 'HDFC0001234'})</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 18px', background: '#eef2ff', borderRadius: 'var(--radius-md)', color: '#312e81' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Annual Fixed CTC</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>₹{selectedEmp.ctc?.toLocaleString('en-IN')}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Active Tax Regime</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>{selectedEmp.taxRegime} REGIME</div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedEmp(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontWeight: 700 }}>Add Employee to Master (FR2)</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddEmployee}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Official Email</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input 
                      type="tel" 
                      className="form-input" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Designation</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={designation} 
                      onChange={(e) => setDesignation(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Grade</label>
                    <select 
                      className="form-select" 
                      value={grade} 
                      onChange={(e) => setGrade(e.target.value)}
                    >
                      <option value="L1">L1 (Junior / Associate)</option>
                      <option value="L2">L2 (Mid-Level Engineer)</option>
                      <option value="L3">L3 (Senior Engineer / Lead)</option>
                      <option value="M1">M1 (Engineering Manager)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Annual CTC (INR)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={ctc} 
                      onChange={(e) => setCtc(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">PAN Card Number</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={pan} 
                      onChange={(e) => setPan(e.target.value)}
                      required 
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Employee Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
