// ============================================================
// EarnPearls — Wallet Page
// ============================================================

import React, { useState } from 'react';
import WalletSummary from '../components/WalletSummary';
import TransactionTable from '../components/TransactionRow';
import Button from '../components/Button';
import Badge from '../components/Badge';

const SAMPLE_TXS = [
  { id: 'tx1', referenceId: 'EP-2025-001',   type: 'survey_reward',    provider: 'Lucid',    points: 250,  status: 'withdrawable', createdAt: '2025-07-18T10:00:00Z' },
  { id: 'tx2', referenceId: 'EP-2025-002',   type: 'survey_reward',    provider: 'Dynata',   points: 180,  status: 'validated',    createdAt: '2025-07-17T14:30:00Z' },
  { id: 'tx3', referenceId: 'EP-2025-003',   type: 'withdrawal_debit', provider: null,        points: 15000, status: 'paid',        createdAt: '2025-07-15T09:00:00Z' },
  { id: 'tx4', referenceId: 'EP-2025-004',   type: 'bonus',            provider: 'EarnPearls',points: 500, status: 'withdrawable', createdAt: '2025-07-14T18:00:00Z' },
  { id: 'tx5', referenceId: 'EP-2025-005',   type: 'survey_reward',    provider: 'Cint',     points: 320,  status: 'pending',      createdAt: '2025-07-20T08:00:00Z' },
];

const WITHDRAWAL_METHODS = [
  { id: 'paypal',   icon: '💳', label: 'PayPal',         minPts: 5000,  fee: '2%',    time: '1-3 days' },
  { id: 'visa',     icon: '💳', label: 'Virtual Visa',   minPts: 10000, fee: '1%',    time: '2-5 days' },
  { id: 'crypto',   icon: '₿',    label: 'Cryptocurrency', minPts: 2500,  fee: '0.5%',  time: 'Instant' },
];

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const TABS = ['overview', 'transactions', 'withdraw'];

  return (
    <div className="page-wallet">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">💰 My Wallet</h1>
        <Button variant="primary" onClick={() => setActiveTab('withdraw')}>
          Withdraw Funds
        </Button>
      </div>

      {/* Tabs */}
      <div className="page-tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`page-tab ${activeTab === tab ? 'page-tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="page-content">
          <WalletSummary
            pending={3400}
            validated={5200}
            mature={8100}
            withdrawable={48200}
            totalEarned={284500}
            totalWithdrawn={220000}
          />
          <div style={{ marginTop: 'var(--space-6)' }}>
            <h2 className="section-title">Recent Transactions</h2>
            <TransactionTable transactions={SAMPLE_TXS.slice(0, 3)} conversionRate={1000} />
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="page-content">
          <TransactionTable transactions={SAMPLE_TXS} conversionRate={1000} />
        </div>
      )}

      {activeTab === 'withdraw' && (
        <div className="page-content">
          <div className="withdraw-methods">
            {WITHDRAWAL_METHODS.map(m => (
              <div key={m.id} className="withdraw-method-card">
                <div className="withdraw-method-icon">{m.icon}</div>
                <div className="withdraw-method-info">
                  <h3>{m.label}</h3>
                  <p>Min: {m.minPts.toLocaleString()} pts &bull; Fee: {m.fee} &bull; {m.time}</p>
                </div>
                <Button variant="outline" size="sm">Select</Button>
              </div>
            ))}
          </div>
          <div className="withdraw-form">
            <label className="form-label">Amount (points)</label>
            <input className="form-input" type="number" placeholder="e.g. 10000" min="2500" />
            <p className="form-hint">Balance: 48,200 pts ($48.20). Min withdrawal varies by method.</p>
            <Button variant="primary" fullWidth style={{ marginTop: 'var(--space-4)' }}>
              Continue to Withdraw →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
