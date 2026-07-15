import Image from "next/image";

export interface MarqueeLogo {
  name: string;
  logo: string;
}

/**
 * Continuously scrolling strip of logos. Renders the list twice so the CSS
 * animation loops seamlessly. Pauses on hover. Used for the associated
 * Shopping Centers on the home page.
 */
export function LogoMarquee({ logos }: { logos: MarqueeLogo[] }) {
  const track = [...logos, ...logos];

  return (
    <div className="group relative overflow-hidden">
      {/* Edge fade so logos slide in/out softly */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-surface to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-surface to-transparent" />

      <ul className="flex w-max animate-marquee items-center gap-16 group-hover:[animation-play-state:paused]">
        {track.map((item, i) => (
          <li
            key={`${item.name}-${i}`}
            className="flex h-28 w-52 shrink-0 items-center justify-center"
          >
            <Image
              src={item.logo}
              alt={item.name}
              width={208}
              height={112}
              className="max-h-24 w-auto object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
