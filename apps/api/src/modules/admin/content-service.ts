import { randomUUID } from "node:crypto";

import type {
  AdminBlogPostWriteBodySchema,
  AdminCmsPageWriteBodySchema,
  AdminFaqWriteBodySchema,
} from "@earnpearls/contracts";
import type { Static } from "@sinclair/typebox";
import type { FastifyInstance, FastifyRequest } from "fastify";
import type { PoolClient } from "pg";

import { writeAudit } from "../../lib/audit.js";
import { hashIp } from "../../lib/crypto.js";
import { AppError } from "../../lib/errors.js";

type PageWrite = Static<typeof AdminCmsPageWriteBodySchema>;
type PostWrite = Static<typeof AdminBlogPostWriteBodySchema>;
type FaqWrite = Static<typeof AdminFaqWriteBodySchema>;

type PageRow = Readonly<{
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body_markdown: string;
  status: PageWrite["status"];
  seo_title: string;
  seo_description: string;
  canonical_path: string;
  published_at: Date | null;
  scheduled_for: Date | null;
  updated_at: Date;
}>;

function assertSchedule(
  status: "draft" | "scheduled" | "published" | "archived",
  scheduledFor: string | null | undefined,
): Date | null {
  if (status !== "scheduled") return null;
  if (!scheduledFor)
    throw new AppError(
      400,
      "CONTENT_SCHEDULE_REQUIRED",
      "Scheduled content requires a publication time.",
    );
  const date = new Date(scheduledFor);
  if (date.getTime() <= Date.now())
    throw new AppError(
      400,
      "CONTENT_SCHEDULE_INVALID",
      "Scheduled publication time must be in the future.",
    );
  return date;
}

function projectPage(row: PageRow) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    bodyMarkdown: row.body_markdown,
    status: row.status,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    canonicalPath: row.canonical_path,
    publishedAt: row.published_at?.toISOString() ?? null,
    scheduledFor: row.scheduled_for?.toISOString() ?? null,
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function listAdminPages(app: FastifyInstance) {
  const result = await app.db.query<PageRow>(
    `SELECT id, slug, title, excerpt, body_markdown, status, seo_title,
      seo_description, canonical_path, published_at, scheduled_for, updated_at
     FROM cms_pages ORDER BY updated_at DESC, id DESC`,
  );
  return result.rows.map(projectPage);
}

async function writePageRevision(
  client: PoolClient,
  pageId: string,
  actorId: string,
  body: PageWrite,
): Promise<void> {
  await client.query(
    `INSERT INTO cms_page_revisions (
      id, page_id, version_number, title, excerpt, body_markdown,
      status, seo_title, seo_description, actor_id, change_reason
     ) SELECT $1, $2, COALESCE(MAX(version_number), 0) + 1,
      $3, $4, $5, $6, $7, $8, $9, $10
     FROM cms_page_revisions WHERE page_id = $2`,
    [
      randomUUID(),
      pageId,
      body.title.trim(),
      body.excerpt.trim(),
      body.bodyMarkdown,
      body.status,
      body.seoTitle.trim(),
      body.seoDescription.trim(),
      actorId,
      body.reason,
    ],
  );
}

export async function createPage(
  app: FastifyInstance,
  request: FastifyRequest,
  body: PageWrite,
) {
  const actorId = request.auth!.user.id;
  const scheduledFor = assertSchedule(body.status, body.scheduledFor);
  const pageId = randomUUID();
  const row = await app.db.transaction(async (client) => {
    const result = await client.query<PageRow>(
      `INSERT INTO cms_pages (
        id, slug, title, excerpt, body_markdown, status, seo_title,
        seo_description, canonical_path, published_at, scheduled_for, author_id
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,
        CASE WHEN $6 = 'published' THEN NOW() ELSE NULL END,$10,$11)
       RETURNING id, slug, title, excerpt, body_markdown, status, seo_title,
        seo_description, canonical_path, published_at, scheduled_for, updated_at`,
      [
        pageId,
        body.slug,
        body.title.trim(),
        body.excerpt.trim(),
        body.bodyMarkdown,
        body.status,
        body.seoTitle.trim(),
        body.seoDescription.trim(),
        body.canonicalPath,
        scheduledFor,
        actorId,
      ],
    );
    await writePageRevision(client, pageId, actorId, body);
    await writeAudit(client, {
      actorType: "admin",
      actorId,
      action: "admin.content.page_created",
      targetType: "cms_page",
      targetId: pageId,
      reason: body.reason,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
      metadata: { slug: body.slug, status: body.status },
    });
    return result.rows[0]!;
  });
  return projectPage(row);
}

