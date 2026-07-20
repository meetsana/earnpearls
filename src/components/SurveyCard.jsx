// ============================================================
// EarnPearls — Survey Card Component
// ============================================================

import React from 'react';
import Badge, { StatusBadge } from './Badge';
import Button from './Button';
import './SurveyCard.css';

const CATEGORY_ICONS = {
  'Technology':  '💻',
  'Healthcare':  '🏥',
  'Finance':     '💰',
  'Food':        '🍔',
  'Travel':      '✈️',
  'Shopping':    '🛍️',
  'Education':   '📚',
  'Entertainment':'🎬',
  'Lifestyle':   '🌿',
  'Politics':    '🗳️',
  default:       '📋',
};

export default function SurveyCard({
  survey,
  onStart,
  conversionRate = 1000,
}) {
  const {
    id,
    title,
    provider,
    points,
    estimatedMinutes,
    category,
    device,        // 'any' | 'desktop' | 'mobile'
    status,        // 'available' | 'completed' | 'unavailable'
    country,
  } = survey;

  const usd = (points / conversionRate).toFixed(2);
  const icon = CATEGORY_ICONS[category] || CATEGORY_ICONS.default;
  const isAvailable = status === 'available';

  return (
    <article className={`survey-card ${!isAvailable ? 'survey-card--dim' : ''}`}>
      {/* Header */}
      <div className="survey-card__header">
        <span className="survey-card__category-icon" aria-hidden="true">{icon}</span>
        <div className="survey-card__meta">
          <p className="survey-card__provider">{provider}</p>
          {category && <p className="survey-card__category">{category}</p>}
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Title */}
      <h3 className="survey-card__title">{title}</h3>

      {/* Reward */}
      <div className="survey-card__reward">
        <div className="survey-card__reward-primary">
          <span className="survey-card__pts">{points.toLocaleString()}</span>
          <span className="survey-card__pts-label">pts</span>
        </div>
        <span className="survey-card__usd">${usd}</span>
      </div>

      {/* Details */}
      <div className="survey-card__details">
        <div className="survey-card__detail">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          ~{estimatedMinutes} min
        </div>
        <div className="survey-card__detail">
          {device === 'mobile' ? '📱' : device === 'desktop' ? '🖥️' : '📱🖥️'}
          {device === 'any' ? 'Any device' : device === 'mobile' ? 'Mobile' : 'Desktop'}
        </div>
        {country && (
          <div className="survey-card__detail">
            🌍 {country}
          </div>
        )}
      </div>

      {/* Action */}
      <div className="survey-card__footer">
        {status === 'completed' ? (
          <Button variant="ghost" fullWidth disabled>
            ✓ Completed
          </Button>
        ) : status === 'unavailable' ? (
          <Button variant="ghost" fullWidth disabled>
            Not Available
          </Button>
        ) : (
          <Button
            variant="primary"
            fullWidth
            onClick={() => onStart?.(survey)}
          >
            Start Survey →
          </Button>
        )}
      </div>
    </article>
  );
}

export function SurveyGrid({ surveys, onStart, conversionRate }) {
  if (!surveys?.length) {
    return (
      <div className="survey-empty">
        <span>📋</span>
        <h3>No surveys available right now</h3>
        <p>Check back soon — new surveys are added daily.</p>
      </div>
    );
  }
  return (
    <div className="survey-grid">
      {surveys.map(s => (
        <SurveyCard key={s.id} survey={s} onStart={onStart} conversionRate={conversionRate} />
      ))}
    </div>
  );
}
