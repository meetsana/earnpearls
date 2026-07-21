import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { api } from "../api/endpoints";
import { ErrorNotice, InlineSuccess } from "../components/AsyncStates";
import { useAsyncAction } from "../hooks/useAsyncAction";
import { useSessionContext } from "../session/SessionProvider";

function PublicHeader() {
  return (
    <header className="public-header">
      <Link className="brand" to="/" aria-label="EarnPearls home">
        <span className="brand-mark" aria-hidden="true">
          ◆
        </span>
        EarnPearls
      </Link>
      <nav aria-label="Public navigation">
        <Link to="/login">Log in</Link>
        <Link className="button button--primary" to="/register">
          Create account
        </Link>
      </nav>
    </header>
  );
}

function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="public-layout">
      <a className="skip-link" href="#public-content">
        Skip to main content
      </a>
      <PublicHeader />
      <main id="public-content" className="public-main">
        {children}
      </main>
      <footer className="public-footer">
        EarnPearls · Your Time. Your Rewards.
      </footer>
    </div>
  );
}

function AuthCard({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <PublicLayout>
      <section className="auth-card" aria-labelledby="auth-title">
        <h1 id="auth-title">{title}</h1>
        <p>{intro}</p>
        {children}
      </section>
    </PublicLayout>
  );
}

export function Home() {
  return (
    <PublicLayout>
      <section className="hero">
        <div>
          <p className="eyebrow">Survey rewards, clearly tracked</p>
          <h1>Your Time. Your Rewards.</h1>
          <p className="hero-copy">
            Discover eligible surveys and follow each confirmed reward through a
            transparent wallet lifecycle.
          </p>
          <div className="button-row">
            <Link className="button button--primary" to="/register">
              Create an account
            </Link>
            <Link className="button button--secondary" to="/login">
              Log in
            </Link>
          </div>
        </div>
        <aside className="trust-card" aria-label="How EarnPearls works">
          <h2>Built for clarity</h2>
          <ul className="check-list">
            <li>See only surveys the server marks available to you.</li>
            <li>
              Track pending, validated, mature, and withdrawable rewards
              separately.
            </li>
            <li>
              View payout methods and fees only when they are enabled for your
              account.
            </li>
          </ul>
        </aside>
      </section>
      <section className="feature-grid" aria-label="Platform principles">
        <article className="card">
          <h2>Exact balances</h2>
          <p>Points and USD values come directly from the wallet service.</p>
        </article>
        <article className="card">
          <h2>Visible status</h2>
          <p>
            Reward and withdrawal states are never estimated in the browser.
          </p>
        </article>
        <article className="card">
          <h2>Secure access</h2>
          <p>
            Revocable sessions and capability-based controls protect sensitive
            actions.
          </p>
        </article>
      </section>
    </PublicLayout>
  );
}

export function Register() {
  const action = useAsyncAction<{ message: string }>();
  const [form, setForm] = useState({
    email: "",
    password: "",
    displayName: "",
    countryCode: "",
  });

  async function submit(event: FormEvent) {
    event.preventDefault();
    await action.run(() =>
      api.auth.register({
        ...form,
        countryCode: form.countryCode.trim().toUpperCase(),
      }),
    );
  }

  return (
    <AuthCard
      title="Create your account"
      intro="Verify your email before earning or withdrawing."
    >
      {action.state.status === "error" ? (
        <ErrorNotice error={action.state.error} />
      ) : null}
      {action.state.status === "success" ? (
        <InlineSuccess>{action.state.data.message}</InlineSuccess>
      ) : (
        <form className="form-stack" onSubmit={(event) => void submit(event)}>
          <label>
            Display name
            <input
              required
              maxLength={100}
              autoComplete="name"
              value={form.displayName}
              onChange={(event) =>
                setForm({ ...form, displayName: event.target.value })
              }
            />
          </label>
          <label>
            Email
            <input
              required
              type="email"
              maxLength={254}
              autoComplete="email"
              value={form.email}
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
            />
          </label>
          <label>
            Country code
            <input
              required
              minLength={2}
              maxLength={2}
              pattern="[A-Za-z]{2}"
              autoCapitalize="characters"
              aria-describedby="country-hint"
              value={form.countryCode}
              onChange={(event) =>
                setForm({ ...form, countryCode: event.target.value })
              }
            />
            <small id="country-hint">
              Your two-letter ISO country code, for example US.
            </small>
          </label>
          <label>
            Password
            <input
              required
              type="password"
              minLength={12}
              maxLength={128}
              autoComplete="new-password"
              value={form.password}
              onChange={(event) =>
                setForm({ ...form, password: event.target.value })
              }
            />
            <small>Use at least 12 characters.</small>
          </label>
          <button
            className="button button--primary"
            disabled={action.state.status === "submitting"}
          >
            {action.state.status === "submitting"
              ? "Creating account…"
              : "Create account"}
          </button>
        </form>
      )}
      <p className="auth-switch">
        Already registered? <Link to="/login">Log in</Link>
      </p>
    </AuthCard>
  );
}

