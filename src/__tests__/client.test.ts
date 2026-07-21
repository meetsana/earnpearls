import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiFailure, request } from "../api/client";

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { "Content-Type": "application/json", ...init.headers },
  });
}

describe("API client", () => {
  beforeEach(() => {
    document.cookie = "ep_session_csrf=; Max-Age=0; path=/";
  });

  it("sends credentials and the exact CSRF value on mutations", async () => {
    document.cookie = "ep_session_csrf=a%2Fb==; path=/";
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ message: "ok" }));
    vi.stubGlobal("fetch", fetchMock);

    await request("/auth/logout", { method: "POST" });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/v1/auth/logout");
    expect(init.credentials).toBe("include");
    expect(init.headers).toMatchObject({ "X-CSRF-Token": "a%2Fb==" });
  });

  it("adds the canonical withdrawal idempotency header", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ id: "w1" }, { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    await request("/withdrawals/", {
      method: "POST",
      body: {
        methodCode: "test",
        points: "5000",
        destination: "masked@example.com",
      },
      idempotencyKey: "11111111-1111-4111-8111-111111111111",
    });
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(init.headers).toMatchObject({
      "Idempotency-Key": "11111111-1111-4111-8111-111111111111",
    });
  });

  it("does not send the unsupported X-Request-Id browser header", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ authenticated: true }));
    vi.stubGlobal("fetch", fetchMock);
    await request("/auth/session");
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(init.headers).not.toHaveProperty("X-Request-Id");
  });

  it("parses the canonical nested error envelope", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse(
          {
            error: {
              code: "RESOURCE_CONFLICT",
              message: "Already exists.",
              requestId: "req-123",
              details: { field: "email" },
            },
          },
          { status: 409 },
        ),
      ),
    );

    await expect(request("/test")).rejects.toMatchObject({
      error: {
        kind: "conflict",
        code: "RESOURCE_CONFLICT",
        message: "Already exists.",
        requestId: "req-123",
        details: { field: "email" },
      },
    });
  });

  it("never retries a failed mutation", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError("offline"));
    vi.stubGlobal("fetch", fetchMock);
    await expect(
      request("/auth/logout", { method: "POST" }),
    ).rejects.toBeInstanceOf(ApiFailure);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
