import {
  BlogPostSchema,
  BlogPostSummarySchema,
  CmsPageSchema,
  FaqSchema,
  PublicSettingsSchema,
  PublicCountrySchema,
} from "@earnpearls/contracts";
import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import {
  getBlogPost,
  getPublicSettings,
  getPublishedPage,
  getSitemapXml,
  listBlogPosts,
  listPublicCountries,
  listFaqs,
} from "./service.js";

export const contentRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.get(
    "/sitemap.xml",
    {
      schema: { tags: ["Content"] },
    },
    async (_request, reply) =>
      reply
        .type("application/xml; charset=utf-8")
        .send(await getSitemapXml(app)),
  );

  app.get(
    "/countries",
    {
      schema: {
        tags: ["Content"],
        response: { 200: Type.Array(PublicCountrySchema) },
      },
    },
    async () => listPublicCountries(app),
  );

  app.get(
    "/settings",
    {
      schema: {
        tags: ["Content"],
        response: { 200: PublicSettingsSchema },
      },
    },
    async () => getPublicSettings(app),
  );

  app.get(
    "/pages/:slug",
    {
      schema: {
        tags: ["Content"],
        params: Type.Object({
          slug: Type.String({
            minLength: 1,
            maxLength: 120,
            pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
          }),
        }),
        response: { 200: CmsPageSchema },
      },
    },
    async (request) => getPublishedPage(app, request.params.slug),
  );

  app.get(
    "/blog",
    {
      schema: {
        tags: ["Content"],
        querystring: Type.Object({
          category: Type.Optional(Type.String({ maxLength: 120 })),
          search: Type.Optional(Type.String({ maxLength: 200 })),
          limit: Type.Optional(
            Type.Integer({ minimum: 1, maximum: 50, default: 12 }),
          ),
        }),
        response: { 200: Type.Array(BlogPostSummarySchema) },
      },
    },
    async (request) =>
      listBlogPosts(app, {
        ...(request.query.category ? { category: request.query.category } : {}),
        ...(request.query.search ? { search: request.query.search } : {}),
        limit: request.query.limit ?? 12,
      }),
  );

  app.get(
    "/blog/:slug",
    {
      schema: {
        tags: ["Content"],
        params: Type.Object({
          slug: Type.String({
            minLength: 1,
            maxLength: 160,
            pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
          }),
        }),
        response: { 200: BlogPostSchema },
      },
    },
    async (request) => getBlogPost(app, request.params.slug),
  );

  app.get(
    "/faqs",
    {
      schema: {
        tags: ["Content"],
        querystring: Type.Object({
          category: Type.Optional(Type.String({ maxLength: 120 })),
        }),
        response: { 200: Type.Array(FaqSchema) },
      },
    },
    async (request) => listFaqs(app, request.query.category),
  );
};
