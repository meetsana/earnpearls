// ============================================================
// EarnPearls — Dashboard Page
// ============================================================

import React from 'react';
import { StatCard } from '../components/Card';
import { SurveyGrid } from '../components/SurveyCard';
import Leaderboard from '../components/Leaderboard';
import WalletSummary from '../components/WalletSummary';
import '../pages/Dashboard.css';

const SAMPLE_SURVEYS = [
  { id: 1, title: 'Your opinions on smartphone brands', provider: 'Lucid', points: 250, estimatedMinutes: 8,  category: 'Technology',    device: 'any',     status: 'available',  country: 'US' },
  { id: 2, title: 'Online shopping habits 2025',        provider: 'Dynata', points: 180, estimatedMinutes: 5,  category: 'Shopping',    device: 'any',     status: 'available',  country: 'UK' },
  { id: 3, title: 'Healthcare attitudes survey',        provider: 'Cint',  points: 320, estimatedMinutes: 12, category: 'Healthcare',   device: 'desktop', status: 'available',  country: 'US' },
  { id: 4, title: 'Travel preferences post-pandemic',   provider: 'Toluna',points: 200, estimatedMinutes: 7,  category: 'Travel',      device: 'mobile',  status: 'completed',  country: 'AU' },
];

const SAMPLE_LEADERS = [
  { userId: 'u1', rank: 1, displayName: 'Sarah K.',    country: '🇺🇸 US',  surveysCompleted: 147, pointsEarned: 52400 },
  { userId: 'u2', rank: 2, displayName: 'Mohammed A.', country: '🇸🇦 SA',  surveysCompleted: 134, pointsEarned: 48100 },
  { userId: 'u3', rank: 3, displayName: 'Emma L.',     country: '🇬🇧 GB',  surveysCompleted: 121, pointsEarned: 44700 },
  { userId: 'me', rank: 4, displayName: 'You',         country: '🇵🇰 PK',  surveysCompleted: 98,  pointsEarned: 36200 },
  { userId: 'u5', rank: 5, displayName: 'Luca R.',     country: '🇮🇪 IE',  surveysCompleted: 89,  pointsEarned: 31500 },
];

export default function Dashboard({ user }) {
  return (
    <div className="page-dashboard">
      {/* Greeting */}
      <div className="dashboard__greeting">
        <div>
          <h1 className="dashboard__title">Good afternoon, {user?.displayName?.split(' ')[0] || 'there'} 👋</h1>
          <p className="dashboard__subtitle">You have 4 new surveys available today. Keep earning!</p>
        </div>
        <div className="dashboard__streak">
          <span>🔥</span>
          <div>
            <p className="dashboard__streak-num">7</p>
            <p className="dashboard__streak-label">Day Streak</p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="dashboard__stats">
        <StatCard
          title="Withdrawable"
          value="$48.20"
          subvalue="48,200 pts"
          icon="💰"
          color="success"
          trend="+12% this week"
          trendUp={true}
        />
        <StatCard
          title="Surveys Completed"
          value="98"
          subvalue="this month: 24"
          icon="📊"
          color="primary"
          trend="+8 vs last month"
          trendUp={true}
        />
        <StatCard
          title="Pending Points"
          value="3,400"
          subvalue="$3.40 awaiting"
          icon="⏳"
          color="warning"
        />
        <StatCard
          title="Lifetime Earned"
          value="$284.50"
          subvalue="284,500 pts total"
          icon="🏆"
          color="info"
        />
      </div>

      {/* Wallet Summary */}
      <div className="dashboard__section">
        <WalletSummary
          pending={3400}
          validated={5200}
          mature={8100}
          withdrawable={48200}
          totalEarned={284500}
          totalWithdrawn={220000}
        />
      </div>

      {/* Available Surveys */}
      <div className="dashboard__section">
        <div className="dashboard__section-header">
          <h2 className="dashboard__section-title">📊 Available Surveys</h2>
          <a href="/surveys" className="dashboard__see-all">See all →</a>
        </div>
        <SurveyGrid surveys={SAMPLE_SURVEYS} conversionRate={1000} />
      </div>

      {/* Leaderboard */}
      <div className="dashboard__section">
        <Leaderboard
          entries={SAMPLE_LEADERS}
          currentUserId="me"
          period="weekly"
          endsAt={new Date(Date.now() + 3 * 24 * 3600000).toISOString()}
        />
      </div>
    </div>
  );
}
