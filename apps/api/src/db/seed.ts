import { randomUUID } from "node:crypto";

import { loadConfig } from "../config.js";
import { encryptSensitive, hashPassword } from "../lib/crypto.js";
import { Database } from "./database.js";

async function seed(): Promise<void> {
  const config = loadConfig();
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  const countryCode = (process.env.SEED_ADMIN_COUNTRY ?? "US")
    .trim()
    .toUpperCase();

  if (!email || !password) {
    throw new Error("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required");
  }
  if (password.length < 16)
    throw new Error("SEED_ADMIN_PASSWORD must be at least 16 characters");
  if (!/^[A-Z]{2}$/.test(countryCode))
    throw new Error("SEED_ADMIN_COUNTRY must be an ISO alpha-2 code");

  const database = new Database(config);
  try {
    const passwordHash = await hashPassword(password, config.passwordPepper);
    const adminUserId = await database.transaction(async (client) => {
      const existing = await client.query<{ id: string }>(
        "SELECT id FROM users WHERE email = $1",
        [email],
      );
      const userId = existing.rows[0]?.id ?? randomUUID();
      if (!existing.rows[0]) {
        await client.query(
          `INSERT INTO users (
            id, email, password_hash, display_name, country_code, email_verified_at
          ) VALUES ($1, $2, $3, $4, $5, NOW())`,
          [
            userId,
            email,
            passwordHash,
            "EarnPearls Administrator",
            countryCode,
          ],
        );
      }
      await client.query(
        `INSERT INTO user_roles (user_id, role_code, assigned_by)
         VALUES ($1, 'super_admin', $1)
        ON CONFLICT (user_id, role_code) DO NOTHING`,
        [userId],
      );
      return userId;
    });

    await seedPlatformContent(database, adminUserId);
    if (config.allowDemoData) {
      await seedDemoData(database, adminUserId, config.dataEncryptionKey);
    }
    process.stdout.write(`Seeded administrator ${email}\n`);
  } finally {
    await database.close();
  }
}

