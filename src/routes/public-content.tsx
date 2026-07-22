import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { api } from "../api/endpoints";
import {
  EmptyState,
  ErrorNotice,
  LoadingState,
} from "../components/AsyncStates";
import { MarkdownContent } from "../components/MarkdownContent";
import { useApiResource } from "../hooks/useApiResource";
import { usePageMetadata, useStructuredData } from "../hooks/usePageMetadata";
import { PublicLayout } from "./public";

const fallbackPages: Record<
  string,
  { title: string; description: string; body: string }
> = {
  about: {
    title: "About EarnPearls",
    description:
      "Learn how EarnPearls is building a transparent rewards platform.",
    body: "# A clearer rewards experience\nEarnPearls helps eligible members discover paid surveys and understand every stage of their rewards.\n\n# Our principles\n- Transparent reward status\n- Secure, configurable operations\n- Respect for provider requirements\n- A simple, mobile-first experience",
  },
  contact: {
    title: "Contact EarnPearls",
    description: "Contact and support options for EarnPearls.",
    body: "# Need help?\nRegistered members can open and track a support ticket from the Support Center.\n\nFor account-specific questions, please sign in so our support team can protect your information.",
  },
  privacy: {
    title: "Privacy Policy",
    description: "EarnPearls privacy information.",
    body: "# Policy under review\nThe final Privacy Policy will be published here before public production launch. Staging does not represent the final legal policy.",
  },
  terms: {
    title: "Terms of Service",
    description: "EarnPearls terms of service.",
    body: "# Terms under review\nThe final Terms of Service will be published here before public production launch. Staging does not represent the final legal terms.",
  },
  cookies: {
    title: "Cookie Policy",
    description: "EarnPearls cookie and session information.",
    body: "# Essential session cookies\nEarnPearls uses essential security cookies for authenticated sessions and CSRF protection. The final Cookie Policy will be published before production launch.",
  },
};

export function PublicPage() {
  const { slug = "about" } = useParams();
  const resource = useApiResource(() => api.content.page(slug), [slug]);
  const fallback = fallbackPages[slug];
  const page = resource.state.status === "success" ? resource.state.data : null;
  const title =
    page?.seoTitle || page?.title || fallback?.title || "EarnPearls";
  const description =
    page?.seoDescription || fallback?.description || "EarnPearls information.";
  usePageMetadata(title, description, page?.canonicalPath ?? `/${slug}`);

  return (
    <PublicLayout>
      <article className="content-article">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>{title}</span>
        </nav>
        {resource.state.status === "loading" ? (
          <LoadingState label="Loading page" />
        ) : null}
        {resource.state.status === "error" && !fallback ? (
          <ErrorNotice error={resource.state.error} onRetry={resource.reload} />
        ) : null}
        {page || fallback ? (
          <>
            <p className="eyebrow">EarnPearls</p>
            <h1>{page?.title ?? fallback?.title}</h1>
            <MarkdownContent
              markdown={page?.bodyMarkdown ?? fallback?.body ?? ""}
            />
          </>
        ) : null}
      </article>
    </PublicLayout>
  );
}

