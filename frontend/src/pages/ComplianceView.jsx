import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  ShieldCheck, 
  FileText, 
  Calendar, 
  CheckCircle2,
  Building
} from 'lucide-react';
import { api } from '../services/api';

export default function ComplianceView() {
  const [selectedMonth, setSelectedMonth] = useState('2026-07');
  const [selectedQuarter, setSelectedQuarter] = useState('Q4');
  const [selectedYear, setSelectedYear] = useState('2025-2026');

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Statutory Compliance & Challan Hub (FR6)</h1>
          <p className="page-subtitle">Export official returns for EPFO (ECR), ESIC, Income Tax Department (Form 24Q), and State PT</p>
        </div>
      </div>

      {/* Month Filter Selector */}
      <div className="card" style={{ marginBottom: '24px', background: '#f8fafc' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <label className="form-label">Statutory Wage Month:</label>
            <input 
              type="month" 
              className="form-input" 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ width: 'auto' }}
            />
          </div>

          <div>
            <label className="form-label">TDS Quarter:</label>
            <select 
              className="form-select" 
              value={selectedQuarter} 
              onChange={(e) => setSelectedQuarter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="Q1">Q1 (Apr - Jun)</option>
              <option value="Q2">Q2 (Jul - Sep)</option>
              <option value="Q3">Q3 (Oct - Dec)</option>
              <option value="Q4">Q4 (Jan - Mar)</option>
            </select>
          </div>

          <div>
            <label className="form-label">Financial Year:</label>
            <select 
              className="form-select" 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="2025-2026">FY 2025-2026</option>
              <option value="2026-2027">FY 2026-2027</option>
            </select>
          </div>
        </div>
      </div>

      {/* Compliance Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* 1. EPFO ECR Return */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div className="metric-icon-box" style={{ background: '#e0e7ff', color: 'var(--primary)' }}>
              <Building size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>EPFO Electronic Challan (ECR)</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Employees' Provident Funds Act 1952</div>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Generates the hash-delimited (#) text return file for direct upload onto the EPFO Unified Employer Portal. Includes UAN, EPF, EPS, and EDLI wage splits.
          </p>

          <a 
            href={api.getPfEcrDownloadUrl(selectedMonth)} 
            target="_blank" 
            rel="noreferrer"
            className="btn btn-primary"
            style={{ width: '100%', textDecoration: 'none' }}
          >
            <Download size={16} />
            <span>Download ECR File ({selectedMonth})</span>
          </a>
        </div>

        {/* 2. ESIC Monthly Challan */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div className="metric-icon-box" style={{ background: '#ecfdf5', color: '#10b981' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>ESIC Monthly Return</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Employees' State Insurance Act 1948</div>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Export monthly ESI CSV upload format for wage earners under the ₹21,000 threshold. Calculates 0.75% employee and 3.25% employer shares.
          </p>

          <a 
            href={api.getEsiChallanDownloadUrl(selectedMonth)} 
            target="_blank" 
            rel="noreferrer"
            className="btn btn-success"
            style={{ width: '100%', textDecoration: 'none' }}
          >
            <Download size={16} />
            <span>Download ESIC CSV ({selectedMonth})</span>
          </a>
        </div>

        {/* 3. TDS Form 24Q Quarterly Return */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div className="metric-icon-box" style={{ background: '#fffbeb', color: '#f59e0b' }}>
              <FileText size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Income Tax Form 24Q</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Income Tax Act 1961 (TRACES / NSDL)</div>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Prepares salary TDS statement data formatted for quarterly e-TDS filing via TRACES/TIN utility. Includes PAN, taxable salary, and TDS deductions.
          </p>

          <a 
            href={api.getForm24qDownloadUrl(selectedQuarter, selectedYear)} 
            target="_blank" 
            rel="noreferrer"
            className="btn btn-outline"
            style={{ width: '100%', textDecoration: 'none' }}
          >
            <Download size={16} />
            <span>Export Form 24Q ({selectedQuarter})</span>
          </a>
        </div>
      </div>
    </div>
  );
}
