// ============================================================
// EarnPearls — Profile Page
// ============================================================

import React, { useState } from 'react';
import Button from '../components/Button';
import Badge from '../components/Badge';

const COUNTRIES = ['United States','United Kingdom','Canada','Ireland','Australia','Germany','Belgium','Saudi Arabia','UAE','Qatar','Oman','Bahrain'];

export default function ProfilePage({ user = {} }) {
  const [tab, setTab] = useState('profile');

  const TABS = [
    { id: 'profile',   label: '👤 Profile' },
    { id: 'security',  label: '🔒 Security' },
    { id: 'payments',  label: '💳 Payment Methods' },
    { id: 'preferences', label: '⚙️ Preferences' },
  ];

  return (
    <div className="page-profile">
      <div className="page-header">
        <h1 className="page-title">👤 My Profile</h1>
      </div>

      <div className="profile-layout">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">
              {user.displayName?.[0]?.toUpperCase() || 'U'}
            </div>
            <button className="profile-avatar-edit">📷</button>
          </div>
          <h2 className="profile-sidebar-name">{user.displayName || 'User Name'}</h2>
          <p className="profile-sidebar-email">{user.email || 'user@example.com'}</p>
          <div className="profile-sidebar-badges">
            <Badge variant="success">Verified</Badge>
            <Badge variant="info">Member since 2024</Badge>
          </div>
          <div className="profile-sidebar-stats">
            <div className="profile-stat">
              <p className="profile-stat-value">98</p>
              <p className="profile-stat-label">Surveys Done</p>
            </div>
            <div className="profile-stat">
              <p className="profile-stat-value">$284</p>
              <p className="profile-stat-label">Total Earned</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="profile-main">
          {/* Tabs */}
          <div className="page-tabs">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`page-tab ${tab === t.id ? 'page-tab--active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Profile Form */}
          {tab === 'profile' && (
            <form className="profile-form" onSubmit={e => e.preventDefault()}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Display Name</label>
                  <input className="form-input" defaultValue={user.displayName || ''} placeholder="Your public name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" defaultValue={user.email || ''} disabled />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Country</label>
                  <select className="form-input form-select">
                    {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date of Birth</label>
                  <input className="form-input" type="date" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" type="tel" placeholder="+1 (555) 000-0000" />
              </div>
              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea className="form-input form-textarea" rows={3} placeholder="Tell us a bit about yourself..." />
              </div>
              <div className="profile-form-actions">
                <Button type="submit" variant="primary">Save Changes</Button>
              </div>
            </form>
          )}

          {tab === 'security' && (
            <div className="profile-form">
              <div className="security-item">
                <div>
                  <h3>Password</h3>
                  <p>Last changed 3 months ago</p>
                </div>
                <Button variant="outline" size="sm">Change Password</Button>
              </div>
              <div className="security-item">
                <div>
                  <h3>Two-Factor Authentication</h3>
                  <p>Add an extra layer of security to your account</p>
                </div>
                <Badge variant="warning">Not Enabled</Badge>
              </div>
              <div className="security-item">
                <div>
                  <h3>Active Sessions</h3>
                  <p>Manage devices logged into your account</p>
                </div>
                <Button variant="ghost" size="sm">View Sessions</Button>
              </div>
            </div>
          )}

          {tab === 'payments' && (
            <div className="profile-form">
              <div className="payment-empty">
                <span>💳</span>
                <h3>No payment methods saved</h3>
                <p>Add a payment method to start withdrawing your earnings.</p>
                <Button variant="primary">Add Payment Method</Button>
              </div>
            </div>
          )}

          {tab === 'preferences' && (
            <div className="profile-form">
              <div className="form-group">
                <label className="form-label">Preferred Survey Categories</label>
                <p className="form-hint">Select categories you'd like to see more often.</p>
                <div className="pref-cats">
                  {['Technology','Healthcare','Finance','Food','Travel','Shopping','Education','Entertainment'].map(c => (
                    <label key={c} className="pref-cat-item">
                      <input type="checkbox" defaultChecked={['Technology','Travel'].includes(c)} />
                      {c}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Notifications</label>
                {['New surveys available','Survey completions','Withdrawal updates','Weekly summary'].map(n => (
                  <label key={n} className="pref-cat-item">
                    <input type="checkbox" defaultChecked />
                    {n}
                  </label>
                ))}
              </div>
              <Button variant="primary">Save Preferences</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
