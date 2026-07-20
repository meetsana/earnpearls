// ============================================================
// EarnPearls — Badge Component
// Used for: Status labels, tags, counts
// ============================================================

import React from 'react';
import './Badge.css';

// Map balance states to colors
const STATUS_MAP = {
  pending:      'warning',
  validated:    'info',
  mature:       'success',
  withdrawable: 'emerald',
  paid:         'neutral',
  rejected:     'danger',
  active:       'success',
  suspended:    'danger',
  limited:      'warning',
  verified:     'success',
  unverified:   'warning',
  'not started':'neutral',
  'in progress':'info',
  done:         'success',
  completed:    'success',
  disqualified: 'warning',
  available:    'success',
  unavailable:  'neutral',
};

export default function Badge({
  children,
  variant,        // explicit variant override
  status,         // auto-maps from status string
  size = 'md',
  dot = false,
  pill = true,
  className = '',
}) {
  const resolvedVariant =
    variant ||
    (status ? STATUS_MAP[status.toLowerCase()] || 'neutral' : 'neutral');

  const classes = [
    'badge',
    `badge--${resolvedVariant}`,
    `badge--${size}`,
    pill ? 'badge--pill' : '',
    dot  ? 'badge--dot'  : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      {dot && <span className="badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
  return <Badge status={status} dot>{label}</Badge>;
}
