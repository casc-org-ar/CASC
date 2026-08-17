import Image from "next/image";
import { SOCIAL_LINKS } from "@/data/shoppings";

/**
 * Teal band with the @shoppingfestarg handle and two decorative shapes.
 *
 * DEPENDENCY REMOVED — the original also rendered a six-post Instagram grid
 * here, via the Smash Balloon "Instagram Feed" WordPress plugin. That plugin
 * held the Instagram access token server-side and refreshed the feed through
 * `wp-admin/admin-ajax.php`; neither exists without WordPress, so the grid is
 * not reproducible in this migration and was left out rather than faked with
 * stale thumbnails (Instagram's CDN URLs are signed and expire within days).
 *
 * See MIGRATION.md → "Instagram feed" for the replacement options.
 */
export function InstagramSection() {
  return (
    <section className="relative flex min-h-[460px] flex-col items-center justify-center bg-teal-dark max-mobile:px-[5vw] max-mobile:py-[10vw]">
      <Image
        src="/icons/deco-flower-teal.svg"
        alt=""
        aria-hidden
        width={115}
        height={172}
        className="absolute -top-10 right-0 h-[9vw] w-auto max-mobile:-top-[30px] max-mobile:h-[20vw]"
      />

      <a
        href={SOCIAL_LINKS.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-center gap-4 text-cream transition-colors hover:text-white"
      >
        <Image
          src="/icons/icon-instagram-outline.svg"
          alt=""
          aria-hidden
          width={56}
          height={56}
          className="size-[50px] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-108 max-mobile:size-[12vw]"
        />
        <span className="font-body text-[1.875vw] max-tablet:text-[4vw] max-mobile:text-[6vw]">
          shoppingfestarg
        </span>
      </a>

      <Image
        src="/icons/deco-leaf-teal.svg"
        alt=""
        aria-hidden
        width={127}
        height={183}
        className="absolute -bottom-[45px] left-0 h-[10vw] w-auto max-mobile:-bottom-[25px] max-mobile:h-[20vw]"
      />
    </section>
  );
}
