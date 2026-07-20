// ============================================================
// EarnPearls — Card Component
// ============================================================

import React from 'react';
import './Card.css';

export default function Card({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  padding = 'md',
  hoverable = false,
  bordered = false,
  className = '',
  ...rest
}) {
  const classes = [
    'card',
    `card--pad-${padding}`,
    hoverable ? 'card--hoverable' : '',
    bordered  ? 'card--bordered'  : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...rest}>
      {(title || headerAction) && (
        <div className="card__header">
          <div className="card__header-text">
            {title && <h3 className="card__title">{title}</h3>}
            {subtitle && <p className="card__subtitle">{subtitle}</p>}
          </div>
          {headerAction && <div className="card__header-action">{headerAction}</div>}
        </div>
      )}
      <div className="card__body">{children}</div>
      {footer && <div className="card__footer">{footer}</div>}
    </div>
  );
}

export function StatCard({ label, value, subValue, icon, trend, color = 'primary' }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      {icon && <div className="stat-card__icon">{icon}</div>}
      <div className="stat-card__content">
        <p className="stat-card__label">{label}</p>
        <p className="stat-card__value">{value}</p>
        {subValue && <p className="stat-card__sub">{subValue}</p>}
      </div>
      {trend !== undefined && (
        <div className={`stat-card__trend stat-card__trend--${trend >= 0 ? 'up' : 'down'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
}
