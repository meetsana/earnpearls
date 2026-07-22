import type { FastifyInstance } from "fastify";

import { AppError } from "../../lib/errors.js";

export async function getPublicSettings(app: FastifyInstance) {
  const result = await app.db.query<{ key: string; value: unknown }>(
    `SELECT key, value FROM system_settings
     WHERE public = TRUE AND key = ANY($1::TEXT[])`,
    [
      [
        "registration",
        "points_per_usd",
        "features",
        "maintenance",
        "leaderboards",
        "support",
        "content",
      ],
    ],
  );
  const settings = new Map(result.rows.map((row) => [row.key, row.value]));
  const registration = (settings.get("registration") ?? {}) as {
    enabled?: boolean;
  };
  const points = (settings.get("points_per_usd") ?? {}) as { value?: string };
  const maintenance = (settings.get("maintenance") ?? {}) as {
    enabled?: boolean;
    message?: string;
  };
  const features = (settings.get("features") ?? {}) as Record<string, boolean>;
  const leaderboardSettings = (settings.get("leaderboards") ?? {}) as {
    enabled?: boolean;
  };
  const supportSettings = (settings.get("support") ?? {}) as {
    enabled?: boolean;
  };
  const contentSettings = (settings.get("content") ?? {}) as {
    blogEnabled?: boolean;
  };
  const effectiveFeatures: Record<string, boolean> = {
    ...features,
    leaderboards:
      features.leaderboards === true && leaderboardSettings.enabled === true,
    support: features.support === true && supportSettings.enabled === true,
    blog: features.blog === true && contentSettings.blogEnabled === true,
  };
  return {
    brand: {
      name: "EarnPearls" as const,
      tagline: "Your Time. Your Rewards." as const,
      language: "en" as const,
    },
    registrationEnabled: registration.enabled ?? false,
    pointsPerUsd: points.value ?? "1000",
    features: effectiveFeatures,
    maintenance: {
      enabled: maintenance.enabled ?? false,
      message: maintenance.message ?? "EarnPearls is temporarily unavailable.",
    },
  };
}

export async function listPublicCountries(app: FastifyInstance) {
  const result = await app.db.query<{ country_code: string }>(
    `SELECT country_code FROM country_availability
     WHERE status = 'enabled' ORDER BY country_code`,
  );
  const names = new Intl.DisplayNames(["en"], { type: "region" });
  return result.rows.map((row) => ({
    code: row.country_code,
    name: names.of(row.country_code) ?? row.country_code,
  }));
}

export async function getPublishedPage(app: FastifyInstance, slug: string) {
  const result = await app.db.query<{
    slug: string;
    title: string;
    excerpt: string;
    body_markdown: string;
    seo_title: string;
    seo_description: string;
    canonical_path: string;
    published_at: Date | null;
    updated_at: Date;
  }>(
    `SELECT slug, title, excerpt, body_markdown, seo_title,
      seo_description, canonical_path, published_at, updated_at
     FROM cms_pages
     WHERE slug = $1 AND status = 'published'
       AND (published_at IS NULL OR published_at <= NOW())`,
    [slug],
  );
  const row = result.rows[0];
  if (!row) throw new AppError(404, "CONTENT_NOT_FOUND", "Page not found.");
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    bodyMarkdown: row.body_markdown,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    canonicalPath: row.canonical_path,
    publishedAt: row.published_at?.toISOString() ?? null,
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function listBlogPosts(
  app: FastifyInstance,
  options: Readonly<{ category?: string; search?: string; limit: number }>,
) {
  const result = await app.db.query<{
    slug: string;
    title: string;
    excerpt: string;
    category_name: string | null;
    featured_image_url: string | null;
    published_at: Date;
  }>(
    `SELECT p.slug, p.title, p.excerpt, c.name AS category_name,
      p.featured_image_url, p.published_at
     FROM blog_posts p
     LEFT JOIN blog_categories c ON c.id = p.category_id
     WHERE p.status = 'published' AND p.published_at <= NOW()
       AND ($1::TEXT IS NULL OR c.slug = $1)
       AND ($2::TEXT IS NULL OR
         to_tsvector('english', p.title || ' ' || p.excerpt || ' ' || p.body_markdown)
         @@ plainto_tsquery('english', $2))
     ORDER BY p.published_at DESC, p.id DESC LIMIT $3`,
    [options.category ?? null, options.search ?? null, options.limit],
  );
  return result.rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    categoryName: row.category_name,
    featuredImageUrl: row.featured_image_url,
    publishedAt: row.published_at.toISOString(),
  }));
}

