/**
 * Public page hero — the standard title band for institutional pages.
 * Uses the brand bracket motif via the shared token color.
 */
export function PageHero({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">
          <span className="text-accent">[</span> {title}{" "}
          <span className="text-accent">]</span>
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-3xl text-lg font-light text-ink-muted">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
