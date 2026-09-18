import React, { useState } from 'react';
import { 
  Building2, 
  Lock, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  UserCheck, 
  Users, 
  Briefcase,
  Layers,
  KeyRound
} from 'lucide-react';
import { api, setAuthToken, setCurrentUser } from '../services/api';

export default function LoginView({ onLoginSuccess }) {
  const [username, setUsername] = useState('admin@hrms.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const personas = [
    {
      role: 'HR Director / Super Admin',
      email: 'admin@hrms.com',
      pass: 'admin123',
      name: 'Sarah Jenkins',
      badge: 'Full Access',
      badgeColor: '#4f46e5',
      desc: 'Master controls for Payroll, Compliance ECR/Form 16, Onboarding & Audits',
      icon: Briefcase
    },
    {
      role: 'Department Manager',
      email: 'manager@hrms.com',
      pass: 'manager123',
      name: 'Rajesh Sharma',
      badge: 'Approver',
      badgeColor: '#059669',
      desc: 'Approve leave requests, regularise attendance, and conduct annual appraisals',
      icon: Layers
    },
    {
      role: 'Staff Engineer (Self-Service)',
      email: 'emp@hrms.com',
      pass: 'employee123',
      name: 'Priya Verma',
      badge: 'Employee',
      badgeColor: '#2563eb',
      desc: 'Biometric/Mobile punch, apply leaves, download payslips, Form 12BB tax regime',
      icon: UserCheck
    },
    {
      role: 'Backend Engineer',
      email: 'amit@hrms.com',
      pass: 'employee123',
      name: 'Amit Patel',
      badge: 'Employee',
      badgeColor: '#0891b2',
      desc: 'View personal shift schedules, enroll in technical trainings, goal tracking',
      icon: Users
    }
  ];

  async function handleLogin(e, customEmail, customPass) {
    if (e) e.preventDefault();
    const loginUser = customEmail || username;
    const loginPass = customPass || password;

    setErrorMsg('');
    setLoading(true);

    try {
      const response = await api.login(loginUser, loginPass);
      if (response && response.token) {
        setAuthToken(response.token);
        setCurrentUser(response);
        onLoginSuccess(response);
      } else {
        throw new Error('Invalid authentication response from server.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials or ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  }

  const selectPersona = (p) => {
    setUsername(p.email);
    setPassword(p.pass);
    handleLogin(null, p.email, p.pass);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card-container">
        {/* Brand Header */}
        <div className="login-header">
          <div className="login-brand-logo">
            <Building2 size={28} color="#ffffff" />
          </div>
          <h1 className="login-title">Enterprise HRMS</h1>
          <p className="login-subtitle">Unified Workforce Management, Payroll & Statutory Compliance</p>
          <div className="compliance-capsule">
            <Sparkles size={14} color="#f59e0b" />
            <span>IEEE Std 830-1998 · Indian Statutory Acts (EPF, ESI, IT 1961)</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="login-error-alert">
            <Lock size={18} color="#ef4444" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Traditional Credentials Form */}
        <form onSubmit={(e) => handleLogin(e)} className="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="username-input">
              Corporate Email / Username
            </label>
            <div className="input-with-icon">
              <Mail size={18} className="field-icon" />
              <input
                id="username-input"
                type="text"
                className="form-input login-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin@hrms.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password-input">
              Password
            </label>
            <div className="input-with-icon">
              <KeyRound size={18} className="field-icon" />
              <input
                id="password-input"
                type="password"
                className="form-input login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary login-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span>Authenticating Securely...</span>
            ) : (
              <>
                <span>Sign In to Portal</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* One-click Persona Quick Logins */}
        <div className="persona-section-divider">
          <span>Or Quick-Access as Pre-Configured Persona</span>
        </div>

        <div className="persona-grid">
          {personas.map((p) => {
            const IconComp = p.icon;
            const isCurrent = username === p.email;
            return (
              <div
                key={p.email}
                className={`persona-card ${isCurrent ? 'persona-card-active' : ''}`}
                onClick={() => selectPersona(p)}
                title={`Click to instantly login as ${p.name}`}
              >
                <div className="persona-card-header">
                  <div className="persona-icon-box" style={{ background: `${p.badgeColor}15`, color: p.badgeColor }}>
                    <IconComp size={18} />
                  </div>
                  <span className="persona-badge" style={{ background: `${p.badgeColor}20`, color: p.badgeColor }}>
                    {p.badge}
                  </span>
                </div>
                <div className="persona-name">{p.name}</div>
                <div className="persona-role">{p.role}</div>
                <div className="persona-desc">{p.desc}</div>
                <div className="persona-email">{p.email}</div>
              </div>
            );
          })}
        </div>

        {/* Security / Compliance Footprint */}
        <div className="login-footer">
          <div className="security-guarantee">
            <ShieldCheck size={16} color="#10b981" />
            <span>256-Bit Encrypted Session · Role-Based Access Control (RBAC)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
