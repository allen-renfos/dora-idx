import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

const queryResult: { data: any; isLoading: boolean; error: unknown } = {
  data: undefined,
  isLoading: false,
  error: null,
};

vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "163187312" }),
  useRouter: () => ({ back: () => undefined, push: () => undefined }),
}));
vi.mock("next/link", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock("@/services/properties/PropertyQueries", () => ({
  usePropertyById: () => queryResult,
}));
vi.mock("@/services/properties/PropertyServices", () => ({
  recordPropertyVisit: async () => undefined,
}));
vi.mock("@/helpers/useCityInterestTracker", () => ({
  useCityInterestTracker: () => undefined,
}));
vi.mock("@/services/auth/authStorage", () => ({
  getAccessToken: () => null,
  getCustomerId: () => null,
}));
vi.mock("@/component/properties/SinglePropertyDetails", () => ({
  SinglePropertyDetails: () => "LISTING_DETAILS",
}));
vi.mock("@/component/properties/SinglePropertyImageSection", () => ({
  SinglePropertyImageSection: () => "LISTING_PHOTOS",
}));

import { SinglePropertyPage } from "./SinglePropertyPage";

const firstLook = (canDisplayListing: unknown) => ({
  data: {
    listing_key: "163187312",
    status: "First Look",
    mls_status: "first_look",
    tags: ["FIRST LOOK"],
    Days_On_Site: 0,
    compliance: {
      canDisplayListing,
      canShowAddress: true,
      canShowValuation: true,
      canShowMap: true,
      canShowPrimaryPhoto: true,
      canShowExtraPhotos: true,
      canShowVirtualTour: true,
    },
  },
});

const render = () => renderToStaticMarkup(<SinglePropertyPage />);

describe("SinglePropertyPage display gate", () => {
  beforeEach(() => {
    queryResult.data = undefined;
    queryResult.isLoading = false;
    queryResult.error = null;
  });

  it("renders the listing when canDisplayListing is true", () => {
    queryResult.data = firstLook(true);
    const html = render();
    expect(html).toContain("LISTING_DETAILS");
    expect(html).toContain("LISTING_PHOTOS");
    expect(html).not.toContain('data-testid="detail-error"');
  });

  it("renders DetailError when canDisplayListing is false (stale/cached payload)", () => {
    queryResult.data = firstLook(false);
    const html = render();
    expect(html).toContain('data-testid="detail-error"');
    expect(html).not.toContain("LISTING_DETAILS");
    expect(html).not.toContain("LISTING_PHOTOS");
  });

  it("renders DetailError for First Look with no explicit consent flag", () => {
    queryResult.data = firstLook(undefined);
    expect(render()).toContain('data-testid="detail-error"');
  });

  it("renders DetailError when the API returns an error (404)", () => {
    queryResult.error = new Error("Listing not found");
    expect(render()).toContain('data-testid="detail-error"');
  });
});
