/**
 * "¡Gracias por venir!" — orange band with the `banner-3.webp` photo behind it.
 *
 * Kept as a CSS background rather than next/image because the original relies
 * on `background-position: center right` + `cover`, which crops differently at
 * each breakpoint. The orange underneath shows through wherever the photo does
 * not reach.
 *
 * Two columns on desktop (35% / 40%), stacked and centred on tablet, and
 * left-aligned on mobile — matching the original's per-breakpoint alignment.
 */
export function ThankYou() {
  return (
    <section
      className="flex min-h-[668px] flex-row items-center justify-center gap-x-[60px] bg-orange bg-[url('/images/banner-3.webp')] bg-cover bg-[center_right] bg-no-repeat max-tablet:min-h-[500px] max-tablet:flex-col max-tablet:items-center max-tablet:gap-0 max-tablet:p-[5vw] max-mobile:min-h-[400px] max-mobile:items-start"
    >
      <h2 className="scroll-left w-[35%] max-w-[35%] pb-0 text-start font-body text-[7vw] font-bold text-cream max-tablet:w-auto max-tablet:max-w-full max-tablet:pb-[30px] max-tablet:text-center max-mobile:pb-5 max-mobile:text-start max-mobile:text-[9vw]">
        ¡Gracias por venir!
      </h2>
      <h2 className="scroll-right w-[40%] max-w-[40%] text-start font-body text-[1.875vw] leading-[1.3em] font-normal text-cream max-tablet:w-full max-tablet:max-w-full max-tablet:text-center max-tablet:text-[3vw] max-mobile:w-[75vw] max-mobile:max-w-[75vw] max-mobile:text-start max-mobile:text-[5vw]">
        Pasamos tres días increíbles en más de 65 shoppings, galerías y centros
        comerciales en distintas ciudades de Argentina.
      </h2>
    </section>
  );
}
