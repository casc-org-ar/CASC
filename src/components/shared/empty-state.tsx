/** Empty state using the CASC bracket motif, with an optional action slot. */
export function EmptyState({
  message,
  children,
}: {
  message: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface py-16 text-center">
      <span className="text-4xl font-extralight text-accent">[ ]</span>
      <p className="mt-3 text-sm text-ink-muted">{message}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
