/**
 * NWMLS Listing Broker attribution (MLS Grid IDX Rule 22, effective
 * Oct 15, 2026). Every NWMLS listing shows (rule text uses `:` and `;`;
 * the site displays the same parts as below):
 *
 *   Listing Broker [firm] | [broker] | [phone] | [email]
 *
 * The detail and list endpoints all send the same flat keys:
 *   office_name, agent_name, ListAgentPreferredPhone,
 *   ListAgentEmail, ListOfficeEmail, BuyerOfficeName (sold only).
 *
 * Eligibility is decided by the backend — never filter here, just render
 * what the API returns. Older cached responses may lack every key, in which
 * case nothing is rendered.
 */

export const LISTING_BROKER_SEPARATOR = " | ";

export interface ListingBroker {
  firm: string | null;
  broker: string | null;
  /** Display-formatted, e.g. `(425) 555-1234`. */
  phone: string | null;
  /** Agent email, falling back to the office email. */
  email: string | null;
  /** Non-empty parts in display order. */
  parts: string[];
  /** The full attribution line, e.g. `Listing Broker Firm | Broker | …`. */
  line: string;
  /** Buyer's brokerage firm — sold listings only, otherwise null. */
  buyerOffice: string | null;
  /** `Buyer's Brokerage …` — sold listings only, otherwise null. */
  buyerLine: string | null;
}

/** Trimmed string, or null for null/undefined/blank/non-string values. */
const clean = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

/**
 * Formats a raw feed phone (e.g. `425-761-8836`) as `(425) 761-8836`.
 * Anything that isn't a 10-digit US number (with optional leading 1) is
 * returned as sent rather than mangled.
 */
export const formatBrokerPhone = (raw: unknown): string | null => {
  const value = clean(raw);
  if (!value) return null;
  const digits = value.replace(/\D/g, "");
  const national =
    digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (national.length !== 10) return value;
  return `(${national.slice(0, 3)}) ${national.slice(3, 6)}-${national.slice(6)}`;
};

/** Digits suitable for a `tel:` href, or null. */
export const brokerPhoneHref = (phone: string | null): string | null => {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  return digits.length > 0 ? `tel:${digits}` : null;
};

/**
 * Builds the Listing Broker attribution for a listing (list or detail DTO).
 * Returns null when both firm and broker are missing — the line is hidden
 * rather than rendering a bare label.
 */
export const getListingBroker = (item: unknown): ListingBroker | null => {
  if (!item || typeof item !== "object") return null;
  const data = item as Record<string, unknown>;

  const firm = clean(data.office_name);
  const broker = clean(data.agent_name);
  if (!firm && !broker) return null;

  const phone = formatBrokerPhone(data.ListAgentPreferredPhone);
  const email = clean(data.ListAgentEmail) ?? clean(data.ListOfficeEmail);
  const parts = [firm, broker, phone, email].filter(
    (part): part is string => part !== null
  );
  const buyerOffice = clean(data.BuyerOfficeName);

  return {
    firm,
    broker,
    phone,
    email,
    parts,
    buyerOffice,
    line: `Listing Broker ${parts.join(LISTING_BROKER_SEPARATOR)}`,
    buyerLine: buyerOffice ? `Buyer's Brokerage ${buyerOffice}` : null,
  };
};
