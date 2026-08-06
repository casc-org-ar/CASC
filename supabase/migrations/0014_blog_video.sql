-- Migration 0014 — Optional video on blog posts
--
-- Articles (blog + noticias, unified) can now carry an embedded YouTube/Vimeo
-- video besides the cover image and gallery, shown in the article detail. The
-- column is nullable: an article without a video simply has none.

alter table blog_posts
  add column video_url text;
