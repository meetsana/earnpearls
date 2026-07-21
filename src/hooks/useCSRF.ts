import { readCsrfToken } from "../lib/csrf";

export function useCSRF(): { getToken: () => string | null } {
  return { getToken: () => readCsrfToken() };
}
