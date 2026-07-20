// ============================================================
// EarnPearls — Navbar Component
// ============================================================

import React, { useState } from 'react';
import './Navbar.css';

export default function Navbar({ user, notificationCount = 0, onMenuToggle }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);

  return (
    <header className="navbar">
      <div className="navbar__inner">
        {/* Left: mobile menu toggle + Logo */}
        <div className="navbar__left">
          <button
            className="navbar__menu-btn"
            onClick={onMenuToggle}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
          <a href="/" className="navbar__logo">
            <span className="navbar__logo-icon">💎</span>
            <span className="navbar__logo-text">EarnPearls</span>
          </a>
        </div>

        {/* Right: actions */}
        <div className="navbar__right">
          {/* Notifications */}
          <div className="navbar__notif-wrapper">
            <button
              className="navbar__icon-btn"
              onClick={() => setNotifOpen(o => !o)}
              aria-label={`${notificationCount} notifications`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {notificationCount > 0 && (
                <span className="navbar__badge">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="navbar__dropdown navbar__notif-panel" role="menu">
                <div className="navbar__dropdown-header">
                  <span>Notifications</span>
                  <button className="btn btn--text btn--sm">Mark all read</button>
                </div>
                <div className="notif-empty">
                  <span>🔔</span>
                  <p>You're all caught up!</p>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="navbar__profile-wrapper">
            <button
              className="navbar__profile-btn"
              onClick={() => setProfileOpen(o => !o)}
              aria-expanded={profileOpen}
            >
              <div className="navbar__avatar">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="navbar__profile-info">
                <span className="navbar__profile-name">{user?.name || 'User'}</span>
                <span className="navbar__profile-email">{user?.email || ''}</span>
              </div>
              <svg className="navbar__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {profileOpen && (
              <div className="navbar__dropdown" role="menu">
                <a href="/profile" className="navbar__dropdown-item">👤 My Profile</a>
                <a href="/settings" className="navbar__dropdown-item">⚙️ Settings</a>
                <a href="/support" className="navbar__dropdown-item">📧 Support</a>
                <div className="navbar__dropdown-divider" />
                <a href="/logout" className="navbar__dropdown-item navbar__dropdown-item--danger">🚪 Sign Out</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
