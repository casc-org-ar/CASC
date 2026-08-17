import Image from "next/image";

/**
 * "IMPULSADO POR" — the CASC attribution block on the cream background.
 *
 * No tablet rule existed in the original for this section: the desktop padding
 * (100px block, 0 inline) carries through to 1024px, and only mobile adds the
 * 5vw inset. Same for the Instagram band and the footer.
 */
export function PoweredByCasc() {
  return (
    <section className="bg-cream px-0 py-[100px] max-mobile:px-[5vw] max-mobile:py-[10vw]">
      <div className="boxed flex flex-col gap-5 max-mobile:items-center max-mobile:justify-center max-mobile:gap-5">
      <p className="text-center font-body text-[1.354vw] leading-[36px] font-normal max-tablet:text-[3vw] max-mobile:text-[4vw]">
        IMPULSADO POR
      </p>

      <Image
        src="/images/casc-black.png"
        alt="Cámara Argentina de Shopping Centers"
        width={832}
        height={372}
        className="mx-auto mt-[-10px] mb-[30px] w-[235px] max-mobile:w-[180px]"
      />

      <p className="mx-auto w-[80%] max-w-[80%] self-center text-center font-body text-[1.354vw] leading-[1.3em] max-tablet:text-[3vw] max-mobile:mt-[-20px] max-mobile:w-full max-mobile:max-w-full max-mobile:text-[4vw]">
        Shopping Fest es una iniciativa de la{" "}
        <b>Cámara Argentina de Shopping Centers (CASC)</b>, la entidad que reúne
        a los shoppings, galerías y centros comerciales de todo el país y{" "}
        <b>promueve el desarrollo de la industria a nivel nacional.</b>
        <br />
        <br />
        <a
          href="https://casc.org.ar/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange underline transition-colors hover:text-orange-hover"
        >
          CONOCÉ MÁS
        </a>
      </p>
      </div>
    </section>
  );
}
