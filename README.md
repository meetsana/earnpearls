# 💎 EarnPearls UI — Pre-Implementation Prototype

> **"Your Time. Your Rewards."** — An exploratory UI component showcase for the EarnPearls rewards platform.

> [!WARNING]
> This repository is in **Phase 0 planning and audit**. The UI is not an approved
> product baseline, is not production-ready, and must not be treated as evidence
> that Phase 1 implementation has begun or passed review. The Constitution and
> approved Phase 0 documents govern future implementation.

Governance and audit entry points:

- [Phase 0 status](docs/phase-0/README.md)
- [EP-P0-01 v3 baseline status](docs/phase-0/EP-P0-01/candidate-v3/STATUS.md)
- [Independent semantic review](docs/phase-0/EP-P0-01/audit/EP-P0-01-V3-SEMANTIC-REVIEW-2026-07-21.md)
- [Repository audit](docs/audits/PROJECT-AUDIT-2026-07-21.md)

---

## 📚 Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Components](#components)
4. [Pages](#pages)
5. [Design System](#design-system)
6. [Getting Started](#getting-started)

---

## Overview

EarnPearls is a planned global rewards platform whose focused V1 centers on surveys,
wallet transparency, rewards, trust, and scalability. Withdrawal architecture is
intended to remain configurable; no payment method shown in this prototype should be
interpreted as an approved or enabled launch method.

- **Currency**: 1,000 points = $1 USD (configurable)
- **Balance Lifecycle**: Pending → Validated → Mature → Withdrawable → Paid
- **Markets**: US, UK, Canada, Ireland, Australia, Germany, Belgium, EU, Saudi Arabia, UAE, Qatar, Oman, Bahrain
- **Primary Color**: `#1A3C6E` (Deep Blue)
- **Secondary Color**: `#10B981` (Emerald Green)

---

## Project Structure

```
earnpearls/
├── index.html               ← Live component showcase (open in browser!)
├── package.json
├── README.md
└└── src/
    ├── styles/
    │   ├── tokens.css           ← Design token system
    │   └── global.css           ← Global styles & utilities
    ├── components/
    │   ├── Button.jsx/css       ← 5 variants, 3 sizes, loading state
    │   ├── Card.jsx/css         ← Card + StatCard
    │   ├── Badge.jsx/css        ← Badge + StatusBadge
    │   ├── Input.jsx/css        ← Input, Select, Textarea, Checkbox
    │   ├── Navbar.jsx/css       ← Responsive nav w/ dropdowns
    │   ├── Sidebar.jsx/css      ← Collapsible sidebar navigation
    │   ├── WalletSummary.jsx/css← Wallet balance display
    │   ├── SurveyCard.jsx/css   ← Survey card + SurveyGrid
    │   ├── TransactionRow.jsx/css ← Transaction table
    │   ├── Leaderboard.jsx/css  ← Leaderboard table
    │   ├── Modal.jsx/css        ← Modal + ConfirmModal
    │   └── Toast.jsx/css        ← Toast notifications + useToast hook
    └── pages/
        ├── Dashboard.jsx/css    ← Main dashboard page
        ├── WalletPage.jsx       ← Wallet & withdrawal page
        ├── SurveysPage.jsx      ← Surveys list with filters
        ├── LeaderboardPage.jsx  ← Full leaderboard + podium
        ├── ProfilePage.jsx      ← User profile & settings
        └── shared.css           ← Shared page styles
```

---

## Components

### Button
```jsx
import Button from './src/components/Button';

<Button variant="primary" size="md">Click Me</Button>
<Button variant="secondary" loading>Loading...</Button>
<Button variant="danger" fullWidth>Delete</Button>
```
Variants: `primary` `secondary` `outline` `danger` `ghost` `text`
Sizes: `sm` `md` `lg`

### SurveyCard
```jsx
import { SurveyGrid } from './src/components/SurveyCard';

<SurveyGrid surveys={surveys} onStart={handleStart} conversionRate={1000} />
```

### WalletSummary
```jsx
import WalletSummary from './src/components/WalletSummary';

<WalletSummary
  pending={3400}
  validated={5200}
  mature={8100}
  withdrawable={48200}
  totalEarned={284500}
  totalWithdrawn={220000}
  conversionRate={1000}
/>
```

### Toast
```jsx
import { useToast, ToastContainer } from './src/components/Toast';

function App() {
  const toast = useToast();
  return (
    <>
      <button onClick={() => toast.points(250, '0.25')}>Earn Points</button>
      <ToastContainer toasts={toast.toasts} onDismiss={toast.dismiss} />
    </>
  );
}
```

### Modal
```jsx
import Modal, { ConfirmModal } from './src/components/Modal';

<Modal isOpen={open} onClose={() => setOpen(false)} title="My Modal">
  Modal content here
</Modal>

<ConfirmModal
  isOpen={confirmOpen}
  onClose={() => setConfirmOpen(false)}
  onConfirm={handleDelete}
  title="Delete account?"
  message="This action cannot be undone."
  variant="danger"
/>
```

---

## Design System

All design tokens are in `src/styles/tokens.css`.

| Token | Value |
|-------|-------|
| `--color-primary` | `#1A3C6E` |
| `--color-secondary` | `#10B981` |
| `--color-white` | `#FFFFFF` |
| `--sidebar-width` | `260px` |
| `--navbar-height` | `64px` |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Or just open index.html in your browser for a full showcase!
```

> © 2025 EarnPearls. Your Time. Your Rewards.
