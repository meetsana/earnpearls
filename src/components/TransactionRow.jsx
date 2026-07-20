// ============================================================
// EarnPearls — Transaction Row & Table
// ============================================================

import React from 'react';
import { StatusBadge } from './Badge';
import './TransactionRow.css';

export function TransactionRow({ tx, conversionRate = 1000 }) {
  const toUsd = pts => (pts / conversionRate).toFixed(2);
  const date  = new Date(tx.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  const typeIcon = {
    survey_reward: '📊',
    bonus:         '🎁',
    adjustment:    '🔧',
    withdrawal_debit: '💸',
    reversal:      '↩️',
  }[tx.type] || '💰';

  return (
    <tr className="txn-row">
      <td className="txn-cell txn-cell--ref">
        <span className="txn-ref">{tx.referenceId}</span>
      </td>
      <td className="txn-cell txn-cell--type">
        <span className="txn-type">
          <span aria-hidden="true">{typeIcon}</span>
          {tx.type.replace(/_/g, ' ')}
        </span>
      </td>
      <td className="txn-cell">
        <span className="txn-provider">{tx.provider || '—'}</span>
      </td>
      <td className="txn-cell txn-cell--amount">
        <span className={`txn-amount ${tx.type === 'withdrawal_debit' ? 'txn-amount--debit' : 'txn-amount--credit'}`}>
          {tx.type === 'withdrawal_debit' ? '-' : '+'}{tx.points.toLocaleString()} pts
        </span>
        <span className="txn-usd">
          {tx.type === 'withdrawal_debit' ? '-' : '+'}${toUsd(tx.points)}
        </span>
      </td>
      <td className="txn-cell">
        <StatusBadge status={tx.status} />
      </td>
      <td className="txn-cell txn-cell--date">{date}</td>
    </tr>
  );
}

export default function TransactionTable({ transactions = [], conversionRate, loading = false }) {
  if (loading) {
    return (
      <div className="txn-table-wrapper">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton skeleton-card" style={{ height: '52px', marginBottom: '8px' }} />
        ))}
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="txn-empty">
        <span>📭</span>
        <p>No transactions yet.</p>
        <p>Complete a survey to earn your first reward!</p>
      </div>
    );
  }

  return (
    <div className="txn-table-wrapper">
      <table className="txn-table">
        <thead>
          <tr>
            <th>Reference</th>
            <th>Type</th>
            <th>Provider</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <TransactionRow key={tx.id} tx={tx} conversionRate={conversionRate} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
