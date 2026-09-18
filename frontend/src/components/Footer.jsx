import React from 'react';
import { Shield, FileText, HeartHandshake, PhoneCall } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      background: '#fff',
      borderTop: '1px solid var(--border)',
      padding: '24px 32px',
      marginTop: 'auto',
      fontSize: '0.82rem',
      color: 'var(--text-secondary)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>ACME HR Tech Solutions Pvt Ltd</span>
            <span style={{ fontSize: '0.72rem', background: '#eef2ff', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
              IEEE Std 830-1998 Compliant
            </span>
          </div>
          <div style={{ marginTop: '4px', color: 'var(--text-muted)' }}>
            Statutory Compliance: EPF Act 1952 · ESI Act 1948 · Income Tax Act 1961 · Payment of Wages Act 1936
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HeartHandshake size={14} color="var(--primary)" />
            <span>POSH Committee: <strong>posh@company.com</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PhoneCall size={14} color="var(--primary)" />
            <span>Helpdesk: <strong>+91 80 4567 8900</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={14} color="#10b981" />
            <span>Data Encrypted (AES-256)</span>
          </div>
        </div>
      </div>
      <div style={{
        maxWidth: '1400px',
        margin: '12px auto 0',
        paddingTop: '12px',
        borderTop: '1px solid var(--border-light)',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: 'var(--text-muted)'
      }}>
        <div>&copy; 2026 ACME Global HR & Technologies Ltd. All rights reserved. Version 1.0 (SRS-33).</div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <a href="#privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Employment</a>
          <a href="#whistleblower" style={{ color: 'inherit', textDecoration: 'none' }}>Whistleblower Policy</a>
        </div>
      </div>
    </footer>
  );
}
