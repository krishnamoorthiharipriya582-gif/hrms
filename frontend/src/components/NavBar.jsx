import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Mail, 
  ChevronDown, 
  ShieldCheck, 
  LogOut, 
  Clock, 
  Briefcase, 
  Layers, 
  User,
  HelpCircle
} from 'lucide-react';

export default function NavBar({ 
  currentUser, 
  onRoleSwitch, 
  onLogout, 
  activeTab, 
  setActiveTab,
  onQuickPunch,
  punchLoading,
  todayPunch
}) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="top-navbar" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 28px',
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      minHeight: '64px'
    }}>
      {/* Left: Hamburger + Search Input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, maxWidth: '600px' }}>
        <button 
          style={{
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '6px'
          }}
          title="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        <div style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={17} color="#94a3b8" style={{ position: 'absolute', left: '14px' }} />
          <input 
            type="text" 
            placeholder="Search employees, modules, documents..."
            style={{
              width: '100%',
              padding: '9px 14px 9px 40px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              fontSize: '0.86rem',
              color: '#1e293b',
              outline: 'none',
              transition: 'all 0.15s ease'
            }}
          />
        </div>
      </div>

      {/* Right: Quick Actions, Notifications, Messages, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Quick Punch Button */}
        <button 
          className={`btn ${todayPunch ? 'btn-secondary' : 'btn-success'} btn-sm`}
          onClick={onQuickPunch}
          disabled={punchLoading}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '6px 12px' }}
        >
          <Clock size={14} />
          <span>
            {punchLoading ? 'Syncing...' : todayPunch ? (todayPunch.outPunch ? 'Punched Out' : 'Punch Out') : 'Punch In'}
          </span>
        </button>

        {/* Notification Bell with Badge 5 */}
        <div style={{ position: 'relative', cursor: 'pointer' }} title="Notifications">
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b'
          }}>
            <Bell size={18} />
          </div>
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            background: '#ef4444',
            color: '#ffffff',
            fontSize: '0.65rem',
            fontWeight: 700,
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #ffffff'
          }}>
            5
          </span>
        </div>

        {/* Messages with Badge 3 */}
        <div style={{ position: 'relative', cursor: 'pointer' }} title="Messages">
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b'
          }}>
            <Mail size={18} />
          </div>
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            background: '#ef4444',
            color: '#ffffff',
            fontSize: '0.65rem',
            fontWeight: 700,
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #ffffff'
          }}>
            3
          </span>
        </div>

        {/* Persona Switcher for Evaluation */}
        <div style={{ position: 'relative' }}>
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}
          >
            <ShieldCheck size={14} color="#4f46e5" />
            <span>Role Switch</span>
            <ChevronDown size={13} />
          </button>

          {showRoleMenu && (
            <div style={{
              position: 'absolute',
              top: '115%',
              right: 0,
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
              width: '230px',
              padding: '6px',
              zIndex: 100
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', padding: '6px 10px', textTransform: 'uppercase' }}>
                Select Test Persona
              </div>
              <button
                className="nav-item"
                style={{ color: '#0f172a', padding: '8px 10px', width: '100%', textAlign: 'left', borderRadius: '6px', display: 'flex', gap: '8px', alignItems: 'center' }}
                onClick={() => { onRoleSwitch('admin@hrms.com', 'admin123'); setShowRoleMenu(false); }}
              >
                <Briefcase size={15} color="#4f46e5" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>HR Manager (Admin)</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Full HR, Payroll & Compliance</div>
                </div>
              </button>
              <button
                className="nav-item"
                style={{ color: '#0f172a', padding: '8px 10px', width: '100%', textAlign: 'left', borderRadius: '6px', display: 'flex', gap: '8px', alignItems: 'center' }}
                onClick={() => { onRoleSwitch('manager@hrms.com', 'manager123'); setShowRoleMenu(false); }}
              >
                <Layers size={15} color="#059669" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>Dept Manager</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Approve leaves, appraisals</div>
                </div>
              </button>
              <button
                className="nav-item"
                style={{ color: '#0f172a', padding: '8px 10px', width: '100%', textAlign: 'left', borderRadius: '6px', display: 'flex', gap: '8px', alignItems: 'center' }}
                onClick={() => { onRoleSwitch('emp@hrms.com', 'employee123'); setShowRoleMenu(false); }}
              >
                <User size={15} color="#2563eb" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>Employee (Self-Service)</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Payslips, leave apply, Tax</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* User Profile Dropdown matching Mockup */}
        <div style={{ position: 'relative' }}>
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '8px',
              transition: 'background 0.15s ease'
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.9rem',
              overflow: 'hidden'
            }}>
              {currentUser?.fullName ? currentUser.fullName.charAt(0) : 'H'}
            </div>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1e293b' }}>
              {currentUser?.fullName || 'HR Manager'}
            </span>
            <ChevronDown size={15} color="#64748b" />
          </div>

          {showProfileMenu && (
            <div style={{
              position: 'absolute',
              top: '115%',
              right: 0,
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
              width: '180px',
              padding: '6px',
              zIndex: 100
            }}>
              <div style={{ padding: '8px 10px', borderBottom: '1px solid #f1f5f9', fontSize: '0.78rem', color: '#64748b' }}>
                Signed in as<br />
                <strong style={{ color: '#0f172a' }}>{currentUser?.username || 'admin@hrms.com'}</strong>
              </div>
              <button
                onClick={onLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  marginTop: '4px',
                  background: 'transparent',
                  border: 'none',
                  color: '#ef4444',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                <LogOut size={15} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
