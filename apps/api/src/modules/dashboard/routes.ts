import { DashboardSchema } from "@earnpearls/contracts";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import { listWithdrawals } from "../withdrawals/service.js";
import { getWalletSummary, listWalletTransactions } from "../wallet/service.js";

type AnnouncementRow = Readonly<{
  id: string;
  title: string;
  body: string;
  severity: "info" | "success" | "warning" | "danger";
}>;

export const dashboardRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.get(
    "/",
    {
      preHandler: [
        app.authenticate,
        app.authorize("dashboard.read", { requireVerifiedEmail: true }),
      ],
      schema: {
        tags: ["Dashboard"],
        security: [{ cookieAuth: [] }],
        response: { 200: DashboardSchema },
      },
    },
    async (request) => {
      const userId = request.auth!.user.id;
      const countryCode = request.auth!.user.countryCode;
      const [wallet, transactions, withdrawals, surveyCount, announcements] =
        await Promise.all([
          getWalletSummary(app.db, userId),
          listWalletTransactions(app.db, userId, { limit: 5 }),
          listWithdrawals(app, userId),
          app.db.query<{ count: number }>(
            `SELECT COUNT(*)::INTEGER AS count
           FROM surveys s JOIN providers p ON p.id = s.provider_id
           WHERE s.active = TRUE AND p.enabled = TRUE
             AND (s.available_from IS NULL OR s.available_from <= NOW())
             AND (s.available_until IS NULL OR s.available_until > NOW())
             AND (CARDINALITY(s.country_codes) = 0 OR $1 = ANY(s.country_codes))`,
            [countryCode],
          ),
          app.db.query<AnnouncementRow>(
            `SELECT id, title, body, severity
           FROM announcements
           WHERE active = TRUE AND starts_at <= NOW()
             AND (ends_at IS NULL OR ends_at > NOW())
             AND (CARDINALITY(country_codes) = 0 OR $1 = ANY(country_codes))
           ORDER BY created_at DESC LIMIT 10`,
            [countryCode],
          ),
        ]);
      const activeWithdrawal =
        withdrawals.find(
          (item) => !["paid", "rejected", "cancelled"].includes(item.status),
        ) ?? null;
      return {
        wallet,
        availableSurveyCount: surveyCount.rows[0]?.count ?? 0,
        recentTransactions: transactions.items,
        activeWithdrawal,
        announcements: announcements.rows,
      };
    },
  );
};
