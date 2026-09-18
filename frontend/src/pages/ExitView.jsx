import React, { useState, useEffect } from 'react';
import { 
  LogOut, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Laptop, 
  KeyRound, 
  DollarSign, 
  FileSignature,
  Building
} from 'lucide-react';
import { api } from '../services/api';

export default function ExitView({ currentUser }) {
  const [exitRecord, setExitRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResignModal, setShowResignModal] = useState(false);
  const [resignDate, setResignDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('Career advancement opportunities');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadExitData();
  }, [currentUser]);

  async function loadExitData() {
    if (!currentUser?.employeeId) return;
    try {
      setLoading(true);
      const rec = await api.getExitByEmployee(currentUser.employeeId);
      setExitRecord(rec || null);
    } catch (err) {
      console.error('Failed to load exit details', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleResignSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const saved = await api.submitResignation(currentUser.employeeId, {
        resignationDate: resignDate,
        reason: reason
      });
      setExitRecord(saved);
      setSuccessMsg('Resignation submitted successfully. Department clearances initiated.');
      setShowResignModal(false);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit resignation');
    }
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Exit Management & Clearance</h1>
          <p className="page-subtitle">Submit resignation, track departmental clearances, exit interviews, and FnF settlement</p>
        </div>

        {!exitRecord && (
          <button className="btn btn-danger" onClick={() => setShowResignModal(true)}>
            <LogOut size={16} />
            <span>Submit Resignation</span>
          </button>
        )}
      </div>

      {successMsg && (
        <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', color: '#059669', padding: '14px 20px', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={20} />
          <strong>{successMsg}</strong>
        </div>
      )}

      {exitRecord ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Status Banner */}
          <div className="card" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="badge badge-warning" style={{ marginBottom: '8px' }}>
                  {exitRecord.exitType} IN PROGRESS
                </span>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--secondary)' }}>
                  Notice Period Active (60 Days Standard)
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Submitted on: <strong>{exitRecord.resignationDate}</strong> · Confirmed Last Working Day (LWD): <strong>{exitRecord.lastWorkingDay}</strong>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>FnF Status</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: exitRecord.fnfStatus === 'PAID' ? '#10b981' : '#f59e0b' }}>
                  {exitRecord.fnfStatus}
                </div>
              </div>
            </div>
          </div>

          {/* Departmental Clearances Checklist (SRS Section 4.10) */}
          <div className="card">
            <div className="card-title">
              <CheckCircle2 size={19} color="var(--primary)" />
              <span>Parallel Departmental Clearance Checklist</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              {/* IT Clearance */}
              <div style={{ padding: '18px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: exitRecord.itClearance ? '#f0fdf4' : '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <Laptop size={20} color={exitRecord.itClearance ? '#16a34a' : '#64748b'} />
                  <span className={`badge ${exitRecord.itClearance ? 'badge-success' : 'badge-neutral'}`}>
                    {exitRecord.itClearance ? 'CLEARED' : 'PENDING'}
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>IT Clearance</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Laptop, accessories & corporate VPN deactivation
                </div>
              </div>

              {/* Admin Clearance */}
              <div style={{ padding: '18px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: exitRecord.adminClearance ? '#f0fdf4' : '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <KeyRound size={20} color={exitRecord.adminClearance ? '#16a34a' : '#64748b'} />
                  <span className={`badge ${exitRecord.adminClearance ? 'badge-success' : 'badge-neutral'}`}>
                    {exitRecord.adminClearance ? 'CLEARED' : 'PENDING'}
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Admin Clearance</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  RFID access card & parking tag return
                </div>
              </div>

              {/* Finance Clearance */}
              <div style={{ padding: '18px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: exitRecord.financeClearance ? '#f0fdf4' : '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <DollarSign size={20} color={exitRecord.financeClearance ? '#16a34a' : '#64748b'} />
                  <span className={`badge ${exitRecord.financeClearance ? 'badge-success' : 'badge-neutral'}`}>
                    {exitRecord.financeClearance ? 'CLEARED' : 'PENDING'}
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Finance Clearance</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Travel claims, advances & corporate card dues
                </div>
              </div>

              {/* HR Clearance */}
              <div style={{ padding: '18px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: exitRecord.hrClearance ? '#f0fdf4' : '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <FileSignature size={20} color={exitRecord.hrClearance ? '#16a34a' : '#64748b'} />
                  <span className={`badge ${exitRecord.hrClearance ? 'badge-success' : 'badge-neutral'}`}>
                    {exitRecord.hrClearance ? 'CLEARED' : 'PENDING'}
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>HR Sign-off</div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Exit interview & experience letter release
                </div>
              </div>
            </div>
          </div>

          {/* FnF Summary Card */}
          <div className="card">
            <div className="card-title">
              <DollarSign size={19} color="#10b981" />
              <span>Full & Final (FnF) Settlement Statement</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: '#f8fafc', padding: '20px', borderRadius: 'var(--radius-md)' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  FnF Settlement Total
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '4px' }}>
                  ₹{exitRecord.fnfAmount ? exitRecord.fnfAmount.toLocaleString('en-IN') : 'Calculation in progress'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Includes: Unpaid days + Unused EL encashment - any pending recoveries
                </div>
              </div>

              <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '20px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  Compliance SLA
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, marginTop: '4px' }}>
                  Completed within 45 days of LWD (Payment of Wages Act)
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Relieving & Experience Letter e-signed and sent to official email on Day of Exit
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <Building size={48} color="var(--primary)" style={{ margin: '0 auto 16px', opacity: 0.8 }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No Active Exit or Resignation</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '8px auto 20px', fontSize: '0.88rem' }}>
            You are currently in ACTIVE employment status. If you wish to initiate a formal resignation, you can click the button below.
          </p>
          <button className="btn btn-danger" onClick={() => setShowResignModal(true)}>
            Submit Resignation Request
          </button>
        </div>
      )}

      {/* Resignation Modal */}
      {showResignModal && (
        <div className="modal-overlay" onClick={() => setShowResignModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontWeight: 700, color: '#dc2626' }}>Submit Formal Resignation</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setShowResignModal(false)}>✕</button>
            </div>
            <form onSubmit={handleResignSubmit}>
              <div className="modal-body">
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '18px', fontSize: '0.84rem', color: '#991b1b' }}>
                  <strong>Notice Period Terms:</strong> Your employment contract specifies a mandatory notice period of <strong>60 days</strong>. Last Working Day will be automatically scheduled.
                </div>

                <div className="form-group">
                  <label className="form-label">Effective Resignation Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={resignDate} 
                    onChange={(e) => setResignDate(e.target.value)}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Reason for Leaving</label>
                  <select 
                    className="form-select" 
                    value={reason} 
                    onChange={(e) => setReason(e.target.value)}
                  >
                    <option value="Career advancement / new opportunity">Career advancement / new opportunity</option>
                    <option value="Higher studies / research">Higher studies / research</option>
                    <option value="Personal / family commitments">Personal / family commitments</option>
                    <option value="Relocation / health reasons">Relocation / health reasons</option>
                    <option value="Entrepreneurship / freelance">Entrepreneurship / freelance</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowResignModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-danger">Confirm & Submit Resignation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