async function seedPlatformContent(
  database: Database,
  adminUserId: string,
): Promise<void> {
  await database.transaction(async (client) => {
    await client.query(
      `INSERT INTO user_preferences (user_id) VALUES ($1)
       ON CONFLICT (user_id) DO NOTHING`,
      [adminUserId],
    );

    const pages = [
      {
        id: "50000000-0000-4000-8000-000000000001",
        revisionId: "50000000-0000-4000-8000-000000000002",
        slug: "about",
        title: "About EarnPearls",
        excerpt: "A transparent, survey-first rewards platform.",
        body: "# A clearer rewards experience\nEarnPearls helps eligible members discover paid surveys and understand every stage of their rewards.\n\n# Our principles\n- Transparent reward status\n- Secure, configurable operations\n- Respect for provider and country requirements\n- A simple, mobile-first experience",
        seoTitle: "About EarnPearls",
        seoDescription:
          "Learn how EarnPearls is building a transparent survey rewards platform.",
        canonicalPath: "/about",
      },
      {
        id: "50000000-0000-4000-8000-000000000003",
        revisionId: "50000000-0000-4000-8000-000000000004",
        slug: "contact",
        title: "Contact EarnPearls",
        excerpt: "Get account help through the secure Support Center.",
        body: "# Need help?\nRegistered members can open and track a support ticket from the Support Center.\n\nFor account-specific questions, sign in so the support team can protect your information. Never send a password, verification token, or payout credential in a ticket.",
        seoTitle: "Contact EarnPearls Support",
        seoDescription:
          "Find the secure support options available to EarnPearls members.",
        canonicalPath: "/contact",
      },
    ] as const;
    for (const page of pages) {
      await client.query(
        `INSERT INTO cms_pages (
          id, slug, title, excerpt, body_markdown, status, seo_title,
          seo_description, canonical_path, published_at, author_id
        ) VALUES ($1,$2,$3,$4,$5,'published',$6,$7,$8,NOW(),$9)
        ON CONFLICT (slug) DO NOTHING`,
        [
          page.id,
          page.slug,
          page.title,
          page.excerpt,
          page.body,
          page.seoTitle,
          page.seoDescription,
          page.canonicalPath,
          adminUserId,
        ],
      );
      await client.query(
        `INSERT INTO cms_page_revisions (
          id, page_id, version_number, title, excerpt, body_markdown,
          status, seo_title, seo_description, actor_id, change_reason
        ) SELECT $1, id, 1, title, excerpt, body_markdown, status,
          seo_title, seo_description, $3, 'Initial platform seed'
          FROM cms_pages WHERE slug = $2
        ON CONFLICT (page_id, version_number) DO NOTHING`,
        [page.revisionId, page.slug, adminUserId],
      );
    }

    const categoryId = "51000000-0000-4000-8000-000000000001";
    await client.query(
      `INSERT INTO blog_categories (id, slug, name, description, active)
       VALUES ($1, 'getting-started', 'Getting Started',
        'Practical guides for using EarnPearls clearly and securely.', TRUE)
       ON CONFLICT (slug) DO NOTHING`,
      [categoryId],
    );
    const posts = [
      {
        id: "52000000-0000-4000-8000-000000000001",
        revisionId: "52000000-0000-4000-8000-000000000002",
        slug: "understanding-reward-statuses",
        title: "Understanding EarnPearls reward statuses",
        excerpt:
          "A plain-language guide to pending, validated, mature, and withdrawable rewards.",
        body: "# Why rewards have stages\nSurvey rewards rely on provider confirmation and settlement evidence. EarnPearls separates each stage so an estimated reward is never presented as ready cash.\n\n# Pending\nThe provider has received activity but has not completed validation.\n\n# Validated\nThe provider confirmed the activity. The reward may still have a maturity window.\n\n# Mature\nThe validation window has completed with the required evidence.\n\n# Withdrawable\nThe reward is eligible for an enabled withdrawal method, subject to account and method rules.",
      },
      {
        id: "52000000-0000-4000-8000-000000000003",
        revisionId: "52000000-0000-4000-8000-000000000004",
        slug: "keeping-your-rewards-account-secure",
        title: "Keeping your rewards account secure",
        excerpt:
          "Simple steps for protecting your EarnPearls account and recognizing sensitive information.",
        body: "# Protect your access\nUse a unique password, verify your email, and review active sessions from the Security screen.\n\n# Keep secrets private\nEarnPearls support will never ask for your password, email verification token, password-reset token, or complete payout credentials.\n\n# Report unusual activity\nRevoke unfamiliar sessions and open a Security support ticket with non-sensitive details.",
      },
    ] as const;
    for (const post of posts) {
      await client.query(
        `INSERT INTO blog_posts (
          id, slug, title, excerpt, body_markdown, category_id, status,
          seo_title, seo_description, canonical_path, author_id, published_at
        ) VALUES ($1,$2,$3,$4,$5,$6,'published',$3,$4,$7,$8,NOW())
        ON CONFLICT (slug) DO NOTHING`,
        [
          post.id,
          post.slug,
          post.title,
          post.excerpt,
          post.body,
          categoryId,
          `/blog/${post.slug}`,
          adminUserId,
        ],
      );
      await client.query(
        `INSERT INTO blog_post_revisions (
          id, post_id, version_number, title, excerpt, body_markdown,
          status, seo_title, seo_description, actor_id, change_reason
        ) SELECT $1, id, 1, title, excerpt, body_markdown, status,
          seo_title, seo_description, $3, 'Initial platform seed'
          FROM blog_posts WHERE slug = $2
        ON CONFLICT (post_id, version_number) DO NOTHING`,
        [post.revisionId, post.slug, adminUserId],
      );
    }

    const faqs = [
      [
        "53000000-0000-4000-8000-000000000001",
        "53000000-0000-4000-8000-000000000002",
        "rewards",
        "How do reward balances work?",
        "Rewards move through pending, validated, mature, and withdrawable stages based on provider confirmation and settlement evidence.",
      ],
      [
        "53000000-0000-4000-8000-000000000003",
        "53000000-0000-4000-8000-000000000004",
        "surveys",
        "Why is a survey reward pending?",
        "The survey provider has not completed validation yet. EarnPearls shows pending value separately so the available balance stays clear.",
      ],
      [
        "53000000-0000-4000-8000-000000000005",
        "53000000-0000-4000-8000-000000000006",
        "withdrawals",
        "Are withdrawals always available?",
        "No. A method appears enabled only when both the global withdrawal control and the method-level control are active for the member.",
      ],
      [
        "53000000-0000-4000-8000-000000000007",
        "53000000-0000-4000-8000-000000000008",
        "account",
        "Which countries can register?",
        "The registration form lists the countries currently enabled by the platform. Country availability can change when provider or compliance requirements change.",
      ],
      [
        "53000000-0000-4000-8000-000000000009",
        "53000000-0000-4000-8000-000000000010",
        "security",
        "Will support ask for my password?",
        "No. Never send a password, verification token, password-reset token, or complete payout credential to support.",
      ],
    ] as const;
    for (const [index, faq] of faqs.entries()) {
      await client.query(
        `INSERT INTO faqs (
          id, category, question, answer_markdown, status, sort_order,
          author_id, published_at
        ) VALUES ($1,$2,$3,$4,'published',$5,$6,NOW())
        ON CONFLICT (id) DO NOTHING`,
        [faq[0], faq[2], faq[3], faq[4], (index + 1) * 10, adminUserId],
      );
      await client.query(
        `INSERT INTO faq_revisions (
          id, faq_id, version_number, category, question, answer_markdown,
          status, sort_order, actor_id, change_reason
        ) SELECT $1, id, 1, category, question, answer_markdown, status,
          sort_order, $3, 'Initial platform seed' FROM faqs WHERE id = $2
        ON CONFLICT (faq_id, version_number) DO NOTHING`,
        [faq[1], faq[0], adminUserId],
      );
    }
  });
}

