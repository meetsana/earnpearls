import { useState, type FormEvent } from "react";

import { api } from "../api/endpoints";
import type { AccountStatus, AdminUser, AdminWithdrawal } from "../api/types";
import {
  ErrorNotice,
  InlineSuccess,
  LoadingState,
} from "../components/AsyncStates";
import { MoneyValue } from "../components/MoneyValue";
import { StatusBadge } from "../components/StatusBadge";
import { useApiResource } from "../hooks/useApiResource";
import { useAsyncAction } from "../hooks/useAsyncAction";
import { formatIntegerString } from "../lib/money";
import { useHasCapability } from "../session/SessionProvider";
import { PageHeader } from "./ScreenSkeleton";

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function AdminDashboard() {
  const { state, reload } = useApiResource(() => api.admin.dashboard());
  return (
    <section>
      <PageHeader
        title="Admin dashboard"
        description="Operational counts returned by the admin API."
      />
      {state.status === "loading" ? (
        <LoadingState label="Loading admin dashboard" />
      ) : null}
      {state.status === "error" ? (
        <ErrorNotice error={state.error} onRetry={reload} />
      ) : null}
      {state.status === "success" ? (
        <div className="metric-grid">
          <article className="metric-card">
            <span>Users</span>
            <strong className="large-number">{state.data.users.total}</strong>
            <small>
              {state.data.users.verified} verified · {state.data.users.limited}{" "}
              limited
            </small>
          </article>
          <article className="metric-card">
            <span>Available surveys</span>
            <strong className="large-number">
              {state.data.surveys.available}
            </strong>
            <small>
              {state.data.surveys.pendingParticipations} pending participations
            </small>
          </article>
          <article className="metric-card">
            <span>Requested withdrawals</span>
            <strong className="large-number">
              {state.data.withdrawals.requested}
            </strong>
            <MoneyValue value={state.data.withdrawals.reserved} />
          </article>
          <article className="metric-card">
            <span>Providers enabled</span>
            <strong className="large-number">
              {state.data.providers.enabled}
            </strong>
            <small>{state.data.providers.degraded} degraded</small>
          </article>
        </div>
      ) : null}
    </section>
  );
}

const ACCOUNT_STATUSES: AccountStatus[] = [
  "active",
  "limited",
  "suspended",
  "disabled",
  "archived",
];

