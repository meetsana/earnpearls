import {
  AdminBlogCategorySchema,
  AdminBlogPostSchema,
  AdminBlogPostWriteBodySchema,
  AdminCmsPageSchema,
  AdminCmsPageWriteBodySchema,
  AdminFaqSchema,
  AdminFaqWriteBodySchema,
  UuidSchema,
} from "@earnpearls/contracts";
import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import {
  createPage,
  createPost,
  listAdminFaqs,
  listAdminPages,
  listAdminPosts,
  listBlogCategories,
  updatePage,
  updatePost,
  upsertBlogCategory,
  upsertFaq,
} from "./content-service.js";

const categoryBody = Type.Object({
  slug: Type.String({
    minLength: 1,
    maxLength: 120,
    pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
  }),
  name: Type.String({ minLength: 1, maxLength: 120 }),
  description: Type.String({ maxLength: 500 }),
  active: Type.Boolean(),
  reason: Type.String({ minLength: 3, maxLength: 1000 }),
});

export const adminContentRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.get(
    "/content/pages",
    {
      preHandler: [app.authenticate, app.authorize("admin.content.read")],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [] }],
        response: { 200: Type.Array(AdminCmsPageSchema) },
      },
    },
    async () => listAdminPages(app),
  );

  app.post(
    "/content/pages",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.content.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        body: AdminCmsPageWriteBodySchema,
        response: { 201: AdminCmsPageSchema },
      },
    },
    async (request, reply) =>
      reply.code(201).send(await createPage(app, request, request.body)),
  );

  app.put(
    "/content/pages/:pageId",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.content.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        params: Type.Object({ pageId: UuidSchema }),
        body: AdminCmsPageWriteBodySchema,
        response: { 200: AdminCmsPageSchema },
      },
    },
    async (request) =>
      updatePage(app, request, request.params.pageId, request.body),
  );

  app.get(
    "/content/blog/categories",
    {
      preHandler: [app.authenticate, app.authorize("admin.content.read")],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [] }],
        response: { 200: Type.Array(AdminBlogCategorySchema) },
      },
    },
    async () => listBlogCategories(app),
  );

  app.post(
    "/content/blog/categories",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.content.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        body: categoryBody,
        response: { 201: AdminBlogCategorySchema },
      },
    },
    async (request, reply) =>
      reply
        .code(201)
        .send(await upsertBlogCategory(app, request, request.body)),
  );

  app.put(
    "/content/blog/categories/:categoryId",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.content.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        params: Type.Object({ categoryId: UuidSchema }),
        body: categoryBody,
        response: { 200: AdminBlogCategorySchema },
      },
    },
    async (request) =>
      upsertBlogCategory(app, request, {
        id: request.params.categoryId,
        ...request.body,
      }),
  );

  app.get(
    "/content/blog/posts",
    {
      preHandler: [app.authenticate, app.authorize("admin.content.read")],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [] }],
        response: { 200: Type.Array(AdminBlogPostSchema) },
      },
    },
    async () => listAdminPosts(app),
  );

  app.post(
    "/content/blog/posts",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.content.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        body: AdminBlogPostWriteBodySchema,
        response: { 201: AdminBlogPostSchema },
      },
    },
    async (request, reply) =>
      reply.code(201).send(await createPost(app, request, request.body)),
  );

  app.put(
    "/content/blog/posts/:postId",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.content.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        params: Type.Object({ postId: UuidSchema }),
        body: AdminBlogPostWriteBodySchema,
        response: { 200: AdminBlogPostSchema },
      },
    },
    async (request) =>
      updatePost(app, request, request.params.postId, request.body),
  );

  app.get(
    "/content/faqs",
    {
      preHandler: [app.authenticate, app.authorize("admin.content.read")],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [] }],
        response: { 200: Type.Array(AdminFaqSchema) },
      },
    },
    async () => listAdminFaqs(app),
  );

  app.post(
    "/content/faqs",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.content.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        body: AdminFaqWriteBodySchema,
        response: { 201: AdminFaqSchema },
      },
    },
    async (request, reply) =>
      reply
        .code(201)
        .send(await upsertFaq(app, request, undefined, request.body)),
  );

  app.put(
    "/content/faqs/:faqId",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.content.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        params: Type.Object({ faqId: UuidSchema }),
        body: AdminFaqWriteBodySchema,
        response: { 200: AdminFaqSchema },
      },
    },
    async (request) =>
      upsertFaq(app, request, request.params.faqId, request.body),
  );
};
