import { beforeEach, describe, expect, it, vi } from "vitest";

const get = vi.fn();
vi.mock("@/services/Api", () => ({ default: { get: (...a: unknown[]) => get(...a) } }));
vi.mock("@/services/auth/authStorage", () => ({ getCustomerId: () => null }));

import { fetchMlsSearchPropertyList } from "./PropertyServices";
import {
  DEFAULT_PROPERTY_STATUS,
  isDefaultPropertyStatus,
  splitStatuses,
} from "@/component/mlsSearchMenu/filterDefaults";

const statusOf = (url: string) =>
  decodeURIComponent(/search\[property_status\]=([^&]*)/.exec(url)?.[1] ?? "");

const params = (property_status: string) => ({
  property_status,
  property_type: "",
  pageLimit: 2,
  page: 1,
});

describe("status filter defaults", () => {
  it("defaults to Active plus Coming Soon (NWMLS First Look)", () => {
    expect(splitStatuses(DEFAULT_PROPERTY_STATUS)).toEqual(["Active", "Coming Soon"]);
  });

  it("recognizes the default regardless of order/spacing", () => {
    expect(isDefaultPropertyStatus("Coming Soon | Active")).toBe(true);
    expect(isDefaultPropertyStatus("Active")).toBe(false);
    expect(isDefaultPropertyStatus("")).toBe(false);
  });
});

describe("fetchMlsSearchPropertyList status fan-out", () => {
  beforeEach(() => {
    get.mockReset();
  });

  it("sends a single status as-is in one request", async () => {
    get.mockResolvedValue({ data: { data: [{ listing_key: "1" }], meta: { has_more: false } } });
    const res = await fetchMlsSearchPropertyList(params("Active"));
    expect(get).toHaveBeenCalledTimes(1);
    expect(statusOf(get.mock.calls[0][0])).toBe("Active");
    expect(res.data).toHaveLength(1);
  });

  it("issues one request per status and merges, never a pipe-joined status", async () => {
    get.mockImplementation(async (url: string) => {
      const s = statusOf(url);
      if (s === "Active")
        return { data: { data: [{ listing_key: "a1" }, { listing_key: "dup" }], meta: { has_more: true } } };
      if (s === "Coming Soon")
        return { data: { data: [{ listing_key: "f1" }, { listing_key: "dup" }], meta: { has_more: false } } };
      throw new Error(`unexpected status ${s}`);
    });

    const res = await fetchMlsSearchPropertyList(params("Active|Coming Soon"));

    expect(get).toHaveBeenCalledTimes(2);
    expect(get.mock.calls.map((c) => statusOf(c[0])).sort()).toEqual(["Active", "Coming Soon"]);
    expect(res.data.map((d: any) => d.listing_key)).toEqual(["a1", "dup", "f1"]);
    expect(res.meta.has_more).toBe(true);
  });

  it("stops paginating when every status is exhausted", async () => {
    get.mockResolvedValue({ data: { data: [{ listing_key: "x" }], meta: { has_more: false } } });
    const res = await fetchMlsSearchPropertyList(params("Active|Coming Soon"));
    expect(res.meta.has_more).toBe(false);
  });
});
