/**
 * Scrolling announcement bar at the very top of the page.
 *
 * The original was an Elementor HTML widget whose inline script appended eight
 * identical segments to an empty track at runtime. Rendering those segments as
 * markup instead means the bar is there on first paint, with no JS.
 *
 * The marquee keyframes translate by -50%, so the track holds two identical
 * halves and the loop is seamless.
 */
const SEGMENTS_PER_HALF = 4;

function Segment() {
  return (
    <span className="inline-flex items-center pr-10 font-body text-[16px] leading-none font-bold text-teal-text max-mobile:pr-5 max-mobile:text-[14px]">
      NOS VEMOS EN LA PRÓXIMA EDICIÓN
    </span>
  );
}

export function AnnouncementBar() {
  const half = Array.from({ length: SEGMENTS_PER_HALF }, (_, i) => (
    <Segment key={i} />
  ));

  return (
    <div
      className="relative flex h-10 w-full items-center justify-center overflow-hidden bg-lime"
      aria-label="Nos vemos en la próxima edición"
    >
      <div className="pointer-events-none absolute top-0 left-0 z-2 h-full w-20 bg-gradient-to-r from-lime from-40% to-transparent max-mobile:w-8" />
      <div className="pointer-events-none absolute top-0 right-0 z-2 h-full w-20 bg-gradient-to-l from-lime from-40% to-transparent max-mobile:w-8" />
      <div className="animate-marquee flex whitespace-nowrap will-change-transform hover:[animation-play-state:paused]">
        {half}
        {half}
      </div>
    </div>
  );
}