export async function updatePage(
  app: FastifyInstance,
  request: FastifyRequest,
  pageId: string,
  body: PageWrite,
) {
  const actorId = request.auth!.user.id;
  const scheduledFor = assertSchedule(body.status, body.scheduledFor);
  const row = await app.db.transaction(async (client) => {
    const current = await client.query<{ published_at: Date | null }>(
      "SELECT published_at FROM cms_pages WHERE id = $1 FOR UPDATE",
      [pageId],
    );
    if (!current.rows[0])
      throw new AppError(404, "CONTENT_NOT_FOUND", "Page not found.");
    const result = await client.query<PageRow>(
      `UPDATE cms_pages SET slug = $2, title = $3, excerpt = $4,
        body_markdown = $5, status = $6, seo_title = $7,
        seo_description = $8, canonical_path = $9,
        published_at = CASE
          WHEN $6 = 'published' THEN COALESCE(published_at, NOW())
          ELSE published_at END,
        scheduled_for = $10, author_id = $11
       WHERE id = $1
       RETURNING id, slug, title, excerpt, body_markdown, status, seo_title,
        seo_description, canonical_path, published_at, scheduled_for, updated_at`,
      [
        pageId,
        body.slug,
        body.title.trim(),
        body.excerpt.trim(),
        body.bodyMarkdown,
        body.status,
        body.seoTitle.trim(),
        body.seoDescription.trim(),
        body.canonicalPath,
        scheduledFor,
        actorId,
      ],
    );
    await writePageRevision(client, pageId, actorId, body);
    await writeAudit(client, {
      actorType: "admin",
      actorId,
      action: "admin.content.page_updated",
      targetType: "cms_page",
      targetId: pageId,
      reason: body.reason,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
      metadata: { slug: body.slug, status: body.status },
    });
    return result.rows[0]!;
  });
  return projectPage(row);
}

type PostRow = Readonly<{
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body_markdown: string;
  category_id: string | null;
  category_name: string | null;
  status: PostWrite["status"];
  featured_image_url: string | null;
  seo_title: string;
  seo_description: string;
  canonical_path: string;
  published_at: Date | null;
  scheduled_for: Date | null;
  updated_at: Date;
  tags: string[];
}>;

function projectPost(row: PostRow) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    bodyMarkdown: row.body_markdown,
    categoryId: row.category_id,
    categoryName: row.category_name,
    status: row.status,
    featuredImageUrl: row.featured_image_url,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    canonicalPath: row.canonical_path,
    tags: row.tags,
    publishedAt: row.published_at?.toISOString() ?? null,
    scheduledFor: row.scheduled_for?.toISOString() ?? null,
    updatedAt: row.updated_at.toISOString(),
  };
}

const postSelect = `SELECT p.id, p.slug, p.title, p.excerpt, p.body_markdown,
  p.category_id, c.name AS category_name, p.status, p.featured_image_url,
  p.seo_title, p.seo_description, p.canonical_path, p.published_at,
  p.scheduled_for, p.updated_at,
  COALESCE(ARRAY_AGG(t.name ORDER BY t.name)
    FILTER (WHERE t.id IS NOT NULL), '{}') AS tags
 FROM blog_posts p
 LEFT JOIN blog_categories c ON c.id = p.category_id
 LEFT JOIN blog_post_tags pt ON pt.post_id = p.id
 LEFT JOIN blog_tags t ON t.id = pt.tag_id`;

export async function listAdminPosts(app: FastifyInstance) {
  const result = await app.db.query<PostRow>(
    `${postSelect} GROUP BY p.id, c.name ORDER BY p.updated_at DESC, p.id DESC`,
  );
  return result.rows.map(projectPost);
}

export async function listBlogCategories(app: FastifyInstance) {
  const result = await app.db.query<{
    id: string;
    slug: string;
    name: string;
    description: string;
    active: boolean;
  }>(
    `SELECT id, slug, name, description, active
     FROM blog_categories ORDER BY name`,
  );
  return result.rows;
}

