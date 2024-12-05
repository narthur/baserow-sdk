import { describe, it, expect, beforeEach } from "vitest";
import { MAX_REQUESTS_COUNT, INTERVAL_MS, Interceptors } from "./interceptors.js";

describe("Request Interceptor", () => {
  let interceptors: Interceptors;

  beforeEach(() => {
    interceptors = new Interceptors();
  });

  it("limits concurrency", async () => {
    const promises = Array.from({ length: MAX_REQUESTS_COUNT + 1 }, () =>
      interceptors.onRequest({} as any),
    );

    await expect(() => {
      const all = Promise.all(promises);
      return Promise.race([
        all,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error()), INTERVAL_MS * 2),
        ),
      ]);
    }).rejects.toThrow();
  });

  it("resolves all promises", async () => {
    const promises = Array.from({ length: MAX_REQUESTS_COUNT + 1 }, () =>
      interceptors.onRequest({} as any),
    );

    await new Promise<void>((resolve) => setTimeout(resolve, INTERVAL_MS));

    Array.from({ length: MAX_REQUESTS_COUNT + 1 }, () =>
      interceptors.onResponse({} as any),
    ).forEach(() => void 0);

    await Promise.all(promises);
  });

  it("stringifys the filters", async () => {
    const config = await interceptors.onRequest({
      params: { filters: { id: 1 } },
    } as any);

    expect(config.params).toEqual(
      expect.objectContaining({ filters: '{"id":1}' }),
    );
  });
});
