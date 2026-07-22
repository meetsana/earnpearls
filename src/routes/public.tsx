import { useState, type FormEvent, type ReactNode } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { api } from "../api/endpoints";
import { ErrorNotice, InlineSuccess } from "../components/AsyncStates";
import { useApiResource } from "../hooks/useApiResource";
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
        <Link to="/">Home</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/about">About</Link>
        <Link to="/login">Log in</Link>
        <Link className="button button--primary" to="/register">
          Create account
        </Link>
      </nav>
    </header>
  );
}

export function PublicLayout({ children }: { children: ReactNode }) {
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
        <div>
          <Link className="brand" to="/" aria-label="EarnPearls home">
            <span className="brand-mark" aria-hidden="true">
              ◆
            </span>
            EarnPearls
          </Link>
          <p>Your Time. Your Rewards.</p>
        </div>
        <nav aria-label="Footer navigation">
          <Link to="/about">About</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/cookies">Cookies</Link>
        </nav>
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
  const latestPosts = useApiResource(() => api.content.blog({ limit: 3 }));
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
      <section className="public-section" aria-labelledby="how-it-works-title">
        <header className="public-section-heading">
          <p className="eyebrow">How it works</p>
          <h2 id="how-it-works-title">Earn with three clear steps</h2>
        </header>
        <ol className="step-grid">
          <li className="card">
            <span aria-hidden="true">1</span>
            <h3>Create and verify</h3>
            <p>Register in an enabled country and verify your email.</p>
          </li>
          <li className="card">
            <span aria-hidden="true">2</span>
            <h3>Choose a survey</h3>
            <p>Review the reward, estimated time, and device requirements.</p>
          </li>
          <li className="card">
            <span aria-hidden="true">3</span>
            <h3>Track the reward</h3>
            <p>Follow provider-confirmed progress through each wallet state.</p>
          </li>
        </ol>
      </section>
      <section className="public-section public-callout">
        <div>
          <p className="eyebrow">Designed around evidence</p>
          <h2>Know what is available, pending, and ready</h2>
          <p>
            EarnPearls keeps survey validation, reward maturity, and withdrawal
            review visible. Availability and timing always depend on real
            provider evidence and your account eligibility.
          </p>
        </div>
        <Link className="button button--secondary" to="/faq">
          Read common questions
        </Link>
      </section>
      <section className="public-section" aria-labelledby="security-title">
        <div className="content-grid content-grid--two">
          <article className="card">
            <p className="eyebrow">Account controls</p>
            <h2 id="security-title">Security you can see</h2>
            <p>
              Email verification, revocable sessions, password controls, and a
              personal activity history help you understand account access.
            </p>
          </article>
          <article className="card">
            <p className="eyebrow">Support that stays with the case</p>
            <h2>Trackable conversations</h2>
            <p>
              Members can open a support ticket, reply securely, and follow its
              resolution without losing the conversation history.
            </p>
          </article>
        </div>
      </section>
      <section className="public-section" aria-labelledby="providers-title">
        <header className="public-section-heading">
          <p className="eyebrow">Survey availability</p>
          <h2 id="providers-title">A provider-ready platform</h2>
          <p>
            EarnPearls uses a modular integration layer. A provider is shown to
            members only after its integration, credentials, eligibility rules,
            and health controls are enabled. We do not claim partnerships that
            have not been verified.
          </p>
        </header>
      </section>
      <section className="public-section" aria-labelledby="latest-guides-title">
        <header className="public-section-heading">
          <p className="eyebrow">Learn before you earn</p>
          <h2 id="latest-guides-title">Latest guides</h2>
        </header>
        {latestPosts.state.status === "success" &&
        latestPosts.state.data.length > 0 ? (
          <div className="content-grid content-grid--three">
            {latestPosts.state.data.map((post) => (
              <article className="card blog-card" key={post.slug}>
                <p className="eyebrow">{post.categoryName ?? "EarnPearls"}</p>
                <h3>
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p>{post.excerpt}</p>
              </article>
            ))}
          </div>
        ) : (
          <article className="card">
            <h3>EarnPearls education</h3>
            <p>
              Published guides about reward statuses, account security, and
              responsible survey participation are available in the blog.
            </p>
            <Link to="/blog">Browse the blog</Link>
          </article>
        )}
      </section>
      <section className="public-section" aria-labelledby="stories-title">
        <article className="card testimonial-placeholder">
          <p className="eyebrow">Member stories</p>
          <h2 id="stories-title">Real experiences only</h2>
          <p>
            Verified member stories will appear here only with permission after
            public launch. EarnPearls does not publish invented testimonials or
            guaranteed earnings claims.
          </p>
        </article>
      </section>
      <section className="public-section public-cta">
        <p className="eyebrow">Ready when you are</p>
        <h2>Start with a verified EarnPearls account</h2>
        <p>
          Registration is available only in the countries shown in the form.
        </p>
        <Link className="button button--primary" to="/register">
          Create your account
        </Link>
      </section>
    </PublicLayout>
  );
}

export function Register() {
  const action = useAsyncAction<{ message: string }>();
  const countries = useApiResource(() => api.content.countries());
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
          {countries.state.status === "error" ? (
            <ErrorNotice
              error={countries.state.error}
              onRetry={countries.reload}
            />
          ) : null}
          <label>
            Country
            <select
              required
              disabled={countries.state.status !== "success"}
              value={form.countryCode}
              onChange={(event) =>
                setForm({ ...form, countryCode: event.target.value })
              }
            >
              <option value="">
                {countries.state.status === "loading"
                  ? "Loading enabled countries…"
                  : "Select your country"}
              </option>
              {countries.state.status === "success"
                ? countries.state.data.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))
                : null}
            </select>
            <small>Only currently enabled countries are listed.</small>
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

export function resolvePostLoginPath(state: unknown): string {
  if (typeof state !== "object" || state === null || !("returnTo" in state)) {
    return "/app";
  }

  const returnTo = (state as { returnTo?: unknown }).returnTo;
  if (typeof returnTo !== "string") return "/app";

  const isProtectedAppPath =
    returnTo === "/app" ||
    returnTo.startsWith("/app/") ||
    returnTo.startsWith("/app?") ||
    returnTo.startsWith("/app#");

  return isProtectedAppPath ? returnTo : "/app";
}

export function Login() {
  const action = useAsyncAction<unknown>();
  const { refresh } = useSessionContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    const result = await action.run(() => api.auth.login({ email, password }));
    if (result !== null) {
      await refresh();
      navigate(resolvePostLoginPath(location.state), { replace: true });
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
