/**
 * MLS data is synced every 15 minutes. The API does not report the actual
 * sync time, so the disclaimer shows the most recent 15-minute sync slot at
 * or before the visit (e.g. a visit at 3:22 PM reads 3:15 PM). Prefer a real
 * API timestamp whenever one is available.
 */
export const MLS_SYNC_INTERVAL_MS = 15 * 60 * 1000;

export const lastSyncSlot = (now: Date = new Date()): Date =>
  new Date(Math.floor(now.getTime() / MLS_SYNC_INTERVAL_MS) * MLS_SYNC_INTERVAL_MS);
