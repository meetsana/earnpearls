export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase().replaceAll("_", "-");
  return (
    <span className={`status-badge status-badge--${normalized}`}>
      <span aria-hidden="true">●</span> {status.replaceAll("_", " ")}
    </span>
  );
}
