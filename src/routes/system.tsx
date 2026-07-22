import { Link } from "react-router-dom";

import { PageHeader } from "./ScreenSkeleton";

export function AccessDenied() {
  return (
    <section className="system-page">
      <PageHeader
        title="You don’t have access to this page"
        description="This area is controlled by your account capabilities."
      />
      <Link className="button button--primary" to="/app">
        Return to dashboard
      </Link>
    </section>
  );
}

export function NotFound() {
  return (
    <main className="public-main system-page">
      <PageHeader
        title="Page not found"
        description="The requested page does not exist."
      />
      <Link className="button button--primary" to="/">
        Go home
      </Link>
    </main>
  );
}

export function Offline() {
  return (
    <section className="system-page">
      <PageHeader
        title="You’re offline"
        description="Check your connection and try again."
      />
      <p>
        No financial action is shown as complete unless the server confirms it.
      </p>
    </section>
  );
}

export function Maintenance({ message }: { message: string }) {
  return (
    <main className="public-main system-page">
      <p className="eyebrow">Planned platform pause</p>
      <PageHeader
        title="EarnPearls is temporarily unavailable"
        description={message}
      />
      <p>
        Wallet and reward data remain stored on the server. No financial action
        is shown as complete during maintenance.
      </p>
      <Link className="button button--secondary" to="/login">
        Administrator sign in
      </Link>
    </main>
  );
}

export function FeatureUnavailable() {
  return (
    <main className="public-main system-page">
      <PageHeader
        title="This feature is not available"
        description="EarnPearls has temporarily hidden this area through a platform feature control."
      />
      <Link className="button button--primary" to="/app">
        Return to dashboard
      </Link>
    </main>
  );
}
