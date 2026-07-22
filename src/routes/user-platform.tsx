import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { api } from "../api/endpoints";
import type {
  LeaderboardDefinition,
  NotificationPreferences,
  NotificationStatus,
  SupportTicket,
  UserProfile,
} from "../api/types";
import {
  EmptyState,
  ErrorNotice,
  InlineSuccess,
  LoadingState,
} from "../components/AsyncStates";
import { StatusBadge } from "../components/StatusBadge";
import { useApiResource } from "../hooks/useApiResource";
import { useAsyncAction } from "../hooks/useAsyncAction";
import { formatIntegerString } from "../lib/money";
import { PageHeader } from "./ScreenSkeleton";

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function Notifications() {
  const [status, setStatus] = useState<NotificationStatus | "all">("all");
  const resource = useApiResource(
    () =>
      api.notifications.list(
        status === "all" ? { limit: 50 } : { status, limit: 50 },
      ),
    [status],
  );
  const action = useAsyncAction<unknown>();

  async function changeStatus(
    notificationId: string,
    nextStatus: "read" | "archived" | "deleted",
  ) {
    const result = await action.run(() =>
      api.notifications.setStatus(notificationId, nextStatus),
    );
    if (result !== null) resource.reload();
  }

  async function markAllRead() {
    const result = await action.run(() => api.notifications.markAllRead());
    if (result !== null) resource.reload();
  }

  return (
    <section>
      <PageHeader
        title="Notifications"
        description="Reward, withdrawal, security, support, and platform updates."
        actions={
          <button
            className="button button--secondary"
            type="button"
            disabled={action.state.status === "submitting"}
            onClick={() => void markAllRead()}
          >
            Mark all as read
          </button>
        }
      />
      <label className="compact-select">
        Show
        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as NotificationStatus | "all")
          }
        >
          <option value="all">All notifications</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="archived">Archived</option>
        </select>
      </label>
      {action.state.status === "error" ? (
        <ErrorNotice error={action.state.error} />
      ) : null}
      {resource.state.status === "loading" ? (
        <LoadingState label="Loading notifications" />
      ) : null}
      {resource.state.status === "error" ? (
        <ErrorNotice error={resource.state.error} onRetry={resource.reload} />
      ) : null}
      {resource.state.status === "success" &&
      resource.state.data.items.length === 0 ? (
        <EmptyState title="You are all caught up">
          Notifications will appear here when there is an account update.
        </EmptyState>
      ) : null}
      {resource.state.status === "success" ? (
        <div className="notification-list">
          {resource.state.data.items.map((notification) => (
            <article
              className={`card notification-card notification-card--${notification.status}`}
              key={notification.id}
            >
              <div className="card-heading">
                <div>
                  <p className="eyebrow">{notification.category}</p>
                  <h2>{notification.title}</h2>
                </div>
                <StatusBadge status={notification.status} />
              </div>
              <p>{notification.body}</p>
              <footer className="card-footer">
                <time dateTime={notification.createdAt}>
                  {formatDate(notification.createdAt)}
                </time>
                <div className="button-row">
                  {notification.actionUrl ? (
                    <Link
                      className="button button--secondary"
                      to={notification.actionUrl}
                      onClick={() => void changeStatus(notification.id, "read")}
                    >
                      View update
                    </Link>
                  ) : null}
                  {notification.status === "unread" ? (
                    <button
                      className="button button--ghost-link"
                      type="button"
                      onClick={() => void changeStatus(notification.id, "read")}
                    >
                      Mark read
                    </button>
                  ) : null}
                  {notification.status !== "archived" ? (
                    <button
                      className="button button--ghost-link"
                      type="button"
                      onClick={() =>
                        void changeStatus(notification.id, "archived")
                      }
                    >
                      Archive
                    </button>
                  ) : null}
                </div>
              </footer>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export function Leaderboards() {
  const definitions = useApiResource(() => api.leaderboards.list());
  const [selectedCode, setSelectedCode] = useState("");
  const activeCode =
    selectedCode ||
    (definitions.state.status === "success"
      ? (definitions.state.data[0]?.code ?? "")
      : "");
  const board = useApiResource(
    () => api.leaderboards.get(activeCode),
    [activeCode],
  );
  const history = useApiResource(
    () =>
      activeCode
        ? api.leaderboards.history(activeCode, 8)
        : Promise.resolve({ code: "", periods: [] }),
    [activeCode],
  );

  return (
    <section>
      <PageHeader
        title="Leaderboards"
        description="Opt-in public rankings use display names and confirmed activity only."
      />
      {definitions.state.status === "loading" ? (
        <LoadingState label="Loading leaderboards" />
      ) : null}
      {definitions.state.status === "error" ? (
        <ErrorNotice
          error={definitions.state.error}
          onRetry={definitions.reload}
        />
      ) : null}
      {definitions.state.status === "success" &&
      definitions.state.data.length === 0 ? (
        <EmptyState title="No leaderboard is active">
          Rankings will appear when an administrator enables a definition.
        </EmptyState>
      ) : null}
      {definitions.state.status === "success" && activeCode ? (
        <>
          <label className="compact-select">
            Ranking
            <select
              value={activeCode}
              onChange={(event) => setSelectedCode(event.target.value)}
            >
              {definitions.state.data.map(
                (definition: LeaderboardDefinition) => (
                  <option key={definition.code} value={definition.code}>
                    {definition.name}
                  </option>
                ),
              )}
            </select>
          </label>
          {board.state.status === "loading" ? (
            <LoadingState label="Calculating rankings" />
          ) : null}
          {board.state.status === "error" ? (
            <ErrorNotice error={board.state.error} onRetry={board.reload} />
          ) : null}
          {board.state.status === "success" ? (
            <>
              <div className="card leaderboard-summary">
                <div>
                  <p className="eyebrow">{board.state.data.cadence}</p>
                  <h2>{board.state.data.name}</h2>
                  <p>
                    {formatDate(board.state.data.period.startsAt)} through{" "}
                    {formatDate(board.state.data.period.endsAt)}
                  </p>
                </div>
                {board.state.data.currentUserEntry ? (
                  <div>
                    <span>Your rank</span>
                    <strong>#{board.state.data.currentUserEntry.rank}</strong>
                  </div>
                ) : (
                  <p>You do not have eligible activity in this period.</p>
                )}
              </div>
              {board.state.data.entries.length === 0 ? (
                <EmptyState title="No eligible activity yet">
                  Confirmed activity for this period will appear here.
                </EmptyState>
              ) : (
                <div className="table-wrap card">
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">Rank</th>
                        <th scope="col">Member</th>
                        <th scope="col">Score</th>
                        <th scope="col">Points earned</th>
                        <th scope="col">Surveys</th>
                      </tr>
                    </thead>
                    <tbody>
                      {board.state.data.entries.map((entry) => (
                        <tr
                          className={entry.isCurrentUser ? "current-row" : ""}
                          key={`${entry.rank}-${entry.displayName}`}
                        >
                          <td>#{entry.rank}</td>
                          <td>
                            {entry.displayName}
                            {entry.isCurrentUser ? " (you)" : ""}
                          </td>
                          <td>{formatIntegerString(entry.metricValue)}</td>
                          <td>{formatIntegerString(entry.pointsEarned)}</td>
                          <td>{entry.surveysCompleted}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : null}
          {history.state.status === "loading" ? (
            <LoadingState label="Loading historical rankings" />
          ) : null}
          {history.state.status === "error" ? (
            <ErrorNotice error={history.state.error} onRetry={history.reload} />
          ) : null}
          {history.state.status === "success" &&
          history.state.data.periods.length > 0 ? (
            <section className="card leaderboard-history">
              <h2>Previous periods</h2>
              {history.state.data.periods.map((period) => (
                <details key={period.id}>
                  <summary>
                    {new Intl.DateTimeFormat(undefined, {
                      dateStyle: "medium",
                    }).format(new Date(period.startsAt))}
                    {" — "}
                    {new Intl.DateTimeFormat(undefined, {
                      dateStyle: "medium",
                    }).format(new Date(period.endsAt))}
                    {` · ${period.status}`}
                  </summary>
                  <ol>
                    {period.entries.slice(0, 10).map((entry) => (
                      <li key={`${period.id}-${entry.rank}`}>
                        <span>
                          #{entry.rank} {entry.displayName}
                          {entry.isCurrentUser ? " (you)" : ""}
                        </span>
                        <strong>
                          {formatIntegerString(entry.metricValue)}
                        </strong>
                      </li>
                    ))}
                  </ol>
                </details>
              ))}
            </section>
          ) : null}
        </>
      ) : null}
    </section>
  );
}

function TicketList({ tickets }: { tickets: SupportTicket[] }) {
  if (tickets.length === 0) {
    return (
      <EmptyState title="No support tickets">
        Open a ticket when you need help with your account or rewards.
      </EmptyState>
    );
  }
  return (
    <div className="support-ticket-list">
      {tickets.map((ticket) => (
        <Link
          className="card support-ticket-card"
          to={ticket.id}
          key={ticket.id}
        >
          <div>
            <p className="eyebrow">Ticket #{ticket.ticketNumber}</p>
            <h2>{ticket.subject}</h2>
            <p>{ticket.categoryName}</p>
          </div>
          <div>
            <StatusBadge status={ticket.status} />
            <time dateTime={ticket.lastMessageAt}>
              {formatDate(ticket.lastMessageAt)}
            </time>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function SupportCenter() {
  const resource = useApiResource(async () => {
    const [categories, tickets] = await Promise.all([
      api.support.categories(),
      api.support.tickets(),
    ]);
    return { categories, tickets };
  });
  const action = useAsyncAction<SupportTicket>();
  const [form, setForm] = useState({
    categoryCode: "",
    subject: "",
    message: "",
  });

  async function createTicket(event: FormEvent) {
    event.preventDefault();
    const result = await action.run(() =>
      api.support.create({ ...form, priority: "normal" }),
    );
    if (result !== null) {
      setForm({ categoryCode: "", subject: "", message: "" });
      resource.reload();
    }
  }

  return (
    <section>
      <PageHeader
        title="Support Center"
        description="Open a case and keep the full conversation in one secure place."
      />
      {resource.state.status === "loading" ? (
        <LoadingState label="Loading support center" />
      ) : null}
      {resource.state.status === "error" ? (
        <ErrorNotice error={resource.state.error} onRetry={resource.reload} />
      ) : null}
      {resource.state.status === "success" ? (
        <div className="support-layout">
          <section className="card">
            <h2>Open a support ticket</h2>
            {action.state.status === "error" ? (
              <ErrorNotice error={action.state.error} />
            ) : null}
            {action.state.status === "success" ? (
              <InlineSuccess>
                Ticket #{action.state.data.ticketNumber} was created.
              </InlineSuccess>
            ) : null}
            <form
              className="form-stack"
              onSubmit={(event) => void createTicket(event)}
            >
              <label>
                Topic
                <select
                  required
                  value={form.categoryCode}
                  onChange={(event) =>
                    setForm({ ...form, categoryCode: event.target.value })
                  }
                >
                  <option value="">Choose a topic</option>
                  {resource.state.data.categories.map((category) => (
                    <option key={category.code} value={category.code}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Subject
                <input
                  required
                  minLength={3}
                  maxLength={200}
                  value={form.subject}
                  onChange={(event) =>
                    setForm({ ...form, subject: event.target.value })
                  }
                />
              </label>
              <label>
                Message
                <textarea
                  required
                  minLength={10}
                  maxLength={10_000}
                  rows={7}
                  value={form.message}
                  onChange={(event) =>
                    setForm({ ...form, message: event.target.value })
                  }
                />
              </label>
              <button
                className="button button--primary"
                disabled={action.state.status === "submitting"}
              >
                {action.state.status === "submitting"
                  ? "Opening ticket…"
                  : "Open ticket"}
              </button>
            </form>
          </section>
          <section>
            <h2>Your tickets</h2>
            <TicketList tickets={resource.state.data.tickets} />
          </section>
        </div>
      ) : null}
    </section>
  );
}

export function SupportTicketDetail() {
  const { ticketId = "" } = useParams();
  const resource = useApiResource(
    () => api.support.ticket(ticketId),
    [ticketId],
  );
  const action = useAsyncAction<SupportTicket>();
  const [message, setMessage] = useState("");

  async function reply(event: FormEvent) {
    event.preventDefault();
    const result = await action.run(() =>
      api.support.reply(ticketId, message.trim()),
    );
    if (result !== null) {
      setMessage("");
      resource.reload();
    }
  }

  return (
    <section>
      <PageHeader
        title="Support conversation"
        description="Replies are added to the permanent case history."
        actions={
          <Link className="button button--secondary" to="/app/support">
            Back to Support Center
          </Link>
        }
      />
      {resource.state.status === "loading" ? (
        <LoadingState label="Loading ticket" />
      ) : null}
      {resource.state.status === "error" ? (
        <ErrorNotice error={resource.state.error} onRetry={resource.reload} />
      ) : null}
      {resource.state.status === "success" ? (
        <>
          <article className="card ticket-heading">
            <div>
              <p className="eyebrow">
                Ticket #{resource.state.data.ticketNumber}
              </p>
              <h2>{resource.state.data.subject}</h2>
              <p>{resource.state.data.categoryName}</p>
            </div>
            <StatusBadge status={resource.state.data.status} />
          </article>
          <div className="message-thread" aria-label="Ticket messages">
            {(resource.state.data.messages ?? []).map((entry) => (
              <article
                className={`message-bubble message-bubble--${entry.authorType}`}
                key={entry.id}
              >
                <header>
                  <strong>{entry.authorName}</strong>
                  <time dateTime={entry.createdAt}>
                    {formatDate(entry.createdAt)}
                  </time>
                </header>
                <p>{entry.body}</p>
              </article>
            ))}
          </div>
          {resource.state.data.status !== "closed" ? (
            <form
              className="card form-stack"
              onSubmit={(event) => void reply(event)}
            >
              <h2>Reply</h2>
              {action.state.status === "error" ? (
                <ErrorNotice error={action.state.error} />
              ) : null}
              <label>
                Message
                <textarea
                  required
                  minLength={2}
                  maxLength={10_000}
                  rows={5}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                />
              </label>
              <button
                className="button button--primary"
                disabled={action.state.status === "submitting"}
              >
                Send reply
              </button>
            </form>
          ) : null}
        </>
      ) : null}
    </section>
  );
}

function ProfileForm({
  profile,
  onSaved,
}: {
  profile: UserProfile;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    displayName: profile.user.displayName,
    timezone: profile.timezone,
    displayCurrency: profile.displayCurrency,
    bio: profile.bio,
    marketingOptIn: profile.marketingOptIn,
  });
  const action = useAsyncAction<UserProfile>();

  async function submit(event: FormEvent) {
    event.preventDefault();
    const result = await action.run(() => api.users.updateProfile(form));
    if (result !== null) onSaved();
  }

  return (
    <section className="card">
      <h2>Personal details</h2>
      <p>Country and email changes require support verification.</p>
      {action.state.status === "error" ? (
        <ErrorNotice error={action.state.error} />
      ) : null}
      {action.state.status === "success" ? (
        <InlineSuccess>Profile saved.</InlineSuccess>
      ) : null}
      <form className="form-stack" onSubmit={(event) => void submit(event)}>
        <label>
          Display name
          <input
            required
            minLength={2}
            maxLength={100}
            value={form.displayName}
            onChange={(event) =>
              setForm({ ...form, displayName: event.target.value })
            }
          />
        </label>
        <label>
          Timezone
          <input
            required
            maxLength={100}
            placeholder="UTC"
            value={form.timezone}
            onChange={(event) =>
              setForm({ ...form, timezone: event.target.value })
            }
          />
        </label>
        <label>
          Display currency
          <input
            required
            minLength={3}
            maxLength={3}
            pattern="[A-Za-z]{3}"
            value={form.displayCurrency}
            onChange={(event) =>
              setForm({
                ...form,
                displayCurrency: event.target.value.toUpperCase(),
              })
            }
          />
          <small>USD values remain the platform source of truth.</small>
        </label>
        <label>
          Bio
          <textarea
            maxLength={500}
            rows={4}
            value={form.bio}
            onChange={(event) => setForm({ ...form, bio: event.target.value })}
          />
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.marketingOptIn}
            onChange={(event) =>
              setForm({ ...form, marketingOptIn: event.target.checked })
            }
          />
          Receive optional EarnPearls marketing messages
        </label>
        <button
          className="button button--primary"
          disabled={action.state.status === "submitting"}
        >
          Save profile
        </button>
      </form>
    </section>
  );
}

const preferenceLabels: ReadonlyArray<[keyof NotificationPreferences, string]> =
  [
    ["emailRewardUpdates", "Email: reward updates"],
    ["emailWithdrawalUpdates", "Email: withdrawal updates"],
    ["emailSecurityAlerts", "Email: security alerts"],
    ["emailSupportUpdates", "Email: support updates"],
    ["emailPlatformAnnouncements", "Email: platform announcements"],
    ["emailMarketing", "Email: optional marketing"],
    ["inAppRewardUpdates", "In app: reward updates"],
    ["inAppWithdrawalUpdates", "In app: withdrawal updates"],
    ["inAppSecurityAlerts", "In app: security alerts"],
    ["inAppSupportUpdates", "In app: support updates"],
    ["inAppPlatformAnnouncements", "In app: platform announcements"],
  ];

function PreferencesForm({
  preferences,
  onSaved,
}: {
  preferences: NotificationPreferences;
  onSaved: () => void;
}) {
  const [form, setForm] = useState(preferences);
  const action = useAsyncAction<NotificationPreferences>();
  async function submit(event: FormEvent) {
    event.preventDefault();
    const result = await action.run(() => api.users.updatePreferences(form));
    if (result !== null) onSaved();
  }
  return (
    <section className="card">
      <h2>Notification preferences</h2>
      <p>Critical account security messages may still be sent when required.</p>
      {action.state.status === "error" ? (
        <ErrorNotice error={action.state.error} />
      ) : null}
      {action.state.status === "success" ? (
        <InlineSuccess>Preferences saved.</InlineSuccess>
      ) : null}
      <form className="form-stack" onSubmit={(event) => void submit(event)}>
        <div className="checkbox-grid">
          {preferenceLabels.map(([key, label]) => (
            <label className="checkbox-row" key={key}>
              <input
                type="checkbox"
                checked={form[key]}
                onChange={(event) =>
                  setForm({ ...form, [key]: event.target.checked })
                }
              />
              {label}
            </label>
          ))}
        </div>
        <button
          className="button button--primary"
          disabled={action.state.status === "submitting"}
        >
          Save preferences
        </button>
      </form>
    </section>
  );
}

function PasswordForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const action = useAsyncAction<{ message: string }>();
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (form.newPassword !== form.confirmPassword) return;
    const result = await action.run(() =>
      api.users.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      }),
    );
    if (result !== null)
      navigate("/login", {
        replace: true,
        state: { message: "Password changed. Sign in again." },
      });
  }
  const mismatch =
    form.confirmPassword.length > 0 &&
    form.newPassword !== form.confirmPassword;
  return (
    <section className="card">
      <h2>Change password</h2>
      <p>Changing your password revokes other sessions.</p>
      {action.state.status === "error" ? (
        <ErrorNotice error={action.state.error} />
      ) : null}
      <form className="form-stack" onSubmit={(event) => void submit(event)}>
        <label>
          Current password
          <input
            required
            type="password"
            autoComplete="current-password"
            value={form.currentPassword}
            onChange={(event) =>
              setForm({ ...form, currentPassword: event.target.value })
            }
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
            value={form.newPassword}
            onChange={(event) =>
              setForm({ ...form, newPassword: event.target.value })
            }
          />
        </label>
        <label>
          Confirm new password
          <input
            required
            type="password"
            minLength={12}
            maxLength={128}
            autoComplete="new-password"
            aria-invalid={mismatch}
            value={form.confirmPassword}
            onChange={(event) =>
              setForm({ ...form, confirmPassword: event.target.value })
            }
          />
          <small>
            {mismatch
              ? "The passwords do not match."
              : "Use at least 12 characters."}
          </small>
        </label>
        <button
          className="button button--danger"
          disabled={mismatch || action.state.status === "submitting"}
        >
          Change password
        </button>
      </form>
    </section>
  );
}

export function AccountProfile() {
  const resource = useApiResource(async () => {
    const [profile, preferences, activity] = await Promise.all([
      api.users.profile(),
      api.users.preferences(),
      api.users.activity(25),
    ]);
    return { profile, preferences, activity };
  });

  return (
    <section>
      <PageHeader
        title="Profile & preferences"
        description="Manage your public display details, communication choices, and password."
      />
      {resource.state.status === "loading" ? (
        <LoadingState label="Loading profile" />
      ) : null}
      {resource.state.status === "error" ? (
        <ErrorNotice error={resource.state.error} onRetry={resource.reload} />
      ) : null}
      {resource.state.status === "success" ? (
        <>
          <div className="profile-completion card">
            <div>
              <p className="eyebrow">Profile completeness</p>
              <strong>{resource.state.data.profile.profileCompletion}%</strong>
            </div>
            <progress
              max="100"
              value={resource.state.data.profile.profileCompletion}
            >
              {resource.state.data.profile.profileCompletion}%
            </progress>
          </div>
          <div className="content-grid content-grid--two profile-grid">
            <ProfileForm
              profile={resource.state.data.profile}
              onSaved={resource.reload}
            />
            <PreferencesForm
              preferences={resource.state.data.preferences}
              onSaved={resource.reload}
            />
            <PasswordForm />
            <section className="card">
              <h2>Recent account activity</h2>
              {resource.state.data.activity.length === 0 ? (
                <p>No account activity recorded yet.</p>
              ) : (
                <ol className="activity-list">
                  {resource.state.data.activity.map((event) => (
                    <li key={event.id}>
                      <div>
                        <strong>{event.summary}</strong>
                        <small>{event.eventType}</small>
                      </div>
                      <time dateTime={event.createdAt}>
                        {formatDate(event.createdAt)}
                      </time>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </div>
        </>
      ) : null}
    </section>
  );
}
