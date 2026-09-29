import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { formatBrokerPhone, getListingBroker } from "./listingBroker";
import { ListingBrokerAttribution } from "@/component/sharable/ListingBrokerAttribution";

const full = {
  office_name: "Windermere Real Estate",
  agent_name: "John Smith",
  ListAgentPreferredPhone: "425-555-1234",
  ListAgentEmail: "john@example.com",
  ListOfficeEmail: "office@example.com",
  BuyerOfficeName: null,
};

const textOf = (item: unknown, variant?: "inline" | "sidebar") =>
  renderToStaticMarkup(createElement(ListingBrokerAttribution, { item, variant }))
    .replace(/<[^>]+>/g, "")
    .replace(/&#x27;/g, "'");

describe("getListingBroker", () => {
  it("builds the full line when every field is present", () => {
    expect(getListingBroker(full)?.line).toBe(
      "Listing Broker Windermere Real Estate | John Smith | (425) 555-1234 | john@example.com"
    );
  });

  it("omits a null phone", () => {
    expect(getListingBroker({ ...full, ListAgentPreferredPhone: null })?.line).toBe(
      "Listing Broker Windermere Real Estate | John Smith | john@example.com"
    );
  });

  it("omits the email when both emails are null", () => {
    expect(
      getListingBroker({ ...full, ListAgentEmail: null, ListOfficeEmail: null })?.line
    ).toBe("Listing Broker Windermere Real Estate | John Smith | (425) 555-1234");
  });

  it("falls back to the office email", () => {
    expect(getListingBroker({ ...full, ListAgentEmail: null })?.email).toBe(
      "office@example.com"
    );
  });

  it("shows only firm and broker when phone and emails are missing", () => {
    expect(
      getListingBroker({
        ...full,
        ListAgentPreferredPhone: null,
        ListAgentEmail: undefined,
        ListOfficeEmail: "   ",
      })?.line
    ).toBe("Listing Broker Windermere Real Estate | John Smith");
  });

  it("treats whitespace-only values as missing (no empty/doubled separators)", () => {
    expect(getListingBroker({ ...full, agent_name: "  " })?.line).toBe(
      "Listing Broker Windermere Real Estate | (425) 555-1234 | john@example.com"
    );
  });

  it("hides the line when firm and broker are both missing", () => {
    expect(getListingBroker({ ...full, office_name: null, agent_name: "" })).toBeNull();
  });

  it("returns null for older responses without the new keys", () => {
    expect(getListingBroker({ id: 1, listed_with: "Compass" })).toBeNull();
    expect(getListingBroker(undefined)).toBeNull();
  });

  it("adds the buyer's brokerage line only when present", () => {
    expect(getListingBroker(full)?.buyerLine).toBeNull();
    expect(getListingBroker({ ...full, BuyerOfficeName: "Compass" })?.buyerLine).toBe(
      "Buyer's Brokerage Compass"
    );
  });
});

describe("formatBrokerPhone", () => {
  it("formats 10- and 11-digit US numbers", () => {
    expect(formatBrokerPhone("425-761-8836")).toBe("(425) 761-8836");
    expect(formatBrokerPhone("+1 425.761.8836")).toBe("(425) 761-8836");
  });

  it("leaves unrecognized numbers as sent", () => {
    expect(formatBrokerPhone("425-761-8836 x12")).toBe("425-761-8836 x12");
    expect(formatBrokerPhone(" ")).toBeNull();
  });
});

describe("ListingBrokerAttribution", () => {
  it.each(["inline", "sidebar"] as const)(
    "renders bar-separated text with no bar at a line end (%s)",
    (variant) => {
      expect(textOf(full, variant).replace(/\u00a0|&nbsp;/g, " ")).toBe(
        "Listing Broker Windermere Real Estate | John Smith (425) 555-1234 | john@example.com"
      );
    }
  );

  it("renders firm | broker alone when phone and emails are missing", () => {
    expect(
      textOf({ ...full, ListAgentPreferredPhone: null, ListAgentEmail: null, ListOfficeEmail: null })
    ).toBe("Listing Broker Windermere Real Estate | John Smith");
  });

  it("renders the buyer's brokerage as a second line", () => {
    expect(textOf({ ...full, BuyerOfficeName: "Compass" })).toContain(
      "Buyer's Brokerage Compass"
    );
    expect(textOf(full)).not.toContain("Buyer's Brokerage");
  });

  it("renders nothing without firm and broker", () => {
    expect(textOf({ listed_with: "Compass" }, "sidebar")).toBe("");
  });
});
