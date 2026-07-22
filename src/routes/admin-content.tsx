import { useState, type FormEvent } from "react";

import { api } from "../api/endpoints";
import type {
  AdminBlogCategory,
  AdminBlogPost,
  AdminCmsPage,
  AdminFaq,
} from "../api/types";
import {
  ErrorNotice,
  InlineSuccess,
  LoadingState,
} from "../components/AsyncStates";
import { MarkdownContent } from "../components/MarkdownContent";
import { useApiResource } from "../hooks/useApiResource";
import { useAsyncAction } from "../hooks/useAsyncAction";
import { PageHeader } from "./ScreenSkeleton";

type ContentStatus = "draft" | "scheduled" | "published" | "archived";

function toDateTimeLocal(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function toIsoOrNull(value: string): string | null {
  return value ? new Date(value).toISOString() : null;
}

function PageEditor({
  page,
  onSaved,
}: {
  page?: AdminCmsPage | undefined;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    slug: page?.slug ?? "",
    title: page?.title ?? "",
    excerpt: page?.excerpt ?? "",
    bodyMarkdown: page?.bodyMarkdown ?? "",
    status: (page?.status ?? "draft") as ContentStatus,
    seoTitle: page?.seoTitle ?? "",
    seoDescription: page?.seoDescription ?? "",
    canonicalPath: page?.canonicalPath ?? "",
    scheduledFor: toDateTimeLocal(page?.scheduledFor ?? null),
    reason: "",
  });
  const action = useAsyncAction<AdminCmsPage>();
  async function submit(event: FormEvent) {
    event.preventDefault();
    const body = {
      ...form,
      scheduledFor: toIsoOrNull(form.scheduledFor),
    };
    const result = await action.run(() =>
      page
        ? api.admin.updateContentPage(page.id, body)
        : api.admin.createContentPage(body),
    );
    if (result !== null) onSaved();
  }
  return (
    <form
      className="card form-stack content-editor"
      onSubmit={(event) => void submit(event)}
    >
      <h2>{page ? `Edit ${page.title}` : "Create page"}</h2>
      {action.state.status === "error" ? (
        <ErrorNotice error={action.state.error} />
      ) : null}
      {action.state.status === "success" ? (
        <InlineSuccess>Page and revision saved.</InlineSuccess>
      ) : null}
      <div className="content-grid content-grid--two">
        <label>
          Slug
          <input
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            maxLength={120}
            value={form.slug}
            onChange={(event) => setForm({ ...form, slug: event.target.value })}
          />
        </label>
        <label>
          Title
          <input
            required
            minLength={1}
            maxLength={200}
            value={form.title}
            onChange={(event) =>
              setForm({ ...form, title: event.target.value })
            }
          />
        </label>
      </div>
      <label>
        Excerpt
        <textarea
          required
          maxLength={500}
          rows={3}
          value={form.excerpt}
          onChange={(event) =>
            setForm({ ...form, excerpt: event.target.value })
          }
        />
      </label>
      <label>
        Markdown body
        <textarea
          className="code-input"
          required
          minLength={1}
          maxLength={100_000}
          rows={14}
          value={form.bodyMarkdown}
          onChange={(event) =>
            setForm({ ...form, bodyMarkdown: event.target.value })
          }
        />
      </label>
      <details className="content-preview">
        <summary>Preview</summary>
        <MarkdownContent markdown={form.bodyMarkdown} />
      </details>
      <div className="content-grid content-grid--two">
        <label>
          Status
          <select
            value={form.status}
            onChange={(event) =>
              setForm({ ...form, status: event.target.value as ContentStatus })
            }
          >
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <label>
          Schedule time
          <input
            type="datetime-local"
            disabled={form.status !== "scheduled"}
            required={form.status === "scheduled"}
            value={form.scheduledFor}
            onChange={(event) =>
              setForm({ ...form, scheduledFor: event.target.value })
            }
          />
        </label>
      </div>
      <label>
        Canonical path
        <input
          required
          pattern="/.*"
          maxLength={500}
          placeholder="/about"
          value={form.canonicalPath}
          onChange={(event) =>
            setForm({ ...form, canonicalPath: event.target.value })
          }
        />
      </label>
      <label>
        SEO title
        <input
          required
          maxLength={200}
          value={form.seoTitle}
          onChange={(event) =>
            setForm({ ...form, seoTitle: event.target.value })
          }
        />
      </label>
      <label>
        SEO description
        <textarea
          required
          maxLength={500}
          rows={3}
          value={form.seoDescription}
          onChange={(event) =>
            setForm({ ...form, seoDescription: event.target.value })
          }
        />
      </label>
      <label>
        Change reason
        <input
          required
          minLength={3}
          maxLength={1000}
          value={form.reason}
          onChange={(event) => setForm({ ...form, reason: event.target.value })}
        />
      </label>
      <button
        className="button button--primary"
        disabled={action.state.status === "submitting"}
      >
        Save page
      </button>
    </form>
  );
}

