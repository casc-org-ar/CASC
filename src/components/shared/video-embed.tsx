import { toEmbedUrl } from "@/lib/utils/video-embed";

/**
 * Embedded video player for article details. Accepts any YouTube/Vimeo link
 * (normalized to its embeddable form) and renders a responsive 16:9 iframe.
 * Renders nothing when there is no video.
 */
export function VideoEmbed({ url, title }: { url?: string; title: string }) {
  if (!url) return null;
  return (
    <div className="mt-8 aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black">
      <iframe
        src={toEmbedUrl(url)}
        title={title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
