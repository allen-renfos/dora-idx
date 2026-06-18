import axiosInstance from "../Api";

export interface AutocompleteSuggestion {
    category: string;
    value: string;
    label: string;
}

export const fetchAutocomplete = async (
    keyword: string,
    signal?: AbortSignal
): Promise<AutocompleteSuggestion[]> => {
    if (!keyword) return [];
    const response = await axiosInstance.get("/autocomplete", {
        params: { keyword },
        signal,
    });
    return response.data;
};