function BlogCategoryEditor({
  category,
  onSaved,
}: {
  category?: AdminBlogCategory | undefined;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    slug: category?.slug ?? "",
    name: category?.name ?? "",
    description: category?.description ?? "",
    active: category?.active ?? true,
    reason: "",
  });
  const action = useAsyncAction<AdminBlogCategory>();
  async function submit(event: FormEvent) {
    event.preventDefault();
    const result = await action.run(() =>
      category
        ? api.admin.updateBlogCategory(category.id, form)
        : api.admin.createBlogCategory(form),
    );
    if (result !== null) onSaved();
  }
  return (
    <form className="card form-stack" onSubmit={(event) => void submit(event)}>
      <h2>{category ? `Edit ${category.name}` : "Create blog category"}</h2>
      {action.state.status === "error" ? (
        <ErrorNotice error={action.state.error} />
      ) : null}
      {action.state.status === "success" ? (
        <InlineSuccess>Category saved.</InlineSuccess>
      ) : null}
      <label>
        Slug
        <input
          required
          pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
          maxLength={120}
          value={form.slug}
          onChange={(event) => setForm({ ...form, slug: event.target.value })}
        />
      </label>
      <label>
        Name
        <input
          required
          maxLength={120}
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
        />
      </label>
      <label>
        Description
        <textarea
          maxLength={500}
          rows={3}
          value={form.description}
          onChange={(event) =>
            setForm({ ...form, description: event.target.value })
          }
        />
      </label>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(event) =>
            setForm({ ...form, active: event.target.checked })
          }
        />
        Active category
      </label>
      <label>
        Change reason
        <input
          required
          minLength={3}
          maxLength={1000}
          value={form.reason}
          onChange={(event) => setForm({ ...form, reason: event.target.value })}
        />
      </label>
      <button className="button button--primary">Save category</button>
    </form>
  );
}

