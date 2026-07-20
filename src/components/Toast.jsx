// ============================================================
// EarnPearls — Toast Notification System
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import './Toast.css';

const ICONS = {
  success: '✅',
  error:   '❌',
  warning: '⚠️',
  info:    'ℹ️',
  points:  '💎',
};

function Toast({ id, type = 'info', title, message, onDismiss, duration = 4000 }) {
  useEffect(() => {
    if (!duration) return;
    const t = setTimeout(() => onDismiss(id), duration);
    return () => clearTimeout(t);
  }, [id, duration, onDismiss]);

  return (
    <div className={`toast toast--${type}`} role="alert" aria-live="assertive">
      <span className="toast__icon" aria-hidden="true">{ICONS[type] || ICONS.info}</span>
      <div className="toast__content">
        {title   && <p className="toast__title">{title}</p>}
        {message && <p className="toast__message">{message}</p>}
      </div>
      <button
        className="toast__dismiss"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}

export function ToastContainer({ toasts = [], onDismiss }) {
  return (
    <div className="toast-container" aria-label="Notifications">
      {toasts.map(t => (
        <Toast key={t.id} {...t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback(id => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const show = useCallback((opts) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev.slice(-4), { id, ...opts }]);
    return id;
  }, []);

  const success = useCallback((title, message) => show({ type: 'success', title, message }), [show]);
  const error   = useCallback((title, message) => show({ type: 'error',   title, message, duration: 6000 }), [show]);
  const warning = useCallback((title, message) => show({ type: 'warning', title, message }), [show]);
  const info    = useCallback((title, message) => show({ type: 'info',    title, message }), [show]);
  const points  = useCallback((pts, usd)       => show({
    type: 'points',
    title: `+${pts.toLocaleString()} Points Earned!`,
    message: `That's $${usd} added to your wallet.`,
    duration: 5000,
  }), [show]);

  return { toasts, dismiss, show, success, error, warning, info, points };
}

export default ToastContainer;
