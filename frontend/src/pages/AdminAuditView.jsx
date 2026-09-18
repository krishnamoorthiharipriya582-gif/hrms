import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  CreditCard, 
  Layers, 
  Lock, 
  Clock, 
  FileText 
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminAuditView() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [structures, setStructures] = useState([]);
  const [companyConfig, setCompanyConfig] = useState(null);
  const [statutoryConfigs, setStatutoryConfigs] = useState([]);
  const [editingConfigId, setEditingConfigId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  async function loadAdminData() {
    try {
      setLoading(true);
      const [logs, st, comp, stat] = await Promise.all([
        api.getAuditLogs(),
        api.getSalaryStructures(),
        api.getCompanyConfig(),
        api.getStatutoryConfigs()
      ]);
      setAuditLogs(logs || []);
      setStructures(st || []);
      setCompanyConfig(comp || null);
      setStatutoryConfigs(stat || []);
    } catch (err) {
      console.error('Failed to load admin settings', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateConfig(id) {
    try {
      await api.updateStatutoryConfig(id, { configValue: editValue });
      setSaveSuccess(`Config updated successfully!`);
      setEditingConfigId(null);
      setTimeout(() => setSaveSuccess(''), 3000);
      const updated = await api.getStatutoryConfigs();
      setStatutoryConfigs(updated || []);
    } catch (err) {
      alert('Failed to update config: ' + err.message);
    }
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Configuration & Audit Logs (FR12)</h1>
          <p className="page-subtitle">Immutable compliance audit trail, statutory company profile, and grade-based CTC rules</p>
        </div>
      </div>

      {/* Company Statutory Configuration */}
      {companyConfig && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-title">
            <Building2 size={19} color="var(--primary)" />
            <span>Company Statutory Profile & Registration</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', background: '#f8fafc', padding: '20px', borderRadius: 'var(--radius-md)' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>REGISTERED ENTITY</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '2px' }}>{companyConfig.companyName}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{companyConfig.registeredAddress}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>EPFO & ESIC NUMBERS</div>
              <div style={{ fontSize: '0.85rem', marginTop: '2px' }}>PF Est: <strong>{companyConfig.pfEstNumber}</strong></div>
              <div style={{ fontSize: '0.85rem' }}>ESI Code: <strong>{companyConfig.esiNumber}</strong></div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>TAX IDENTIFIERS</div>
              <div style={{ fontSize: '0.85rem', marginTop: '2px' }}>PAN: <strong>{companyConfig.pan}</strong></div>
              <div style={{ fontSize: '0.85rem' }}>TAN: <strong>{companyConfig.tan}</strong> · GSTIN: <strong>{companyConfig.gstin}</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* Grade & Salary Structure Table */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-title">
          <CreditCard size={19} color="#10b981" />
          <span>Configured Grade Salary Structures</span>
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Grade</th>
                <th>Basic Salary (%)</th>
                <th>HRA (%)</th>
                <th>Conveyance (Fixed)</th>
                <th>Special Allowance (%)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {structures.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{s.grade}</td>
                  <td>{s.basicPct}% of Gross</td>
                  <td>{s.hraPct}% of Gross</td>
                  <td>₹{s.conveyance?.toLocaleString('en-IN')} / month</td>
                  <td>{s.specialAllowancePct}% (Balancing)</td>
                  <td>
                    <span className="badge badge-success">ACTIVE RULE</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statutory Rates & Ceilings Policy Configuration (SRS FR12 & Appendix C/D) */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div className="card-title" style={{ margin: 0 }}>
            <ShieldCheck size={19} color="#6366f1" />
            <span>Statutory Compliance Rates & Ceilings (FR12 Engine)</span>
          </div>
          {saveSuccess && (
            <span className="badge badge-success" style={{ fontSize: '0.8rem' }}>
              ✓ {saveSuccess}
            </span>
          )}
        </div>

        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Configuration Key</th>
                <th>Statutory Description</th>
                <th>Configured Value</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {statutoryConfigs.map((cfg) => (
                <tr key={cfg.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, color: '#4338ca', fontSize: '0.86rem' }}>
                    {cfg.configKey}
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {cfg.description}
                  </td>
                  <td style={{ fontWeight: 700 }}>
                    {editingConfigId === cfg.id ? (
                      <input
                        type="text"
                        className="form-input"
                        style={{ padding: '4px 8px', width: '120px', fontSize: '0.85rem' }}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      <span className="badge badge-neutral" style={{ fontSize: '0.85rem' }}>
                        {cfg.configValue}
                      </span>
                    )}
                  </td>
                  <td>
                    {editingConfigId === cfg.id ? (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          onClick={() => handleUpdateConfig(cfg.id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          onClick={() => setEditingConfigId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        onClick={() => {
                          setEditingConfigId(cfg.id);
                          setEditValue(cfg.configValue);
                        }}
                      >
                        Edit Rate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Immutable HR Audit Trail (SRS Section 5.3 & Appendix D) */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div className="card-title" style={{ margin: 0 }}>
            <Lock size={19} color="#ef4444" />
            <span>Immutable System Audit Trail (INSERT-Only Table)</span>
          </div>
          <span className="badge badge-neutral" style={{ fontSize: '0.74rem' }}>
            Retention: 7 Years (Companies Act 2013)
          </span>
        </div>

        <div className="table-container" style={{ maxHeight: '420px', overflowY: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Entity Target</th>
                <th>Audit Details</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No audit logs recorded yet.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(log.loggedAt).toLocaleString('en-IN')}
                    </td>
                    <td style={{ fontWeight: 600, fontSize: '0.82rem' }}>{log.actorEmail || 'System'}</td>
                    <td>
                      <span className="badge badge-info">{log.action}</span>
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>{log.entityType}</td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{log.details}</td>
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
