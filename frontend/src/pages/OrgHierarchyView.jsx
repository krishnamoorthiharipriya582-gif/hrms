import React, { useState, useEffect } from 'react';
import { 
  GitFork, 
  User, 
  Building2, 
  ChevronRight, 
  Briefcase 
} from 'lucide-react';
import { api } from '../services/api';

export default function OrgHierarchyView() {
  const [hierarchy, setHierarchy] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHierarchy();
  }, []);

  async function loadHierarchy() {
    try {
      setLoading(true);
      const data = await api.getHierarchy();
      setHierarchy(data || []);
    } catch (err) {
      console.error('Failed to load org hierarchy', err);
    } finally {
      setLoading(false);
    }
  }

  // Group by manager
  const roots = hierarchy.filter((e) => !e.managerId);
  const getReportees = (managerId) => hierarchy.filter((e) => e.managerId === managerId);

  const renderNode = (emp, level = 0) => {
    const reportees = getReportees(emp.id);

    return (
      <div key={emp.id} style={{ marginLeft: `${level * 36}px`, marginTop: '14px' }}>
        <div style={{
          background: level === 0 ? 'linear-gradient(135deg, #1e1b4b, #312e81)' : '#fff',
          color: level === 0 ? '#fff' : 'var(--text-primary)',
          border: level === 0 ? 'none' : '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '14px',
          boxShadow: 'var(--shadow-sm)',
          minWidth: '320px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: level === 0 ? 'rgba(255,255,255,0.2)' : '#e0e7ff',
            color: level === 0 ? '#fff' : 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800
          }}>
            {emp.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{emp.name}</div>
            <div style={{ fontSize: '0.78rem', color: level === 0 ? '#c7d2fe' : 'var(--text-secondary)' }}>
              {emp.designation} · {emp.department}
            </div>
          </div>
          {reportees.length > 0 && (
            <span style={{
              marginLeft: 'auto',
              background: level === 0 ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.72rem',
              fontWeight: 700
            }}>
              {reportees.length} reportees
            </span>
          )}
        </div>

        {reportees.length > 0 && (
          <div style={{ borderLeft: '2px dashed var(--border-dark)', marginLeft: '20px', paddingLeft: '8px' }}>
            {reportees.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Organizational Hierarchy (FR2)</h1>
          <p className="page-subtitle">Visual manager-reportee reporting relationships and departmental org tree</p>
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <GitFork size={19} color="var(--primary)" />
          <span>Interactive Organization Chart</span>
        </div>

        <div style={{ padding: '20px 0', overflowX: 'auto' }}>
          {roots.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
              Loading organizational hierarchy tree...
            </div>
          ) : (
            roots.map((r) => renderNode(r))
          )}
        </div>
      </div>
    </div>
  );
}
