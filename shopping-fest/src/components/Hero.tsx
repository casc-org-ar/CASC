import Image from "next/image";

/**
 * Full-width hero banner.
 *
 * In the original this was an Elementor image-carousel widget (Swiper) holding
 * exactly one slide. With a single slide there is nothing to swipe, so the
 * carousel — and Swiper along with it — was dropped in favour of the image.
 *
 * `priority` because this is the page's LCP element.
 */
export function Hero() {
  return (
    <div className="w-full">
      <Image
        src="/images/BGSHOPPING.webp"
        alt="Shopping Fest"
        width={1920}
        height={891}
        priority
        sizes="100vw"
        className="h-auto w-full"
      />
    </div>
  );
}
