import Image from "next/image";

/**
 * Dark teal band reading "¡NOS VEMOS EN LA PRÓXIMA EDICIÓN!", with two
 * decorative shapes that deliberately overhang it (top-right and bottom-left).
 *
 * The overhang is why <body> carries `overflow-x: hidden` — see globals.css.
 * The shapes are `aria-hidden`: they carry no meaning.
 *
 * The band is `--content-width: 50vw` from 768px up and full-width below,
 * which is the one place the original used a min-width query.
 */
export function NextEdition() {
  return (
    <section className="relative flex flex-col items-center justify-center">
      <Image
        src="/icons/deco-flower-orange.svg"
        alt=""
        aria-hidden
        width={254}
        height={231}
        className="absolute -top-[115px] right-10 z-1 h-[230px] w-auto max-tablet:-top-20 max-tablet:right-5 max-tablet:h-[131px] max-mobile:-top-[45px] max-mobile:right-0 max-mobile:h-[20vw]"
      />

      <div className="flex w-full flex-row items-center justify-center bg-teal-dark px-0 py-[3.906vw] max-tablet:p-[5vw] max-mobile:p-[10vw]">
        <div className="w-[50vw] max-tablet:w-full">
          <h2 className="text-center font-display text-[2.344vw] font-bold text-cream max-tablet:text-[5vw] max-mobile:text-[7vw]">
            ¡NOS VEMOS EN LA PRÓXIMA EDICIÓN!
          </h2>
        </div>
      </div>

      <Image
        src="/icons/deco-star-purple.svg"
        alt=""
        aria-hidden
        width={345}
        height={309}
        className="absolute -bottom-[140px] left-10 z-1 h-[250px] w-auto max-tablet:-bottom-[100px] max-tablet:left-[30px] max-tablet:h-[150px] max-mobile:-bottom-[50px] max-mobile:left-0 max-mobile:h-[20vw]"
      />
    </section>
  );
}
