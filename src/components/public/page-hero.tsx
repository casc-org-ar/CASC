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
    <section className="bg-casc-navy-900">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white">
          <span className="text-accent">[</span> {title}{" "}
          <span className="text-accent">]</span>
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-3xl text-lg font-light text-white/80">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