export function Login() {
  const action = useAsyncAction<unknown>();
  const { refresh } = useSessionContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    const result = await action.run(() => api.auth.login({ email, password }));
    if (result !== null) {
      await refresh();
      navigate("/app", { replace: true });
    }
  }

  return (
    <AuthCard title="Welcome back" intro="Log in to your EarnPearls account.">
      {action.state.status === "error" ? (
        <ErrorNotice error={action.state.error} />
      ) : null}
      <form className="form-stack" onSubmit={(event) => void submit(event)}>
        <label>
          Email
          <input
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          Password
          <input
            required
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button
          className="button button--primary"
          disabled={action.state.status === "submitting"}
        >
          {action.state.status === "submitting" ? "Logging in…" : "Log in"}
        </button>
      </form>
      <div className="auth-links">
        <Link to="/forgot-password">Forgot password?</Link>
        <Link to="/register">Create account</Link>
      </div>
    </AuthCard>
  );
}

export function VerifyEmail() {
  const [params] = useSearchParams();
  const [token, setToken] = useState(params.get("token") ?? "");
  const action = useAsyncAction<{ message: string }>();
  return (
    <AuthCard
      title="Verify your email"
      intro="Enter the secure token from your verification link."
    >
      {action.state.status === "error" ? (
        <ErrorNotice error={action.state.error} />
      ) : null}
      {action.state.status === "success" ? (
        <>
          <InlineSuccess>{action.state.data.message}</InlineSuccess>
          <Link className="button button--primary" to="/login">
            Continue to login
          </Link>
        </>
      ) : (
        <form
          className="form-stack"
          onSubmit={(event) => {
            event.preventDefault();
            void action.run(() => api.auth.verifyEmail({ token }));
          }}
        >
          <label>
            Verification token
            <textarea
              required
              minLength={40}
              maxLength={200}
              rows={3}
              value={token}
              onChange={(event) => setToken(event.target.value)}
            />
          </label>
          <button
            className="button button--primary"
            disabled={action.state.status === "submitting"}
          >
            Verify email
          </button>
        </form>
      )}
    </AuthCard>
  );
}

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const action = useAsyncAction<{ message: string }>();
  return (
    <AuthCard
      title="Reset your password"
      intro="We’ll queue reset instructions if the account exists."
    >
      {action.state.status === "error" ? (
        <ErrorNotice error={action.state.error} />
      ) : null}
      {action.state.status === "success" ? (
        <InlineSuccess>{action.state.data.message}</InlineSuccess>
      ) : (
        <form
          className="form-stack"
          onSubmit={(event) => {
            event.preventDefault();
            void action.run(() => api.auth.requestPasswordReset({ email }));
          }}
        >
          <label>
            Email
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <button
            className="button button--primary"
            disabled={action.state.status === "submitting"}
          >
            Send reset instructions
          </button>
        </form>
      )}
    </AuthCard>
  );
}

export function ResetPassword() {
  const [params] = useSearchParams();
  const [token, setToken] = useState(params.get("token") ?? "");
  const [password, setPassword] = useState("");
  const action = useAsyncAction<{ message: string }>();
  return (
    <AuthCard
      title="Choose a new password"
      intro="Reset links are single-use and time limited."
    >
      {action.state.status === "error" ? (
        <ErrorNotice error={action.state.error} />
      ) : null}
      {action.state.status === "success" ? (
        <>
          <InlineSuccess>{action.state.data.message}</InlineSuccess>
          <Link className="button button--primary" to="/login">
            Log in
          </Link>
        </>
      ) : (
        <form
          className="form-stack"
          onSubmit={(event) => {
            event.preventDefault();
            void action.run(() =>
              api.auth.confirmPasswordReset({ token, password }),
            );
          }}
        >
          <label>
            Reset token
            <textarea
              required
              minLength={40}
              maxLength={200}
              rows={3}
              value={token}
              onChange={(event) => setToken(event.target.value)}
            />
          </label>
          <label>
            New password
            <input
              required
              type="password"
              minLength={12}
              maxLength={128}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <button
            className="button button--primary"
            disabled={action.state.status === "submitting"}
          >
            Reset password
          </button>
        </form>
      )}
    </AuthCard>
  );
}
