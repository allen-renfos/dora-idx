// Fire-and-forget triggers for RIA's n8n automations. These never block the
// enquiry flow that's already succeeded server-side — a failed trigger here
// just means RIA doesn't pick up the showing automatically.

const SHOWING_PROPOSE_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_SHOWING_PROPOSE_WEBHOOK_URL;
const LEAD_INTAKE_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_LEAD_INTAKE_WEBHOOK_URL;

interface LeadIntakePayload {
  agent_id: string;
  name: string;
  email?: string | null;
  mobile?: string | null;
  whatsapp?: string | null;
  listing_id?: string | number | null;
  source?: string;
  sub_source?: string;
  category?: string | null;
  category_type?: string | null;
  listing_type?: string | null;
  min_price?: number | null;
  max_price?: number | null;
  min_bed?: number | null;
  max_bed?: number | null;
  budget?: number | null;
  timeline?: string | null;
  message?: string | null;
  source_url?: string;
  client_ip?: string;
}

export async function triggerLeadIntake(payload: LeadIntakePayload) {
  if (!LEAD_INTAKE_WEBHOOK_URL) return;
  // The workflow requires a name plus at least one of email/mobile to create a lead.
  if (!payload.agent_id || !payload.name || (!payload.email && !payload.mobile)) return;

  try {
    await fetch(LEAD_INTAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // best-effort only, see note above
  }
}

interface ShowingProposePayload {
  agent_id: string;
  lead_id?: string | number | null;
  listing_id?: string | number | null;
  building_id?: string | number | null;
  property_for?: string;
  preferred_from?: string;
  preferred_to?: string;
  initiated_by: "buyer" | "agent";
}

export async function triggerShowingPropose(payload: ShowingProposePayload) {
  if (!SHOWING_PROPOSE_WEBHOOK_URL) return;
  // lead_id isn't known until the enquiry is created backend-side; the caller
  // is expected to pull it from the enquiry response before calling this.
  if (!payload.agent_id || !payload.lead_id) return;

  try {
    await fetch(SHOWING_PROPOSE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // best-effort only, see note above
  }
}