function BlogPostEditor({
  post,
  categories,
  onSaved,
}: {
  post?: AdminBlogPost | undefined;
  categories: AdminBlogCategory[];
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    slug: post?.slug ?? "",
    title: post?.title ?? "",
    excerpt: post?.excerpt ?? "",
    bodyMarkdown: post?.bodyMarkdown ?? "",
    categoryId: post?.categoryId ?? "",
    status: (post?.status ?? "draft") as ContentStatus,
    featuredImageUrl: post?.featuredImageUrl ?? "",
    seoTitle: post?.seoTitle ?? "",
    seoDescription: post?.seoDescription ?? "",
    canonicalPath: post?.canonicalPath ?? "",
    tags: post?.tags.join(", ") ?? "",
    scheduledFor: toDateTimeLocal(post?.scheduledFor ?? null),
    reason: "",
  });
  const action = useAsyncAction<AdminBlogPost>();
  async function submit(event: FormEvent) {
    event.preventDefault();
    const body = {
      slug: form.slug,
      title: form.title,
      excerpt: form.excerpt,
      bodyMarkdown: form.bodyMarkdown,
      categoryId: form.categoryId || null,
      status: form.status,
      featuredImageUrl: form.featuredImageUrl || null,
      seoTitle: form.seoTitle,
      seoDescription: form.seoDescription,
      canonicalPath: form.canonicalPath,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      scheduledFor: toIsoOrNull(form.scheduledFor),
      reason: form.reason,
    };
    const result = await action.run(() =>
      post
        ? api.admin.updateBlogPost(post.id, body)
        : api.admin.createBlogPost(body),
    );
    if (result !== null) onSaved();
  }
  return (
    <form
      className="card form-stack content-editor"
      onSubmit={(event) => void submit(event)}
    >
      <h2>{post ? `Edit ${post.title}` : "Create blog post"}</h2>
      {action.state.status === "error" ? (
        <ErrorNotice error={action.state.error} />
      ) : null}
      {action.state.status === "success" ? (
        <InlineSuccess>Post and revision saved.</InlineSuccess>
      ) : null}
      <div className="content-grid content-grid--two">
        <label>
          Slug
          <input
            required
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            maxLength={160}
            value={form.slug}
            onChange={(event) => setForm({ ...form, slug: event.target.value })}
          />
        </label>
        <label>
          Category
          <select
            value={form.categoryId}
            onChange={(event) =>
              setForm({ ...form, categoryId: event.target.value })
            }
          >
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Title
        <input
          required
          minLength={3}
          maxLength={250}
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
        />
      </label>
      <label>
        Excerpt
        <textarea
          required
          minLength={3}
          maxLength={1000}
          rows={3}
          value={form.excerpt}
          onChange={(event) =>
            setForm({ ...form, excerpt: event.target.value })
          }
        />
      </label>
      <label>
        Markdown body
        <textarea
          className="code-input"
          required
          minLength={3}
          maxLength={200_000}
          rows={16}
          value={form.bodyMarkdown}
          onChange={(event) =>
            setForm({ ...form, bodyMarkdown: event.target.value })
          }
        />
      </label>
      <details className="content-preview">
        <summary>Preview</summary>
        <MarkdownContent markdown={form.bodyMarkdown} />
      </details>
      <div className="content-grid content-grid--two">
        <label>
          Status
          <select
            value={form.status}
            onChange={(event) =>
              setForm({ ...form, status: event.target.value as ContentStatus })
            }
          >
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <label>
          Schedule time
          <input
            type="datetime-local"
            disabled={form.status !== "scheduled"}
            required={form.status === "scheduled"}
            value={form.scheduledFor}
            onChange={(event) =>
              setForm({ ...form, scheduledFor: event.target.value })
            }
          />
        </label>
      </div>
      <label>
        Tags (comma separated)
        <input
          maxLength={1000}
          value={form.tags}
          onChange={(event) => setForm({ ...form, tags: event.target.value })}
        />
      </label>
      <label>
        Featured image URL (optional)
        <input
          type="url"
          maxLength={2000}
          value={form.featuredImageUrl}
          onChange={(event) =>
            setForm({ ...form, featuredImageUrl: event.target.value })
          }
        />
      </label>
      <label>
        Canonical path
        <input
          required
          pattern="/.*"
          maxLength={500}
          placeholder="/blog/article"
          value={form.canonicalPath}
          onChange={(event) =>
            setForm({ ...form, canonicalPath: event.target.value })
          }
        />
      </label>
      <label>
        SEO title
        <input
          required
          maxLength={250}
          value={form.seoTitle}
          onChange={(event) =>
            setForm({ ...form, seoTitle: event.target.value })
          }
        />
      </label>
      <label>
        SEO description
        <textarea
          required
          maxLength={500}
          rows={3}
          value={form.seoDescription}
          onChange={(event) =>
            setForm({ ...form, seoDescription: event.target.value })
          }
        />
      </label>
      <label>
        Change reason
        <input
          required
          minLength={3}
          maxLength={1000}
          value={form.reason}
          onChange={(event) => setForm({ ...form, reason: event.target.value })}
        />
      </label>
      <button className="button button--primary">Save blog post</button>
    </form>
  );
}

function FaqEditor({
  faq,
  onSaved,
}: {
  faq?: AdminFaq | undefined;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    category: faq?.category ?? "general",
    question: faq?.question ?? "",
    answerMarkdown: faq?.answerMarkdown ?? "",
    status: (faq?.status ?? "draft") as AdminFaq["status"],
    sortOrder: faq?.sortOrder ?? 0,
    reason: "",
  });
  const action = useAsyncAction<AdminFaq>();
  async function submit(event: FormEvent) {
    event.preventDefault();
    const result = await action.run(() =>
      faq ? api.admin.updateFaq(faq.id, form) : api.admin.createFaq(form),
    );
    if (result !== null) onSaved();
  }
  return (
    <form className="card form-stack" onSubmit={(event) => void submit(event)}>
      <h2>{faq ? "Edit FAQ" : "Create FAQ"}</h2>
      {action.state.status === "error" ? (
        <ErrorNotice error={action.state.error} />
      ) : null}
      {action.state.status === "success" ? (
        <InlineSuccess>FAQ and revision saved.</InlineSuccess>
      ) : null}
      <label>
        Category
        <input
          required
          maxLength={120}
          value={form.category}
          onChange={(event) =>
            setForm({ ...form, category: event.target.value })
          }
        />
      </label>
      <label>
        Question
        <textarea
          required
          minLength={3}
          maxLength={500}
          rows={3}
          value={form.question}
          onChange={(event) =>
            setForm({ ...form, question: event.target.value })
          }
        />
      </label>
      <label>
        Answer (Markdown)
        <textarea
          className="code-input"
          required
          minLength={3}
          maxLength={20_000}
          rows={8}
          value={form.answerMarkdown}
          onChange={(event) =>
            setForm({ ...form, answerMarkdown: event.target.value })
          }
        />
      </label>
      <details className="content-preview">
        <summary>Preview</summary>
        <MarkdownContent markdown={form.answerMarkdown} />
      </details>
      <div className="content-grid content-grid--two">
        <label>
          Status
          <select
            value={form.status}
            onChange={(event) =>
              setForm({
                ...form,
                status: event.target.value as AdminFaq["status"],
              })
            }
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <label>
          Sort order
          <input
            type="number"
            min={-10_000}
            max={10_000}
            value={form.sortOrder}
            onChange={(event) =>
              setForm({ ...form, sortOrder: Number(event.target.value) })
            }
          />
        </label>
      </div>
      <label>
        Change reason
        <input
          required
          minLength={3}
          maxLength={1000}
          value={form.reason}
          onChange={(event) => setForm({ ...form, reason: event.target.value })}
        />
      </label>
      <button className="button button--primary">Save FAQ</button>
    </form>
  );
}

