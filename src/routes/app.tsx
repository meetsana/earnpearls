import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../api/endpoints";
import type {
  CursorPage,
  Dashboard as DashboardData,
  Survey,
  WalletSummary,
  WalletTransaction,
  Withdrawal,
  WithdrawalMethod,
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
import {
  compareIntegerStrings,
  formatIntegerString,
  isPositiveIntegerString,
} from "../lib/money";
import {
  useHasCapability,
  useSessionContext,
} from "../session/SessionProvider";
import { PageHeader } from "./ScreenSkeleton";

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function WalletCards({ wallet }: { wallet: WalletSummary }) {
  const buckets = [
    ["Pending", wallet.pending],
    ["Validated", wallet.validated],
    ["Mature", wallet.mature],
    ["Withdrawable", wallet.withdrawable],
  ] as const;
  return (
    <div className="metric-grid">
      {buckets.map(([label, value]) => (
        <article className="metric-card" key={label}>
          <span>{label}</span>
          <MoneyValue value={value} />
        </article>
      ))}
    </div>
  );
}

function DashboardContent({ data }: { data: DashboardData }) {
  return (
    <>
      {data.announcements.map((announcement) => (
        <section
          className={`alert alert--${announcement.severity}`}
          key={announcement.id}
        >
          <strong>{announcement.title}</strong>
          <p>{announcement.body}</p>
        </section>
      ))}
      <WalletCards wallet={data.wallet} />
      <div className="content-grid content-grid--two">
        <section className="card">
          <h2>Surveys</h2>
          <p className="large-number">{data.availableSurveyCount}</p>
          <p>Currently available for your account.</p>
        </section>
        <section className="card">
          <h2>Active withdrawal</h2>
          {data.activeWithdrawal ? (
            <div className="stack-sm">
              <MoneyValue value={data.activeWithdrawal.amount} />
              <StatusBadge status={data.activeWithdrawal.status} />
            </div>
          ) : (
            <p>No active withdrawal.</p>
          )}
        </section>
      </div>
      <section className="card">
        <h2>Recent wallet activity</h2>
        {data.recentTransactions.length === 0 ? (
          <p>No wallet activity yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Description</th>
                  <th scope="col">Status</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Updated</th>
                </tr>
              </thead>
              <tbody>
                {data.recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.description}</td>
                    <td>
                      <StatusBadge status={transaction.currentBucket} />
                    </td>
                    <td>
                      <MoneyValue value={transaction.amount} compact />
                    </td>
                    <td>
                      <time dateTime={transaction.updatedAt}>
                        {formatDate(transaction.updatedAt)}
                      </time>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

export function Dashboard() {
  const { state, reload } = useApiResource(() => api.dashboard());
  return (
    <section>
      <PageHeader
        title="Dashboard"
        description="Your server-confirmed rewards and activity."
      />
      {state.status === "loading" ? (
        <LoadingState label="Loading dashboard" />
      ) : null}
      {state.status === "error" ? (
        <ErrorNotice error={state.error} onRetry={reload} />
      ) : null}
      {state.status === "success" ? (
        <DashboardContent data={state.data} />
      ) : null}
    </section>
  );
}

function SurveyCard({
  survey,
  onStart,
  busy,
}: {
  survey: Survey;
  onStart: () => void;
  busy: boolean;
}) {
  const canStart = useHasCapability()("survey.start");
  return (
    <article className="card survey-card">
      <div className="card-heading">
        <h2>{survey.title}</h2>
        <MoneyValue value={survey.reward} />
      </div>
      <dl className="detail-list">
        <div>
          <dt>Estimated time</dt>
          <dd>
            {survey.estimatedMinutes === null
              ? "Not provided"
              : `${survey.estimatedMinutes} min`}
          </dd>
        </div>
        <div>
          <dt>Category</dt>
          <dd>{survey.category ?? "General"}</dd>
        </div>
        <div>
          <dt>Devices</dt>
          <dd>
            {survey.deviceCompatibility.length > 0
              ? survey.deviceCompatibility.join(", ")
              : "Not specified"}
          </dd>
        </div>
      </dl>
      {canStart ? (
        <button
          className="button button--primary"
          type="button"
          disabled={busy || !survey.available || !survey.countryEligible}
          onClick={onStart}
        >
          {busy ? "Starting…" : "Start survey"}
        </button>
      ) : null}
    </article>
  );
}

export function Surveys() {
  const { state, reload } = useApiResource(() => api.surveys.list());
  const action = useAsyncAction<unknown>();
  const [startingId, setStartingId] = useState<string | null>(null);

  async function start(surveyId: string) {
    setStartingId(surveyId);
    const started = await action.run(() => api.surveys.start(surveyId));
    setStartingId(null);
    if (
      started !== null &&
      typeof started === "object" &&
      "launchUrl" in started
    ) {
      window.location.assign(String(started.launchUrl));
    }
  }

  return (
    <section>
      <PageHeader
        title="Surveys"
        description="Available surveys are filtered by the server."
      />
      {action.state.status === "error" ? (
        <ErrorNotice error={action.state.error} />
      ) : null}
      {state.status === "loading" ? (
        <LoadingState label="Loading surveys" />
      ) : null}
      {state.status === "error" ? (
        <ErrorNotice error={state.error} onRetry={reload} />
      ) : null}
      {state.status === "success" && state.data.length === 0 ? (
        <EmptyState title="No surveys available">
          <p>Check back later. Availability can change without notice.</p>
        </EmptyState>
      ) : null}
      {state.status === "success" && state.data.length > 0 ? (
        <div className="content-grid content-grid--three">
          {state.data.map((survey) => (
            <SurveyCard
              key={survey.id}
              survey={survey}
              busy={startingId === survey.id}
              onStart={() => void start(survey.id)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function TransactionTable({
  transactions,
}: {
  transactions: WalletTransaction[];
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">Description</th>
            <th scope="col">Status</th>
            <th scope="col">Amount</th>
            <th scope="col">Provider</th>
            <th scope="col">Maturity estimate</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.description}</td>
              <td>
                <StatusBadge status={transaction.currentBucket} />
              </td>
              <td>
                <MoneyValue value={transaction.amount} compact />
              </td>
              <td>{transaction.providerLabel ?? "—"}</td>
              <td>
                {transaction.estimatedMaturityAt ? (
                  <time dateTime={transaction.estimatedMaturityAt}>
                    {formatDate(transaction.estimatedMaturityAt)}
                  </time>
                ) : (
                  "Not provided"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WalletContent({
  summary,
  firstPage,
}: {
  summary: WalletSummary;
  firstPage: CursorPage<WalletTransaction>;
}) {
  const [transactions, setTransactions] = useState(firstPage.items);
  const [nextCursor, setNextCursor] = useState(firstPage.nextCursor);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<unknown>(null);

  async function loadMore() {
    if (nextCursor === null) return;
    setLoadingMore(true);
    setLoadError(null);
    try {
      const page = await api.wallet.transactions({
        cursor: nextCursor,
        limit: 25,
      });
      setTransactions((current) => [...current, ...page.items]);
      setNextCursor(page.nextCursor);
    } catch (error) {
      setLoadError(error);
    } finally {
      setLoadingMore(false);
    }
  }

  const allBuckets = [
    ["Pending", summary.pending],
    ["Validated", summary.validated],
    ["Mature", summary.mature],
    ["Withdrawable", summary.withdrawable],
    ["Reserved", summary.reserved],
    ["Paid", summary.paid],
    ["Rejected", summary.rejected],
    ["Reversed", summary.reversed],
  ] as const;

  return (
    <>
      <section className="card wallet-total">
        <div>
          <span>Total earnings</span>
          <MoneyValue value={summary.totalEarnings} />
        </div>
        <p>
          Conversion: {formatIntegerString(summary.conversion.pointsPerUsd)}{" "}
          points = 1 {summary.conversion.sourceCurrency}
        </p>
      </section>
      <div className="metric-grid metric-grid--compact">
        {allBuckets.map(([label, value]) => (
          <article className="metric-card" key={label}>
            <span>{label}</span>
            <MoneyValue value={value} />
          </article>
        ))}
      </div>
      <section className="card">
        <h2>Transactions</h2>
        {transactions.length === 0 ? (
          <p>No wallet transactions yet.</p>
        ) : (
          <TransactionTable transactions={transactions} />
        )}
        {loadError ? (
          <ErrorNotice error={loadError} onRetry={() => void loadMore()} />
        ) : null}
        {nextCursor ? (
          <button
            className="button button--secondary"
            disabled={loadingMore}
            onClick={() => void loadMore()}
          >
            {loadingMore ? "Loading…" : "Load more"}
          </button>
        ) : null}
      </section>
    </>
  );
}

export function Wallet() {
  const { state, reload } = useApiResource(async () => {
    const [summary, transactions] = await Promise.all([
      api.wallet.summary(),
      api.wallet.transactions({ limit: 25 }),
    ]);
    return { summary, transactions };
  });
  return (
    <section>
      <PageHeader
        title="Wallet"
        description="Every balance is returned by the wallet ledger."
      />
      {state.status === "loading" ? (
        <LoadingState label="Loading wallet" />
      ) : null}
      {state.status === "error" ? (
        <ErrorNotice error={state.error} onRetry={reload} />
      ) : null}
      {state.status === "success" ? (
        <WalletContent
          summary={state.data.summary}
          firstPage={state.data.transactions}
        />
      ) : null}
    </section>
  );
}

export function WithdrawalMethodsPanel({
  methods,
}: {
  methods: WithdrawalMethod[];
}) {
  const supported = methods.filter((method) => method.supportedForUser);
  const available = supported.filter((method) => method.enabled);
  if (supported.length === 0) {
    return (
      <EmptyState title="Withdrawals are not available yet">
        <p>
          No payout method is currently enabled and supported for your account.
        </p>
      </EmptyState>
    );
  }
  return (
    <>
      {available.length === 0 ? (
        <div className="alert alert--warning" role="status">
          <strong>Withdrawals are disabled in this environment.</strong>
          <p>
            These method cards are demonstration data only. No destination can
            be submitted and no payout can be created.
          </p>
        </div>
      ) : null}
      <div className="method-grid">
        {supported.map((method) => (
          <article className="card" key={method.code}>
            <h3>{method.displayName}</h3>
            <StatusBadge status={method.enabled ? "available" : "disabled"} />
            <p>
              Minimum: <MoneyValue value={method.minimum} compact />
            </p>
            <p>
              Fee: <MoneyValue value={method.fee} compact />
            </p>
          </article>
        ))}
      </div>
    </>
  );
}

function WithdrawalHistory({ withdrawals }: { withdrawals: Withdrawal[] }) {
  if (withdrawals.length === 0) return <p>No withdrawal requests yet.</p>;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">Requested</th>
            <th scope="col">Method</th>
            <th scope="col">Amount</th>
            <th scope="col">Fee</th>
            <th scope="col">Destination</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {withdrawals.map((withdrawal) => (
            <tr key={withdrawal.id}>
              <td>
                <time dateTime={withdrawal.requestedAt}>
                  {formatDate(withdrawal.requestedAt)}
                </time>
              </td>
              <td>{withdrawal.methodCode}</td>
              <td>
                <MoneyValue value={withdrawal.amount} compact />
              </td>
              <td>
                <MoneyValue value={withdrawal.fee} compact />
              </td>
              <td>{withdrawal.destinationMasked}</td>
              <td>
                <StatusBadge status={withdrawal.status} />
                {withdrawal.rejectionReason ? (
                  <p>{withdrawal.rejectionReason}</p>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WithdrawalContent({
  methods,
  history,
  withdrawablePoints,
  reload,
}: {
  methods: WithdrawalMethod[];
  history: Withdrawal[];
  withdrawablePoints: string;
  reload: () => void;
}) {
  const available = methods.filter(
    (method) => method.enabled && method.supportedForUser,
  );
  const canCreate = useHasCapability()("withdrawal.create");
  const [methodCode, setMethodCode] = useState(available[0]?.code ?? "");
  const [points, setPoints] = useState("");
  const [destination, setDestination] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const idempotency = useRef<{ fingerprint: string; key: string } | null>(null);
  const action = useAsyncAction<Withdrawal>();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    const method = available.find((item) => item.code === methodCode);
    if (!method || !isPositiveIntegerString(points)) {
      setFormError(
        "Enter a positive whole-number point amount and choose an available method.",
      );
      return;
    }
    if (compareIntegerStrings(points, method.minimum.points) < 0) {
      setFormError(
        `The selected method requires at least ${formatIntegerString(method.minimum.points)} points.`,
      );
      return;
    }
    if (compareIntegerStrings(points, withdrawablePoints) > 0) {
      setFormError(
        "The requested amount is higher than your withdrawable balance.",
      );
      return;
    }

    const body = { methodCode, points, destination };
    const fingerprint = JSON.stringify(body);
    if (idempotency.current?.fingerprint !== fingerprint) {
      idempotency.current = { fingerprint, key: crypto.randomUUID() };
    }
    const created = await action.run(() =>
      api.withdrawals.create(body, idempotency.current!.key),
    );
    if (created !== null) {
      idempotency.current = null;
      setPoints("");
      setDestination("");
      reload();
    }
  }

  return (
    <>
      <WithdrawalMethodsPanel methods={methods} />
      {available.length > 0 && canCreate ? (
        <section className="card form-card">
          <h2>Request a withdrawal</h2>
          <p>
            Withdrawable balance: {formatIntegerString(withdrawablePoints)}{" "}
            points.
          </p>
          {formError ? (
            <div className="alert alert--danger" role="alert">
              {formError}
            </div>
          ) : null}
          {action.state.status === "error" ? (
            <ErrorNotice error={action.state.error} />
          ) : null}
          {action.state.status === "success" ? (
            <InlineSuccess>
              Withdrawal request received with status {action.state.data.status}
              .
            </InlineSuccess>
          ) : null}
          <form className="form-stack" onSubmit={(event) => void submit(event)}>
            <label>
              Payout method
              <select
                value={methodCode}
                onChange={(event) => setMethodCode(event.target.value)}
              >
                {available.map((method) => (
                  <option value={method.code} key={method.code}>
                    {method.displayName}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Points
              <input
                required
                inputMode="numeric"
                pattern="[1-9][0-9]*"
                value={points}
                onChange={(event) => setPoints(event.target.value)}
              />
            </label>
            <label>
              Payout destination
              <input
                required
                minLength={3}
                maxLength={500}
                autoComplete="off"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
              />
              <small>
                The server stores this encrypted and returns only a masked
                value.
              </small>
            </label>
            <button
              className="button button--primary"
              disabled={action.state.status === "submitting"}
            >
              {action.state.status === "submitting"
                ? "Submitting…"
                : "Request withdrawal"}
            </button>
          </form>
        </section>
      ) : null}
      <section className="card">
        <h2>Withdrawal history</h2>
        <WithdrawalHistory withdrawals={history} />
      </section>
    </>
  );
}

export function Withdrawals() {
  const { state, reload } = useApiResource(async () => {
    const [methods, history, wallet] = await Promise.all([
      api.withdrawals.methods(),
      api.withdrawals.list(),
      api.wallet.summary(),
    ]);
    return { methods, history, wallet };
  });
  return (
    <section>
      <PageHeader
        title="Withdrawals"
        description="Only server-enabled methods and confirmed states are shown."
      />
      {state.status === "loading" ? (
        <LoadingState label="Loading withdrawals" />
      ) : null}
      {state.status === "error" ? (
        <ErrorNotice error={state.error} onRetry={reload} />
      ) : null}
      {state.status === "success" ? (
        <WithdrawalContent
          methods={state.data.methods}
          history={state.data.history}
          withdrawablePoints={state.data.wallet.withdrawable.points}
          reload={reload}
        />
      ) : null}
    </section>
  );
}

export function Profile() {
  const { state, reload } = useApiResource(() => api.auth.sessions());
  const action = useAsyncAction<{ message: string }>();
  const { clear } = useSessionContext();
  const navigate = useNavigate();

  async function revoke(sessionId: string, current: boolean) {
    const result = await action.run(() => api.auth.revokeSession(sessionId));
    if (result === null) return;
    if (current) {
      clear();
      navigate("/login", { replace: true });
    } else {
      reload();
    }
  }

  async function logoutAll() {
    const result = await action.run(() => api.auth.logoutAll());
    if (result !== null) {
      clear();
      navigate("/login", { replace: true });
    }
  }

  return (
    <section>
      <PageHeader
        title="Security"
        description="Review and revoke active sessions. Profile editing is not exposed by the current API contract."
        actions={
          <button
            className="button button--danger"
            type="button"
            disabled={action.state.status === "submitting"}
            onClick={() => void logoutAll()}
          >
            Sign out all sessions
          </button>
        }
      />
      {action.state.status === "error" ? (
        <ErrorNotice error={action.state.error} />
      ) : null}
      {state.status === "loading" ? (
        <LoadingState label="Loading sessions" />
      ) : null}
      {state.status === "error" ? (
        <ErrorNotice error={state.error} onRetry={reload} />
      ) : null}
      {state.status === "success" ? (
        <div className="content-grid content-grid--two">
          {state.data.map((session) => (
            <article className="card" key={session.id}>
              <div className="card-heading">
                <h2>
                  {session.current ? "Current session" : "Active session"}
                </h2>
                {session.current ? <StatusBadge status="current" /> : null}
              </div>
              <p className="break-word">
                {session.userAgent || "Unknown device"}
              </p>
              <dl className="detail-list">
                <div>
                  <dt>Last seen</dt>
                  <dd>{formatDate(session.lastSeenAt)}</dd>
                </div>
                <div>
                  <dt>Expires</dt>
                  <dd>{formatDate(session.expiresAt)}</dd>
                </div>
              </dl>
              <button
                className="button button--danger"
                type="button"
                disabled={action.state.status === "submitting"}
                onClick={() => void revoke(session.id, session.current)}
              >
                Revoke session
              </button>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
