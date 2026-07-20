// ============================================================
// EarnPearls — Leaderboard Component
// ============================================================

import React from 'react';
import './Leaderboard.css';

const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };

export function LeaderboardRow({ entry, currentUserId }) {
  const isMe = entry.userId === currentUserId;
  const medal = MEDAL[entry.rank];

  return (
    <tr className={`lb-row ${isMe ? 'lb-row--me' : ''}`}>
      <td className="lb-cell lb-cell--rank">
        {medal
          ? <span className="lb-medal" aria-label={`Rank ${entry.rank}`}>{medal}</span>
          : <span className="lb-rank-num">#{entry.rank}</span>
        }
      </td>
      <td className="lb-cell lb-cell--user">
        <div className="lb-avatar">
          {entry.displayName?.[0]?.toUpperCase() || '?'}
        </div>
        <div className="lb-user-info">
          <p className="lb-name">
            {entry.displayName || 'Anonymous User'}
            {isMe && <span className="lb-you-badge">You</span>}
          </p>
          {entry.country && <p className="lb-country">{entry.country}</p>}
        </div>
      </td>
      <td className="lb-cell lb-cell--surveys">{entry.surveysCompleted}</td>
      <td className="lb-cell lb-cell--points">
        <span className="lb-points">{entry.pointsEarned.toLocaleString()}</span>
        <span className="lb-pts-label"> pts</span>
      </td>
    </tr>
  );
}

export default function Leaderboard({
  entries = [],
  currentUserId,
  period = 'weekly',
  endsAt,
  loading = false,
}) {
  const periodLabel = period === 'weekly' ? 'This Week' : 'This Month';

  if (loading) {
    return (
      <div className="lb-wrapper">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 56, marginBottom: 8, borderRadius: 12 }} />
        ))}
      </div>
    );
  }

  return (
    <div className="lb-wrapper">
      <div className="lb-header">
        <div>
          <h3 className="lb-title">🏆 Leaderboard — {periodLabel}</h3>
          {endsAt && (
            <p className="lb-ends">Ends {new Date(endsAt).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
          )}
        </div>
        <a href="/leaderboard" className="lb-view-all">View all →</a>
      </div>

      {entries.length === 0 ? (
        <div className="lb-empty">
          <span>🏆</span>
          <p>Be the first on the leaderboard!</p>
          <p>Complete surveys this week to climb the ranks.</p>
        </div>
      ) : (
        <div className="lb-table-wrapper">
          <table className="lb-table">
            <thead>
              <tr>
                <th className="lb-th">Rank</th>
                <th className="lb-th">User</th>
                <th className="lb-th">Surveys</th>
                <th className="lb-th">Points</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(entry => (
                <LeaderboardRow
                  key={entry.userId}
                  entry={entry}
                  currentUserId={currentUserId}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
