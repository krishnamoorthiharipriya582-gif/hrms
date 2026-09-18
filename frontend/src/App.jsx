import React, { useState, useEffect, useCallback } from 'react';
import { 
  api, 
  getCurrentUser, 
  setCurrentUser, 
  getAuthToken, 
  setAuthToken, 
  removeAuthToken 
} from './services/api';

// Core Navigation & Layout Components
import NavBar from './components/NavBar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

// Pages & Feature Views
import LoginView from './pages/LoginView';
import Home from './pages/Home';
import AttendanceView from './pages/AttendanceView';
import LeaveView from './pages/LeaveView';
import PayslipsView from './pages/PayslipsView';
import Tax12BBView from './pages/Tax12BBView';
import PerformanceView from './pages/PerformanceView';
import TrainingView from './pages/TrainingView';
import ExitView from './pages/ExitView';
import ManagerApprovalsView from './pages/ManagerApprovalsView';
import OnboardingView from './pages/OnboardingView';
import EmployeeDirectoryView from './pages/EmployeeDirectoryView';
import OrgHierarchyView from './pages/OrgHierarchyView';
import PayrollProcessingView from './pages/PayrollProcessingView';
import ComplianceView from './pages/ComplianceView';
import HRAnalyticsView from './pages/HRAnalyticsView';
import AdminAuditView from './pages/AdminAuditView';

export default function App() {
  const [currentUser, setCurrentUserState] = useState(() => getCurrentUser());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [todayPunch, setTodayPunch] = useState(null);
  const [punchLoading, setPunchLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  }, []);

  const loadTodayPunch = useCallback(async (employeeId) => {
    if (!employeeId) {
      setTodayPunch(null);
      return;
    }
    try {
      const record = await api.getTodayPunch(employeeId);
      setTodayPunch(record || null);
    } catch {
      setTodayPunch(null);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.employeeId) {
      loadTodayPunch(currentUser.employeeId);
    }
  }, [currentUser, loadTodayPunch]);

  const handleLoginSuccess = (user) => {
    setCurrentUserState(user);
    setActiveTab('dashboard');
    showToast(`Welcome back, ${user.fullName || user.username}!`, 'success');
  };

  const handleLogout = () => {
    removeAuthToken();
    localStorage.removeItem('hrms_user');
    setCurrentUserState(null);
    setTodayPunch(null);
    setActiveTab('dashboard');
    showToast('Signed out successfully.', 'info');
  };

  const handleRoleSwitch = async (username, password) => {
    try {
      const response = await api.login(username, password);
      if (response && response.token) {
        setAuthToken(response.token);
        setCurrentUser(response);
        setCurrentUserState(response);
        showToast(`Switched persona to ${response.fullName} (${response.role})`, 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to switch persona.', 'error');
    }
  };

  const handleQuickPunch = async () => {
    if (!currentUser?.employeeId) {
      showToast('No linked employee record found for punching.', 'error');
      return;
    }

    setPunchLoading(true);
    try {
      const updatedRecord = await api.punch(currentUser.employeeId, {
        punchType: 'MOBILE',
        latitude: 12.9716,
        longitude: 77.5946
      });
      setTodayPunch(updatedRecord);
      if (updatedRecord.outPunch) {
        showToast(`Punched Out successfully at ${updatedRecord.outPunch}`, 'success');
      } else {
        showToast(`Punched In successfully at ${updatedRecord.inPunch}`, 'success');
      }
    } catch (err) {
      showToast(err.message || 'Punch recording failed.', 'error');
    } finally {
      setPunchLoading(false);
    }
  };

  // If user is not authenticated, render Login View
  if (!currentUser || !getAuthToken()) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  // Active module view resolver
  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Home
            currentUser={currentUser}
            setActiveTab={setActiveTab}
            todayPunch={todayPunch}
            onQuickPunch={handleQuickPunch}
          />
        );
      case 'attendance':
        return (
          <AttendanceView
            currentUser={currentUser}
            onQuickPunch={handleQuickPunch}
            todayPunch={todayPunch}
            punchLoading={punchLoading}
          />
        );
      case 'leave':
        return <LeaveView currentUser={currentUser} />;
      case 'payslips':
        return <PayslipsView currentUser={currentUser} />;
      case 'tax12bb':
        return <Tax12BBView currentUser={currentUser} />;
      case 'performance':
        return <PerformanceView currentUser={currentUser} />;
      case 'training':
        return <TrainingView currentUser={currentUser} />;
      case 'exit':
        return <ExitView currentUser={currentUser} />;
      case 'approvals':
        return <ManagerApprovalsView currentUser={currentUser} />;
      case 'onboarding':
        return <OnboardingView />;
      case 'directory':
        return <EmployeeDirectoryView />;
      case 'hierarchy':
        return <OrgHierarchyView />;
      case 'payroll':
        return <PayrollProcessingView currentUser={currentUser} />;
      case 'compliance':
        return <ComplianceView />;
      case 'analytics':
        return <HRAnalyticsView />;
      case 'admin':
        return <AdminAuditView />;
      default:
        return (
          <Home
            currentUser={currentUser}
            setActiveTab={setActiveTab}
            todayPunch={todayPunch}
            onQuickPunch={handleQuickPunch}
          />
        );
    }
  };

  return (
    <div className="app-container">
      {/* Role-adaptive Sidebar navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
      />

      {/* Main Workspace Frame */}
      <main className="main-content">
        {/* Top Navbar with Persona Switching, Quick Punch, and Helpdesk */}
        <NavBar
          currentUser={currentUser}
          onRoleSwitch={handleRoleSwitch}
          onLogout={handleLogout}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onQuickPunch={handleQuickPunch}
          punchLoading={punchLoading}
          todayPunch={todayPunch}
        />

        {/* Dynamic Route Content */}
        <div style={{ flex: 1 }}>
          {renderActiveModule()}
        </div>

        {/* Standardized Statutory & Help Footer */}
        <Footer />
      </main>

      {/* Real-time Global Toast Feedback */}
      {toast && (
        <div className="toast-container">
          <div className={`toast-notification ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
