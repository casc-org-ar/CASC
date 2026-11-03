import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Boldonse } from "next/font/google";
import localFont from "next/font/local";
import { CountUpNumber } from "@/components/public/count-up-number";
import { socialLinks } from "@/components/public/nav-data";
import { Countdown, RotatingWord } from "./bsd-client";
import { bsdRegions, bsdShoppings, type BsdShopping } from "./shoppings";
import styles from "./bsd.module.css";

/**
 * Black Shopping Days 2026 — campaign landing, ported from the approved
 * prototype. Copy and layout match the prototype; only the counters, the
 * participating shoppings (logos + Instagram links) and the legal link change.
 */

const display = Boldonse({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bsd-display",
  display: "swap",
  // Next has no metric overrides for Boldonse; skip the generated fallback.
  adjustFontFallback: false,
});

const body = localFont({
  src: [
    { path: "./fonts/satoshi-400.woff2", weight: "400" },
    { path: "./fonts/satoshi-500.woff2", weight: "500" },
    { path: "./fonts/satoshi-700.woff2", weight: "700" },
    { path: "./fonts/satoshi-900.woff2", weight: "900" },
  ],
  variable: "--font-bsd-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Black Shopping Days",
  description:
    "Del 27 al 29 de noviembre, los Shoppings de todo el país se llenan de descuentos y experiencias. Black Shopping Days, impulsado por la Cámara Argentina de Shopping Centers.",
  openGraph: {
    title: "Black Shopping Days — 27, 28 y 29 de noviembre",
    description:
      "Descuentos que se viven en movimiento en más de 70 Shoppings de todo el país.",
    images: [
      {
        url: "/assets/black-shopping-days/bsd-logo.webp",
        alt: "Black Shopping Days",
      },
    ],
  },
};

/** Headline counters. Shoppings is shown as "+70" on purpose (no exact figure). */
const STAT_SHOPPINGS = 70;
const STAT_DAYS = 3;
const STAT_PROVINCES = 15;

const ASSETS = "/assets/black-shopping-days";
const shape = (n: number) =>
  `${ASSETS}/3d/shape-${String(n).padStart(2, "0")}.webp`;
const CASC_LOGO = "/brand/casc-logo-full-white.png";

const repeat = (list: string[], times: number) =>
  Array.from({ length: times }, () => list).flat();

const TICKER_TOP = repeat(
  [
    "27, 28 y 29 de noviembre",
    "Black Shopping Days",
    "Descuentos que se viven en movimiento",
  ],
  4,
);
const TICKER_MID = repeat(
  [
    "Recorrer",
    "Descubrir",
    "Probar",
    "Elegir",
    "Compartir",
    "Encontrarte",
    "Disfrutar",
  ],
  4,
);
const TICKER_TAGS = repeat(
  ["#BlackShoppingDays", "#DescuentosQueSeVivenEnMovimiento"],
  6,
);

const PILLARS = [
  {
    img: shape(1),
    title: "Aprove­char",
    color: "#c2ff03",
    text: "Descuentos, promociones y beneficios que te invitan a salir y recorrer.",
  },
  {
    img: shape(2),
    title: "Descu­brir",
    color: "#dcb8fd",
    text: "Vidrieras, productos y oportunidades que encontrás a cada paso.",
  },
  {
    img: shape(8),
    title: "Elegir",
    color: "#41e081",
    text: "Mirá, probá, compará y llevate lo que más te gusta en el momento.",
  },
  {
    img: shape(6),
    title: "Compar­tir",
    color: "#a996ff",
    text: "Encontrate con amigos o familia y convertí una vuelta por el Shopping en un plan.",
  },
  {
    img: shape(5),
    title: "Experi­mentar",
    color: "#c2ff03",
    text: "Compras, gastronomía, entretenimiento y momentos para disfrutar más allá de las vidrieras.",
  },
];

/** Footer columns, as in the prototype (a curated subset of the site footer). */
const FOOTER_COLUMNS = [
  {
    title: "Institucional",
    links: [
      { label: "Sobre la Cámara", href: "/nosotros" },
      { label: "Comisión Directiva", href: "/comision-directiva" },
      { label: "Datos del sector", href: "/datos-del-sector" },
      { label: "Delegaciones Regionales", href: "/delegaciones-regionales" },
    ],
  },
  {
    title: "Asociados",
    links: [
      {
        label: "Shopping Centers",
        href: "/asociados?categoria=shopping-centers#directorio",
      },
      { label: "Beneficios", href: "/beneficios" },
      { label: "Cómo asociarse", href: "/como-asociarse" },
    ],
  },
  {
    title: "Secciones",
    links: [
      { label: "Actividades", href: "/actividades" },
      { label: "Noticias", href: "/noticias" },
      { label: "Black Shopping Days", href: "#inicio" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
];

/** Seconds each logo takes to cross the strip; keeps every row at the same visual speed. */
const SECONDS_PER_LOGO = 6;

function Ticker({
  words,
  tone,
  tilt,
  reverse = false,
}: {
  words: string[];
  tone: string;
  tilt?: string;
  reverse?: boolean;
}) {
  return (
    <div
      className={`${styles.ticker} ${tone} ${tilt ?? ""}`}
      aria-hidden="true"
    >
      <div className={`${styles.track} ${reverse ? styles.trackRev : ""}`}>
        {words.map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>
    </div>
  );
}

function LogoCard({ shop, clone }: { shop: BsdShopping; clone: boolean }) {
  const content = shop.logo ? (
    <span className={styles.logoImg}>
      <Image
        src={shop.logo}
        alt={shop.name}
        fill
        sizes="(max-width: 560px) 230px, 310px"
      />
    </span>
  ) : (
    <span className={styles.logoName}>{shop.name}</span>
  );

  if (!shop.instagram) {
    return (
      <div className={styles.logo} title={shop.name}>
        {content}
      </div>
    );
  }
  return (
    <a
      className={styles.logo}
      href={shop.instagram}
      target="_blank"
      rel="noopener noreferrer"
      title={shop.name}
      tabIndex={clone ? -1 : undefined}
    >
      {content}
    </a>
  );
}

function RegionStrip({
  index,
  name,
  color,
}: {
  index: number;
  name: string;
  color: string;
}) {
  const list = bsdShoppings.filter((s) => s.region === name);
  // Short rows are repeated so the belt is always wider than the viewport.
  let row = list;
  while (row.length < 10) row = row.concat(list);
  const duration = `${(row.length * SECONDS_PER_LOGO).toFixed(1)}s`;

  return (
    <div>
      <div className={`${styles.wrap} ${styles.regionHead}`}>
        <h3 className={styles.regionName}>{name}</h3>
        <span className={styles.regionCount} style={{ background: color }}>
          {list.length}
        </span>
      </div>
      <div className={`${styles.strip} ${index % 2 ? styles.stripRev : ""}`}>
        <div className={styles.belt} style={{ animationDuration: duration }}>
          {[false, true].map((clone) => (
            <div
              key={String(clone)}
              className={styles.half}
              aria-hidden={clone || undefined}
            >
              {row.map((shop, i) => (
                <LogoCard
                  key={`${shop.name}-${i}`}
                  shop={shop}
                  clone={clone || i >= list.length}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BlackShoppingDaysPage() {
  return (
    <div className={`${styles.root} ${display.variable} ${body.variable}`}>
      <Ticker words={TICKER_TOP} tone={styles.tickerLime} />

      {/* Banner */}
      <section id="inicio" className={styles.banner}>
        <Image
          className={`${styles.f3d} ${styles.float}`}
          src={shape(1)}
          alt=""
          width={92}
          height={92}
          style={{ top: 30, left: "2%" }}
          priority
        />
        <Image
          className={`${styles.f3d} ${styles.float} ${styles.floatB}`}
          src={shape(2)}
          alt=""
          width={110}
          height={110}
          style={{ top: -30, left: "56%", rotate: "70deg" }}
        />
        <Image
          className={`${styles.f3d} ${styles.float} ${styles.floatC} ${styles.hideS}`}
          src={shape(2)}
          alt=""
          width={73}
          height={186}
          style={{ bottom: -40, left: 623, rotate: "-20deg" }}
        />
        <Image
          className={`${styles.f3d} ${styles.float} ${styles.floatB}`}
          src={shape(3)}
          alt=""
          width={120}
          height={120}
          style={{ bottom: -34, left: -24 }}
        />
        <Image
          className={`${styles.f3d} ${styles.float} ${styles.hideS}`}
          src={shape(1)}
          alt=""
          width={90}
          height={90}
          style={{ top: "22%", right: -26 }}
        />
        <Image
          className={`${styles.f3d} ${styles.float} ${styles.floatC}`}
          src={shape(4)}
          alt=""
          width={76}
          height={80}
          style={{ bottom: 70, right: 103 }}
        />

        <div className={styles.powered}>
          Impulsado por{" "}
          <Image src={CASC_LOGO} alt="CASC" width={61} height={28} />
        </div>

        <div className={`${styles.wrap} ${styles.bGrid}`}>
          <div className={styles.bLogo}>
            <Image
              src={`${ASSETS}/bsd-logo.webp`}
              alt="Black Shopping Days"
              width={660}
              height={660}
              priority
            />
          </div>
          <div>
            <p className={styles.bDate}>27, 28 y 29 de noviembre</p>
            <h1 className={styles.bTitle}>
              Descuentos que se viven en{" "}
              <span className={styles.bTitleAccent}>Movimiento</span>
            </h1>
          </div>
          <div className={styles.bSide}>
            <p className={styles.bCopy}>
              Del 27 al 29 de noviembre, los Shoppings se llenan de
              oportunidades para descubrir, recorrer y disfrutar.
              <br aria-hidden="true" />
              ¡Ponete en movimiento!
            </p>
            <Countdown />
            <a className={styles.btnLime} href="#shoppings">
              Conocé más
            </a>
          </div>
        </div>
      </section>

      {/* Sobre el evento + diferenciales */}
      <section id="evento" className={styles.sec}>
        <Image
          className={`${styles.f3d} ${styles.float} ${styles.floatC}`}
          src={shape(9)}
          alt=""
          width={110}
          height={110}
          style={{ bottom: 40, left: -30 }}
        />
        <div className={styles.wrap}>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutText}>
              <span className={styles.kicker} style={{ color: "var(--lime)" }}>
                Sobre el evento
              </span>
              {/* "Descuentos para" on one line, the rotating word below it. */}
              <h2 className={`${styles.h2} ${styles.aboutTitle}`}>
                Descuentos para <RotatingWord />
              </h2>
              <div className={`${styles.lead} ${styles.aboutCopy}`}>
                <p>
                  BLACK SHOPPING DAYS es una acción comercial impulsada por la
                  Cámara Argentina de Shopping Centers que llega a los Shoppings
                  de todo el país en el marco de Black Friday.
                </p>
                <p className={styles.aboutStrong}>
                  Durante tres días, los descuentos son solo el comienzo. Una
                  oportunidad para recorrer, descubrir, probar, comparar y
                  encontrar eso que estabas buscando, con la posibilidad de
                  llevártelo en el momento.
                </p>
              </div>
              <p className={styles.closing}>
                El descuento te lleva al Shopping.
                <br />
                <span className={styles.closingAccent}>
                  El movimiento empieza cuando llegás.
                </span>
              </p>
              <div className={styles.socials}>
                <a
                  className={styles.social}
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram de CASC"
                >
                  <svg
                    aria-hidden="true"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                  </svg>
                </a>
                <a
                  className={styles.social}
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn de CASC"
                >
                  <svg
                    aria-hidden="true"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm7 0h3.8v1.5h.06c.53-1 1.83-2.05 3.76-2.05 4.02 0 4.76 2.65 4.76 6.1v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.91h-4v-11Z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className={styles.diffs}>
              <div className={`${styles.d} ${styles.dLime}`}>
                <Image src={shape(5)} alt="" width={86} height={86} />
                <div className={styles.dNum}>
                  +<CountUpNumber value={STAT_SHOPPINGS} />
                </div>
                <div className={styles.dLabel}>Shoppings adheridos</div>
              </div>
              <div className={`${styles.d} ${styles.dLilac}`}>
                <Image src={shape(6)} alt="" width={86} height={86} />
                <div className={styles.dNum}>
                  <CountUpNumber value={STAT_DAYS} />
                </div>
                <div className={styles.dLabel}>
                  días de descuentos y experiencias
                </div>
              </div>
              <div className={`${styles.d} ${styles.dViolet}`}>
                <Image src={shape(7)} alt="" width={86} height={86} />
                <div className={styles.dNum}>
                  <CountUpNumber value={STAT_PROVINCES} />
                </div>
                <div className={styles.dLabel}>provincias en movimiento</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pilares */}
      <div className={`${styles.tkw} ${styles.tkwToPaper}`}>
        <Ticker
          words={TICKER_MID}
          tone={styles.tickerLime}
          tilt={styles.tiltDown}
        />
      </div>
      <section id="pilares" className={`${styles.sec} ${styles.pillars}`}>
        <div className={styles.wrap}>
          <span className={styles.kicker} style={{ color: "var(--violet)" }}>
            Cómo se vive
          </span>
          <h2 className={`${styles.h2} ${styles.pillarsTitle}`}>
            Descuentos y experiencias en movimiento
          </h2>
          <p className={`${styles.lead} ${styles.pillarsLead}`}>
            Una vidriera te lleva a otra, un producto al siguiente. Cada
            recorrido es una oportunidad para descubrir, elegir y disfrutar de
            todo lo que ofrece una visita al Shopping.
          </p>
          <div className={styles.pgrid}>
            {PILLARS.map((p, i) => (
              <article
                key={p.title}
                className={`${styles.pill} ${i % 2 ? styles.pillEven : styles.pillOdd} ${i === PILLARS.length - 1 ? styles.pillLast : ""}`}
              >
                <Image src={p.img} alt="" width={84} height={84} />
                <h3 style={{ color: p.color }}>{p.title}</h3>
                <p>{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Shoppings adheridos */}
      <section id="shoppings" className={styles.sec}>
        <div className={`${styles.wrap} ${styles.shopHead}`}>
          <div>
            <span className={styles.kicker} style={{ color: "var(--lime)" }}>
              Shoppings adheridos
            </span>
            <h2 className={`${styles.h2} ${styles.shopTitle}`}>
              ¿Dónde te <span style={{ color: "var(--lime)" }}>movés</span>?
            </h2>
            <p className={styles.shopIntro}>
              Hacé clic en el logo de cada Shopping y descubrí las oportunidades
              que tienen para vos durante BLACK SHOPPING DAYS.
            </p>
          </div>
          <div className={styles.total}>
            +{STAT_SHOPPINGS}
            <span className={styles.totalLabel}>Shoppings en todo el país</span>
          </div>
        </div>
        <div className={styles.regions}>
          {bsdRegions.map((r, i) => (
            <RegionStrip key={r.name} index={i} name={r.name} color={r.color} />
          ))}
        </div>
      </section>

      <div className={styles.tkw}>
        <Ticker
          words={TICKER_TAGS}
          tone={styles.tickerLilac}
          tilt={styles.tiltUp}
          reverse
        />
      </div>

      {/* Impulsado por */}
      <section id="impulsado" className={styles.casc}>
        <div className={`${styles.wrap} ${styles.cascGrid}`}>
          <div>
            <p className={styles.cascKicker}>Impulsado por</p>
            <Image
              src={CASC_LOGO}
              alt="Cámara Argentina de Shopping Centers"
              width={140}
              height={64}
              style={{ height: 64, width: "auto" }}
            />
          </div>
          <p className={styles.cascText}>
            La Cámara Argentina de Shopping Centers es una entidad sin fines de
            lucro que desde hace más de 35 años representa, conecta y acompaña a
            los centros comerciales del país.
          </p>
          <Link className={styles.btnGhost} href="/nosotros">
            Conocé más
          </Link>
        </div>
      </section>

      {/* Landing footer (replaces the site footer on this page, see FooterGate) */}
      <footer className={styles.foot}>
        <div className={`${styles.wrap} ${styles.footGrid}`}>
          {/* No logo/description column: "Impulsado por" right above already presents CASC. */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className={styles.footTitle}>{col.title}</h4>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className={styles.footLegal}>
            <p>
              La Cámara Argentina de Shopping Centers actúa únicamente como
              impulsora de Black Shopping Days. Los descuentos, promociones y
              actividades son ofrecidos por cada Shopping participante y sus
              locales, bajo sus propias condiciones.
            </p>
            <div className={styles.footBottom}>
              <span>
                © 2026 Cámara Argentina de Shopping Centers. Todos los derechos
                reservados.
              </span>
              <Link href="/black-shopping-days/terminos-y-condiciones">
                Términos y condiciones
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
