import { describe, expect, it } from "vitest";
import {
  canDisplayListing,
  filterDisplayableListings,
  isFirstLookListing,
} from "./listingDisplay";

const allowed = {
  canDisplayListing: true,
  canShowAddress: true,
  canShowValuation: true,
  canShowMap: true,
  canShowPrimaryPhoto: true,
  canShowExtraPhotos: true,
  canShowVirtualTour: true,
};

// Shapes mirror the live API: the list DTO sends mls_status "First Look",
// the detail DTO sends the slug "first_look".
const firstLookListItem = {
  status: "First Look",
  mls_status: "First Look",
  tags: ["OPEN HOUSE", "FIRST LOOK"],
  Days_On_Site: 0,
  compliance: allowed,
};
const firstLookDetail = {
  status: "First Look",
  mls_status: "first_look",
  property_status: "First Look",
  tags: ["FIRST LOOK"],
  Days_On_Site: 0,
  compliance: allowed,
};
const activeItem = {
  status: "Active",
  mls_status: "Active",
  tags: ["ACTIVE"],
  compliance: allowed,
};

describe("isFirstLookListing", () => {
  it("detects the list DTO label and the detail DTO slug", () => {
    expect(isFirstLookListing(firstLookListItem)).toBe(true);
    expect(isFirstLookListing(firstLookDetail)).toBe(true);
  });

  it("detects First Look from tags or legacy status fields alone", () => {
    expect(isFirstLookListing({ tags: ["first look"] })).toBe(true);
    expect(isFirstLookListing({ MlsStatus: "FIRST-LOOK" })).toBe(true);
    expect(isFirstLookListing({ property_status: " First Look " })).toBe(true);
  });

  it("is false for other statuses and junk input", () => {
    expect(isFirstLookListing(activeItem)).toBe(false);
    expect(isFirstLookListing({ status: "Pending", tags: ["PENDING"] })).toBe(false);
    expect(isFirstLookListing(null)).toBe(false);
    expect(isFirstLookListing("First Look")).toBe(false);
    expect(isFirstLookListing({ tags: "FIRST LOOK" })).toBe(false);
  });
});

describe("canDisplayListing", () => {
  it("shows opted-in First Look and ordinary listings", () => {
    expect(canDisplayListing(firstLookListItem)).toBe(true);
    expect(canDisplayListing(firstLookDetail)).toBe(true);
    expect(canDisplayListing(activeItem)).toBe(true);
  });

  it("hides any listing whose canDisplayListing is explicitly false", () => {
    for (const flag of [false, 0, "false", "0", "no", "N"]) {
      const c = { ...allowed, canDisplayListing: flag };
      expect(canDisplayListing({ ...activeItem, compliance: c })).toBe(false);
      expect(canDisplayListing({ ...firstLookDetail, compliance: c })).toBe(false);
    }
  });

  it("fails closed for First Look without an explicit true", () => {
    const { compliance: _omit, ...noCompliance } = firstLookDetail;
    expect(canDisplayListing(noCompliance)).toBe(false);
    expect(canDisplayListing({ ...firstLookDetail, compliance: null })).toBe(false);
    expect(canDisplayListing({ ...firstLookDetail, compliance: {} })).toBe(false);
    expect(
      canDisplayListing({ ...firstLookDetail, compliance: { canDisplayListing: "maybe" } })
    ).toBe(false);
  });

  it("keeps legacy non-First-Look payloads without compliance displayable", () => {
    expect(canDisplayListing({ status: "Active", tags: ["ACTIVE"] })).toBe(true);
  });

  it("accepts string/number true values", () => {
    for (const flag of [true, 1, "true", "1", "yes"]) {
      const c = { ...allowed, canDisplayListing: flag };
      expect(canDisplayListing({ ...firstLookDetail, compliance: c })).toBe(true);
    }
  });

  it("rejects non-objects", () => {
    expect(canDisplayListing(null)).toBe(false);
    expect(canDisplayListing(undefined)).toBe(false);
    expect(canDisplayListing("x")).toBe(false);
  });
});

describe("filterDisplayableListings", () => {
  it("drops non-displayable rows and tolerates missing input", () => {
    const revoked = {
      ...firstLookListItem,
      compliance: { ...allowed, canDisplayListing: false },
    };
    expect(filterDisplayableListings([activeItem, revoked, firstLookListItem])).toEqual([
      activeItem,
      firstLookListItem,
    ]);
    expect(filterDisplayableListings(null)).toEqual([]);
    expect(filterDisplayableListings(undefined)).toEqual([]);
  });
});
