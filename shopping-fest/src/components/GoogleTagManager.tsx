import Script from "next/script";

/**
 * Google Tag Manager container, carried over from the WordPress site unchanged.
 *
 * Uses next/script rather than @next/third-parties/google, which is still
 * flagged experimental. `afterInteractive` matches GTM's own async snippet.
 *
 * NOTE: whatever tags live inside this container (Analytics, Meta Pixel, …) are
 * configured in the GTM console, not here. They are not visible in the site's
 * source and were not part of the migration.
 */
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export function GoogleTagManager() {
  if (!GTM_ID) return null;

  return (
    <>
      <Script id="gtm-init" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  );
}
