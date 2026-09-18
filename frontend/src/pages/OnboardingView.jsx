import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  FileCheck, 
  Send, 
  FileSignature, 
  ShieldCheck, 
  Laptop, 
  CheckCircle2, 
  Plus,
  UserCheck
} from 'lucide-react';
import { api } from '../services/api';

export default function OnboardingView() {
  const [candidates, setCandidates] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('Staff Engineer');
  const [dept, setDept] = useState('Engineering');
  const [ctc, setCtc] = useState(1800000);
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadCandidates();
  }, []);

  async function loadCandidates() {
    try {
      setLoading(true);
      const list = await api.getCandidates();
      setCandidates(list || []);
    } catch (err) {
      console.error('Failed to load candidate onboarding list', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateCandidate(e) {
    e.preventDefault();
    try {
      await api.createCandidate({
        candidateName: name,
        email,
        phone,
        designation,
        departmentName: dept,
        ctc: parseFloat(ctc),
        joiningDate
      });
      setShowAddModal(false);
      setName('');
      setEmail('');
      setPhone('');
      loadCandidates();
    } catch (err) {
      alert('Failed to issue offer: ' + err.message);
    }
  }

  async function handleSimulateESign(id) {
    try {
      await api.simulateESign(id);
      loadCandidates();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  }

  async function handleVerifyDoc(id, type, val) {
    try {
      await api.verifyDoc(id, type, val);
      loadCandidates();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  }

  async function handleUpdateBgv(id, status) {
    try {
      await api.updateBgv(id, status);
      loadCandidates();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  }

  async function handleAllocateAssets(id, c) {
    try {
      await api.updateAssets(id, true, true, true);
      loadCandidates();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  }

  async function handleConvert(id) {
    try {
      await api.convertToEmployee(id);
      alert('Candidate successfully converted to permanent employee profile!');
      loadCandidates();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Candidate Onboarding Pipeline (FR1)</h1>
          <p className="page-subtitle">Manage pre-joining lifecycle, digital offer generation, Digio e-sign, BGV, and Day-1 provisioning</p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} />
          <span>Issue New Offer Letter</span>
        </button>
      </div>

      {/* Candidate Pipeline Table */}
      <div className="card">
        <div className="card-title">
          <UserPlus size={19} color="var(--primary)" />
          <span>Active Onboarding Tracker</span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Offer Details</th>
                <th>Digio E-Sign</th>
                <th>Document Verification</th>
                <th>BGV Status</th>
                <th>Day 1 Assets</th>
                <th>Convert to Emp</th>
              </tr>
            </thead>
            <tbody>
              {candidates.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No candidates currently in onboarding pipeline.
                  </td>
                </tr>
              ) : (
                candidates.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{c.candidateName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.email} · {c.phone}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{c.designation}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        ₹{c.ctc?.toLocaleString('en-IN')} LPA · {c.departmentName}
                      </div>
                    </td>
                    <td>
                      {c.esignStatus === 'SIGNED' ? (
                        <span className="badge badge-success">DIGITALLY SIGNED</span>
                      ) : (
                        <button 
                          className="btn btn-outline btn-sm"
                          onClick={() => handleSimulateESign(c.id)}
                        >
                          <FileSignature size={13} />
                          <span>Simulate E-Sign</span>
                        </button>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button 
                          className={`btn ${c.idProofSubmitted ? 'btn-success' : 'btn-secondary'} btn-sm`}
                          onClick={() => handleVerifyDoc(c.id, 'ID_PROOF', !c.idProofSubmitted)}
                          title="Click to toggle ID verification"
                        >
                          ID: {c.idProofSubmitted ? '✓' : '✗'}
                        </button>
                        <button 
                          className={`btn ${c.educationSubmitted ? 'btn-success' : 'btn-secondary'} btn-sm`}
                          onClick={() => handleVerifyDoc(c.id, 'EDUCATION', !c.educationSubmitted)}
                          title="Click to toggle Education verification"
                        >
                          Edu: {c.educationSubmitted ? '✓' : '✗'}
                        </button>
                      </div>
                    </td>
                    <td>
                      <select 
                        className="form-select"
                        value={c.bgvStatus}
                        onChange={(e) => handleUpdateBgv(c.id, e.target.value)}
                        style={{ padding: '4px 8px', fontSize: '0.78rem' }}
                      >
                        <option value="NOT_INITIATED">NOT_INITIATED</option>
                        <option value="INITIATED">INITIATED</option>
                        <option value="VERIFIED">VERIFIED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </td>
                    <td>
                      {c.laptopAllocated && c.accessCardAllocated ? (
                        <span className="badge badge-success">PROVISIONED</span>
                      ) : (
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleAllocateAssets(c.id, c)}
                        >
                          <Laptop size={13} />
                          <span>Allocate All</span>
                        </button>
                      )}
                    </td>
                    <td>
                      {c.offerStatus === 'JOINED' ? (
                        <span className="badge badge-success">EMPLOYEE ACTIVE</span>
                      ) : (
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => handleConvert(c.id)}
                        >
                          <UserCheck size={13} />
                          <span>Onboard Day 1</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Candidate Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontWeight: 700 }}>Generate Digital Offer Letter (FR1)</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateCandidate}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Candidate Full Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    required 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
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
                    <label className="form-label">Department</label>
                    <select 
                      className="form-select" 
                      value={dept} 
                      onChange={(e) => setDept(e.target.value)}
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Finance & Accounts">Finance & Accounts</option>
                      <option value="Product & Design">Product & Design</option>
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
                    <label className="form-label">Anticipated Date of Joining (DOJ)</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={joiningDate} 
                      onChange={(e) => setJoiningDate(e.target.value)}
                      required 
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Generate Offer & Send Digio Link</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
