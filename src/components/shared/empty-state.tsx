/** Empty state using the CASC bracket motif. */
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface py-16 text-center">
      <span className="text-4xl font-extralight text-accent">[ ]</span>
      <p className="mt-3 text-sm text-ink-muted">{message}</p>
    </div>
  );
}
