import Link from "next/link";

/**
 * "Sumate a la Cámara" call-to-action band. Reused across institutional pages,
 * verbatim from the original site.
 */
export function JoinCta() {
  return (
    <section className="bg-casc-navy-900">
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="mx-auto mb-6 max-w-2xl text-3xl font-extrabold tracking-tight text-white">
          Sumate a la Cámara que representa a los Shopping Centers de Argentina
        </h2>
        <Link
          href="/como-asociarse"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          Asociarse
        </Link>
      </div>
    </section>
  );
}
