import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Play, 
  CheckCircle2, 
  Lock, 
  Send, 
  FileSpreadsheet, 
  AlertCircle, 
  Clock, 
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { api } from '../services/api';

export default function PayrollProcessingView({ currentUser }) {
  const [runs, setRuns] = useState([]);
  const [selectedRun, setSelectedRun] = useState(null);
  const [records, setRecords] = useState([]);
  const [targetMonth, setTargetMonth] = useState('2026-08');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadPayrollRuns();
  }, []);

  async function loadPayrollRuns() {
    try {
      setLoading(true);
      const list = await api.getRuns();
      setRuns(list || []);
      if (list && list.length > 0) {
        handleSelectRun(list[list.length - 1]);
      }
    } catch (err) {
      console.error('Failed to load payroll runs', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectRun(run) {
    setSelectedRun(run);
    try {
      const recs = await api.getRecords(run.id);
      setRecords(recs || []);
    } catch (err) {
      console.error('Failed to load records for run', err);
    }
  }

  async function handleInitiateRun() {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const newRun = await api.initiateRun(targetMonth);
      setSuccessMsg(`Payroll computation for ${targetMonth} completed successfully! Review records below.`);
      loadPayrollRuns();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to initiate payroll run');
    }
  }

  async function handleApproveRun(id) {
    setErrorMsg('');
    try {
      await api.approveRun(id);
      setSuccessMsg('Payroll approved and locked! Ready for disbursement.');
      loadPayrollRuns();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to approve payroll');
    }
  }

  async function handleDisburseRun(id) {
    setErrorMsg('');
    try {
      await api.disburseRun(id);
      setSuccessMsg('Salary batch disbursement initiated via Razorpay Payouts! Net pays distributed.');
      loadPayrollRuns();
    } catch (err) {
      setErrorMsg(err.message || 'Disbursement failed');
    }
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Monthly Payroll Processing (FR5)</h1>
          <p className="page-subtitle">Statutory PF, ESI, TDS, LOP deductions, CFO/Admin approval lock, and Razorpay Payouts</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input 
            type="month" 
            className="form-input" 
            value={targetMonth} 
            onChange={(e) => setTargetMonth(e.target.value)}
            style={{ width: 'auto' }}
          />
          <button className="btn btn-primary" onClick={handleInitiateRun}>
            <Play size={16} />
            <span>Compute Payroll</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '14px 20px', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertCircle size={20} />
          <strong>{errorMsg}</strong>
        </div>
      )}

      {successMsg && (
        <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', color: '#059669', padding: '14px 20px', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={20} />
          <strong>{successMsg}</strong>
        </div>
      )}

      {/* 4-Step Wizard Indicator (Design Constraint 5.7) */}
      <div className="card" style={{ marginBottom: '24px', background: '#f8fafc' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', textAlign: 'center' }}>
          {/* Step 1: Compute */}
          <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: selectedRun ? '#ecfdf5' : '#fff', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: selectedRun ? '#059669' : 'var(--text-muted)' }}>STEP 1</div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: selectedRun ? '#059669' : 'inherit' }}>Compute Gross & LOP</div>
          </div>

          {/* Step 2: Review */}
          <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: selectedRun ? '#ecfdf5' : '#fff', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: selectedRun ? '#059669' : 'var(--text-muted)' }}>STEP 2</div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: selectedRun ? '#059669' : 'inherit' }}>Audit & Review</div>
          </div>

          {/* Step 3: Approve */}
          <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: ['APPROVED', 'DISBURSED'].includes(selectedRun?.status) ? '#ecfdf5' : '#fff', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: ['APPROVED', 'DISBURSED'].includes(selectedRun?.status) ? '#059669' : 'var(--text-muted)' }}>STEP 3</div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: ['APPROVED', 'DISBURSED'].includes(selectedRun?.status) ? '#059669' : 'inherit' }}>HR / CFO Approval</div>
          </div>

          {/* Step 4: Disburse */}
          <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: selectedRun?.status === 'DISBURSED' ? '#ecfdf5' : '#fff', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: selectedRun?.status === 'DISBURSED' ? '#059669' : 'var(--text-muted)' }}>STEP 4</div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: selectedRun?.status === 'DISBURSED' ? '#059669' : 'inherit' }}>Bank Disbursement</div>
          </div>
        </div>
      </div>

      {/* Selected Run Overview Banner */}
      {selectedRun && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                  Payroll Run: {selectedRun.runMonth}
                </h2>
                <span className={`badge ${
                  selectedRun.status === 'DISBURSED' ? 'badge-success' :
                  selectedRun.status === 'APPROVED' ? 'badge-info' : 'badge-warning'
                }`}>
                  {selectedRun.status}
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Initiated by {selectedRun.initiatedBy || 'HR Admin'} · Run Date: {new Date(selectedRun.runDate).toLocaleString('en-IN')}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {selectedRun.status === 'PENDING_APPROVAL' && (
                <button 
                  className="btn btn-primary"
                  onClick={() => handleApproveRun(selectedRun.id)}
                >
                  <Lock size={15} />
                  <span>Approve & Lock Payroll</span>
                </button>
              )}

              {selectedRun.status === 'APPROVED' && (
                <button 
                  className="btn btn-success"
                  onClick={() => handleDisburseRun(selectedRun.id)}
                >
                  <Send size={15} />
                  <span>Disburse via Razorpay Batch</span>
                </button>
              )}

              {selectedRun.status === 'DISBURSED' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>
                  <ShieldCheck size={20} />
                  <span>Disbursement Complete & Locked</span>
                </div>
              )}
            </div>
          </div>

          {/* Run Metrics Totals */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL GROSS</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--secondary)' }}>
                ₹{selectedRun.totalGross?.toLocaleString('en-IN')}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NET TAKE-HOME</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>
                ₹{selectedRun.totalNet?.toLocaleString('en-IN')}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>EPFO PF DEDUCTION</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
                ₹{selectedRun.totalPf?.toLocaleString('en-IN')}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL TDS WITHHELD</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b' }}>
                ₹{selectedRun.totalTds?.toLocaleString('en-IN')}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ESIC DEDUCTIONS</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#6366f1' }}>
                ₹{selectedRun.totalEsi?.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Per-Employee Payroll Register Table */}
      <div className="card">
        <div className="card-title">
          <FileSpreadsheet size={19} color="var(--primary)" />
          <span>Employee Salary Register (Computed Components)</span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Emp Code</th>
                <th>Name</th>
                <th>Gross</th>
                <th>Basic (40%)</th>
                <th>LOP Days</th>
                <th>LOP Ded.</th>
                <th>PF (12%)</th>
                <th>ESI</th>
                <th>TDS</th>
                <th>PT</th>
                <th>Net Salary</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan={12} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No records found for this payroll run. Click "Compute Payroll" to generate.
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 700 }}>{r.employee?.empCode}</td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{r.employee?.fullName}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{r.employee?.designation}</div>
                    </td>
                    <td>₹{r.gross?.toLocaleString('en-IN')}</td>
                    <td>₹{r.basic?.toLocaleString('en-IN')}</td>
                    <td style={{ color: r.lopDays > 0 ? '#ef4444' : 'inherit', fontWeight: 700 }}>{r.lopDays}</td>
                    <td style={{ color: r.lopDeduction > 0 ? '#ef4444' : 'inherit' }}>₹{r.lopDeduction?.toLocaleString('en-IN')}</td>
                    <td>₹{r.employeePf?.toLocaleString('en-IN')}</td>
                    <td>₹{r.esi?.toLocaleString('en-IN')}</td>
                    <td>₹{r.tds?.toLocaleString('en-IN')}</td>
                    <td>₹{r.pt?.toLocaleString('en-IN')}</td>
                    <td style={{ fontWeight: 800, color: '#10b981' }}>₹{r.netPay?.toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`badge ${r.disbursementStatus === 'PAID' ? 'badge-success' : 'badge-warning'}`}>
                        {r.disbursementStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