async function seedDemoData(
  database: Database,
  adminUserId: string,
  encryptionKey: Buffer,
): Promise<void> {
  const providerId = "10000000-0000-4000-8000-000000000001";
  await database.query(
    `INSERT INTO providers (id, code, display_name, enabled, user_visible, health_status)
     VALUES ($1, 'demo', 'Demo Provider', TRUE, FALSE, 'healthy')
     ON CONFLICT (code) DO UPDATE SET enabled = TRUE, health_status = 'healthy'`,
    [providerId],
  );
  const surveys = [
    [
      "20000000-0000-4000-8000-000000000001",
      "demo-1",
      "Consumer habits survey",
      320n,
      320_000n,
      8,
    ],
    [
      "20000000-0000-4000-8000-000000000002",
      "demo-2",
      "Streaming preferences",
      550n,
      550_000n,
      14,
    ],
    [
      "20000000-0000-4000-8000-000000000003",
      "demo-3",
      "Travel planning study",
      900n,
      900_000n,
      22,
    ],
  ] as const;
  for (const survey of surveys) {
    await database.query(
      `INSERT INTO surveys (
        id, provider_id, external_id, title, reward_points, reward_usd_micros,
        estimated_minutes, difficulty, category, country_codes, device_types, launch_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'Medium', 'General',
        ARRAY['US','GB','CA','IE','AU','DE','BE','SA','AE','QA','OM','BH'],
        ARRAY['desktop','mobile'], $8)
      ON CONFLICT (provider_id, external_id) DO UPDATE SET
        reward_points = EXCLUDED.reward_points,
        reward_usd_micros = EXCLUDED.reward_usd_micros,
        active = TRUE`,
      [
        survey[0],
        providerId,
        survey[1],
        survey[2],
        survey[3].toString(),
        survey[4].toString(),
        survey[5],
        `https://example.invalid/surveys/${survey[1]}`,
      ],
    );
  }

  for (const method of [
    {
      code: "demo_paypal",
      displayName: "PayPal (demo only)",
      minimumPoints: "5000",
      feePoints: "0",
      destinationSchema: { type: "email" },
    },
    {
      code: "demo_virtual_visa",
      displayName: "Virtual Visa (demo only)",
      minimumPoints: "10000",
      feePoints: "500",
      destinationSchema: { type: "email" },
    },
  ] as const) {
    await database.query(
      `INSERT INTO withdrawal_methods (
        code, display_name, enabled, minimum_points, fee_points,
        country_codes, destination_schema, configuration
      ) VALUES ($1, $2, FALSE, $3, $4, '{}', $5, '{"demo":true}')
      ON CONFLICT (code) DO UPDATE SET
        display_name = EXCLUDED.display_name,
        enabled = FALSE,
        minimum_points = EXCLUDED.minimum_points,
        fee_points = EXCLUDED.fee_points,
        destination_schema = EXCLUDED.destination_schema,
        configuration = EXCLUDED.configuration`,
      [
        method.code,
        method.displayName,
        method.minimumPoints,
        method.feePoints,
        JSON.stringify(method.destinationSchema),
      ],
    );
  }

  await seedDemoWithdrawal(database, adminUserId, encryptionKey);
}