export async function getBlogPost(app: FastifyInstance, slug: string) {
  const result = await app.db.query<{
    slug: string;
    title: string;
    excerpt: string;
    body_markdown: string;
    category_name: string | null;
    featured_image_url: string | null;
    seo_title: string;
    seo_description: string;
    canonical_path: string;
    author_name: string | null;
    published_at: Date;
    tags: string[];
  }>(
    `SELECT p.slug, p.title, p.excerpt, p.body_markdown,
      c.name AS category_name, p.featured_image_url, p.seo_title,
      p.seo_description, p.canonical_path, u.display_name AS author_name,
      p.published_at,
      COALESCE(ARRAY_AGG(t.name ORDER BY t.name)
        FILTER (WHERE t.id IS NOT NULL), '{}') AS tags
     FROM blog_posts p
     LEFT JOIN blog_categories c ON c.id = p.category_id
     LEFT JOIN users u ON u.id = p.author_id
     LEFT JOIN blog_post_tags pt ON pt.post_id = p.id
     LEFT JOIN blog_tags t ON t.id = pt.tag_id
     WHERE p.slug = $1 AND p.status = 'published' AND p.published_at <= NOW()
     GROUP BY p.id, c.name, u.display_name`,
    [slug],
  );
  const row = result.rows[0];
  if (!row)
    throw new AppError(404, "CONTENT_NOT_FOUND", "Blog post not found.");
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    bodyMarkdown: row.body_markdown,
    categoryName: row.category_name,
    featuredImageUrl: row.featured_image_url,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    canonicalPath: row.canonical_path,
    authorName: row.author_name,
    publishedAt: row.published_at.toISOString(),
    tags: row.tags,
  };
}

export async function listFaqs(app: FastifyInstance, category?: string) {
  const result = await app.db.query<{
    id: string;
    category: string;
    question: string;
    answer_markdown: string;
  }>(
    `SELECT id, category, question, answer_markdown FROM faqs
     WHERE status = 'published' AND ($1::TEXT IS NULL OR category = $1)
     ORDER BY category, sort_order, created_at`,
    [category ?? null],
  );
  return result.rows.map((row) => ({
    id: row.id,
    category: row.category,
    question: row.question,
    answerMarkdown: row.answer_markdown,
  }));
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function getSitemapXml(app: FastifyInstance): Promise<string> {
  const [result, settings] = await Promise.all([
    app.db.query<{
      path: string;
      updated_at: Date;
      content_type: "page" | "blog";
    }>(
      `SELECT canonical_path AS path, updated_at, 'page' AS content_type
     FROM cms_pages
     WHERE status='published' AND (published_at IS NULL OR published_at<=NOW())
     UNION ALL
     SELECT canonical_path AS path, updated_at, 'blog' AS content_type
     FROM blog_posts
     WHERE status='published' AND published_at<=NOW()
     ORDER BY path`,
    ),
    getPublicSettings(app),
  ]);
  const base = new URL(app.config.publicAppUrl);
  const entries = new Map<string, string | null>();
  for (const path of ["/", "/blog", "/faq", "/register"]) {
    if (path !== "/blog" || settings.features.blog === true) {
      entries.set(new URL(path, base).toString(), null);
    }
  }
  for (const row of result.rows) {
    if (row.content_type === "blog" && settings.features.blog !== true)
      continue;
    entries.set(
      new URL(row.path, base).toString(),
      row.updated_at.toISOString(),
    );
  }
  const urls = [...entries.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([location, lastModified]) => {
      const lastmod = lastModified
        ? `<lastmod>${escapeXml(lastModified)}</lastmod>`
        : "";
      return `  <url><loc>${escapeXml(location)}</loc>${lastmod}</url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
