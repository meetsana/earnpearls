import { useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";

import { api } from "../api/endpoints";
import type {
  AdminProvider,
  AdminSetting,
  AdminSupportTicket,
  AdminWithdrawalMethod,
  CountryAvailability,
  LimitTemplate,
  SupportTicketPriority,
  SupportTicketStatus,
} from "../api/types";
import {
  EmptyState,
  ErrorNotice,
  InlineSuccess,
  LoadingState,
} from "../components/AsyncStates";
import { MoneyValue } from "../components/MoneyValue";
import { StatusBadge } from "../components/StatusBadge";
import { useApiResource } from "../hooks/useApiResource";
import { useAsyncAction } from "../hooks/useAsyncAction";
import { PageHeader } from "./ScreenSkeleton";

function formatDate(value: string | null): string {
  if (!value) return "Never";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function SettingEditor({
  setting,
  onChanged,
}: {
  setting: AdminSetting;
  onChanged: () => void;
}) {
  const [value, setValue] = useState(JSON.stringify(setting.value, null, 2));
  const [isPublic, setIsPublic] = useState(setting.public);
  const [reason, setReason] = useState("");
  const [parseError, setParseError] = useState("");
  const action = useAsyncAction<AdminSetting>();

  async function submit(event: FormEvent) {
    event.preventDefault();
    let parsed: unknown;
    try {
      parsed = JSON.parse(value);
      setParseError("");
    } catch {
      setParseError("Enter valid JSON before saving.");
      return;
    }
    const result = await action.run(() =>
      api.admin.updateSetting(setting.key, {
        value: parsed,
        public: isPublic,
        reason,
      }),
    );
    if (result !== null) {
      setReason("");
      onChanged();
    }
  }

  return (
    <article className="card admin-editor-card">
      <div className="card-heading">
        <div>
          <h2>{setting.key}</h2>
          <small>Updated {formatDate(setting.updatedAt)}</small>
        </div>
        <StatusBadge status={setting.public ? "public" : "private"} />
      </div>
      {action.state.status === "error" ? (
        <ErrorNotice error={action.state.error} />
      ) : null}
      {action.state.status === "success" ? (
        <InlineSuccess>Setting saved with a revision record.</InlineSuccess>
      ) : null}
      {parseError ? (
        <div className="alert alert--danger">{parseError}</div>
      ) : null}
      <form className="form-stack" onSubmit={(event) => void submit(event)}>
        <label>
          JSON value
          <textarea
            className="code-input"
            required
            rows={9}
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(event) => setIsPublic(event.target.checked)}
          />
          Safe to expose through the public settings API
        </label>
        <label>
          Change reason
          <input
            required
            minLength={3}
            maxLength={1000}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </label>
        <button
          className="button button--primary"
          disabled={action.state.status === "submitting"}
        >
          Save setting
        </button>
      </form>
    </article>
  );
}

export function AdminSettings() {
  const resource = useApiResource(() => api.admin.settings());
  return (
    <section>
      <PageHeader
        title="Platform settings"
        description="Versioned runtime controls for maintenance, features, security, support, currency, and content."
      />
      <div className="alert alert--warning">
        <strong>Production safeguards remain authoritative.</strong>
        <p>
          Provider credentials, payout activation, and global withdrawal
          activation still require external evidence and environment secrets.
        </p>
      </div>
      {resource.state.status === "loading" ? (
        <LoadingState label="Loading settings" />
      ) : null}
      {resource.state.status === "error" ? (
        <ErrorNotice error={resource.state.error} onRetry={resource.reload} />
      ) : null}
      {resource.state.status === "success" ? (
        <div className="content-grid content-grid--two">
          {resource.state.data.map((setting) => (
            <SettingEditor
              key={setting.key}
              setting={setting}
              onChanged={resource.reload}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function CountryEditor({
  country,
  onChanged,
}: {
  country: CountryAvailability;
  onChanged: () => void;
}) {
  const [status, setStatus] = useState(country.status);
  const [reason, setReason] = useState(country.reason);
  const action = useAsyncAction<CountryAvailability>();
  async function submit(event: FormEvent) {
    event.preventDefault();
    const result = await action.run(() =>
      api.admin.updateCountry(country.countryCode, { status, reason }),
    );
    if (result !== null) onChanged();
  }
  return (
    <article className="card">
      <div className="card-heading">
        <h2>{country.countryCode}</h2>
        <StatusBadge status={country.status} />
      </div>
      {action.state.status === "error" ? (
        <ErrorNotice error={action.state.error} />
      ) : null}
      {action.state.status === "success" ? (
        <InlineSuccess>Country status saved.</InlineSuccess>
      ) : null}
      <form
        className="form-stack compact-form"
        onSubmit={(event) => void submit(event)}
      >
        <label>
          Availability
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as CountryAvailability["status"])
            }
          >
            <option value="enabled">Enabled</option>
            <option value="blocked">Blocked</option>
            <option value="future">Future</option>
            <option value="review">Review</option>
          </select>
        </label>
        <label>
          Policy reason
          <textarea
            required
            minLength={3}
            maxLength={1000}
            rows={3}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </label>
        <button className="button button--primary">Save availability</button>
      </form>
    </article>
  );
}

export function AdminCountries() {
  const resource = useApiResource(() => api.admin.countries());
  return (
    <section>
      <PageHeader
        title="Country availability"
        description="Registration and survey eligibility use this server-side allowlist."
      />
      <div className="alert alert--info">
        Pakistan, India, Bangladesh, and China are deliberately fail-closed and
        cannot be enabled from this screen.
      </div>
      {resource.state.status === "loading" ? (
        <LoadingState label="Loading countries" />
      ) : null}
      {resource.state.status === "error" ? (
        <ErrorNotice error={resource.state.error} onRetry={resource.reload} />
      ) : null}
      {resource.state.status === "success" ? (
        <div className="content-grid content-grid--three">
          {resource.state.data.map((country) => (
            <CountryEditor
              key={country.countryCode}
              country={country}
              onChanged={resource.reload}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function ProviderEditor({
  provider,
  onChanged,
}: {
  provider: AdminProvider;
  onChanged: () => void;
}) {
  const [displayName, setDisplayName] = useState(provider.displayName);
  const [enabled, setEnabled] = useState(provider.enabled);
  const [userVisible, setUserVisible] = useState(provider.userVisible);
  const [configuration, setConfiguration] = useState(
    JSON.stringify(provider.configuration, null, 2),
  );
  const [reason, setReason] = useState("");
  const [parseError, setParseError] = useState("");
  const action = useAsyncAction<AdminProvider>();

  async function submit(event: FormEvent) {
    event.preventDefault();
    let parsed: unknown;
    try {
      parsed = JSON.parse(configuration);
      setParseError("");
    } catch {
      setParseError("Provider configuration must be valid JSON.");
      return;
    }
    const result = await action.run(() =>
      api.admin.updateProvider(provider.id, {
        displayName,
        enabled,
        userVisible,
        configuration: parsed,
        reason,
      }),
    );
    if (result !== null) {
      setReason("");
      onChanged();
    }
  }

  return (
    <article className="card admin-editor-card">
      <div className="card-heading">
        <div>
          <p className="eyebrow">{provider.code}</p>
          <h2>{provider.displayName}</h2>
        </div>
        <StatusBadge status={provider.healthStatus} />
      </div>
      <p>Last health check: {formatDate(provider.lastHealthCheckAt)}</p>
      {action.state.status === "error" ? (
        <ErrorNotice error={action.state.error} />
      ) : null}
      {action.state.status === "success" ? (
        <InlineSuccess>Provider saved.</InlineSuccess>
      ) : null}
      {parseError ? (
        <div className="alert alert--danger">{parseError}</div>
      ) : null}
      <form className="form-stack" onSubmit={(event) => void submit(event)}>
        <label>
          Display name
          <input
            required
            maxLength={120}
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(event) => setEnabled(event.target.checked)}
          />
          Provider enabled
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={userVisible}
            onChange={(event) => setUserVisible(event.target.checked)}
          />
          Visible to members
        </label>
        <label>
          Configuration JSON
          <textarea
            className="code-input"
            rows={8}
            value={configuration}
            onChange={(event) => setConfiguration(event.target.value)}
          />
        </label>
        <label>
          Change reason
          <textarea
            required
            minLength={3}
            maxLength={1000}
            rows={3}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </label>
        <button
          className="button button--primary"
          disabled={action.state.status === "submitting"}
        >
          Save provider
        </button>
      </form>
    </article>
  );
}

export function AdminProviders() {
  const resource = useApiResource(() => api.admin.providers());
  return (
    <section>
      <PageHeader
        title="Provider registry"
        description="Health, visibility, and configuration controls for survey integrations."
      />
      <div className="alert alert--warning">
        <strong>Activation is guarded.</strong>
        <p>
          Real providers cannot be enabled without a server-side credential
          reference. Demo data remains controlled by the staging demo switch.
        </p>
      </div>
      {resource.state.status === "loading" ? (
        <LoadingState label="Loading providers" />
      ) : null}
      {resource.state.status === "error" ? (
        <ErrorNotice error={resource.state.error} onRetry={resource.reload} />
      ) : null}
      {resource.state.status === "success" ? (
        <div className="content-grid content-grid--two">
          {resource.state.data.map((provider) => (
            <ProviderEditor
              key={provider.id}
              provider={provider}
              onChanged={resource.reload}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export function AdminRoles() {
  const resource = useApiResource(() => api.admin.roles());
  const action = useAsyncAction<{ message: string }>();
  const [userId, setUserId] = useState("");
  const [roleCode, setRoleCode] = useState("");
  const [reason, setReason] = useState("");

  async function apply(operation: "assign" | "revoke") {
    await action.run(() =>
      operation === "assign"
        ? api.admin.assignRole(userId, roleCode, reason)
        : api.admin.revokeRole(userId, roleCode, reason),
    );
  }

  return (
    <section>
      <PageHeader
        title="Roles & access"
        description="Capability-based assignments with an audit reason and last-admin safeguards."
      />
      {resource.state.status === "loading" ? (
        <LoadingState label="Loading roles" />
      ) : null}
      {resource.state.status === "error" ? (
        <ErrorNotice error={resource.state.error} onRetry={resource.reload} />
      ) : null}
      {resource.state.status === "success" ? (
        <div className="content-grid content-grid--two">
          <section className="stack-sm">
            {resource.state.data.map((role) => (
              <article className="card" key={role.code}>
                <div className="card-heading">
                  <div>
                    <h2>{role.name}</h2>
                    <p>{role.code}</p>
                  </div>
                  <StatusBadge
                    status={role.administrative ? "administrative" : "member"}
                  />
                </div>
                <details>
                  <summary>{role.permissions.length} capabilities</summary>
                  <ul className="permission-list">
                    {role.permissions.map((permission) => (
                      <li key={permission}>{permission}</li>
                    ))}
                  </ul>
                </details>
              </article>
            ))}
          </section>
          <section className="card form-card">
            <h2>Change a user role</h2>
            {action.state.status === "error" ? (
              <ErrorNotice error={action.state.error} />
            ) : null}
            {action.state.status === "success" ? (
              <InlineSuccess>{action.state.data.message}</InlineSuccess>
            ) : null}
            <div className="form-stack">
              <label>
                User ID
                <input
                  required
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                />
              </label>
              <label>
                Role
                <select
                  required
                  value={roleCode}
                  onChange={(event) => setRoleCode(event.target.value)}
                >
                  <option value="">Choose a role</option>
                  {resource.state.data.map((role) => (
                    <option key={role.code} value={role.code}>
                      {role.name}
                    </option>
                  ))}
                </select>
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
              <div className="button-row">
                <button
                  className="button button--primary"
                  type="button"
                  disabled={
                    !userId ||
                    !roleCode ||
                    reason.length < 3 ||
                    action.state.status === "submitting"
                  }
                  onClick={() => void apply("assign")}
                >
                  Assign role
                </button>
                <button
                  className="button button--danger"
                  type="button"
                  disabled={
                    !userId ||
                    !roleCode ||
                    reason.length < 3 ||
                    action.state.status === "submitting"
                  }
                  onClick={() => void apply("revoke")}
                >
                  Revoke role
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}

export function AdminJobs() {
  const resource = useApiResource(() => api.admin.jobs(100));
  const action = useAsyncAction<{ message: string }>();
  const [reason, setReason] = useState("");
  async function retry(jobId: string) {
    const result = await action.run(() => api.admin.retryJob(jobId, reason));
    if (result !== null) resource.reload();
  }
  return (
    <section>
      <PageHeader
        title="Background jobs"
        description="Inspect queued, running, completed, and failed operational work."
      />
      {action.state.status === "error" ? (
        <ErrorNotice error={action.state.error} />
      ) : null}
      {action.state.status === "success" ? (
        <InlineSuccess>{action.state.data.message}</InlineSuccess>
      ) : null}
      <label className="reason-bar">
        Retry reason
        <input
          minLength={3}
          maxLength={1000}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
      </label>
      {resource.state.status === "loading" ? (
        <LoadingState label="Loading jobs" />
      ) : null}
      {resource.state.status === "error" ? (
        <ErrorNotice error={resource.state.error} onRetry={resource.reload} />
      ) : null}
      {resource.state.status === "success" &&
      resource.state.data.length === 0 ? (
        <EmptyState title="No background jobs">
          Operational jobs will appear here as they are queued.
        </EmptyState>
      ) : null}
      {resource.state.status === "success" && resource.state.data.length > 0 ? (
        <div className="table-wrap card">
          <table>
            <thead>
              <tr>
                <th scope="col">Type</th>
                <th scope="col">Status</th>
                <th scope="col">Attempts</th>
                <th scope="col">Scheduled</th>
                <th scope="col">Finished</th>
                <th scope="col">Error</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {resource.state.data.map((job) => (
                <tr key={job.id}>
                  <td>{job.jobType}</td>
                  <td>
                    <StatusBadge status={job.status} />
                  </td>
                  <td>{job.attemptCount}</td>
                  <td>{formatDate(job.scheduledFor)}</td>
                  <td>{formatDate(job.finishedAt)}</td>
                  <td>{job.lastError ?? "—"}</td>
                  <td>
                    {job.status === "failed" ? (
                      <button
                        className="button button--secondary"
                        type="button"
                        disabled={
                          reason.length < 3 ||
                          action.state.status === "submitting"
                        }
                        onClick={() => void retry(job.id)}
                      >
                        Retry
                      </button>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}

export function AdminSupport() {
  const [status, setStatus] = useState<SupportTicketStatus | "all">("all");
  const resource = useApiResource(
    () =>
      api.admin.supportTickets(
        status === "all" ? { limit: 100 } : { status, limit: 100 },
      ),
    [status],
  );
  return (
    <section>
      <PageHeader
        title="Support queue"
        description="Prioritized member cases with assignment and internal notes."
      />
      <label className="compact-select">
        Queue
        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as SupportTicketStatus | "all")
          }
        >
          <option value="all">All tickets</option>
          <option value="open">Open</option>
          <option value="waiting_for_support">Waiting for support</option>
          <option value="waiting_for_user">Waiting for user</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </label>
      {resource.state.status === "loading" ? (
        <LoadingState label="Loading support queue" />
      ) : null}
      {resource.state.status === "error" ? (
        <ErrorNotice error={resource.state.error} onRetry={resource.reload} />
      ) : null}
      {resource.state.status === "success" &&
      resource.state.data.length === 0 ? (
        <EmptyState title="Queue is clear">
          No support tickets match this filter.
        </EmptyState>
      ) : null}
      {resource.state.status === "success" ? (
        <div className="support-ticket-list">
          {resource.state.data.map((ticket) => (
            <Link
              className="card support-ticket-card"
              to={ticket.id}
              key={ticket.id}
            >
              <div>
                <p className="eyebrow">
                  #{ticket.ticketNumber} · {ticket.priority}
                </p>
                <h2>{ticket.subject}</h2>
                <p>
                  {ticket.userDisplayName} · {ticket.userEmail}
                </p>
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
      ) : null}
    </section>
  );
}

export function AdminSupportDetail() {
  const { ticketId = "" } = useParams();
  const resource = useApiResource(
    () => api.admin.supportTicket(ticketId),
    [ticketId],
  );
  const action = useAsyncAction<AdminSupportTicket>();
  const [message, setMessage] = useState("");
  const [reason, setReason] = useState("");
  const [internalNote, setInternalNote] = useState(false);
  const [status, setStatus] = useState<SupportTicketStatus>("waiting_for_user");
  const [priority, setPriority] = useState<SupportTicketPriority>("normal");
  async function reply(event: FormEvent) {
    event.preventDefault();
    const result = await action.run(() =>
      api.admin.replySupportTicket(ticketId, {
        message,
        internalNote,
        status,
        priority,
        reason,
      }),
    );
    if (result !== null) {
      setMessage("");
      setReason("");
      resource.reload();
    }
  }
  return (
    <section>
      <PageHeader
        title="Support case"
        description="Public replies and private internal notes share one audited workflow."
        actions={
          <Link className="button button--secondary" to="/app/admin/support">
            Back to queue
          </Link>
        }
      />
      {resource.state.status === "loading" ? (
        <LoadingState label="Loading support case" />
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
              <p>
                {resource.state.data.userDisplayName} ·{" "}
                {resource.state.data.userEmail}
              </p>
            </div>
            <StatusBadge status={resource.state.data.status} />
          </article>
          <div className="message-thread">
            {(resource.state.data.messages ?? []).map((entry) => (
              <article
                className={`message-bubble message-bubble--${entry.internalNote ? "internal" : entry.authorType}`}
                key={entry.id}
              >
                <header>
                  <strong>
                    {entry.authorName}
                    {entry.internalNote ? " · internal note" : ""}
                  </strong>
                  <time dateTime={entry.createdAt}>
                    {formatDate(entry.createdAt)}
                  </time>
                </header>
                <p>{entry.body}</p>
              </article>
            ))}
          </div>
          <form
            className="card form-stack"
            onSubmit={(event) => void reply(event)}
          >
            <h2>Update case</h2>
            {action.state.status === "error" ? (
              <ErrorNotice error={action.state.error} />
            ) : null}
            {action.state.status === "success" ? (
              <InlineSuccess>Case updated.</InlineSuccess>
            ) : null}
            <label>
              Message
              <textarea
                required
                minLength={2}
                maxLength={10_000}
                rows={6}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </label>
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={internalNote}
                onChange={(event) => setInternalNote(event.target.checked)}
              />
              Internal note (not shown to the member)
            </label>
            <div className="content-grid content-grid--two">
              <label>
                Status
                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as SupportTicketStatus)
                  }
                >
                  <option value="open">Open</option>
                  <option value="waiting_for_support">
                    Waiting for support
                  </option>
                  <option value="waiting_for_user">Waiting for user</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </label>
              <label>
                Priority
                <select
                  value={priority}
                  onChange={(event) =>
                    setPriority(event.target.value as SupportTicketPriority)
                  }
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </label>
            </div>
            <label>
              Audit reason
              <input
                required
                minLength={3}
                maxLength={1000}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              />
            </label>
            <button
              className="button button--primary"
              disabled={action.state.status === "submitting"}
            >
              Save reply and case state
            </button>
          </form>
        </>
      ) : null}
    </section>
  );
}

export function AdminUserDetail() {
  const { userId = "" } = useParams();
  const resource = useApiResource(() => api.admin.user(userId), [userId]);
  const action = useAsyncAction<{ message: string }>();
  const [reason, setReason] = useState("");
  const [adjustment, setAdjustment] = useState<{
    points: string;
    bucket: "pending" | "validated" | "mature" | "withdrawable";
    evidenceReference: string;
    idempotencyKey: string;
  }>({
    points: "",
    bucket: "withdrawable",
    evidenceReference: "",
    idempotencyKey: crypto.randomUUID(),
  });

  async function accountAction(
    kind: "force-logout" | "password-reset" | "archive" | "restore",
  ) {
    const operation =
      kind === "force-logout"
        ? api.admin.forceLogoutUser(userId, reason)
        : kind === "password-reset"
          ? api.admin.sendPasswordReset(userId, reason)
          : api.admin.setArchived(userId, kind === "archive", reason);
    const result = await action.run(() => operation);
    if (result !== null) resource.reload();
  }
  async function adjustWallet(event: FormEvent) {
    event.preventDefault();
    const result = await action.run(() =>
      api.admin.adjustWallet(userId, { ...adjustment, reason }),
    );
    if (result !== null) {
      setAdjustment({
        ...adjustment,
        points: "",
        evidenceReference: "",
        idempotencyKey: crypto.randomUUID(),
      });
      resource.reload();
    }
  }

  return (
    <section>
      <PageHeader
        title="User record"
        description="Account, wallet, session, support, and role information in one audited view."
        actions={
          <Link className="button button--secondary" to="/app/admin/users">
            Back to users
          </Link>
        }
      />
      {resource.state.status === "loading" ? (
        <LoadingState label="Loading user record" />
      ) : null}
      {resource.state.status === "error" ? (
        <ErrorNotice error={resource.state.error} onRetry={resource.reload} />
      ) : null}
      {resource.state.status === "success" ? (
        <>
          <article className="card user-record-heading">
            <div>
              <p className="eyebrow">{resource.state.data.id}</p>
              <h2>{resource.state.data.displayName}</h2>
              <p>
                {resource.state.data.email} · {resource.state.data.countryCode}
              </p>
            </div>
            <StatusBadge status={resource.state.data.accountStatus} />
          </article>
          <div className="metric-grid">
            <article className="metric-card">
              <span>Active sessions</span>
              <strong className="large-number">
                {resource.state.data.activeSessionCount}
              </strong>
            </article>
            <article className="metric-card">
              <span>Open tickets</span>
              <strong className="large-number">
                {resource.state.data.openSupportTicketCount}
              </strong>
            </article>
            <article className="metric-card">
              <span>Survey activity</span>
              <strong className="large-number">
                {resource.state.data.surveyParticipationCount}
              </strong>
            </article>
            <article className="metric-card">
              <span>Withdrawals</span>
              <strong className="large-number">
                {resource.state.data.withdrawalCount}
              </strong>
            </article>
          </div>
          <div className="metric-grid">
            <article className="metric-card">
              <span>Pending</span>
              <MoneyValue value={resource.state.data.wallet.pending} />
            </article>
            <article className="metric-card">
              <span>Validated</span>
              <MoneyValue value={resource.state.data.wallet.validated} />
            </article>
            <article className="metric-card">
              <span>Withdrawable</span>
              <MoneyValue value={resource.state.data.wallet.withdrawable} />
            </article>
            <article className="metric-card">
              <span>Paid</span>
              <MoneyValue value={resource.state.data.wallet.paid} />
            </article>
          </div>
          {action.state.status === "error" ? (
            <ErrorNotice error={action.state.error} />
          ) : null}
          {action.state.status === "success" ? (
            <InlineSuccess>{action.state.data.message}</InlineSuccess>
          ) : null}
          <div className="content-grid content-grid--two">
            <section className="card form-card">
              <h2>Account operations</h2>
              <p>Roles: {resource.state.data.roles.join(", ") || "none"}</p>
              <p>Last login: {formatDate(resource.state.data.lastLoginAt)}</p>
              <label className="form-stack">
                Audit reason
                <textarea
                  required
                  minLength={3}
                  maxLength={1000}
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                />
              </label>
              <div className="button-row">
                <button
                  className="button button--secondary"
                  type="button"
                  disabled={reason.length < 3}
                  onClick={() => void accountAction("force-logout")}
                >
                  Force logout
                </button>
                <button
                  className="button button--secondary"
                  type="button"
                  disabled={reason.length < 3}
                  onClick={() => void accountAction("password-reset")}
                >
                  Send password reset
                </button>
                {resource.state.data.deletedAt ? (
                  <button
                    className="button button--primary"
                    type="button"
                    disabled={reason.length < 3}
                    onClick={() => void accountAction("restore")}
                  >
                    Restore user
                  </button>
                ) : (
                  <button
                    className="button button--danger"
                    type="button"
                    disabled={reason.length < 3}
                    onClick={() => void accountAction("archive")}
                  >
                    Archive user
                  </button>
                )}
              </div>
            </section>
            <form
              className="card form-stack"
              onSubmit={(event) => void adjustWallet(event)}
            >
              <h2>Evidence-backed wallet adjustment</h2>
              <p>
                This control remains disabled until the wallet-adjustment
                feature flag is explicitly enabled.
              </p>
              <label>
                Signed points
                <input
                  required
                  pattern="-?[1-9][0-9]*"
                  value={adjustment.points}
                  onChange={(event) =>
                    setAdjustment({ ...adjustment, points: event.target.value })
                  }
                />
              </label>
              <label>
                Bucket
                <select
                  value={adjustment.bucket}
                  onChange={(event) =>
                    setAdjustment({
                      ...adjustment,
                      bucket: event.target.value as typeof adjustment.bucket,
                    })
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="validated">Validated</option>
                  <option value="mature">Mature</option>
                  <option value="withdrawable">Withdrawable</option>
                </select>
              </label>
              <label>
                Evidence reference
                <input
                  required
                  minLength={1}
                  maxLength={500}
                  value={adjustment.evidenceReference}
                  onChange={(event) =>
                    setAdjustment({
                      ...adjustment,
                      evidenceReference: event.target.value,
                    })
                  }
                />
              </label>
              <label>
                Idempotency key
                <input
                  required
                  minLength={8}
                  maxLength={200}
                  value={adjustment.idempotencyKey}
                  onChange={(event) =>
                    setAdjustment({
                      ...adjustment,
                      idempotencyKey: event.target.value,
                    })
                  }
                />
              </label>
              <button
                className="button button--danger"
                disabled={
                  reason.length < 3 || action.state.status === "submitting"
                }
              >
                Record adjustment
              </button>
            </form>
          </div>
          <div className="content-grid content-grid--two">
            <section className="card">
              <h2>Recent activity</h2>
              {resource.state.data.recentActivity.length === 0 ? (
                <p>No activity has been recorded.</p>
              ) : (
                <ol className="activity-list">
                  {resource.state.data.recentActivity.map((event) => (
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
            <section className="card">
              <h2>Security history</h2>
              {resource.state.data.recentSecurityEvents.length === 0 ? (
                <p>No security events have been recorded.</p>
              ) : (
                <ol className="activity-list">
                  {resource.state.data.recentSecurityEvents.map((event) => (
                    <li key={event.id}>
                      <div>
                        <strong>{event.eventType}</strong>
                        <small>{event.outcome}</small>
                      </div>
                      <div>
                        <StatusBadge status={event.severity} />
                        <time dateTime={event.createdAt}>
                          {formatDate(event.createdAt)}
                        </time>
                      </div>
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

function parseCodeList(value: string): string[] {
  return [
    ...new Set(
      value
        .split(/[\s,]+/)
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ];
}

function LimitTemplateEditor({
  template,
  onChanged,
}: {
  template: LimitTemplate;
  onChanged: () => void;
}) {
  const [name, setName] = useState(template.name);
  const [description, setDescription] = useState(template.description);
  const [active, setActive] = useState(template.active);
  const [denied, setDenied] = useState(template.deniedPermissions.join("\n"));
  const [cloneCode, setCloneCode] = useState("");
  const [cloneName, setCloneName] = useState(`${template.name} copy`);
  const action = useAsyncAction<LimitTemplate>();

  async function submit(event: FormEvent) {
    event.preventDefault();
    const result = await action.run(() =>
      api.admin.updateLimitTemplate(template.id, {
        name,
        description,
        active,
        deniedPermissions: parseCodeList(denied),
      }),
    );
    if (result !== null) onChanged();
  }

  async function clone() {
    const result = await action.run(() =>
      api.admin.cloneLimitTemplate(template.id, {
        code: cloneCode,
        name: cloneName,
      }),
    );
    if (result !== null) {
      setCloneCode("");
      onChanged();
    }
  }

  return (
    <form className="card form-stack" onSubmit={(event) => void submit(event)}>
      <div className="card-heading">
        <div>
          <p className="eyebrow">{template.code}</p>
          <h2>{template.name}</h2>
        </div>
        <StatusBadge status={template.active ? "active" : "inactive"} />
      </div>
      {action.state.status === "error" ? (
        <ErrorNotice error={action.state.error} />
      ) : null}
      {action.state.status === "success" ? (
        <InlineSuccess>Limit template updated.</InlineSuccess>
      ) : null}
      <label>
        Name
        <input
          required
          minLength={3}
          maxLength={100}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <label>
        Description
        <textarea
          maxLength={1000}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>
      <label>
        Denied capability codes (one per line)
        <textarea
          className="code-input"
          rows={8}
          value={denied}
          onChange={(event) => setDenied(event.target.value)}
        />
      </label>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={active}
          onChange={(event) => setActive(event.target.checked)}
        />
        Template can be assigned
      </label>
      <button
        className="button button--primary"
        disabled={action.state.status === "submitting"}
      >
        Save template
      </button>
      <details>
        <summary>Clone this template</summary>
        <div className="form-stack compact-form">
          <label>
            New code
            <input
              pattern="[a-z][a-z0-9_]{2,63}"
              value={cloneCode}
              onChange={(event) => setCloneCode(event.target.value)}
            />
          </label>
          <label>
            New name
            <input
              minLength={3}
              maxLength={100}
              value={cloneName}
              onChange={(event) => setCloneName(event.target.value)}
            />
          </label>
          <button
            className="button button--secondary"
            type="button"
            disabled={
              cloneCode.length < 3 ||
              cloneName.length < 3 ||
              action.state.status === "submitting"
            }
            onClick={() => void clone()}
          >
            Clone template
          </button>
        </div>
      </details>
    </form>
  );
}

export function AdminLimitTemplates() {
  const resource = useApiResource(() => api.admin.limitTemplates());
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [denied, setDenied] = useState("");
  const action = useAsyncAction<LimitTemplate>();

  async function create(event: FormEvent) {
    event.preventDefault();
    const result = await action.run(() =>
      api.admin.createLimitTemplate({
        code,
        name,
        description,
        active: true,
        deniedPermissions: parseCodeList(denied),
      }),
    );
    if (result !== null) {
      setCode("");
      setName("");
      setDescription("");
      setDenied("");
      resource.reload();
    }
  }

  return (
    <section>
      <PageHeader
        title="Limit templates"
        description="Reusable capability restrictions for limited accounts. Direct URL authorization follows the same template."
      />
      <form
        className="card form-stack"
        onSubmit={(event) => void create(event)}
      >
        <h2>Create a template</h2>
        {action.state.status === "error" ? (
          <ErrorNotice error={action.state.error} />
        ) : null}
        {action.state.status === "success" ? (
          <InlineSuccess>Limit template created.</InlineSuccess>
        ) : null}
        <div className="field-grid">
          <label>
            Code
            <input
              required
              pattern="[a-z][a-z0-9_]{2,63}"
              value={code}
              onChange={(event) => setCode(event.target.value)}
            />
          </label>
          <label>
            Name
            <input
              required
              minLength={3}
              maxLength={100}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
        </div>
        <label>
          Description
          <textarea
            maxLength={1000}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
        <label>
          Denied capability codes
          <textarea
            className="code-input"
            rows={6}
            value={denied}
            onChange={(event) => setDenied(event.target.value)}
          />
        </label>
        <button className="button button--primary">Create template</button>
      </form>
      {resource.state.status === "loading" ? (
        <LoadingState label="Loading limit templates" />
      ) : null}
      {resource.state.status === "error" ? (
        <ErrorNotice error={resource.state.error} onRetry={resource.reload} />
      ) : null}
      {resource.state.status === "success" ? (
        <div className="content-grid content-grid--two">
          {resource.state.data.map((template) => (
            <LimitTemplateEditor
              key={template.id}
              template={template}
              onChanged={resource.reload}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function WithdrawalMethodEditor({
  method,
  onChanged,
}: {
  method?: AdminWithdrawalMethod;
  onChanged: () => void;
}) {
  const [code, setCode] = useState(method?.code ?? "");
  const [displayName, setDisplayName] = useState(method?.displayName ?? "");
  const [enabled, setEnabled] = useState(method?.enabled ?? false);
  const [minimumPoints, setMinimumPoints] = useState(
    method?.minimumPoints ?? "0",
  );
  const [feePoints, setFeePoints] = useState(method?.feePoints ?? "0");
  const [countryCodes, setCountryCodes] = useState(
    method?.countryCodes.join(", ") ?? "",
  );
  const [destinationType, setDestinationType] = useState<
    AdminWithdrawalMethod["destinationType"]
  >(method?.destinationType ?? "email");
  const [processingDays, setProcessingDays] = useState(
    method?.processingDays ?? 5,
  );
  const [evidenceReference, setEvidenceReference] = useState(
    method?.evidenceReference ?? "",
  );
  const [reason, setReason] = useState("");
  const action = useAsyncAction<AdminWithdrawalMethod>();

  async function submit(event: FormEvent) {
    event.preventDefault();
    const body = {
      code,
      displayName,
      enabled,
      minimumPoints,
      feePoints,
      countryCodes: parseCodeList(countryCodes).map((item) =>
        item.toUpperCase(),
      ),
      destinationType,
      processingDays,
      evidenceReference,
      reason,
    };
    const result = await action.run(() =>
      method
        ? api.admin.updateWithdrawalMethod(method.code, body)
        : api.admin.createWithdrawalMethod(body),
    );
    if (result !== null) {
      setReason("");
      onChanged();
    }
  }

  return (
    <form className="card form-stack" onSubmit={(event) => void submit(event)}>
      <div className="card-heading">
        <div>
          <p className="eyebrow">{method?.code ?? "New method"}</p>
          <h2>{method?.displayName ?? "Create payout method"}</h2>
        </div>
        {method ? (
          <StatusBadge status={method.enabled ? "enabled" : "disabled"} />
        ) : null}
      </div>
      {action.state.status === "error" ? (
        <ErrorNotice error={action.state.error} />
      ) : null}
      {action.state.status === "success" ? (
        <InlineSuccess>Payout method saved with an audit record.</InlineSuccess>
      ) : null}
      <div className="field-grid">
        <label>
          Code
          <input
            required
            disabled={Boolean(method)}
            pattern="[a-z][a-z0-9_]{2,63}"
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
        </label>
        <label>
          Display name
          <input
            required
            minLength={2}
            maxLength={120}
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
        </label>
        <label>
          Minimum points
          <input
            required
            inputMode="numeric"
            pattern="[0-9]+"
            value={minimumPoints}
            onChange={(event) => setMinimumPoints(event.target.value)}
          />
        </label>
        <label>
          Fee points
          <input
            required
            inputMode="numeric"
            pattern="[0-9]+"
            value={feePoints}
            onChange={(event) => setFeePoints(event.target.value)}
          />
        </label>
        <label>
          Destination type
          <select
            value={destinationType}
            onChange={(event) =>
              setDestinationType(
                event.target.value as AdminWithdrawalMethod["destinationType"],
              )
            }
          >
            <option value="email">Email</option>
            <option value="crypto_address">Crypto address</option>
            <option value="account_reference">Account reference</option>
          </select>
        </label>
        <label>
          Processing days
          <input
            required
            type="number"
            min={1}
            max={30}
            value={processingDays}
            onChange={(event) => setProcessingDays(Number(event.target.value))}
          />
        </label>
      </div>
      <label>
        Supported country codes (comma separated; blank means all launch
        countries)
        <input
          value={countryCodes}
          onChange={(event) => setCountryCodes(event.target.value)}
        />
      </label>
      <label>
        Approval evidence reference
        <input
          required
          minLength={3}
          maxLength={500}
          value={evidenceReference}
          onChange={(event) => setEvidenceReference(event.target.value)}
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
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) => setEnabled(event.target.checked)}
        />
        Method enabled (global withdrawal control remains separate)
      </label>
      <button
        className="button button--primary"
        disabled={action.state.status === "submitting"}
      >
        {method ? "Save method" : "Create method"}
      </button>
    </form>
  );
}

export function AdminWithdrawalMethods() {
  const resource = useApiResource(() => api.admin.withdrawalMethods());
  return (
    <section>
      <PageHeader
        title="Payout methods"
        description="Manual payout definitions, country scope, timing, fees, and evidence. No credential is stored here."
      />
      <div className="alert alert--warning">
        Enabling a method does not enable global withdrawals. Keep the global
        withdrawal setting off until the real payout process and evidence are
        approved.
      </div>
      <WithdrawalMethodEditor onChanged={resource.reload} />
      {resource.state.status === "loading" ? (
        <LoadingState label="Loading payout methods" />
      ) : null}
      {resource.state.status === "error" ? (
        <ErrorNotice error={resource.state.error} onRetry={resource.reload} />
      ) : null}
      {resource.state.status === "success" ? (
        <div className="content-grid content-grid--two">
          {resource.state.data.map((method) => (
            <WithdrawalMethodEditor
              key={method.code}
              method={method}
              onChanged={resource.reload}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
