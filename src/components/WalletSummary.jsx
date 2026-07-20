// ============================================================
// EarnPearls — Wallet Summary Component
// Shows all 4 balance states + lifetime stats
// ============================================================

import React from 'react';
import './WalletSummary.css';

function WalletBlock({ label, points, usd, color, tooltip }) {
  return (
    <div className={`wallet-block wallet-block--${color}`}>
      <p className="wallet-block__label">{label}</p>
      <p className="wallet-block__points">{points.toLocaleString()} pts</p>
      <p className="wallet-block__usd">${usd.toFixed(2)}</p>
      {tooltip && (
        <p className="wallet-block__tooltip">{tooltip}</p>
      )}
    </div>
  );
}

export default function WalletSummary({
  pending       = 0,
  validated     = 0,
  mature        = 0,
  withdrawable  = 0,
  totalEarned   = 0,
  totalWithdrawn= 0,
  conversionRate= 1000,   // points per $1
  compact       = false,
}) {
  const toUsd = pts => pts / conversionRate;
  const total = pending + validated + mature + withdrawable;

  if (compact) {
    return (
      <div className="wallet-summary-compact">
        <div className="wallet-summary-compact__main">
          <p className="wallet-summary-compact__label">Available to Withdraw</p>
          <p className="wallet-summary-compact__value">${toUsd(withdrawable).toFixed(2)}</p>
          <p className="wallet-summary-compact__pts">{withdrawable.toLocaleString()} pts</p>
        </div>
        <div className="wallet-summary-compact__stats">
          <div>
            <p className="wallet-stat-label">Pending</p>
            <p className="wallet-stat-value warning">{pending.toLocaleString()} pts</p>
          </div>
          <div>
            <p className="wallet-stat-label">Maturing</p>
            <p className="wallet-stat-value info">{(validated + mature).toLocaleString()} pts</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-summary">
      <div className="wallet-summary__header">
        <div>
          <h2 className="wallet-summary__total-pts">{total.toLocaleString()} pts</h2>
          <p className="wallet-summary__total-usd">${toUsd(total).toFixed(2)} total balance</p>
        </div>
        <div className="wallet-summary__lifetime">
          <div>
            <p className="wallet-stat-label">Lifetime Earned</p>
            <p className="wallet-stat-value">${toUsd(totalEarned).toFixed(2)}</p>
          </div>
          <div>
            <p className="wallet-stat-label">Total Withdrawn</p>
            <p className="wallet-stat-value">${toUsd(totalWithdrawn).toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="wallet-summary__blocks">
        <WalletBlock
          label="⏳ Pending"
          points={pending}
          usd={toUsd(pending)}
          color="pending"
          tooltip="Awaiting provider confirmation"
        />
        <WalletBlock
          label="✅ Validated"
          points={validated}
          usd={toUsd(validated)}
          color="validated"
          tooltip="Confirmed — maturing soon"
        />
        <WalletBlock
          label="🌱 Mature"
          points={mature}
          usd={toUsd(mature)}
          color="mature"
          tooltip="Hold period complete"
        />
        <WalletBlock
          label="💰 Withdrawable"
          points={withdrawable}
          usd={toUsd(withdrawable)}
          color="withdrawable"
          tooltip="Ready to withdraw!"
        />
      </div>

      <div className="wallet-summary__progress-bar">
        {total > 0 && [
          { key: 'pending',      value: pending,      color: '#F59E0B' },
          { key: 'validated',    value: validated,    color: '#3B82F6' },
          { key: 'mature',       value: mature,       color: '#22C55E' },
          { key: 'withdrawable', value: withdrawable, color: '#10B981' },
        ].map(({ key, value, color }) => value > 0 && (
          <div
            key={key}
            className="wallet-summary__progress-segment"
            style={{ width: `${(value / total) * 100}%`, background: color }}
            title={`${key}: ${value} pts`}
          />
        ))}
      </div>
    </div>
  );
}
