import { describe, expect, it, vi } from "vitest";

vi.mock("@/services/Api", () => ({ default: { get: vi.fn() } }));

import { normalizeSearchMetadata } from "./SearchMetadataServices";

describe("normalizeSearchMetadata structure_types", () => {
  it("parses structure_types in backend order", () => {
    const meta = normalizeSearchMetadata({
      data: {
        structure_types: [
          { value: "House", label: "House" },
          { value: "Condominium", label: "Condominium" },
          { value: "Townhouse", label: "Townhouse" },
          { value: "Manufactured House", label: "Manufactured House" },
        ],
      },
    });
    expect(meta.structure_types.map((o) => o.value)).toEqual([
      "House",
      "Condominium",
      "Townhouse",
      "Manufactured House",
    ]);
  });

  it("returns [] when the group is missing or empty", () => {
    expect(normalizeSearchMetadata({ data: { property_types: ["Residential"] } }).structure_types).toEqual([]);
    expect(normalizeSearchMetadata({ data: { structure_types: [] } }).structure_types).toEqual([]);
  });
});
