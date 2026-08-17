import { REGIONS } from "@/data/shoppings";
import { ShoppingCarousel } from "./ShoppingCarousel";

/**
 * "Shoppings adheridos" — the intro line followed by one carousel per region.
 *
 * Region headings are `h2` with a 75px top margin on desktop and 50px on
 * mobile, exactly as the original had them.
 */
export function Shoppings() {
  return (
    <section className="boxed flex flex-col justify-center px-0 pt-[100px] pb-[150px] max-tablet:px-[5vw] max-tablet:py-[10vw]">
      <span className="mx-auto w-[85%] max-w-[85%] self-center text-center font-body text-[2vw] leading-[36px] font-normal text-teal max-tablet:text-[3vw] max-mobile:mt-[50px] max-mobile:w-full max-mobile:max-w-full max-mobile:text-start max-mobile:text-[5.5vw] max-mobile:leading-[1.2em]">
        DESCUBRÍ LOS SHOPPINGS ADHERIDOS Y EN LOS DÍAS PREVIOS AL EVENTO{" "}
        <span className="font-bold text-orange">
          CONOCÉ SUS ACTIVIDADES Y DESCUENTOS
        </span>{" "}
        <b>HACIENDO CLICK SOBRE SUS LOGOS</b>
      </span>

      {REGIONS.map((region) => (
        <div key={region.id}>
          <h2 className="scroll-bottom mt-[75px] text-center font-body text-[3vw] font-bold text-orange max-tablet:text-[7vw] max-mobile:mt-[50px] max-mobile:text-[9vw]">
            {region.title}
          </h2>
          <ShoppingCarousel region={region} />
        </div>
      ))}
    </section>
  );
}
