// ============================================================
// EarnPearls — Input / Form Components
// ============================================================

import React, { useState, useId } from 'react';
import './Input.css';

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  hint,
  disabled = false,
  required = false,
  leftIcon,
  rightIcon,
  size = 'md',
  className = '',
  ...rest
}) {
  const id = useId();

  const wrapperClass = [
    'input-field',
    `input-field--${size}`,
    error    ? 'input-field--error'    : '',
    disabled ? 'input-field--disabled' : '',
    leftIcon ? 'input-field--has-left' : '',
    rightIcon? 'input-field--has-right': '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="form-required" aria-hidden="true"> *</span>}
        </label>
      )}
      <div className={wrapperClass}>
        {leftIcon  && <span className="input-icon input-icon--left">{leftIcon}</span>}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className="input"
          {...rest}
        />
        {rightIcon && <span className="input-icon input-icon--right">{rightIcon}</span>}
      </div>
      {error && <p id={`${id}-error`} className="form-error" role="alert">{error}</p>}
      {!error && hint && <p id={`${id}-hint`} className="form-hint">{hint}</p>}
    </div>
  );
}

export function Select({ label, options = [], value, onChange, error, hint, disabled, required, placeholder, className = '' }) {
  const id = useId();
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="form-required"> *</span>}
        </label>
      )}
      <div className={`input-field input-field--select ${error ? 'input-field--error' : ''} ${className}`}>
        <select
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className="input"
          aria-invalid={!!error}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map(opt => (
            <option key={opt.value ?? opt} value={opt.value ?? opt}>
              {opt.label ?? opt}
            </option>
          ))}
        </select>
        <span className="select-chevron" aria-hidden="true">›</span>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      {!error && hint && <p className="form-hint">{hint}</p>}
    </div>
  );
}

export function Textarea({ label, rows = 4, value, onChange, error, hint, disabled, required, placeholder, className = '' }) {
  const id = useId();
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="form-required"> *</span>}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={`input input--textarea ${error ? 'input--error' : ''} ${className}`}
      />
      {error && <p className="form-error" role="alert">{error}</p>}
      {!error && hint && <p className="form-hint">{hint}</p>}
    </div>
  );
}

export function Checkbox({ label, checked, onChange, disabled, description, className = '' }) {
  const id = useId();
  return (
    <div className={`checkbox-group ${className}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="checkbox"
      />
      <div className="checkbox-content">
        <label htmlFor={id} className="checkbox-label">{label}</label>
        {description && <p className="checkbox-description">{description}</p>}
      </div>
    </div>
  );
}
