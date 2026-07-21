export const CSRF_COOKIE_NAME = "ep_session_csrf";
export const CSRF_HEADER_NAME = "X-CSRF-Token";

/** Read the exact cookie value. It is intentionally not URL-decoded. */
export function readCsrfToken(
  cookieString: string = typeof document === "undefined" ? "" : document.cookie,
): string | null {
  for (const rawPart of cookieString.split(";")) {
    const part = rawPart.trimStart();
    const equalsIndex = part.indexOf("=");
    if (equalsIndex < 0) continue;
    if (part.slice(0, equalsIndex) === CSRF_COOKIE_NAME) {
      return part.slice(equalsIndex + 1);
    }
  }
  return null;
}
