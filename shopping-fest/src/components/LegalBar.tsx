import Link from "next/link";

/**
 * Trademark notice, liability disclaimer and the Terms & Conditions link.
 */
export function LegalBar() {
  return (
    <section className="bg-cream px-0 py-[30px] max-tablet:p-[5vw]">
      {/*
        Two widgets here, not three: the heading and the disclaimer are one
        icon-box, so Elementor's 20px widget gap falls only before the button.
      */}
      <div className="boxed flex flex-col">
      {/*
        icon-box widget — keeps the theme's 1.2 line-height and its 0.5rem
        top margin (both survive Elementor's reset here, unlike headings).
      */}
      <h3 className="mt-2 mb-2.5 font-body text-[1.5vw] leading-[1.2] font-semibold max-mobile:text-[4.5vw]">
        SHOPPING FEST |{" "}
        <a
          href="https://portaltramites.inpi.gob.ar/MarcasConsultas/Grilla"
          target="_blank"
          rel="noopener noreferrer"
          className="font-normal underline"
        >
          MARCA REGISTRADA
        </a>
      </h3>

      <p className="font-body text-[1vw] max-mobile:text-[3.5vw]">
        El uso de este sitio web implica la aceptación de los Términos y
        Condiciones de Shopping Fest. Shopping Fest es un evento organizado por
        la Cámara Argentina de Shopping Centers (CASC), quien actúa
        exclusivamente como promotora y difusora del evento. Las ofertas,
        promociones y beneficios son ofrecidos de forma directa por los centros
        comerciales, marcas y locatarios participantes, bajo sus propios Términos
        y Condiciones. Se recomienda consultar los sitios y puntos de venta de
        cada Empresa Participante para conocer el detalle de cada oferta y/o
        promoción.
      </p>

      <Link
        href="/terminos-y-condiciones"
        className="mx-auto mt-5 self-center border-b border-amber font-body font-normal text-amber transition-colors hover:text-amber-hover max-tablet:text-[3vw] max-mobile:text-[4vw]"
      >
        Términos y Condiciones
      </Link>
      </div>
    </section>
  );
}
