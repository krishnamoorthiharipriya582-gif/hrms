import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  Award, 
  CheckCircle2, 
  Plus, 
  UserCheck, 
  Download,
  BookOpen
} from 'lucide-react';
import { api } from '../services/api';

export default function TrainingView({ currentUser }) {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [progName, setProgName] = useState('Spring Boot 3 & Cloud Native Architecture');
  const [trainer, setTrainer] = useState('Prof. A. N. Murthy');
  const [mode, setMode] = useState('ONLINE');

  useEffect(() => {
    loadTrainings();
  }, [currentUser]);

  async function loadTrainings() {
    try {
      setLoading(true);
      const list = await api.getTrainings();
      setTrainings(list || []);
    } catch (err) {
      console.error('Failed to load training programmes', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleEnroll(e) {
    e.preventDefault();
    try {
      await api.enrollTraining(currentUser.employeeId, {
        programmeName: progName,
        trainerName: trainer,
        mode: mode
      });
      setShowEnrollModal(false);
      loadTrainings();
    } catch (err) {
      alert('Enrollment failed: ' + err.message);
    }
  }

  async function handleComplete(id) {
    try {
      await api.completeTraining(id, true, 5);
      loadTrainings();
    } catch (err) {
      alert('Failed to mark completion: ' + err.message);
    }
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Training & Skill Development</h1>
          <p className="page-subtitle">Mandatory POSH compliance, technical workshops, attendance, and completion certificates</p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowEnrollModal(true)}>
          <Plus size={16} />
          <span>Nominate for Programme</span>
        </button>
      </div>

      {/* Training Table */}
      <div className="card">
        <div className="card-title">
          <BookOpen size={19} color="var(--primary)" />
          <span>My Training Programmes & Certifications</span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Programme Name</th>
                <th>Trainer</th>
                <th>Date</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Certificate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainings.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No training enrollments found. Click "Nominate for Programme" to register.
                  </td>
                </tr>
              ) : (
                trainings.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 700 }}>{t.programmeName}</td>
                    <td>{t.trainerName || 'Corporate Faculty'}</td>
                    <td>{t.trainingDate}</td>
                    <td>
                      <span className={`badge ${t.mode === 'ONLINE' ? 'badge-info' : 'badge-neutral'}`}>
                        {t.mode}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        t.status === 'COMPLETED' ? 'badge-success' :
                        t.status === 'ATTENDED' ? 'badge-info' : 'badge-warning'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td>
                      {t.certificateCode ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 600 }}>
                          <Award size={15} />
                          <span>{t.certificateCode}</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pending Completion</span>
                      )}
                    </td>
                    <td>
                      {t.status !== 'COMPLETED' ? (
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleComplete(t.id)}
                        >
                          <CheckCircle2 size={13} color="#10b981" />
                          <span>Mark Complete</span>
                        </button>
                      ) : (
                        <button 
                          className="btn btn-outline btn-sm"
                          onClick={() => alert('Certificate downloaded: ' + t.certificateCode)}
                        >
                          <Download size={13} />
                          <span>Download</span>
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

      {/* Enroll Modal */}
      {showEnrollModal && (
        <div className="modal-overlay" onClick={() => setShowEnrollModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontWeight: 700 }}>Nominate for Training Programme</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setShowEnrollModal(false)}>✕</button>
            </div>
            <form onSubmit={handleEnroll}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Programme Title</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={progName} 
                    onChange={(e) => setProgName(e.target.value)}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Faculty / Trainer</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={trainer} 
                    onChange={(e) => setTrainer(e.target.value)}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Training Delivery Mode</label>
                  <select 
                    className="form-select" 
                    value={mode} 
                    onChange={(e) => setMode(e.target.value)}
                  >
                    <option value="ONLINE">Virtual / Online (MS Teams)</option>
                    <option value="OFFLINE">Classroom / On-Premise Training Hall</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEnrollModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Confirm Nomination</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
