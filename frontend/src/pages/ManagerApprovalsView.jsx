import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  Award, 
  LogOut, 
  Check, 
  X,
  FileText
} from 'lucide-react';
import { api } from '../services/api';

export default function ManagerApprovalsView({ currentUser }) {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [pendingRegs, setPendingRegs] = useState([]);
  const [appraisals, setAppraisals] = useState([]);
  const [exits, setExits] = useState([]);
  const [activeTab, setActiveTab] = useState('leaves'); // 'leaves', 'regularisations', 'appraisals', 'exits'
  const [loading, setLoading] = useState(true);

  // Appraisal rating modal
  const [selectedAppraisal, setSelectedAppraisal] = useState(null);
  const [mgrRating, setMgrRating] = useState(4.0);
  const [mgrFeedback, setMgrFeedback] = useState('Consistently delivers high quality features and collaborates well with the team.');

  const isHr = currentUser?.role === 'ROLE_HR_MANAGER' || currentUser?.role === 'ROLE_SUPER_ADMIN';

  useEffect(() => {
    loadApprovals();
  }, [currentUser]);

  async function loadApprovals() {
    try {
      setLoading(true);
      const [leaves, regs, apps, exitList] = await Promise.all([
        api.getPendingLeaves(isHr ? null : currentUser.employeeId),
        api.getPendingRegularisations(),
        api.getAppraisals('2025-2026'),
        api.getExits()
      ]);
      setPendingLeaves(leaves || []);
      setPendingRegs(regs || []);
      setAppraisals(apps || []);
      setExits(exitList || []);
    } catch (err) {
      console.error('Failed to load pending approvals', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleApproveLeave(id) {
    try {
      await api.approveLeave(id, 'Approved by reporting manager');
      loadApprovals();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  }

  async function handleRejectLeave(id) {
    try {
      await api.rejectLeave(id, 'Absence declined due to critical release milestone');
      loadApprovals();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  }

  async function handleApproveReg(id) {
    try {
      await api.approveRegularisation(id);
      loadApprovals();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  }

  async function handleRejectReg(id) {
    try {
      await api.rejectRegularisation(id);
      loadApprovals();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  }

  async function handleClearanceSign(exitId, dept) {
    try {
      await api.updateClearance(exitId, {
        department: dept,
        cleared: true,
        notes: 'Assets verified & surrendered'
      });
      loadApprovals();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  }

  async function handleSubmitManagerReview() {
    if (!selectedAppraisal) return;
    try {
      await api.submitManagerReview(selectedAppraisal.id, {
        rating: mgrRating,
        feedback: mgrFeedback
      });
      setSelectedAppraisal(null);
      loadApprovals();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Manager Approvals & Sign-Offs</h1>
          <p className="page-subtitle">Review team leave requests, attendance regularisations, appraisals, and exit clearances</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
        <button
          className={`btn ${activeTab === 'leaves' ? 'btn-primary' : 'btn-outline'} btn-sm`}
          onClick={() => setActiveTab('leaves')}
        >
          <Calendar size={15} />
          <span>Leave Requests ({pendingLeaves.length})</span>
        </button>

        <button
          className={`btn ${activeTab === 'regularisations' ? 'btn-primary' : 'btn-outline'} btn-sm`}
          onClick={() => setActiveTab('regularisations')}
        >
          <Clock size={15} />
          <span>Attendance Regularisations ({pendingRegs.length})</span>
        </button>

        <button
          className={`btn ${activeTab === 'appraisals' ? 'btn-primary' : 'btn-outline'} btn-sm`}
          onClick={() => setActiveTab('appraisals')}
        >
          <Award size={15} />
          <span>Team Appraisals ({appraisals.length})</span>
        </button>

        <button
          className={`btn ${activeTab === 'exits' ? 'btn-primary' : 'btn-outline'} btn-sm`}
          onClick={() => setActiveTab('exits')}
        >
          <LogOut size={15} />
          <span>Exit Clearances ({exits.length})</span>
        </button>
      </div>

      {/* 1. Leaves Tab */}
      {activeTab === 'leaves' && (
        <div className="card">
          <div className="card-title">
            <Calendar size={19} color="var(--primary)" />
            <span>Pending Team Leave Applications</span>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Dates</th>
                  <th>Duration</th>
                  <th>Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingLeaves.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      No pending leave applications in your queue! All caught up.
                    </td>
                  </tr>
                ) : (
                  pendingLeaves.map((l) => (
                    <tr key={l.id}>
                      <td>
                        <div style={{ fontWeight: 700 }}>{l.employee?.fullName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{l.employee?.designation}</div>
                      </td>
                      <td>
                        <span className="badge badge-info">{l.leaveType}</span>
                      </td>
                      <td>{l.fromDate} to {l.toDate}</td>
                      <td><strong>{l.days}</strong> days</td>
                      <td style={{ maxWidth: '280px', color: 'var(--text-secondary)' }}>{l.reason}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-success btn-sm" onClick={() => handleApproveLeave(l.id)}>
                            <Check size={14} />
                            <span>Approve</span>
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleRejectLeave(l.id)}>
                            <X size={14} />
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Regularisations Tab */}
      {activeTab === 'regularisations' && (
        <div className="card">
          <div className="card-title">
            <Clock size={19} color="var(--primary)" />
            <span>Pending Punch Regularisation Requests</span>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Punch Date</th>
                  <th>Requested Timing</th>
                  <th>Reason</th>
                  <th>Source</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingRegs.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      No pending attendance regularisations found.
                    </td>
                  </tr>
                ) : (
                  pendingRegs.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <div style={{ fontWeight: 700 }}>{r.employee?.fullName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.employee?.empCode}</div>
                      </td>
                      <td style={{ fontWeight: 600 }}>{r.workDate}</td>
                      <td>{r.inPunch} – {r.outPunch}</td>
                      <td style={{ maxWidth: '260px', color: 'var(--text-secondary)' }}>{r.regularisationReason}</td>
                      <td><span className="badge badge-neutral">{r.source}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-success btn-sm" onClick={() => handleApproveReg(r.id)}>
                            <Check size={14} />
                            <span>Approve</span>
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleRejectReg(r.id)}>
                            <X size={14} />
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Appraisals Tab */}
      {activeTab === 'appraisals' && (
        <div className="card">
          <div className="card-title">
            <Award size={19} color="var(--primary)" />
            <span>Team Annual Appraisal Reviews</span>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Year</th>
                  <th>Self Rating</th>
                  <th>Manager Rating</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appraisals.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      No appraisal records available for review.
                    </td>
                  </tr>
                ) : (
                  appraisals.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <div style={{ fontWeight: 700 }}>{a.employee?.fullName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.employee?.designation}</div>
                      </td>
                      <td>{a.appraisalYear}</td>
                      <td>{a.employeeRating ? `${a.employeeRating} / 5.0` : 'Pending Self'}</td>
                      <td>
                        <strong style={{ color: a.managerRating ? 'var(--primary)' : 'inherit' }}>
                          {a.managerRating ? `${a.managerRating} / 5.0` : 'Not Rated'}
                        </strong>
                      </td>
                      <td>
                        <span className={`badge ${a.status === 'CLOSED' ? 'badge-success' : 'badge-warning'}`}>
                          {a.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => { setSelectedAppraisal(a); setMgrRating(a.managerRating || 4.0); }}
                        >
                          Review & Rate
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Exit Clearances Tab */}
      {activeTab === 'exits' && (
        <div className="card">
          <div className="card-title">
            <LogOut size={19} color="var(--primary)" />
            <span>Departmental Clearances for Resigned Employees</span>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Last Working Day</th>
                  <th>IT Clearance</th>
                  <th>Admin Clearance</th>
                  <th>Finance Clearance</th>
                  <th>Sign-Off Action</th>
                </tr>
              </thead>
              <tbody>
                {exits.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      No employees currently in exit clearance workflow.
                    </td>
                  </tr>
                ) : (
                  exits.map((x) => (
                    <tr key={x.id}>
                      <td>
                        <div style={{ fontWeight: 700 }}>{x.employee?.fullName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{x.employee?.empCode}</div>
                      </td>
                      <td>{x.lastWorkingDay}</td>
                      <td><span className={`badge ${x.itClearance ? 'badge-success' : 'badge-warning'}`}>{x.itClearance ? 'CLEARED' : 'PENDING'}</span></td>
                      <td><span className={`badge ${x.adminClearance ? 'badge-success' : 'badge-warning'}`}>{x.adminClearance ? 'CLEARED' : 'PENDING'}</span></td>
                      <td><span className={`badge ${x.financeClearance ? 'badge-success' : 'badge-warning'}`}>{x.financeClearance ? 'CLEARED' : 'PENDING'}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {!x.itClearance && (
                            <button className="btn btn-outline btn-sm" onClick={() => handleClearanceSign(x.id, 'IT')}>
                              Clear IT
                            </button>
                          )}
                          {!x.adminClearance && (
                            <button className="btn btn-outline btn-sm" onClick={() => handleClearanceSign(x.id, 'ADMIN')}>
                              Clear Admin
                            </button>
                          )}
                          {!x.financeClearance && (
                            <button className="btn btn-outline btn-sm" onClick={() => handleClearanceSign(x.id, 'FINANCE')}>
                              Clear Finance
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedAppraisal && (
        <div className="modal-overlay" onClick={() => setSelectedAppraisal(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontWeight: 700 }}>
                Manager Performance Review: {selectedAppraisal.employee?.fullName}
              </h3>
              <button className="btn btn-outline btn-sm" onClick={() => setSelectedAppraisal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '18px', fontSize: '0.85rem' }}>
                <div><strong>Employee's Self Rating:</strong> {selectedAppraisal.employeeRating || 'N/A'} / 5.0</div>
                <div style={{ marginTop: '4px' }}><strong>Employee Comments:</strong> {selectedAppraisal.feedback || 'None provided'}</div>
              </div>

              <div className="form-group">
                <label className="form-label">Manager Rating (1.0 - 5.0 in 0.5 increments)</label>
                <select 
                  className="form-select" 
                  value={mgrRating} 
                  onChange={(e) => setMgrRating(parseFloat(e.target.value))}
                >
                  <option value="5.0">5.0 - Outstanding (Top 10%)</option>
                  <option value="4.5">4.5 - Exceeds Expectations Highly</option>
                  <option value="4.0">4.0 - Exceeds Expectations</option>
                  <option value="3.5">3.5 - Solid Performance</option>
                  <option value="3.0">3.0 - Meets Expectations</option>
                  <option value="2.5">2.5 - Needs Improvement / Partial</option>
                  <option value="2.0">2.0 - Below Expectations (PIP Suggested)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Manager Feedback & Appraisal Summary</label>
                <textarea 
                  className="form-textarea" 
                  rows={3} 
                  value={mgrFeedback} 
                  onChange={(e) => setMgrFeedback(e.target.value)}
                  placeholder="Provide structured feedback on leadership, project delivery, and goals..."
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedAppraisal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmitManagerReview}>Submit Manager Rating</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
