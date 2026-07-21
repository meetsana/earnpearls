import { describe, expect, it, vi } from "vitest";

import { api } from "../api/endpoints";

function response(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

describe("canonical endpoint registry", () => {
  it("keeps the four canonical trailing-slash collection paths", async () => {
    const fetchMock = vi
      .fn()
      .mockImplementation(() => Promise.resolve(response([])));
    vi.stubGlobal("fetch", fetchMock);

    await api.dashboard();
    await api.wallet.summary();
    await api.surveys.list();
    await api.withdrawals.list();

    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      "/v1/dashboard/",
      "/v1/wallet/",
      "/v1/surveys/",
      "/v1/withdrawals/",
    ]);
  });

  it("encodes wallet cursor pagination without inventing a withdrawal cursor", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(response({ items: [], nextCursor: null }));
    vi.stubGlobal("fetch", fetchMock);
    await api.wallet.transactions({ cursor: "next/value=", limit: 25 });
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      "/v1/wallet/transactions?cursor=next%2Fvalue%3D&limit=25",
    );
  });
});
