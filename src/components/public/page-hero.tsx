/**
 * Public page hero — the standard title band for institutional pages.
 * The title scales down on small screens so long titles never overflow.
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
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-3xl text-base font-light leading-7 text-white/80 sm:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
