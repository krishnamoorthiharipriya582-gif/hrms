import React from 'react';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  Clock,
  Calendar,
  IndianRupee,
  Star,
  GraduationCap,
  ShieldCheck,
  LogOut,
  BarChart2,
  Settings,
  ChevronRight,
  Database,
  CheckCheck
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, currentUser }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, hasChevron: false },
    { id: 'onboarding', label: 'Onboarding', icon: UserPlus, hasChevron: true },
    { id: 'directory', label: 'Employees', icon: Users, hasChevron: true },
    { id: 'attendance', label: 'Attendance', icon: Clock, hasChevron: true },
    { id: 'leave', label: 'Leave Management', icon: Calendar, hasChevron: true },
    { id: 'approvals', label: 'Manager Approvals', icon: CheckCheck, hasChevron: true },
    { id: 'payroll', label: 'Payroll', icon: IndianRupee, hasChevron: true },
    { id: 'performance', label: 'Performance', icon: Star, hasChevron: true },
    { id: 'training', label: 'Training', icon: GraduationCap, hasChevron: true },
    { id: 'compliance', label: 'Compliance', icon: ShieldCheck, hasChevron: true },
    { id: 'exit', label: 'Exit Management', icon: LogOut, hasChevron: true },
    { id: 'analytics', label: 'Reports & Analytics', icon: BarChart2, hasChevron: true },
    { id: 'admin', label: 'Settings', icon: Settings, hasChevron: false },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header" style={{ padding: '24px 20px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
            flexShrink: 0
          }}>
            <Users size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff', lineHeight: 1.1 }}>
              HRMS
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 500, marginTop: '3px', lineHeight: 1.25 }}>
              Employee Onboarding &<br />HR Management System
            </div>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <div className="sidebar-nav" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                background: isActive ? '#2563eb' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.88rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={18} color={isActive ? '#ffffff' : '#94a3b8'} />
                <span>{item.label}</span>
              </div>
              {item.hasChevron && (
                <ChevronRight size={15} color={isActive ? '#ffffff' : '#64748b'} opacity={isActive ? 1 : 0.6} />
              )}
            </button>
          );
        })}
      </div>

      {/* Profile Card & System Status */}
      <div style={{ marginTop: 'auto', padding: '16px 14px' }}>
        {/* User Card matching Mockup */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '10px'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.95rem',
            flexShrink: 0
          }}>
            {currentUser?.fullName ? currentUser.fullName.charAt(0) : 'H'}
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f8fafc', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {currentUser?.fullName || 'HR Manager'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {currentUser?.username || 'hr.manager@company.com'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
              <span style={{ fontSize: '0.68rem', color: '#22c55e', fontWeight: 600 }}>Online</span>
            </div>
          </div>
        </div>

        {/* PostgreSQL Database Indicator */}
        <div style={{
          padding: '8px 12px',
          borderRadius: '8px',
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          fontSize: '0.72rem',
          color: '#64748b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 600 }}>
            <Database size={13} color="#10b981" />
            <span>PostgreSQL 18 Online</span>
          </div>
          <div style={{ marginTop: '2px', color: '#94a3b8', fontSize: '0.68rem' }}>
            Port 5432 · db: hrms · Spring Boot 3.3.4
          </div>
        </div>
      </div>
    </aside>
  );
}
