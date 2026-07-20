// ============================================================
// EarnPearls — Surveys Page
// ============================================================

import React, { useState } from 'react';
import { SurveyGrid } from '../components/SurveyCard';
import Button from '../components/Button';
import Badge from '../components/Badge';

const ALL_SURVEYS = [
  { id: 1,  title: 'Your opinions on smartphone brands',     provider: 'Lucid',   points: 250, estimatedMinutes: 8,  category: 'Technology',    device: 'any',     status: 'available',  country: 'US' },
  { id: 2,  title: 'Online shopping habits 2025',            provider: 'Dynata',  points: 180, estimatedMinutes: 5,  category: 'Shopping',      device: 'any',     status: 'available',  country: 'UK' },
  { id: 3,  title: 'Healthcare attitudes survey',            provider: 'Cint',    points: 320, estimatedMinutes: 12, category: 'Healthcare',    device: 'desktop', status: 'available',  country: 'US' },
  { id: 4,  title: 'Travel preferences post-pandemic',       provider: 'Toluna',  points: 200, estimatedMinutes: 7,  category: 'Travel',        device: 'mobile',  status: 'completed',  country: 'AU' },
  { id: 5,  title: 'Fast food brand perception study',       provider: 'Kantar',  points: 150, estimatedMinutes: 4,  category: 'Food',          device: 'any',     status: 'available',  country: 'US' },
  { id: 6,  title: 'Streaming service satisfaction survey',  provider: 'Lucid',   points: 280, estimatedMinutes: 10, category: 'Entertainment', device: 'any',     status: 'available',  country: 'CA' },
  { id: 7,  title: 'Financial products awareness',           provider: 'Qualtrics',points:400, estimatedMinutes: 15, category: 'Finance',       device: 'desktop', status: 'available',  country: 'US' },
  { id: 8,  title: 'Education preferences for parents',      provider: 'Dynata',  points: 220, estimatedMinutes: 8,  category: 'Education',     device: 'any',     status: 'unavailable',country: 'UK' },
];

const CATEGORIES = ['All', 'Technology', 'Healthcare', 'Finance', 'Food', 'Travel', 'Shopping', 'Education', 'Entertainment'];
const SORT_OPTIONS = [
  { value: 'points_desc', label: 'Highest Points' },
  { value: 'time_asc',    label: 'Shortest First' },
  { value: 'newest',      label: 'Newest First' },
];

export default function SurveysPage({ conversionRate = 1000 }) {
  const [category, setCategory]  = useState('All');
  const [sort, setSort]          = useState('points_desc');
  const [statusFilter, setStatusFilter] = useState('available');

  const filtered = ALL_SURVEYS
    .filter(s => category === 'All' || s.category === category)
    .filter(s => statusFilter === 'all' || s.status === statusFilter)
    .sort((a, b) => {
      if (sort === 'points_desc') return b.points - a.points;
      if (sort === 'time_asc')   return a.estimatedMinutes - b.estimatedMinutes;
      return b.id - a.id;
    });

  return (
    <div className="page-surveys">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">📊 Surveys</h1>
          <p className="page-subtitle">{filtered.length} surveys available for you today</p>
        </div>
      </div>

      {/* Filters */}
      <div className="surveys-filters">
        {/* Category Pills */}
        <div className="surveys-categories">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`category-pill ${category === cat ? 'category-pill--active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort & Status */}
        <div className="surveys-controls">
          <select
            className="form-select"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="available">Available</option>
            <option value="completed">Completed</option>
            <option value="all">All</option>
          </select>
          <select
            className="form-select"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Survey Grid */}
      <SurveyGrid surveys={filtered} conversionRate={conversionRate} />
    </div>
  );
}
