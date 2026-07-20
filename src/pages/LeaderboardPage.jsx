// ============================================================
// EarnPearls — Leaderboard Page
// ============================================================

import React, { useState } from 'react';
import Leaderboard from '../components/Leaderboard';
import { StatCard } from '../components/Card';

const WEEKLY = [
  { userId:'u1', rank:1,  displayName:'Sarah K.',      country:'🇺🇸 US', surveysCompleted:147, pointsEarned:52400 },
  { userId:'u2', rank:2,  displayName:'Mohammed A.',   country:'🇸🇦 SA', surveysCompleted:134, pointsEarned:48100 },
  { userId:'u3', rank:3,  displayName:'Emma L.',       country:'🇬🇧 GB', surveysCompleted:121, pointsEarned:44700 },
  { userId:'me', rank:4,  displayName:'You',           country:'🇵🇰 PK', surveysCompleted:98,  pointsEarned:36200 },
  { userId:'u5', rank:5,  displayName:'Luca R.',       country:'🇮🇪 IE', surveysCompleted:89,  pointsEarned:31500 },
  { userId:'u6', rank:6,  displayName:'Yuki T.',       country:'🇯🇵 JP', surveysCompleted:78,  pointsEarned:28800 },
  { userId:'u7', rank:7,  displayName:'Carlos M.',     country:'🇪🇸 ES', surveysCompleted:72,  pointsEarned:25200 },
  { userId:'u8', rank:8,  displayName:'Priya S.',      country:'🇮🇳 IN', surveysCompleted:65,  pointsEarned:22400 },
  { userId:'u9', rank:9,  displayName:'Hans K.',       country:'🇩🇪 DE', surveysCompleted:61,  pointsEarned:21000 },
  { userId:'u10',rank:10, displayName:'Ana P.',        country:'🇧🇷 BR', surveysCompleted:58,  pointsEarned:19800 },
];

export default function LeaderboardPage() {
  const [period, setPeriod] = useState('weekly');

  return (
    <div className="page-leaderboard">
      <div className="page-header">
        <h1 className="page-title">🏆 Leaderboard</h1>
        <div className="lb-period-toggle">
          <button
            className={`lb-period-btn ${period === 'weekly' ? 'lb-period-btn--active' : ''}`}
            onClick={() => setPeriod('weekly')}
          >Weekly</button>
          <button
            className={`lb-period-btn ${period === 'monthly' ? 'lb-period-btn--active' : ''}`}
            onClick={() => setPeriod('monthly')}
          >Monthly</button>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="lb-podium">
        {/* 2nd Place */}
        <div className="podium-item podium-item--2">
          <div className="podium-avatar">{WEEKLY[1].displayName[0]}</div>
          <p className="podium-name">{WEEKLY[1].displayName}</p>
          <p className="podium-pts">{WEEKLY[1].pointsEarned.toLocaleString()} pts</p>
          <div className="podium-block podium-block--2">🥈 2nd</div>
        </div>
        {/* 1st Place */}
        <div className="podium-item podium-item--1">
          <div className="podium-crown">👑</div>
          <div className="podium-avatar podium-avatar--1">{WEEKLY[0].displayName[0]}</div>
          <p className="podium-name">{WEEKLY[0].displayName}</p>
          <p className="podium-pts">{WEEKLY[0].pointsEarned.toLocaleString()} pts</p>
          <div className="podium-block podium-block--1">🥇 1st</div>
        </div>
        {/* 3rd Place */}
        <div className="podium-item podium-item--3">
          <div className="podium-avatar">{WEEKLY[2].displayName[0]}</div>
          <p className="podium-name">{WEEKLY[2].displayName}</p>
          <p className="podium-pts">{WEEKLY[2].pointsEarned.toLocaleString()} pts</p>
          <div className="podium-block podium-block--3">🥉 3rd</div>
        </div>
      </div>

      {/* Full Table */}
      <Leaderboard
        entries={WEEKLY}
        currentUserId="me"
        period={period}
        endsAt={new Date(Date.now() + 3 * 86400000).toISOString()}
      />

      {/* Prizes */}
      <div className="lb-prizes">
        <h2 className="section-title">🏆 Weekly Prize Pool</h2>
        <div className="lb-prizes-grid">
          {[
            { rank:'1st', prize:'$50 Bonus',  icon:'🥇' },
            { rank:'2nd', prize:'$25 Bonus',  icon:'🥈' },
            { rank:'3rd', prize:'$10 Bonus',  icon:'🥉' },
            { rank:'Top 10', prize:'2x Points Multiplier', icon:'⭐' },
          ].map(p => (
            <div key={p.rank} className="prize-card">
              <span className="prize-icon">{p.icon}</span>
              <p className="prize-rank">{p.rank}</p>
              <p className="prize-value">{p.prize}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
