import type {
  FastifyReply,
  FastifyRequest,
  preHandlerHookHandler,
} from "fastify";

import type { AppConfig } from "../config.js";
import type { Database } from "../db/database.js";
import type { AuthContext } from "./auth.js";

declare module "fastify" {
  interface FastifyInstance {
    config: AppConfig;
    db: Database;
    authenticate: preHandlerHookHandler;
    verifyCsrf: preHandlerHookHandler;
    authorize(
      permission: string,
      options?: { requireVerifiedEmail?: boolean },
    ): preHandlerHookHandler;
    setSessionCookies(
      reply: FastifyReply,
      sessionToken: string,
      csrfToken: string,
      expiresAt: Date,
    ): void;
    clearSessionCookies(reply: FastifyReply): void;
  }

  interface FastifyRequest {
    auth: AuthContext | null;
  }
}

export type AuthenticatedRequest = FastifyRequest & { auth: AuthContext };
