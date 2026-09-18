import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  FileEdit, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { api } from '../services/api';

export default function AttendanceView({ currentUser, onQuickPunch, todayPunch, punchLoading }) {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('2026-09');
  const [loading, setLoading] = useState(true);

  // Regularisation modal state
  const [showRegModal, setShowRegModal] = useState(false);
  const [regDate, setRegDate] = useState(new Date().toISOString().split('T')[0]);
  const [regInTime, setRegInTime] = useState('09:30');
  const [regOutTime, setRegOutTime] = useState('18:30');
  const [regReason, setRegReason] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  useEffect(() => {
    loadAttendanceData();
  }, [currentUser, selectedMonth]);

  async function loadAttendanceData() {
    if (!currentUser?.employeeId) return;
    try {
      setLoading(true);
      const [recs, summ, shfts, hols] = await Promise.all([
        api.getMonthlyRecords(currentUser.employeeId, selectedMonth),
        api.getMonthlySummary(currentUser.employeeId, selectedMonth),
        api.getShifts(),
        api.getHolidays(2026)
      ]);

      setRecords(recs || []);
      setSummary(summ || null);
      setShifts(shfts || []);
      setHolidays(hols || []);
    } catch (err) {
      console.error('Failed to load attendance records', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegulariseSubmit(e) {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    // Rule: Must be applied within 7 days
    const chosen = new Date(regDate);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    if (chosen < sevenDaysAgo) {
      setRegError('Validation Error: Attendance regularisation must be applied within 7 days of the punch date.');
      return;
    }

    try {
      await api.regularise(currentUser.employeeId, {
        workDate: regDate,
        inPunch: regInTime + ':00',
        outPunch: regOutTime + ':00',
        reason: regReason
      });

      setRegSuccess('Regularisation request submitted successfully! Pending manager review.');
      setTimeout(() => {
        setShowRegModal(false);
        loadAttendanceData();
      }, 1500);
    } catch (err) {
      setRegError(err.message || 'Failed to submit regularisation request');
    }
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance & Shift Management</h1>
          <p className="page-subtitle">Biometric logs, geo-fenced mobile punches, regularisations, and shift roster</p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline" onClick={() => setShowRegModal(true)}>
            <FileEdit size={16} />
            <span>Apply Regularisation</span>
          </button>

          <button 
            className={`btn ${todayPunch ? 'btn-secondary' : 'btn-success'}`}
            onClick={onQuickPunch}
            disabled={punchLoading}
          >
            <Clock size={16} />
            <span>{punchLoading ? 'Syncing...' : todayPunch ? (todayPunch.outPunch ? 'Punched Out' : 'Punch Out') : 'Punch In Now'}</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      {summary && (
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon-box" style={{ background: '#ecfdf5', color: '#10b981' }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="metric-label">Present Days</div>
              <div className="metric-value">{summary.present}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Month: {selectedMonth}</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box" style={{ background: '#fffbeb', color: '#f59e0b' }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <div className="metric-label">Late Arrivals</div>
              <div className="metric-value">{summary.late}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Threshold: 15 mins past shift</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box" style={{ background: '#eff6ff', color: '#3b82f6' }}>
              <Calendar size={24} />
            </div>
            <div>
              <div className="metric-label">Half Days</div>
              <div className="metric-value">{summary.halfDay}</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Working &lt; 4 hours</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box" style={{ background: '#fef2f2', color: '#ef4444' }}>
              <ShieldAlert size={24} />
            </div>
            <div>
              <div className="metric-label">Loss of Pay (LOP)</div>
              <div className="metric-value">{summary.lopDays}</div>
              <div style={{ fontSize: '0.74rem', color: '#ef4444', fontWeight: 600 }}>Deducted at Gross/26 in payroll</div>
            </div>
          </div>
        </div>
      )}

      {/* Daily Records & Shift Roster */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Daily Punch Table */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div className="card-title" style={{ margin: 0 }}>
              <Clock size={19} color="var(--primary)" />
              <span>Daily Attendance Log</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Select Month:</label>
              <input 
                type="month" 
                className="form-input" 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{ width: 'auto', padding: '6px 10px' }}
              />
            </div>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>In-Punch</th>
                  <th>Out-Punch</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Regularisation</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      No attendance punch records found for {selectedMonth}. Click "Punch In" above to record one!
                    </td>
                  </tr>
                ) : (
                  records.map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 600 }}>{r.workDate}</td>
                      <td>{r.inPunch ? r.inPunch.substring(0, 8) : '--:--:--'}</td>
                      <td>{r.outPunch ? r.outPunch.substring(0, 8) : '--:--:--'}</td>
                      <td>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          {r.source}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${
                          r.status === 'PRESENT' ? 'badge-success' :
                          r.status === 'LATE' ? 'badge-warning' :
                          r.status === 'HALF_DAY' ? 'badge-info' : 'badge-danger'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        {r.regularisationStatus !== 'NONE' ? (
                          <span className={`badge ${
                            r.regularisationStatus === 'APPROVED' ? 'badge-success' :
                            r.regularisationStatus === 'PENDING' ? 'badge-warning' : 'badge-danger'
                          }`}>
                            {r.regularisationStatus}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>None</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right side: Shift Details & Holidays */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Shift Configuration Card */}
          <div className="card">
            <div className="card-title">
              <Clock size={19} color="var(--primary)" />
              <span>Configured Shifts</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {shifts.map((s) => (
                <div key={s.id} style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{s.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {s.startTime} – {s.endTime} (Grace: {s.lateThresholdMinutes} min)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Holiday Calendar */}
          <div className="card">
            <div className="card-title">
              <Calendar size={19} color="#10b981" />
              <span>Upcoming Holidays (2026)</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
              {holidays.map((h) => (
                <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid var(--border-light)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{h.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{h.holidayDate}</div>
                  </div>
                  <span className="badge badge-neutral">{h.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Regularisation Request Modal */}
      {showRegModal && (
        <div className="modal-overlay" onClick={() => setShowRegModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontWeight: 700 }}>Attendance Regularisation Request</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setShowRegModal(false)}>✕</button>
            </div>
            <form onSubmit={handleRegulariseSubmit}>
              <div className="modal-body">
                {regError && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '0.85rem' }}>
                    {regError}
                  </div>
                )}
                {regSuccess && (
                  <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', color: '#059669', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '0.85rem' }}>
                    {regSuccess}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Punch Date (Within last 7 days)</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={regDate} 
                    onChange={(e) => setRegDate(e.target.value)}
                    required 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Corrected In-Time</label>
                    <input 
                      type="time" 
                      className="form-input" 
                      value={regInTime} 
                      onChange={(e) => setRegInTime(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Corrected Out-Time</label>
                    <input 
                      type="time" 
                      className="form-input" 
                      value={regOutTime} 
                      onChange={(e) => setRegOutTime(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Reason for Missed / Incorrect Punch</label>
                  <textarea 
                    className="form-textarea" 
                    rows={3} 
                    value={regReason} 
                    onChange={(e) => setRegReason(e.target.value)}
                    placeholder="E.g., Biometric reader offline, on-site client meeting, official travel..."
                    required
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRegModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit for Approval</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
