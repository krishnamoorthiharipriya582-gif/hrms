import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Calendar, 
  IndianRupee, 
  ArrowUpRight, 
  ArrowDownRight, 
  FileText, 
  Clock, 
  CheckCircle2, 
  ChevronDown,
  CalendarDays,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';

export default function Home({ currentUser, setActiveTab, todayPunch, onQuickPunch }) {
  const [activeRange, setActiveRange] = useState('This Year');
  const [leaveBalances, setLeaveBalances] = useState([]);

  useEffect(() => {
    if (currentUser?.employeeId) {
      api.getBalances(currentUser.employeeId).then(data => {
        if (data) setLeaveBalances(data);
      }).catch(() => {});
    }
  }, [currentUser]);

  // Headcount Trend Data (Jan - Aug)
  const headcountTrend = [
    { month: 'Jan', count: 400 },
    { month: 'Feb', count: 415 },
    { month: 'Mar', count: 430 },
    { month: 'Apr', count: 450 },
    { month: 'May', count: 460 },
    { month: 'Jun', count: 475 },
    { month: 'Jul', count: 500 },
    { month: 'Aug', count: 523 }
  ];

  // Donut chart segments for Leave Summary
  const leaveCategories = [
    { label: 'On Leave', count: 47, pct: 9, color: '#3b82f6' },
    { label: 'Sick Leave', count: 12, pct: 2, color: '#22c55e' },
    { label: 'Casual Leave', count: 18, pct: 3, color: '#f97316' },
    { label: 'Earned Leave', count: 112, pct: 21, color: '#a855f7' },
    { label: 'Remaining at Work', count: 334, pct: 64, color: '#38bdf8' }
  ];

  // Recent Joiners List matching mockup
  const recentJoiners = [
    { name: 'Ananya Sharma', role: 'Software Engineer', date: '05 Aug 2026', status: 'Onboarded', avatarBg: '#3b82f6' },
    { name: 'Rohit Verma', role: 'HR Executive', date: '04 Aug 2026', status: 'Onboarded', avatarBg: '#10b981' },
    { name: 'Sneha Iyer', role: 'Data Analyst', date: '02 Aug 2026', status: 'Onboarded', avatarBg: '#8b5cf6' },
    { name: 'Arjun Nair', role: 'UI/UX Designer', date: '01 Aug 2026', status: 'Onboarded', avatarBg: '#f59e0b' }
  ];

  // Pending Tasks List matching mockup
  const pendingTasks = [
    { title: 'Offer Letters Awaiting e-Sign', subtext: '5 candidates', count: 5, priority: 'High', priorityColor: '#fef2f2', priorityText: '#ef4444', actionTab: 'onboarding' },
    { title: 'Background Verifications Pending', subtext: '8 employees', count: 8, priority: 'Medium', priorityColor: '#fffbeb', priorityText: '#f59e0b', actionTab: 'onboarding' },
    { title: 'Leave Requests Awaiting Approval', subtext: '12 requests', count: 12, priority: 'Medium', priorityColor: '#fffbeb', priorityText: '#f59e0b', actionTab: 'leave' },
    { title: 'Payroll Approval Pending', subtext: 'August 2026', count: 1, priority: 'High', priorityColor: '#fef2f2', priorityText: '#ef4444', actionTab: 'payroll' }
  ];

  return (
    <div style={{ padding: '28px', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Header Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '28px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
            Dashboard
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '4px', margin: 0 }}>
            Welcome back, {currentUser?.fullName || 'HR Manager'}! Here's what's happening today.
          </p>
        </div>

        {/* Date Display Pill matching mockup */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          padding: '8px 16px',
          borderRadius: '10px',
          fontSize: '0.84rem',
          color: '#475569',
          fontWeight: 600,
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
        }}>
          <CalendarDays size={16} color="#64748b" />
          <span>11 August 2026, Monday</span>
        </div>
      </div>

      {/* Row 1: 4 Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {/* Card 1: Total Employees */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #f1f5f9',
          borderRadius: '14px',
          padding: '22px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#eff6ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2563eb',
            flexShrink: 0
          }}>
            <Users size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Total Employees</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
              <span style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>523</span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#16a34a',
                background: '#f0fdf4',
                padding: '2px 6px',
                borderRadius: '6px'
              }}>
                <ArrowUpRight size={13} /> 8.5%
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>vs last month</div>
          </div>
        </div>

        {/* Card 2: New Joinees */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #f1f5f9',
          borderRadius: '14px',
          padding: '22px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#f0fdf4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#16a34a',
            flexShrink: 0
          }}>
            <UserPlus size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>New Joinees</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
              <span style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>23</span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#16a34a',
                background: '#f0fdf4',
                padding: '2px 6px',
                borderRadius: '6px'
              }}>
                <ArrowUpRight size={13} /> 15.2%
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>vs last month</div>
          </div>
        </div>

        {/* Card 3: On Leave Today */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #f1f5f9',
          borderRadius: '14px',
          padding: '22px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#fff7ed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ea580c',
            flexShrink: 0
          }}>
            <Calendar size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>On Leave Today</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
              <span style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>47</span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#dc2626',
                background: '#fef2f2',
                padding: '2px 6px',
                borderRadius: '6px'
              }}>
                <ArrowDownRight size={13} /> 6.1%
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>vs last month</div>
          </div>
        </div>

        {/* Card 4: Payroll (This Month) */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #f1f5f9',
          borderRadius: '14px',
          padding: '22px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#f5f3ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#7c3aed',
            flexShrink: 0
          }}>
            <IndianRupee size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Payroll (This Month)</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
              <span style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a' }}>₹ 2.45 Cr</span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#16a34a',
                background: '#f0fdf4',
                padding: '2px 6px',
                borderRadius: '6px'
              }}>
                <ArrowUpRight size={13} /> 12.8%
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>vs last month</div>
          </div>
        </div>
      </div>

      {/* Row 2: Visual Charts (Employee Headcount & Leave Summary) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
        gap: '24px',
        marginBottom: '24px'
      }}>
        {/* Left: Employee Headcount Line Chart */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #f1f5f9',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
              Employee Headcount
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              color: '#475569',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '4px 10px',
              cursor: 'pointer'
            }}>
              <span>{activeRange}</span>
              <ChevronDown size={13} />
            </div>
          </div>

          {/* SVG Headcount Chart matching mockup curve & points */}
          <div style={{ width: '100%', height: '220px', position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 540 220" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
              <defs>
                <linearGradient id="headcountGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid Lines */}
              {[0, 100, 200, 300, 400, 500, 600].map((val, idx) => {
                const y = 180 - (val / 600) * 160;
                return (
                  <g key={idx}>
                    <line x1="36" y1={y} x2="520" y2={y} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="24" y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Area Fill */}
              <path
                d="M 50,73.3 C 110,69.3 170,65.3 230,60 C 290,57.3 350,53.3 410,46.6 C 445,43 480,40.5 505,40.5 L 505,180 L 50,180 Z"
                fill="url(#headcountGrad)"
              />

              {/* Smooth Blue Line */}
              <path
                d="M 50,73.3 C 110,69.3 170,65.3 230,60 C 290,57.3 350,53.3 410,46.6 C 445,43 480,40.5 505,40.5"
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
              />

              {/* Data Points */}
              {headcountTrend.map((item, idx) => {
                const x = 50 + idx * 65;
                const y = 180 - (item.count / 600) * 160;
                return (
                  <g key={idx}>
                    <circle cx={x} cy={y} r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                    <text x={x} y="202" textAnchor="middle" fontSize="11" fill="#64748b" fontWeight="500">
                      {item.month}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right: Leave Summary Donut Chart */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #f1f5f9',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
              Leave Summary
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '20px' }}>
            {/* SVG Donut */}
            <div style={{ position: 'relative', width: '180px', height: '180px', flexShrink: 0 }}>
              <svg width="180" height="180" viewBox="0 0 180 180">
                <circle cx="90" cy="90" r="68" fill="none" stroke="#f1f5f9" strokeWidth="24" />
                {/* Remaining at work: 64% */}
                <circle cx="90" cy="90" r="68" fill="none" stroke="#38bdf8" strokeWidth="24"
                  strokeDasharray="273 427" strokeDashoffset="0" transform="rotate(-90 90 90)" />
                {/* Earned Leave: 21% */}
                <circle cx="90" cy="90" r="68" fill="none" stroke="#a855f7" strokeWidth="24"
                  strokeDasharray="90 427" strokeDashoffset="-273" transform="rotate(-90 90 90)" />
                {/* Casual Leave: 3% */}
                <circle cx="90" cy="90" r="68" fill="none" stroke="#f97316" strokeWidth="24"
                  strokeDasharray="13 427" strokeDashoffset="-363" transform="rotate(-90 90 90)" />
                {/* Sick Leave: 2% */}
                <circle cx="90" cy="90" r="68" fill="none" stroke="#22c55e" strokeWidth="24"
                  strokeDasharray="9 427" strokeDashoffset="-376" transform="rotate(-90 90 90)" />
                {/* On Leave: 9% */}
                <circle cx="90" cy="90" r="68" fill="none" stroke="#3b82f6" strokeWidth="24"
                  strokeDasharray="38 427" strokeDashoffset="-385" transform="rotate(-90 90 90)" />
              </svg>
              {/* Centered Donut Label matching Mockup */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none'
              }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>523</span>
                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 500 }}>Employees</span>
              </div>
            </div>

            {/* Legend matching Mockup */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, maxWidth: '240px' }}>
              {leaveCategories.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '9px', height: '9px', borderRadius: '3px', background: item.color }}></span>
                    <span style={{ color: '#475569', fontWeight: 500 }}>{item.label}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>
                    {item.count} <span style={{ color: '#94a3b8', fontWeight: 400 }}>({item.pct}%)</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Joiners & Pending Tasks matching Mockup */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
        gap: '24px'
      }}>
        {/* Recent Joiners Card */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #f1f5f9',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
              Recent Joiners
            </h3>
            <button
              onClick={() => setActiveTab('directory')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#2563eb',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {recentJoiners.map((rj, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: idx < recentJoiners.length - 1 ? '1px solid #f8fafc' : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: rj.avatarBg,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.88rem'
                  }}>
                    {rj.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>{rj.name}</div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b' }}>{rj.role}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{rj.date}</span>
                  <span style={{
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    color: '#16a34a',
                    background: '#f0fdf4',
                    padding: '3px 10px',
                    borderRadius: '6px'
                  }}>
                    {rj.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks Card */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #f1f5f9',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
              Pending Tasks
            </h3>
            <button
              onClick={() => setActiveTab('onboarding')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#2563eb',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {pendingTasks.map((task, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: idx < pendingTasks.length - 1 ? '1px solid #f8fafc' : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748b'
                  }}>
                    <FileText size={17} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.86rem', color: '#0f172a' }}>{task.title}</div>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{task.subtext}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ef4444' }}>{task.count}</span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: task.priorityText,
                    background: task.priorityColor,
                    padding: '3px 10px',
                    borderRadius: '6px'
                  }}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
