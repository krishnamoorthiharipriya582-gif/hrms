import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Coins, 
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { api } from '../services/api';

export default function LeaveView({ currentUser }) {
  const [balances, setBalances] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [encashment, setEncashment] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [leaveType, setLeaveType] = useState('CL');
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [days, setDays] = useState(1);
  const [reason, setReason] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    loadLeaveData();
  }, [currentUser]);

  async function loadLeaveData() {
    if (!currentUser?.employeeId) return;
    try {
      setLoading(true);
      const [bal, myLeaves, enc] = await Promise.all([
        api.getBalances(currentUser.employeeId),
        api.getMyLeaves(currentUser.employeeId),
        api.getEncashment(currentUser.employeeId)
      ]);
      setBalances(bal || []);
      setLeaves(myLeaves || []);
      setEncashment(enc || null);
    } catch (err) {
      console.error('Failed to load leave details', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleApplySubmit(e) {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    try {
      await api.applyLeave(currentUser.employeeId, {
        leaveType,
        fromDate,
        toDate,
        days: parseFloat(days),
        reason
      });

      setFormSuccess('Leave application submitted successfully! Your manager has been notified.');
      setTimeout(() => {
        setShowApplyModal(false);
        loadLeaveData();
      }, 1500);
    } catch (err) {
      setFormError(err.message || 'Failed to submit leave application');
    }
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Leave Management</h1>
          <p className="page-subtitle">Track your leave balances, submit absence requests, and calculate EL encashment</p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowApplyModal(true)}>
          <Plus size={16} />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Leave Balance Cards */}
      <div className="metrics-grid">
        {balances.map((b) => {
          const available = (b.openingBalance + b.accrued - b.consumed - b.lapsed).toFixed(1);
          return (
            <div className="metric-card" key={b.id || b.leaveType}>
              <div className="metric-icon-box" style={{ 
                background: b.leaveType === 'CL' ? '#e0e7ff' : b.leaveType === 'SL' ? '#fef3c7' : '#dcfce7',
                color: b.leaveType === 'CL' ? '#4338ca' : b.leaveType === 'SL' ? '#d97706' : '#15803d'
              }}>
                <Calendar size={24} />
              </div>
              <div>
                <div className="metric-label">{b.leaveType} Available</div>
                <div className="metric-value">{available} <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>days</span></div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Opening: {b.openingBalance} · Consumed: {b.consumed}
                </div>
              </div>
            </div>
          );
        })}

        {/* Encashment preview card */}
        {encashment && (
          <div className="metric-card">
            <div className="metric-icon-box" style={{ background: '#fdf2f8', color: '#db2777' }}>
              <Coins size={24} />
            </div>
            <div>
              <div className="metric-label">Year-End EL Encashment</div>
              <div className="metric-value">₹{encashment.encashmentAmount?.toLocaleString('en-IN') || 0}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {encashment.unusedEL} EL days @ ₹{encashment.dailyBasic}/day basic
              </div>
            </div>
          </div>
        )}
      </div>

      {/* My Leave Applications History */}
      <div className="card">
        <div className="card-title">
          <Clock size={19} color="var(--primary)" />
          <span>My Leave Applications History</span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Duration</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Manager Comments</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No leave applications recorded yet. Click "Apply for Leave" to create a new request.
                  </td>
                </tr>
              ) : (
                leaves.map((l) => (
                  <tr key={l.id}>
                    <td style={{ fontWeight: 700 }}>{l.leaveType}</td>
                    <td>{l.fromDate}</td>
                    <td>{l.toDate}</td>
                    <td>{l.days} {l.days === 1 ? 'day' : 'days'}</td>
                    <td style={{ maxWidth: '280px', color: 'var(--text-secondary)' }}>{l.reason}</td>
                    <td>
                      <span className={`badge ${
                        l.status === 'APPROVED' ? 'badge-success' :
                        l.status === 'PENDING' ? 'badge-warning' : 'badge-danger'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {l.managerComments || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontWeight: 700 }}>Apply for Leave</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setShowApplyModal(false)}>✕</button>
            </div>
            <form onSubmit={handleApplySubmit}>
              <div className="modal-body">
                {formError && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '0.85rem' }}>
                    {formError}
                  </div>
                )}
                {formSuccess && (
                  <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', color: '#059669', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '0.85rem' }}>
                    {formSuccess}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Leave Type</label>
                  <select 
                    className="form-select" 
                    value={leaveType} 
                    onChange={(e) => setLeaveType(e.target.value)}
                  >
                    <option value="CL">Casual Leave (CL)</option>
                    <option value="SL">Sick Leave (SL)</option>
                    <option value="EL">Earned Leave (EL)</option>
                    <option value="COMP_OFF">Compensatory Off (Comp-off)</option>
                    <option value="MATERNITY">Maternity Leave (ML)</option>
                    <option value="PATERNITY">Paternity Leave (PL)</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">From Date</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={fromDate} 
                      onChange={(e) => setFromDate(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">To Date</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={toDate} 
                      onChange={(e) => setToDate(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Total Days Requested</label>
                  <input 
                    type="number" 
                    step="0.5" 
                    min="0.5" 
                    max="90" 
                    className="form-input" 
                    value={days} 
                    onChange={(e) => setDays(e.target.value)}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Reason / Work Handover Details</label>
                  <textarea 
                    className="form-textarea" 
                    rows={3} 
                    value={reason} 
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Specify reason for leave and any colleague covering urgent tasks..."
                    required
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowApplyModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
