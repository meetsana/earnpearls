import { describe, expect, it } from "vitest";

import { readCsrfToken } from "../lib/csrf";

describe("CSRF cookie handling", () => {
  it("reads the exact ep_session_csrf value", () => {
    expect(readCsrfToken("ep_session_csrf=abc123.def; other=x")).toBe(
      "abc123.def",
    );
  });

  it("preserves encoded characters and equals signs", () => {
    expect(readCsrfToken("ep_session_csrf=a%2Fb==;other=x")).toBe("a%2Fb==");
  });

  it("supports cookie delimiters with or without a space", () => {
    expect(readCsrfToken("first=1;ep_session_csrf=token; third=3")).toBe(
      "token",
    );
  });

  it("does not match an absent or prefixed cookie", () => {
    expect(readCsrfToken("other=x")).toBeNull();
    expect(readCsrfToken("ep_session_csrf_old=zzz")).toBeNull();
  });
});
