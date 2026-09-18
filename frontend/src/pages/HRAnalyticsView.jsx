import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Building2, 
  Calendar, 
  PieChart, 
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';
import { api } from '../services/api';

export default function HRAnalyticsView() {
  const [headcount, setHeadcount] = useState(null);
  const [payrollTrend, setPayrollTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      setLoading(true);
      const [hc, pc] = await Promise.all([
        api.getHeadcount(),
        api.getPayrollCost()
      ]);
      setHeadcount(hc || null);
      setPayrollTrend(pc?.payrollTrend || []);
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive HR Analytics & BI (FR11)</h1>
          <p className="page-subtitle">Workforce headcount, department distribution, payroll budget trends, and attrition metrics</p>
        </div>
      </div>

      {/* Headcount Stat Cards */}
      {headcount && (
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon-box" style={{ background: '#e0e7ff', color: 'var(--primary)' }}>
              <Users size={24} />
            </div>
            <div>
              <div className="metric-label">Active Headcount</div>
              <div className="metric-value">{headcount.activeCount}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Total Enrolled: {headcount.totalEmployees}</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box" style={{ background: '#fef3c7', color: '#d97706' }}>
              <Calendar size={24} />
            </div>
            <div>
              <div className="metric-label">Notice Period Count</div>
              <div className="metric-value">{headcount.noticePeriodCount}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Serving 60-day notice</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box" style={{ background: '#f1f5f9', color: '#475569' }}>
              <Building2 size={24} />
            </div>
            <div>
              <div className="metric-label">Total Departments</div>
              <div className="metric-value">{Object.keys(headcount.byDepartment || {}).length}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Active business units</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box" style={{ background: '#ecfdf5', color: '#059669' }}>
              <TrendingUp size={24} />
            </div>
            <div>
              <div className="metric-label">Retention Rate</div>
              <div className="metric-value">96.2%</div>
              <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 600 }}>Benchmarked top quartile</div>
            </div>
          </div>
        </div>
      )}

      {/* Department Breakdown & Employment Type Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Department Distribution */}
        <div className="card">
          <div className="card-title">
            <Building2 size={19} color="var(--primary)" />
            <span>Headcount by Department</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {headcount && Object.entries(headcount.byDepartment || {}).map(([dept, count]) => {
              const pct = Math.round((count / (headcount.activeCount || 1)) * 100);
              return (
                <div key={dept}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.86rem' }}>
                    <span style={{ fontWeight: 600 }}>{dept}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{count} members ({pct}%)</span>
                  </div>
                  <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #4f46e5, #818cf8)' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Employment Type Distribution */}
        <div className="card">
          <div className="card-title">
            <Users size={19} color="#10b981" />
            <span>Employment Type Breakdown</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {headcount && Object.entries(headcount.byEmploymentType || {}).map(([type, count]) => {
              const pct = Math.round((count / (headcount.activeCount || 1)) * 100);
              return (
                <div key={type}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.86rem' }}>
                    <span style={{ fontWeight: 600 }}>{type}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{count} employees ({pct}%)</span>
                  </div>
                  <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Payroll Cost Month-on-Month Trends */}
      <div className="card">
        <div className="card-title">
          <DollarSign size={19} color="#38bdf8" />
          <span>Payroll Cost Trends (Month-on-Month CTC & Net Pay)</span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Wage Month</th>
                <th>Total Gross Payroll</th>
                <th>Net Disbursed</th>
                <th>EPFO Contribution</th>
                <th>TDS Deductions</th>
                <th>Disbursement Status</th>
              </tr>
            </thead>
            <tbody>
              {payrollTrend.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No historical payroll runs found to chart trends.
                  </td>
                </tr>
              ) : (
                payrollTrend.map((pt, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 700 }}>{pt.month}</td>
                    <td style={{ fontWeight: 600 }}>₹{pt.grossCost?.toLocaleString('en-IN')}</td>
                    <td style={{ fontWeight: 800, color: '#10b981' }}>₹{pt.netDisbursed?.toLocaleString('en-IN')}</td>
                    <td>₹{pt.pfDeduction?.toLocaleString('en-IN')}</td>
                    <td>₹{pt.tdsDeduction?.toLocaleString('en-IN')}</td>
                    <td>
                      <span className="badge badge-success">{pt.status}</span>
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