export async function upsertBlogCategory(
  app: FastifyInstance,
  request: FastifyRequest,
  input: Readonly<{
    id?: string;
    slug: string;
    name: string;
    description: string;
    active: boolean;
    reason: string;
  }>,
) {
  const actorId = request.auth!.user.id;
  const id = input.id ?? randomUUID();
  const row = await app.db.transaction(async (client) => {
    const result = await client.query<{
      id: string;
      slug: string;
      name: string;
      description: string;
      active: boolean;
    }>(
      `INSERT INTO blog_categories (id, slug, name, description, active)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug,
        name = EXCLUDED.name, description = EXCLUDED.description,
        active = EXCLUDED.active
       RETURNING id, slug, name, description, active`,
      [
        id,
        input.slug,
        input.name.trim(),
        input.description.trim(),
        input.active,
      ],
    );
    await writeAudit(client, {
      actorType: "admin",
      actorId,
      action: input.id
        ? "admin.content.blog_category_updated"
        : "admin.content.blog_category_created",
      targetType: "blog_category",
      targetId: id,
      reason: input.reason,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
    });
    return result.rows[0]!;
  });
  return row;
}

function tagSlug(name: string): string {
  const slug = name
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  if (!slug)
    throw new AppError(
      400,
      "BLOG_TAG_INVALID",
      "Each blog tag needs a readable name.",
    );
  return slug;
}

async function replacePostTags(
  client: PoolClient,
  postId: string,
  tags: string[],
): Promise<void> {
  await client.query("DELETE FROM blog_post_tags WHERE post_id = $1", [postId]);
  for (const rawName of [...new Set(tags.map((tag) => tag.trim()))]) {
    const slug = tagSlug(rawName);
    const tag = await client.query<{ id: string }>(
      `INSERT INTO blog_tags (id, slug, name) VALUES ($1,$2,$3)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name RETURNING id`,
      [randomUUID(), slug, rawName],
    );
    await client.query(
      `INSERT INTO blog_post_tags (post_id, tag_id) VALUES ($1,$2)
       ON CONFLICT DO NOTHING`,
      [postId, tag.rows[0]!.id],
    );
  }
}

async function writePostRevision(
  client: PoolClient,
  postId: string,
  actorId: string,
  body: PostWrite,
): Promise<void> {
  await client.query(
    `INSERT INTO blog_post_revisions (
      id, post_id, version_number, title, excerpt, body_markdown,
      status, seo_title, seo_description, actor_id, change_reason
     ) SELECT $1, $2, COALESCE(MAX(version_number), 0) + 1,
      $3, $4, $5, $6, $7, $8, $9, $10
     FROM blog_post_revisions WHERE post_id = $2`,
    [
      randomUUID(),
      postId,
      body.title.trim(),
      body.excerpt.trim(),
      body.bodyMarkdown,
      body.status,
      body.seoTitle.trim(),
      body.seoDescription.trim(),
      actorId,
      body.reason,
    ],
  );
}

async function readPost(client: PoolClient, postId: string): Promise<PostRow> {
  const result = await client.query<PostRow>(
    `${postSelect} WHERE p.id = $1 GROUP BY p.id, c.name`,
    [postId],
  );
  return result.rows[0]!;
}

export async function createPost(
  app: FastifyInstance,
  request: FastifyRequest,
  body: PostWrite,
) {
  const actorId = request.auth!.user.id;
  const scheduledFor = assertSchedule(body.status, body.scheduledFor);
  const postId = randomUUID();
  const row = await app.db.transaction(async (client) => {
    await client.query(
      `INSERT INTO blog_posts (
        id, slug, title, excerpt, body_markdown, category_id, status,
        featured_image_url, seo_title, seo_description, canonical_path,
        author_id, scheduled_for, published_at
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,
        CASE WHEN $7 = 'published' THEN NOW() ELSE NULL END)`,
      [
        postId,
        body.slug,
        body.title.trim(),
        body.excerpt.trim(),
        body.bodyMarkdown,
        body.categoryId ?? null,
        body.status,
        body.featuredImageUrl ?? null,
        body.seoTitle.trim(),
        body.seoDescription.trim(),
        body.canonicalPath,
        actorId,
        scheduledFor,
      ],
    );
    await replacePostTags(client, postId, body.tags);
    await writePostRevision(client, postId, actorId, body);
    await writeAudit(client, {
      actorType: "admin",
      actorId,
      action: "admin.content.blog_post_created",
      targetType: "blog_post",
      targetId: postId,
      reason: body.reason,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
      metadata: { slug: body.slug, status: body.status },
    });
    return readPost(client, postId);
  });
  return projectPost(row);
}

