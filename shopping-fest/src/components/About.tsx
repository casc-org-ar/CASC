import Image from "next/image";
import { SOCIAL_LINKS } from "@/data/shoppings";

const SOCIALS = [
  { href: SOCIAL_LINKS.instagram, icon: "/icons/social-instagram-lg.svg", label: "Instagram" },
  { href: SOCIAL_LINKS.facebook, icon: "/icons/social-facebook-lg.svg", label: "Facebook" },
  { href: SOCIAL_LINKS.tiktok, icon: "/icons/social-tiktok-lg.svg", label: "TikTok" },
];

/**
 * "Sobre el evento" — the event description plus the three large social tiles.
 *
 * Font sizes stay in `vw` exactly as Elementor emitted them (3.75vw desktop /
 * 5vw tablet / 7vw mobile for the title). They are viewport-relative by design,
 * so converting them to a fixed scale would change how the page reads.
 */
export function About() {
  return (
    <section className="bg-cream px-0 py-[5.208vw] max-tablet:p-[5vw] max-mobile:px-[5vw] max-mobile:py-[10vw]">
      <div className="boxed flex flex-col items-center justify-center gap-2.5">
      {/* 3.5vw is a mobile-only override; desktop and tablet inherit 16px. */}
      <span className="scroll-bottom font-body font-normal max-mobile:text-[3.5vw]">
        SOBRE EL EVENTO
      </span>

      {/* Elementor's icon-box widget centres its content by default. */}
      <div className="scroll-bottom text-center">
        {/*
          Elementor's icon-box keeps the theme's 1.2 line-height (unlike its
          heading widget, which resets to 1) — hence the explicit leading here.
        */}
        <h2 className="mb-[25px] font-display text-[3.75vw] leading-[1.2] font-bold text-orange max-tablet:text-[5vw] max-mobile:mb-[15px] max-mobile:text-[7vw]">
          ¿Qué es Shopping Fest?
        </h2>
        <p className="font-body text-[1.875vw] leading-[1.3em] font-normal max-tablet:text-[3vw] max-mobile:text-[3.6vw]">
          <span className="font-bold text-teal-text">Shopping Fest</span> es un
          nuevo evento nacional que celebra el encuentro y el placer de salir a
          compartir.
          <br />
          <br />
          Durante <span className="font-bold text-teal-text">tres días</span>,
          los{" "}
          <span className="font-bold text-teal-text">
            centros comerciales de todo el país
          </span>{" "}
          se llenan de{" "}
          <span className="font-bold text-teal-text">
            actividades, sorpresas y descuentos increíbles
          </span>{" "}
          para que venir al shopping sea tu mejor plan del fin de semana.
          <br />
          <br />
          Una invitación para recorrer, descubrir y disfrutar un momento especial
          con los tuyos.
        </p>
      </div>

      <div className="mt-[30px] flex w-full flex-row items-center justify-evenly gap-5 max-mobile:mt-5 max-mobile:gap-0">
        {SOCIALS.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Shopping Fest en ${social.label}`}
          >
            <Image
              src={social.icon}
              alt=""
              width={214}
              height={214}
              className="h-[11vw] w-[11vw] max-tablet:h-[15vw] max-tablet:w-[15vw] max-mobile:h-[18vw] max-mobile:w-[18vw]"
            />
          </a>
        ))}
      </div>
      </div>
    </section>
  );
}
