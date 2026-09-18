import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles, 
  Calculator, 
  DollarSign,
  TrendingDown
} from 'lucide-react';
import { api } from '../services/api';

export default function Tax12BBView({ currentUser }) {
  const [regime, setRegime] = useState('NEW');
  const [sec80c, setSec80c] = useState(150000);
  const [sec80d, setSec80d] = useState(25000);
  const [hraRent, setHraRent] = useState(180000);
  const [homeLoan, setHomeLoan] = useState(0);
  const [nps, setNps] = useState(50000);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    // Check current regime
    if (currentUser?.taxRegime) {
      setRegime(currentUser.taxRegime);
    }
  }, [currentUser]);

  // Projected tax comparison calculations
  const annualSalary = currentUser?.ctc ? parseFloat(currentUser.ctc) : 1500000;
  
  // New Regime: Flat standard deduction ₹75,000, lower slabs, no 80C/80D/HRA
  const newTaxable = Math.max(0, annualSalary - 75000);
  let newTax = 0;
  if (newTaxable > 1500000) newTax = 150000 + (newTaxable - 1500000) * 0.30;
  else if (newTaxable > 1200000) newTax = 90000 + (newTaxable - 1200000) * 0.20;
  else if (newTaxable > 1000000) newTax = 60000 + (newTaxable - 1000000) * 0.15;
  else if (newTaxable > 700000) newTax = 30000 + (newTaxable - 700000) * 0.10;
  else if (newTaxable > 300000) newTax = (newTaxable - 300000) * 0.05;

  // Old Regime: Standard deduction ₹50,000 + 80C (max 1.5L) + 80D (max 25k) + HRA exemption + NPS 50k
  const oldExemptions = 50000 + Math.min(150000, sec80c) + Math.min(25000, sec80d) + (hraRent > 100000 ? 80000 : 0) + Math.min(50000, nps);
  const oldTaxable = Math.max(0, annualSalary - oldExemptions);
  let oldTax = 0;
  if (oldTaxable > 1000000) oldTax = 112500 + (oldTaxable - 1000000) * 0.30;
  else if (oldTaxable > 500000) oldTax = 12500 + (oldTaxable - 500000) * 0.20;
  else if (oldTaxable > 250000) oldTax = (oldTaxable - 250000) * 0.05;

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.submitForm12BB(currentUser.employeeId, {
        taxRegime: regime,
        section80C: sec80c,
        section80D: sec80d,
        hraRentPaid: hraRent,
        homeLoanInterest: homeLoan,
        npsContribution: nps
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save declaration: ' + err.message);
    }
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Form 12BB Investment Declaration</h1>
          <p className="page-subtitle">Select tax regime and declare investments for monthly TDS computation (Income Tax Act 1961)</p>
        </div>
      </div>

      {savedSuccess && (
        <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', color: '#059669', padding: '14px 20px', borderRadius: 'var(--radius-md)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={20} />
          <strong>Declaration saved successfully! Monthly TDS will be adjusted in the next payroll cycle.</strong>
        </div>
      )}

      {/* Tax Regime Comparison Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* New Regime Card */}
        <div 
          onClick={() => setRegime('NEW')}
          style={{
            background: regime === 'NEW' ? '#f0fdf4' : '#fff',
            border: regime === 'NEW' ? '2px solid #10b981' : '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '28px',
            cursor: 'pointer',
            boxShadow: regime === 'NEW' ? 'var(--shadow-md)' : 'var(--shadow-sm)',
            position: 'relative',
            transition: 'var(--transition)'
          }}
        >
          {regime === 'NEW' && (
            <span className="badge badge-success" style={{ position: 'absolute', top: '18px', right: '18px' }}>
              ACTIVE SELECTION
            </span>
          )}
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--secondary)' }}>
            New Tax Regime (Default)
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Lower tax slab rates, ₹75,000 standard deduction, zero investment proof required
          </div>

          <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Projected Annual Tax
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
              ₹{Math.round(newTax).toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Monthly TDS: ≈ ₹{Math.round(newTax / 12).toLocaleString('en-IN')} / month
            </div>
          </div>
        </div>

        {/* Old Regime Card */}
        <div 
          onClick={() => setRegime('OLD')}
          style={{
            background: regime === 'OLD' ? '#f5f3ff' : '#fff',
            border: regime === 'OLD' ? '2px solid #6366f1' : '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '28px',
            cursor: 'pointer',
            boxShadow: regime === 'OLD' ? 'var(--shadow-md)' : 'var(--shadow-sm)',
            position: 'relative',
            transition: 'var(--transition)'
          }}
        >
          {regime === 'OLD' && (
            <span className="badge badge-info" style={{ position: 'absolute', top: '18px', right: '18px' }}>
              ACTIVE SELECTION
            </span>
          )}
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--secondary)' }}>
            Old Tax Regime
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Supports 80C, 80D, HRA exemption, and home loan deductions (proofs mandatory)
          </div>

          <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Projected Annual Tax
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#6366f1', marginTop: '2px' }}>
              ₹{Math.round(oldTax).toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Monthly TDS: ≈ ₹{Math.round(oldTax / 12).toLocaleString('en-IN')} / month
            </div>
          </div>
        </div>
      </div>

      {/* Investment Inputs Form */}
      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-title">
            <Calculator size={19} color="var(--primary)" />
            <span>Declared Deductions (Applicable for Old Tax Regime)</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Section 80C (PPF, EPF, ELSS, Life Insurance) - Max ₹1,50,000</label>
              <input 
                type="number" 
                className="form-input" 
                value={sec80c} 
                onChange={(e) => setSec80c(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Section 80D (Medical & Health Insurance) - Max ₹25,000</label>
              <input 
                type="number" 
                className="form-input" 
                value={sec80d} 
                onChange={(e) => setSec80d(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Annual Rent Paid (for HRA Exemption)</label>
              <input 
                type="number" 
                className="form-input" 
                value={hraRent} 
                onChange={(e) => setHraRent(parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Section 80CCD (National Pension Scheme NPS) - Max ₹50,000</label>
              <input 
                type="number" 
                className="form-input" 
                value={nps} 
                onChange={(e) => setNps(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button type="submit" className="btn btn-primary">
              Save & Apply Tax Declaration
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
