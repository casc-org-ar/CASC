import Image from "next/image";
import { SOCIAL_LINKS } from "@/data/shoppings";

const SOCIALS = [
  { href: SOCIAL_LINKS.instagram, icon: "/icons/social-instagram-sm.svg", label: "Instagram" },
  { href: SOCIAL_LINKS.facebook, icon: "/icons/social-facebook-sm.svg", label: "Facebook" },
  { href: SOCIAL_LINKS.tiktok, icon: "/icons/social-tiktok-sm.svg", label: "TikTok" },
];

/**
 * Closing section, over `bg-footer.webp` on desktop and `bg-mobile.webp` below
 * 768px — the original swapped the background image at that breakpoint, so both
 * files are kept.
 */
export function Footer() {
  return (
    <footer className="z-1 flex min-h-[700px] flex-col items-center justify-center bg-[url('/images/bg-footer.webp')] bg-auto bg-center bg-no-repeat max-mobile:min-h-[600px] max-mobile:bg-[url('/images/bg-mobile.webp')] max-mobile:p-[5vw]">
      <div className="boxed flex w-full flex-col items-center justify-center">
      <h2 className="w-full text-center font-display text-[3.75vw] font-normal text-cream max-tablet:text-[5vw] max-mobile:text-[7vw]">
        <b>Shopping Fest ya es parte</b>
        <br /> del calendario argentino
      </h2>

      <p className="mx-auto mt-2.5 w-[75%] max-w-[75%] self-center text-center font-body text-[1.875vw] leading-[1.1em] font-normal text-cream max-tablet:text-[3vw] max-mobile:w-full max-mobile:max-w-full max-mobile:text-[5vw]">
        3 días donde lo mejor es venir <br />
        ¡Seguinos para más novedades!
      </p>

      <div className="scroll-bottom mt-[30px] flex justify-center gap-x-20 max-mobile:gap-x-[30px]">
        {SOCIALS.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Shopping Fest en ${social.label}`}
            /*
             * Elementor's social-icons widget sizes the *glyph* (--icon-size:
             * 50px) and adds --icon-padding: 0.3em around it, so the tile is
             * 50 + 2*15 = 80px. Mobile: 12vw glyph, same 0.3em ratio.
             */
            className="flex size-[80px] items-center justify-center rounded-[10px] bg-cream p-[15px] transition-transform hover:scale-110 max-mobile:size-[19.2vw] max-mobile:p-[3.6vw]"
          >
            <Image src={social.icon} alt="" width={56} height={56} className="size-full" />
          </a>
        ))}
      </div>

      <div className="mt-[25px] flex flex-row items-center justify-center gap-5 max-mobile:mt-[35px] max-mobile:flex-col">
        <p className="mt-2.5 text-center font-body text-[1.354vw] font-normal text-cream max-tablet:text-[2vw] max-mobile:mt-0 max-mobile:text-[4vw]">
          IMPULSADO POR
        </p>

        <Image
          src="/images/casc-white.png"
          alt="Cámara Argentina de Shopping Centers"
          width={832}
          height={372}
          className="w-[150px]"
        />

        <a
          href="https://www.instagram.com/camaraargentinadeshopping?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-[34px] border-[3px] border-cream px-5 py-2 font-body text-[1.354vw] font-normal text-cream transition-colors hover:bg-cream hover:text-teal-dark max-tablet:text-[3vw] max-mobile:text-[4vw]"
        >
          Seguí a CASC en redes
        </a>
      </div>
      </div>
    </footer>
  );
}
