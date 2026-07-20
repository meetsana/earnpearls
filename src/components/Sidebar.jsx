// ============================================================
// EarnPearls — Sidebar Navigation
// ============================================================

import React from 'react';
import './Sidebar.css';

const NAV_ITEMS = [
  { href: '/dashboard',     icon: '🏠', label: 'Dashboard' },
  { href: '/surveys',       icon: '📊', label: 'Surveys' },
  { href: '/wallet',        icon: '💰', label: 'Wallet' },
  { href: '/withdrawals',   icon: '💸', label: 'Withdrawals' },
  { href: '/leaderboard',   icon: '🏆', label: 'Leaderboard' },
  { href: '/notifications', icon: '🔔', label: 'Notifications' },
  { href: '/support',       icon: '📧', label: 'Support' },
  { href: '/profile',       icon: '👤', label: 'Profile' },
];

export default function Sidebar({ activeHref = '/dashboard', collapsed = false }) {
  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar__logo">
        <span className="sidebar__logo-icon">💎</span>
        {!collapsed && <span className="sidebar__logo-text">EarnPearls</span>}
      </div>

      {/* Nav */}
      <nav className="sidebar__nav" aria-label="Main navigation">
        {NAV_ITEMS.map(({ href, icon, label }) => {
          const isActive = activeHref === href;
          return (
            <a
              key={href}
              href={href}
              className={`sidebar__item ${isActive ? 'sidebar__item--active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="sidebar__item-icon" aria-hidden="true">{icon}</span>
              {!collapsed && <span className="sidebar__item-label">{label}</span>}
            </a>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="sidebar__footer">
          <div className="sidebar__user-hint">
            <span>💡</span>
            <div>
              <p className="sidebar__hint-title">Tip</p>
              <p className="sidebar__hint-body">Complete your profile to unlock more surveys.</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