export async function updatePost(
  app: FastifyInstance,
  request: FastifyRequest,
  postId: string,
  body: PostWrite,
) {
  const actorId = request.auth!.user.id;
  const scheduledFor = assertSchedule(body.status, body.scheduledFor);
  const row = await app.db.transaction(async (client) => {
    const result = await client.query(
      `UPDATE blog_posts SET slug=$2, title=$3, excerpt=$4,
        body_markdown=$5, category_id=$6, status=$7, featured_image_url=$8,
        seo_title=$9, seo_description=$10, canonical_path=$11,
        author_id=$12, scheduled_for=$13,
        published_at=CASE WHEN $7='published' THEN COALESCE(published_at,NOW())
          ELSE published_at END
       WHERE id=$1`,
      [
        postId,
        body.slug,
        body.title.trim(),
        body.excerpt.trim(),
        body.bodyMarkdown,
        body.categoryId ?? null,
        body.status,
        body.featuredImageUrl ?? null,
        body.seoTitle.trim(),
        body.seoDescription.trim(),
        body.canonicalPath,
        actorId,
        scheduledFor,
      ],
    );
    if (!result.rowCount)
      throw new AppError(404, "CONTENT_NOT_FOUND", "Blog post not found.");
    await replacePostTags(client, postId, body.tags);
    await writePostRevision(client, postId, actorId, body);
    await writeAudit(client, {
      actorType: "admin",
      actorId,
      action: "admin.content.blog_post_updated",
      targetType: "blog_post",
      targetId: postId,
      reason: body.reason,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
      metadata: { slug: body.slug, status: body.status },
    });
    return readPost(client, postId);
  });
  return projectPost(row);
}

type FaqRow = Readonly<{
  id: string;
  category: string;
  question: string;
  answer_markdown: string;
  status: FaqWrite["status"];
  sort_order: number;
  published_at: Date | null;
  updated_at: Date;
}>;

function projectFaq(row: FaqRow) {
  return {
    id: row.id,
    category: row.category,
    question: row.question,
    answerMarkdown: row.answer_markdown,
    status: row.status,
    sortOrder: row.sort_order,
    publishedAt: row.published_at?.toISOString() ?? null,
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function listAdminFaqs(app: FastifyInstance) {
  const result = await app.db.query<FaqRow>(
    `SELECT id, category, question, answer_markdown, status, sort_order,
      published_at, updated_at FROM faqs ORDER BY category, sort_order, created_at`,
  );
  return result.rows.map(projectFaq);
}

async function writeFaqRevision(
  client: PoolClient,
  faqId: string,
  actorId: string,
  body: FaqWrite,
): Promise<void> {
  await client.query(
    `INSERT INTO faq_revisions (
      id, faq_id, version_number, category, question, answer_markdown,
      status, sort_order, actor_id, change_reason
     ) SELECT $1,$2,COALESCE(MAX(version_number),0)+1,
      $3,$4,$5,$6,$7,$8,$9 FROM faq_revisions WHERE faq_id=$2`,
    [
      randomUUID(),
      faqId,
      body.category.trim(),
      body.question.trim(),
      body.answerMarkdown,
      body.status,
      body.sortOrder,
      actorId,
      body.reason,
    ],
  );
}

export async function upsertFaq(
  app: FastifyInstance,
  request: FastifyRequest,
  faqId: string | undefined,
  body: FaqWrite,
) {
  const actorId = request.auth!.user.id;
  const id = faqId ?? randomUUID();
  const row = await app.db.transaction(async (client) => {
    const result = await client.query<FaqRow>(
      `INSERT INTO faqs (
        id, category, question, answer_markdown, status, sort_order,
        author_id, published_at
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,
        CASE WHEN $5='published' THEN NOW() ELSE NULL END)
       ON CONFLICT (id) DO UPDATE SET
        category=EXCLUDED.category, question=EXCLUDED.question,
        answer_markdown=EXCLUDED.answer_markdown, status=EXCLUDED.status,
        sort_order=EXCLUDED.sort_order, author_id=EXCLUDED.author_id,
        published_at=CASE WHEN EXCLUDED.status='published'
          THEN COALESCE(faqs.published_at,NOW()) ELSE faqs.published_at END
       RETURNING id, category, question, answer_markdown, status, sort_order,
        published_at, updated_at`,
      [
        id,
        body.category.trim(),
        body.question.trim(),
        body.answerMarkdown,
        body.status,
        body.sortOrder,
        actorId,
      ],
    );
    await writeFaqRevision(client, id, actorId, body);
    await writeAudit(client, {
      actorType: "admin",
      actorId,
      action: faqId ? "admin.content.faq_updated" : "admin.content.faq_created",
      targetType: "faq",
      targetId: id,
      reason: body.reason,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
      metadata: { status: body.status },
    });
    return result.rows[0]!;
  });
  return projectFaq(row);
}
