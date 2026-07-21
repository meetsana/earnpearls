export type AuthenticatedUser = Readonly<{
  id: string;
  email: string;
  displayName: string;
  countryCode: string;
  accountStatus: "active" | "limited" | "suspended" | "disabled" | "archived";
  emailVerifiedAt: Date | null;
  createdAt: Date;
}>;

export type AuthContext = Readonly<{
  sessionId: string;
  csrfTokenHash: string;
  user: AuthenticatedUser;
  capabilities: ReadonlySet<string>;
}>;
