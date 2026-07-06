interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

/** Page section heading using the brand bracket motif. */
export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight text-ink">
        <span className="casc-bracket">{title}</span>
      </h1>
      {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
    </div>
  );
}
