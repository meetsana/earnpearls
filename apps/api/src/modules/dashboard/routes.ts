import { DashboardSchema } from "@earnpearls/contracts";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import { AppError } from "../../lib/errors.js";
import { toMoney } from "../../lib/money.js";
import { getPublicSettings } from "../content/service.js";
import { getCurrentLeaderboard } from "../leaderboards/service.js";
import { listNotifications, unreadCount } from "../notifications/service.js";
import { getProfile } from "../users/service.js";
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
      const publicSettings = await getPublicSettings(app);
      const [
        wallet,
        transactions,
        withdrawals,
        surveyCount,
        announcements,
        periodEarnings,
        leaderboard,
        notifications,
        notificationCount,
        supportCount,
        profile,
      ] = await Promise.all([
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
        app.db.query<{
          weekly_points: string;
          weekly_usd_micros: string;
          monthly_points: string;
          monthly_usd_micros: string;
        }>(
          `SELECT
              COALESCE(SUM(amount_points) FILTER (
                WHERE created_at >= date_trunc('week', NOW())
              ), 0)::TEXT AS weekly_points,
              COALESCE(SUM(amount_usd_micros) FILTER (
                WHERE created_at >= date_trunc('week', NOW())
              ), 0)::TEXT AS weekly_usd_micros,
              COALESCE(SUM(amount_points) FILTER (
                WHERE created_at >= date_trunc('month', NOW())
              ), 0)::TEXT AS monthly_points,
              COALESCE(SUM(amount_usd_micros) FILTER (
                WHERE created_at >= date_trunc('month', NOW())
              ), 0)::TEXT AS monthly_usd_micros
             FROM wallet_transactions
             WHERE user_id = $1 AND kind = 'survey_earning'
               AND current_bucket NOT IN ('rejected', 'reversed')`,
          [userId],
        ),
        publicSettings.features.leaderboards === true
          ? getCurrentLeaderboard(app, "weekly-points", userId).catch(
              (error) => {
                if (
                  error instanceof AppError &&
                  [
                    "LEADERBOARD_NOT_FOUND",
                    "LEADERBOARD_PERIOD_UNAVAILABLE",
                  ].includes(error.code)
                ) {
                  return null;
                }
                throw error;
              },
            )
          : Promise.resolve(null),
        listNotifications(app, userId, { limit: 5 }),
        unreadCount(app, userId),
        app.db.query<{ count: number }>(
          `SELECT COUNT(*)::INTEGER AS count FROM support_tickets
             WHERE user_id = $1 AND status NOT IN ('resolved', 'closed')`,
          [userId],
        ),
        getProfile(app, userId),
      ]);
      const activeWithdrawal =
        withdrawals.find(
          (item) => !["paid", "rejected", "cancelled"].includes(item.status),
        ) ?? null;
      return {
        wallet,
        weeklyEarnings: toMoney(
          BigInt(periodEarnings.rows[0]?.weekly_points ?? "0"),
          BigInt(periodEarnings.rows[0]?.weekly_usd_micros ?? "0"),
        ),
        monthlyEarnings: toMoney(
          BigInt(periodEarnings.rows[0]?.monthly_points ?? "0"),
          BigInt(periodEarnings.rows[0]?.monthly_usd_micros ?? "0"),
        ),
        leaderboardRank: leaderboard?.currentUserEntry?.rank ?? null,
        availableSurveyCount:
          publicSettings.features.surveys === true
            ? (surveyCount.rows[0]?.count ?? 0)
            : 0,
        unreadNotificationCount: notificationCount.unread,
        openSupportTicketCount:
          publicSettings.features.support === true
            ? (supportCount.rows[0]?.count ?? 0)
            : 0,
        profileCompletion: profile.profileCompletion,
        recentTransactions: transactions.items,
        recentNotifications: notifications.items,
        activeWithdrawal,
        announcements: announcements.rows,
      };
    },
  );
};
