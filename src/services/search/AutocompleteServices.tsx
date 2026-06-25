import axios from "axios";
import axiosInstance from "../Api";

// Minimum keyword length the backend will act on. Below this the server
// returns [] anyway, so we short-circuit on the client and never fire a request.
export const AUTOCOMPLETE_MIN_CHARS = 2;

// Category values returned by GET /api/autocomplete. `type` mirrors `category`
// for backwards compatibility.
export type AutocompleteCategory =
    | "city"
    | "zip"
    | "address"
    | "listing"
    | "property_type"
    | "status";

export interface AutocompleteSuggestion {
    category: AutocompleteCategory;
    // Back-compat duplicate of `category`. May be absent on older payloads.
    type?: AutocompleteCategory;
    // Canonical string to act on (address / zip / MLS # / city ...).
    value: string;
    // Human-readable display string.
    label: string;
    match?: "exact" | "prefix" | "contains";
    source?: "listing" | "lookup";
    metadata?: Record<string, unknown>;
}

/**
 * Fetch ranked autocomplete suggestions for a keyword.
 *
 * - Trims the keyword and returns [] immediately below the 2-char minimum.
 * - Scopes results to the agent via `lagnt` (NEXT_PUBLIC_REALTY_PRO_AGENT_ID)
 *   when present — without it the server falls back to a union scope.
 * - Preserves the server's deterministic ranking (no client re-sort here).
 * - Treats aborted/cancelled requests and any error (429/500/network) as a
 *   non-throwing empty array so the search box never breaks.
 */
export const fetchAutocomplete = async (
    keyword: string,
    signal?: AbortSignal
): Promise<AutocompleteSuggestion[]> => {
    const trimmed = keyword.trim();
    if (trimmed.length < AUTOCOMPLETE_MIN_CHARS) return [];

    const lagnt = process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID;

    try {
        const response = await axiosInstance.get("/autocomplete", {
            params: {
                keyword: trimmed,
                ...(lagnt ? { lagnt } : {}),
            },
            signal,
        });
        // Backend returns a flat JSON array (not wrapped in { data }).
        return Array.isArray(response.data) ? response.data : [];
    } catch (err: any) {
        // Aborted/cancelled keystrokes and any non-2xx (429/500/network) degrade
        // silently to "no suggestions" — never surface an error to the user.
        if (
            axios.isCancel?.(err) ||
            err?.name === "CanceledError" ||
            err?.name === "AbortError"
        ) {
            return [];
        }
        return [];
    }
};

/**
 * Group suggestions by category while preserving the server's ranking order.
 *
 * The first time a category is seen fixes that group's position (cross-group
 * order), and items are appended in arrival order within each group. Duplicate
 * labels within a category are dropped. No re-sorting is applied.
 */
export const groupAutocompleteSuggestions = (
    suggestions: AutocompleteSuggestion[]
): [string, AutocompleteSuggestion[]][] => {
    const groups = new Map<string, AutocompleteSuggestion[]>();
    for (const suggestion of suggestions) {
        const key = suggestion.category;
        const bucket = groups.get(key);
        if (!bucket) {
            groups.set(key, [suggestion]);
            continue;
        }
        const dup = bucket.some(
            (s) => s.label.toLowerCase() === suggestion.label.toLowerCase()
        );
        if (!dup) bucket.push(suggestion);
    }
    return Array.from(groups.entries());
};
