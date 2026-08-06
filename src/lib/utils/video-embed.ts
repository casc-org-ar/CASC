/**
 * Normalize a YouTube/Vimeo URL into an EMBEDDABLE URL for an <iframe>.
 *
 * Admins paste the link they copied from the browser (e.g.
 * youtube.com/watch?v=ID or youtu.be/ID). YouTube refuses to be embedded from
 * those — only the /embed/ID form works, so pasting a normal link shows
 * "www.youtube.com refused to connect". This converts the common forms so the
 * admin never has to know the difference. An already-embed URL, or an
 * unrecognized one, is returned unchanged.
 */
export function toEmbedUrl(url: string): string {
  if (!url) return url;
  const trimmed = url.trim();

  // --- YouTube ---
  // Matches: watch?v=ID, youtu.be/ID, /embed/ID, /shorts/ID, /live/ID
  const yt =
    trimmed.match(
      /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
    );
  if (yt) {
    return `https://www.youtube.com/embed/${yt[1]}`;
  }

  // --- Vimeo ---
  // Matches: vimeo.com/ID  or  player.vimeo.com/video/ID
  const vimeo = trimmed.match(
    /vimeo\.com\/(?:video\/)?(\d+)/,
  );
  if (vimeo) {
    return `https://player.vimeo.com/video/${vimeo[1]}`;
  }

  // Unknown provider or already an embed URL — leave it as-is.
  return trimmed;
}
