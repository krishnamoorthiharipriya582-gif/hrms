import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Target, 
  CheckCircle2, 
  TrendingUp, 
  BarChart3, 
  Star, 
  Edit3
} from 'lucide-react';
import { api } from '../services/api';

export default function PerformanceView({ currentUser }) {
  const [appraisal, setAppraisal] = useState(null);
  const [bellCurve, setBellCurve] = useState(null);
  const [selfRating, setSelfRating] = useState(4.0);
  const [selfComments, setSelfComments] = useState('');
  const [goalsText, setGoalsText] = useState('1. Deliver core HRMS modules on schedule.\n2. Ensure 99.5% test coverage for payroll engines.\n3. Complete AWS cloud security certification.');
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    loadPerformanceData();
  }, [currentUser]);

  async function loadPerformanceData() {
    if (!currentUser?.employeeId) return;
    try {
      setLoading(true);
      const [app, bc] = await Promise.all([
        api.getEmployeeAppraisal(currentUser.employeeId, '2025-2026'),
        api.getBellCurve('2025-2026')
      ]);
      setAppraisal(app || null);
      setBellCurve(bc || null);
      if (app?.goalsJson) setGoalsText(app.goalsJson);
      if (app?.employeeRating) setSelfRating(app.employeeRating);
    } catch (err) {
      console.error('Failed to load appraisals', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveGoals() {
    try {
      const updated = await api.setGoals(appraisal.id, goalsText);
      setAppraisal(updated);
      setSuccessMsg('Key Result Areas (KRAs) & Goals saved successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert('Failed to save goals: ' + err.message);
    }
  }

  async function handleSubmitSelfReview() {
    try {
      const updated = await api.submitSelfReview(appraisal.id, selfRating, selfComments);
      setAppraisal(updated);
      setSuccessMsg('Self-assessment submitted for manager review!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert('Failed to submit review: ' + err.message);
    }
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Performance Management & Appraisal</h1>
          <p className="page-subtitle">Annual review cycle, KRA goal sheets, 1.0–5.0 rating bands, and bell curve distribution</p>
        </div>
      </div>

      {successMsg && (
        <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', color: '#059669', padding: '14px 20px', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={20} />
          <strong>{successMsg}</strong>
        </div>
      )}

      {/* Progress Stepper for Appraisal Cycle */}
      <div className="card" style={{ marginBottom: '24px', background: '#f8fafc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', overflowX: 'auto', padding: '10px 0' }}>
          {['GOAL_SETTING', 'MID_YEAR', 'MANAGER_REVIEW', 'HR_NORM', 'CLOSED'].map((step, idx) => {
            const isDone = ['MID_YEAR', 'MANAGER_REVIEW', 'HR_NORM', 'CLOSED'].includes(appraisal?.status);
            const isCurrent = appraisal?.status === step;
            return (
              <div key={step} style={{ textAlign: 'center', minWidth: '120px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isCurrent ? 'var(--primary)' : isDone ? '#10b981' : '#cbd5e1',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  margin: '0 auto 8px'
                }}>
                  {idx + 1}
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: isCurrent ? 'var(--primary)' : 'var(--text-secondary)' }}>
                  {step.replace('_', ' ')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px' }}>
        {/* Left: Goals & Self-Assessment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Goal Sheet Card */}
          <div className="card">
            <div className="card-title">
              <Target size={19} color="var(--primary)" />
              <span>Key Result Areas (KRAs) & Performance Goals</span>
            </div>
            <textarea 
              className="form-textarea" 
              rows={4} 
              value={goalsText} 
              onChange={(e) => setGoalsText(e.target.value)}
              placeholder="List goals and target metrics for this performance cycle..."
            ></textarea>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button className="btn btn-secondary btn-sm" onClick={handleSaveGoals}>
                Save Goals
              </button>
            </div>
          </div>

          {/* Self-Assessment Form */}
          <div className="card">
            <div className="card-title">
              <Star size={19} color="#f59e0b" />
              <span>Annual Self-Assessment</span>
            </div>

            <div className="form-group">
              <label className="form-label">Self-Rating (Scale: 1.0 to 5.0)</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    className={`btn ${selfRating === val ? 'btn-primary' : 'btn-outline'} btn-sm`}
                    onClick={() => setSelfRating(val)}
                    style={{ minWidth: '42px' }}
                  >
                    {val}.0
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                5: Outstanding · 4: Exceeds · 3: Meets Expectations · 2: Partial · 1: Below
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Self-Assessment Summary / Accomplishments</label>
              <textarea 
                className="form-textarea" 
                rows={3} 
                value={selfComments} 
                onChange={(e) => setSelfComments(e.target.value)}
                placeholder="Detail accomplishments, projects delivered, certifications achieved..."
              ></textarea>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={handleSubmitSelfReview}>
                Submit Self-Review
              </button>
            </div>
          </div>
        </div>

        {/* Right: Review Status & Bell Curve Distribution */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Review Score Summary */}
          <div className="card">
            <div className="card-title">
              <Award size={19} color="#6366f1" />
              <span>Appraisal Outcome</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>Self Rating:</span>
                <span style={{ fontWeight: 700 }}>{appraisal?.employeeRating ? `${appraisal.employeeRating} / 5.0` : 'Pending'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f8fafc', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>Manager Rating:</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{appraisal?.managerRating ? `${appraisal.managerRating} / 5.0` : 'In Review'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f0fdf4', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.84rem', color: '#15803d', fontWeight: 600 }}>Proposed Increment:</span>
                <span style={{ fontWeight: 800, color: '#15803d' }}>{appraisal?.incrementPct ? `+${appraisal.incrementPct}%` : 'Post Review'}</span>
              </div>
            </div>

            {appraisal?.feedback && (
              <div style={{ marginTop: '16px', fontSize: '0.82rem', color: 'var(--text-secondary)', background: '#fff', border: '1px solid var(--border)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <strong>Manager Feedback:</strong> {appraisal.feedback}
              </div>
            )}
          </div>

          {/* Bell Curve Card */}
          {bellCurve && (
            <div className="card">
              <div className="card-title">
                <BarChart3 size={19} color="var(--primary)" />
                <span>Company Bell Curve Distribution</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Outstanding (4.5 - 5.0)</span>
                    <span style={{ fontWeight: 700 }}>{bellCurve.outstanding}</span>
                  </div>
                  <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${(bellCurve.outstanding / (bellCurve.totalAppraisals || 1)) * 100}%`, height: '100%', background: '#10b981' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Exceeds Expectations (3.5 - 4.5)</span>
                    <span style={{ fontWeight: 700 }}>{bellCurve.exceeds}</span>
                  </div>
                  <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${(bellCurve.exceeds / (bellCurve.totalAppraisals || 1)) * 100}%`, height: '100%', background: '#3b82f6' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Meets Expectations (2.5 - 3.5)</span>
                    <span style={{ fontWeight: 700 }}>{bellCurve.meets}</span>
                  </div>
                  <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${(bellCurve.meets / (bellCurve.totalAppraisals || 1)) * 100}%`, height: '100%', background: '#f59e0b' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