export function AdminContent() {
  const resource = useApiResource(async () => {
    const [pages, categories, posts, faqs] = await Promise.all([
      api.admin.contentPages(),
      api.admin.blogCategories(),
      api.admin.blogPosts(),
      api.admin.faqs(),
    ]);
    return { pages, categories, posts, faqs };
  });
  const [pageId, setPageId] = useState("new");
  const [categoryId, setCategoryId] = useState("new");
  const [postId, setPostId] = useState("new");
  const [faqId, setFaqId] = useState("new");

  return (
    <section>
      <PageHeader
        title="Content studio"
        description="Publish versioned pages, blog education, and FAQs with scheduling and SEO metadata."
      />
      <div className="alert alert--warning">
        <strong>Legal review remains external.</strong>
        <p>
          Drafting tools do not authorize publishing final privacy, terms, or
          cookie policies without owner-approved legal text.
        </p>
      </div>
      {resource.state.status === "loading" ? (
        <LoadingState label="Loading content studio" />
      ) : null}
      {resource.state.status === "error" ? (
        <ErrorNotice error={resource.state.error} onRetry={resource.reload} />
      ) : null}
      {resource.state.status === "success" ? (
        <div className="content-studio">
          <section className="content-studio-section">
            <header>
              <div>
                <p className="eyebrow">CMS</p>
                <h2>Public pages</h2>
              </div>
              <label>
                Edit
                <select
                  value={pageId}
                  onChange={(event) => setPageId(event.target.value)}
                >
                  <option value="new">Create new page</option>
                  {resource.state.data.pages.map((page) => (
                    <option key={page.id} value={page.id}>
                      {page.title} · {page.status}
                    </option>
                  ))}
                </select>
              </label>
            </header>
            <PageEditor
              key={pageId}
              page={resource.state.data.pages.find(
                (page) => page.id === pageId,
              )}
              onSaved={resource.reload}
            />
          </section>
          <section className="content-studio-section">
            <header>
              <div>
                <p className="eyebrow">Taxonomy</p>
                <h2>Blog categories</h2>
              </div>
              <label>
                Edit
                <select
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                >
                  <option value="new">Create new category</option>
                  {resource.state.data.categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
            </header>
            <BlogCategoryEditor
              key={categoryId}
              category={resource.state.data.categories.find(
                (category) => category.id === categoryId,
              )}
              onSaved={resource.reload}
            />
          </section>
          <section className="content-studio-section">
            <header>
              <div>
                <p className="eyebrow">Education</p>
                <h2>Blog posts</h2>
              </div>
              <label>
                Edit
                <select
                  value={postId}
                  onChange={(event) => setPostId(event.target.value)}
                >
                  <option value="new">Create new post</option>
                  {resource.state.data.posts.map((post) => (
                    <option key={post.id} value={post.id}>
                      {post.title} · {post.status}
                    </option>
                  ))}
                </select>
              </label>
            </header>
            <BlogPostEditor
              key={postId}
              post={resource.state.data.posts.find(
                (post) => post.id === postId,
              )}
              categories={resource.state.data.categories}
              onSaved={resource.reload}
            />
          </section>
          <section className="content-studio-section">
            <header>
              <div>
                <p className="eyebrow">Help</p>
                <h2>Frequently asked questions</h2>
              </div>
              <label>
                Edit
                <select
                  value={faqId}
                  onChange={(event) => setFaqId(event.target.value)}
                >
                  <option value="new">Create new FAQ</option>
                  {resource.state.data.faqs.map((faq) => (
                    <option key={faq.id} value={faq.id}>
                      {faq.question} · {faq.status}
                    </option>
                  ))}
                </select>
              </label>
            </header>
            <FaqEditor
              key={faqId}
              faq={resource.state.data.faqs.find((faq) => faq.id === faqId)}
              onSaved={resource.reload}
            />
          </section>
        </div>
      ) : null}
    </section>
  );
}