async function seedDemoWithdrawal(
  database: Database,
  userId: string,
  encryptionKey: Buffer,
): Promise<void> {
  const adjustmentTransactionId = "30000000-0000-4000-8000-000000000001";
  const adjustmentEventId = "30000000-0000-4000-8000-000000000002";
  const withdrawalId = "40000000-0000-4000-8000-000000000001";
  const withdrawalTransactionId = "40000000-0000-4000-8000-000000000002";
  const requestEventId = "40000000-0000-4000-8000-000000000003";
  const rejectionEventId = "40000000-0000-4000-8000-000000000006";
  const points = "5000";
  const usdMicros = "5000000";
  const encryptedDestination = encryptSensitive(
    "demo-user@example.invalid",
    encryptionKey,
  );

  await database.transaction(async (client) => {
    const existing = await client.query(
      "SELECT 1 FROM withdrawals WHERE id = $1",
      [withdrawalId],
    );
    if (!existing.rows[0]) {
      await client.query(
        `INSERT INTO wallet_transactions (
        id, user_id, kind, current_bucket, amount_points, amount_usd_micros,
        description, reference_type, reference_id, idempotency_key
      ) VALUES ($1, $2, 'adjustment', 'withdrawable', $3, $4,
        'Synthetic staging wallet credit', 'demo_seed', $5,
        'demo-withdrawal-credit-v1')`,
        [adjustmentTransactionId, userId, points, usdMicros, withdrawalId],
      );
      await client.query(
        `INSERT INTO wallet_transaction_events (
        id, transaction_id, from_bucket, to_bucket, event_type,
        actor_type, actor_id, reason
      ) VALUES ($1, $2, NULL, 'withdrawable', 'created', 'system', NULL,
        'Synthetic credit for the disabled withdrawal demonstration')`,
        [adjustmentEventId, adjustmentTransactionId],
      );
      await client.query(
        `INSERT INTO wallet_entries (
        id, user_id, transaction_id, event_id, bucket,
        points_delta, usd_micros_delta
      ) VALUES ($1, $2, $3, $4, 'withdrawable', $5, $6)`,
        [
          "30000000-0000-4000-8000-000000000003",
          userId,
          adjustmentTransactionId,
          adjustmentEventId,
          points,
          usdMicros,
        ],
      );

      await client.query(
        `INSERT INTO wallet_transactions (
        id, user_id, kind, current_bucket, amount_points, amount_usd_micros,
        description, reference_type, reference_id, idempotency_key
      ) VALUES ($1, $2, 'withdrawal', 'withdrawable', $3, $4,
        'Synthetic rejected withdrawal', 'withdrawal', $5,
        'demo-rejected-withdrawal-v1')`,
        [withdrawalTransactionId, userId, points, usdMicros, withdrawalId],
      );
      await client.query(
        `INSERT INTO wallet_transaction_events (
        id, transaction_id, from_bucket, to_bucket, event_type,
        actor_type, actor_id, reason
      ) VALUES ($1, $2, 'withdrawable', 'reserved', 'withdrawal_requested',
        'user', $3, 'Synthetic staging withdrawal request')`,
        [requestEventId, withdrawalTransactionId, userId],
      );
      await client.query(
        `INSERT INTO wallet_entries (
        id, user_id, transaction_id, event_id, bucket,
        points_delta, usd_micros_delta
      ) VALUES
        ($1, $2, $3, $4, 'withdrawable', $5, $6),
        ($7, $2, $3, $4, 'reserved', $8, $9)`,
        [
          "40000000-0000-4000-8000-000000000004",
          userId,
          withdrawalTransactionId,
          requestEventId,
          `-${points}`,
          `-${usdMicros}`,
          "40000000-0000-4000-8000-000000000005",
          points,
          usdMicros,
        ],
      );
      await client.query(
        `INSERT INTO wallet_transaction_events (
        id, transaction_id, from_bucket, to_bucket, event_type,
        actor_type, actor_id, reason
      ) VALUES ($1, $2, 'reserved', 'withdrawable', 'withdrawal_rejected',
        'admin', $3, 'Synthetic staging rejection; no payout was attempted')`,
        [rejectionEventId, withdrawalTransactionId, userId],
      );
      await client.query(
        `INSERT INTO wallet_entries (
        id, user_id, transaction_id, event_id, bucket,
        points_delta, usd_micros_delta
      ) VALUES
        ($1, $2, $3, $4, 'reserved', $5, $6),
        ($7, $2, $3, $4, 'withdrawable', $8, $9)`,
        [
          "40000000-0000-4000-8000-000000000007",
          userId,
          withdrawalTransactionId,
          rejectionEventId,
          `-${points}`,
          `-${usdMicros}`,
          "40000000-0000-4000-8000-000000000008",
          points,
          usdMicros,
        ],
      );
      await client.query(
        `INSERT INTO withdrawals (
        id, user_id, method_code, wallet_transaction_id,
        amount_points, amount_usd_micros, fee_points, fee_usd_micros,
        destination_ciphertext, destination_masked, status,
        reviewed_by, reviewed_at, processed_at, rejection_reason,
        idempotency_key, requested_at
      ) VALUES ($1, $2, 'demo_paypal', $3, $4, $5, 0, 0, $6,
        'd***@example.invalid', 'rejected', $2,
        NOW() - INTERVAL '23 hours', NOW() - INTERVAL '23 hours',
        'Synthetic staging example; no payout was attempted',
        'demo-rejected-withdrawal-v1', NOW() - INTERVAL '1 day')`,
        [
          withdrawalId,
          userId,
          withdrawalTransactionId,
          points,
          usdMicros,
          encryptedDestination,
        ],
      );
    }

    await client.query(
      `INSERT INTO withdrawal_events (
        id, withdrawal_id, from_status, to_status, actor_type, actor_id, reason
      ) VALUES ($1,$2,NULL,'requested','user',$3,
        'Synthetic staging withdrawal request')
      ON CONFLICT (id) DO NOTHING`,
      ["40000000-0000-4000-8000-000000000009", withdrawalId, userId],
    );
    await client.query(
      `INSERT INTO withdrawal_events (
        id, withdrawal_id, from_status, to_status, actor_type, actor_id, reason
      ) VALUES ($1,$2,'requested','rejected','admin',$3,
        'Synthetic staging rejection; no payout was attempted')
      ON CONFLICT (id) DO NOTHING`,
      ["40000000-0000-4000-8000-000000000010", withdrawalId, userId],
    );
  });
}

await seed();
