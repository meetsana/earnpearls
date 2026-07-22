import { useState, type FormEvent } from "react";

import { api } from "../api/endpoints";
import type {
  AdminAnnouncement,
  AdminEmailTemplate,
  AdminLeaderboardDefinition,
  SecurityEvent,
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

function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AdminAnalytics() {
  const [rangeDays, setRangeDays] = useState(30);
  const resource = useApiResource(
    () => api.admin.analytics(rangeDays),
    [rangeDays],
  );
  return (
    <section>
      <PageHeader
        title="Analytics & reporting"
        description="Aggregated product, reward, withdrawal, and support metrics without unnecessary personal data."
      />
      <label className="compact-select">
        Reporting range
        <select
          value={rangeDays}
          onChange={(event) => setRangeDays(Number(event.target.value))}
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
          <option value={365}>Last 365 days</option>
        </select>
      </label>
      {resource.state.status === "loading" ? (
        <LoadingState label="Calculating analytics" />
      ) : null}
      {resource.state.status === "error" ? (
        <ErrorNotice error={resource.state.error} onRetry={resource.reload} />
      ) : null}
      {resource.state.status === "success" ? (
        <>
          <div className="metric-grid">
            <article className="metric-card">
              <span>Daily active users</span>
              <strong className="large-number">
                {resource.state.data.users.dailyActive}
              </strong>
              <small>
                {resource.state.data.users.weeklyActive} weekly ·{" "}
                {resource.state.data.users.monthlyActive} monthly
              </small>
            </article>
            <article className="metric-card">
              <span>Registrations</span>
              <strong className="large-number">
                {resource.state.data.users.registrations}
              </strong>
              <small>
                {resource.state.data.users.verificationRate}% verified
              </small>
            </article>
            <article className="metric-card">
              <span>Survey completion</span>
              <strong className="large-number">
                {resource.state.data.surveys.completionRate}%
              </strong>
              <small>
                {resource.state.data.surveys.validated} validated of{" "}
                {resource.state.data.surveys.started} started
              </small>
            </article>
            <article className="metric-card">
              <span>Confirmed reward points</span>
              <strong className="large-number">
                {formatIntegerString(resource.state.data.surveys.rewardPoints)}
              </strong>
            </article>
          </div>
          <div className="content-grid content-grid--two">
            <article className="card">
              <h2>Withdrawals</h2>
              <dl className="detail-list">
                <div>
                  <dt>Requested</dt>
                  <dd>{resource.state.data.withdrawals.requested}</dd>
                </div>
                <div>
                  <dt>Paid</dt>
                  <dd>{resource.state.data.withdrawals.paid}</dd>
                </div>
                <div>
                  <dt>Rejected</dt>
                  <dd>{resource.state.data.withdrawals.rejected}</dd>
                </div>
              </dl>
            </article>
            <article className="card">
              <h2>Support performance</h2>
              <dl className="detail-list">
                <div>
                  <dt>Opened</dt>
                  <dd>{resource.state.data.support.opened}</dd>
                </div>
                <div>
                  <dt>Resolved</dt>
                  <dd>{resource.state.data.support.resolved}</dd>
                </div>
                <div>
                  <dt>Average first response</dt>
                  <dd>
                    {resource.state.data.support.averageFirstResponseMinutes ===
                    null
                      ? "Not enough data"
                      : `${resource.state.data.support.averageFirstResponseMinutes} min`}
                  </dd>
                </div>
              </dl>
            </article>
          </div>
          <section className="card">
            <h2>Daily aggregates</h2>
            {resource.state.data.daily.length === 0 ? (
              <p>
                Daily rollups will appear after the operations worker completes
                its first scheduled cycle.
              </p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">Metric</th>
                      <th scope="col">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resource.state.data.daily.map((metric) => (
                      <tr key={`${metric.metricDate}-${metric.metricCode}`}>
                        <td>{metric.metricDate}</td>
                        <td>{metric.metricCode.replaceAll("_", " ")}</td>
                        <td>{metric.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      ) : null}
    </section>
  );
}

export function AdminSystemHealth() {
  const [severity, setSeverity] = useState<SecurityEvent["severity"] | "all">(
    "all",
  );
  const resource = useApiResource(async () => {
    const [events, syncRuns, jobs] = await Promise.all([
      api.admin.securityEvents(
        severity === "all" ? { limit: 200 } : { severity, limit: 200 },
      ),
      api.admin.providerSyncRuns(100),
      api.admin.jobs(100),
    ]);
    return { events, syncRuns, jobs };
  }, [severity]);
  return (
    <section>
      <PageHeader
        title="System health & security"
        description="Security signals, provider synchronization, and background execution evidence."
      />
      <label className="compact-select">
        Security severity
        <select
          value={severity}
          onChange={(event) =>
            setSeverity(event.target.value as SecurityEvent["severity"] | "all")
          }
        >
          <option value="all">All severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>
      </label>
      {resource.state.status === "loading" ? (
        <LoadingState label="Loading operational health" />
      ) : null}
      {resource.state.status === "error" ? (
        <ErrorNotice error={resource.state.error} onRetry={resource.reload} />
      ) : null}
      {resource.state.status === "success" ? (
        <>
          <div className="metric-grid">
            <article className="metric-card">
              <span>Security events</span>
              <strong className="large-number">
                {resource.state.data.events.length}
              </strong>
            </article>
            <article className="metric-card">
              <span>Failed jobs</span>
              <strong className="large-number">
                {
                  resource.state.data.jobs.filter((job) =>
                    ["failed", "dead"].includes(job.status),
                  ).length
                }
              </strong>
            </article>
            <article className="metric-card">
              <span>Provider sync runs</span>
              <strong className="large-number">
                {resource.state.data.syncRuns.length}
              </strong>
            </article>
            <article className="metric-card">
              <span>Provider sync failures</span>
              <strong className="large-number">
                {
                  resource.state.data.syncRuns.filter(
                    (run) => run.status === "failed",
                  ).length
                }
              </strong>
            </article>
          </div>
          <section className="card">
            <h2>Security events</h2>
            {resource.state.data.events.length === 0 ? (
              <p>No security events match this filter.</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Time</th>
                      <th scope="col">Severity</th>
                      <th scope="col">Event</th>
                      <th scope="col">Outcome</th>
                      <th scope="col">User</th>
                      <th scope="col">Request</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resource.state.data.events.map((event) => (
                      <tr key={event.id}>
                        <td>{formatDate(event.createdAt)}</td>
                        <td>
                          <StatusBadge status={event.severity} />
                        </td>
                        <td>{event.eventType}</td>
                        <td>{event.outcome}</td>
                        <td className="break-word">{event.userId ?? "—"}</td>
                        <td className="break-word">{event.requestId ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
          <section className="card">
            <h2>Provider synchronization</h2>
            {resource.state.data.syncRuns.length === 0 ? (
              <p>
                No provider synchronization has run. Real providers remain
                disabled until credentials and agreements are available.
              </p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Provider</th>
                      <th scope="col">Operation</th>
                      <th scope="col">Status</th>
                      <th scope="col">Records</th>
                      <th scope="col">Duration</th>
                      <th scope="col">Error</th>
                      <th scope="col">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resource.state.data.syncRuns.map((run) => (
                      <tr key={run.id}>
                        <td>{run.providerName}</td>
                        <td>{run.operation}</td>
                        <td>
                          <StatusBadge status={run.status} />
                        </td>
                        <td>
                          {run.recordsChanged}/{run.recordsReceived}
                        </td>
                        <td>
                          {run.durationMs === null
                            ? "—"
                            : `${run.durationMs} ms`}
                        </td>
                        <td>{run.errorMessage ?? "—"}</td>
                        <td>{formatDate(run.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      ) : null}
    </section>
  );
}

function AnnouncementEditor({
  announcement,
  onSaved,
}: {
  announcement?: AdminAnnouncement | undefined;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    title: announcement?.title ?? "",
    body: announcement?.body ?? "",
    severity: announcement?.severity ?? ("info" as const),
    active: announcement?.active ?? true,
    countryCodes: announcement?.countryCodes.join(", ") ?? "",
    startsAt: announcement?.startsAt
      ? new Date(announcement.startsAt).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
    endsAt: announcement?.endsAt
      ? new Date(announcement.endsAt).toISOString().slice(0, 16)
      : "",
    reason: "",
  });
  const action = useAsyncAction<AdminAnnouncement>();
  async function submit(event: FormEvent) {
    event.preventDefault();
    const body = {
      title: form.title,
      body: form.body,
      severity: form.severity,
      active: form.active,
      countryCodes: form.countryCodes
        .split(",")
        .map((value) => value.trim().toUpperCase())
        .filter(Boolean),
      startsAt: new Date(form.startsAt).toISOString(),
      endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
      reason: form.reason,
    };
    const result = await action.run(() =>
      announcement
        ? api.admin.updateAnnouncement(announcement.id, body)
        : api.admin.createAnnouncement(body),
    );
    if (result !== null) onSaved();
  }
  return (
    <form className="card form-stack" onSubmit={(event) => void submit(event)}>
      <h2>{announcement ? "Edit announcement" : "Create announcement"}</h2>
      {action.state.status === "error" ? (
        <ErrorNotice error={action.state.error} />
      ) : null}
      {action.state.status === "success" ? (
        <InlineSuccess>Announcement saved.</InlineSuccess>
      ) : null}
      <label>
        Title
        <input
          required
          minLength={3}
          maxLength={200}
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
        />
      </label>
      <label>
        Message
        <textarea
          required
          minLength={3}
          maxLength={5000}
          rows={5}
          value={form.body}
          onChange={(event) => setForm({ ...form, body: event.target.value })}
        />
      </label>
      <div className="content-grid content-grid--two">
        <label>
          Severity
          <select
            value={form.severity}
            onChange={(event) =>
              setForm({
                ...form,
                severity: event.target.value as AdminAnnouncement["severity"],
              })
            }
          >
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="danger">Danger</option>
          </select>
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(event) =>
              setForm({ ...form, active: event.target.checked })
            }
          />
          Active
        </label>
      </div>
      <label>
        Country codes (comma separated; blank means all)
        <input
          value={form.countryCodes}
          onChange={(event) =>
            setForm({ ...form, countryCodes: event.target.value })
          }
        />
      </label>
      <div className="content-grid content-grid--two">
        <label>
          Starts
          <input
            required
            type="datetime-local"
            value={form.startsAt}
            onChange={(event) =>
              setForm({ ...form, startsAt: event.target.value })
            }
          />
        </label>
        <label>
          Ends (optional)
          <input
            type="datetime-local"
            value={form.endsAt}
            onChange={(event) =>
              setForm({ ...form, endsAt: event.target.value })
            }
          />
        </label>
      </div>
      <label>
        Change reason
        <input
          required
          minLength={3}
          maxLength={1000}
          value={form.reason}
          onChange={(event) => setForm({ ...form, reason: event.target.value })}
        />
      </label>
      <button className="button button--primary">Save announcement</button>
    </form>
  );
}

function BroadcastForm() {
  const [form, setForm] = useState({
    category: "announcement" as "announcement" | "promotion" | "system",
    title: "",
    body: "",
    actionUrl: "",
    audienceType: "all" as "all" | "country" | "user",
    audienceValue: "",
    reason: "",
  });
  const action = useAsyncAction<{ message: string }>();
  async function submit(event: FormEvent) {
    event.preventDefault();
    const audience =
      form.audienceType === "country"
        ? {
            type: "country" as const,
            countryCode: form.audienceValue.toUpperCase(),
          }
        : form.audienceType === "user"
          ? { type: "user" as const, userId: form.audienceValue }
          : { type: "all" as const };
    await action.run(() =>
      api.admin.queueNotificationBroadcast({
        category: form.category,
        title: form.title,
        body: form.body,
        actionUrl: form.actionUrl || null,
        audience,
        reason: form.reason,
      }),
    );
  }
  return (
    <form className="card form-stack" onSubmit={(event) => void submit(event)}>
      <h2>Queue notification broadcast</h2>
      <p>
        Delivery preferences are enforced per member. Promotions are only
        emailed to members who opted in.
      </p>
      {action.state.status === "error" ? (
        <ErrorNotice error={action.state.error} />
      ) : null}
      {action.state.status === "success" ? (
        <InlineSuccess>{action.state.data.message}</InlineSuccess>
      ) : null}
      <label>
        Category
        <select
          value={form.category}
          onChange={(event) =>
            setForm({
              ...form,
              category: event.target.value as typeof form.category,
            })
          }
        >
          <option value="announcement">Announcement</option>
          <option value="system">System</option>
          <option value="promotion">Promotion</option>
        </select>
      </label>
      <label>
        Title
        <input
          required
          minLength={3}
          maxLength={200}
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
        />
      </label>
      <label>
        Message
        <textarea
          required
          minLength={3}
          maxLength={5000}
          rows={6}
          value={form.body}
          onChange={(event) => setForm({ ...form, body: event.target.value })}
        />
      </label>
      <label>
        EarnPearls action path (optional)
        <input
          placeholder="/app/surveys"
          maxLength={1000}
          value={form.actionUrl}
          onChange={(event) =>
            setForm({ ...form, actionUrl: event.target.value })
          }
        />
      </label>
      <div className="content-grid content-grid--two">
        <label>
          Audience
          <select
            value={form.audienceType}
            onChange={(event) =>
              setForm({
                ...form,
                audienceType: event.target.value as typeof form.audienceType,
                audienceValue: "",
              })
            }
          >
            <option value="all">All active members</option>
            <option value="country">One country</option>
            <option value="user">One user</option>
          </select>
        </label>
        {form.audienceType !== "all" ? (
          <label>
            {form.audienceType === "country" ? "Country code" : "User ID"}
            <input
              required
              value={form.audienceValue}
              onChange={(event) =>
                setForm({ ...form, audienceValue: event.target.value })
              }
            />
          </label>
        ) : null}
      </div>
      <label>
        Audit reason
        <input
          required
          minLength={3}
          maxLength={1000}
          value={form.reason}
          onChange={(event) => setForm({ ...form, reason: event.target.value })}
        />
      </label>
      <button
        className="button button--primary"
        disabled={action.state.status === "submitting"}
      >
        Queue broadcast
      </button>
    </form>
  );
}

function EmailTemplateEditor({
  template,
  onSaved,
}: {
  template: AdminEmailTemplate;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    subjectTemplate: template.subjectTemplate,
    textTemplate: template.textTemplate,
    htmlTemplate: template.htmlTemplate,
    enabled: template.enabled,
    reason: "",
  });
  const action = useAsyncAction<AdminEmailTemplate>();
  async function submit(event: FormEvent) {
    event.preventDefault();
    const result = await action.run(() =>
      api.admin.updateEmailTemplate(template.code, form),
    );
    if (result !== null) onSaved();
  }
  const securityTemplate = ["verify_email", "reset_password"].includes(
    template.code,
  );
  return (
    <form className="card form-stack" onSubmit={(event) => void submit(event)}>
      <div className="card-heading">
        <div>
          <p className="eyebrow">{template.code}</p>
          <h3>{template.displayName}</h3>
        </div>
        <StatusBadge status={form.enabled ? "enabled" : "disabled"} />
      </div>
      <p>
        Allowed variables:{" "}
        <code>
          {template.variables.map((value) => `{{${value}}}`).join(", ")}
        </code>
      </p>
      {action.state.status === "error" ? (
        <ErrorNotice error={action.state.error} />
      ) : null}
      {action.state.status === "success" ? (
        <InlineSuccess>Template revision saved and audited.</InlineSuccess>
      ) : null}
      <label>
        Subject
        <input
          required
          maxLength={300}
          value={form.subjectTemplate}
          onChange={(event) =>
            setForm({ ...form, subjectTemplate: event.target.value })
          }
        />
      </label>
      <label>
        Plain-text body
        <textarea
          className="code-input"
          required
          rows={7}
          maxLength={20_000}
          value={form.textTemplate}
          onChange={(event) =>
            setForm({ ...form, textTemplate: event.target.value })
          }
        />
      </label>
      <label>
        HTML body
        <textarea
          className="code-input"
          required
          rows={9}
          maxLength={40_000}
          value={form.htmlTemplate}
          onChange={(event) =>
            setForm({ ...form, htmlTemplate: event.target.value })
          }
        />
      </label>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={form.enabled}
          disabled={securityTemplate}
          onChange={(event) =>
            setForm({ ...form, enabled: event.target.checked })
          }
        />
        Enabled{securityTemplate ? " (required for account security)" : ""}
      </label>
      <label>
        Change reason
        <input
          required
          minLength={3}
          maxLength={1000}
          value={form.reason}
          onChange={(event) => setForm({ ...form, reason: event.target.value })}
        />
      </label>
      <button
        className="button button--primary"
        disabled={action.state.status === "submitting"}
      >
        Save template
      </button>
    </form>
  );
}

export function AdminCommunications() {
  const resource = useApiResource(async () => {
    const [announcements, templates] = await Promise.all([
      api.admin.announcements(),
      api.admin.emailTemplates(),
    ]);
    return { announcements, templates };
  });
  const [selectedId, setSelectedId] = useState("new");
  return (
    <section>
      <PageHeader
        title="Announcements & notifications"
        description="Schedule dashboard banners and queue preference-aware member communications."
      />
      {resource.state.status === "loading" ? (
        <LoadingState label="Loading communications" />
      ) : null}
      {resource.state.status === "error" ? (
        <ErrorNotice error={resource.state.error} onRetry={resource.reload} />
      ) : null}
      {resource.state.status === "success" ? (
        <div className="content-grid content-grid--two">
          <section>
            <label className="compact-select">
              Announcement
              <select
                value={selectedId}
                onChange={(event) => setSelectedId(event.target.value)}
              >
                <option value="new">Create new</option>
                {resource.state.data.announcements.map((announcement) => (
                  <option key={announcement.id} value={announcement.id}>
                    {announcement.title}
                  </option>
                ))}
              </select>
            </label>
            <AnnouncementEditor
              key={selectedId}
              announcement={resource.state.data.announcements.find(
                (announcement) => announcement.id === selectedId,
              )}
              onSaved={resource.reload}
            />
          </section>
          <BroadcastForm />
        </div>
      ) : null}
      {resource.state.status === "success" &&
      resource.state.data.announcements.length === 0 ? (
        <EmptyState title="No announcements yet">
          Create the first dashboard announcement above.
        </EmptyState>
      ) : null}
      {resource.state.status === "success" ? (
        <section className="content-studio-section">
          <div>
            <p className="eyebrow">Transactional delivery</p>
            <h2>Email templates</h2>
            <p>
              Template variables are allow-listed and HTML recipient values are
              escaped at delivery time. Every change creates an immutable
              revision.
            </p>
          </div>
          <div className="content-grid content-grid--two">
            {resource.state.data.templates.map((template) => (
              <EmailTemplateEditor
                key={`${template.code}-${template.updatedAt}`}
                template={template}
                onSaved={resource.reload}
              />
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}

function LeaderboardEditor({
  definition,
  onSaved,
}: {
  definition: AdminLeaderboardDefinition;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: definition.name,
    cadence: definition.cadence,
    metric: definition.metric,
    enabled: definition.enabled,
    maxEntries: definition.maxEntries,
    configuration: JSON.stringify(definition.configuration, null, 2),
    reason: "",
  });
  const [parseError, setParseError] = useState("");
  const action = useAsyncAction<unknown>();

  async function save(event: FormEvent) {
    event.preventDefault();
    let configuration: unknown;
    try {
      configuration = JSON.parse(form.configuration);
      setParseError("");
    } catch {
      setParseError("Configuration must be valid JSON.");
      return;
    }
    const result = await action.run(() =>
      api.admin.updateLeaderboard(definition.id, {
        name: form.name,
        cadence: form.cadence,
        metric: form.metric,
        enabled: form.enabled,
        maxEntries: form.maxEntries,
        configuration,
        reason: form.reason,
      }),
    );
    if (result !== null) onSaved();
  }

  async function reset() {
    const result = await action.run(() =>
      api.admin.resetLeaderboard(definition.id, form.reason),
    );
    if (result !== null) onSaved();
  }

  return (
    <form className="card form-stack" onSubmit={(event) => void save(event)}>
      <div className="card-heading">
        <div>
          <p className="eyebrow">{definition.code}</p>
          <h2>{definition.name}</h2>
        </div>
        <StatusBadge status={definition.enabled ? "enabled" : "disabled"} />
      </div>
      <p>{definition.exclusionCount} hidden member(s).</p>
      {action.state.status === "error" ? (
        <ErrorNotice error={action.state.error} />
      ) : null}
      {action.state.status === "success" ? (
        <InlineSuccess>Leaderboard operation completed.</InlineSuccess>
      ) : null}
      {parseError ? (
        <div className="alert alert--danger">{parseError}</div>
      ) : null}
      <label>
        Name
        <input
          required
          minLength={3}
          maxLength={200}
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />
      </label>
      <div className="content-grid content-grid--two">
        <label>
          Cadence
          <select
            value={form.cadence}
            onChange={(event) =>
              setForm({
                ...form,
                cadence: event.target
                  .value as AdminLeaderboardDefinition["cadence"],
              })
            }
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="seasonal">Seasonal</option>
          </select>
        </label>
        <label>
          Metric
          <select
            value={form.metric}
            onChange={(event) =>
              setForm({
                ...form,
                metric: event.target
                  .value as AdminLeaderboardDefinition["metric"],
              })
            }
          >
            <option value="points_earned">Points earned</option>
            <option value="surveys_completed">Surveys completed</option>
            <option value="streak_days" disabled>
              Streak days (future)
            </option>
          </select>
        </label>
      </div>
      <label>
        Maximum displayed entries
        <input
          type="number"
          min={1}
          max={1000}
          value={form.maxEntries}
          onChange={(event) =>
            setForm({ ...form, maxEntries: Number(event.target.value) })
          }
        />
      </label>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={form.enabled}
          onChange={(event) =>
            setForm({ ...form, enabled: event.target.checked })
          }
        />
        Enabled for members
      </label>
      <label>
        Configuration JSON
        <textarea
          className="code-input"
          rows={7}
          value={form.configuration}
          onChange={(event) =>
            setForm({ ...form, configuration: event.target.value })
          }
        />
        <small>
          Seasonal boards require seasonStartsAt and seasonEndsAt ISO times.
        </small>
      </label>
      <label>
        Audit reason
        <input
          required
          minLength={3}
          maxLength={1000}
          value={form.reason}
          onChange={(event) => setForm({ ...form, reason: event.target.value })}
        />
      </label>
      <div className="button-row">
        <button className="button button--primary">Save leaderboard</button>
        <button
          className="button button--danger"
          type="button"
          disabled={form.reason.length < 3}
          onClick={() => void reset()}
        >
          Reset current period
        </button>
      </div>
    </form>
  );
}

export function AdminLeaderboards() {
  const definitions = useApiResource(() => api.admin.leaderboards());
  const [selectedId, setSelectedId] = useState("");
  const activeId =
    selectedId ||
    (definitions.state.status === "success"
      ? (definitions.state.data[0]?.id ?? "")
      : "");
  const exclusions = useApiResource(
    () =>
      activeId
        ? api.admin.leaderboardExclusions(activeId)
        : Promise.resolve([]),
    [activeId],
  );
  const action = useAsyncAction<{ message: string }>();
  const [userId, setUserId] = useState("");
  const [reason, setReason] = useState("");

  async function exclude(event: FormEvent) {
    event.preventDefault();
    const result = await action.run(() =>
      api.admin.excludeLeaderboardUser(activeId, userId, reason),
    );
    if (result !== null) {
      setUserId("");
      setReason("");
      exclusions.reload();
      definitions.reload();
    }
  }

  async function restore(excludedUserId: string) {
    const result = await action.run(() =>
      api.admin.restoreLeaderboardUser(activeId, excludedUserId, reason),
    );
    if (result !== null) {
      exclusions.reload();
      definitions.reload();
    }
  }

  return (
    <section>
      <PageHeader
        title="Leaderboard management"
        description="Configure reproducible periods, ranking metrics, seasonal windows, and privacy exclusions."
      />
      {definitions.state.status === "loading" ? (
        <LoadingState label="Loading leaderboard controls" />
      ) : null}
      {definitions.state.status === "error" ? (
        <ErrorNotice
          error={definitions.state.error}
          onRetry={definitions.reload}
        />
      ) : null}
      {definitions.state.status === "success" && activeId ? (
        <>
          <label className="compact-select">
            Leaderboard
            <select
              value={activeId}
              onChange={(event) => setSelectedId(event.target.value)}
            >
              {definitions.state.data.map((definition) => (
                <option value={definition.id} key={definition.id}>
                  {definition.name}
                </option>
              ))}
            </select>
          </label>
          <div className="content-grid content-grid--two">
            <LeaderboardEditor
              key={activeId}
              definition={definitions.state.data.find(
                (definition) => definition.id === activeId,
              )!}
              onSaved={definitions.reload}
            />
            <section className="card">
              <h2>Privacy exclusions</h2>
              <p>
                Hide a member for moderation, privacy, or eligibility reasons.
                This never changes their wallet.
              </p>
              {action.state.status === "error" ? (
                <ErrorNotice error={action.state.error} />
              ) : null}
              {action.state.status === "success" ? (
                <InlineSuccess>{action.state.data.message}</InlineSuccess>
              ) : null}
              <form
                className="form-stack compact-form"
                onSubmit={(event) => void exclude(event)}
              >
                <label>
                  User ID
                  <input
                    required
                    value={userId}
                    onChange={(event) => setUserId(event.target.value)}
                  />
                </label>
                <label>
                  Audit reason
                  <textarea
                    required
                    minLength={3}
                    maxLength={1000}
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                  />
                </label>
                <button className="button button--danger">
                  Hide from leaderboard
                </button>
              </form>
              {exclusions.state.status === "loading" ? (
                <LoadingState label="Loading exclusions" />
              ) : null}
              {exclusions.state.status === "error" ? (
                <ErrorNotice
                  error={exclusions.state.error}
                  onRetry={exclusions.reload}
                />
              ) : null}
              {exclusions.state.status === "success" ? (
                <div className="stack-sm">
                  {exclusions.state.data.map((exclusion) => (
                    <article className="compact-record" key={exclusion.userId}>
                      <div>
                        <strong>{exclusion.displayName}</strong>
                        <small>{exclusion.email}</small>
                        <p>{exclusion.reason}</p>
                      </div>
                      <button
                        className="button button--secondary"
                        type="button"
                        disabled={reason.length < 3}
                        onClick={() => void restore(exclusion.userId)}
                      >
                        Restore
                      </button>
                    </article>
                  ))}
                </div>
              ) : null}
            </section>
          </div>
        </>
      ) : null}
    </section>
  );
}
