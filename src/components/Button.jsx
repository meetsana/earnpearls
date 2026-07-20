// ============================================================
// EarnPearls — Button Component
// Variants: primary | secondary | outline | danger | text
// Sizes:    sm | md | lg
// States:   default | hover | focus | active | disabled | loading
// ============================================================

import React from 'react';
import './Button.css';

const Spinner = () => (
  <svg
    className="btn-spinner"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
    <path
      fill="currentColor"
      opacity="0.75"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon = null,
  rightIcon = null,
  type = 'button',
  onClick,
  className = '',
  ...rest
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    loading  ? 'btn--loading'   : '',
    disabled ? 'btn--disabled'  : '',
    fullWidth? 'btn--full'      : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      aria-busy={loading}
      {...rest}
    >
      {loading && <Spinner />}
      {!loading && leftIcon && <span className="btn-icon btn-icon--left">{leftIcon}</span>}
      <span className="btn-label">{children}</span>
      {!loading && rightIcon && <span className="btn-icon btn-icon--right">{rightIcon}</span>}
    </button>
  );
}
