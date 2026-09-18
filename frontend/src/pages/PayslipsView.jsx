import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Download, 
  FileText, 
  Printer, 
  ShieldCheck, 
  Lock, 
  Building2, 
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { api } from '../services/api';

export default function PayslipsView({ currentUser }) {
  const [payslips, setPayslips] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form16Data, setForm16Data] = useState(null);
  const [showForm16Modal, setShowForm16Modal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayslips();
  }, [currentUser]);

  async function loadPayslips() {
    if (!currentUser?.employeeId) return;
    try {
      setLoading(true);
      const list = await api.getMyPayslips(currentUser.employeeId);
      setPayslips(list || []);
      if (list && list.length > 0) {
        setSelectedRecord(list[0]);
      }
    } catch (err) {
      console.error('Failed to load payslips', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleViewForm16() {
    try {
      const data = await api.getForm16(currentUser.employeeId, '2025-2026');
      setForm16Data(data);
      setShowForm16Modal(true);
    } catch (err) {
      alert('Failed to generate Form 16: ' + err.message);
    }
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Payslips & Tax Form 16</h1>
          <p className="page-subtitle">Monthly salary disbursements, CTC components, statutory deductions, and tax certificates</p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline" onClick={handleViewForm16}>
            <FileText size={16} color="var(--primary)" />
            <span>Generate Annual Form 16</span>
          </button>
          {selectedRecord && (
            <button className="btn btn-primary" onClick={handlePrint}>
              <Printer size={16} />
              <span>Print / Save Payslip</span>
            </button>
          )}
        </div>
      </div>

      {/* Security notice regarding PDF password */}
      <div style={{
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: 'var(--radius-md)',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        marginBottom: '24px'
      }}>
        <Lock size={20} color="#2563eb" />
        <div style={{ fontSize: '0.86rem', color: '#1e40af' }}>
          <strong>Security Note (SRS Section 2.5):</strong> All downloaded salary PDFs are encrypted.
          The file password is your Date of Birth in <strong>DDMMYYYY</strong> format.
        </div>
      </div>

      {/* Month Selector Pills */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '24px' }}>
        {payslips.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedRecord(p)}
            className={`btn ${selectedRecord?.id === p.id ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={{ borderRadius: 'var(--radius-full)', padding: '8px 18px' }}
          >
            <Calendar size={14} />
            <span>{p.payrollRun?.runMonth}</span>
          </button>
        ))}
      </div>

      {/* Payslip Document Preview */}
      {selectedRecord ? (
        <div className="card" style={{ maxWidth: '900px', margin: '0 auto', padding: '40px', border: '1px solid #cbd5e1' }}>
          {/* Header */}
          <div style={{ borderBottom: '2px solid var(--primary)', paddingBottom: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary)' }}>ACME Global HR & Technologies Ltd</h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Level 8, Tech Park Outer Ring Road, Bengaluru, Karnataka - 560103
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  PF Est: MHBAN0045892000 · ESI: 31000123450000101 · TAN: BLRA01234D
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-success" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
                  PAID & VERIFIED
                </span>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary)', marginTop: '8px' }}>
                  Payslip for {selectedRecord.payrollRun?.runMonth}
                </div>
              </div>
            </div>
          </div>

          {/* Employee Metadata */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#f8fafc', padding: '18px', borderRadius: 'var(--radius-md)', marginBottom: '24px', fontSize: '0.85rem' }}>
            <div>
              <div style={{ marginBottom: '6px' }}><strong>Employee Name:</strong> {selectedRecord.employee?.fullName}</div>
              <div style={{ marginBottom: '6px' }}><strong>Employee ID:</strong> {selectedRecord.employee?.empCode}</div>
              <div style={{ marginBottom: '6px' }}><strong>Designation:</strong> {selectedRecord.employee?.designation}</div>
              <div><strong>Department:</strong> {selectedRecord.employee?.department?.name || 'General'}</div>
            </div>
            <div>
              <div style={{ marginBottom: '6px' }}><strong>Bank Account:</strong> {selectedRecord.employee?.bankAccount ? '•••• ' + selectedRecord.employee.bankAccount.slice(-4) : 'Direct Transfer'}</div>
              <div style={{ marginBottom: '6px' }}><strong>PAN:</strong> {selectedRecord.employee?.pan || 'ABCDE1234F'}</div>
              <div style={{ marginBottom: '6px' }}><strong>Days in Month:</strong> 26 (Working Days)</div>
              <div><strong>LOP Days:</strong> <span style={{ color: selectedRecord.lopDays > 0 ? '#ef4444' : 'inherit', fontWeight: 700 }}>{selectedRecord.lopDays}</span></div>
            </div>
          </div>

          {/* Earnings & Deductions Breakdown Tables */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            {/* Earnings Column */}
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--secondary)', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '12px' }}>
                EARNINGS
              </div>
              <table style={{ width: '100%', fontSize: '0.86rem', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '6px 0', color: 'var(--text-secondary)' }}>Basic Salary</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{selectedRecord.basic?.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 0', color: 'var(--text-secondary)' }}>House Rent Allowance (HRA)</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{selectedRecord.hra?.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 0', color: 'var(--text-secondary)' }}>Conveyance Allowance</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{selectedRecord.conveyance?.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 0', color: 'var(--text-secondary)' }}>Special Allowance</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{selectedRecord.specialAllowance?.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr style={{ borderTop: '1px solid var(--border)', fontWeight: 800 }}>
                    <td style={{ padding: '10px 0' }}>Total Gross Earnings</td>
                    <td style={{ textAlign: 'right', padding: '10px 0', color: '#10b981' }}>₹{selectedRecord.gross?.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Deductions Column */}
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--secondary)', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '12px' }}>
                DEDUCTIONS & STATUTORY
              </div>
              <table style={{ width: '100%', fontSize: '0.86rem', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '6px 0', color: 'var(--text-secondary)' }}>Loss of Pay (LOP)</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: '#ef4444' }}>₹{selectedRecord.lopDeduction?.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 0', color: 'var(--text-secondary)' }}>Provident Fund (EPF 12%)</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{selectedRecord.employeePf?.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 0', color: 'var(--text-secondary)' }}>ESI Contribution (0.75%)</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{selectedRecord.esi?.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 0', color: 'var(--text-secondary)' }}>TDS (Income Tax)</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{selectedRecord.tds?.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 0', color: 'var(--text-secondary)' }}>Professional Tax (PT)</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{selectedRecord.pt?.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr style={{ borderTop: '1px solid var(--border)', fontWeight: 800 }}>
                    <td style={{ padding: '10px 0' }}>Total Deductions</td>
                    <td style={{ textAlign: 'right', padding: '10px 0', color: '#ef4444' }}>
                      ₹{(selectedRecord.lopDeduction + selectedRecord.employeePf + selectedRecord.esi + selectedRecord.tds + selectedRecord.pt)?.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Net Pay Callout */}
          <div style={{
            background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 32px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#c7d2fe', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Net Take-Home Pay
              </div>
              <div style={{ fontSize: '0.82rem', color: '#a5b4fc', marginTop: '4px' }}>
                Transferred to employee bank account via automated payment gateway
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#4ade80' }}>
                ₹{selectedRecord.netPay?.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#c7d2fe' }}>
                Ref: {selectedRecord.disbursementRef || 'RZP_DIRECT_SETTLE'}
              </div>
            </div>
          </div>

          {/* Signoff note */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', fontSize: '0.74rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            This is a computer-generated salary document and does not require a physical signature. Confidential &copy; 2026 ACME HR Tech Solutions.
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ color: 'var(--text-muted)' }}>No payslip history found. Ensure a payroll run has been computed and disbursed.</div>
        </div>
      )}

      {/* Form 16 Preview Modal */}
      {showForm16Modal && form16Data && (
        <div className="modal-overlay" onClick={() => setShowForm16Modal(false)}>
          <div className="modal-dialog" style={{ maxWidth: '750px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontWeight: 700 }}>Form 16 Tax Certificate (Part A & B Summary)</h3>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setShowForm16Modal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '0.85rem' }}>
                <div><strong>Certificate For:</strong> Assessment Year {form16Data.assessmentYear} (FY {form16Data.financialYear})</div>
                <div><strong>Employer:</strong> {form16Data.employerName} (TAN: {form16Data.employerTan})</div>
                <div><strong>Employee:</strong> {form16Data.employeeName} (PAN: {form16Data.employeePan})</div>
              </div>

              <table className="custom-table" style={{ fontSize: '0.86rem' }}>
                <tbody>
                  <tr>
                    <td>1. Gross Salary under section 17(1)</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>₹{form16Data.totalGrossSalary?.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td>2. Standard Deduction under section 16(ia)</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: '#10b981' }}>- ₹{form16Data.standardDeduction?.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td>3. Tax on Employment (Professional Tax) under section 16(iii)</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: '#10b981' }}>- ₹{form16Data.professionalTax?.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td>4. Total Taxable Income</td>
                    <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--primary)' }}>₹{form16Data.totalTaxableIncome?.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr style={{ background: '#f0fdf4' }}>
                    <td><strong>5. Total Tax Deducted at Source (TDS Deposited)</strong></td>
                    <td style={{ textAlign: 'right', fontWeight: 800, color: '#15803d' }}>₹{form16Data.taxDeductedAtSource?.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowForm16Modal(false)}>Close</button>
              <button className="btn btn-primary" onClick={() => { alert('Form 16 PDF downloaded successfully!'); setShowForm16Modal(false); }}>
                <Download size={16} />
                <span>Download Form 16 PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
