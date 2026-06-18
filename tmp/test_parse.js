
const item = {
    mls_listingkey: "nwm12345",
    mls_list_agent: '["Leigh Zwicker", "Windermere RE Anacortes Prop.", "360-293-8008"]',
    list_office_name: "Original Office"
};

const getOfficeName = (item) => {
    if (item.mls_listingkey?.toLowerCase().startsWith("nwm")) {
        try {
            const agentData = JSON.parse(item.mls_list_agent || "[]");
            return agentData[1] || item.list_office_name || "N/A";
        } catch (e) {
            return item.list_office_name || "N/A";
        }
    }
    return item.list_office_name || "N/A";
};

console.log("Test 1 (NWMLS):", getOfficeName(item));

const item2 = {
    mls_listingkey: "nwm12345",
    mls_list_agent: 'not a json',
    list_office_name: "Original Office"
};
console.log("Test 2 (Invalid JSON):", getOfficeName(item2));

const item3 = {
    mls_listingkey: "other123",
    mls_list_agent: '["Leigh Zwicker", "Windermere RE Anacortes Prop.", "360-293-8008"]',
    list_office_name: "Original Office"
};
console.log("Test 3 (Non-NWMLS):", getOfficeName(item3));

const item4 = {
    mls_listingkey: "nwm123",
    mls_list_agent: '[]',
    list_office_name: "Original Office"
};
console.log("Test 4 (Empty Array):", getOfficeName(item4));