export function BlogIndex() {
  const [params, setParams] = useSearchParams();
  const search = params.get("search") ?? "";
  const resource = useApiResource(
    () => api.content.blog(search ? { search, limit: 24 } : { limit: 24 }),
    [search],
  );
  usePageMetadata(
    "EarnPearls Blog",
    "Guides about surveys, rewards, account security, and platform updates.",
    "/blog",
  );
  return (
    <PublicLayout>
      <section>
        <header className="public-page-heading">
          <p className="eyebrow">Guides & updates</p>
          <h1>EarnPearls Blog</h1>
          <p>
            Practical education about surveys, rewards, and secure online
            earning.
          </p>
        </header>
        <form
          className="filter-bar"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            const next = String(form.get("search") ?? "").trim();
            setParams(next ? { search: next } : {});
          }}
        >
          <label>
            Search articles
            <input name="search" defaultValue={search} maxLength={200} />
          </label>
          <button className="button button--secondary">Search</button>
        </form>
        {resource.state.status === "loading" ? (
          <LoadingState label="Loading articles" />
        ) : null}
        {resource.state.status === "error" ? (
          <ErrorNotice error={resource.state.error} onRetry={resource.reload} />
        ) : null}
        {resource.state.status === "success" &&
        resource.state.data.length === 0 ? (
          <EmptyState title="No articles yet">
            Published EarnPearls guides will appear here.
          </EmptyState>
        ) : null}
        {resource.state.status === "success" ? (
          <div className="content-grid content-grid--three">
            {resource.state.data.map((post) => (
              <article className="card blog-card" key={post.slug}>
                <p className="eyebrow">{post.categoryName ?? "EarnPearls"}</p>
                <h2>
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p>{post.excerpt}</p>
                <time dateTime={post.publishedAt}>
                  {new Intl.DateTimeFormat(undefined, {
                    dateStyle: "medium",
                  }).format(new Date(post.publishedAt))}
                </time>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </PublicLayout>
  );
}

export function BlogPostPage() {
  const { slug = "" } = useParams();
  const resource = useApiResource(() => api.content.blogPost(slug), [slug]);
  const post = resource.state.status === "success" ? resource.state.data : null;
  usePageMetadata(
    post?.seoTitle || post?.title || "EarnPearls Blog",
    post?.seoDescription || post?.excerpt || "EarnPearls article.",
    post?.canonicalPath ?? `/blog/${slug}`,
  );
  useStructuredData(
    "blog-post",
    post
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          author: {
            "@type": "Organization",
            name: post.authorName ?? "EarnPearls",
          },
          publisher: { "@type": "Organization", name: "EarnPearls" },
          mainEntityOfPage: `https://earnpearls.com${post.canonicalPath}`,
        }
      : null,
  );
  return (
    <PublicLayout>
      <article className="content-article">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/blog">Blog</Link>
          <span aria-hidden="true">/</span>
          <span>{post?.title ?? "Article"}</span>
        </nav>
        {resource.state.status === "loading" ? (
          <LoadingState label="Loading article" />
        ) : null}
        {resource.state.status === "error" ? (
          <ErrorNotice error={resource.state.error} onRetry={resource.reload} />
        ) : null}
        {post ? (
          <>
            <p className="eyebrow">{post.categoryName ?? "EarnPearls"}</p>
            <h1>{post.title}</h1>
            <p className="article-lead">{post.excerpt}</p>
            <p className="article-meta">
              {post.authorName ? `By ${post.authorName} · ` : ""}
              {new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(
                new Date(post.publishedAt),
              )}
            </p>
            <MarkdownContent markdown={post.bodyMarkdown} />
          </>
        ) : null}
      </article>
    </PublicLayout>
  );
}

export function FaqPage() {
  const resource = useApiResource(() => api.content.faqs());
  const [query, setQuery] = useState("");
  const visibleFaqs =
    resource.state.status === "success"
      ? resource.state.data.filter((faq) =>
          `${faq.question} ${faq.answerMarkdown} ${faq.category}`
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
        )
      : [];
  usePageMetadata(
    "EarnPearls Frequently Asked Questions",
    "Answers about EarnPearls surveys, rewards, wallet states, withdrawals, and security.",
    "/faq",
  );
  useStructuredData(
    "faq-page",
    resource.state.status === "success" && resource.state.data.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: resource.state.data.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answerMarkdown,
            },
          })),
        }
      : null,
  );
  return (
    <PublicLayout>
      <section className="content-article">
        <p className="eyebrow">Help Center</p>
        <h1>Frequently asked questions</h1>
        <label className="faq-search">
          Search the knowledge base
          <input
            type="search"
            maxLength={200}
            placeholder="Search rewards, surveys, withdrawals, or security"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        {resource.state.status === "loading" ? (
          <LoadingState label="Loading answers" />
        ) : null}
        {resource.state.status === "error" ? (
          <ErrorNotice error={resource.state.error} onRetry={resource.reload} />
        ) : null}
        {resource.state.status === "success" &&
        resource.state.data.length === 0 ? (
          <div className="faq-list">
            <details>
              <summary>How do reward balances work?</summary>
              <p>
                Rewards move through pending, validated, mature, and
                withdrawable stages based on provider confirmation and
                settlement evidence.
              </p>
            </details>
            <details>
              <summary>Why is a reward pending?</summary>
              <p>
                The survey provider has not completed validation yet. EarnPearls
                shows this state separately so your available balance remains
                clear.
              </p>
            </details>
            <details>
              <summary>Are withdrawals active?</summary>
              <p>
                Withdrawal methods only appear as enabled when the platform and
                method-level controls are both active.
              </p>
            </details>
          </div>
        ) : null}
        {resource.state.status === "success" &&
        resource.state.data.length > 0 &&
        visibleFaqs.length === 0 ? (
          <EmptyState title="No matching answers">
            Try a different search or open a support ticket after signing in.
          </EmptyState>
        ) : null}
        {resource.state.status === "success" ? (
          <div className="faq-list">
            {visibleFaqs.map((faq) => (
              <details key={faq.id}>
                <summary>{faq.question}</summary>
                <MarkdownContent markdown={faq.answerMarkdown} />
              </details>
            ))}
          </div>
        ) : null}
      </section>
    </PublicLayout>
  );
}