function UserModerationCard({
  user,
  onChanged,
}: {
  user: AdminUser;
  onChanged: () => void;
}) {
  const canModerate = useHasCapability()("admin.users.moderate");
  const [accountStatus, setAccountStatus] = useState<AccountStatus>(
    user.accountStatus,
  );
  const [reason, setReason] = useState("");
  const action = useAsyncAction<{ message: string }>();

  async function submit(event: FormEvent) {
    event.preventDefault();
    const result = await action.run(() =>
      api.admin.updateAccountState(user.id, { accountStatus, reason }),
    );
    if (result !== null) onChanged();
  }

  return (
    <article className="card">
      <div className="card-heading">
        <div>
          <h2>{user.displayName}</h2>
          <p>{user.email}</p>
        </div>
        <StatusBadge status={user.accountStatus} />
      </div>
      <dl className="detail-list">
        <div>
          <dt>Country</dt>
          <dd>{user.countryCode}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{user.emailVerified ? "Verified" : "Not verified"}</dd>
        </div>
        <div>
          <dt>Limit template</dt>
          <dd>{user.limitTemplateId ?? "None"}</dd>
        </div>
      </dl>
      {action.state.status === "error" ? (
        <ErrorNotice error={action.state.error} />
      ) : null}
      {action.state.status === "success" ? (
        <InlineSuccess>{action.state.data.message}</InlineSuccess>
      ) : null}
      {canModerate ? (
        <form
          className="form-stack compact-form"
          onSubmit={(event) => void submit(event)}
        >
          <label>
            Account state
            <select
              value={accountStatus}
              onChange={(event) =>
                setAccountStatus(event.target.value as AccountStatus)
              }
            >
              {ACCOUNT_STATUSES.map((status) => (
                <option value={status} key={status}>
                  {status}
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
              rows={2}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
          </label>
          <button
            className="button button--danger"
            disabled={action.state.status === "submitting"}
          >
            Apply account state
          </button>
        </form>
      ) : null}
    </article>
  );
}

export function AdminUsers() {
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const { state, reload } = useApiResource(
    () => api.admin.users({ search: submittedSearch, limit: 50 }),
    [submittedSearch],
  );
  return (
    <section>
      <PageHeader
        title="User moderation"
        description="Account-state changes are audited by the server."
      />
      <form
        className="filter-bar"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmittedSearch(search.trim());
        }}
      >
        <label>
          Search users
          <input
            maxLength={200}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <button className="button button--secondary">Search</button>
      </form>
      {state.status === "loading" ? (
        <LoadingState label="Loading users" />
      ) : null}
      {state.status === "error" ? (
        <ErrorNotice error={state.error} onRetry={reload} />
      ) : null}
      {state.status === "success" ? (
        <div className="content-grid content-grid--two">
          {state.data.map((user) => (
            <UserModerationCard key={user.id} user={user} onChanged={reload} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function WithdrawalReviewCard({
  withdrawal,
  onChanged,
}: {
  withdrawal: AdminWithdrawal;
  onChanged: () => void;
}) {
  const canReview = useHasCapability()("admin.withdrawals.review");
  const [reason, setReason] = useState("");
  const [payoutReference, setPayoutReference] = useState("");
  const action = useAsyncAction<{ message: string }>();

  async function decide(actionName: "approve" | "reject" | "mark-paid") {
    const result = await action.run(() =>
      api.admin.decideWithdrawal(withdrawal.id, actionName, {
        reason,
        ...(payoutReference.trim()
          ? { payoutReference: payoutReference.trim() }
          : {}),
      }),
    );
    if (result !== null) onChanged();
  }

  return (
    <article className="card">
      <div className="card-heading">
        <div>
          <h2>{formatIntegerString(withdrawal.points)} points</h2>
          <p>{withdrawal.userEmail}</p>
        </div>
        <StatusBadge status={withdrawal.status} />
      </div>
      <dl className="detail-list">
        <div>
          <dt>Method</dt>
          <dd>{withdrawal.methodCode}</dd>
        </div>
        <div>
          <dt>Destination</dt>
          <dd>{withdrawal.destinationMasked}</dd>
        </div>
        <div>
          <dt>Requested</dt>
          <dd>{formatDate(withdrawal.requestedAt)}</dd>
        </div>
      </dl>
      {action.state.status === "error" ? (
        <ErrorNotice error={action.state.error} />
      ) : null}
      {action.state.status === "success" ? (
        <InlineSuccess>{action.state.data.message}</InlineSuccess>
      ) : null}
      {canReview ? (
        <div className="form-stack compact-form">
          <label>
            Audit reason
            <textarea
              required
              minLength={3}
              maxLength={1000}
              rows={2}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
          </label>
          <label>
            Payout reference (when applicable)
            <input
              maxLength={200}
              value={payoutReference}
              onChange={(event) => setPayoutReference(event.target.value)}
            />
          </label>
          <div className="button-row">
            <button
              className="button button--secondary"
              type="button"
              disabled={
                reason.length < 3 || action.state.status === "submitting"
              }
              onClick={() => void decide("approve")}
            >
              Approve
            </button>
            <button
              className="button button--danger"
              type="button"
              disabled={
                reason.length < 3 || action.state.status === "submitting"
              }
              onClick={() => void decide("reject")}
            >
              Reject
            </button>
            <button
              className="button button--primary"
              type="button"
              disabled={
                reason.length < 3 || action.state.status === "submitting"
              }
              onClick={() => void decide("mark-paid")}
            >
              Mark paid
            </button>
          </div>
        </div>
      ) : null}
    </article>
  );
}

export function AdminWithdrawals() {
  const { state, reload } = useApiResource(() =>
    api.admin.withdrawals({ limit: 50 }),
  );
  return (
    <section>
      <PageHeader
        title="Withdrawal review"
        description="Administrative decisions require a recorded reason."
      />
      {state.status === "loading" ? (
        <LoadingState label="Loading withdrawals" />
      ) : null}
      {state.status === "error" ? (
        <ErrorNotice error={state.error} onRetry={reload} />
      ) : null}
      {state.status === "success" && state.data.length === 0 ? (
        <p>No withdrawals require review.</p>
      ) : null}
      {state.status === "success" ? (
        <div className="content-grid content-grid--two">
          {state.data.map((withdrawal) => (
            <WithdrawalReviewCard
              key={withdrawal.id}
              withdrawal={withdrawal}
              onChanged={reload}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function ParticipationReconciliationForm() {
  const [participationId, setParticipationId] = useState("");
  const [providerEventReference, setProviderEventReference] = useState("");
  const [reason, setReason] = useState("");
  const [estimatedMaturityAt, setEstimatedMaturityAt] = useState("");
  const action = useAsyncAction<{ message: string }>();

  async function submit(actionName: "validate" | "reject") {
    await action.run(() =>
      api.admin.reconcileParticipation(participationId, actionName, {
        providerEventReference,
        reason,
        ...(estimatedMaturityAt
          ? { estimatedMaturityAt: new Date(estimatedMaturityAt).toISOString() }
          : {}),
      }),
    );
  }

  return (
    <section className="card form-card">
      <h2>Participation decision</h2>
      <p>
        Validation requires provider evidence; elapsed time alone is not
        accepted.
      </p>
      {action.state.status === "error" ? (
        <ErrorNotice error={action.state.error} />
      ) : null}
      {action.state.status === "success" ? (
        <InlineSuccess>{action.state.data.message}</InlineSuccess>
      ) : null}
      <div className="form-stack">
        <label>
          Participation ID
          <input
            required
            value={participationId}
            onChange={(event) => setParticipationId(event.target.value)}
          />
        </label>
        <label>
          Provider event reference
          <input
            required
            minLength={1}
            maxLength={200}
            value={providerEventReference}
            onChange={(event) => setProviderEventReference(event.target.value)}
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
        <label>
          Estimated maturity (optional)
          <input
            type="datetime-local"
            value={estimatedMaturityAt}
            onChange={(event) => setEstimatedMaturityAt(event.target.value)}
          />
        </label>
        <div className="button-row">
          <button
            className="button button--primary"
            type="button"
            disabled={
              !participationId ||
              !providerEventReference ||
              reason.length < 3 ||
              action.state.status === "submitting"
            }
            onClick={() => void submit("validate")}
          >
            Validate
          </button>
          <button
            className="button button--danger"
            type="button"
            disabled={
              !participationId ||
              !providerEventReference ||
              reason.length < 3 ||
              action.state.status === "submitting"
            }
            onClick={() => void submit("reject")}
          >
            Reject
          </button>
        </div>
      </div>
    </section>
  );
}

function WalletSettlementForm() {
  const canSettle = useHasCapability()("admin.wallet.settle");
  const [transactionId, setTransactionId] = useState("");
  const [evidenceReference, setEvidenceReference] = useState("");
  const [reason, setReason] = useState("");
  const action = useAsyncAction<{ message: string }>();
  if (!canSettle) return null;

  async function submit(actionName: "mark-mature" | "mark-withdrawable") {
    await action.run(() =>
      api.admin.settleWalletTransaction(transactionId, actionName, {
        evidenceReference,
        reason,
      }),
    );
  }

  return (
    <section className="card form-card">
      <h2>Wallet settlement</h2>
      {action.state.status === "error" ? (
        <ErrorNotice error={action.state.error} />
      ) : null}
      {action.state.status === "success" ? (
        <InlineSuccess>{action.state.data.message}</InlineSuccess>
      ) : null}
      <div className="form-stack">
        <label>
          Transaction ID
          <input
            required
            value={transactionId}
            onChange={(event) => setTransactionId(event.target.value)}
          />
        </label>
        <label>
          Evidence reference
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
        <div className="button-row">
          <button
            className="button button--secondary"
            type="button"
            disabled={
              !transactionId ||
              evidenceReference.length < 3 ||
              reason.length < 3 ||
              action.state.status === "submitting"
            }
            onClick={() => void submit("mark-mature")}
          >
            Mark mature
          </button>
          <button
            className="button button--primary"
            type="button"
            disabled={
              !transactionId ||
              evidenceReference.length < 3 ||
              reason.length < 3 ||
              action.state.status === "submitting"
            }
            onClick={() => void submit("mark-withdrawable")}
          >
            Mark withdrawable
          </button>
        </div>
      </div>
    </section>
  );
}

export function AdminReconciliation() {
  return (
    <section>
      <PageHeader
        title="Reconciliation"
        description="Evidence-backed survey and wallet state transitions."
      />
      <div className="content-grid content-grid--two">
        <ParticipationReconciliationForm />
        <WalletSettlementForm />
      </div>
    </section>
  );
}

export function AdminAuditLog() {
  const { state, reload } = useApiResource(() =>
    api.admin.auditLogs({ limit: 100 }),
  );
  return (
    <section>
      <PageHeader
        title="Audit log"
        description="Most recent administrative and security actions."
      />
      {state.status === "loading" ? (
        <LoadingState label="Loading audit log" />
      ) : null}
      {state.status === "error" ? (
        <ErrorNotice error={state.error} onRetry={reload} />
      ) : null}
      {state.status === "success" ? (
        <div className="table-wrap card">
          <table>
            <thead>
              <tr>
                <th scope="col">Time</th>
                <th scope="col">Action</th>
                <th scope="col">Actor</th>
                <th scope="col">Target</th>
                <th scope="col">Outcome</th>
                <th scope="col">Reason</th>
              </tr>
            </thead>
            <tbody>
              {state.data.map((entry) => (
                <tr key={entry.id}>
                  <td>
                    <time dateTime={entry.createdAt}>
                      {formatDate(entry.createdAt)}
                    </time>
                  </td>
                  <td>{entry.action}</td>
                  <td>
                    {entry.actorType}
                    {entry.actorId ? ` · ${entry.actorId}` : ""}
                  </td>
                  <td>
                    {entry.targetType} · {entry.targetId}
                  </td>
                  <td>
                    <StatusBadge status={entry.outcome} />
                  </td>
                  <td>{entry.reason ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
